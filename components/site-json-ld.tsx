import { connection } from "next/server";
import { serializeJsonLd, siteJsonLd } from "@/lib/seo";
import { getSiteContact } from "@/lib/server/site-contact";

/**
 * Renders the business JSON-LD with the contact details saved from the admin
 * screen. This runs per request so `telephone` and `sameAs` stay current.
 */
export async function SiteJsonLd() {
  await connection();

  const contact = getSiteContact();

  const graph = siteJsonLd["@graph"].map((node) => {
    if (node["@type"] !== "ProfessionalService") return node;

    return {
      ...node,
      ...(contact.phoneNumber ? { telephone: contact.phoneNumber } : {}),
      ...(contact.instagramUrl ? { sameAs: [contact.instagramUrl] } : {}),
    };
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd({ ...siteJsonLd, "@graph": graph }),
      }}
    />
  );
}
