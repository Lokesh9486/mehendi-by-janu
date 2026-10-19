import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  eyebrowClass,
  eyebrowLineClass,
  primaryButtonClass,
  quietLinkClass,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative mx-auto flex w-full max-w-[1480px] flex-col gap-10 overflow-hidden px-[6%] pt-10 pb-[52px] md:grid md:min-h-[min(770px,calc(100svh-110px))] md:grid-cols-[minmax(360px,.78fr)_1.22fr] md:items-center md:gap-[6.5%] md:px-[6.5%] md:pt-[50px] md:pb-[70px]"
    >
      <div className="animate-[settle_.75s_both] motion-reduce:animate-none">
        <div className={eyebrowClass}>
          <span className={eyebrowLineClass} aria-hidden="true" />
          Mehandi artistry · Tiruppur, Tamil Nadu
        </div>
        <h1
          id="hero-title"
          className="mt-4 max-w-[640px] font-serif text-[clamp(43px,11.5vw,67px)] leading-[.98] font-normal tracking-[-0.035em] text-burgundy md:mt-5 md:text-[clamp(48px,5.6vw,79px)] md:leading-[.99]"
        >
          Mehendi Art for Your Most Beautiful Moments
        </h1>
        <p className="mt-5 max-w-[470px] text-[13px] leading-[1.8] text-[#625b52] md:mt-6 md:text-[14px]">
          Beautiful and elegant mehendi designs for special moments in Tiruppur
          (Tirupur), Tamil Nadu.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 md:mt-8">
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              primaryButtonClass,
              "gap-2",
            )}
          >
            Book Your Mehendi
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <a href="#gallery" className={quietLinkClass}>
            Explore Designs
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t border-burgundy/15 pt-4 font-mono text-[8px] tracking-[0.1em] text-[#817568] uppercase md:mt-10 md:text-[9px]">
          <span>Bridal</span>
          <span aria-hidden="true">·</span>
          <span>Arabic</span>
          <span aria-hidden="true">·</span>
          <span>Traditional</span>
          <span aria-hidden="true">·</span>
          <span>Special occasions</span>
        </div>
      </div>

      <div className="relative animate-[settle_.85s_.12s_both] motion-reduce:animate-none">
        <div className="relative h-[min(110vw,560px)] min-h-[350px] overflow-hidden bg-champagne md:h-[min(640px,62vw)] md:min-h-[400px]">
          <Image
            src="/images/bridal-hands.jpg"
            alt="Illustrative close-up of hands decorated with bridal henna; not Janu’s client work"
            fill
            priority
            sizes="(max-width: 767px) 88vw, 50vw"
            className="object-cover object-[center_38%]"
          />
          <div className="absolute right-3 bottom-3 left-3 bg-ivory/92 px-3 py-2 font-mono text-[6px] tracking-[0.08em] text-[#75695d] uppercase md:right-4 md:bottom-4 md:left-4 md:text-[7px]">
            Illustrative photograph · not actual client work
          </div>
        </div>
        <div className="absolute top-6 -right-8 hidden font-mono text-[7px] tracking-[0.18em] text-[#8a7b6c] [writing-mode:vertical-rl] md:block">
          01 — HENNA FOR YOUR MOMENT
        </div>
      </div>
    </section>
  );
}
