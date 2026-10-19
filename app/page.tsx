import type { Metadata } from "next";
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
import { faqJsonLd, serializeJsonLd } from "@/lib/seo";
import { featuredGallery } from "@/lib/site-data";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

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
        <GallerySection
          images={featuredGallery}
          showFilters={false}
          showMore
        />
        <QualitiesSection />
        <BookingSection />
        <FaqSection />
        <ContactSection />
      </PageFrame>
    </EnquiryProvider>
  );
}
