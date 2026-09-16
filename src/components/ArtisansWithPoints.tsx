import React, { useState } from 'react';
import { StructuredLook, Professional } from '../types/aura';

interface ArtisansWithPointsProps {
  currentLook: StructuredLook | null;
  onSelectArtisanForProfile: (artisan: Professional, mode: 'at-home' | 'signal') => void;
  onSelectArtisanForBooking: (artisan: Professional) => void;
  favoriteIds: Set<string>;
  onToggleFavorite: (artisanId: string) => void;
  onNavigateToStudio?: () => void;
}

export const ArtisansWithPoints: React.FC<ArtisansWithPointsProps> = ({
  currentLook,
  onSelectArtisanForProfile,
  onSelectArtisanForBooking,
  favoriteIds,
  onToggleFavorite,
  onNavigateToStudio
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Multi-artisan selection state matching the prototype
  const [itinerary, setItinerary] = useState<{
    [key: string]: { name: string; price: number; selected: boolean };
  }>({
    priya: { name: 'Priya Sharma', price: 2500, selected: true },
    rohan: { name: 'Rohan Mehra', price: 1500, selected: true },
    meera: { name: 'Meera Kapoor', price: 1200, selected: false }
  });

  const [pointsEndorsed, setPointsEndorsed] = useState<{ [key: string]: boolean }>({
    priya: true
  });

  const toggleSelection = (id: string, name: string, price: number) => {
    setItinerary(prev => {
      const current = prev[id] || { name, price, selected: false };
      return {
        ...prev,
        [id]: { ...current, selected: !current.selected }
      };
    });
  };

  const togglePointEndorsement = (id: string) => {
    setPointsEndorsed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    onToggleFavorite(id === 'priya' ? 'priya_sharma' : id);
  };

  // Recompute total and selected names
  const selectedItems = (Object.values(itinerary) as { name: string; price: number; selected: boolean }[]).filter(i => i.selected);
  const selectedNames = selectedItems.length > 0 ? selectedItems.map(i => i.name).join(' + ') : 'No Artisans Selected';
  const totalAmount: number = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
  const bookingDeposit: number = Math.round(totalAmount * 0.25);
  const balance: number = totalAmount - bookingDeposit;

  // Mock professionals data corresponding to the cards
  const priyaProf: Professional = {
    id: 'priya_sharma',
    name: 'Priya Sharma',
    tagline: 'Celebrity & Bridal HD Makeup • Mehrauli & Noida',
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANQUYDZRR6SpmTRM-eKFIE5_KYDnKT8Hdn4BCYHoKaAaH2ZHN1Nz55eyl0e01UbcWt768uDNt-1HFf-LUxUBd1TWUgsUoR4VQn49BZEEQiSn16eHn-O85s9vPWD8hL0tIScryh4116VAbqqzrK06Qek3XuwxwxXZ-8dlkAFi_LJfRlIjAPJMtNRliqLrddxFhGA7PjkcgGHLoTD9tViRmXs6UqYnMfcZg-S-4m34ZtlNaOa1kwXoBejQ',
    coverPhoto: '',
    location: 'Mehrauli & Noida',
    citiesCovered: ['Noida', 'Delhi NCR', 'Gurugram'],
    specialization: 'Bridal & HD Makeup',
    services: [],
    pricingTier: 'Haute',
    basePrice: 2500,
    portfolio: [],
    availability: ['Today', 'Tomorrow'],
    rating: 4.99,
    reviewsCount: 348,
    auraPointsReward: 1240,
    homeService: true,
    verified: true,
    badges: ['Master MUA', 'Top Match'],
    description: 'Celebrity & Bridal HD Makeup Artist with 9+ Yrs Atelier Practice'
  };

  const rohanProf: Professional = {
    id: 'rohan_mehra',
    name: 'Rohan Mehra Atelier',
    tagline: 'Architectural Updos, Saree Draping & Hair Spa • Sector 18, Noida',
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZSRKpE9IQjWq_Rm8w3oljW-H-DQBj0UE77EPsQEQeb1Pn5ZdX6wsgoJ5Te0lHbPI384KSqHKVgUKtg06E8gBIOimrJC9DnxHqgaNssM9-vH6OMA1oYtqqaki6CQE9dXjFiF0yCiTFOY9Lq8cuVYFsUDHFMOJkYmEzAE-neWYeqKYwp86MT2vKkkXVmlTaZuOMxSu3UKE1wjKgpPFrivnQBuzpV0QHyrk_yZNJ2HSHgPsAKwcA8ADmGQ',
    coverPhoto: '',
    location: 'Sector 18, Noida',
    citiesCovered: ['Noida', 'Delhi NCR'],
    specialization: 'Architectural Updos & Draping',
    services: [],
    pricingTier: 'Atelier',
    basePrice: 1500,
    portfolio: [],
    availability: ['Today', 'Tomorrow'],
    rating: 4.96,
    reviewsCount: 215,
    auraPointsReward: 890,
    homeService: true,
    verified: true,
    badges: ['Atelier', 'Master Stylist'],
    description: 'Salon Owner & Master Stylist specializing in low chignons and bridal saree pleating'
  };

  const meeraProf: Professional = {
    id: 'meera_kapoor',
    name: 'Meera Kapoor',
    tagline: 'Minimalist Chrome Gel Nails & Modern Mehendi • Greater Noida',
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsTYwJJiz9CGbqh_GWy3HN7dtNaVIIjf8zy4eGBzTu2fTYq7QErnsHG2gDDi6iemxPIf_fDUvV4jKisGD30Y_gHjIh6TfCacpSfeIEnFlmmrZuF3QcmOWo-S2bg7gq160TMB9fjD7cXcBTJyqWtrdSl6WkXusCePZ243f-FDHl9rCIDmR2Rz6jUrmT_04Yuak8D4Rboh8cPUDp4h43cXm-ojlL9HSaBFmP44WPbYapJZ4BP00TrOgegw',
    coverPhoto: '',
    location: 'Greater Noida',
    citiesCovered: ['Greater Noida', 'Noida Expressway'],
    specialization: 'Nail Art & Henna',
    services: [],
    pricingTier: 'Artisan',
    basePrice: 1200,
    portfolio: [],
    availability: ['Today', 'Tomorrow'],
    rating: 4.98,
    reviewsCount: 190,
    auraPointsReward: 645,
    homeService: true,
    verified: true,
    badges: ['Nails & Henna Specialist'],
    description: 'Couture Nail & Henna Artisan with mobile door-to-door setup'
  };

  const handleProceedItinerary = () => {
    onSelectArtisanForBooking(priyaProf);
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Editorial Top Filter & Header Context */}
      <header className="px-margin-mobile pt-space-md pb-space-sm bg-surface-container-lowest border-b border-surface-container">
        <div className="max-w-screen-md mx-auto">
          <div className="flex items-baseline justify-between mb-space-xs">
            <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary">AURA Haute Registry // NCR</span>
            <span className="font-label-sm text-label-sm text-outline">EDITION 04</span>
          </div>
          <div className="flex items-center justify-between gap-space-sm mb-space-md">
            <div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight">Artisans &amp; Ateliers</h1>
              <p className="font-body-sm text-body-sm text-secondary mt-0.5">Showing 24 Verified Artists in Delhi NCR &amp; Noida</p>
            </div>
            <button
              aria-label="Adjust filters"
              className="w-10 h-10 flex items-center justify-center bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors border border-surface-container"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Filter Taxonomy Scroll Strip */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs scrollbar-none -mx-margin-mobile px-margin-mobile">
            {[
              { id: 'all', label: 'All (24)' },
              { id: 'home', label: 'At Home' },
              { id: 'salon', label: 'At Salon' },
              { id: 'bridal', label: 'Bridal & Reception' },
              { id: 'glam', label: 'Soft Glam' },
              { id: 'draping', label: 'Hair & Draping' },
              { id: 'nails', label: 'Nail Art' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`filter-btn px-3 py-1.5 font-label-caps text-label-caps uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeFilter === f.id
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Curated AI Diagnostic Match Banner */}
      <section className="mx-margin-mobile my-space-md p-space-md bg-surface-container-low relative overflow-hidden border border-surface-container max-w-screen-md sm:mx-auto sm:w-full">
        <div className="flex items-start justify-between gap-space-sm mb-space-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase font-medium">
              Active Match // Look: {currentLook?.title || 'Pastel Saree & Kundan Harmony'}
            </span>
          </div>
          <span className="font-label-caps text-[10px] text-secondary tracking-widest uppercase">Skin #D480</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          AI matched <span className="text-on-surface font-medium">3 master artists</span> in Noida &amp; South Delhi with{' '}
          <span className="text-on-surface font-medium">96%+ alignment</span> to your warm gold-undertone skin profile and kundan brief.
          <br />
          <span className="block mt-1 text-[11px] font-label-caps uppercase tracking-wider text-secondary">
            <span className="material-symbols-outlined text-[12px] align-middle text-primary mr-0.5">auto_awesome</span>
            Preference Signal: Ranked by Portfolio Alignment + Client AURA Points (Not monetary rewards)
          </span>
        </p>
        <div className="mt-space-sm pt-space-xs flex items-center justify-between text-secondary border-t border-surface-container">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[15px] text-primary">auto_fix_high</span>
            <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface">Curated by Atelier Intelligence</span>
          </div>
          <button
            onClick={onNavigateToStudio}
            className="font-label-caps text-[10px] uppercase tracking-widest text-primary underline underline-offset-4 hover:text-secondary transition-colors"
            type="button"
          >
            Modify Brief
          </button>
        </div>
      </section>

      {/* Listing Feed */}
      <div className="px-margin-mobile space-y-space-lg pb-40 max-w-screen-md mx-auto w-full">
        {/* Card 1: Master MUA Priya Sharma */}
        <article className="bg-surface-container-lowest p-space-md transition-all group border border-surface-container shadow-sm" id="artist-card-priya">
          <div className="flex items-start gap-space-md">
            {/* Photo Container */}
            <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden bg-surface-container">
              <img
                alt="Priya Sharma Portrait"
                className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                src={priyaProf.profilePhoto}
              />
              <span className="absolute top-1 left-1 bg-primary text-on-primary font-label-caps text-[9px] px-1 py-0.5 uppercase tracking-wider">
                Top Match
              </span>
            </div>

            {/* Meta Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Priya Sharma</h2>
                <button
                  aria-label="Save artist"
                  onClick={() => togglePointEndorsement('priya')}
                  className={`p-1 transition-colors ${pointsEndorsed['priya'] ? 'text-primary' : 'text-outline hover:text-primary'}`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: pointsEndorsed['priya'] ? "'FILL' 1" : "'FILL' 0" }}>
                    bookmark
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary bg-surface-container px-1.5 py-0.5">
                  Verified Master MUA
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-1.5 line-clamp-1">
                Celebrity &amp; Bridal HD Makeup • Mehrauli &amp; Noida
              </p>
              <div className="flex flex-wrap items-center justify-between gap-y-1 mt-2 pt-0.5 border-t border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">4.99</span>
                    <span className="font-label-caps text-[10px] text-outline">(348)</span>
                  </div>
                  <span className="text-outline text-[10px]">•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                    <span className="font-label-caps text-[10px] font-medium tracking-wider uppercase text-on-surface">1,240 AURA Points</span>
                  </div>
                  <span className="text-outline text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] tracking-wider uppercase text-on-surface">From ₹2,500</span>
                </div>
                <button
                  aria-label="Endorse Priya Sharma"
                  onClick={() => togglePointEndorsement('priya')}
                  className={`flex items-center gap-1 px-1.5 py-0.5 transition-colors ${
                    pointsEndorsed['priya'] ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                  title="Endorse with an AURA Point"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                  <span className="font-label-caps text-[9px] uppercase tracking-wider font-medium">Point</span>
                </button>
              </div>
            </div>
          </div>

          {/* Match Metric & Availability Tag */}
          <div className="mt-space-sm py-1.5 px-space-sm bg-surface-container-low flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center justify-between gap-space-xs">
              <div className="flex items-center gap-1 min-w-0">
                <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface font-medium">98% Aesthetic Match</span>
              </div>
              <div className="flex items-center gap-1 justify-end min-w-0 text-primary font-medium">
                <span className="material-symbols-outlined text-[14px]">home</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider">At-Home Available</span>
                <span className="text-outline text-[9px]">•</span>
                <span className="font-label-caps text-[10px] text-secondary">4.2 km away</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-surface-container-high pt-1 text-[10px] font-label-caps text-secondary uppercase tracking-wider">
              <span>Noida &amp; South Delhi • 2h dispatch</span>
              <span className="text-on-surface font-medium">Doorstep Kit: ₹2,500 + ₹0 Travel</span>
            </div>
          </div>

          {/* Portfolio Contact Strip (3 Square Cuts) */}
          <div className="mt-space-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary">Verified Aesthetic Portfolio</span>
              <span className="font-label-caps text-[10px] text-outline">Lookbook 2025</span>
            </div>
            <div className="grid grid-cols-3 gap-space-xs">
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  alt="Pastel Bridal"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjbTNKNkPYBFKpWOFN9PjGFFI1TpA5GYOEY6ePoU-Uw7Uz91p9TB8Yv7EDY3HJRmjUsa1wUfLU0_1LXEM9euNPbq9_DU-UEFYdfSSyaWzuem_6-0VYyww50ebSMafnaiZdxrEz3LKE5l2DlgRNTB4VZWVDik4mdZqCt6O9yMdslJIAnZcBMRwdPaWd8Lgq5VJgfSqoLTO30fS7DWncE6DadGO43MIO2oNkB83YAY44qJuDzApVywWw-A"
                />
                <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                  Pastel Bridal
                </span>
              </div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  alt="Sangeet Glam"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvJaJJ3tPWyQ7A86Qq7w0G9_JEaJ393B7sK96kSO3uJRVc-LCGSsXL0plIZ7b_Fu_Tt2p1cIvLbR5kXWHvTUoEDBzSMNImdZ-XmCLX_eH85tMWXlKwgp7ER_MXQ5BEhXsdlc7Cj7Aqz1v80GK21kx14xHNZCu70diFsW6N0eoJYD17Kj8HB1895qQBMRbvH3c-RFtm9oFijFbNWZMig8ckp_Kk1E83UBwzPGj4OEdkjTJA6ISY4IrMRw"
                />
                <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                  Sangeet Glam
                </span>
              </div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  alt="Dewy Reception"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgGad6TOrZibzw-8yOZoll2w6XOgvIZ6jaAvwuL6YtC0eqlGPmfcxIfz9eCWOABnLJ5WUFoNu2M7gfojpmmW8GAB5FUPVD1UrxXF95vcnOq3akOoe4WuEKZn2p1pKzCM4Sfgc0QhiGpbiq77eRzvRxz1lqxNiRDF4IWHb_HpMO54O_8Y8X7HTidrHgc0Fbk-I8BEk_JqXHya_2snqYMs3rYaRwT7x_CHx_UBi8nOq8k9U6LW1N14iMqg"
                />
                <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                  Dewy Reception
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-space-xs mt-space-md pt-space-xs border-t border-surface-container">
            <button
              onClick={() => onSelectArtisanForProfile(priyaProf, 'at-home')}
              className="flex-1 py-3 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-caps text-label-caps uppercase tracking-wider text-center"
              type="button"
            >
              View Profile &amp; Reviews
            </button>
            <button
              onClick={() => toggleSelection('priya', 'Priya Sharma', 2500)}
              className={`itinerary-btn flex-1 py-3 px-space-sm font-label-caps text-label-caps uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-colors ${
                itinerary['priya']?.selected
                  ? 'bg-primary text-on-primary hover:bg-neutral-800'
                  : 'bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {itinerary['priya']?.selected ? 'check' : 'add'}
              </span>
              <span>{itinerary['priya']?.selected ? 'Added to Itinerary' : 'Add to Itinerary'}</span>
            </button>
          </div>
        </article>

        {/* Card 2: Rohan Mehra Atelier */}
        <article className="bg-surface-container-lowest p-space-md transition-all group border border-surface-container shadow-sm" id="artist-card-rohan">
          <div className="flex items-start gap-space-md">
            {/* Photo Container */}
            <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden bg-surface-container">
              <img
                alt="Rohan Mehra Portrait"
                className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                src={rohanProf.profilePhoto}
              />
              <span className="absolute top-1 left-1 bg-surface-container-lowest text-on-surface font-label-caps text-[9px] px-1 py-0.5 uppercase tracking-wider">
                Atelier
              </span>
            </div>

            {/* Meta Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Rohan Mehra Atelier</h2>
                <button
                  aria-label="Save artist"
                  onClick={() => togglePointEndorsement('rohan')}
                  className="text-outline hover:text-primary transition-colors p-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {pointsEndorsed['rohan'] ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary bg-surface-container px-1.5 py-0.5">
                  Salon Owner &amp; Master Stylist
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-1.5 line-clamp-1">
                Architectural Updos, Saree Draping &amp; Hair Spa • Sector 18, Noida
              </p>
              <div className="flex flex-wrap items-center justify-between gap-y-1 mt-2 pt-0.5 border-t border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">4.96</span>
                    <span className="font-label-caps text-[10px] text-outline">(215)</span>
                  </div>
                  <span className="text-outline text-[10px]">•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                    <span className="font-label-caps text-[10px] font-medium tracking-wider uppercase text-on-surface">890 AURA Points</span>
                  </div>
                  <span className="text-outline text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] tracking-wider uppercase text-on-surface">From ₹1,500</span>
                </div>
                <button
                  aria-label="Endorse Rohan Mehra"
                  onClick={() => togglePointEndorsement('rohan')}
                  className="flex items-center gap-1 px-1.5 py-0.5 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
                  title="Endorse with an AURA Point"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                  <span className="font-label-caps text-[9px] uppercase tracking-wider font-medium">Point</span>
                </button>
              </div>
            </div>
          </div>

          {/* Match Metric & Availability Tag */}
          <div className="mt-space-sm py-1.5 px-space-sm bg-surface-container-low flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center justify-between gap-space-xs">
              <div className="flex items-center gap-1 min-w-0">
                <span className="material-symbols-outlined text-[15px] text-primary">check_circle</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface font-medium">Referred for Saree Draping</span>
              </div>
              <div className="flex items-center gap-1 justify-end min-w-0 text-primary font-medium">
                <span className="material-symbols-outlined text-[14px]">home</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider">At-Home Visit</span>
                <span className="text-outline text-[9px]">•</span>
                <span className="font-label-caps text-[10px] text-secondary">3.8 km away</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-surface-container-high pt-1 text-[10px] font-label-caps text-secondary uppercase tracking-wider">
              <span>Sector 18 Studio + Doorstep Visagiste</span>
              <span className="text-on-surface font-medium">₹1,500 Base + ₹300 Home Surcharge</span>
            </div>
          </div>

          {/* Portfolio Cuts */}
          <div className="mt-space-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary">Signature Hair &amp; Draping Cuts</span>
              <span className="font-label-caps text-[10px] text-outline">Editorial Archive</span>
            </div>
            <div className="grid grid-cols-3 gap-space-xs">
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  alt="Messy Bun Updo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3JnRhrD3KaLnrlauNwHedVH5CscSATUbKr44pEPoFUsID1razQBitPNcs2QUM4dD16DfV1KWb0dTEnEzEqfRtibGVgj8EGP7CR-in_N53bP4FzSDhSK-rhQ_1XHdYbMN7ZNRVfZwGTtBgydY5DuzvXq6MIBpUaSBY0udXwCdxkG43xFbhFuiZACONBJB81mxzEBObBCsFlqpt_5pvngiz2Clf63v6sze-SWKpZxS8NLLXHmLCjF9zhQ"
                />
                <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                  Messy Bun
                </span>
              </div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  alt="Textured Braid"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASvErpn4wNRAXYIJeW0FKsswaioSk06hS_5GbxdMTfvZ-dYplNnt7J-NyE_xlrT-7F_TEjkzkLhAy6-9TOud7ND72v5qPuJO7DA0wBfPnV52LJd5UdWbEyrjcr3JLYuLDFzWFhcjfs3BB1gUEkJrirDBwi4PmGcDaFq7M0gDasmzXrLIvX68Pi4yhs9BlIo-L7f9Cuajdy9JGKDeHqinfJE9FntYPhVR9QHqAmVs9BhLiCVp8G8g707w"
                />
                <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                  Textured Braid
                </span>
              </div>
              <div className="relative aspect-square overflow-hidden bg-surface-container">
                <img
                  alt="Royal Saree Draping"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5xcrtG5A7OOOKSiNJDWab4-hyzlAgaF9Y3Ixsh6X6PbubPAT2adxpSRM56af4p4Wdwgjem920eUJbZDwQIX7iS29rpvOhVESCWOhEMpg0CCwrnGopNeepvpWc-fFv_hUIlNW88hvvAUqL9LrAzMVTjNQm1xmNFodmmx8pkBPQwpkOR7Pc8VzPCKOXtEH8VFU_7TlNQtnmmlz7Gm-YOagp2UoJbDmOosHLQI7GOywDSlQstoA5Acg05Q"
                />
                <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                  Royal Draping
                </span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-space-xs mt-space-md pt-space-xs border-t border-surface-container">
            <button
              onClick={() => onSelectArtisanForProfile(rohanProf, 'at-home')}
              className="flex-1 py-3 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-caps text-label-caps uppercase tracking-wider text-center"
              type="button"
            >
              View Profile
            </button>
            <button
              onClick={() => toggleSelection('rohan', 'Rohan Mehra', 1500)}
              className={`itinerary-btn flex-1 py-3 px-space-sm font-label-caps text-label-caps uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-colors ${
                itinerary['rohan']?.selected
                  ? 'bg-primary text-on-primary hover:bg-neutral-800'
                  : 'bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {itinerary['rohan']?.selected ? 'check' : 'add'}
              </span>
              <span>{itinerary['rohan']?.selected ? 'Added to Itinerary' : 'Add to Itinerary'}</span>
            </button>
          </div>
        </article>

        {/* Card 3: Meera Kapoor */}
        <article className="bg-surface-container-lowest p-space-md transition-all group border border-surface-container shadow-sm" id="artist-card-meera">
          <div className="flex items-start gap-space-md">
            {/* Photo Container */}
            <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden bg-surface-container">
              <img
                alt="Meera Kapoor Portrait"
                className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                src={meeraProf.profilePhoto}
              />
            </div>

            {/* Meta Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Meera Kapoor</h2>
                <button
                  aria-label="Save artist"
                  onClick={() => togglePointEndorsement('meera')}
                  className="text-outline hover:text-primary transition-colors p-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {pointsEndorsed['meera'] ? 'bookmark' : 'bookmark_border'}
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary bg-surface-container px-1.5 py-0.5">
                  Couture Nail &amp; Henna Artisan
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary mt-1.5 line-clamp-1">
                Minimalist Chrome Gel Nails &amp; Modern Mehendi • Greater Noida
              </p>
              <div className="flex flex-wrap items-center justify-between gap-y-1 mt-2 pt-0.5 border-t border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">4.98</span>
                    <span className="font-label-caps text-[10px] text-outline">(190)</span>
                  </div>
                  <span className="text-outline text-[10px]">•</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                    <span className="font-label-caps text-[10px] font-medium tracking-wider uppercase text-on-surface">645 AURA Points</span>
                  </div>
                  <span className="text-outline text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] tracking-wider uppercase text-on-surface">From ₹1,200</span>
                </div>
                <button
                  aria-label="Endorse Meera Kapoor"
                  onClick={() => togglePointEndorsement('meera')}
                  className="flex items-center gap-1 px-1.5 py-0.5 bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
                  title="Endorse with an AURA Point"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px] text-primary">auto_awesome</span>
                  <span className="font-label-caps text-[9px] uppercase tracking-wider font-medium">Point</span>
                </button>
              </div>
            </div>
          </div>

          {/* Match Metric & Availability Tag */}
          <div className="mt-space-sm py-1.5 px-space-sm bg-surface-container-low flex flex-col gap-1 border border-surface-container">
            <div className="flex items-center justify-between gap-space-xs">
              <div className="flex items-center gap-1 min-w-0">
                <span className="material-symbols-outlined text-[15px] text-primary">spa</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface font-medium">94% Lookbook Align</span>
              </div>
              <div className="flex items-center gap-1 justify-end min-w-0 text-primary font-medium">
                <span className="material-symbols-outlined text-[14px]">home</span>
                <span className="font-label-caps text-[10px] uppercase tracking-wider">At-Home Specialist</span>
                <span className="text-outline text-[9px]">•</span>
                <span className="font-label-caps text-[10px] text-secondary">5.1 km away</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-surface-container-high pt-1 text-[10px] font-label-caps text-secondary uppercase tracking-wider">
              <span>Greater Noida &amp; Noida Expwy • Mobile Setup</span>
              <span className="text-on-surface font-medium">₹1,200 All-Inclusive At Home</span>
            </div>
          </div>

          {/* Preview Pair */}
          <div className="grid grid-cols-2 gap-space-xs mt-space-sm">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
              <img
                alt="Chrome Nails"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApXFkPwUE_AlL88ZS_bw6Nnt3lsQezYZNV7SrfJmIUZFlCAojTG43W_DJ6EooG3qd9C81BDgqnO3SATqE3tQfCc91GTvk1aODLQ74C_y93HkmpHfAJBePqJ8JNw4UmoOVTsYOJUm3xaVisbifI5LNG_Gm9aoWnNLiZsEdqAJiLlE6dCBF4CkLxmE7KAc0D5lcOmq69JGdx2T5QgY1oSCH8Nlc4aSGB7eS9gHyN35vMJ3-A80DH8z55LA"
              />
              <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                Chrome Gel
              </span>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-container">
              <img
                alt="Modern Mehendi"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB10LqU9vvnw1HpHEgPz1q1OCXII7gEdW6MIbjg_aFXzBNZD74fg4iyeBxIAXAretMLBOMPcSrMOINTLRD6JqpC1qj6dRDfs2f5b0fd85-Xom4mp5rUMh_w8KD68P_4m8Mfgede_INsN_uc04LjQf1aH9as4MHAXkxYuD4klEkCihgNe1V2lpbcM6GET6Xf68bOdS7Ty9g0dEyXu9Uo3dvA88w0FTgTZ5_dqDmNwOL9ceVyOqST7OjyKg"
              />
              <span className="absolute bottom-1 left-1 bg-surface-container-lowest/90 px-1 py-0.5 font-label-caps text-[8px] uppercase tracking-widest text-on-surface">
                Modern Mehendi
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-space-xs mt-space-md pt-space-xs border-t border-surface-container">
            <button
              onClick={() => onSelectArtisanForProfile(meeraProf, 'at-home')}
              className="flex-1 py-3 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-caps text-label-caps uppercase tracking-wider text-center"
              type="button"
            >
              View Profile
            </button>
            <button
              onClick={() => toggleSelection('meera', 'Meera Kapoor', 1200)}
              className={`itinerary-btn flex-1 py-3 px-space-sm font-label-caps text-label-caps uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-colors ${
                itinerary['meera']?.selected
                  ? 'bg-primary text-on-primary hover:bg-neutral-800'
                  : 'bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {itinerary['meera']?.selected ? 'check' : 'add'}
              </span>
              <span>{itinerary['meera']?.selected ? 'Added to Itinerary' : 'Add to Itinerary'}</span>
            </button>
          </div>
        </article>

        {/* Empty State / Discreet Discover Callout */}
        <div className="p-space-md bg-surface-container-low text-center border border-surface-container">
          <span className="material-symbols-outlined text-outline text-[28px] mb-1">palette</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Need a Custom Wedding Entourage?</h3>
          <p className="font-body-sm text-body-sm text-secondary max-w-xs mx-auto mt-1">
            Our Delhi NCR concierge curates multiple artists for sangeet, mehendi, and reception schedules in one single invoice.
          </p>
          <button
            onClick={() => alert('AURA Concierge Dispatch concierge has been alerted for your group schedule.')}
            className="mt-space-sm px-space-md py-2.5 bg-surface-container-lowest text-on-surface font-label-caps text-label-caps uppercase tracking-wider hover:bg-surface-container-high transition-colors border border-surface-container"
            type="button"
          >
            Request Concierge Dispatch
          </button>
        </div>
      </div>

      {/* Sticky Booking Bar Overlay */}
      <aside className="fixed bottom-20 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-margin-mobile py-space-sm shadow-[0_-4px_16px_rgba(0,0,0,0.06)] border-t border-surface-container" id="itinerary-footer">
        <div className="max-w-screen-md mx-auto flex items-center justify-between gap-space-sm">
          {/* Selection Summary */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-label-caps text-[10px] tracking-widest uppercase text-secondary">Selected Itinerary</span>
            </div>
            <p className="font-subheading text-subheading text-on-surface font-medium truncate mt-0.5" id="itinerary-names">
              {selectedNames}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline-sm text-headline-sm text-on-surface font-medium" id="itinerary-total">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="font-caption text-caption text-outline truncate">
                (₹{bookingDeposit.toLocaleString('en-IN')} Booking • ₹{balance.toLocaleString('en-IN')} at Salon/Home)
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceedItinerary}
            className="flex-shrink-0 py-3.5 px-space-md bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-label-caps text-label-caps uppercase tracking-widest flex items-center gap-1"
            type="button"
          >
            <span>Proceed</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
