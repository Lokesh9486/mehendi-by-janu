"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation, withAnchorPrefix } from "@/lib/site-data";

type MobileNavProps = {
  anchorPrefix?: string;
};

export function MobileNav({ anchorPrefix = "" }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          data-testid="button-mobile-menu"
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-none text-burgundy hover:bg-champagne/60"
              aria-label="Open navigation menu"
            />
          }
        >
          <Menu className="size-5" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent
          side="top"
          className="gap-0 border-b border-burgundy/20 bg-paper px-0 pt-16 pb-6"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Main navigation for Mehandi by Janu
          </SheetDescription>
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={withAnchorPrefix(item.href, anchorPrefix)}
                onClick={() => setOpen(false)}
                className="border-b border-burgundy/15 px-6 py-4 font-serif text-[27px] leading-none text-burgundy transition-colors hover:bg-champagne/35"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pt-6">
            <Link
              href={withAnchorPrefix("#contact", anchorPrefix)}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between bg-burgundy px-5 py-4 text-[11px] tracking-[0.06em] text-ivory"
            >
              Book Your Mehendi
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
