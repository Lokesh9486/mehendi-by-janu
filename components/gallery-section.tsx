import { ArrowUpRight } from "lucide-react";
import { GalleryGrid } from "@/components/gallery-grid";
import {
  container,
  eyebrowClass,
  eyebrowLineClass,
  quietLinkClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function GallerySection() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className={cn(sectionPadding, "bg-paper")}
    >
      <div className={container}>
        <div className="flex items-end justify-between gap-10 max-md:block">
          <div>
            <div className={eyebrowClass}>
              <span className={eyebrowLineClass} aria-hidden="true" />
              Image studies
            </div>
            <h2
              id="gallery-title"
              className="mt-4 font-serif text-[clamp(42px,5.1vw,66px)] leading-[.98] font-normal tracking-[-0.03em] text-burgundy"
            >
              Mehendi, In Detail
            </h2>
          </div>
          <p className="max-w-[330px] text-[10px] leading-[1.65] text-[#847a6e] max-md:mt-5">
            These illustrative images are not actual client work by Janu.
            Approved portfolio photographs can replace them when supplied.
          </p>
        </div>

        <GalleryGrid />

        <div className="mt-9 flex justify-center">
          <a href="#contact" className={quietLinkClass}>
            Have A Design In Mind? Let’s Talk.
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
