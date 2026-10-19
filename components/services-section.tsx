import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { buttonVariants } from "@/components/ui/button";
import { services } from "@/lib/site-data";
import {
  bodyCopyClass,
  container,
  eyebrowClass,
  eyebrowLineClass,
  primaryButtonClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={cn(sectionPadding, "bg-ivory")}
    >
      <div className={container}>
        <div className="flex items-end justify-between gap-10 max-md:block">
          <div>
            <div className={eyebrowClass}>
              <span className={eyebrowLineClass} aria-hidden="true" />
              Explore the collection
            </div>
            <h2
              id="services-title"
              className="mt-4 font-serif text-[clamp(42px,5.1vw,66px)] leading-[.98] font-normal tracking-[-0.03em] text-burgundy"
            >
              A Design For
              <br />
              <em className="font-normal text-olive">Every Occasion</em>
            </h2>
          </div>
          <p className={cn(bodyCopyClass, "max-w-[340px] max-md:mt-5")}>
            Choose a service to begin an enquiry. Each design is approached with
            care, creativity, and attention to detail.
          </p>
        </div>

        <div
          className="mt-9 grid grid-cols-2 border border-burgundy/25 md:mt-11 md:grid-cols-3"
          aria-label="Mehendi services"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
            />
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <a
            href="#contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              primaryButtonClass,
              "gap-2",
            )}
          >
            Enquire About A Design
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
