import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Mehandi by Janu | Bridal Mehendi Artist in Tiruppur";
const description =
  "Discover beautiful bridal, Arabic and traditional mehendi designs with Mehandi by Janu, a mehendi artist in Tiruppur (Tirupur), Tamil Nadu. Explore designs and book your appointment.";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f1e7",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Mehandi by Janu",
  description:
    "Bridal, Arabic, traditional, and bespoke mehendi artistry in Tiruppur, Tamil Nadu.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tiruppur",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  areaServed: "Tiruppur, Tamil Nadu, India",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
