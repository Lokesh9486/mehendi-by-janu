import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SelectServiceLink } from "@/components/select-service-link";
import { eyebrowClass, lightButtonClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function BridalSection() {
  return (
    <section
      aria-labelledby="bridal-title"
      className="bg-burgundy px-[6%] py-[66px] text-ivory md:px-[5%] md:py-[74px] lg:px-[max(6.5%,calc((100vw-1320px)/2))] lg:py-[90px]"
    >
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-9 md:grid-cols-[1fr_.85fr] md:gap-[9%]">
        <div>
          <div className={cn(eyebrowClass, "text-champagne")}>
            <span className="h-px w-[26px] shrink-0 bg-gold" aria-hidden="true" />
            A personal approach
          </div>
          <h2
            id="bridal-title"
            className="mt-4 max-w-[560px] font-serif text-[clamp(36px,4.8vw,57px)] leading-[1.02] font-normal tracking-[-0.025em]"
          >
            Artistry shaped around your moment.
          </h2>
          <p className="mt-5 max-w-[470px] text-[13px] leading-[1.8] text-ivory/70">
            From traditional South Indian bridal mehendi to modern Arabic mehndi
            designs, explore patterns tailored to your style and preferences.
          </p>
          <SelectServiceLink
            service="Bridal Mehendi"
            className={cn(
              lightButtonClass,
              "mt-7 inline-flex items-center gap-2 border border-champagne/55 px-5 py-3.5 text-[11px]",
            )}
          >
            Enquire About Bridal Mehendi
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </SelectServiceLink>
        </div>

        <div className="relative aspect-[4/4.7] border border-champagne/40 p-[9px]">
          <div className="relative h-full w-full overflow-hidden bg-[#4c2b31]">
            <Image
              src="/images/bridal-mehendi-detail.jpg"
              alt="Illustrative close-up of bridal henna patterns on hands; not Janu’s client work"
              fill
              sizes="(max-width: 767px) 88vw, 36vw"
              className="object-cover"
            />
          </div>
          <span className="absolute bottom-4 left-4 bg-burgundy/85 px-2.5 py-1.5 font-mono text-[6px] tracking-[0.07em] text-ivory/70 uppercase">
            Illustrative image · not actual client work
          </span>
        </div>
      </div>
    </section>
  );
}
