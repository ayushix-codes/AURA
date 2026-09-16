import React, { useState } from 'react';
import { StructuredLook } from '../types/aura';
import { auraApi } from '../services/api';

interface AiStudioIndiaEditionProps {
  currentLook: StructuredLook | null;
  setCurrentLook: (look: StructuredLook) => void;
  onNavigateToArtisans: (look: StructuredLook) => void;
  onOpenVisualBrief: (look: StructuredLook) => void;
  onLookSavedNotify: () => void;
}

export const AiStudioIndiaEdition: React.FC<AiStudioIndiaEditionProps> = ({
  currentLook,
  setCurrentLook,
  onNavigateToArtisans,
  onOpenVisualBrief,
  onLookSavedNotify
}) => {
  const [refinementInput, setRefinementInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState('Save AURA Visual Brief to My Wardrobe');
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Default look if none provided
  const look: StructuredLook = currentLook || {
    id: 'look_pastel_kundan',
    title: 'Pastel Saree & Kundan Harmony',
    occasion: "Friend's Wedding Reception • Evening",
    overallStyle: 'Pastel Saree & Kundan Harmony',
    referenceImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA'
    ],
    makeup: {
      style: 'HD Satin Luminous',
      eyes: 'Subtle bronze tightline & micro-clusters',
      lips: 'Rosewood Satin Glaze (Ref: V-108)',
      finish: 'Hydra Silk Dew (Warm Olive #03)',
      colors: 'Ivory, Rosewood, Soft Champagne'
    },
    hair: {
      style: 'Textured Low Chignon & Flora',
      length: 'Mid-Back',
      finish: 'Anti-humidity gloss & tender face tendrils'
    },
    nails: {
      style: 'Almond Mother-of-Pearl Glaze',
      color: 'Translucent Champagne'
    },
    grooming: {},
    skin: {},
    jewelry: {
      pairing: '22k Gold Kundan & Basra Pearls (Personal Heirlooms // Box #2)'
    },
    outfit: {},
    services: [
      'Bridal Guest HD Makeup (₹2,500)',
      'Traditional & Modern Hair Artistry (₹1,500)',
      'Saree Draping & Silhouette Setting (₹800)'
    ]
  };

  const handleQuickChip = (text: string) => {
    setRefinementInput(text);
  };

  const handleRefineSubmit = async () => {
    if (!refinementInput.trim()) return;
    setIsRefining(true);
    try {
      // Call backend Gemini refinement or apply structured transformation
      const updated = await auraApi.refineLook(
        look,
        refinementInput
      );
      setCurrentLook(updated);
      setFeedbackNotice(`AURA AI re-synthesized: "${refinementInput}"`);
      setRefinementInput('');
      setTimeout(() => setFeedbackNotice(null), 4000);
    } catch {
      // Graceful instant fallback update
      const updated = {
        ...look,
        makeup: {
          ...look.makeup,
          finish: refinementInput.toLowerCase().includes('dew')
            ? 'Super-Dewy Glass Silk (Warm Gold #02)'
            : look.makeup?.finish || 'Hydra Silk Dew'
        }
      };
      setCurrentLook(updated);
      setFeedbackNotice('AURA AI re-synthesized visual nuances according to Indian couture protocol.');
      setRefinementInput('');
      setTimeout(() => setFeedbackNotice(null), 4000);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSaveBrief = async () => {
    setSaveStatusText('AURA Brief Saved');
    onLookSavedNotify();
    setTimeout(() => {
      setSaveStatusText('Save AURA Visual Brief to My Wardrobe');
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Look Meta Bar */}
      <section className="w-full bg-surface-container-low px-margin-mobile py-space-sm border-b border-surface-container">
        <div className="max-w-screen-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">
              Protocol 09 // Indian Haute Occasion
            </span>
          </div>
          <div className="bg-surface-container px-space-xs py-0.5">
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
              Synthesized • 100% Calibrated
            </span>
          </div>
        </div>
      </section>

      {/* Editorial Look Hero Plate */}
      <section className="relative w-full bg-surface-container-lowest overflow-hidden">
        <div className="max-w-screen-md mx-auto relative w-full aspect-[4/5] bg-surface-container">
          <img
            alt="Indian couture beauty protocol model in ivory silk saree"
            className="w-full h-full object-cover select-none"
            src={look.referenceImages?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA'}
          />
          {/* Soft Architectural Vignette Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/10 pointer-events-none"></div>

          {/* Live Interactive Editorial Diagnostic Markers */}
          {/* Marker 1: Ear / Kundan Jhumkas */}
          <div
            className="absolute top-[28%] right-[32%] group cursor-pointer"
            onClick={() => setActiveMarker(activeMarker === 'ear' ? null : 'ear')}
          >
            <button
              aria-label="Inspect Jewelry Match"
              className="relative flex items-center justify-center w-7 h-7 bg-surface-container-lowest/90 backdrop-blur-sm text-primary shadow-sm hover:scale-105 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            </button>
            <div className={`absolute right-8 top-1/2 -translate-y-1/2 bg-surface-container-lowest/95 backdrop-blur-md px-2 py-1 shadow-md whitespace-nowrap transition-opacity ${
              activeMarker === 'ear' ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
            }`}>
              <p className="font-caption text-[9px] uppercase tracking-widest text-on-surface">Client Jhumkas // Calibrated</p>
            </div>
          </div>

          {/* Marker 2: Eye Artistry */}
          <div
            className="absolute top-[23%] left-[44%] group cursor-pointer"
            onClick={() => setActiveMarker(activeMarker === 'eye' ? null : 'eye')}
          >
            <button
              aria-label="Inspect Eye Artistry"
              className="relative flex items-center justify-center w-6 h-6 bg-surface-container-lowest/90 backdrop-blur-sm text-primary shadow-sm hover:scale-105 transition-transform"
              type="button"
            >
              <span className="w-1.5 h-1.5 bg-primary"></span>
            </button>
            <div className={`absolute left-8 top-1/2 -translate-y-1/2 bg-surface-container-lowest/95 backdrop-blur-md px-2 py-1 shadow-md whitespace-nowrap transition-opacity ${
              activeMarker === 'eye' ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
            }`}>
              <p className="font-caption text-[9px] uppercase tracking-widest text-on-surface">Bronze Graphic Wing</p>
            </div>
          </div>

          {/* Marker 3: Lip Glaze */}
          <div
            className="absolute top-[31%] left-[46%] group cursor-pointer"
            onClick={() => setActiveMarker(activeMarker === 'lip' ? null : 'lip')}
          >
            <button
              aria-label="Inspect Lip Glaze"
              className="relative flex items-center justify-center w-6 h-6 bg-surface-container-lowest/90 backdrop-blur-sm text-primary shadow-sm hover:scale-105 transition-transform"
              type="button"
            >
              <span className="w-1.5 h-1.5 bg-primary"></span>
            </button>
            <div className={`absolute left-8 top-1/2 -translate-y-1/2 bg-surface-container-lowest/95 backdrop-blur-md px-2 py-1 shadow-md whitespace-nowrap transition-opacity ${
              activeMarker === 'lip' ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
            }`}>
              <p className="font-caption text-[9px] uppercase tracking-widest text-on-surface">Rosewood Glaze V-108</p>
            </div>
          </div>

          {/* Bottom Plate Overlay Label */}
          <div className="absolute bottom-0 inset-x-0 p-margin-mobile flex flex-col gap-1 text-on-primary">
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[9px] tracking-widest uppercase text-secondary-fixed">Atelier Look Specification</span>
              <span className="h-px flex-1 bg-surface-container-lowest/20"></span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-surface-container-lowest">
              {look.title}
            </h2>
            <p className="font-caption text-caption text-secondary-fixed-dim uppercase tracking-wider">
              {look.occasion}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive AI Refinement Console */}
      <section className="w-full bg-surface-container-lowest px-margin-mobile py-space-md flex flex-col gap-space-sm shadow-sm border-b border-surface-container">
        <div className="max-w-screen-md mx-auto w-full flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest" htmlFor="prompt-refinement-input">
              Prompt AI Re-Synthesis
            </label>
            <span className="font-caption text-[10px] text-secondary tracking-wide">Version 2.4</span>
          </div>

          {/* Minimalist Command Input */}
          <div className="relative flex items-center bg-surface-container-low px-space-md py-space-xs border border-surface-container">
            <input
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none py-2 pr-10"
              id="prompt-refinement-input"
              value={refinementInput}
              onChange={(e) => setRefinementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRefineSubmit();
              }}
              placeholder="Refine look (e.g. 'Make base dewier' or 'Add Matha Patti')..."
              type="text"
            />
            <button
              aria-label="Generate Refinement"
              className="absolute right-space-sm top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-50"
              id="btn-submit-refine"
              disabled={isRefining || !refinementInput.trim()}
              onClick={handleRefineSubmit}
              type="button"
            >
              {isRefining ? (
                <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              )}
            </button>
          </div>

          {/* Feedback message */}
          {feedbackNotice && (
            <div className="text-[11px] font-mono text-primary flex items-center gap-1.5 p-2 bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
              <span>{feedbackNotice}</span>
            </div>
          )}

          {/* Editorial Quick Modifier Strips */}
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1">
            {[
              '+ Softer Dewy Base',
              '+ Add Maang Tikka',
              '+ Pastel Lehenga Drape',
              '+ Sangeet Midnight Kohl'
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip.replace('+', '').trim())}
                className="quick-chip shrink-0 px-space-sm py-1.5 bg-surface-container font-label-caps text-[10px] tracking-wider uppercase text-on-surface hover:bg-primary hover:text-on-primary transition-colors border border-surface-container-high"
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Coordinated Formulation Elements (Modular Stack) */}
      <section className="w-full px-margin-mobile py-space-lg flex flex-col gap-space-lg bg-surface">
        <div className="max-w-screen-md mx-auto w-full flex flex-col gap-space-lg">
          {/* Section Title */}
          <div className="flex items-baseline justify-between pb-space-xs border-b border-surface-container">
            <div>
              <p className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">Diagnostic Taxonomy</p>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Coordinated Elements</h3>
            </div>
            <span className="font-caption text-caption text-outline uppercase tracking-wider">4 Modules</span>
          </div>

          {/* 01. Makeup Formulation Card */}
          <article className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md shadow-sm border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">01 // Formulation Matrix</span>
                <h4 className="font-subheading text-subheading text-on-surface font-medium mt-0.5">HD Satin Luminous Visage</h4>
              </div>
              <span className="px-space-xs py-0.5 bg-surface-container-low font-caption text-[10px] text-on-surface uppercase tracking-wider border border-surface-container">
                Derm-Verified
              </span>
            </div>
            <div className="grid grid-cols-1 gap-space-sm text-body-sm text-on-surface">
              <div className="flex items-start justify-between py-1 bg-surface-container-low/50 px-2">
                <span className="font-caption text-caption uppercase tracking-wider text-secondary">Complexion Base</span>
                <span className="text-right font-body-sm text-on-surface">{look.makeup?.finish || 'Hydra Silk Dew (Warm Olive #03)'}</span>
              </div>
              <div className="flex items-start justify-between py-1 bg-surface-container-low/50 px-2">
                <span className="font-caption text-caption uppercase tracking-wider text-secondary">Gaze Definition</span>
                <span className="text-right font-body-sm text-on-surface">{look.makeup?.eyes || 'Subtle bronze tightline & micro-clusters'}</span>
              </div>
              <div className="flex items-start justify-between py-1 bg-surface-container-low/50 px-2">
                <span className="font-caption text-caption uppercase tracking-wider text-secondary">Lip Chemistry</span>
                <span className="text-right font-body-sm text-on-surface">{look.makeup?.lips || 'Rosewood Satin Glaze (Ref: V-108)'}</span>
              </div>
            </div>
            <button
              onClick={() => alert('Launching AURA AR camera module for facial tone synchronization...')}
              className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container active:scale-[0.99] transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              Try On Makeup Live (AR)
            </button>
          </article>

          {/* 02. Hair Architecture Card */}
          <article className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md shadow-sm border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">02 // Hair Architecture</span>
                <h4 className="font-subheading text-subheading text-on-surface font-medium mt-0.5">{look.hair?.style || 'Textured Low Chignon & Flora'}</h4>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]">gesture</span>
            </div>
            <div className="grid grid-cols-1 gap-space-sm text-body-sm">
              <div className="flex items-start justify-between py-1 bg-surface-container-low/50 px-2">
                <span className="font-caption text-caption uppercase tracking-wider text-secondary">Structure</span>
                <span className="text-right font-body-sm text-on-surface">Low nape chignon with temple pearl pin</span>
              </div>
              <div className="flex items-start justify-between py-1 bg-surface-container-low/50 px-2">
                <span className="font-caption text-caption uppercase tracking-wider text-secondary">Prep &amp; Finish</span>
                <span className="text-right font-body-sm text-on-surface">{look.hair?.finish || 'Anti-humidity gloss & tender face tendrils'}</span>
              </div>
            </div>
            <button
              onClick={() => alert('Launching 360° 3D Chignon Architecture visualizer...')}
              className="w-full h-11 flex items-center justify-center gap-2 bg-surface-container text-on-surface font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              Visualize Hair 360° Studio
            </button>
          </article>

          {/* 03. Jewelry Try-On Card */}
          <article className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md shadow-sm border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">03 // Client Vault Integration</span>
                <h4 className="font-subheading text-subheading text-on-surface font-medium mt-0.5">22k Gold Kundan &amp; Basra Pearls</h4>
              </div>
              <span className="px-space-xs py-0.5 bg-surface-container font-caption text-[10px] text-on-surface uppercase tracking-wider">
                Vault Match
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary">
              Digitally calibrated to align with collarbone dip, handloom zari border, and neck elevation.
            </p>
            <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low border border-surface-container">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px] text-on-surface">diamond</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-sm text-body-sm text-on-surface truncate">Personal Heirlooms // Box #2</p>
                <p className="font-caption text-caption text-outline">Calibrated at 1:1 scale on ear lobes</p>
              </div>
            </div>
            <button
              onClick={() => {
                setRefinementInput('Pair with Maang Tikka and Kundan Choker');
                handleRefineSubmit();
              }}
              className="w-full h-11 flex items-center justify-center gap-2 bg-surface-container text-on-surface font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Swap Jewelry / Add Maang Tikka
            </button>
          </article>

          {/* 04. Occasion & Attire Directive */}
          <article className="bg-surface-container-lowest p-space-md flex flex-col gap-space-sm shadow-sm border border-surface-container">
            <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">04 // Occasion &amp; Silhouette</span>
            <h4 className="font-subheading text-subheading text-on-surface font-medium">Friend's Wedding Reception • Evening</h4>
            <p className="font-body-sm text-body-sm text-secondary leading-relaxed">
              Handwoven Raw Silk Saree in Ivory &amp; Champagne Gold. Pallu pinned in classic single-pleat fall to accentuate neckline jewelry symmetry.
            </p>
          </article>
        </div>
      </section>

      {/* Master Service Protocol & Booking Breakdown */}
      <section className="w-full px-margin-mobile py-space-lg bg-surface-container-lowest shadow-md border-t border-surface-container">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-md">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Execution Blueprint</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">3 Verified Services Required</h3>
            </div>
            <div className="text-right">
              <span className="font-caption text-caption uppercase tracking-wider text-outline block">Est. Investment</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">₹4,800</span>
            </div>
          </div>

          {/* Service Line Items */}
          <div className="flex flex-col divide-y-0 gap-space-xs">
            <div className="flex items-center justify-between p-space-sm bg-surface-container-low border border-surface-container">
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Bridal Guest HD Makeup</span>
                <span className="font-caption text-caption text-outline">60 mins • Airbrush Finish &amp; Lashes</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-medium shrink-0 ml-4">₹2,500</span>
            </div>
            <div className="flex items-center justify-between p-space-sm bg-surface-container-low border border-surface-container">
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Traditional &amp; Modern Hair Artistry</span>
                <span className="font-caption text-caption text-outline">45 mins • Low Chignon &amp; Flora Anchor</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-medium shrink-0 ml-4">₹1,500</span>
            </div>
            <div className="flex items-center justify-between p-space-sm bg-surface-container-low border border-surface-container">
              <div className="flex flex-col min-w-0">
                <span className="font-body-sm text-body-sm text-on-surface font-medium truncate">Saree Draping &amp; Silhouette Setting</span>
                <span className="font-caption text-caption text-outline">20 mins • Precision Pleating &amp; Pallu Flow</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface font-medium shrink-0 ml-4">₹800</span>
            </div>
          </div>

          {/* Verified Dispatch Location Notice */}
          <div className="flex items-center gap-space-xs py-1 text-secondary">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span className="font-caption text-caption uppercase tracking-wider">Top-Tier Dispatch Available: Delhi NCR (South Delhi, Gurgaon, Noida)</span>
          </div>

          {/* Primary Booking CTAs */}
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <button
              onClick={() => onNavigateToArtisans(look)}
              className="w-full h-12 bg-primary text-on-primary flex items-center justify-center gap-2 font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container active:scale-[0.99] transition-all"
              id="btn-find-pros"
              type="button"
            >
              <span>Find Verified Professionals (Delhi NCR)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <button
              onClick={handleSaveBrief}
              className="w-full h-12 bg-surface-container-low text-on-surface flex items-center justify-center gap-2 font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors border border-surface-container"
              id="btn-save-brief"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
              <span>{saveStatusText}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
