import { MapPin } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { siteConfig } from "@/lib/siteConfig";
import {
  bodyCopyClass,
  container,
  eyebrowClass,
  eyebrowLineClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className={cn(sectionPadding, "bg-paper")}
    >
      <div
        className={cn(
          container,
          "grid items-start gap-10 md:grid-cols-[.82fr_1.18fr] md:gap-[9%]",
        )}
      >
        <div className="md:sticky md:top-[130px]">
          <div className={eyebrowClass}>
            <span className={eyebrowLineClass} aria-hidden="true" />
            Begin with a conversation
          </div>
          <h2
            id="contact-title"
            className="mt-4 max-w-[500px] font-serif text-[clamp(36px,4.5vw,56px)] leading-[1.02] font-normal tracking-[-0.025em] text-burgundy"
          >
            Your Special Day Deserves Beautiful Henna
          </h2>
          <p className={cn(bodyCopyClass, "mt-5")}>
            Share your occasion, preferred date, and event location to enquire.
            Your appointment is confirmed directly with Janu.
          </p>
          <div className="mt-7 flex items-center gap-2.5 text-[11px] text-[#685f55]">
            <MapPin className="size-4 text-gold" aria-hidden="true" />
            <span>{siteConfig.location}</span>
          </div>
        </div>

        <EnquiryForm />
      </div>
    </section>
  );
}
