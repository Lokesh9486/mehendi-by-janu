import { connection } from "next/server";
import { getSiteContact } from "@/lib/server/site-contact";

/** Public contact details for the footer, enquiry form and JSON-LD. */
export async function GET() {
  await connection();

  return Response.json(
    { contact: getSiteContact() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
