import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PageFrameProps = {
  children: ReactNode;
  anchorPrefix?: string;
};

export function PageFrame({ children, anchorPrefix = "" }: PageFrameProps) {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-[12px] focus:text-burgundy"
      >
        Skip to content
      </a>

      <div className="bg-burgundy px-4 py-2 text-center font-mono text-[8px] tracking-[0.14em] text-ivory/85 uppercase md:py-[9px] md:text-[10px]">
        Mehandi by Janu <span aria-hidden="true">·</span> Tiruppur (Tirupur),
        Tamil Nadu
      </div>

      <SiteHeader anchorPrefix={anchorPrefix} />

      <main id="main">{children}</main>

      <SiteFooter anchorPrefix={anchorPrefix} />
    </div>
  );
}
