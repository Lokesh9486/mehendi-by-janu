import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false, nocache: true },
};

const SESSION_ENDED_NOTICE =
  "You were signed out because this account signed in on another device. Only one session is allowed at a time.";

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <p className="font-mono text-[9px] tracking-[0.16em] text-[#857a6d] uppercase">
        Checking your session…
      </p>
    </div>
  );
}

async function LoginGate({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  // The session check compares against the current time, so it must run on the
  // request instead of during prerendering.
  await connection();

  const [session, params] = await Promise.all([
    getAdminSession(),
    searchParams,
  ]);

  if (session) redirect("/admin");

  return (
    <AdminLoginForm
      notice={params.reason === "session-ended" ? SESSION_ENDED_NOTICE : undefined}
    />
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginGate searchParams={searchParams} />
    </Suspense>
  );
}
