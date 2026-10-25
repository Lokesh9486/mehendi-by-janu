"use client";

import { useEffect, useState } from "react";
import { AtSign, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import {
  MAX_CONTACT_INSTAGRAM_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
  type SiteContact,
  validateSiteContact,
} from "@/lib/site-contact";

type ContactFormProps = {
  onSessionExpired: () => void;
};

const fieldClass =
  "h-11 rounded-none border-burgundy/25 bg-ivory/70 px-3.5 text-[13px] focus-visible:ring-burgundy/20";

const labelClass =
  "font-mono text-[9px] tracking-[0.14em] text-burgundy uppercase";

const hintClass =
  "font-mono text-[8px] leading-[1.5] tracking-[0.04em] text-[#857a6d]";

function formatSavedAt(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ContactForm({ onSessionExpired }: ContactFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContact() {
      try {
        const response = await fetch("/api/admin/site-contact", {
          cache: "no-store",
        });

        if (cancelled) return;

        if (response.status === 401) {
          onSessionExpired();
          return;
        }

        const data = (await response.json().catch(() => ({}))) as {
          contact?: SiteContact;
          error?: string;
        };

        if (!response.ok || !data.contact) {
          throw new Error(data.error ?? "Could not load the contact details.");
        }

        if (!cancelled) {
          setPhoneNumber(data.contact.phoneNumber);
          setWhatsappNumber(data.contact.whatsappNumber);
          setInstagramUrl(data.contact.instagramUrl);
          setUpdatedAt(data.contact.updatedAt);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not load the contact details. Please refresh.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadContact();

    return () => {
      cancelled = true;
    };
  }, [onSessionExpired]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validation = validateSiteContact({
      phoneNumber,
      whatsappNumber,
      instagramUrl,
    });

    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/site-contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.value),
      });

      if (response.status === 401) {
        onSessionExpired();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as {
        contact?: SiteContact;
        error?: string;
      };

      if (!response.ok || !data.contact) {
        setError(data.error ?? "The contact details could not be saved.");
        return;
      }

      setPhoneNumber(data.contact.phoneNumber);
      setWhatsappNumber(data.contact.whatsappNumber);
      setInstagramUrl(data.contact.instagramUrl);
      setUpdatedAt(data.contact.updatedAt);

      toast.add({
        type: "success",
        title: "Contact details saved",
        description:
          "The footer and enquiry form now use these contact details.",
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the server. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[560px] border border-burgundy/20 bg-paper p-6 md:p-8">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-[#857a6d] uppercase">
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          Loading contact details…
        </p>
      </div>
    );
  }

  const savedAt =
    phoneNumber || whatsappNumber || instagramUrl
      ? formatSavedAt(updatedAt)
      : null;

  return (
    <div className="max-w-[560px] border border-burgundy/20 bg-paper p-6 md:p-8">
      <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.19em] text-burgundy uppercase">
        <span className="h-px w-[26px] bg-gold" aria-hidden="true" />
        Public contact
      </div>
      <h2 className="mt-4 font-serif text-[28px] leading-tight font-normal text-burgundy">
        Contact details
      </h2>
      <p className="mt-2 text-[12px] leading-[1.7] text-[#6d635a]">
        These details appear in the site footer and on the contact section. The
        WhatsApp number is also used by the enquiry form.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="contact-phone" className={labelClass}>
            Phone number
          </Label>
          <Input
            id="contact-phone"
            name="phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={MAX_CONTACT_PHONE_LENGTH}
            placeholder="+91 98765 43210"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className={fieldClass}
          />
          <p className={hintClass}>
            Shown as a tap-to-call link. Leave empty to hide the phone link.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-whatsapp" className={labelClass}>
            WhatsApp number
          </Label>
          <Input
            id="contact-whatsapp"
            name="whatsappNumber"
            type="tel"
            inputMode="tel"
            maxLength={24}
            placeholder="919876543210"
            value={whatsappNumber}
            onChange={(event) => setWhatsappNumber(event.target.value)}
            className={fieldClass}
          />
          <p className={hintClass}>
            Country code + number, digits only. Spaces and + are removed when
            saved.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-instagram" className={labelClass}>
            Instagram profile
          </Label>
          <Input
            id="contact-instagram"
            name="instagramUrl"
            type="url"
            autoComplete="url"
            maxLength={MAX_CONTACT_INSTAGRAM_LENGTH}
            placeholder="https://www.instagram.com/your_handle/"
            value={instagramUrl}
            onChange={(event) => setInstagramUrl(event.target.value)}
            className={fieldClass}
          />
          <p className={hintClass}>
            Paste the full profile URL, or enter @your_handle.
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            aria-live="polite"
            className="border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[11px] leading-[1.6] text-destructive"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 rounded-none border border-burgundy bg-burgundy px-6 text-[11px] tracking-[0.08em] text-ivory transition-colors hover:border-olive hover:bg-olive"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                Save contact details
              </>
            )}
          </Button>

          {savedAt ? (
            <span className="font-mono text-[8px] tracking-[0.06em] text-[#857a6d] uppercase">
              Last saved {savedAt}
            </span>
          ) : null}
        </div>
      </form>

      <p className="mt-6 flex items-start gap-2 border-t border-burgundy/12 pt-4 text-[10px] leading-[1.7] text-[#6d635a]">
        <AtSign className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
        Empty fields stay hidden on the public site. The WhatsApp enquiry
        button stays disabled until a WhatsApp number is saved.
      </p>
    </div>
  );
}
