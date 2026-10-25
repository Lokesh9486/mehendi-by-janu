import path from "node:path";

/**
 * Everything that must survive a server restart lives in one folder on the
 * backend machine: the SQLite database and the uploaded gallery files.
 *
 * Default: <project>/.data  (git-ignored)
 * Override: MEHANDI_DATA_DIR=/absolute/path/to/storage
 */
export const DATA_DIR =
  process.env.MEHANDI_DATA_DIR?.trim() || path.join(process.cwd(), ".data");

export const DATABASE_FILE = path.join(DATA_DIR, "mehandi.db");

export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

/** Seed credentials used the first time the database is created. */
export const DEFAULT_ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.trim().toLowerCase() || "janu@mehandi.com";

export const DEFAULT_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD?.trim() || "admin@123";

/** How long a login stays valid. A newer login invalidates the old one. */
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export const ADMIN_COOKIE_NAME = "mehandi_admin_session";
