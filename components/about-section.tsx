import Image from "next/image";
import {
  bodyCopyClass,
  container,
  eyebrowClass,
  eyebrowLineClass,
  sectionPadding,
} from "@/lib/styles";
import { cn } from "@/lib/utils";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={cn(sectionPadding, "bg-paper")}
    >
      <div
        className={cn(
          container,
          "flex flex-col gap-8 md:grid md:grid-cols-[.82fr_1.18fr] md:items-center md:gap-[10%]",
        )}
      >
        <div className="relative min-h-[320px] overflow-hidden bg-champagne md:min-h-[520px]">
          <Image
            src="/images/traditional-henna.jpg"
            alt="Illustrative traditional mehendi detail on palms; not Janu’s client work"
            fill
            sizes="(max-width: 767px) 88vw, 38vw"
            className="object-cover"
          />
          <div className="absolute right-3 bottom-3 left-3 bg-ivory/92 px-3 py-2 font-mono text-[6px] tracking-[0.08em] text-[#75695d] uppercase md:right-4 md:bottom-4 md:left-4 md:text-[7px]">
            Illustrative image · not actual client work
          </div>
        </div>

        <div>
          <div className={eyebrowClass}>
            <span className={eyebrowLineClass} aria-hidden="true" />
            About Mehandi by Janu
          </div>
          <h2
            id="about-title"
            className="mt-4 max-w-[690px] font-serif text-[clamp(39px,10vw,53px)] leading-[1.03] font-normal tracking-[-0.025em] text-burgundy md:text-[clamp(39px,4.4vw,59px)]"
          >
            Mehandi by Janu – Best Mehandi Artist in Tiruppur
          </h2>
          <div className="mt-6 space-y-4 md:mt-7">
            <p className={bodyCopyClass}>
              Welcome to Mehandi by Janu, your destination for beautiful and
              elegant mehendi designs in Tiruppur (Tirupur), Tamil Nadu. We
              specialize in creating unique henna designs that add beauty to
              your special moments. From traditional South Indian bridal
              mehendi to modern Arabic mehndi designs, we offer creative and
              detailed patterns tailored to your style and preferences.
            </p>
            <p className={bodyCopyClass}>
              At Mehandi by Janu, every design is created with care, creativity,
              and attention to detail. Whether you are looking for an elegant
              bridal henna design, a stylish Arabic pattern, or a simple and
              beautiful mehendi design, we aim to make your occasion memorable.
            </p>
            <p className={bodyCopyClass}>
              If you are searching for a Mehandi Artist in Tiruppur, Mehandi
              Artist in Tirupur, Best Mehendi Artist in Tiruppur, Bridal
              Mehendi Artist in Tirupur, Arabic Mehendi Artist, or Professional
              Henna Artist near you, Mehandi by Janu is here to help you
              celebrate your special moments with beautiful mehendi art.
            </p>
            <p className={bodyCopyClass}>
              Book your mehendi appointment with Mehandi by Janu and make your
              special day even more beautiful!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
