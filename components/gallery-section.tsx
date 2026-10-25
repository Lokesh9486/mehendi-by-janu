import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GalleryGrid } from "@/components/gallery-grid";
import { buttonVariants } from "@/components/ui/button";
import type { GalleryItem } from "@/lib/gallery-types";
import {
  container,
  eyebrowClass,
  eyebrowLineClass,
  primaryButtonClass,
  quietLinkClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

type GallerySectionProps = {
  items: GalleryItem[];
  showFilters?: boolean;
  showMore?: boolean;
  title?: string;
  eyebrow?: string;
  note?: string;
  headingLevel?: "h1" | "h2";
  contactHref?: string;
};

export function GallerySection({
  items,
  showFilters = true,
  showMore = false,
  title = "Mehendi, In Detail",
  eyebrow = "Image studies",
  note = "A selection of studio designs and recent photographs from the collection.",
  headingLevel = "h2",
  contactHref = "#contact",
}: GallerySectionProps) {
  const Heading = headingLevel;

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
              {eyebrow}
            </div>
            <Heading
              id="gallery-title"
              className="mt-4 font-serif text-[clamp(42px,5.1vw,66px)] leading-[.98] font-normal tracking-[-0.03em] text-burgundy"
            >
              {title}
            </Heading>
          </div>
          <p className="max-w-[330px] text-[10px] leading-[1.65] text-[#847a6e] max-md:mt-5">
            {note}
          </p>
        </div>

        <GalleryGrid items={items} showFilters={showFilters} />

        <div className="mt-9 flex flex-col items-center gap-5">
          {showMore ? (
            <Link
              href="/gallery"
              className={cn(
                buttonVariants({ size: "lg" }),
                primaryButtonClass,
                "inline-flex items-center gap-2",
              )}
            >
              Show More Designs
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ) : null}

          <Link href={contactHref} className={quietLinkClass}>
            Have A Design In Mind? Let’s Talk.
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
