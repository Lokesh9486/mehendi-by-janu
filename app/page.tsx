'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/lib/siteConfig';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronRight, MapPin, Menu, X } from 'lucide-react';

type Service = { title: string; description: string; image: string; alt: string };

const services: Service[] = [
  { title: 'Bridal Mehendi', description: 'Intricate henna artistry designed to complement your bridal celebration.', image: '/images/bridal-mehendi-detail.jpg', alt: 'Illustrative close-up of intricate bridal mehendi on hands; not Janu’s client work.' },
  { title: 'Engagement Mehendi', description: 'Beautiful henna designs for the beginning of a new chapter.', image: '/images/engagement-henna.jpg', alt: 'Illustrative engagement henna pattern on a hand; not Janu’s client work.' },
  { title: 'Arabic Mehendi', description: 'Flowing motifs and graceful patterns with a contemporary feel.', image: '/images/arabic-henna.jpg', alt: 'Illustrative flowing Arabic henna motifs with floral vines; not Janu’s client work.' },
  { title: 'Traditional Mehendi', description: 'Classic motifs that honour the beauty of Indian tradition.', image: '/images/traditional-henna.jpg', alt: 'Illustrative traditional Indian mehendi motifs on palms; not Janu’s client work.' },
  { title: 'Simple Mehendi Designs', description: 'A considered touch of henna, kept light and lovely.', image: '/images/simple-henna.jpg', alt: 'Illustrative simple henna details on a hand; not Janu’s client work.' },
  { title: 'Full Hand Mehendi', description: 'Detailed compositions that travel across the hand.', image: '/images/full-hand-henna.jpg', alt: 'Illustrative detailed full-hand henna composition; not Janu’s client work.' },
  { title: 'Front Hand Mehendi', description: 'A thoughtfully composed design for the palm and fingers.', image: '/images/front-hand-henna.jpg', alt: 'Illustrative henna design across the palm and fingers; not Janu’s client work.' },
  { title: 'Back Hand Mehendi', description: 'An expressive pattern made to be seen from every angle.', image: '/images/back-hand-henna.jpg', alt: 'Illustrative henna pattern on the back of a hand; not Janu’s client work.' },
  { title: 'Indian Mehndi Designs', description: 'Indian motifs and patterns for meaningful celebrations.', image: '/images/indian-mehndi.jpg', alt: 'Illustrative Indian mehndi motifs for a celebration; not Janu’s client work.' },
  { title: 'Minimal Mehendi', description: 'Delicate, understated designs for a simple and elegant look.', image: '/images/minimal-henna.jpg', alt: 'Illustrative minimal henna sprigs with open space on the hand; not Janu’s client work.' },
  { title: 'Baby Shower Mehendi', description: 'A personal henna detail for a joyful gathering.', image: '/images/baby-shower-henna.jpg', alt: 'Illustrative henna detail for a baby shower gathering; not Janu’s client work.' },
  { title: 'Festival Mehendi', description: 'Patterns for festive days, family, and celebration.', image: '/images/festival-henna.jpg', alt: 'Illustrative festive henna design on a hand; not Janu’s client work.' },
  { title: 'Special Occasion Henna Art', description: 'A design for the moments that deserve to be remembered.', image: '/images/special-occasion-henna.jpg', alt: 'Illustrative henna art for a special occasion; not Janu’s client work.' },
];

const galleryCategories = [
  { label: 'All designs', titles: services.map((service) => service.title) },
  { label: 'Bridal', titles: ['Bridal Mehendi'] },
  { label: 'Arabic', titles: ['Arabic Mehendi'] },
  { label: 'Traditional', titles: ['Traditional Mehendi', 'Indian Mehndi Designs'] },
  { label: 'Simple & minimal', titles: ['Simple Mehendi Designs', 'Minimal Mehendi'] },
  { label: 'Celebrations', titles: ['Engagement Mehendi', 'Baby Shower Mehendi', 'Festival Mehendi', 'Special Occasion Henna Art'] },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [activeCategory, setActiveCategory] = useState('All designs');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [today, setToday] = useState<Date | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const navigation = [['Home', '#home'], ['About', '#about'], ['Services', '#services'], ['Gallery', '#gallery'], ['FAQ', '#faq'], ['Contact', '#contact']];
  const occasions = ['Wedding', 'Engagement', 'Baby Shower', 'Festival', 'Other'];
  const minDate = today ? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}` : '';
  const visibleGallery = services.filter((service) => galleryCategories.find((category) => category.label === activeCategory)?.titles.includes(service.title));

  useEffect(() => {
    const timer = window.setTimeout(() => setToday(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') setLightboxIndex((current) => current === null ? 0 : (current + 1) % visibleGallery.length);
      if (event.key === 'ArrowLeft') setLightboxIndex((current) => current === null ? 0 : (current - 1 + visibleGallery.length) % visibleGallery.length);
      if (event.key === 'Tab') {
        const controls = Array.from(document.querySelectorAll<HTMLElement>('.lightbox button'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, visibleGallery.length]);

  function closeLightbox() {
    setLightboxIndex(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }

  function chooseService(title: string) {
    setSelectedService(title);
    setMessage('');
  }

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const occasion = String(formData.get('occasion') || '');
    const date = String(formData.get('date') || '');
    const location = String(formData.get('eventLocation') || '').trim();
    const style = String(formData.get('style') || '');
    const details = String(formData.get('details') || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      setMessageIsError(true);
      setMessage('Please enter a phone number with 7 to 15 digits.');
      return;
    }
    if (!siteConfig.whatsappNumber.trim()) {
      setMessageIsError(true);
      setMessage('Your enquiry is ready, but WhatsApp contact has not been configured yet. Nothing has been sent. Please contact Mehandi by Janu once verified contact details are available.');
      return;
    }
    const number = siteConfig.whatsappNumber.replace(/\D/g, '');
    const enquiry = [
      'Hello Janu, I would like to enquire about a mehendi appointment.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Occasion: ${occasion}`,
      `Preferred date: ${date}`,
      `Event location: ${location}`,
      `Mehendi service: ${style}`,
      details ? `Additional details: ${details}` : '',
    ].filter(Boolean).join('\n');
    const draft = window.open(`https://wa.me/${number}?text=${encodeURIComponent(enquiry)}`, '_blank', 'noopener,noreferrer');
    if (draft) {
      setMessageIsError(false);
      setMessage('WhatsApp has opened with your enquiry draft. Please review and send it there; your appointment is not confirmed until Janu replies.');
    } else {
      setMessageIsError(true);
      setMessage('Your browser blocked the WhatsApp window. Please allow pop-ups and submit again; nothing was sent.');
    }
  }

  return (
    <div className="site-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="topline">Mehandi by Janu <span aria-hidden="true">·</span> Tiruppur (Tirupur), Tamil Nadu</div>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Mehandi by Janu, home">
            <img className="wordmark-logo" src="/images/mehandi-by-janu-logo.webp" alt="" width="280" height="202" />
            <span className="wordmark-copy">MEHANDI BY JANU<small>HENNA · TIRUPPUR</small></span>
          </a>
          <nav id="mobile-navigation" className={`nav-links${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            {navigation.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</a>)}
          </nav>
          <a className="header-book" href="#contact">Book Your Mehendi <ArrowUpRight size={14} aria-hidden="true" /></a>
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">Mehandi artistry · Tiruppur, Tamil Nadu</div>
            <h1 id="hero-title">Mehendi Art for Your Most Beautiful Moments</h1>
            <p className="hero-lede">Beautiful and elegant mehendi designs for special moments in Tiruppur (Tirupur), Tamil Nadu.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#contact">Book Your Mehendi <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a className="button-quiet" href="#gallery">Explore Designs <ArrowDown size={14} aria-hidden="true" /></a>
            </div>
            <div className="hero-tags">Bridal <span>·</span> Arabic <span>·</span> Traditional <span>·</span> Special occasions</div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src="/images/bridal-hands.jpg" alt="Illustrative close-up of hands decorated with bridal henna; not Janu’s client work" width="1024" height="1024" fetchPriority="high" />
              <div className="image-caption">Illustrative photograph · not actual client work</div>
            </div>
            <div className="hero-index">01 — HENNA FOR YOUR MOMENT</div>
          </div>
        </section>

        <section className="section intro" id="about" aria-labelledby="about-title">
          <div className="intro-photo">
            <img src="/images/traditional-henna.jpg" alt="Illustrative traditional mehendi detail on palms; not Janu’s client work" width="1024" height="1024" loading="lazy" />
            <div className="intro-note">Illustrative image · not actual client work</div>
          </div>
          <div className="intro-copy">
            <div className="eyebrow">About Mehandi by Janu</div>
            <h2 id="about-title">Mehandi by Janu – Best Mehandi Artist in Tiruppur</h2>
            <div className="approved-copy">
              <p>Welcome to Mehandi by Janu, your destination for beautiful and elegant mehendi designs in Tiruppur (Tirupur), Tamil Nadu. We specialize in creating unique henna designs that add beauty to your special moments. From traditional South Indian bridal mehendi to modern Arabic mehndi designs, we offer creative and detailed patterns tailored to your style and preferences.</p>
              <p>At Mehandi by Janu, every design is created with care, creativity, and attention to detail. Whether you are looking for an elegant bridal henna design, a stylish Arabic pattern, or a simple and beautiful mehendi design, we aim to make your occasion memorable.</p>
              <p>If you are searching for a Mehandi Artist in Tiruppur, Mehandi Artist in Tirupur, Best Mehendi Artist in Tiruppur, Bridal Mehendi Artist in Tirupur, Arabic Mehendi Artist, or Professional Henna Artist near you, Mehandi by Janu is here to help you celebrate your special moments with beautiful mehendi art.</p>
              <p>Book your mehendi appointment with Mehandi by Janu and make your special day even more beautiful!</p>
            </div>
          </div>
        </section>

        <section className="section services" id="services" aria-labelledby="services-title">
          <div className="section-title">
            <div><div className="eyebrow">Explore the collection</div><h2 id="services-title">A Design For<br /><em>Every Occasion</em></h2></div>
            <p className="body-copy">Choose a service to begin an enquiry. Each design is approached with care, creativity, and attention to detail.</p>
          </div>
          <div className="service-grid" aria-label="Mehendi services">
            {services.map((service, index) => (
              <a className="service-card" key={service.title} href="#contact" onClick={() => chooseService(service.title)} aria-label={`Enquire about ${service.title}`}>
                <img className="service-card-image" src={service.image} alt={service.alt} width="900" height="1100" loading="lazy" />
                <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                <ChevronRight className="service-arrow" size={17} aria-hidden="true" />
                <div className="service-card-content"><h3>{service.title}</h3><p>{service.description}</p></div>
                <span className="service-card-note">Illustrative · not actual client work</span>
              </a>
            ))}
          </div>
          <div className="service-cta"><a className="button-primary" href="#contact">Enquire About A Design <ArrowRight size={14} aria-hidden="true" /></a></div>
        </section>

        <section className="bridal-feature" aria-labelledby="bridal-title">
          <div className="bridal-inner">
            <div className="bridal-copy">
              <div className="eyebrow">A personal approach</div>
              <h2 id="bridal-title">Artistry shaped around your moment.</h2>
              <p>From traditional South Indian bridal mehendi to modern Arabic mehndi designs, explore patterns tailored to your style and preferences.</p>
              <a className="button-light" href="#contact" onClick={() => chooseService('Bridal Mehendi')}>Enquire About Bridal Mehendi <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <div className="bridal-image"><img src="/images/bridal-mehendi-detail.jpg" alt="Illustrative close-up of bridal henna patterns on hands; not Janu’s client work" width="1024" height="1024" loading="lazy" /><span>Illustrative image · not actual client work</span></div>
          </div>
        </section>

        <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <div><div className="eyebrow">Image studies</div><h2 id="gallery-title">Mehendi, In Detail</h2></div>
            <p className="gallery-note">These illustrative images are not actual client work by Janu. Approved portfolio photographs can replace them when supplied.</p>
          </div>
          <div className="gallery-filters" role="group" aria-label="Filter gallery by category">
            {galleryCategories.map((category) => <button key={category.label} type="button" className={activeCategory === category.label ? 'filter-button active' : 'filter-button'} aria-pressed={activeCategory === category.label} onClick={() => { setActiveCategory(category.label); setLightboxIndex(null); }}>{category.label}</button>)}
          </div>
          <div className="gallery-grid">
            {visibleGallery.map((service, index) => (
              <figure className="gallery-tile" key={service.title}>
                <button type="button" className="gallery-image-trigger" aria-label={`Enlarge illustrative ${service.title} image`} onClick={(event) => { returnFocusRef.current = event.currentTarget; setLightboxIndex(index); }} data-testid={`button-open-gallery-${index}`}>
                  <img src={service.image} alt={service.alt} width="900" height="1100" loading="lazy" />
                  <span className="gallery-zoom" aria-hidden="true"><ArrowUpRight size={16} /></span>
                </button>
                <figcaption><span>{service.title}</span><small>Illustrative · not actual client work</small></figcaption>
              </figure>
            ))}
          </div>
          <div className="gallery-cta"><a className="button-quiet" href="#contact">Have A Design In Mind? Let’s Talk. <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        </section>

        <section className="section qualities" aria-labelledby="qualities-title">
          <div className="qualities-head">
            <div className="eyebrow">The approach</div>
            <h2 id="qualities-title">Care In Every Detail</h2>
            <p className="body-copy">Every design is created with care, creativity, and attention to detail, with patterns tailored to your style and preferences.</p>
          </div>
          <div className="qualities-grid">
            {[
              ['01', 'Careful detail', 'A considered approach to every line, motif, and composition.'],
              ['02', 'Your preferences', 'Designs shaped around your own style and preferences.'],
              ['03', 'Tradition & today', 'Traditional South Indian and modern Arabic design options.'],
            ].map(([number, title, description]) => <article className="quality" key={number}><span className="quality-mark">{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className="section booking" aria-labelledby="booking-title">
          <div className="booking-intro">
            <div className="eyebrow">A clear next step</div>
            <h2 id="booking-title">Let’s Plan Your Mehendi</h2>
            <p className="body-copy">Share your preferred service, event date, and location. Enquiries are discussed and appointments confirmed directly with Janu.</p>
          </div>
          <div className="steps">
            <article className="step"><div className="step-number">01</div><h3>Choose a service</h3><p>Select the mehendi style that feels right for your occasion.</p></article>
            <article className="step"><div className="step-number">02</div><h3>Share the details</h3><p>Tell us your event date, location, and design preferences.</p></article>
            <article className="step"><div className="step-number">03</div><h3>Enquire with Janu</h3><p>Discuss availability and confirm your appointment directly with the artist.</p></article>
          </div>
          <div className="booking-cta"><a className="button-primary" href="#contact">Book Your Mehendi <ArrowRight size={14} aria-hidden="true" /></a></div>
        </section>

        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="faq-intro"><div className="eyebrow">Good to know</div><h2 id="faq-title">A Few Helpful Answers</h2><p>For details specific to your occasion, send an enquiry and discuss them directly with Janu.</p></div>
          <div className="faq-list">
            <details><summary>What mehendi services are available?<ChevronRight size={16} aria-hidden="true" /></summary><p>Services include bridal, engagement, Arabic, traditional, simple, full hand, front hand, back hand, Indian mehndi, minimal, baby shower, festival, and special occasion henna art.</p></details>
            <details><summary>How do I enquire about an appointment?<ChevronRight size={16} aria-hidden="true" /></summary><p>Use the enquiry form to share your contact number, preferred service, event date, and event location. Appointment details are confirmed directly with Janu.</p></details>
            <details><summary>Can I share a design reference?<ChevronRight size={16} aria-hidden="true" /></summary><p>You can describe your preferred design in the optional message field and discuss your references directly with Janu.</p></details>
            <details><summary>What are the prices and available dates?<ChevronRight size={16} aria-hidden="true" /></summary><p>Pricing and availability have not been provided here. Please enquire with your preferred date and service to discuss these details.</p></details>
            <details><summary>Where are services located?<ChevronRight size={16} aria-hidden="true" /></summary><p>Mehandi by Janu is in Tiruppur (Tirupur), Tamil Nadu. Share your event location in the enquiry to discuss your requirements.</p></details>
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <div className="contact-layout">
            <div className="contact-copy">
              <div className="eyebrow">Begin with a conversation</div>
              <h2 id="contact-title">Your Special Day Deserves Beautiful Henna</h2>
              <p className="body-copy">Share your occasion, preferred date, and event location to enquire. Your appointment is confirmed directly with Janu.</p>
              <div className="contact-location"><MapPin size={17} aria-hidden="true" /><span>{siteConfig.location}</span></div>
            </div>
            <form className="contact-form" onSubmit={submitEnquiry}>
              <div className="form-grid">
                <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="Name" required maxLength={80} data-testid="input-enquiry-name" /></div>
                <div className="field"><label htmlFor="phone">Contact number</label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="Include country code if known" required maxLength={24} data-testid="input-enquiry-phone" /></div>
                <div className="field"><label htmlFor="occasion">Occasion</label><select id="occasion" name="occasion" required defaultValue="" data-testid="select-enquiry-occasion"><option value="" disabled>Select an occasion</option>{occasions.map((occasion) => <option key={occasion}>{occasion}</option>)}</select></div>
                <div className="field"><label htmlFor="date">Event date</label><input id="date" name="date" type="date" min={minDate} required data-testid="input-enquiry-date" /></div>
                <div className="field full"><label htmlFor="eventLocation">Event location</label><input id="eventLocation" name="eventLocation" autoComplete="address-level2" placeholder="Town or event venue" required maxLength={120} data-testid="input-enquiry-location" /></div>
                <div className="field full"><label htmlFor="style">Preferred service</label><select id="style" name="style" required value={selectedService} onChange={(event) => chooseService(event.target.value)} data-testid="select-enquiry-style"><option value="" disabled>Choose a service</option>{services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}</select></div>
                <div className="field full"><label htmlFor="details">Message <span aria-hidden="true">(optional)</span></label><textarea id="details" name="details" maxLength={1000} placeholder="Share any design preferences or details to discuss." data-testid="input-enquiry-details" /></div>
              </div>
              <p className="form-consent">Your details are not submitted or stored by this website. If WhatsApp is configured, a draft opens for you to review and send.</p>
              <button type="submit" className="button-primary form-submit" data-testid="button-submit-enquiry">Prepare WhatsApp Enquiry <ArrowUpRight size={15} aria-hidden="true" /></button>
              <p className={`form-status${messageIsError ? ' error' : ''}`} aria-live="polite" role={messageIsError ? 'alert' : 'status'} data-testid="status-enquiry">{message}</p>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-block"><div className="footer-brand">MEHANDI BY JANU<small>Beautiful henna for life’s special moments.</small></div></div>
          <div><div className="footer-heading">Explore</div><nav className="footer-nav" aria-label="Footer navigation">{[['Home','#home'],['About','#about'],['Services','#services'],['Gallery','#gallery'],['FAQ','#faq'],['Contact','#contact']].map(([label,href])=><a key={label} href={href} data-testid={`link-footer-${label.toLowerCase()}`}>{label}</a>)}</nav></div>
          <div className="footer-contact"><div className="footer-heading">Location & contact</div><p>{siteConfig.location}</p>{siteConfig.phoneNumber ? <a href={`tel:${siteConfig.phoneNumber}`}>Phone {siteConfig.phoneNumber}</a> : <p>Phone contact to be added.</p>}{siteConfig.instagramUrl ? <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={12} /></a> : <p>Instagram details to be added.</p>}{siteConfig.whatsappNumber ? <a href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">WhatsApp enquiries <ArrowUpRight size={12} /></a> : <p>WhatsApp contact to be added.</p>}</div>
        </div>
        <div className="footer-bottom"><span>© {today?.getFullYear()} Mehandi by Janu</span><span>Tiruppur (Tirupur) · Tamil Nadu</span></div>
      </footer>
      {lightboxIndex !== null && visibleGallery[lightboxIndex] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${visibleGallery[lightboxIndex].title} illustrative image`} onClick={closeLightbox}>
          <button ref={closeButtonRef} className="lightbox-close" type="button" aria-label="Close image" onClick={closeLightbox} data-testid="button-close-gallery-image"><X size={20} /></button>
          <button className="lightbox-prev" type="button" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + visibleGallery.length) % visibleGallery.length); }}>Previous</button>
          <figure className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <img src={visibleGallery[lightboxIndex].image} alt={visibleGallery[lightboxIndex].alt} width="1024" height="1024" />
            <figcaption>{visibleGallery[lightboxIndex].title} <span>Illustrative · not actual client work</span></figcaption>
          </figure>
          <button className="lightbox-next" type="button" aria-label="Next image" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % visibleGallery.length); }}>Next</button>
        </div>
      )}
    </div>
  );
}
