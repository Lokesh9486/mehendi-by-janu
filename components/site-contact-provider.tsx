"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EMPTY_SITE_CONTACT,
  type SiteContact,
} from "@/lib/site-contact";

type SiteContactState = {
  contact: SiteContact;
  isLoading: boolean;
};

const SiteContactContext = createContext<SiteContactState>({
  contact: EMPTY_SITE_CONTACT,
  isLoading: true,
});

/**
 * Fetches the admin-managed contact details once and shares them with the
 * footer and the enquiry form. Public pages render immediately; the links
 * appear as soon as the request finishes.
 */
export function SiteContactProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<SiteContact>(EMPTY_SITE_CONTACT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadContact() {
      try {
        const response = await fetch("/api/site-contact", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json().catch(() => ({}))) as {
          contact?: SiteContact;
        };

        if (!cancelled && data.contact) {
          setContact({ ...EMPTY_SITE_CONTACT, ...data.contact });
        }
      } catch {
        // Keep the placeholders when the request fails.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadContact();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ contact, isLoading }),
    [contact, isLoading],
  );

  return (
    <SiteContactContext.Provider value={value}>
      {children}
    </SiteContactContext.Provider>
  );
}

export function useSiteContact() {
  return useContext(SiteContactContext);
}
