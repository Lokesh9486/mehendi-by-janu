import type { SiteContact, SiteContactInput } from "@/lib/site-contact";
import {
  getSiteContactRecord,
  saveSiteContactRecord,
  type SiteContactRecord,
} from "@/lib/server/db";

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

/** Public contact details used by the footer, enquiry form and metadata. */
export function getSiteContact(): SiteContact {
  return toSiteContact(getSiteContactRecord());
}

export function saveSiteContact(input: SiteContactInput): SiteContact {
  return toSiteContact(saveSiteContactRecord(input));
}
