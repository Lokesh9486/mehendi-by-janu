import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import {
  DATA_DIR,
  DATABASE_FILE,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  UPLOADS_DIR,
} from "@/lib/server/config";
import { hashPassword } from "@/lib/server/password";
import { builtInGalleryItems } from "@/lib/server/gallery-seed";
import { siteConfig } from "@/lib/siteConfig";

export type AdminRecord = {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  sessionTokenHash: string | null;
  sessionExpiresAt: number | null;
};

export type GalleryRecord = {
  id: string;
  title: string;
  description: string;
  category: string;
  /** Public URL: an /api/gallery/image/... file or a built-in /images/... file. */
  imagePath: string;
  /** Present only for images uploaded through the admin screen. */
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  isIllustrative: boolean;
  createdAt: number;
};

export type SiteContactRecord = {
  phoneNumber: string;
  whatsappNumber: string;
  instagramUrl: string;
  updatedAt: number;
};

/**
 * Bump when the schema changes. Fast Refresh keeps globalThis alive, so a
 * dev server can still be holding a handle opened against the previous
 * schema; comparing this version re-runs the idempotent migrations instead of
 * failing with "no such column".
 */
const SCHEMA_VERSION = 3;

/**
 * Kept on globalThis so Fast Refresh / route module reloads reuse one handle
 * instead of opening the database file repeatedly.
 */
const globalForDb = globalThis as typeof globalThis & {
  __mehandiDb?: DatabaseSync;
  __mehandiDbSchema?: number;
};

const GALLERY_TABLE = `
  CREATE TABLE IF NOT EXISTS gallery_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'Other',
    image_path TEXT NOT NULL,
    file_name TEXT UNIQUE,
    mime_type TEXT,
    size_bytes INTEGER,
    is_illustrative INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`;

function upgradeGalleryTable(db: DatabaseSync) {
  // Version 1 stored every row as an uploaded file. Keep those rows and give
  // them a public URL before swapping in the new table shape.
  db.exec("BEGIN IMMEDIATE");

  try {
    db.exec(`
      CREATE TABLE gallery_items_v2 (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'Other',
        image_path TEXT NOT NULL,
        file_name TEXT UNIQUE,
        mime_type TEXT,
        size_bytes INTEGER,
        is_illustrative INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      INSERT INTO gallery_items_v2
        (id, title, description, category, image_path,
         file_name, mime_type, size_bytes, is_illustrative, created_at)
      SELECT id, title, description, 'Other',
             '/api/gallery/image/' || file_name,
             file_name, mime_type, size_bytes, 0, created_at
        FROM gallery_items;
    `);

    db.exec("DROP TABLE gallery_items");
    db.exec("ALTER TABLE gallery_items_v2 RENAME TO gallery_items");
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_user (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      session_token_hash TEXT,
      session_expires_at INTEGER,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_contact (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      phone_number TEXT NOT NULL DEFAULT '',
      whatsapp_number TEXT NOT NULL DEFAULT '',
      instagram_url TEXT NOT NULL DEFAULT '',
      updated_at INTEGER NOT NULL
    );
  `);

  const columns = db
    .prepare("PRAGMA table_info(gallery_items)")
    .all()
    .map((column) => String(column.name));

  if (columns.length === 0) {
    db.exec(GALLERY_TABLE);
  } else if (!columns.includes("image_path")) {
    upgradeGalleryTable(db);
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS gallery_items_created_at
      ON gallery_items (created_at DESC);
  `);
}

function seedAdmin(db: DatabaseSync) {
  const existing = db
    .prepare("SELECT id FROM admin_user WHERE id = 1")
    .get();

  if (existing) return;

  const { salt, hash } = hashPassword(DEFAULT_ADMIN_PASSWORD);

  db.prepare(
    `INSERT INTO admin_user
       (id, email, password_hash, password_salt, session_token_hash, session_expires_at, updated_at)
     VALUES (1, ?, ?, ?, NULL, NULL, ?)`,
  ).run(
    DEFAULT_ADMIN_EMAIL,
    hash,
    salt,
    Date.now(),
  );
}

function seedGallery(db: DatabaseSync) {
  const seeded = db
    .prepare("SELECT value FROM app_meta WHERE key = 'gallery_seed'")
    .get();

  if (seeded) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO gallery_items
      (id, title, description, category, image_path,
       file_name, mime_type, size_bytes, is_illustrative, created_at)
    VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, 1, ?)
  `);

  db.exec("BEGIN IMMEDIATE");

  try {
    for (const item of builtInGalleryItems()) {
      insert.run(
        item.id,
        item.title,
        item.description,
        item.category,
        item.imagePath,
        item.createdAt,
      );
    }

    db.prepare(
      "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('gallery_seed', '1')",
    ).run();

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function seedSiteContact(db: DatabaseSync) {
  const existing = db
    .prepare("SELECT id FROM site_contact WHERE id = 1")
    .get();

  if (existing) return;

  db.prepare(
    `INSERT INTO site_contact
       (id, phone_number, whatsapp_number, instagram_url, updated_at)
     VALUES (1, ?, ?, ?, ?)`,
  ).run(
    siteConfig.phoneNumber.trim(),
    siteConfig.whatsappNumber.replace(/\D/g, ""),
    siteConfig.instagramUrl.trim(),
    0,
  );
}

export function getDb() {
  const existing = globalForDb.__mehandiDb;

  if (existing) {
    if (globalForDb.__mehandiDbSchema === SCHEMA_VERSION) return existing;

    // Hot reload after a schema change: upgrade the live handle in place.
    migrate(existing);
    seedAdmin(existing);
    seedGallery(existing);
    seedSiteContact(existing);
    globalForDb.__mehandiDbSchema = SCHEMA_VERSION;

    return existing;
  }

  mkdirSync(/*turbopackIgnore: true*/ UPLOADS_DIR, { recursive: true });

  const db = new DatabaseSync(/*turbopackIgnore: true*/ DATABASE_FILE);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  migrate(db);
  seedAdmin(db);
  seedGallery(db);
  seedSiteContact(db);

  globalForDb.__mehandiDb = db;
  globalForDb.__mehandiDbSchema = SCHEMA_VERSION;

  return db;
}

export function getDataDir() {
  mkdirSync(/*turbopackIgnore: true*/ DATA_DIR, { recursive: true });
  return DATA_DIR;
}

/* -------------------------------------------------------------------------- */
/*                                  Admin user                                */
/* -------------------------------------------------------------------------- */

export function getAdminUser(): AdminRecord | null {
  const row = getDb()
    .prepare(
      `SELECT email, password_hash, password_salt, session_token_hash, session_expires_at
         FROM admin_user
        WHERE id = 1`,
    )
    .get();

  if (!row) return null;

  return {
    email: String(row.email),
    passwordHash: String(row.password_hash),
    passwordSalt: String(row.password_salt),
    sessionTokenHash: row.session_token_hash
      ? String(row.session_token_hash)
      : null,
    sessionExpiresAt:
      row.session_expires_at === null || row.session_expires_at === undefined
        ? null
        : Number(row.session_expires_at),
  };
}

export function savePassword(hash: string, salt: string) {
  getDb()
    .prepare(
      `UPDATE admin_user
          SET password_hash = ?, password_salt = ?, updated_at = ?
        WHERE id = 1`,
    )
    .run(hash, salt, Date.now());
}

export function saveSession(tokenHash: string, expiresAt: number) {
  getDb()
    .prepare(
      `UPDATE admin_user
          SET session_token_hash = ?, session_expires_at = ?, updated_at = ?
        WHERE id = 1`,
    )
    .run(tokenHash, expiresAt, Date.now());
}

export function clearSession() {
  getDb()
    .prepare(
      `UPDATE admin_user
          SET session_token_hash = NULL, session_expires_at = NULL, updated_at = ?
        WHERE id = 1`,
    )
    .run(Date.now());
}

/* -------------------------------------------------------------------------- */
/*                                   Gallery                                  */
/* -------------------------------------------------------------------------- */

const GALLERY_COLUMNS = `
  id, title, description, category, image_path, file_name,
  mime_type, size_bytes, is_illustrative, created_at
`;

function toGalleryRecord(row: Record<string, unknown>): GalleryRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ""),
    category: String(row.category ?? "Other"),
    imagePath: String(row.image_path),
    fileName: row.file_name === null ? null : String(row.file_name),
    mimeType: row.mime_type === null ? null : String(row.mime_type),
    sizeBytes:
      row.size_bytes === null || row.size_bytes === undefined
        ? null
        : Number(row.size_bytes),
    isIllustrative: Number(row.is_illustrative) === 1,
    createdAt: Number(row.created_at),
  };
}

export function listGalleryRecords(limit?: number): GalleryRecord[] {
  const statement = getDb().prepare(
    `SELECT ${GALLERY_COLUMNS}
       FROM gallery_items
      ORDER BY created_at DESC, rowid DESC
      ${typeof limit === "number" ? "LIMIT ?" : ""}`,
  );

  const rows =
    typeof limit === "number" ? statement.all(limit) : statement.all();

  return rows.map(toGalleryRecord);
}

export function getGalleryRecord(id: string): GalleryRecord | null {
  const row = getDb()
    .prepare(
      `SELECT ${GALLERY_COLUMNS}
         FROM gallery_items
        WHERE id = ?`,
    )
    .get(id);

  return row ? toGalleryRecord(row) : null;
}

export function insertGalleryRecord(record: {
  id: string;
  title: string;
  description: string;
  category: string;
  imagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: number;
}) {
  getDb()
    .prepare(
      `INSERT INTO gallery_items
         (id, title, description, category, image_path,
          file_name, mime_type, size_bytes, is_illustrative, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    )
    .run(
      record.id,
      record.title,
      record.description,
      record.category,
      record.imagePath,
      record.fileName,
      record.mimeType,
      record.sizeBytes,
      record.createdAt,
    );
}

export function updateGalleryDetails(
  id: string,
  title: string,
  description: string,
  category: string,
) {
  getDb()
    .prepare(
      `UPDATE gallery_items
          SET title = ?, description = ?, category = ?
        WHERE id = ?`,
    )
    .run(title, description, category, id);
}

export function updateGalleryImage(
  id: string,
  image: {
    imagePath: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    isIllustrative: boolean;
  },
) {
  getDb()
    .prepare(
      `UPDATE gallery_items
          SET image_path = ?, file_name = ?, mime_type = ?, size_bytes = ?,
              is_illustrative = ?
        WHERE id = ?`,
    )
    .run(
      image.imagePath,
      image.fileName,
      image.mimeType,
      image.sizeBytes,
      image.isIllustrative ? 1 : 0,
      id,
    );
}

export function deleteGalleryRecord(id: string) {
  getDb().prepare("DELETE FROM gallery_items WHERE id = ?").run(id);
}

/* -------------------------------------------------------------------------- */
/*                                Site contact                                */
/* -------------------------------------------------------------------------- */

export function getSiteContactRecord(): SiteContactRecord {
  const row = getDb()
    .prepare(
      `SELECT phone_number, whatsapp_number, instagram_url, updated_at
         FROM site_contact
        WHERE id = 1`,
    )
    .get();

  if (!row) {
    return {
      phoneNumber: "",
      whatsappNumber: "",
      instagramUrl: "",
      updatedAt: 0,
    };
  }

  return {
    phoneNumber: String(row.phone_number ?? ""),
    whatsappNumber: String(row.whatsapp_number ?? ""),
    instagramUrl: String(row.instagram_url ?? ""),
    updatedAt: Number(row.updated_at ?? 0),
  };
}

export function saveSiteContactRecord(contact: {
  phoneNumber: string;
  whatsappNumber: string;
  instagramUrl: string;
}): SiteContactRecord {
  const updatedAt = Date.now();

  getDb()
    .prepare(
      `INSERT INTO site_contact
         (id, phone_number, whatsapp_number, instagram_url, updated_at)
       VALUES (1, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         phone_number = excluded.phone_number,
         whatsapp_number = excluded.whatsapp_number,
         instagram_url = excluded.instagram_url,
         updated_at = excluded.updated_at`,
    )
    .run(
      contact.phoneNumber,
      contact.whatsappNumber,
      contact.instagramUrl,
      updatedAt,
    );

  return { ...contact, updatedAt };
}
