"use client";

import { faqs } from "@/lib/site-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion() {
  return (
    <Accordion className="border-t border-burgundy/25">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.question}
          value={`faq-${index}`}
          className="border-b border-burgundy/25"
        >
          <AccordionTrigger className="items-center gap-5 py-5 font-serif text-[20px] leading-[1.2] font-medium text-burgundy hover:no-underline md:text-[23px] [&_svg]:size-4 [&_svg]:text-gold">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[12px] leading-[1.85] text-[#625b52] md:text-[12.5px]">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
