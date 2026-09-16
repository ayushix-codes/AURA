import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoverIndiaEdition } from './components/DiscoverIndiaEdition';
import { AiStudioIndiaEdition } from './components/AiStudioIndiaEdition';
import { ArtisansWithPoints } from './components/ArtisansWithPoints';
import { PriyaSharmaAtHomeProfile } from './components/PriyaSharmaAtHomeProfile';
import { PriyaSharmaPointsSignal } from './components/PriyaSharmaPointsSignal';
import { BookingDossierIndiaEdition } from './components/BookingDossierIndiaEdition';
import { LoyaltyVaultAndMyAura } from './components/LoyaltyVaultAndMyAura';
import { CommunityIndiaEdition } from './components/CommunityIndiaEdition';
import { VisualBriefModal } from './components/VisualBriefModal';
import { AuthModal } from './components/AuthModal';

import {
  UserProfile,
  StructuredLook,
  Professional,
  ProfessionalService
} from './types/aura';
import { auraApi } from './services/api';
import { savedLooksService } from './firebase/savedLooksService';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('discover');

  // Core Data State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [discoverLooks, setDiscoverLooks] = useState<StructuredLook[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(['priya_sharma']));
  const [savedLookIds, setSavedLookIds] = useState<Set<string>>(new Set());

  // Studio & Coordination Context
  const [currentLook, setCurrentLook] = useState<StructuredLook | null>(null);
  const [selectedArtisanForProfile, setSelectedArtisanForProfile] = useState<Professional | null>(null);
  const [selectedArtisanForBooking, setSelectedArtisanForBooking] = useState<Professional | null>(null);

  // Modals
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [activeBriefLook, setActiveBriefLook] = useState<StructuredLook | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Toast Notification for Points & Status
  const [pointsToast, setPointsToast] = useState<{ message: string; points: number } | null>(null);
  const [vaultInitialSubTab, setVaultInitialSubTab] = useState<'vault' | 'bookings' | 'endorsements'>('vault');

  const showPointsToast = (message: string, points: number) => {
    setPointsToast({ message, points });
    setTimeout(() => setPointsToast(null), 4000);
  };

  const effectiveUserId = user?.id || localStorage.getItem('aura_user_id') || 'usr_aura_primary';

  // Initial Data Load
  const fetchInitialData = async () => {
    try {
      if (!localStorage.getItem('aura_user_id')) {
        localStorage.setItem('aura_user_id', 'usr_aura_primary');
      }
      const data = await auraApi.getMyAura();
      setUser(data.user);
      setFavoriteIds(new Set(data.favoriteProfessionals.map(p => p.id)));
      setDiscoverLooks(data.discoverLooks);

      // Fetch saved look IDs for the current user
      const ids = await savedLooksService.getSavedLookIds(data.user?.id || effectiveUserId);
      setSavedLookIds(new Set(ids));

      // Default active look in Studio if none is set
      if (!currentLook && data.discoverLooks.length > 0) {
        setCurrentLook(data.discoverLooks[0]);
      }
    } catch (err) {
      console.error('Failed to load initial AURA data:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();
    auraApi.getProfessionals().then(profs => {
      setAllProfessionals(profs);
      if (!selectedArtisanForProfile && profs.length > 0) {
        setSelectedArtisanForProfile(profs[0]); // Priya Sharma
      }
    });
  }, []);

  // Sync saved look IDs whenever user identity changes
  useEffect(() => {
    if (user?.id) {
      savedLooksService.getSavedLookIds(user.id).then(ids => {
        setSavedLookIds(new Set(ids));
      });
    }
  }, [user?.id]);

  // Handlers for bookmarking / saving
  const handleToggleSaveLook = async (look: StructuredLook) => {
    const targetId = look.lookId || look.id;
    const isCurrentlySaved = savedLookIds.has(targetId);

    // Optimistic toggle
    setSavedLookIds(prev => {
      const next = new Set(prev);
      if (isCurrentlySaved) next.delete(targetId);
      else next.add(targetId);
      return next;
    });

    try {
      const res = await savedLooksService.toggleSaveLook(effectiveUserId, look);
      setSavedLookIds(prev => {
        const next = new Set(prev);
        if (res.saved) next.add(targetId);
        else next.delete(targetId);
        return next;
      });

      if (res.saved) {
        showPointsToast(`Saved "${look.title}" to My AURA • Saved Looks`, 50);
      } else {
        showPointsToast(`Removed "${look.title}" from Saved Looks`, 0);
      }
    } catch (err) {
      console.error('Failed to toggle save look:', err);
      // Revert on error
      setSavedLookIds(prev => {
        const next = new Set(prev);
        if (isCurrentlySaved) next.add(targetId);
        else next.delete(targetId);
        return next;
      });
    }
  };

  // Handlers for cross-page navigation
  const handleSelectLookForStudio = (look: StructuredLook) => {
    setCurrentLook(look);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookLookWithArtisans = (look: StructuredLook) => {
    setCurrentLook(look);
    setActiveTab('professionals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArtisanForProfile = (artisan: Professional, mode: 'at-home' | 'signal') => {
    setSelectedArtisanForProfile(artisan);
    if (mode === 'at-home') {
      setActiveTab('priya-at-home');
    } else {
      setActiveTab('priya-signal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArtisanForBooking = (artisan: Professional, _service?: ProfessionalService) => {
    setSelectedArtisanForBooking(artisan);
    setActiveTab('dossier');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async (artisanId: string) => {
    try {
      const result = await auraApi.toggleFavorite(artisanId);
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (result.isFavorite) next.add(artisanId);
        else next.delete(artisanId);
        return next;
      });
      if (result.pointsAdded) {
        showPointsToast('Artisan marked with AURA Point endorsement', 50);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleOpenVisualBrief = (look: StructuredLook) => {
    setActiveBriefLook(look);
    setBriefModalOpen(true);
  };

  const handleBookingSuccess = (_bookingId: string) => {
    setVaultInitialSubTab('bookings');
    setActiveTab('myAura');
    showPointsToast('Booking Dossier confirmed • Added to My AURA Appointments (+250 pts)', 250);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const priyaArtisan = allProfessionals.find(p => p.id === 'priya_sharma') || allProfessionals[0] || selectedArtisanForProfile || {
    id: 'priya_sharma',
    name: 'Priya Sharma',
    avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1Xc9cu67xwSQxFkbxpKRtYzXeRJZaJlFPnr3yt69eyZKXcjoe_TzYUcX-dfs1VFtMdQDT6iDmZNr1wX0lLlY0e7yTlIgdE_0oY8Qr1-RnZ7ERXImdJW5cy9XusLZLrBAPgbi8KqNek2imR199B-kPMLNFAcbunaEH8zaeSDlkMDG_jo7rhBLNtBItZpRg1whrBunaZakwcyhUoi3wjEV1FAf8TLUvp9UfaO890oAmFbowOGw_6l5W6Zyqw-',
    title: 'Verified Master MUA',
    location: 'Mehrauli & Noida',
    distance: '4.2 km away',
    rating: 4.99,
    reviewCount: 348,
    priceRange: 'From ₹2,500',
    auraPointsCount: 1240,
    servicesProvided: ['Bridal & Reception', 'Soft Glam', 'HD Makeup'],
    portfolioImages: [],
    verifiedBadge: true
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body selection:bg-primary selection:text-on-primary">
      {/* Universal Fixed Top & Bottom Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full pt-14 pb-20">
        {activeTab === 'discover' && (
          <DiscoverIndiaEdition
            looks={discoverLooks}
            onSelectLookForStudio={handleSelectLookForStudio}
            onBookLookWithArtisans={handleBookLookWithArtisans}
            onNavigateToPros={() => setActiveTab('professionals')}
            onNavigateToBooking={() => setActiveTab('dossier')}
            savedLookIds={savedLookIds}
            onToggleSaveLook={handleToggleSaveLook}
            onLookSavedNotify={(msg, pts) => showPointsToast(msg, pts)}
            currentUserId={effectiveUserId}
          />
        )}

        {activeTab === 'studio' && (
          <AiStudioIndiaEdition
            currentLook={currentLook}
            setCurrentLook={setCurrentLook}
            onNavigateToArtisans={(look) => {
              setCurrentLook(look);
              setActiveTab('professionals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenVisualBrief={handleOpenVisualBrief}
            onLookSavedNotify={() => {
              showPointsToast('Look saved to AURA Client Vault', 50);
            }}
          />
        )}

        {(activeTab === 'artisans' || activeTab === 'professionals') && (
          <ArtisansWithPoints
            currentLook={currentLook}
            onSelectArtisanForProfile={handleSelectArtisanForProfile}
            onSelectArtisanForBooking={(artisan) => handleSelectArtisanForBooking(artisan)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToStudio={() => {
              setActiveTab('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'priya-at-home' && priyaArtisan && (
          <PriyaSharmaAtHomeProfile
            artisan={priyaArtisan}
            onBookService={(art, srv) => handleSelectArtisanForBooking(art, srv)}
            onSwitchToSignal={() => setActiveTab('priya-signal')}
            isFavorite={favoriteIds.has(priyaArtisan.id)}
            onToggleFavorite={() => handleToggleFavorite(priyaArtisan.id)}
            onBackToPros={() => setActiveTab('professionals')}
          />
        )}

        {activeTab === 'priya-signal' && priyaArtisan && (
          <PriyaSharmaPointsSignal
            artisan={priyaArtisan}
            onBookService={(art, srv) => handleSelectArtisanForBooking(art, srv)}
            onSwitchToAtHome={() => setActiveTab('priya-at-home')}
            isFavorite={favoriteIds.has(priyaArtisan.id)}
            onToggleFavorite={() => handleToggleFavorite(priyaArtisan.id)}
            onBackToPros={() => setActiveTab('professionals')}
          />
        )}

        {activeTab === 'dossier' && (
          <BookingDossierIndiaEdition
            currentLook={currentLook}
            selectedArtisan={selectedArtisanForBooking || priyaArtisan}
            onBookingSuccess={handleBookingSuccess}
            onOpenVisualBrief={() => {
              if (currentLook) handleOpenVisualBrief(currentLook);
            }}
            onBackToArtists={() => setActiveTab('professionals')}
          />
        )}

        {activeTab === 'community' && (
          <CommunityIndiaEdition
            looks={discoverLooks}
            onSelectLookForStudio={handleSelectLookForStudio}
            onBookLookWithArtisans={handleBookLookWithArtisans}
            savedLookIds={savedLookIds}
            onToggleSaveLook={handleToggleSaveLook}
            onLookSavedNotify={(msg, pts) => showPointsToast(msg, pts)}
            currentUserId={effectiveUserId}
          />
        )}

        {(activeTab === 'vault' || activeTab === 'myaura' || activeTab === 'myAura') && (
          <LoyaltyVaultAndMyAura
            onSelectLook={handleSelectLookForStudio}
            onSelectArtisan={(artisan) => handleSelectArtisanForProfile(artisan, 'at-home')}
            favoriteIds={favoriteIds}
            onSignOut={() => setUser(null)}
            currentUser={user}
            onNavigateToDiscover={() => setActiveTab('discover')}
            initialSubTab={vaultInitialSubTab}
          />
        )}
      </main>

      {/* Visual Brief Modal */}
      {briefModalOpen && activeBriefLook && (
        <VisualBriefModal
          look={activeBriefLook}
          isOpen={briefModalOpen}
          onClose={() => setBriefModalOpen(false)}
          onBriefCreated={() => {
            showPointsToast('Visual Brief registered in Dossier', 25);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          showPointsToast('Welcome to AURA Haute Circle', 100);
        }}
      />

      {/* Global Points Toast */}
      {pointsToast && (
        <aside aria-live="polite" className="fixed top-16 right-4 z-50 p-3 bg-surface-container-lowest border border-surface-container shadow-lg text-on-surface flex items-center gap-3 animate-fade-in max-w-sm">
          <div className="w-8 h-8 bg-surface-container flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] uppercase tracking-wider text-primary font-semibold">
              +{pointsToast.points} AURA Points Credited
            </div>
            <div className="font-caption text-caption text-secondary mt-0.5">{pointsToast.message}</div>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-surface-container bg-surface-container-lowest py-8 px-4 text-center space-y-2 mb-16">
        <div className="flex items-center justify-center gap-2 text-on-surface font-display text-sm tracking-widest uppercase">
          <span>AURA</span>
          <span className="text-secondary">•</span>
          <span className="text-secondary text-xs font-body tracking-normal">The AI Layer for Personalized Beauty &amp; Style</span>
        </div>
        <p className="font-caption text-caption text-secondary">
          India Edition • Delhi NCR • Mehrauli • Noida • At-Home Signature Concierge
        </p>
        <p className="font-caption text-[10px] text-outline font-mono">
          © 2026 AURA. Your Vision. Your Look. Your AURA. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
