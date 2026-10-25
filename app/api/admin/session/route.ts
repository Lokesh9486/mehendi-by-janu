import { getAdminSession } from "@/lib/server/auth";

export async function GET() {
  const session = await getAdminSession();

  return Response.json(
    session
      ? { authenticated: true, email: session.email }
      : { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
