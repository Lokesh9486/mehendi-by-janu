import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return { salt, hash };
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
) {
  const derived = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(expectedHash, "hex");

  if (expected.length !== derived.length) return false;

  return timingSafeEqual(derived, expected);
}
