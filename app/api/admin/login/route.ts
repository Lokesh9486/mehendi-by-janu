import { startSession, verifyCredentials } from "@/lib/server/auth";
import { hasPersistentStorage } from "@/lib/server/db";
import {
  decryptSecureEnvelope,
  SecurePayloadError,
  type SecureEnvelope,
} from "@/lib/server/secure-payload";
import {
  consumeAttempt,
  requestFingerprint,
  resetAttempts,
} from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  if (!hasPersistentStorage()) {
    return Response.json(
      {
        error:
          "The admin studio needs a server with a persistent disk. This deployment is read-only, but the public site is still online.",
      },
      { status: 503 },
    );
  }

  const fingerprint = requestFingerprint(request);
  const attempt = consumeAttempt(`login:${fingerprint}`);

  if (!attempt.allowed) {
    return Response.json(
      {
        error: `Too many login attempts. Try again in ${attempt.retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(attempt.retryAfterSeconds) },
      },
    );
  }

  let envelope: unknown = null;

  try {
    envelope = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  let payload: Record<string, unknown>;

  try {
    payload = decryptSecureEnvelope(envelope as SecureEnvelope);
  } catch (error) {
    if (error instanceof SecurePayloadError) {
      const status = error.code === "stale_key" ? 428 : 400;
      return Response.json(
        { error: error.message, code: error.code },
        { status },
      );
    }

    return Response.json(
      { error: "The encrypted payload could not be read. Please try again." },
      { status: 400 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email.trim() || !password) {
    return Response.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const admin = await verifyCredentials(email, password);

  if (!admin) {
    return Response.json(
      { error: "Incorrect email or password." },
      { status: 401 },
    );
  }

  const replacedOtherSession = Boolean(admin.sessionTokenHash);

  await startSession();
  resetAttempts(`login:${fingerprint}`);

  return Response.json({
    ok: true,
    email: admin.email,
    replacedOtherSession,
  });
}
