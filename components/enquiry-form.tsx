"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useEnquiry } from "@/components/enquiry-context";
import { useSiteContact } from "@/components/site-contact-provider";
import { whatsappHref } from "@/lib/site-contact";
import { occasions, services } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const fieldClass =
  "h-auto min-h-[45px] w-full rounded-none border-[#d7cbb8] bg-paper px-3 py-3 text-[13px] text-ink placeholder:text-[#94897a] focus-visible:border-burgundy focus-visible:ring-0 md:text-[12px]";

const labelClass =
  "mb-2 block font-mono text-[9px] tracking-[0.13em] text-burgundy uppercase";

export function EnquiryForm() {
  const { selectedService, selectService } = useEnquiry();
  const { contact, isLoading: isLoadingContact } = useSiteContact();
  const [occasion, setOccasion] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = new Date();
      setMinDate(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function submitEnquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const eventOccasion = String(formData.get("occasion") || "");
    const date = String(formData.get("date") || "");
    const location = String(formData.get("eventLocation") || "").trim();
    const style = String(formData.get("style") || "");
    const details = String(formData.get("details") || "").trim();
    const digits = phone.replace(/\D/g, "");

    if (
      !name ||
      !phone ||
      !eventOccasion ||
      !date ||
      !location ||
      !style
    ) {
      setMessageIsError(true);
      setMessage("Please complete all required fields before preparing your enquiry.");
      return;
    }

    if (digits.length < 7 || digits.length > 15) {
      setMessageIsError(true);
      setMessage("Please enter a phone number with 7 to 15 digits.");
      return;
    }

    if (isLoadingContact) {
      setMessageIsError(true);
      setMessage(
        "Contact details are still loading. Please try again in a moment.",
      );
      return;
    }

    const whatsappNumber = contact.whatsappNumber.trim();

    if (!whatsappNumber) {
      setMessageIsError(true);
      setMessage(
        "Your enquiry is ready, but WhatsApp contact has not been configured yet. Nothing has been sent. Please contact Mehandi by Janu once verified contact details are available.",
      );
      return;
    }

    const chatUrl = whatsappHref(whatsappNumber);

    if (!chatUrl) {
      setMessageIsError(true);
      setMessage(
        "The saved WhatsApp number is not valid. Please contact Mehandi by Janu directly.",
      );
      return;
    }
    const enquiry = [
      "Hello Janu, I would like to enquire about a mehendi appointment.",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Occasion: ${eventOccasion}`,
      `Preferred date: ${date}`,
      `Event location: ${location}`,
      `Mehendi service: ${style}`,
      details ? `Additional details: ${details}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const draft = window.open(
      `${chatUrl}?text=${encodeURIComponent(enquiry)}`,
      "_blank",
      "noopener,noreferrer",
    );

    if (draft) {
      setMessageIsError(false);
      setMessage(
        "WhatsApp has opened with your enquiry draft. Please review and send it there; your appointment is not confirmed until Janu replies.",
      );
    } else {
      setMessageIsError(true);
      setMessage(
        "Your browser blocked the WhatsApp window. Please allow pop-ups and submit again; nothing was sent.",
      );
    }
  }

  return (
    <Card className="gap-0 rounded-none border border-champagne bg-paper p-6 ring-0 md:p-9 lg:p-11">
      <CardContent className="p-0">
        <form onSubmit={submitEnquiry}>
          <div className="grid grid-cols-1 gap-x-3.5 gap-y-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" className={labelClass}>
                Your name
              </Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Name"
                required
                maxLength={80}
                data-testid="input-enquiry-name"
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="phone" className={labelClass}>
                Contact number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="Include country code if known"
                required
                maxLength={24}
                data-testid="input-enquiry-phone"
                className={fieldClass}
              />
            </div>

            <div>
              <Label htmlFor="occasion" className={labelClass}>
                Occasion
              </Label>
              <Select
                name="occasion"
                required
                value={occasion || null}
                onValueChange={(value) => setOccasion(value ?? "")}
              >
                <SelectTrigger
                  id="occasion"
                  data-testid="select-enquiry-occasion"
                  aria-label="Occasion"
                  className={`${fieldClass} data-placeholder:text-[#94897a]`}
                >
                  <SelectValue placeholder="Select an occasion" />
                </SelectTrigger>
                <SelectContent className="bg-paper">
                  {occasions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date" className={labelClass}>
                Event date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                min={minDate}
                required
                data-testid="input-enquiry-date"
                className={fieldClass}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="eventLocation" className={labelClass}>
                Event location
              </Label>
              <Input
                id="eventLocation"
                name="eventLocation"
                autoComplete="address-level2"
                placeholder="Town or event venue"
                required
                maxLength={120}
                data-testid="input-enquiry-location"
                className={fieldClass}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="style" className={labelClass}>
                Preferred service
              </Label>
              <Select
                name="style"
                required
                value={selectedService || null}
                onValueChange={(value) => selectService(value ?? "")}
              >
                <SelectTrigger
                  id="style"
                  data-testid="select-enquiry-style"
                  aria-label="Preferred mehendi service"
                  className={`${fieldClass} data-placeholder:text-[#94897a]`}
                >
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent className="bg-paper">
                  {services.map((service) => (
                    <SelectItem key={service.title} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="details" className={labelClass}>
                Message{" "}
                <span className="normal-case tracking-normal text-[#8b8176]">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="details"
                name="details"
                maxLength={1000}
                placeholder="Share any design preferences or details to discuss."
                data-testid="input-enquiry-details"
                className={`${fieldClass} min-h-[110px] resize-y py-3`}
              />
            </div>
          </div>

          <p className="mt-4 max-w-[430px] text-[9px] leading-[1.6] text-[#847a6e]">
            Your details are not submitted or stored by this website. If
            WhatsApp is configured, a draft opens for you to review and send.
          </p>

          <Button
            type="submit"
            size="lg"
            data-testid="button-submit-enquiry"
            className="mt-5 h-auto w-full justify-between rounded-none border border-burgundy bg-burgundy px-5 py-4 text-[11px] tracking-[0.05em] text-ivory transition-colors hover:bg-olive"
          >
            Prepare WhatsApp Enquiry
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>

          <p
            className={`mt-3 min-h-[18px] text-[10px] leading-[1.55] ${
              messageIsError ? "text-destructive" : "text-[#71685e]"
            }`}
            aria-live="polite"
            role={messageIsError ? "alert" : "status"}
            data-testid="status-enquiry"
          >
            {message}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
