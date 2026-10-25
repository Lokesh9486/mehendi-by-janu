"use client";

import { ArrowUpRight } from "lucide-react";
import { useSiteContact } from "@/components/site-contact-provider";
import { telHref, whatsappHref } from "@/lib/site-contact";

type ContactLinksProps = {
  /** Footer links are stacked; inline links are compact pills. */
  variant?: "footer" | "inline";
};

const inlineLinkClass =
  "inline-flex items-center gap-1.5 border border-burgundy/15 bg-ivory/60 px-2.5 py-1 font-mono text-[8px] tracking-[0.1em] text-burgundy uppercase transition-colors hover:border-burgundy/35 hover:bg-champagne/40";

export function ContactLinks({ variant = "footer" }: ContactLinksProps) {
  const { contact, isLoading } = useSiteContact();
  const isFooter = variant === "footer";
  const hasContact = Boolean(
    contact.phoneNumber || contact.instagramUrl || contact.whatsappNumber,
  );

  if (isLoading) {
    if (isFooter) {
      return (
        <div className="mt-1 space-y-1.5" aria-hidden="true">
          <span className="block h-3 w-36 animate-pulse bg-ivory/10" />
          <span className="block h-3 w-24 animate-pulse bg-ivory/10" />
          <span className="block h-3 w-40 animate-pulse bg-ivory/10" />
        </div>
      );
    }

    return (
      <span
        className="block h-6 w-52 animate-pulse rounded-sm bg-champagne/60"
        aria-hidden="true"
      />
    );
  }

  if (!hasContact) return null;

  const links = (
    <>
      {contact.phoneNumber ? (
        <a
          href={telHref(contact.phoneNumber)}
          className={
            isFooter
              ? "mt-1 flex items-center gap-1 hover:text-ivory"
              : inlineLinkClass
          }
        >
          {isFooter ? `Phone ${contact.phoneNumber}` : "Call"}
        </a>
      ) : null}

      {contact.instagramUrl ? (
        <a
          href={contact.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isFooter
              ? "mt-1 flex items-center gap-1 hover:text-ivory"
              : inlineLinkClass
          }
        >
          Instagram
          {isFooter ? (
            <ArrowUpRight className="size-3" aria-hidden="true" />
          ) : null}
        </a>
      ) : null}

      {contact.whatsappNumber ? (
        <a
          href={whatsappHref(contact.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className={
            isFooter
              ? "mt-1 flex items-center gap-1 hover:text-ivory"
              : inlineLinkClass
          }
        >
          {isFooter ? "WhatsApp enquiries" : "WhatsApp"}
          {isFooter ? (
            <ArrowUpRight className="size-3" aria-hidden="true" />
          ) : null}
        </a>
      ) : null}
    </>
  );

  if (isFooter) return links;

  return <div className="flex flex-wrap items-center gap-2">{links}</div>;
}
