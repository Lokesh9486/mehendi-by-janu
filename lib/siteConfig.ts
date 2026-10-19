/**
 * Owner setup: enter verified contact destinations here before publishing.
 * WhatsApp must be the full international number using digits only, no +.
 *
 * Set NEXT_PUBLIC_SITE_URL to the verified production domain so canonical
 * links, the sitemap, and robots.txt use the correct address.
 */
const fallbackSiteUrl = "https://mehandibyjanu.com";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl;

export const siteConfig = {
  siteUrl: configuredSiteUrl.replace(/\/+$/, ""),
  location: "Tiruppur (Tirupur), Tamil Nadu",
  whatsappNumber: "",
  phoneNumber: "",
  instagramUrl: "",
};
