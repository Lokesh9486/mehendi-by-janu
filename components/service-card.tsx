"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Service } from "@/lib/site-data";
import { useEnquiry } from "@/components/enquiry-context";

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const { selectService } = useEnquiry();

  return (
    <Link
      href="#contact"
      onClick={() => selectService(service.title)}
      aria-label={`Enquire about ${service.title}`}
      className="group relative flex min-h-[260px] flex-col overflow-hidden border-r border-b border-burgundy/25 bg-paper p-[17px_15px] text-burgundy transition-colors duration-300 hover:text-ivory focus-visible:text-ivory md:min-h-[300px] md:p-[26px_25px_22px] [@media(hover:none)]:text-ivory"
    >
      <Image
        src={service.image}
        alt={service.alt}
        fill
        sizes="(max-width: 767px) 50vw, 33vw"
        className="scale-[1.035] object-cover object-center opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#221918]/64 via-[#221918]/33 to-[#221918]/77 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
      />
      <span className="relative z-10 font-mono text-[9px] tracking-[0.12em] text-[#8e7d65] transition-colors group-hover:text-ivory/70 [@media(hover:none)]:text-ivory">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute top-5 right-5 z-10 text-ivory/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:top-3 max-md:right-3 [@media(hover:none)]:opacity-100">
        <ChevronRight className="size-[17px]" aria-hidden="true" />
      </span>
      <div className="relative z-10 mt-auto max-w-[270px]">
        <h3 className="max-w-[270px] font-serif text-[clamp(22px,6vw,29px)] leading-[1.03] font-medium tracking-[-0.02em] md:text-[clamp(24px,2.35vw,34px)]">
          {service.title}
        </h3>
        <p className="mt-2.5 max-w-[285px] text-[11px] leading-[1.7] text-[#71685e] transition-colors group-hover:text-[#fffaf1]/88 group-focus-visible:text-[#fffaf1]/88 md:text-[12px] [@media(hover:none)]:text-[#fffaf1]/91">
          {service.description}
        </p>
      </div>
      <span className="absolute top-5 right-[48px] z-10 max-w-[95px] text-right font-mono text-[7px] leading-[1.35] tracking-[0.04em] text-ivory/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:top-7 max-md:right-10 max-md:left-3 max-md:max-w-none max-md:text-left [@media(hover:none)]:opacity-100">
        Illustrative · not actual client work
      </span>
    </Link>
  );
}
