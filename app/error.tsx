"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6 py-16">
      <div className="w-full max-w-lg border border-champagne bg-paper p-8 text-center md:p-12">
        <p className="font-mono text-[9px] tracking-[0.18em] text-gold uppercase">
          Something went wrong
        </p>
        <h1 className="mt-4 font-serif text-[38px] leading-[1] text-burgundy">
          We could not open this page.
        </h1>
        <p className="mt-4 text-[13px] leading-[1.75] text-[#625b52]">
          Please try again. If the problem continues, return to the home page
          and send an enquiry.
        </p>
        {process.env.NODE_ENV === "development" ? (
          <pre className="mt-5 overflow-x-auto border border-champagne bg-ivory p-3 text-left text-[10px] text-[#625b52]">
            {error.message || String(error)}
          </pre>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={reset}
            className="h-auto rounded-none border border-burgundy bg-burgundy px-5 py-3.5 text-[11px] tracking-[0.05em] text-ivory hover:bg-olive"
          >
            Try again
          </Button>
          <Link
            href="/"
            className="border border-burgundy/30 px-5 py-3.5 text-[11px] tracking-[0.05em] text-burgundy transition-colors hover:bg-champagne/40"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
