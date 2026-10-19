import { AboutSection } from "@/components/about-section";
import { BookingSection } from "@/components/booking-section";
import { BridalSection } from "@/components/bridal-section";
import { ContactSection } from "@/components/contact-section";
import { EnquiryProvider } from "@/components/enquiry-context";
import { FaqSection } from "@/components/faq-section";
import { GallerySection } from "@/components/gallery-section";
import { Hero } from "@/components/hero";
import { QualitiesSection } from "@/components/qualities-section";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <EnquiryProvider>
      <div className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-[12px] focus:text-burgundy"
        >
          Skip to content
        </a>

        <div className="bg-burgundy px-4 py-2 text-center font-mono text-[8px] tracking-[0.14em] text-ivory/85 uppercase md:py-[9px] md:text-[10px]">
          Mehandi by Janu <span aria-hidden="true">·</span> Tiruppur (Tirupur),
          Tamil Nadu
        </div>

        <SiteHeader />

        <main id="main">
          <Hero />
          <AboutSection />
          <ServicesSection />
          <BridalSection />
          <GallerySection />
          <QualitiesSection />
          <BookingSection />
          <FaqSection />
          <ContactSection />
        </main>

        <SiteFooter />
      </div>
    </EnquiryProvider>
  );
}
