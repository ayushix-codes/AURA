import React, { useState, useEffect } from 'react';
import { StructuredLook } from '../types/aura';
import { savedLooksService } from '../firebase/savedLooksService';

interface DiscoverIndiaEditionProps {
  looks?: StructuredLook[];
  onSelectLookForStudio: (look?: any, promptText?: string) => void;
  onBookLookWithArtisans: (look?: any) => void;
  onNavigateToPros?: () => void;
  onNavigateToBooking?: () => void;
  savedLookIds?: Set<string>;
  onToggleSaveLook?: (look: Partial<StructuredLook> & { id: string }) => void;
  onLookSavedNotify?: (message: string, points: number) => void;
  currentUserId?: string;
}

export const DiscoverIndiaEdition: React.FC<DiscoverIndiaEditionProps> = ({
  looks,
  onSelectLookForStudio,
  onBookLookWithArtisans,
  onNavigateToPros,
  onNavigateToBooking,
  savedLookIds: propSavedLookIds,
  onToggleSaveLook,
  onLookSavedNotify,
  currentUserId
}) => {
  const [activeMode, setActiveMode] = useState<'salon' | 'home'>('salon');
  const [selectedOccasion, setSelectedOccasion] = useState('Wedding / Shaadi');
  const [promptText, setPromptText] = useState(
    "Soft glam makeup for a friend's wedding with a pastel silk saree and statement jhumkas..."
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [arModalOpen, setArModalOpen] = useState(false);
  const [activeArLook, setActiveArLook] = useState<string | null>(null);
  const [uploadedRef, setUploadedRef] = useState<string | null>(null);
  const [localSavedIds, setLocalSavedIds] = useState<Set<string>>(new Set());

  const effectiveUserId = currentUserId || localStorage.getItem('aura_user_id') || 'demo_user';

  useEffect(() => {
    savedLooksService.getSavedLookIds(effectiveUserId)
      .then(ids => {
        setLocalSavedIds(new Set(ids));
      })
      .catch(err => {
        console.warn('Could not fetch saved look IDs:', err);
      });
  }, [effectiveUserId]);

  const occasions = [
    'Wedding / Shaadi',
    'Mehendi & Sangeet',
    'Reception',
    'Diwali Gala',
    'Cocktail Indo-Western',
    'Office Minimal'
  ];

  const handleOccasionClick = (occ: string) => {
    setSelectedOccasion(occ);
    if (!promptText || promptText.includes('wedding')) {
      setPromptText(`${occ} beauty concept with subtle radiant finish and traditional undertones...`);
    }
  };

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      onSelectLookForStudio(undefined, promptText);
    }, 1000);
  };

  const handleReferenceUpload = (type: string) => {
    setUploadedRef(type);
    setTimeout(() => setUploadedRef(null), 3000);
  };

  const isLookSaved = (lookId: string): boolean => {
    if (propSavedLookIds && propSavedLookIds.has(lookId)) return true;
    return localSavedIds.has(lookId);
  };

  const handleToggleSave = async (look: StructuredLook) => {
    const targetId = look.lookId || look.id;
    const isSavedCurrently = isLookSaved(targetId);

    setLocalSavedIds(prev => {
      const next = new Set(prev);
      if (isSavedCurrently) next.delete(targetId);
      else next.add(targetId);
      return next;
    });

    if (onToggleSaveLook) {
      onToggleSaveLook(look);
    }

    try {
      const res = await savedLooksService.toggleSaveLook(effectiveUserId, look);
      setLocalSavedIds(prev => {
        const next = new Set(prev);
        if (res.saved) next.add(targetId);
        else next.delete(targetId);
        return next;
      });

      if (res.saved && onLookSavedNotify) {
        onLookSavedNotify(`Saved "${look.title}" to My AURA • Saved Looks`, 50);
      } else if (!res.saved && onLookSavedNotify) {
        onLookSavedNotify(`Removed "${look.title}" from Saved Looks`, 0);
      }
    } catch (err) {
      console.error('Failed to toggle save look:', err);
      setLocalSavedIds(prev => {
        const next = new Set(prev);
        if (isSavedCurrently) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Location & Context Header Bar */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-sm border-b border-surface-container">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-space-xs text-left group" type="button">
              <span className="material-symbols-outlined text-[18px] text-on-surface">location_on</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Territory</span>
                <span className="font-body-md text-body-md font-medium text-on-surface truncate group-hover:text-secondary transition-colors">
                  Delhi NCR • South Extension, New Delhi
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-outline ml-1">expand_more</span>
            </button>
            <div className="flex items-center gap-1 bg-surface-container-low p-1">
              <button
                className={`px-space-sm py-1 font-label-caps text-[10px] uppercase tracking-widest transition-all ${
                  activeMode === 'salon'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveMode('salon')}
                type="button"
              >
                At Salon
              </button>
              <button
                className={`px-space-sm py-1 font-label-caps text-[10px] uppercase tracking-widest transition-all ${
                  activeMode === 'home'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setActiveMode('home')}
                type="button"
              >
                At Home
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">Radius: 8 km</span>
            </div>
            <span className="font-caption text-caption uppercase text-on-surface-variant tracking-widest">38 Verified Studios Active</span>
          </div>
        </div>
      </section>

      {/* Editorial AI Look Studio Prompt Module */}
      <section className="w-full bg-surface px-gutter-mobile py-space-lg">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest">AURA Synthesis Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
              <span className="font-caption text-caption uppercase text-on-surface-variant">v3.4 India Edition</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-normal tracking-tight">
              Your look. Your style. <span className="italic font-display-mobile">Your AURA.</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Create, visualize, and book bespoke Indian &amp; contemporary beauty with precision AI.
            </p>
          </div>

          {/* AI Prompt Box with Hairstyle/Occasion Precision */}
          <div className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md shadow-sm border border-surface-container">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest flex items-center gap-1" htmlFor="ai-prompt-input">
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span> Prompt Manifest
                </label>
                <span className="font-caption text-caption text-secondary uppercase tracking-wider">Hinglish Assisted</span>
              </div>
              <div className="relative">
                <textarea
                  className="w-full bg-surface-container-low text-on-surface p-space-md font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface resize-none transition-colors border border-transparent focus:border-surface-container-highest"
                  id="ai-prompt-input"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Soft glam makeup for a friend's wedding with a pastel silk saree and statement jhumkas..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="material-symbols-outlined text-[14px] text-outline">translate</span>
                <span className="font-caption text-caption text-on-surface-variant italic">
                  Also understands: “Cousin ki shaadi ke liye dewy soft glam with sleek gajra bun...”
                </span>
              </div>
            </div>

            {/* Occasion Taxonomy Chips */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Occasion Archetype</span>
              <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
                {occasions.map((occ) => {
                  const isSelected = selectedOccasion === occ;
                  return (
                    <button
                      key={occ}
                      className={`px-space-sm py-1.5 font-label-caps text-[10px] uppercase tracking-wider flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                      }`}
                      onClick={() => handleOccasionClick(occ)}
                      type="button"
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reference Layer Chips */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Diagnostic References</span>
                <span className="font-caption text-caption text-on-surface-variant">Multi-modal Layering</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Face Scan', type: 'face' },
                  { label: 'Saree / Outfit', type: 'outfit' },
                  { label: 'Jewelry Plate', type: 'jewelry' },
                  { label: 'Moodboard', type: 'mood' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleReferenceUpload(item.label)}
                    className="flex items-center justify-between p-space-sm bg-surface-container-low hover:bg-surface-variant text-left transition-colors border border-surface-container"
                    type="button"
                  >
                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface">{item.label}</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface">add</span>
                  </button>
                ))}
              </div>
              {uploadedRef && (
                <div className="text-[11px] font-mono text-primary flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>{uploadedRef} reference linked for synthesis</span>
                </div>
              )}
            </div>

            {/* CTA Cluster */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                className="w-full py-3.5 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-on-surface transition-colors active:scale-[0.99] disabled:opacity-75"
                id="generate-btn"
                onClick={handleSynthesize}
                disabled={isSynthesizing}
                type="button"
              >
                <span>{isSynthesizing ? 'SYNTHESIZING LOOK...' : 'GENERATE BESPOKE LOOK'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>

              <button
                onClick={onNavigateToPros}
                className="w-full py-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] uppercase tracking-widest text-center transition-colors border border-surface-container"
                type="button"
              >
                EXPLORE VERIFIED ARTISTS DIRECTLY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Indian Beauty Services Matrix */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-lg border-y border-surface-container">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-md">
          <div className="flex items-end justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Atelier Services</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-normal">Curated Treatments</h2>
            </div>
            <span className="font-caption text-caption uppercase text-on-surface-variant tracking-widest">Doorstep &amp; Studio</span>
          </div>

          <div className="flex items-center gap-space-sm overflow-x-auto pb-2 no-scrollbar">
            {[
              { title: 'Bridal & Reception', desc: 'HD Airbrush, Kundan Accent', price: 'From ₹4,500', icon: 'face_retouching_natural' },
              { title: 'Hair & Saree Draping', desc: 'Architectural Buns, Pleat Setting', price: 'From ₹1,800', icon: 'dry' },
              { title: 'Pre-Bridal Glow', desc: 'K-Hydra Infusion & Gold Polishing', price: 'From ₹3,200', icon: 'spa' },
              { title: 'Mehendi Artistry', desc: 'Organic Rajasthani & Arabic Lace', price: 'From ₹2,500', icon: 'palette' },
              { title: 'Editorial Grooming', desc: 'Precision Brow & Glass Skin Prep', price: 'From ₹1,200', icon: 'content_cut' }
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={onNavigateToPros}
                className="flex flex-col p-space-md bg-surface-container-low min-w-[210px] max-w-[220px] flex-shrink-0 gap-space-sm hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-container"
              >
                <span className="material-symbols-outlined text-[24px] text-primary">{s.icon}</span>
                <div>
                  <h3 className="font-subheading text-subheading font-medium text-on-surface">{s.title}</h3>
                  <p className="font-caption text-caption text-on-surface-variant">{s.desc}</p>
                </div>
                <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-highest">
                  <span className="font-label-caps text-[11px] text-primary font-medium">{s.price}</span>
                  <span className="material-symbols-outlined text-[16px] text-outline">north_east</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Regional Looks Gallery */}
      <section className="w-full bg-surface px-gutter-mobile py-space-lg">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Community &amp; Discover Feed</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-normal">Trending in Delhi NCR &amp; Mumbai</h2>
            </div>
            <span className="font-caption text-caption text-secondary uppercase tracking-wider">Live Lookbook</span>
          </div>

          {/* Curated Community Look Cards with Save/Bookmark */}
          {[
            {
              id: 'look_ivory_dew',
              creatorId: 'usr_radhika_merchant',
              creatorName: 'Radhika Merchant',
              creatorPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
              title: 'Look 01: Ivory Saree & Gilded Dew',
              caption: 'Bridal HD Makeup • Hair Sculpt • Mogra Setting & Kundan Jewelry Styling',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCZrKi2SgazJYCPoYXcYkVl-H3MYrehpYHHgjmDF1PBEuYALZFWU6AZ9dCs7vLh5nkfo1an5lVqSfbHcbHEteOlB_9724gcJ2hgXK312VAAE1lQ55vqEEvTJkDfuOzTrhA1TWFWnOlJyMBlmUr9JN_yunnJrI0h6KVvREFvoYqIwwo5wkfZnNbYDX1LfvQ4vb39PjLmyWxdec2YNswqG-vbNHkeem7ddMR552DdpB7vQnmtvKlpOfRVw',
              aestheticMatch: '98% Aesthetic Match',
              price: '₹3,500',
              occasion: 'Bridal Guest',
              tags: ['Sweat-Resistant HD', 'Chanderi Drape', 'Kundan Setting'],
              services: ['Bridal HD Makeup', 'Hair Sculpt', 'Mogra Setting & Kundan Jewelry Styling']
            },
            {
              id: 'look_bronze_chignon',
              creatorId: 'usr_kavya_sethi',
              creatorName: 'Kavya Sethi',
              creatorPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
              title: 'Look 02: Contemporary Chignon & Bronze Smoke',
              caption: 'Soft Bronze Glam • Architectural Low Bun • Minimalist Pearl Detailing',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLSBMBLEh7ECudfa-3JMCj-nxzCPmgRj6_abDjyVpUcho7u6VxN_R-85GFruaYbSuCZzh6QbZ76gJY57cwFQOtxb78cajX76sYRct0ekQYbUpF1XTMl16vy4ewyN31eo6pTzHdHd_fnGRPuXdNQvkPbXmlYvErTmsGGY8QorFuGEFXo1NBIf3rGyeWKPuwwTx3Vy_F7FGMqTWMcMWl5BSd_Wf8IIvuMLjPAZ0nPvLX7ewZNP0AxIMKUw',
              aestheticMatch: '95% Aesthetic Match',
              price: '₹2,200',
              occasion: 'Cocktail / Sangeet',
              tags: ['Airbrushed Radiance', 'Indo-Western', 'Temple Pearl Accents'],
              services: ['Soft Bronze Glam', 'Architectural Low Bun', 'Minimalist Pearl Detailing']
            },
            {
              id: 'look_bombay_sunset',
              creatorId: 'usr_zara_shroff',
              creatorName: 'Zara Shroff',
              creatorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
              title: 'Look 03: Bombay Sunset Cocktail Dew',
              caption: 'High-impact glass dew on cheekbones, smudged bronze espresso wash, and sleek center-parted hair',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvJaJJ3tPWyQ7A86Qq7w0G9_JEaJ393B7sK96kSO3uJRVc-LCGSsXL0plIZ7b_Fu_Tt2p1cIvLbR5kXWHvTUoEDBzSMNImdZ-XmCLX_eH85tMWXlKwgp7ER_MXQ5BEhXsdlc7Cj7Aqz1v80GK21kx14xHNZCu70diFsW6N0eoJYD17Kj8HB1895qQBMRbvH3c-RFtm9oFijFbNWZMig8ckp_Kk1E83UBwzPGj4OEdkjTJA6ISY4IrMRw',
              aestheticMatch: '97% Aesthetic Match',
              price: '₹2,800',
              occasion: 'Cocktail / Welcome Party',
              tags: ['Radiant Airbrush', 'Messy French Bun', 'Glazed Chrome Nails'],
              services: ['Cocktail & Reception Airbrush', 'French Bun', 'Glazed Nails']
            },
            {
              id: 'look_pastel_kundan',
              creatorId: 'usr_ananya_roy',
              creatorName: 'Dr. Ananya Roy',
              creatorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
              title: 'Look 04: Pastel Saree & Kundan Harmony',
              caption: 'HD Satin Luminous finish with Rosewood Satin Glaze lips, textured low chignon, and 22k gold Kundan pairing',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA',
              aestheticMatch: '96% Aesthetic Match',
              price: '₹3,200',
              occasion: "Friend's Wedding Reception",
              tags: ['HD Satin Luminous', 'Textured Chignon', 'Basra Pearls'],
              services: ['Bridal Guest HD Makeup', 'Hair Artistry', 'Saree Draping']
            }
          ].map((lookItem) => {
            const isSaved = isLookSaved(lookItem.id);
            const lookForAction = {
              id: lookItem.id,
              lookId: lookItem.id,
              creatorId: lookItem.creatorId,
              creatorName: lookItem.creatorName,
              creatorPhoto: lookItem.creatorPhoto,
              title: lookItem.title,
              caption: lookItem.caption,
              image: lookItem.image,
              referenceImages: [lookItem.image],
              occasion: lookItem.occasion,
              services: lookItem.services,
              notes: lookItem.caption,
              overallStyle: lookItem.title
            } as StructuredLook;

            return (
              <article
                key={lookItem.id}
                id={`look-card-${lookItem.id}`}
                className="bg-surface-container-lowest p-space-md flex flex-col gap-space-md shadow-sm border border-surface-container relative"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
                  <img
                    alt={lookItem.title}
                    className="w-full h-full object-cover"
                    src={lookItem.image}
                  />

                  {/* Aesthetic Match Badge */}
                  <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1">
                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface font-medium">
                      {lookItem.aestheticMatch}
                    </span>
                  </div>

                  {/* Bookmark / Save Button on Image */}
                  <button
                    onClick={() => handleToggleSave(lookForAction)}
                    id={`btn-save-${lookItem.id}`}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 font-label-caps text-[10px] uppercase tracking-wider backdrop-blur-sm transition-all shadow-sm ${
                      isSaved
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'bg-surface-container-lowest/90 text-on-surface hover:bg-surface-container-lowest border border-surface-container'
                    }`}
                    type="button"
                    aria-label={isSaved ? `Remove ${lookItem.title} from Saved Looks` : `Save ${lookItem.title} to Saved Looks`}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                    <span>{isSaved ? 'SAVED' : 'SAVE'}</span>
                  </button>

                  <div className="absolute bottom-3 right-3 bg-primary text-on-primary px-3 py-1 font-label-caps text-[10px] uppercase tracking-widest">
                    {lookItem.price}
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                  {/* Creator Attribution */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={lookItem.creatorPhoto}
                        alt={lookItem.creatorName}
                        className="w-5 h-5 rounded-full object-cover border border-surface-container shrink-0"
                      />
                      <span className="font-caption text-caption text-on-surface-variant">
                        Posted by <strong className="text-on-surface font-medium">{lookItem.creatorName}</strong>
                      </span>
                    </div>
                    <span className="font-caption text-caption uppercase text-on-surface-variant">
                      {lookItem.occasion}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-0.5">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{lookItem.title}</h3>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {lookItem.caption}
                  </p>

                  <div className="flex items-center gap-space-xs pt-1 flex-wrap">
                    {lookItem.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 bg-surface-container text-on-surface font-label-caps text-[9px] uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
                  <button
                    onClick={() => {
                      setActiveArLook(lookItem.title);
                      setArModalOpen(true);
                    }}
                    className="py-2.5 bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-caps text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
                    TRY ON AR
                  </button>
                  <button
                    onClick={() => onBookLookWithArtisans(lookForAction)}
                    className="py-2.5 bg-primary hover:bg-on-surface text-on-primary font-label-caps text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
                    type="button"
                  >
                    BOOK ATELIER
                  </button>
                  <button
                    onClick={() => handleToggleSave(lookForAction)}
                    className={`py-2.5 font-label-caps text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 transition-colors border ${
                      isSaved
                        ? 'bg-surface-container-high text-primary border-primary/30 font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface border-surface-container'
                    }`}
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {isSaved ? 'bookmark' : 'bookmark_border'}
                    </span>
                    <span>{isSaved ? 'SAVED' : 'SAVE'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Top Verified Artists Near You Section */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-lg mb-space-md border-t border-surface-container">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-md">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Vetted Maestros</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-normal">Top Verified Artists Near You</h2>
            </div>
            <button
              onClick={onNavigateToPros}
              className="font-label-caps text-label-caps uppercase text-primary hover:text-secondary tracking-widest"
              type="button"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            {/* Artist 1: Priya Sharma */}
            <div className="p-space-md bg-surface flex flex-col gap-space-sm hover:bg-surface-container-low transition-colors border border-surface-container">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 bg-surface-container flex-shrink-0 overflow-hidden">
                    <img
                      alt="Priya Sharma"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtje9P7G2ES9QHq5UN1xEU6cdnVS_33cVGe9X-CMIfphRLT9BVBi10f0mQig3DUsd43t1sa8Ibp0iUtrPorKmqtBCQBIdas8HgFVdcIn8qeRIUVX7uUrRs4uW203KDUT17Gk7HzQseLGf0xrDAIKRczWM9gkNyKcs7cqOWvvgArGLvNmSox-BsJDgxfAqq3gACVWElIrZgPoSnr8GrWvdLWIHk7r_Aqp2myydSr_-yNvB0kZKzGul6Ew"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-subheading text-subheading font-medium text-on-surface truncate">Priya Sharma</h4>
                      <span className="material-symbols-outlined text-[16px] text-primary" title="Verified AURA Atelier Partner">verified</span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">Mehrauli, New Delhi • 4.2 km</span>
                    <span className="font-caption text-caption text-on-surface font-medium">Master Bridal &amp; HD Airbrush</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-label-caps text-label-caps font-medium text-primary">From ₹4,500</span>
                  <div className="flex items-center justify-end gap-0.5 text-on-surface">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-caption text-caption font-semibold">4.98</span>
                    <span className="font-caption text-caption text-on-surface-variant">(340)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant bg-surface-container px-2 py-0.5">At Salon &amp; At Home Available</span>
                <button
                  onClick={onNavigateToBooking}
                  className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-1"
                  type="button"
                >
                  RESERVE SLOT <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Artist 2: Arjun Sen */}
            <div className="p-space-md bg-surface flex flex-col gap-space-sm hover:bg-surface-container-low transition-colors border border-surface-container">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 bg-surface-container flex-shrink-0 overflow-hidden">
                    <img
                      alt="Arjun Sen"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqpZ-SZwJ0_1EG81fiqVuKIXKh-c4ztWDuoAMWju-Op1QAGS2us5ju5A8S1q48IMHFSdHs-wmeqR4tKJq587PiQADzb_ospnVW56t6cdPKm3nNKwz-Hq02sEjZ5I-_5pCzTs_mqGxaki_Cru1hLlJDl86Ux7VbhH--6dUGJo8ICMrTRjhPC9z0jNnGUCOBGIVru-YO30ezrGb9-xi8LH3AFd5rmRP0IH1OsNvfaCBvZixEZGiSiYyYXQ"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-subheading text-subheading font-medium text-on-surface truncate">Arjun Sen Hair Studio</h4>
                      <span className="material-symbols-outlined text-[16px] text-primary" title="Verified AURA Atelier Partner">verified</span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">Indiranagar, Bengaluru</span>
                    <span className="font-caption text-caption text-on-surface font-medium">Session Stylist &amp; Hair Sculpting</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-label-caps text-label-caps font-medium text-primary">From ₹1,800</span>
                  <div className="flex items-center justify-end gap-0.5 text-on-surface">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-caption text-caption font-semibold">4.95</span>
                    <span className="font-caption text-caption text-on-surface-variant">(210)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant bg-surface-container px-2 py-0.5">At Salon Only</span>
                <button
                  onClick={onNavigateToBooking}
                  className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-1"
                  type="button"
                >
                  RESERVE SLOT <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Artist 3: Ananya Verma */}
            <div className="p-space-md bg-surface flex flex-col gap-space-sm hover:bg-surface-container-low transition-colors border border-surface-container">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 bg-surface-container flex-shrink-0 overflow-hidden">
                    <img
                      alt="Ananya Verma"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxSnSAJLG0cckxC4YqOGZaOoiup8j5KaVBV34thtOyM4Nwd_PthRilaZf4ByYNsVOlS6adXhZdGsqMtc_KN5WcwMLuuT6y_DdIRqpQqbYD0KrvRCKemQDpLAGVJnRZLamE-3FdCfS8oGJ8DLt1bkDzN1WhsdTTVijtsiii-owvoyjvEdXa4YEWDAR1YRtJfLEDna54v9dsQ_ioW5wPIHSBPIoS6JUDsgd36sZCEEyIphUbYA_RHLUDsQ"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-subheading text-subheading font-medium text-on-surface truncate">Ananya Verma</h4>
                      <span className="material-symbols-outlined text-[16px] text-primary" title="Verified AURA Atelier Partner">verified</span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">Bandra West, Mumbai</span>
                    <span className="font-caption text-caption text-on-surface font-medium">Minimal &amp; Glass Skin Specialist</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-label-caps text-label-caps font-medium text-primary">From ₹2,800</span>
                  <div className="flex items-center justify-end gap-0.5 text-on-surface">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-caption text-caption font-semibold">4.99</span>
                    <span className="font-caption text-caption text-on-surface-variant">(185)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-surface-container-high">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-on-surface-variant bg-surface-container px-2 py-0.5">At Home Specialist</span>
                <button
                  onClick={onNavigateToBooking}
                  className="font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-secondary flex items-center gap-1"
                  type="button"
                >
                  RESERVE SLOT <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AR Live Simulation Modal */}
      {arModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full p-5 border border-surface-container space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">view_in_ar</span>
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface font-semibold">AR Virtual Try-On</span>
              </div>
              <button onClick={() => setArModalOpen(false)} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="text-center py-4 space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-surface-container flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-[28px] text-primary">face</span>
              </div>
              <h4 className="font-subheading font-medium text-on-surface">{activeArLook}</h4>
              <p className="font-caption text-secondary">
                Calibrating 68 facial landmarks &amp; skin tone undertones against warm light exposure.
              </p>
            </div>
            <button
              onClick={() => setArModalOpen(false)}
              className="w-full py-2.5 bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-widest"
            >
              Done Previewing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
