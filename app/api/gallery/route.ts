import { connection } from "next/server";
import { listGalleryItems } from "@/lib/server/gallery";

/** Public gallery list: seeded studio designs plus admin uploads. */
export async function GET() {
  await connection();

  return Response.json(
    { items: listGalleryItems() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
