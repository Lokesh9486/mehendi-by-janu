import { qualities } from "@/lib/site-data";
import {
  bodyCopyClass,
  container,
  eyebrowClass,
  eyebrowLineClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function QualitiesSection() {
  return (
    <section
      aria-labelledby="qualities-title"
      className={cn(sectionPadding, "bg-champagne")}
    >
      <div className={container}>
        <div className="mx-auto max-w-[650px] text-center">
          <div className={cn(eyebrowClass, "justify-center")}>
            <span className={eyebrowLineClass} aria-hidden="true" />
            The approach
          </div>
          <h2
            id="qualities-title"
            className="mt-4 font-serif text-[clamp(36px,4.3vw,54px)] leading-[1] font-normal tracking-[-0.025em] text-burgundy"
          >
            Care In Every Detail
          </h2>
          <p className={cn(bodyCopyClass, "mx-auto mt-4")}>
            Every design is created with care, creativity, and attention to
            detail, with patterns tailored to your style and preferences.
          </p>
        </div>

        <div className="mt-9 grid border-t border-burgundy/25 sm:grid-cols-2 md:mt-11 lg:grid-cols-3">
          {qualities.map((quality) => (
            <article
              key={quality.number}
              className="border-b border-burgundy/25 py-7 md:border-r md:border-b-0 md:px-7 md:py-8"
            >
              <span className="font-mono text-[9px] tracking-[0.1em] text-[#8e7d65]">
                {quality.number}
              </span>
              <h3 className="mt-3 font-serif text-[22px] leading-[1.1] text-burgundy">
                {quality.title}
              </h3>
              <p className="mt-2 max-w-[280px] text-[11px] leading-[1.7] text-[#685f55]">
                {quality.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
