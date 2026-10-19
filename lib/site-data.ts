export type Service = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export const services: Service[] = [
  { title: "Bridal Mehendi", description: "Intricate henna artistry designed to complement your bridal celebration.", image: "/images/bridal-mehendi-detail.jpg", alt: "Illustrative close-up of intricate bridal mehendi on hands; not Janu’s client work." },
  { title: "Engagement Mehendi", description: "Beautiful henna designs for the beginning of a new chapter.", image: "/images/engagement-henna.jpg", alt: "Illustrative engagement henna pattern on a hand; not Janu’s client work." },
  { title: "Arabic Mehendi", description: "Flowing motifs and graceful patterns with a contemporary feel.", image: "/images/arabic-henna.jpg", alt: "Illustrative flowing Arabic henna motifs with floral vines; not Janu’s client work." },
  { title: "Traditional Mehendi", description: "Classic motifs that honour the beauty of Indian tradition.", image: "/images/traditional-henna.jpg", alt: "Illustrative traditional Indian mehendi motifs on palms; not Janu’s client work." },
  { title: "Simple Mehendi Designs", description: "A considered touch of henna, kept light and lovely.", image: "/images/simple-henna.jpg", alt: "Illustrative simple henna details on a hand; not Janu’s client work." },
  { title: "Full Hand Mehendi", description: "Detailed compositions that travel across the hand.", image: "/images/full-hand-henna.jpg", alt: "Illustrative detailed full-hand henna composition; not Janu’s client work." },
  { title: "Front Hand Mehendi", description: "A thoughtfully composed design for the palm and fingers.", image: "/images/front-hand-henna.jpg", alt: "Illustrative henna design across the palm and fingers; not Janu’s client work." },
  { title: "Back Hand Mehendi", description: "An expressive pattern made to be seen from every angle.", image: "/images/back-hand-henna.jpg", alt: "Illustrative henna pattern on the back of a hand; not Janu’s client work." },
  { title: "Indian Mehndi Designs", description: "Indian motifs and patterns for meaningful celebrations.", image: "/images/indian-mehndi.jpg", alt: "Illustrative Indian mehndi motifs for a celebration; not Janu’s client work." },
  { title: "Minimal Mehendi", description: "Delicate, understated designs for a simple and elegant look.", image: "/images/minimal-henna.jpg", alt: "Illustrative minimal henna sprigs with open space on the hand; not Janu’s client work." },
  { title: "Baby Shower Mehendi", description: "A personal henna detail for a joyful gathering.", image: "/images/baby-shower-henna.jpg", alt: "Illustrative henna detail for a baby shower gathering; not Janu’s client work." },
  { title: "Festival Mehendi", description: "Patterns for festive days, family, and celebration.", image: "/images/festival-henna.jpg", alt: "Illustrative festive henna design on a hand; not Janu’s client work." },
  { title: "Special Occasion Henna Art", description: "A design for the moments that deserve to be remembered.", image: "/images/special-occasion-henna.jpg", alt: "Illustrative henna art for a special occasion; not Janu’s client work." },
];

export const galleryCategories = [
  { label: "All designs", titles: services.map((service) => service.title) },
  { label: "Bridal", titles: ["Bridal Mehendi"] },
  { label: "Arabic", titles: ["Arabic Mehendi"] },
  { label: "Traditional", titles: ["Traditional Mehendi", "Indian Mehndi Designs"] },
  { label: "Simple & minimal", titles: ["Simple Mehendi Designs", "Minimal Mehendi"] },
  { label: "Celebrations", titles: ["Engagement Mehendi", "Baby Shower Mehendi", "Festival Mehendi", "Special Occasion Henna Art"] },
];

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const occasions = ["Wedding", "Engagement", "Baby Shower", "Festival", "Other"];

export const qualities = [
  { number: "01", title: "Careful detail", description: "A considered approach to every line, motif, and composition." },
  { number: "02", title: "Your preferences", description: "Designs shaped around your own style and preferences." },
  { number: "03", title: "Tradition & today", description: "Traditional South Indian and modern Arabic design options." },
];

export const bookingSteps = [
  { number: "01", title: "Choose a service", description: "Select the mehendi style that feels right for your occasion." },
  { number: "02", title: "Share the details", description: "Tell us your event date, location, and design preferences." },
  { number: "03", title: "Enquire with Janu", description: "Discuss availability and confirm your appointment directly with the artist." },
];

export const faqs = [
  {
    question: "What mehendi services are available?",
    answer: "Services include bridal, engagement, Arabic, traditional, simple, full hand, front hand, back hand, Indian mehndi, minimal, baby shower, festival, and special occasion henna art.",
  },
  {
    question: "How do I enquire about an appointment?",
    answer: "Use the enquiry form to share your contact number, preferred service, event date, and event location. Appointment details are confirmed directly with Janu.",
  },
  {
    question: "Can I share a design reference?",
    answer: "You can describe your preferred design in the optional message field and discuss your references directly with Janu.",
  },
  {
    question: "What are the prices and available dates?",
    answer: "Pricing and availability have not been provided here. Please enquire with your preferred date and service to discuss these details.",
  },
  {
    question: "Where are services located?",
    answer: "Mehandi by Janu is in Tiruppur (Tirupur), Tamil Nadu. Share your event location in the enquiry to discuss your requirements.",
  },
];
