import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-6 py-16">
      <div className="w-full max-w-lg border border-champagne bg-paper p-8 md:p-12">
        <p className="font-mono text-[9px] tracking-[0.18em] text-gold uppercase">
          404 · Page not found
        </p>
        <h1 className="mt-4 font-serif text-[42px] leading-[1] text-burgundy">
          This page has wandered off.
        </h1>
        <p className="mt-4 text-[13px] leading-[1.75] text-[#625b52]">
          The page you are looking for is not here. Return to Mehandi by Janu to
          explore the designs and begin an enquiry.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-7 inline-flex h-auto items-center gap-2 rounded-none border border-burgundy bg-burgundy px-5 py-3.5 text-[11px] tracking-[0.05em] text-ivory hover:bg-olive",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
