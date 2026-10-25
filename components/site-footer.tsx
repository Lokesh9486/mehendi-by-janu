import Link from "next/link";
import { FooterYear } from "@/components/footer-year";
import { ContactLinks } from "@/components/contact-links";
import { navigation, withAnchorPrefix } from "@/lib/site-data";
import { siteConfig } from "@/lib/siteConfig";

type SiteFooterProps = {
  anchorPrefix?: string;
};

export function SiteFooter({ anchorPrefix = "" }: SiteFooterProps) {
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
              <Link
                key={item.label}
                href={withAnchorPrefix(item.href, anchorPrefix)}
                data-testid={`link-footer-${item.label.toLowerCase()}`}
                className="text-[11px] text-ivory/75 transition-colors hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-[11px] leading-[1.8] text-ivory/65">
          <p className="mb-4 font-mono text-[8px] tracking-[0.17em] text-champagne/60 uppercase">
            Location &amp; contact
          </p>
          <p>{siteConfig.location}</p>
          <ContactLinks />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-1.5 pt-5 font-mono text-[7px] tracking-[0.1em] text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© <FooterYear /> Mehandi by Janu</span>
        <span className="flex items-center gap-2.5">
          <span>Tiruppur (Tirupur) · Tamil Nadu</span>
          <span aria-hidden="true" className="text-ivory/25">·</span>
          <Link
            href="/admin/login"
            data-testid="link-footer-admin"
            className="tracking-[0.14em] uppercase transition-colors hover:text-champagne"
          >
            Admin
          </Link>
        </span>
      </div>
    </footer>
  );
}
