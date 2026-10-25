/** Contact details shown in the public site and edited from the admin screen. */
export type SiteContact = {
  phoneNumber: string;
  whatsappNumber: string;
  instagramUrl: string;
  /** ISO timestamp of the last save, or null when nothing has been saved. */
  updatedAt: string | null;
};

export type SiteContactInput = {
  phoneNumber: string;
  whatsappNumber: string;
  instagramUrl: string;
};

export const EMPTY_SITE_CONTACT: SiteContact = {
  phoneNumber: "",
  whatsappNumber: "",
  instagramUrl: "",
  updatedAt: null,
};

export const MAX_CONTACT_PHONE_LENGTH = 24;
export const MAX_CONTACT_INSTAGRAM_LENGTH = 200;

const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

type ValidationResult =
  | { ok: true; value: SiteContactInput }
  | { ok: false; error: string };

/**
 * Normalizes and validates the admin contact form. Shared by the client form
 * and the API route so both enforce the same rules.
 */
export function validateSiteContact(
  input: Record<string, unknown>,
): ValidationResult {
  const phoneNumber =
    typeof input.phoneNumber === "string" ? input.phoneNumber.trim() : "";
  const whatsappRaw =
    typeof input.whatsappNumber === "string" ? input.whatsappNumber.trim() : "";
  const instagramRaw =
    typeof input.instagramUrl === "string" ? input.instagramUrl.trim() : "";

  if (phoneNumber.length > MAX_CONTACT_PHONE_LENGTH) {
    return {
      ok: false,
      error: `Phone number must be ${MAX_CONTACT_PHONE_LENGTH} characters or fewer.`,
    };
  }

  if (phoneNumber && !PHONE_PATTERN.test(phoneNumber)) {
    return {
      ok: false,
      error:
        "Phone number can only contain digits, spaces, +, -, parentheses and dots.",
    };
  }

  const phoneDigits = phoneNumber.replace(/\D/g, "");

  if (phoneNumber && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
    return {
      ok: false,
      error: "Phone number must contain 7 to 15 digits.",
    };
  }

  if (whatsappRaw && !PHONE_PATTERN.test(whatsappRaw)) {
    return {
      ok: false,
      error:
        "WhatsApp number can only contain digits, spaces, +, -, parentheses and dots.",
    };
  }

  const whatsappNumber = whatsappRaw.replace(/\D/g, "");

  if (
    whatsappNumber &&
    (whatsappNumber.length < 7 || whatsappNumber.length > 15)
  ) {
    return {
      ok: false,
      error:
        "WhatsApp number must include the country code and contain 7 to 15 digits, with no + or spaces.",
    };
  }

  let instagramUrl = instagramRaw;

  if (instagramUrl) {
    if (instagramUrl.startsWith("@")) {
      instagramUrl = `https://www.instagram.com/${instagramUrl.slice(1).replace(/^\/+/, "")}`;
    } else if (!/^https?:\/\//i.test(instagramUrl)) {
      instagramUrl = `https://${instagramUrl}`;
    }

    let parsed: URL;

    try {
      parsed = new URL(instagramUrl);
    } catch {
      return {
        ok: false,
        error: "Enter a valid Instagram profile URL.",
      };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        ok: false,
        error: "Instagram URL must start with http:// or https://.",
      };
    }

    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    if (hostname !== "instagram.com") {
      return {
        ok: false,
        error: "Enter an instagram.com profile URL.",
      };
    }

    instagramUrl = parsed.toString();

    if (instagramUrl.length > MAX_CONTACT_INSTAGRAM_LENGTH) {
      return {
        ok: false,
        error: `Instagram URL must be ${MAX_CONTACT_INSTAGRAM_LENGTH} characters or fewer.`,
      };
    }
  }

  return {
    ok: true,
    value: {
      phoneNumber,
      whatsappNumber,
      instagramUrl,
    },
  };
}

/** Build a dialable tel: link while keeping the visible number readable. */
export function telHref(phoneNumber: string) {
  const trimmed = phoneNumber.trim();
  if (!trimmed) return "";

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

/** Build a wa.me link. The number is stored as digits only. */
export function whatsappHref(whatsappNumber: string) {
  const digits = whatsappNumber.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}
