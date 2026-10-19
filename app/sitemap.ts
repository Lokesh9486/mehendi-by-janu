import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { services } from "@/lib/site-data";
import { siteConfig } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/gallery"),
      changeFrequency: "monthly",
      priority: 0.8,
      images: services.map((service) => absoluteUrl(service.image)),
    },
  ];
}
