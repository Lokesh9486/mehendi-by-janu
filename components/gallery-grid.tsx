"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem,
} from "@/lib/gallery-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const ALL_CATEGORIES = "All designs";

type GalleryGridProps = {
  items: GalleryItem[];
  showFilters?: boolean;
};

export function GalleryGrid({ items, showFilters = true }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const categories: GalleryCategory[] = GALLERY_CATEGORIES.filter((category) =>
    items.some((item) => item.category === category),
  );
  const visibleGallery =
    showFilters && activeCategory !== ALL_CATEGORIES
      ? items.filter((item) => item.category === activeCategory)
      : items;
  const currentImage =
    lightboxIndex === null ? null : visibleGallery[lightboxIndex] ?? null;

  useEffect(() => {
    if (lightboxIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? 0 : (current + 1) % visibleGallery.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null
            ? 0
            : (current - 1 + visibleGallery.length) % visibleGallery.length,
        );
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [lightboxIndex, visibleGallery.length]);

  function closeLightbox() {
    setLightboxIndex(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }

  function moveLightbox(direction: 1 | -1) {
    setLightboxIndex((current) => {
      if (current === null) return 0;
      return (
        (current + direction + visibleGallery.length) % visibleGallery.length
      );
    });
  }

  return (
    <>
      {showFilters && categories.length > 0 ? (
        <div
          className="mt-[30px] flex flex-wrap gap-x-2 gap-y-2 border-t border-burgundy/15 pt-4"
          role="group"
          aria-label="Filter gallery by category"
        >
          {[ALL_CATEGORIES, ...categories].map((category) => {
            const active = activeCategory === category;

            return (
              <Button
                key={category}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                aria-pressed={active}
                onClick={() => {
                  setActiveCategory(category);
                  setLightboxIndex(null);
                }}
                className={cn(
                  "h-auto rounded-none border px-3.5 py-2.5 text-[10px] tracking-[0.02em]",
                  active
                    ? "border-burgundy bg-burgundy text-ivory hover:bg-olive"
                    : "border-burgundy/25 bg-transparent text-burgundy hover:bg-champagne/45",
                )}
              >
                {category}
              </Button>
            );
          })}
        </div>
      ) : null}

      {visibleGallery.length === 0 ? (
        <p className="mt-8 border border-dashed border-burgundy/20 bg-paper/60 px-5 py-12 text-center text-[12px] leading-[1.8] text-[#6d635a]">
          {items.length === 0
            ? "No photographs in the gallery yet. New work will appear here as the studio adds it."
            : "No designs in this category yet. Try another filter."}
        </p>
      ) : (
        <div
          className={cn(
            "grid auto-rows-[185px] grid-cols-2 gap-[9px] sm:auto-rows-[220px] md:auto-rows-[230px] md:grid-cols-3 lg:auto-rows-[270px] lg:grid-cols-4",
            showFilters ? "mt-7" : "mt-[30px]",
          )}
        >
          {visibleGallery.map((item, index) => (
            <figure
              key={item.id}
              className={cn(
                "group relative m-0 overflow-hidden bg-champagne",
                index === 0 && "col-span-2 md:col-span-1",
                index % 4 === 0 && "md:row-span-2",
              )}
            >
              <button
                type="button"
                className="relative block h-full w-full text-left"
                aria-label={`Enlarge ${item.title}`}
                data-testid={`button-open-gallery-${index}`}
                onClick={(event) => {
                  returnFocusRef.current = event.currentTarget;
                  setLightboxIndex(index);
                }}
              >
                <Image
                  src={item.imageUrl}
                  alt={
                    item.description
                      ? `${item.title} — ${item.description}`
                      : item.title
                  }
                  fill
                  loading={showFilters && index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.045] motion-reduce:transition-none"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center bg-paper/90 text-burgundy opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
              <figcaption className="pointer-events-none absolute right-2 bottom-2 left-2 flex flex-col items-start gap-0.5 bg-paper/92 px-2 py-1.5 text-burgundy md:right-auto md:bottom-3 md:left-3 md:px-2.5 md:py-2">
                <span className="font-mono text-[9px] leading-[1.2] tracking-[0.1em] uppercase">
                  {item.title}
                </span>
                <small className="font-mono text-[7px] leading-[1.35] tracking-[0.04em] text-[#71685e]">
                  {item.isIllustrative
                    ? "Illustrative · not Janu’s client work"
                    : item.category}
                </small>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) closeLightbox();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(920px,94vw)] gap-0 rounded-none bg-[#241719]/95 p-3 ring-0 shadow-none sm:max-w-[min(920px,94vw)] sm:p-4"
        >
          <DialogTitle className="sr-only">
            {currentImage?.title ?? "Gallery image"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {currentImage?.isIllustrative
              ? "Illustrative gallery image, not actual client work."
              : "Gallery photograph from Mehandi by Janu."}
          </DialogDescription>

          {currentImage ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-ivory">
                <span className="font-mono text-[9px] tracking-[0.12em]">
                  {String((lightboxIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(visibleGallery.length).padStart(2, "0")}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-none text-ivory hover:bg-ivory/15 hover:text-ivory"
                  aria-label="Close image"
                  onClick={closeLightbox}
                  data-testid="button-close-gallery-image"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-ink/50">
                <Image
                  src={currentImage.imageUrl}
                  alt={currentImage.title}
                  width={1024}
                  height={1024}
                  sizes="94vw"
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto rounded-none border-ivory/35 bg-transparent px-4 py-3 text-[10px] tracking-[0.05em] text-ivory hover:bg-ivory hover:text-burgundy"
                  onClick={() => moveLightbox(-1)}
                  aria-label="Previous image"
                >
                  Previous
                </Button>
                <p className="text-center font-serif text-[18px] leading-tight text-ivory sm:text-[22px]">
                  {currentImage.title}
                  <span className="mt-1 block font-mono text-[7px] tracking-[0.06em] text-ivory/65">
                    {currentImage.isIllustrative
                      ? "Illustrative · not Janu’s client work"
                      : [currentImage.category, currentImage.description]
                          .filter(Boolean)
                          .join(" · ")}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto rounded-none border-ivory/35 bg-transparent px-4 py-3 text-[10px] tracking-[0.05em] text-ivory hover:bg-ivory hover:text-burgundy"
                  onClick={() => moveLightbox(1)}
                  aria-label="Next image"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
