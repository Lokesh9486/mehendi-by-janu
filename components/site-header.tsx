import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { navigation } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-burgundy/15 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[67px] w-full max-w-[1320px] items-center justify-between gap-6 px-[5%] md:min-h-[82px]">
        <a
          href="#home"
          className="flex items-center gap-2.5 text-burgundy"
          aria-label="Mehandi by Janu, home"
        >
          <Image
            src="/images/mehandi-by-janu-logo.webp"
            alt=""
            width={280}
            height={202}
            className="h-[34px] w-[46px] object-contain md:h-[38px] md:w-[52px]"
          />
          <span className="font-serif text-[15px] leading-none font-semibold tracking-[0.12em] md:tracking-[0.16em]">
            MEHANDI BY JANU
            <small className="mt-1 block font-mono text-[7px] font-normal tracking-[0.18em] text-[#7d695d] md:mt-[7px] md:text-[9px] md:tracking-[0.2em]">
              HENNA · TIRUPPUR
            </small>
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
              className="relative py-2 text-[11px] text-burgundy transition-colors after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className={cn(
            buttonVariants({ size: "lg" }),
            "hidden h-auto items-center gap-2 rounded-none border border-burgundy bg-burgundy px-5 py-3.5 text-[11px] tracking-[0.05em] text-ivory transition-colors hover:bg-olive lg:inline-flex",
          )}
        >
          Book Your Mehendi
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>

        <MobileNav />
      </div>
    </header>
  );
}
