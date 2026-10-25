import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutSection } from "@/components/about-section";
import { BookingSection } from "@/components/booking-section";
import { BridalSection } from "@/components/bridal-section";
import { ContactSection } from "@/components/contact-section";
import { EnquiryProvider } from "@/components/enquiry-context";
import { FaqSection } from "@/components/faq-section";
import { GallerySection } from "@/components/gallery-section";
import { Hero } from "@/components/hero";
import { PageFrame } from "@/components/page-frame";
import { QualitiesSection } from "@/components/qualities-section";
import { ServicesSection } from "@/components/services-section";
import { listGalleryItems } from "@/lib/server/gallery";
import { faqJsonLd, serializeJsonLd } from "@/lib/seo";
import { connection } from "next/server";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

async function HomeGallery() {
  await connection();

  const items = listGalleryItems(6);

  if (items.length === 0) return null;

  return <GallerySection items={items} showFilters={false} showMore />;
}

export default function Home() {
  return (
    <EnquiryProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <PageFrame>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <BridalSection />
        <Suspense fallback={null}>
          <HomeGallery />
        </Suspense>
        <QualitiesSection />
        <BookingSection />
        <FaqSection />
        <ContactSection />
      </PageFrame>
    </EnquiryProvider>
  );
}
