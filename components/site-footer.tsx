import { ArrowUpRight } from "lucide-react";
import { FooterYear } from "@/components/footer-year";
import { navigation } from "@/lib/site-data";
import { siteConfig } from "@/lib/siteConfig";

export function SiteFooter() {
  return (
    <footer className="bg-burgundy px-[6%] pt-[58px] pb-6 text-ivory">
      <div className="mx-auto grid w-full max-w-[1320px] gap-9 border-b border-champagne/20 pb-11 md:grid-cols-[1.5fr_.7fr_1fr] md:gap-12">
        <div>
          <p className="font-serif text-[22px] tracking-[0.02em]">
            MEHANDI BY JANU
            <small className="mt-2 block max-w-[270px] font-sans text-[11px] leading-[1.6] tracking-normal text-ivory/60">
              Beautiful henna for life’s special moments.
            </small>
          </p>
        </div>

        <div>
          <p className="mb-4 font-mono text-[8px] tracking-[0.17em] text-champagne/60 uppercase">
            Explore
          </p>
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-5 gap-y-2.5 md:grid-cols-1"
          >
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                data-testid={`link-footer-${item.label.toLowerCase()}`}
                className="text-[11px] text-ivory/75 transition-colors hover:text-ivory"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="text-[11px] leading-[1.8] text-ivory/65">
          <p className="mb-4 font-mono text-[8px] tracking-[0.17em] text-champagne/60 uppercase">
            Location &amp; contact
          </p>
          <p>{siteConfig.location}</p>
          {siteConfig.phoneNumber ? (
            <a
              href={`tel:${siteConfig.phoneNumber}`}
              className="mt-1 flex items-center gap-1 hover:text-ivory"
            >
              Phone {siteConfig.phoneNumber}
            </a>
          ) : (
            <p className="mt-1">Phone contact to be added.</p>
          )}
          {siteConfig.instagramUrl ? (
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 hover:text-ivory"
            >
              Instagram
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : (
            <p className="mt-1">Instagram details to be added.</p>
          )}
          {siteConfig.whatsappNumber ? (
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 hover:text-ivory"
            >
              WhatsApp enquiries
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : (
            <p className="mt-1">WhatsApp contact to be added.</p>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-1.5 pt-5 font-mono text-[7px] tracking-[0.1em] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© <FooterYear /> Mehandi by Janu</span>
        <span>Tiruppur (Tirupur) · Tamil Nadu</span>
      </div>
    </footer>
  );
}
