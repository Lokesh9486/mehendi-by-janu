import { faqs, services } from "@/lib/site-data";
import { siteConfig } from "@/lib/siteConfig";

export const siteTitle =
  "Mehandi by Janu | Bridal Mehendi Artist in Tiruppur";
export const siteDescription =
  "Discover beautiful bridal, Arabic and traditional mehendi designs with Mehandi by Janu, a mehendi artist in Tiruppur (Tirupur), Tamil Nadu. Explore designs and book your appointment.";
export const galleryTitle = "Mehendi Gallery";
export const galleryDescription =
  "Browse the full Mehandi by Janu collection of bridal, Arabic, traditional, and celebration mehendi designs in Tiruppur, Tamil Nadu. Find your look and enquire about an appointment.";
export const galleryOpenGraphTitle = `${galleryTitle} | Mehandi by Janu`;

export const defaultOgImage = {
  url: "/images/bridal-mehendi-detail.jpg",
  width: 1024,
  height: 1024,
  alt: "Illustrative close-up of intricate bridal mehendi on hands.",
};

const businessId = `${siteConfig.siteUrl}/#business`;
const websiteId = `${siteConfig.siteUrl}/#website`;
const galleryUrl = absoluteUrl("/gallery");

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": businessId,
      name: "Mehandi by Janu",
      description:
        "Bridal, Arabic, traditional, and bespoke mehendi artistry in Tiruppur, Tamil Nadu.",
      url: siteConfig.siteUrl,
      image: [
        absoluteUrl("/images/bridal-mehendi-detail.jpg"),
        absoluteUrl("/images/arabic-henna.jpg"),
        absoluteUrl("/images/traditional-henna.jpg"),
      ],
      logo: absoluteUrl("/images/mehandi-by-janu-logo.webp"),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tiruppur",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "City", name: "Tiruppur" },
        { "@type": "State", name: "Tamil Nadu" },
        { "@type": "Country", name: "India" },
      ],
      serviceType: services.map((service) => service.title),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteConfig.siteUrl,
      name: "Mehandi by Janu",
      description: siteDescription,
      inLanguage: "en-IN",
      publisher: { "@id": businessId },
    },
  ],
};

export const galleryJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageGallery",
      "@id": `${galleryUrl}#gallery`,
      url: galleryUrl,
      name: galleryOpenGraphTitle,
      description: galleryDescription,
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteId },
      about: { "@id": businessId },
      image: services.map((service) => ({
        "@type": "ImageObject",
        contentUrl: absoluteUrl(service.image),
        name: service.title,
        description: service.alt,
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${galleryUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: galleryTitle,
          item: galleryUrl,
        },
      ],
    },
  ],
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
