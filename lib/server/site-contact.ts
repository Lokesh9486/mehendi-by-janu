import {
  validateSiteContact,
  type SiteContact,
  type SiteContactInput,
} from "@/lib/site-contact";
import {
  getSiteContactRecord,
  hasPersistentStorage,
  saveSiteContactRecord,
  type SiteContactRecord,
} from "@/lib/server/db";
import { siteConfig } from "@/lib/siteConfig";

function toSiteContact(record: SiteContactRecord): SiteContact {
  return {
    phoneNumber: record.phoneNumber,
    whatsappNumber: record.whatsappNumber,
    instagramUrl: record.instagramUrl,
    updatedAt: record.updatedAt
      ? new Date(record.updatedAt).toISOString()
      : null,
  };
}

/** Contact details supplied by environment variables on read-only hosts. */
function configuredContact(): SiteContact {
  const phone = validateSiteContact({ phoneNumber: siteConfig.phoneNumber });
  const whatsapp = validateSiteContact({
    whatsappNumber: siteConfig.whatsappNumber,
  });
  const instagram = validateSiteContact({
    instagramUrl: siteConfig.instagramUrl,
  });

  return {
    phoneNumber: phone.ok ? phone.value.phoneNumber : "",
    whatsappNumber: whatsapp.ok ? whatsapp.value.whatsappNumber : "",
    instagramUrl: instagram.ok ? instagram.value.instagramUrl : "",
    updatedAt: null,
  };
}

/** Public contact details used by the footer, enquiry form and metadata. */
export function getSiteContact(): SiteContact {
  if (!hasPersistentStorage()) return configuredContact();

  try {
    return toSiteContact(getSiteContactRecord());
  } catch (error) {
    console.warn(
      "Could not read contact details from the database; using environment defaults.",
      error,
    );
    return configuredContact();
  }
}

export function saveSiteContact(input: SiteContactInput): SiteContact {
  return toSiteContact(saveSiteContactRecord(input));
}
