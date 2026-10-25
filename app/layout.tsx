import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, DM_Mono, DM_Sans } from "next/font/google";
import {
  defaultOgImage,
  siteDescription,
  siteTitle,
} from "@/lib/seo";
import { SiteJsonLd } from "@/components/site-json-ld";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Mehandi by Janu",
  },
  description: siteDescription,
  applicationName: "Mehandi by Janu",
  keywords: [
    "mehandi artist Tiruppur",
    "mehendi artist Tirupur",
    "bridal mehendi Tiruppur",
    "Arabic mehendi",
    "traditional mehendi",
    "bridal henna artist Tamil Nadu",
    "Mehandi by Janu",
  ],
  authors: [{ name: "Mehandi by Janu", url: siteConfig.siteUrl }],
  creator: "Mehandi by Janu",
  publisher: "Mehandi by Janu",
  category: "Beauty",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Mehandi by Janu",
    locale: "en_IN",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [defaultOgImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f0e7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <Suspense fallback={null}>
          <SiteJsonLd />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
