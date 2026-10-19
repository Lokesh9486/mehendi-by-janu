"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type EnquiryContextValue = {
  selectedService: string;
  selectService: (service: string) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState("");

  const value = useMemo(
    () => ({ selectedService, selectService: setSelectedService }),
    [selectedService],
  );

  return (
    <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const context = useContext(EnquiryContext);

  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }

  return context;
}
