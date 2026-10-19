import { FaqAccordion } from "@/components/faq-accordion";
import {
  container,
  eyebrowClass,
  eyebrowLineClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={cn(sectionPadding, "bg-paper")}
    >
      <div
        className={cn(
          container,
          "grid gap-10 md:grid-cols-[.75fr_1.25fr] md:gap-[10%]",
        )}
      >
        <div>
          <div className={eyebrowClass}>
            <span className={eyebrowLineClass} aria-hidden="true" />
            Good to know
          </div>
          <h2
            id="faq-title"
            className="mt-4 font-serif text-[clamp(36px,4.3vw,54px)] leading-[1] font-normal tracking-[-0.025em] text-burgundy"
          >
            A Few Helpful Answers
          </h2>
          <p className="mt-4 max-w-[300px] text-[12px] leading-[1.8] text-[#625b52]">
            For details specific to your occasion, send an enquiry and discuss
            them directly with Janu.
          </p>
        </div>

        <FaqAccordion />
      </div>
    </section>
  );
}
