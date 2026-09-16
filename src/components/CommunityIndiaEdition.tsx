import React, { useState, useEffect } from 'react';
import { StructuredLook } from '../types/aura';
import { savedLooksService } from '../firebase/savedLooksService';
import { auraApi } from '../services/api';

interface CommunityIndiaEditionProps {
  looks?: StructuredLook[];
  onSelectLookForStudio: (look: StructuredLook) => void;
  onBookLookWithArtisans: (look: StructuredLook) => void;
  savedLookIds?: Set<string>;
  onToggleSaveLook?: (look: StructuredLook) => void;
  onLookSavedNotify?: (message: string, points: number) => void;
  currentUserId?: string;
}

export const CommunityIndiaEdition: React.FC<CommunityIndiaEditionProps> = ({
  looks: propLooks,
  onSelectLookForStudio,
  onBookLookWithArtisans,
  savedLookIds: propSavedLookIds,
  onToggleSaveLook,
  onLookSavedNotify,
  currentUserId
}) => {
  const [communityLooks, setCommunityLooks] = useState<StructuredLook[]>(propLooks || []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [localSavedIds, setLocalSavedIds] = useState<Set<string>>(new Set());
  const [inspectingLook, setInspectingLook] = useState<StructuredLook | null>(null);

  const effectiveUserId = currentUserId || localStorage.getItem('aura_user_id') || 'usr_aura_primary';

  // Load Community Looks from server
  useEffect(() => {
    setIsLoading(true);
    auraApi.getCommunityLooks()
      .then((data) => {
        if (data && data.length > 0) {
          setCommunityLooks(data);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch community looks from API, using props fallback:', err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Sync Saved Look IDs for current user
  useEffect(() => {
    savedLooksService.getSavedLookIds(effectiveUserId)
      .then((ids) => {
        setLocalSavedIds(new Set(ids));
      })
      .catch((err) => {
        console.warn('Could not fetch saved look IDs for community:', err);
      });
  }, [effectiveUserId]);

  const occasions = [
    'All',
    'Sangeet & Mehendi',
    'Bridal / Shaadi',
    'Reception',
    'Cocktail / Evening',
    'Daytime Minimal'
  ];

  const filteredLooks = communityLooks.filter((look) => {
    if (selectedOccasion === 'All') return true;
    const occLower = (look.occasion || '').toLowerCase();
    const selLower = selectedOccasion.toLowerCase();
    if (selectedOccasion === 'Sangeet & Mehendi') {
      return occLower.includes('sangeet') || occLower.includes('mehendi');
    }
    if (selectedOccasion === 'Bridal / Shaadi') {
      return occLower.includes('bridal') || occLower.includes('wedding') || occLower.includes('shaadi');
    }
    if (selectedOccasion === 'Reception') {
      return occLower.includes('reception');
    }
    if (selectedOccasion === 'Cocktail / Evening') {
      return occLower.includes('cocktail') || occLower.includes('evening');
    }
    if (selectedOccasion === 'Daytime Minimal') {
      return occLower.includes('minimal') || occLower.includes('day') || occLower.includes('office');
    }
    return occLower.includes(selLower);
  });

  const isLookSaved = (lookId: string): boolean => {
    if (propSavedLookIds && propSavedLookIds.has(lookId)) return true;
    return localSavedIds.has(lookId);
  };

  const handleToggleSave = async (look: StructuredLook, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const targetId = look.lookId || look.id;
    const isSavedCurrently = isLookSaved(targetId);

    // Optimistic toggle
    setLocalSavedIds((prev) => {
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
      setLocalSavedIds((prev) => {
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
      // Revert on error
      setLocalSavedIds((prev) => {
        const next = new Set(prev);
        if (isSavedCurrently) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col w-full text-on-surface">
      {/* Community Header Bar */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-sm border-b border-surface-container">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                  AURA Community Lookbook
                </span>
                <span className="font-body-md text-body-md font-medium text-on-surface">
                  Patron &amp; Creator Collective
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-surface-container-low text-primary font-label-caps text-[10px] uppercase tracking-wider border border-surface-container">
              Verified Looks Only
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
                Curated by South Asian Stylists &amp; Patrons
              </span>
            </div>
            <span className="font-caption text-caption uppercase text-on-surface-variant tracking-widest">
              Delhi NCR • Mumbai • Bengaluru
            </span>
          </div>
        </div>
      </section>

      {/* Hero Description & Archetype Filter */}
      <section className="w-full bg-surface px-gutter-mobile py-space-md border-b border-surface-container">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary font-medium">
                Inspiration Archive
              </span>
              <span className="w-1 h-1 rounded-full bg-outline"></span>
              <span className="font-caption text-caption text-secondary">
                Reference &amp; Bookmark Other Users&apos; Looks
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-normal tracking-tight">
              Community <span className="italic font-display-mobile">Creations &amp; Looks</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
              Discover real looks posted by AURA patrons and master MUAs. Bookmark any look to your personal Saved Looks, open in AI Studio to adapt with your photos, or book directly with artisans.
            </p>
          </div>

          {/* Occasion Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {occasions.map((occ) => {
              const isSelected = selectedOccasion === occ;
              return (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-space-sm py-1.5 font-label-caps text-[10px] uppercase tracking-wider flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                  type="button"
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Feed Content */}
      <section className="w-full bg-surface-container-lowest px-gutter-mobile py-space-lg min-h-[50vh]">
        <div className="max-w-screen-md mx-auto flex flex-col gap-space-lg">
          {isLoading ? (
            <div className="py-16 text-center text-on-surface-variant font-label-caps text-xs uppercase tracking-widest">
              Loading Community Feed...
            </div>
          ) : filteredLooks.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-body-md text-on-surface-variant">No community looks found for this occasion.</p>
              <button
                onClick={() => setSelectedOccasion('All')}
                className="px-4 py-2 bg-surface-container text-on-surface font-label-caps text-xs uppercase tracking-wider"
                type="button"
              >
                View All Looks
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              {filteredLooks.map((look) => {
                const targetId = look.lookId || look.id;
                const saved = isLookSaved(targetId);

                return (
                  <article
                    key={targetId}
                    className="flex flex-col bg-surface border border-surface-container shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setInspectingLook(look)}
                  >
                    {/* 1. Creator Attribution Header */}
                    <div className="p-space-sm border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
                      <div className="flex items-center gap-space-xs">
                        <img
                          src={
                            look.creatorPhoto ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
                          }
                          alt={look.creatorName || 'Community Creator'}
                          className="w-9 h-9 rounded-full object-cover border border-surface-container-highest shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-subheading text-[13px] font-medium text-on-surface truncate">
                              {look.creatorName || 'AURA Creator'}
                            </span>
                            <span className="material-symbols-outlined text-[14px] text-primary" title="Verified Patron">
                              verified
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-secondary">
                            ID: {look.creatorId || 'usr_community'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {look.occasion && (
                          <span className="hidden sm:inline-block px-2 py-0.5 bg-surface-container text-on-surface font-label-caps text-[9px] uppercase tracking-wider">
                            {look.occasion}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-surface-container-high text-primary font-label-caps text-[10px] font-semibold">
                          {look.aestheticMatch || '98% Match'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Visual Image Container with Quick Overlay Actions */}
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container overflow-hidden group">
                      <img
                        src={look.image || (look.referenceImages && look.referenceImages[0])}
                        alt={look.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2 py-1 bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-caps text-[9px] uppercase tracking-wider">
                          Look ID: {targetId}
                        </span>
                      </div>

                      {/* Bookmark Button in Top Right */}
                      <div className="absolute top-3 right-3">
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(look, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md font-label-caps text-[10px] uppercase tracking-widest transition-all ${
                            saved
                              ? 'bg-primary text-on-primary shadow-md'
                              : 'bg-surface-container-lowest/90 text-on-surface hover:bg-surface-container-lowest hover:text-primary'
                          }`}
                          title={saved ? 'Remove from Saved Looks' : 'Bookmark to My AURA'}
                        >
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            bookmark
                          </span>
                          <span>{saved ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>

                      {/* Bottom Image Overlay Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <h3 className="font-subheading text-[16px] font-normal text-white drop-shadow-sm">
                            {look.title}
                          </h3>
                          <p className="font-caption text-[11px] text-white/80 line-clamp-1">
                            {look.caption || look.notes}
                          </p>
                        </div>
                        {look.price && (
                          <span className="font-label-caps text-[12px] font-medium text-white shrink-0 ml-2">
                            {look.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. Directives & Services Breakdown */}
                    <div className="p-space-md flex flex-col gap-space-sm bg-surface">
                      {/* Services Chips */}
                      {look.services && look.services.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-label-caps text-[10px] uppercase tracking-wider text-secondary">
                            Services:
                          </span>
                          {look.services.map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-surface-container-low text-on-surface font-caption text-[11px] border border-surface-container"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Key Makeup Directives Snippets */}
                      {look.makeup && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-caption text-[11px] text-secondary border-t border-surface-container">
                          {look.makeup.eyes && (
                            <div>
                              <span className="text-on-surface font-medium">Eyes: </span>
                              <span>{look.makeup.eyes}</span>
                            </div>
                          )}
                          {look.makeup.lips && (
                            <div>
                              <span className="text-on-surface font-medium">Lips: </span>
                              <span>{look.makeup.lips}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center gap-2 pt-space-xs border-t border-surface-container">
                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(look, e)}
                          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-label-caps text-[10px] uppercase tracking-widest transition-colors border ${
                            saved
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface border-surface-container'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[16px]"
                            style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            bookmark
                          </span>
                          <span>{saved ? 'Saved in My AURA' : 'Save Look'}</span>
                        </button>

                        {/* Open in Studio Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLookForStudio(look);
                          }}
                          className="flex-1 py-2.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-caps text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 border border-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                          <span>Open in Studio</span>
                        </button>

                        {/* Book Look Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookLookWithArtisans(look);
                          }}
                          className="flex-1 py-2.5 bg-primary hover:bg-on-surface text-on-primary font-label-caps text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                          <span>Book Look</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Look Detail Inspection Modal */}
      {inspectingLook && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectingLook(null)}
        >
          <div
            className="bg-surface border border-surface-container max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img
                  src={
                    inspectingLook.creatorPhoto ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
                  }
                  alt={inspectingLook.creatorName || 'Creator'}
                  className="w-10 h-10 rounded-full object-cover border border-surface-container-highest"
                />
                <div>
                  <h3 className="font-subheading text-[14px] font-medium text-on-surface">
                    {inspectingLook.creatorName || 'Community Creator'}
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-secondary">
                    <span>ID: {inspectingLook.creatorId || 'usr_community'}</span>
                    <span>•</span>
                    <span>Look ID: {inspectingLook.lookId || inspectingLook.id}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingLook(null)}
                className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-space-md space-y-space-md">
              {/* Image */}
              <div className="relative w-full aspect-[16/10] bg-surface-container overflow-hidden">
                <img
                  src={inspectingLook.image || (inspectingLook.referenceImages && inspectingLook.referenceImages[0])}
                  alt={inspectingLook.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={(e) => handleToggleSave(inspectingLook, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md font-label-caps text-[10px] uppercase tracking-widest transition-all ${
                      isLookSaved(inspectingLook.lookId || inspectingLook.id)
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-lowest/90 text-on-surface hover:bg-surface-container-lowest hover:text-primary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{
                        fontVariationSettings: isLookSaved(inspectingLook.lookId || inspectingLook.id)
                          ? "'FILL' 1"
                          : "'FILL' 0"
                      }}
                    >
                      bookmark
                    </span>
                    <span>
                      {isLookSaved(inspectingLook.lookId || inspectingLook.id) ? 'Saved' : 'Save Look'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Title & Occasion */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary font-semibold">
                    {inspectingLook.occasion || 'Special Celebration'}
                  </span>
                  <span className="font-label-caps text-[12px] font-medium text-on-surface">
                    {inspectingLook.price || '₹3,500'}
                  </span>
                </div>
                <h2 className="font-headline-sm text-on-surface font-normal">
                  {inspectingLook.title}
                </h2>
                <p className="font-body-md text-secondary">
                  {inspectingLook.caption || inspectingLook.notes}
                </p>
              </div>

              {/* Directives Breakdown */}
              <div className="space-y-3 pt-2 border-t border-surface-container">
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface font-semibold">
                  AURA Directives Breakdown
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
                  {inspectingLook.makeup && (
                    <div className="p-3 bg-surface-container-low border border-surface-container space-y-1">
                      <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-semibold">
                        Makeup &amp; Skin
                      </span>
                      {inspectingLook.makeup.style && (
                        <p className="font-caption text-[11px]"><span className="font-medium">Style:</span> {inspectingLook.makeup.style}</p>
                      )}
                      {inspectingLook.makeup.eyes && (
                        <p className="font-caption text-[11px]"><span className="font-medium">Eyes:</span> {inspectingLook.makeup.eyes}</p>
                      )}
                      {inspectingLook.makeup.lips && (
                        <p className="font-caption text-[11px]"><span className="font-medium">Lips:</span> {inspectingLook.makeup.lips}</p>
                      )}
                      {inspectingLook.makeup.finish && (
                        <p className="font-caption text-[11px]"><span className="font-medium">Finish:</span> {inspectingLook.makeup.finish}</p>
                      )}
                    </div>
                  )}

                  {inspectingLook.hair && (
                    <div className="p-3 bg-surface-container-low border border-surface-container space-y-1">
                      <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-semibold">
                        Hair Architecture
                      </span>
                      {inspectingLook.hair.style && (
                        <p className="font-caption text-[11px]"><span className="font-medium">Style:</span> {inspectingLook.hair.style}</p>
                      )}
                      {inspectingLook.hair.finish && (
                        <p className="font-caption text-[11px]"><span className="font-medium">Finish:</span> {inspectingLook.hair.finish}</p>
                      )}
                    </div>
                  )}

                  {inspectingLook.jewelry && inspectingLook.jewelry.pairing && (
                    <div className="p-3 bg-surface-container-low border border-surface-container space-y-1">
                      <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-semibold">
                        Jewelry Pairing
                      </span>
                      <p className="font-caption text-[11px]">{inspectingLook.jewelry.pairing}</p>
                    </div>
                  )}

                  {inspectingLook.services && inspectingLook.services.length > 0 && (
                    <div className="p-3 bg-surface-container-low border border-surface-container space-y-1">
                      <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-semibold">
                        Required Services
                      </span>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {inspectingLook.services.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-surface-container text-[10px] text-on-surface">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-surface-container bg-surface-container-lowest flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleToggleSave(inspectingLook, e)}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 font-label-caps text-[11px] uppercase tracking-widest transition-colors border ${
                  isLookSaved(inspectingLook.lookId || inspectingLook.id)
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface border-surface-container'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{
                    fontVariationSettings: isLookSaved(inspectingLook.lookId || inspectingLook.id)
                      ? "'FILL' 1"
                      : "'FILL' 0"
                  }}
                >
                  bookmark
                </span>
                <span>
                  {isLookSaved(inspectingLook.lookId || inspectingLook.id)
                    ? 'Saved in My AURA'
                    : 'Bookmark to Saved Looks'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = inspectingLook;
                  setInspectingLook(null);
                  onSelectLookForStudio(target);
                }}
                className="flex-1 py-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 border border-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                <span>Open in Studio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = inspectingLook;
                  setInspectingLook(null);
                  onBookLookWithArtisans(target);
                }}
                className="flex-1 py-3 bg-primary hover:bg-on-surface text-on-primary font-label-caps text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>Book This Look</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
