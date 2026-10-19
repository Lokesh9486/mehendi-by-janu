"use client";

import Link from "next/link";
import { useEnquiry } from "@/components/enquiry-context";
import type { ReactNode } from "react";

export function SelectServiceLink({
  service,
  className,
  children,
}: {
  service: string;
  className?: string;
  children: ReactNode;
}) {
  const { selectService } = useEnquiry();

  return (
    <Link
      href="#contact"
      className={className}
      onClick={() => selectService(service)}
    >
      {children}
    </Link>
  );
}
