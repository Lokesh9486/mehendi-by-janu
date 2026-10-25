"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { postEncryptedJson } from "@/lib/secure-payload-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm({ notice }: { notice?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsBusy(true);

    try {
      const response = await postEncryptedJson("/api/admin/login", {
        email,
        password,
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not sign in. Please try again.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-[6%] py-14">
      <div className="w-full max-w-[430px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-burgundy uppercase transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to the site
        </Link>

        <div className="mt-6 border border-burgundy/20 bg-paper p-7 shadow-[0_18px_50px_-30px_rgba(99,60,67,0.55)] md:p-9">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.19em] text-burgundy uppercase">
            <span className="h-px w-[26px] bg-gold" aria-hidden="true" />
            Studio access
          </div>

          <h1 className="mt-4 font-serif text-[38px] leading-none font-normal tracking-[-0.02em] text-burgundy">
            Sign in
          </h1>

          <p className="mt-3 text-[12px] leading-[1.7] text-[#6d635a]">
            Manage gallery uploads and your account password.
          </p>

          {notice ? (
            <p
              role="status"
              className="mt-5 border border-gold/50 bg-gold/10 px-3.5 py-3 text-[11px] leading-[1.6] text-[#6b5227]"
            >
              {notice}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
            <div className="space-y-2">
              <Label
                htmlFor="admin-email"
                className="font-mono text-[9px] tracking-[0.14em] text-burgundy uppercase"
              >
                Email
              </Label>
              <Input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="janu@mehandi.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-none border-burgundy/25 bg-ivory/70 px-3.5 text-[13px] focus-visible:ring-burgundy/20"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="font-mono text-[9px] tracking-[0.14em] text-burgundy uppercase"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-none border-burgundy/25 bg-ivory/70 px-3.5 text-[13px] focus-visible:ring-burgundy/20"
              />
            </div>

            {error ? (
              <p
                role="alert"
                aria-live="polite"
                className="border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-destructive"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isBusy}
              className="h-11 w-full rounded-none border border-burgundy bg-burgundy text-[11px] tracking-[0.08em] text-ivory transition-colors hover:border-olive hover:bg-olive"
            >
              {isBusy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  Sign in securely
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 border-t border-burgundy/12 pt-4">
            <p className="font-mono text-[8px] leading-[1.8] tracking-[0.06em] text-[#857a6d] uppercase">
              Credentials are encrypted in the browser before they are sent.
              Only one session can be active at a time — signing in here ends any
              other open session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
