import type { Metadata } from "next";
import { GallerySection } from "@/components/gallery-section";
import { PageFrame } from "@/components/page-frame";
import {
  defaultOgImage,
  galleryDescription,
  galleryJsonLd,
  galleryOpenGraphTitle,
  galleryTitle,
  serializeJsonLd,
} from "@/lib/seo";
import { services } from "@/lib/site-data";

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

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(galleryJsonLd) }}
      />
      <PageFrame anchorPrefix="/">
        <GallerySection
          images={services}
          showFilters
          title="Mehendi Gallery"
          eyebrow="The full collection"
          note="Explore every bridal, Arabic, traditional, and celebration design in the collection. These illustrative images are not actual client work."
          headingLevel="h1"
          contactHref="/#contact"
        />
      </PageFrame>
    </>
  );
}
