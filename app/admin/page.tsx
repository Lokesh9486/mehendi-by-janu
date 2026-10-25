import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminSession } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false, nocache: true },
};

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <p className="font-mono text-[9px] tracking-[0.16em] text-[#857a6d] uppercase">
        Checking your session…
      </p>
    </div>
  );
}

async function AdminGate() {
  // The session check compares against the current time, so it must run on the
  // request instead of during prerendering.
  await connection();

  const session = await getAdminSession();

  if (!session) redirect("/admin/login");

  return <AdminDashboard email={session.email} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminGate />
    </Suspense>
  );
}
