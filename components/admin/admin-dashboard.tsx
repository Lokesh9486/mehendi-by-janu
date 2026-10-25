"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  AtSign,
  Images,
  Loader2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { ContactForm } from "@/components/admin/contact-form";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { PasswordForm } from "@/components/admin/password-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TabId = "gallery" | "contact" | "password";

const tabs: { id: TabId; label: string; hint: string; icon: typeof Images }[] = [
  {
    id: "gallery",
    label: "Gallery",
    hint: "Upload and delete images",
    icon: Images,
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Phone, WhatsApp and Instagram",
    icon: AtSign,
  },
  {
    id: "password",
    label: "Password",
    hint: "Change the sign-in password",
    icon: ShieldCheck,
  },
];

const tabLabels: Record<TabId, string> = {
  gallery: "Gallery",
  contact: "Contact details",
  password: "Password",
};

export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("gallery");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSessionExpired = useCallback(() => {
    router.replace("/admin/login?reason=session-ended");
  }, [router]);

  /**
   * The database only ever holds one valid session token. Polling keeps this
   * screen honest: if the account signs in somewhere else, this tab returns to
   * the sign-in screen instead of showing a dashboard that can no longer save.
   */
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });

        if (cancelled) return;

        const data = (await response.json().catch(() => ({}))) as {
          authenticated?: boolean;
        };

        if (!data.authenticated) {
          cancelled = true;
          router.replace("/admin/login?reason=session-ended");
        }
      } catch {
        // A network blip should not throw the user out of the screen.
      }
    }

    const interval = window.setInterval(checkSession, 20_000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void checkSession();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-burgundy/15 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 px-[6%] py-5">
          <div>
            <p className="font-mono text-[8px] tracking-[0.2em] text-[#857a6d] uppercase">
              Mehandi by Janu
            </p>
            <h1 className="mt-1 font-serif text-[26px] leading-none text-burgundy">
              Studio admin
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden font-mono text-[9px] tracking-[0.06em] text-[#6d635a] sm:inline">
              {email}
            </span>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.1em] text-burgundy uppercase transition-opacity hover:opacity-70"
            >
              View gallery
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>

            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="h-9 rounded-none border-burgundy/30 bg-transparent px-3.5 text-[10px] tracking-[0.06em] text-burgundy hover:bg-champagne/50"
            >
              {isSigningOut ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="size-3.5" aria-hidden="true" />
              )}
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-[6%] py-8 md:py-10">
        <nav
          aria-label="Admin sections"
          className="mb-8 flex flex-wrap gap-2 border-b border-burgundy/15"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "-mb-px flex items-center gap-2.5 border-b-2 px-4 py-3 text-left transition-colors",
                  active
                    ? "border-burgundy bg-champagne/25 text-burgundy"
                    : "border-transparent text-[#857a6d] hover:bg-champagne/15 hover:text-burgundy",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>
                  <span className="block font-mono text-[10px] tracking-[0.1em] uppercase">
                    {tab.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] tracking-[0.01em] text-[#857a6d] normal-case">
                    {tab.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <section aria-label={tabLabels[activeTab]}>
          {activeTab === "gallery" ? (
            <GalleryManager onSessionExpired={handleSessionExpired} />
          ) : activeTab === "contact" ? (
            <ContactForm onSessionExpired={handleSessionExpired} />
          ) : (
            <PasswordForm onSessionExpired={handleSessionExpired} />
          )}
        </section>

        <p className="mt-10 border-t border-burgundy/12 pt-4 font-mono text-[8px] leading-[1.9] tracking-[0.06em] text-[#857a6d] uppercase">
          Images are stored on this server in the local data folder. Deleting an
          image removes both the record and the file. Only one admin session can
          be active at a time.
        </p>
      </main>
    </div>
  );
}
