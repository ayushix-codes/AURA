import React, { useState } from 'react';
import { Professional, ProfessionalService } from '../types/aura';

interface PriyaSharmaAtHomeProfileProps {
  artisan: Professional;
  onBookService: (artisan: Professional, service?: ProfessionalService) => void;
  onSwitchToSignal: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBackToPros?: () => void;
}

export const PriyaSharmaAtHomeProfile: React.FC<PriyaSharmaAtHomeProfileProps> = ({
  artisan,
  onBookService,
  onSwitchToSignal,
  isFavorite,
  onToggleFavorite,
  onBackToPros
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [venueModalOpen, setVenueModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<'home' | 'salon'>('home');
  const [isLocatingSlots, setIsLocatingSlots] = useState(false);

  const services = [
    {
      id: 1,
      category: 'HD Artistry',
      isPopular: true,
      name: 'Bridal Guest HD Makeup & Sculpt',
      price: '₹2,500',
      numericPrice: 2500,
      duration: '60 mins',
      description: 'Airbrushed satin finish, micro-contouring, customized lash clusters calibrated to warm gold & kundan jewelry tones.',
      modes: ['At Home', 'At Salon']
    },
    {
      id: 2,
      category: 'Signature Atelier',
      isPopular: false,
      name: 'Couture Bridal Master Transformation',
      price: '₹8,500',
      numericPrice: 8500,
      duration: '150 mins',
      description: 'Full bridal HD formulation, multi-stage skin hydration prep, bridal trial synchronization, and delicate 24k gold leaf accents.',
      modes: ['At Home (Suite)', 'At Salon']
    },
    {
      id: 3,
      category: 'Heritage Draping',
      isPopular: false,
      name: 'Saree Draping & Silhouette Architecture',
      price: '₹800',
      numericPrice: 800,
      duration: '25 mins',
      description: 'Precision pleat setting, interior cancan structure pinning, and non-slip pallu flow stabilization for Banarasi silk, tissue, and organza.',
      modes: ['At Home', 'At Salon']
    }
  ];

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleConfirmVenue = () => {
    setIsLocatingSlots(true);
    setTimeout(() => {
      setIsLocatingSlots(false);
      setVenueModalOpen(false);
      onBookService(artisan, {
        id: `service_${activeService.id}`,
        name: activeService.name,
        category: 'Makeup',
        price: activeService.numericPrice,
        durationMinutes: parseInt(activeService.duration) || 60,
        description: activeService.description
      });
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-28 text-on-surface">
      {/* Top Bar / Navigation Hierarchy */}
      <header className="w-full px-gutter-mobile pt-3 pb-3 flex items-center justify-between border-b border-surface-container bg-surface-container-lowest max-w-screen-md mx-auto">
        <button
          onClick={onBackToPros}
          className="flex items-center gap-1.5 text-on-surface hover:text-secondary transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Back to Professionals</span>
        </button>
        <span className="font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-2 py-1 border border-surface-container">
          Verified Master MUA // Noida &amp; NCR
        </span>
      </header>

      <div className="max-w-screen-md mx-auto w-full">
        {/* Profile Hero & Identity Plate */}
        <section className="w-full px-gutter-mobile pt-6 pb-6 bg-surface-container-lowest border-b border-surface-container">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full p-[2px] bg-surface-container-high overflow-hidden shadow-sm">
                <img
                  alt="Priya Sharma Portrait"
                  className="w-full h-full object-cover rounded-full"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1Xc9cu67xwSQxFkbxpKRtYzXeRJZaJlFPnr3yt69eyZKXcjoe_TzYUcX-dfs1VFtMdQDT6iDmZNr1wX0lLlY0e7yTlIgdE_0oY8Qr1-RnZ7ERXImdJW5cy9XusLZLrBAPgbi8KqNek2imR199B-kPMLNFAcbunaEH8zaeSDlkMDG_jo7rhBLNtBItZpRg1whrBunaZakwcyhUoi3wjEV1FAf8TLUvp9UfaO890oAmFbowOGw_6l5W6Zyqw-"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-on-primary rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[13px]">verified</span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Priya Sharma</h1>
                <button
                  onClick={onSwitchToSignal}
                  className="font-label-caps text-[10px] text-primary underline uppercase tracking-wider hover:text-secondary"
                  type="button"
                >
                  View Points Signal →
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                Celebrity &amp; Bridal HD Makeup Artist <span className="text-outline-variant">•</span> 9+ Yrs Atelier Practice
              </p>
              <div className="flex items-center flex-wrap gap-y-1 gap-x-2.5 mt-2">
                <div className="flex items-center gap-1 text-on-surface">
                  <span className="material-symbols-outlined text-[15px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-caps text-[11px] font-medium">4.99</span>
                  <span className="font-caption text-caption text-secondary">(348 reviews)</span>
                </div>
                <span className="text-outline-variant">•</span>
                <span className="font-label-caps text-[11px] text-on-surface tracking-wide">Starts ₹2,500</span>
              </div>
            </div>
          </div>

          {/* Quick Action CTA Row */}
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <button
              onClick={() => setVenueModalOpen(true)}
              className="w-full h-11 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Book Appointment
            </button>
            <button
              onClick={() => alert('Initiating priority dispatch message session with Priya Sharma.')}
              className="w-full h-11 bg-surface-container-lowest text-on-surface border border-primary/20 font-label-caps text-label-caps tracking-widest uppercase hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
              Message
            </button>
          </div>
        </section>

        {/* Critical Service Location & Home Service Coverage Matrix */}
        <section className="w-full px-gutter-mobile py-6 bg-surface-container-low/50 border-b border-surface-container">
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-label-caps text-[10px] tracking-widest uppercase text-secondary">Service Location Protocols</span>
            <span className="font-caption text-caption text-on-surface-variant">Real-Time Dispatch Active</span>
          </div>

          {/* Dual Modality Cards: Home vs Salon */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* At Home Card */}
            <div className="p-3.5 bg-surface-container-lowest border-l-2 border-primary border border-surface-container shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">home_pin</span>
                  <span className="font-label-caps text-label-caps tracking-wider uppercase text-on-surface font-semibold">At Home Protocol</span>
                </div>
                <span className="font-caption text-[10px] tracking-widest uppercase text-primary font-medium bg-surface-container px-2 py-0.5">Available</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                Doorstep dispatch with sterilized medical-grade vanity kit &amp; portable dimmable ring illumination.
              </p>
              <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between font-caption text-caption text-secondary">
                <span>Standard Home Surcharge</span>
                <span className="font-label-caps text-on-surface font-medium">₹300 Per Visit</span>
              </div>
            </div>

            {/* At Salon Card */}
            <div className="p-3.5 bg-surface-container-lowest border-l-2 border-outline-variant border border-surface-container shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">storefront</span>
                  <span className="font-label-caps text-label-caps tracking-wider uppercase text-on-surface font-semibold">At Studio Atelier</span>
                </div>
                <span className="font-caption text-[10px] tracking-widest uppercase text-secondary font-medium bg-surface-container px-2 py-0.5">Available</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                Private dressing suite at Sector 18, Noida. Valet parking, bespoke vanity mirrors &amp; bridal styling chamber.
              </p>
              <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between font-caption text-caption text-secondary">
                <span>Facility Access</span>
                <span className="font-label-caps text-on-surface font-medium">Complimentary</span>
              </div>
            </div>
          </div>

          {/* Home Service Coverage Highlight Box */}
          <div className="mt-3 p-3.5 bg-surface-container border border-surface-container-highest">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">verified_user</span>
              <div className="flex-1">
                <div className="font-label-caps text-[10px] tracking-widest uppercase text-on-surface font-semibold">
                  Coverage Area &amp; Dispatch Standards
                </div>
                <p className="font-caption text-caption text-on-surface mt-1 leading-normal">
                  <strong>Active Zones:</strong> Noida (Sectors 1–150), Greater Noida (Alpha to Omega), South Delhi &amp; Gurugram Cyber City.
                </p>
                <div className="mt-2 flex items-center gap-2 text-secondary font-caption text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span> 2h lead time
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">sanitizer</span> Hospital-grade sterilization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Selection Menu */}
        <section className="w-full px-gutter-mobile py-6 bg-surface-container-lowest border-b border-surface-container">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="font-label-caps text-[10px] tracking-widest uppercase text-secondary">Menu of Artistry</span>
              <h2 className="font-headline-md text-headline-md tracking-tight text-on-surface mt-0.5">Curated Services</h2>
            </div>
            <span className="font-caption text-caption text-secondary">3 Disciplines</span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {['All Services', 'Bridal & HD', 'Saree Draping', 'Hair Artistry'].map((cat, idx) => (
              <button
                key={idx}
                className={`shrink-0 px-3 py-1.5 font-label-caps text-[10px] uppercase tracking-widest ${
                  idx === 0
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards Container */}
          <div className="mt-4 space-y-3.5" id="services-list">
            {services.map((s) => {
              const isSelected = selectedServiceId === s.id;
              return (
                <article
                  key={s.id}
                  onClick={() => setSelectedServiceId(s.id)}
                  className={`p-4 bg-surface transition-all relative service-item cursor-pointer border ${
                    isSelected ? 'border-primary shadow-sm' : 'border-surface-container-high hover:border-surface-container-highest'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-[10px] tracking-widest uppercase text-secondary">{s.category}</span>
                        {s.isPopular && (
                          <span className="font-caption text-[9px] uppercase px-1.5 py-0.5 bg-surface-container text-on-surface font-medium border border-surface-container-high">
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="font-subheading text-subheading font-medium text-on-surface mt-1">{s.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-headline-sm text-headline-sm text-on-surface">{s.price}</span>
                      <div className="font-caption text-[10px] text-secondary">{s.duration}</div>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="mt-3.5 pt-3 border-t border-surface-container-high flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-secondary font-caption text-[11px]">
                      {s.modes.map((m, mIdx) => (
                        <React.Fragment key={mIdx}>
                          <span className="flex items-center gap-0.5 text-on-surface font-medium">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span> {m}
                          </span>
                          {mIdx < s.modes.length - 1 && <span>•</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <button
                      className={`select-btn px-4 py-1.5 font-label-caps text-[10px] uppercase tracking-widest transition-colors ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Editorial Portfolio Gallery */}
        <section className="w-full px-gutter-mobile py-6 bg-surface-container-low/40 border-b border-surface-container">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-label-caps text-[10px] tracking-widest uppercase text-secondary">Verified Aesthetic Portfolio</span>
            <a className="font-caption text-caption text-on-surface uppercase tracking-wider underline" href="#gallery">
              View Archive (42)
            </a>
          </div>
          <p className="font-caption text-caption text-on-surface-variant mb-4">High-resolution unedited client execution archives</p>

          {/* Scrollable Photo Plates */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-gutter-mobile px-gutter-mobile">
            {/* Plate 1 */}
            <div className="w-48 shrink-0 bg-surface-container-lowest p-2 border border-surface-container">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container">
                <img
                  alt="Pastel Saree and Kundan client portfolio"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XTX3BAKxIYgXRWtoHrrls1pbs7o4tUiLQ1M-mEPLLnIshvFYiitBb-rnPVpy2pxaPGTpu-7rKyBFxq3mJta38DUK_K1hfGwUg-MpGYm8V51augn8jk29ZQfwxgMm6SsEPaL6V8WGxHY_TAElmYRnaxefGCmStDi1-cPdvSA1Zeq5_2RPZV10mbgP41QCiA6LN6m5HQZBRMeb5grW4u6yp-9ZQ5wGq67_gDAUqEWxFrJtOFpLDCO-GPX0Y"
                />
              </div>
              <div className="pt-2">
                <div className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface font-semibold">Pastel Saree &amp; Kundan</div>
                <div className="font-caption text-[10px] text-secondary mt-0.5">Day Wedding • Noida Sec 44</div>
              </div>
            </div>

            {/* Plate 2 */}
            <div className="w-48 shrink-0 bg-surface-container-lowest p-2 border border-surface-container">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container">
                <img
                  alt="Dewy Sangeet Glam"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtzBMp9FQavlNpXXSFUjwMqnn0qhVmBViKT_dkGyqz75ptJaBJprOajFOPHzPzYt8Z-tPmvFwuYI21PYiw71GLWhquJDx3jhtDByTNpJUERQdMkK-vM4HDEWXQfLZnwYTZp9VO3rorzn8auhxTtU38ehnEvjzL09wIDrG2QmHRBH13RH9DlSUYiRKliXltB9itnDKg4n2NZ7sLx25CN64UViERbm05lIo0ehVCciNL2ZdOqxjeMzKXog"
                />
              </div>
              <div className="pt-2">
                <div className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface font-semibold">Dewy Sangeet Glam</div>
                <div className="font-caption text-[10px] text-secondary mt-0.5">Evening Event • Gurugram</div>
              </div>
            </div>

            {/* Plate 3 */}
            <div className="w-48 shrink-0 bg-surface-container-lowest p-2 border border-surface-container">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container">
                <img
                  alt="Royal Chanderi Drape"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzUOg-Ho6goQmoJXCaAjtbmzhskZRNtxlEZXuK9xnqJKxfvxr9n9Ri0LBexx8D-WIR31dG9Lvt0IFJFtHD9bRVucjL4o-h2ZkzXgm5uexYbahmaD-CP_McR5Ao_GHgOf2SB3pkx0SXUZL_MoGMNUQusp8da5JEXYdIZfCvPWJpAREhUYvubsAsL4rvA6_puHV-2nX2g-WgYl27Ye_16-7j0V9vwnVw8_TJAqR4ap1HsVA8Q4SgyE918Q"
                />
              </div>
              <div className="pt-2">
                <div className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface font-semibold">Royal Chanderi Drape</div>
                <div className="font-caption text-[10px] text-secondary mt-0.5">Reception • South Delhi</div>
              </div>
            </div>
          </div>

          {/* Future Feature Callout (AI Try-On Teaser) */}
          <div className="mt-4 p-3.5 bg-surface-container-lowest border border-dashed border-outline-variant flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
              <div>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface font-semibold block">
                  See Priya's Signature Style On You
                </span>
                <span className="font-caption text-[11px] text-on-surface-variant">Generative portrait preview using your AURA facial scan</span>
              </div>
            </div>
            <span className="font-label-caps text-[9px] uppercase tracking-widest px-2 py-0.5 bg-surface-container-high text-secondary shrink-0 border border-surface-container">
              Coming Soon
            </span>
          </div>
        </section>

        {/* Verified Client Reviews (India Context) */}
        <section className="w-full px-gutter-mobile py-6 bg-surface-container-lowest">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="font-label-caps text-[10px] tracking-widest uppercase text-secondary">Authentic Feedback</span>
              <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface mt-0.5">Client Verifications</h2>
            </div>
            <span className="font-caption text-caption text-secondary">348 Reviews Total</span>
          </div>
          <div className="space-y-3">
            {/* Review 1 */}
            <div className="p-3.5 bg-surface border border-surface-container">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body-sm text-body-sm font-medium text-on-surface block">Ananya Roy</span>
                  <span className="font-caption text-[10px] text-secondary">Noida Sector 50 • At-Home Booking</span>
                </div>
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 italic leading-relaxed">
                “Priya arrived at our home 15 minutes early with a completely sanitized kit and lighting setup. My saree drape stayed intact for 8 full hours through dancing!”
              </p>
            </div>
            {/* Review 2 */}
            <div className="p-3.5 bg-surface border border-surface-container">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body-sm text-body-sm font-medium text-on-surface block">Suniti M.</span>
                  <span className="font-caption text-[10px] text-secondary">Greater Noida • At-Salon Atelier</span>
                </div>
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 italic leading-relaxed">
                “Her understanding of warm olive undertones and kundan placement is unmatched. Zero cakey texture even under intense floodlights.”
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Checkout Bar */}
      <aside className="fixed bottom-20 left-0 right-0 z-40 px-gutter-mobile py-3 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-caption text-[9px] uppercase tracking-widest text-secondary block">Selected Service</span>
            <span className="font-label-caps text-[11px] text-on-surface font-semibold truncate block" id="bottom-service-label">
              {activeService.name}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface leading-none block mt-0.5" id="bottom-service-price">
              {activeService.price}
            </span>
          </div>
          <button
            onClick={() => setVenueModalOpen(true)}
            className="shrink-0 h-11 px-4 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            id="proceed-button"
            type="button"
          >
            <span>Proceed</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </aside>

      {/* Location Selection Modal Sheet */}
      {venueModalOpen && (
        <div aria-modal="true" className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-end justify-center transition-opacity" role="dialog">
          <div className="w-full max-w-md bg-surface-container-lowest p-5 border-t border-surface-container space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div>
                <span className="font-label-caps text-[10px] tracking-widest uppercase text-secondary">Step 2 of 3</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Select Appointment Venue</h3>
              </div>
              <button
                onClick={() => setVenueModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-secondary"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Please indicate where you wish Priya Sharma to fulfill this service:
            </p>
            <div className="space-y-2.5">
              <label
                onClick={() => setSelectedVenue('home')}
                className={`flex items-start gap-3 p-3 bg-surface cursor-pointer border ${
                  selectedVenue === 'home' ? 'border-primary' : 'border-surface-container'
                }`}
              >
                <input
                  checked={selectedVenue === 'home'}
                  onChange={() => setSelectedVenue('home')}
                  className="mt-1 accent-black"
                  name="venue-choice"
                  type="radio"
                  value="home"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">At-Home Doorstep Service</span>
                    <span className="font-caption text-caption text-secondary">+₹300 visit fee</span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">Sterilized mobile kit dispatched to your home across Noida/NCR.</p>
                </div>
              </label>

              <label
                onClick={() => setSelectedVenue('salon')}
                className={`flex items-start gap-3 p-3 bg-surface cursor-pointer border ${
                  selectedVenue === 'salon' ? 'border-primary' : 'border-surface-container'
                }`}
              >
                <input
                  checked={selectedVenue === 'salon'}
                  onChange={() => setSelectedVenue('salon')}
                  className="mt-1 accent-black"
                  name="venue-choice"
                  type="radio"
                  value="salon"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">Studio Atelier (Sector 18)</span>
                    <span className="font-caption text-caption text-on-surface font-medium">Included</span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">Sector 18 Noida atelier with dedicated bridal suite &amp; valet.</p>
                </div>
              </label>
            </div>

            <button
              onClick={handleConfirmVenue}
              disabled={isLocatingSlots}
              className="w-full h-12 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
              type="button"
            >
              {isLocatingSlots ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                  <span>Locating Slots...</span>
                </>
              ) : (
                <>
                  <span>Confirm &amp; Select Time Slot</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
