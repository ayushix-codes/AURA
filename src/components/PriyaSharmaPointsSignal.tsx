import React, { useState } from 'react';
import { Professional, ProfessionalService } from '../types/aura';

interface PriyaSharmaPointsSignalProps {
  artisan: Professional;
  onBookService: (artisan: Professional, service?: ProfessionalService) => void;
  onSwitchToAtHome: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBackToPros?: () => void;
}

export const PriyaSharmaPointsSignal: React.FC<PriyaSharmaPointsSignalProps> = ({
  artisan,
  onBookService,
  onSwitchToAtHome,
  isFavorite,
  onToggleFavorite,
  onBackToPros
}) => {
  const [hasEndorsed, setHasEndorsed] = useState(true);
  const [pointsCount, setPointsCount] = useState(1240);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [showToast, setShowToast] = useState(false);
  const [venueMode, setVenueMode] = useState<'home' | 'salon'>('home');

  const services = [
    {
      id: 1,
      category: 'HD Artistry',
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
      name: 'Saree Draping & Silhouette Architecture',
      price: '₹800',
      numericPrice: 800,
      duration: '25 mins',
      description: 'Precision pleat setting, interior cancan structure pinning, and non-slip pallu flow stabilization for Banarasi silk, tissue, and organza.',
      modes: ['At Home', 'At Salon']
    }
  ];

  const activeService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleToggleEndorse = () => {
    if (hasEndorsed) {
      setHasEndorsed(false);
      setPointsCount(prev => prev - 1);
    } else {
      setHasEndorsed(true);
      setPointsCount(prev => prev + 1);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }
    onToggleFavorite();
  };

  const handleBook = () => {
    onBookService(artisan, {
      id: `service_${activeService.id}`,
      name: activeService.name,
      category: 'Makeup',
      price: activeService.numericPrice,
      durationMinutes: 60,
      description: activeService.description
    });
  };

  return (
    <div className="flex flex-col w-full pb-28 text-on-surface">
      {/* Top Header */}
      <header className="w-full px-gutter-mobile pt-3 pb-3 flex items-center justify-between border-b border-surface-container bg-surface-container-lowest max-w-screen-md mx-auto">
        <button
          onClick={onBackToPros}
          className="flex items-center gap-1.5 text-on-surface hover:text-secondary transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Back to Registry</span>
        </button>
        <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-medium bg-surface-container-low px-2 py-1 border border-surface-container">
          Calibrated to: Pastel Saree &amp; Kundan (#D480)
        </span>
      </header>

      <div className="max-w-screen-md mx-auto w-full">
        {/* Profile Hero with Prominent AURA Points Signal Plate */}
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
                  onClick={onSwitchToAtHome}
                  className="font-label-caps text-[10px] text-primary underline uppercase tracking-wider hover:text-secondary"
                  type="button"
                >
                  View Full Profile →
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                Verified Master MUA // Noida &amp; South Delhi
              </p>
              <div className="flex items-center flex-wrap gap-y-1 gap-x-2.5 mt-2">
                <div className="flex items-center gap-1 text-on-surface">
                  <span className="material-symbols-outlined text-[15px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-caps text-[11px] font-medium">4.99</span>
                  <span className="font-caption text-caption text-secondary">(348 reviews)</span>
                </div>
                <span className="text-outline-variant">•</span>
                <span className="font-label-caps text-[11px] text-on-surface tracking-wide">From ₹2,500</span>
              </div>
            </div>
          </div>

          {/* Prominent AURA Points Endorsement Block */}
          <div className="mt-5 p-4 bg-surface-container-low border border-surface-container">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{pointsCount.toLocaleString()}</span>
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary font-medium">AURA Points</span>
                </div>
                <p className="font-caption text-[11px] text-on-surface-variant mt-0.5">
                  {hasEndorsed ? 'You and 1,239 connoisseurs endorsed Priya Sharma\'s bridal aesthetic' : '1,239 verified connoisseurs endorsed Priya Sharma'}
                </p>
              </div>
              <button
                onClick={handleToggleEndorse}
                className={`px-3 py-2 font-label-caps text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors border ${
                  hasEndorsed
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container text-on-surface border-surface-container-high hover:bg-surface-container-high'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span>{hasEndorsed ? 'Endorsed' : 'Give AURA Point'}</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="mt-3 p-2.5 bg-primary text-on-primary text-[11px] font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>+1 AURA Point Signal recorded for Priya Sharma.</span>
              </span>
              <span className="font-caption uppercase text-[9px] tracking-wider text-secondary-fixed">Saved</span>
            </div>
          )}
        </section>

        {/* What is the AURA Preference Signal? */}
        <section className="w-full px-gutter-mobile py-5 bg-surface-container-low/40 border-b border-surface-container">
          <div className="p-4 bg-surface-container-lowest border border-surface-container">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
              <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface font-semibold">
                The AURA Preference Signal
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Unlike star ratings or sponsored ads, <strong>AURA Points</strong> are non-monetary peer endorsements awarded solely by clients who completed a verified AURA look. Artisans with higher points are matched first based on aesthetic resonance, skin calibration accuracy, and drape longevity.
            </p>
          </div>
        </section>

        {/* Selected Fulfillment Protocol */}
        <section className="w-full px-gutter-mobile py-5 bg-surface-container-lowest border-b border-surface-container">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary">Fulfillment Modality</span>
            <button
              onClick={() => setVenueMode(venueMode === 'home' ? 'salon' : 'home')}
              className="font-label-caps text-[10px] uppercase tracking-wider text-primary underline"
              type="button"
            >
              Switch to {venueMode === 'home' ? 'Salon Studio' : 'At Home'}
            </button>
          </div>
          <div className="p-3 bg-surface-container-low border border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-primary">
                {venueMode === 'home' ? 'home' : 'storefront'}
              </span>
              <div>
                <div className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface font-semibold">
                  {venueMode === 'home' ? 'At-Home Doorstep Protocol' : 'Sector 18 Studio Atelier'}
                </div>
                <p className="font-caption text-caption text-secondary">
                  {venueMode === 'home' ? 'Noida (Sectors 1-150), South Delhi & Gurugram (+₹300 visit fee)' : 'Complimentary facility access with bridal dressing suite'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          </div>
        </section>

        {/* Services List */}
        <section className="w-full px-gutter-mobile py-6 bg-surface-container-lowest">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Available Services</h2>
            <span className="font-caption text-caption text-secondary">3 Protocols</span>
          </div>
          <div className="space-y-3">
            {services.map(s => {
              const isSelected = selectedServiceId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedServiceId(s.id)}
                  className={`p-4 bg-surface border cursor-pointer transition-all ${
                    isSelected ? 'border-primary shadow-sm' : 'border-surface-container hover:border-surface-container-high'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-caption text-[10px] uppercase tracking-wider text-secondary">{s.category}</span>
                      <h3 className="font-subheading text-subheading font-medium text-on-surface mt-0.5">{s.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-sm text-headline-sm text-on-surface">{s.price}</span>
                      <div className="font-caption text-[10px] text-secondary">{s.duration}</div>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">{s.description}</p>
                  <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between">
                    <span className="font-caption text-[10px] uppercase tracking-wider text-secondary">
                      Verified Portfolio Item
                    </span>
                    <button
                      className={`px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest ${
                        isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'
                      }`}
                      type="button"
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action Bar */}
      <aside className="fixed bottom-20 left-0 right-0 z-40 px-gutter-mobile py-3 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="font-caption text-[9px] uppercase tracking-widest text-secondary block">Selected Service</span>
            <span className="font-label-caps text-[11px] text-on-surface font-semibold truncate block">
              {activeService.name}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface leading-none block mt-0.5">
              {activeService.price}
            </span>
          </div>
          <button
            onClick={handleBook}
            className="shrink-0 h-11 px-5 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span>Proceed to Dossier</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
