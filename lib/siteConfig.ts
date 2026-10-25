/**
 * Site-wide defaults.
 *
 * On a host with a persistent disk, contact details are edited from the admin
 * Contact screen after the first run. On read-only hosts (Netlify, Vercel,
 * etc.) the public site falls back to the values here, so set the
 * MEHANDI_PHONE_NUMBER, MEHANDI_WHATSAPP_NUMBER and MEHANDI_INSTAGRAM_URL
 * environment variables in the hosting dashboard.
 *
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
  whatsappNumber: (process.env.MEHANDI_WHATSAPP_NUMBER?.trim() || "").replace(
    /\D/g,
    "",
  ),
  phoneNumber: process.env.MEHANDI_PHONE_NUMBER?.trim() || "",
  instagramUrl: process.env.MEHANDI_INSTAGRAM_URL?.trim() || "",
};
