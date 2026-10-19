"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { galleryCategories, services } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState("All designs");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const visibleGallery = services.filter((service) =>
    galleryCategories
      .find((category) => category.label === activeCategory)
      ?.titles.includes(service.title),
  );
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
      <div
        className="mt-[30px] flex flex-wrap gap-x-2 gap-y-2 border-t border-burgundy/15 pt-4"
        role="group"
        aria-label="Filter gallery by category"
      >
        {galleryCategories.map((category) => {
          const active = activeCategory === category.label;

          return (
            <Button
              key={category.label}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              aria-pressed={active}
              onClick={() => {
                setActiveCategory(category.label);
                setLightboxIndex(null);
              }}
              className={cn(
                "h-auto rounded-none border px-3.5 py-2.5 text-[10px] tracking-[0.02em]",
                active
                  ? "border-burgundy bg-burgundy text-ivory hover:bg-olive"
                  : "border-burgundy/25 bg-transparent text-burgundy hover:bg-champagne/45",
              )}
            >
              {category.label}
            </Button>
          );
        })}
      </div>

      <div className="mt-7 grid auto-rows-[185px] grid-cols-2 gap-[9px] sm:auto-rows-[220px] md:auto-rows-[230px] md:grid-cols-3 lg:auto-rows-[270px] lg:grid-cols-4">
        {visibleGallery.map((service, index) => (
          <figure
            key={service.title}
            className={cn(
              "group relative m-0 overflow-hidden bg-champagne",
              index === 0 && "col-span-2 md:col-span-1",
              index % 4 === 0 && "md:row-span-2",
            )}
          >
            <button
              type="button"
              className="block h-full w-full text-left"
              aria-label={`Enlarge illustrative ${service.title} image`}
              data-testid={`button-open-gallery-${index}`}
              onClick={(event) => {
                returnFocusRef.current = event.currentTarget;
                setLightboxIndex(index);
              }}
            >
              <Image
                src={service.image}
                alt={service.alt}
                fill
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
                {service.title}
              </span>
              <small className="font-mono text-[7px] leading-[1.35] tracking-[0.04em] text-[#71685e]">
                Illustrative · not actual client work
              </small>
            </figcaption>
          </figure>
        ))}
      </div>

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
            Illustrative gallery image, not actual client work.
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
                  src={currentImage.image}
                  alt={currentImage.alt}
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
                    Illustrative · not actual client work
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
