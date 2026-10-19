import { ArrowRight } from "lucide-react";
import { bookingSteps } from "@/lib/site-data";
import { buttonVariants } from "@/components/ui/button";
import {
  bodyCopyClass,
  container,
  eyebrowClass,
  eyebrowLineClass,
  primaryButtonClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function BookingSection() {
  return (
    <section
      aria-labelledby="booking-title"
      className={cn(sectionPadding, "bg-ivory")}
    >
      <div className={container}>
        <div className="mx-auto max-w-[680px] text-center">
          <div className={cn(eyebrowClass, "justify-center")}>
            <span className={eyebrowLineClass} aria-hidden="true" />
            A clear next step
            <span className={eyebrowLineClass} aria-hidden="true" />
          </div>
          <h2
            id="booking-title"
            className="mt-4 font-serif text-[clamp(36px,4.3vw,54px)] leading-[1] font-normal tracking-[-0.025em] text-burgundy"
          >
            Let’s Plan Your Mehendi
          </h2>
          <p className={cn(bodyCopyClass, "mx-auto mt-4")}>
            Share your preferred service, event date, and location. Enquiries
            are discussed and appointments confirmed directly with Janu.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-10">
          {bookingSteps.map((step, index) => (
            <article
              key={step.number}
              className={cn(
                "relative border-t border-gold pt-5",
                index < bookingSteps.length - 1 &&
                  "md:after:absolute md:after:top-[-4px] md:after:-right-[22px] md:after:size-1.5 md:after:rotate-45 md:after:border-t md:after:border-r md:after:border-gold",
              )}
            >
              <div className="font-mono text-[8px] tracking-[0.2em] text-[#8e7d65]">
                {step.number}
              </div>
              <h3 className="mt-3 font-serif text-[24px] leading-[1.1] text-burgundy">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[290px] text-[11px] leading-[1.75] text-[#685f55]">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              primaryButtonClass,
              "gap-2",
            )}
          >
            Book Your Mehendi
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
