import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { GallerySection } from "@/components/gallery-section";
import { PageFrame } from "@/components/page-frame";
import { listGalleryItems } from "@/lib/server/gallery";
import {
  defaultOgImage,
  galleryDescription,
  galleryJsonLd,
  galleryOpenGraphTitle,
  galleryTitle,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: galleryTitle,
  description: galleryDescription,
  keywords: [
    "mehendi gallery Tiruppur",
    "bridal mehendi designs",
    "Arabic mehendi designs",
    "traditional mehendi designs",
    "mehandi by Janu gallery",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: galleryOpenGraphTitle,
    description: galleryDescription,
    url: "/gallery",
    siteName: "Mehandi by Janu",
    locale: "en_IN",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: galleryOpenGraphTitle,
    description: galleryDescription,
    images: [defaultOgImage.url],
  },
};

async function GalleryCollection() {
  await connection();

  const items = listGalleryItems();

  return (
    <GallerySection
      items={items}
      showFilters
      title="Mehendi Gallery"
      eyebrow="The full collection"
      note="Bridal, Arabic, traditional and celebration designs from the studio collection. Use the filters to explore, and enquire for your own date."
      headingLevel="h1"
      contactHref="/#contact"
    />
  );
}

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(galleryJsonLd) }}
      />
      <PageFrame anchorPrefix="/">
        <Suspense fallback={null}>
          <GalleryCollection />
        </Suspense>
      </PageFrame>
    </>
  );
}
