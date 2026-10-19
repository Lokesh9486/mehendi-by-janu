"use client";

import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation } from "@/lib/site-data";

export function MobileNav() {
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
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-burgundy/15 px-6 py-4 font-serif text-[27px] leading-none text-burgundy transition-colors hover:bg-champagne/35"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-6 pt-6">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between bg-burgundy px-5 py-4 text-[11px] tracking-[0.06em] text-ivory"
            >
              Book Your Mehendi
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
