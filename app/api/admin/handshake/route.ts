import { connection } from "next/server";
import { getSecureHandshake } from "@/lib/server/secure-payload";

/**
 * Hands out the public half of the encryption key pair.
 * `connection()` keeps this at request time — a prerendered key would belong to
 * the build process, not to the running server.
 */
export async function GET() {
  await connection();

  return Response.json(getSecureHandshake(), {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
