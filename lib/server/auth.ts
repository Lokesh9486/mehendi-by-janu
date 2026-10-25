import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  SESSION_TTL_MS,
} from "@/lib/server/config";
import {
  clearSession,
  getAdminUser,
  hasPersistentStorage,
  savePassword,
  saveSession,
  type AdminRecord,
} from "@/lib/server/db";
import { hashPassword, verifyPassword } from "@/lib/server/password";

export type AdminSession = {
  email: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<AdminRecord | null> {
  if (!hasPersistentStorage()) {
    throw new Error("Persistent storage is unavailable on this host.");
  }

  const admin = getAdminUser();
  if (!admin) return null;

  if (email.trim().toLowerCase() !== admin.email.toLowerCase()) return null;
  if (!verifyPassword(password, admin.passwordSalt, admin.passwordHash)) {
    return null;
  }

  return admin;
}

/**
 * Creates the one and only valid session. Writing the new token hash to the
 * single admin row is what makes a second login kick the first one out.
 */
export async function startSession(): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + SESSION_TTL_MS;

  saveSession(hashToken(token), expiresAt);

  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!hasPersistentStorage()) return null;

  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) return null;

  const admin = getAdminUser();

  if (!admin?.sessionTokenHash || !admin.sessionExpiresAt) return null;
  if (admin.sessionExpiresAt <= Date.now()) return null;

  const provided = Buffer.from(hashToken(token), "hex");
  const stored = Buffer.from(admin.sessionTokenHash, "hex");

  if (
    provided.length !== stored.length ||
    !timingSafeEqual(provided, stored)
  ) {
    return null;
  }

  return { email: admin.email };
}

export async function endSession(): Promise<void> {
  clearSession();

  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}

export type PasswordChangeResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<PasswordChangeResult> {
  const admin = getAdminUser();
  if (!admin) {
    return { ok: false, error: "Admin account not found.", status: 500 };
  }

  if (
    !verifyPassword(currentPassword, admin.passwordSalt, admin.passwordHash)
  ) {
    return { ok: false, error: "Current password is incorrect.", status: 400 };
  }

  if (newPassword.length < 8) {
    return {
      ok: false,
      error: "New password must be at least 8 characters long.",
      status: 400,
    };
  }

  if (newPassword.length > 128) {
    return {
      ok: false,
      error: "New password is too long.",
      status: 400,
    };
  }

  if (newPassword === currentPassword) {
    return {
      ok: false,
      error: "New password must be different from the current password.",
      status: 400,
    };
  }

  const { hash, salt } = hashPassword(newPassword);
  savePassword(hash, salt);

  // Rotate the session so the cookie never outlives a credential change.
  await startSession();

  return { ok: true };
}
