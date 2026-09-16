import React, { useState, useEffect } from 'react';
import { StructuredLook, Professional, UserProfile, Booking } from '../types/aura';
import { savedLooksService } from '../firebase/savedLooksService';
import { auraApi } from '../services/api';

interface LoyaltyVaultAndMyAuraProps {
  onSelectLook: (look: StructuredLook) => void;
  onSelectArtisan: (artisan: Professional) => void;
  favoriteIds: Set<string>;
  onSignOut?: () => void;
  currentUser?: UserProfile | null;
  onNavigateToDiscover?: () => void;
  initialSubTab?: 'vault' | 'bookings' | 'endorsements';
}

export const LoyaltyVaultAndMyAura: React.FC<LoyaltyVaultAndMyAuraProps> = ({
  onSelectLook,
  onSelectArtisan,
  favoriteIds,
  onSignOut,
  currentUser,
  onNavigateToDiscover,
  initialSubTab = 'vault'
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'bookings' | 'endorsements'>(initialSubTab);
  const [auraPoints, setAuraPoints] = useState(1450);
  const [showAddJewelry, setShowAddJewelry] = useState(false);
  const [newJewelryName, setNewJewelryName] = useState('');
  const [liveSavedLooks, setLiveSavedLooks] = useState<StructuredLook[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [liveBookings, setLiveBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const effectiveUserId = currentUser?.id || localStorage.getItem('aura_user_id') || 'usr_aura_primary';

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  const loadSavedLooks = async () => {
    setIsLoadingSaved(true);
    try {
      const looks = await savedLooksService.getSavedLooks(effectiveUserId);
      setLiveSavedLooks(looks);
    } catch (err) {
      console.error('Failed to fetch user saved looks:', err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const loadBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const bookings = await auraApi.getBookings();
      setLiveBookings(bookings || []);
    } catch (err) {
      console.error('Failed to fetch user bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadSavedLooks();
    loadBookings();
  }, [effectiveUserId]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    }
  }, [activeTab]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await auraApi.cancelBooking(bookingId);
      setLiveBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      loadBookings();
    }
  };

  const handleRemoveSavedLook = async (look: StructuredLook) => {
    const targetId = look.lookId || look.id;
    // Optimistic removal
    setLiveSavedLooks(prev => prev.filter(l => (l.lookId || l.id) !== targetId));
    try {
      await savedLooksService.toggleSaveLook(effectiveUserId, look);
    } catch (err) {
      console.error('Failed to remove saved look:', err);
      loadSavedLooks();
    }
  };

  const [heirloomBoxes, setHeirloomBoxes] = useState([
    {
      id: 'box_1',
      title: 'Polki & Emerald Choker Set',
      boxNumber: 'Box #1',
      description: 'Heirloom polki neckpiece with Zambian emerald drop beads. Calibrated for deep V-neck and sweetheart blouses.',
      tag: 'Calibrated'
    },
    {
      id: 'box_2',
      title: '22k Gold Kundan & Basra Pearls',
      boxNumber: 'Box #2',
      description: 'Ear jhumkas and matching matha patti. Synced with Pastel Saree & Kundan Harmony look.',
      tag: 'Active in Look'
    }
  ]);

  const handleAddJewelry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJewelryName.trim()) return;
    setHeirloomBoxes(prev => [
      ...prev,
      {
        id: `box_${Date.now()}`,
        title: newJewelryName,
        boxNumber: `Box #${prev.length + 1}`,
        description: 'Digitally archived in AURA Vault. Available for AI jewelry-hair calibration.',
        tag: 'Calibrated'
      }
    ]);
    setNewJewelryName('');
    setShowAddJewelry(false);
    setAuraPoints(prev => prev + 50); // reward points for vault entry
  };

  return (
    <div className="flex flex-col w-full pb-32 text-on-surface">
      {/* Top Header & Identity */}
      <header className="w-full px-margin-mobile pt-4 pb-3 bg-surface-container-lowest border-b border-surface-container">
        <div className="max-w-screen-md mx-auto flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">The Vault // Client Profile</span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mt-0.5">Pooja Verma</h1>
            <p className="font-caption text-caption text-outline mt-0.5">Member since October 2024 • NCR Haute Circle</p>
          </div>
          <div className="w-12 h-12 bg-surface-container rounded-full overflow-hidden border border-surface-container-high shrink-0">
            <img
              alt="Pooja Verma"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </header>

      {/* AURA Points & Loyalty Balance Card */}
      <section className="px-margin-mobile py-space-md bg-surface-container-low border-b border-surface-container">
        <div className="max-w-screen-md mx-auto p-space-md bg-surface-container-lowest border border-surface-container shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span className="font-label-caps text-label-caps uppercase tracking-widest font-semibold">
                  AURA Privilege Points
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold">
                  {auraPoints.toLocaleString('en-IN')}
                </span>
                <span className="font-caption text-caption uppercase text-secondary">pts</span>
              </div>
            </div>
            <span className="px-2 py-1 bg-surface-container font-label-caps text-[10px] uppercase tracking-wider text-on-surface border border-surface-container-high">
              Gold Connoisseur
            </span>
          </div>

          {/* Progress bar to Platinum */}
          <div className="mt-3">
            <div className="flex justify-between font-caption text-[10px] text-secondary mb-1">
              <span>550 pts to Platinum Tier</span>
              <span>1,450 / 2,000</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '72%' }}></div>
            </div>
          </div>

          {/* Perks list */}
          <div className="mt-4 pt-3 border-t border-surface-container grid grid-cols-3 gap-2 text-center">
            <div className="p-1.5 bg-surface-container-low">
              <span className="material-symbols-outlined text-[16px] text-primary block mx-auto">local_shipping</span>
              <span className="font-caption text-[9px] uppercase tracking-wider text-on-surface block mt-0.5">₹0 Travel Fee</span>
            </div>
            <div className="p-1.5 bg-surface-container-low">
              <span className="material-symbols-outlined text-[16px] text-primary block mx-auto">bolt</span>
              <span className="font-caption text-[9px] uppercase tracking-wider text-on-surface block mt-0.5">Priority Dispatch</span>
            </div>
            <div className="p-1.5 bg-surface-container-low">
              <span className="material-symbols-outlined text-[16px] text-primary block mx-auto">diamond</span>
              <span className="font-caption text-[9px] uppercase tracking-wider text-on-surface block mt-0.5">1:1 Atelier Trials</span>
            </div>
          </div>
        </div>
      </section>

      {/* Segmented Navigation Tabs */}
      <section className="bg-surface-container-lowest border-b border-surface-container px-margin-mobile">
        <div className="max-w-screen-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-3 flex-1 text-center font-label-caps text-label-caps uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'vault' ? 'border-primary text-on-surface font-semibold' : 'border-transparent text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            Wardrobe &amp; Vault
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 flex-1 text-center font-label-caps text-label-caps uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'bookings' ? 'border-primary text-on-surface font-semibold' : 'border-transparent text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            Active Bookings (1)
          </button>
          <button
            onClick={() => setActiveTab('endorsements')}
            className={`py-3 flex-1 text-center font-label-caps text-label-caps uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'endorsements' ? 'border-primary text-on-surface font-semibold' : 'border-transparent text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            Endorsed Artists
          </button>
        </div>
      </section>

      {/* Main Tab Content Area */}
      <div className="max-w-screen-md mx-auto w-full px-margin-mobile py-space-md">
        {/* Tab 1: Wardrobe & Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-space-lg">
            {/* Heirloom Jewelry Vault */}
            <section className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                    Digitized Jewelry Vault
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Heirloom Boxes</h2>
                </div>
                <button
                  onClick={() => setShowAddJewelry(!showAddJewelry)}
                  className="font-label-caps text-[10px] uppercase tracking-wider text-primary underline"
                  type="button"
                >
                  {showAddJewelry ? 'Cancel' : '+ Archive Heirloom'}
                </button>
              </div>

              {/* Add Heirloom Form */}
              {showAddJewelry && (
                <form onSubmit={handleAddJewelry} className="p-3 bg-surface-container-low border border-surface-container space-y-2">
                  <span className="font-caption text-caption uppercase tracking-wider text-secondary block">Archive New Jewelry Piece</span>
                  <input
                    type="text"
                    value={newJewelryName}
                    onChange={(e) => setNewJewelryName(e.target.value)}
                    placeholder="e.g. 24k Gold Temple Choker with Ruby Pearls..."
                    className="w-full bg-surface-container-lowest border border-surface-container p-2 text-body-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-widest"
                  >
                    Save &amp; Calibrate (+50 pts)
                  </button>
                </form>
              )}

              {/* Heirloom Boxes Grid */}
              <div className="grid grid-cols-1 gap-3">
                {heirloomBoxes.map(b => (
                  <div key={b.id} className="p-3.5 bg-surface-container-lowest border border-surface-container shadow-sm flex items-start gap-3">
                    <div className="w-12 h-12 bg-surface-container flex items-center justify-center shrink-0 border border-surface-container-high">
                      <span className="material-symbols-outlined text-primary text-[22px]">diamond</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary font-medium">{b.boxNumber}</span>
                        <span className="font-caption text-[10px] text-secondary">{b.tag}</span>
                      </div>
                      <h3 className="font-subheading text-subheading font-medium text-on-surface mt-0.5">{b.title}</h3>
                      <p className="font-caption text-caption text-secondary mt-1">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Saved AI Looks & Bookmarked Curations */}
            <section className="space-y-3 pt-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">
                    Saved Looks &amp; Curations
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Saved Looks ({liveSavedLooks.length})
                  </h2>
                </div>
                {onNavigateToDiscover && (
                  <button
                    onClick={onNavigateToDiscover}
                    className="font-label-caps text-[10px] uppercase tracking-wider text-primary underline hover:text-on-surface transition-colors"
                    type="button"
                  >
                    + Discover More Looks
                  </button>
                )}
              </div>

              {isLoadingSaved ? (
                <div className="p-8 text-center bg-surface-container-lowest border border-surface-container">
                  <span className="material-symbols-outlined text-primary text-[28px] animate-spin">refresh</span>
                  <p className="font-caption text-secondary mt-2">Loading your saved vault...</p>
                </div>
              ) : liveSavedLooks.length === 0 ? (
                <div className="p-8 text-center bg-surface-container-lowest border border-surface-container space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-[24px]">bookmark_border</span>
                  </div>
                  <div>
                    <h4 className="font-subheading font-medium text-on-surface">No Saved Looks Yet</h4>
                    <p className="font-caption text-secondary mt-1 max-w-sm mx-auto">
                      Explore the Discover lookbook to bookmark community syntheses and editorial looks for your upcoming occasions.
                    </p>
                  </div>
                  {onNavigateToDiscover && (
                    <button
                      onClick={onNavigateToDiscover}
                      className="px-4 py-2 bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                      type="button"
                    >
                      Explore Discover Feed
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveSavedLooks.map((l) => {
                    const targetId = l.lookId || l.id;
                    const lookImage = l.image || (l.referenceImages && l.referenceImages[0]) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCZrKi2SgazJYCPoYXcYkVl-H3MYrehpYHHgjmDF1PBEuYALZFWU6AZ9dCs7vLh5nkfo1an5lVqSfbHcbHEteOlB_9724gcJ2hgXK312VAAE1lQ55vqEEvTJkDfuOzTrhA1TWFWnOlJyMBlmUr9JN_yunnJrI0h6KVvREFvoYqIwwo5wkfZnNbYDX1LfvQ4vb39PjLmyWxdec2YNswqG-vbNHkeem7ddMR552DdpB7vQnmtvKlpOfRVw';
                    const formattedDate = l.savedAt
                      ? new Date(l.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Saved Recently';

                    return (
                      <div
                        key={targetId}
                        id={`saved-look-${targetId}`}
                        className="bg-surface-container-lowest border border-surface-container overflow-hidden shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          {/* Image with Badges */}
                          <div className="relative aspect-[4/3] bg-surface-container overflow-hidden">
                            <img
                              alt={l.title}
                              className="w-full h-full object-cover"
                              src={lookImage}
                            />
                            {/* Retained: Look ID Badge */}
                            <div className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface font-semibold">
                                #{targetId}
                              </span>
                            </div>

                            {/* Reference Badge (Distinguishes reference bookmark vs authored post) */}
                            <div className="absolute top-2.5 right-2.5 bg-primary/95 text-on-primary px-2 py-0.5 flex items-center gap-1 shadow-xs">
                              <span className="material-symbols-outlined text-[12px]">bookmark</span>
                              <span className="font-label-caps text-[9px] uppercase tracking-wider font-medium">
                                Reference
                              </span>
                            </div>

                            {/* Occasion if available */}
                            {l.occasion && (
                              <div className="absolute bottom-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5">
                                <span className="font-caption text-[10px] text-on-surface font-medium">
                                  {l.occasion}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content Container */}
                          <div className="p-3.5 space-y-2">
                            {/* Retained: Creator / User ID & Attribution */}
                            <div className="flex items-center justify-between border-b border-surface-container pb-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {l.creatorPhoto ? (
                                  <img
                                    src={l.creatorPhoto}
                                    alt={l.creatorName || 'Creator'}
                                    className="w-4 h-4 rounded-full object-cover shrink-0 border border-surface-container"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">person</span>
                                )}
                                <span className="font-caption text-[11px] text-secondary truncate">
                                  Curated by <strong className="text-on-surface font-medium">{l.creatorName || l.creatorId || 'Artisan Creator'}</strong>
                                </span>
                              </div>
                              {l.creatorId && (
                                <span className="font-mono text-[9px] text-outline shrink-0 ml-1">
                                  ID: {l.creatorId}
                                </span>
                              )}
                            </div>

                            {/* Retained: Look Title & Caption/Details */}
                            <div>
                              <h3 className="font-subheading text-[14px] font-medium text-on-surface leading-snug">
                                {l.title}
                              </h3>
                              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 line-clamp-2">
                                {l.caption || l.notes || (Array.isArray(l.services) ? l.services.join(' • ') : 'Bespoke Haute Styling')}
                              </p>
                            </div>

                            {/* Retained: Services & Style Information */}
                            {Array.isArray(l.services) && l.services.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {l.services.slice(0, 3).map((srv, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-1.5 py-0.5 bg-surface-container text-on-surface font-label-caps text-[9px] uppercase tracking-wider"
                                  >
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Retained: Date Saved */}
                            <div className="flex items-center justify-between pt-1 font-caption text-[10px] text-secondary border-t border-surface-container-high">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                {formattedDate}
                              </span>
                              <span className="text-primary font-medium">Synced to Vault</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions: Open in AI Studio + Remove from Saved */}
                        <div className="p-3.5 pt-0 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onSelectLook(l)}
                            className="py-2 bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-widest text-center hover:bg-neutral-800 transition-colors"
                            type="button"
                          >
                            Open in Studio
                          </button>
                          <button
                            onClick={() => handleRemoveSavedLook(l)}
                            className="py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-caps text-[10px] uppercase tracking-widest text-center transition-colors flex items-center justify-center gap-1"
                            type="button"
                            title="Remove bookmark from Saved Looks"
                          >
                            <span className="material-symbols-outlined text-[14px]">bookmark_remove</span>
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 2: Active Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-surface-container">
              <div>
                <h3 className="font-subheading text-[14px] font-medium text-on-surface">
                  Verified Artisan Dossiers &amp; Appointments
                </h3>
                <p className="font-caption text-caption text-secondary">
                  Track upcoming home vanity dispatches and atelier bookings
                </p>
              </div>
              <button
                type="button"
                onClick={loadBookings}
                className="flex items-center gap-1 font-label-caps text-[10px] uppercase tracking-wider text-secondary hover:text-primary transition-colors"
                title="Refresh appointments"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Refresh</span>
              </button>
            </div>

            {isLoadingBookings ? (
              <div className="p-8 text-center text-secondary font-label-caps text-[11px] uppercase tracking-widest">
                Retrieving your appointments...
              </div>
            ) : liveBookings.length === 0 ? (
              <div className="p-8 bg-surface-container-lowest border border-surface-container text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-container-high mx-auto flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                </div>
                <h4 className="font-subheading text-on-surface font-medium">No appointments booked yet</h4>
                <p className="font-caption text-caption text-secondary max-w-sm mx-auto">
                  Reserve verified master stylists for doorstep vanity service or atelier sessions for weddings and celebrations.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateToDiscover) onNavigateToDiscover();
                    }}
                    className="px-4 py-2 bg-primary text-on-primary font-label-caps text-[10px] uppercase tracking-widest hover:bg-on-surface transition-colors"
                  >
                    Browse Looks &amp; Book Artisans
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {liveBookings.map((b) => {
                  const isCancelled = b.status === 'cancelled';
                  const deposit = Math.round((b.totalPrice || 4000) * 0.25);
                  const balanceDue = (b.totalPrice || 4000) - deposit;

                  return (
                    <div
                      key={b.id}
                      className={`p-4 bg-surface-container-lowest border border-surface-container shadow-sm space-y-3 ${
                        isCancelled ? 'opacity-60 bg-surface-container-low' : ''
                      }`}
                    >
                      {/* Booking Top Info */}
                      <div className="flex items-start justify-between border-b border-surface-container pb-2.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary font-semibold">
                              Dossier {b.id}
                            </span>
                            {b.lookTitle && (
                              <span className="px-1.5 py-0.5 bg-surface-container text-on-surface font-caption text-[10px]">
                                {b.lookTitle}
                              </span>
                            )}
                          </div>
                          <div className="font-caption text-[12px] text-on-surface font-medium flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-secondary">event</span>
                            <span>{b.date} • {b.time}</span>
                          </div>
                          <div className="font-caption text-[11px] text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            <span className="line-clamp-1">{b.address || 'Doorstep Service NCR'}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 font-label-caps text-[9px] uppercase tracking-wider ${
                            isCancelled
                              ? 'bg-surface-container-highest text-secondary'
                              : 'bg-primary/10 text-primary border border-primary/30 font-medium'
                          }`}
                        >
                          {isCancelled ? 'Cancelled' : b.status || 'Confirmed'}
                        </span>
                      </div>

                      {/* Artisan Attribution */}
                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              b.professionalPhoto ||
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
                            }
                            alt={b.professionalName}
                            className="w-10 h-10 rounded-full object-cover border border-surface-container-highest shrink-0"
                          />
                          <div>
                            <h4 className="font-subheading text-[13px] font-medium text-on-surface">
                              {b.professionalName}
                            </h4>
                            <span className="font-caption text-[11px] text-secondary">
                              {b.coverageType === 'at-home' ? 'Doorstep Vanity Dispatch' : 'Atelier Studio Session'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-label-caps text-[13px] font-semibold text-on-surface">
                            ₹{(b.totalPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <div className="font-caption text-[10px] text-secondary">Total Dossier Value</div>
                        </div>
                      </div>

                      {/* Services List */}
                      {b.services && b.services.length > 0 && (
                        <div className="space-y-1.5 py-2 border-t border-surface-container">
                          {b.services.map((srv, idx) => (
                            <div
                              key={srv.id || idx}
                              className="flex items-center justify-between font-body-sm text-body-sm text-on-surface"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                <span>{srv.name}</span>
                              </div>
                              <span className="font-medium text-[12px]">
                                ₹{(srv.price || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Financial Breakdown & Cancel Action */}
                      <div className="pt-2 border-t border-surface-container flex items-center justify-between font-caption text-caption">
                        <div className="space-y-0.5">
                          <div className="text-secondary">
                            Advance Deposit Paid:{' '}
                            <span className="font-medium text-primary">₹{deposit.toLocaleString('en-IN')} (UPI)</span>
                          </div>
                          <div className="text-on-surface font-medium">
                            Balance Due at Doorstep: ₹{balanceDue.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div>
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleCancelBooking(b.id)}
                              className="px-2.5 py-1 text-secondary hover:text-red-700 hover:bg-red-50 border border-surface-container font-label-caps text-[9px] uppercase tracking-wider transition-colors"
                              title="Cancel this appointment"
                            >
                              Cancel Session
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Endorsements */}
        {activeTab === 'endorsements' && (
          <div className="space-y-3">
            <p className="font-caption text-caption text-secondary">
              Artisans you have endorsed with your verified client AURA Points:
            </p>

            <div className="p-3.5 bg-surface-container-lowest border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                  <img
                    alt="Priya Sharma"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1Xc9cu67xwSQxFkbxpKRtYzXeRJZaJlFPnr3yt69eyZKXcjoe_TzYUcX-dfs1VFtMdQDT6iDmZNr1wX0lLlY0e7yTlIgdE_0oY8Qr1-RnZ7ERXImdJW5cy9XusLZLrBAPgbi8KqNek2imR199B-kPMLNFAcbunaEH8zaeSDlkMDG_jo7rhBLNtBItZpRg1whrBunaZakwcyhUoi3wjEV1FAf8TLUvp9UfaO890oAmFbowOGw_6l5W6Zyqw-"
                  />
                </div>
                <div>
                  <h3 className="font-subheading text-subheading font-medium text-on-surface">Priya Sharma</h3>
                  <p className="font-caption text-caption text-secondary">Verified Master MUA • Mehrauli &amp; Noida</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary font-label-caps text-[10px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>Endorsed (+1)</span>
              </div>
            </div>

            <div className="p-3.5 bg-surface-container-lowest border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                  <img
                    alt="Rohan Mehra"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZSRKpE9IQjWq_Rm8w3oljW-H-DQBj0UE77EPsQEQeb1Pn5ZdX6wsgoJ5Te0lHbPI384KSqHKVgUKtg06E8gBIOimrJC9DnxHqgaNssM9-vH6OMA1oYtqqaki6CQE9dXjFiF0yCiTFOY9Lq8cuVYFsUDHFMOJkYmEzAE-neWYeqKYwp86MT2vKkkXVmlTaZuOMxSu3UKE1wjKgpPFrivnQBuzpV0QHyrk_yZNJ2HSHgPsAKwcA8ADmGQ"
                  />
                </div>
                <div>
                  <h3 className="font-subheading text-subheading font-medium text-on-surface">Rohan Mehra Atelier</h3>
                  <p className="font-caption text-caption text-secondary">Architectural Updos &amp; Saree Draping</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary font-label-caps text-[10px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>Endorsed (+1)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
