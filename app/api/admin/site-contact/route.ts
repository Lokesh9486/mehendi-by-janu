import { getAdminSession } from "@/lib/server/auth";
import {
  getSiteContact,
  saveSiteContact,
} from "@/lib/server/site-contact";
import { validateSiteContact } from "@/lib/site-contact";

const unauthorized = () =>
  Response.json(
    { error: "Your session has ended. Please sign in again." },
    { status: 401 },
  );

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  return Response.json(
    { contact: getSiteContact() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "The contact details could not be read. Please try again." },
      { status: 400 },
    );
  }

  const input =
    body && typeof body === "object"
      ? (body as Record<string, unknown>)
      : {};

  const validation = validateSiteContact(input);

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    const contact = saveSiteContact(validation.value);

    return Response.json(
      { contact },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to save contact details", error);
    return Response.json(
      { error: "The contact details could not be saved. Please try again." },
      { status: 500 },
    );
  }
}
