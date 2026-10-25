import { changeAdminPassword, getAdminSession } from "@/lib/server/auth";
import {
  decryptSecureEnvelope,
  SecurePayloadError,
  type SecureEnvelope,
} from "@/lib/server/secure-payload";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return Response.json(
      { error: "Your session has ended. Please sign in again." },
      { status: 401 },
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

  const currentPassword =
    typeof payload.currentPassword === "string" ? payload.currentPassword : "";
  const newPassword =
    typeof payload.newPassword === "string" ? payload.newPassword : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    return Response.json(
      { error: "All password fields are required." },
      { status: 400 },
    );
  }

  if (newPassword !== confirmPassword) {
    return Response.json(
      { error: "New password and confirmation do not match." },
      { status: 400 },
    );
  }

  const result = await changeAdminPassword(currentPassword, newPassword);

  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json({ ok: true });
}
