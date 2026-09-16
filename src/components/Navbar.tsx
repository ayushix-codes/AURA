import React from 'react';
import { UserProfile } from '../types/aura';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  serviceMode?: 'home' | 'salon';
  onToggleServiceMode?: (mode: 'home' | 'salon') => void;
  locationLabel?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  serviceMode = 'home',
  onToggleServiceMode,
  locationLabel = 'ATS Greens, Sector 50, Noida'
}) => {
  const points = user ? user.auraPoints : 1420;

  // Header sub-bar on specific screens (professionals, priya profiles, studio, etc.)
  const showSubBar = activeTab === 'professionals' || activeTab === 'priya-at-home' || activeTab === 'priya-signal';

  return (
    <>
      {/* Top Header Fixed */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-surface-container">
        <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-xs max-w-7xl mx-auto">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-space-sm min-w-0 flex-shrink-0 cursor-pointer"
          >
            <img
              alt="AURA Wordmark Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VEdn3YvQim2wXk3idwolrPmv_-vSeoXEoknxbWdAX_pos7_T4eC0Lv2rQ6TNmTZWp3c6H-ba6RHpRsrHuqswfhJylkM50L-i2dFI5TQ4FXeavbhHLf3Tufk9fjqeoWiKFVvidfSvPBd90y_mqYgNgpNs3koMWqCJ8bemdNYivgVhBCib-5EwzXQAVZp2K-LOCeiirnep1_WtjI3Mk1kVhV-60gGPHzMXdtwighhTpev0KbZrpW5bUDwJs"
            />
            <span className="hidden sr-only">AURA Professionals</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Search"
              onClick={() => setActiveTab('professionals')}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Points pill */}
            <div
              onClick={() => setActiveTab('myAura')}
              className="hidden sm:flex items-center px-space-sm py-1 bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors"
              title="View AURA Loyalty Vault"
            >
              <span className="font-label-caps text-label-caps text-on-surface uppercase font-medium">
                {points.toLocaleString()} pts
              </span>
            </div>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              onClick={() => setActiveTab('booking')}
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary transition-colors relative"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary"></span>
            </button>

            {/* Account Profile */}
            <button
              aria-label="Account Profile"
              onClick={() => (user ? setActiveTab('myAura') : onOpenAuth())}
              className="w-11 h-11 flex items-center justify-center"
              type="button"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-surface-container-highest"
                src={user?.profilePhoto || "https://lh3.googleusercontent.com/aida-public/AB6AXuC3qk2QobNkNZWqwW5ACfkZQjybuh6-1AaUDKCz3-rz18IR5SL_HqPTKckZctRqWAC_quAaWMHHA6vLSuKsBsIb7HJr_HASHgeQuuy2wTKu9MIS9wSJQ7dGesP9FcAcIV7-UryUFoViab3RgB4sdlYlnp6jkvBB1Bem_TSkefA55j2sCY1-VEtgWpIC2JCDksJvgd4fX69JcPIRXLmipEH_AoXlozEpDAow4x_yvnrh5-v2bOslih4RIA"}
              />
            </button>
          </div>
        </div>

        {/* Secondary Context Strip (Mode & Location) */}
        {showSubBar && (
          <div className="border-t border-surface-container-high px-gutter-mobile py-1.5 bg-surface-container-lowest flex items-center justify-between gap-space-xs text-[11px] font-label-caps max-w-7xl mx-auto">
            <button
              onClick={() => onToggleServiceMode && onToggleServiceMode(serviceMode === 'home' ? 'salon' : 'home')}
              className="flex items-center gap-1 text-on-surface hover:text-secondary uppercase tracking-wider transition-colors"
              type="button"
            >
              <span className="text-secondary">Service Mode:</span>
              <span className="font-medium text-primary flex items-center gap-0.5 px-1.5 py-0.5 border border-surface-container-high bg-surface-container-low">
                <span>{serviceMode === 'home' ? 'At-Home' : 'At-Salon'}</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </span>
            </button>

            <button
              className="flex items-center gap-1 text-secondary hover:text-on-surface truncate tracking-wider uppercase transition-colors text-right"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-primary flex-shrink-0">location_on</span>
              <span className="truncate text-on-surface font-medium">{locationLabel}</span>
              <span className="material-symbols-outlined text-[14px] flex-shrink-0">expand_more</span>
            </button>
          </div>
        )}
      </header>

      {/* Fixed Bottom Universal Navigation */}
      <nav
        className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)] border-t border-surface-container"
      >
        <div className="flex justify-between items-center h-20 px-space-xs max-w-lg mx-auto">
          {/* 1. Discover */}
          <button
            onClick={() => {
              setActiveTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors gap-1 ${
              activeTab === 'discover'
                ? 'text-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'discover' ? "'FILL' 1" : "'FILL' 0" }}
            >
              explore
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest leading-none">Discover</span>
          </button>

          {/* 2. Studio */}
          <button
            onClick={() => {
              setActiveTab('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors gap-1 ${
              activeTab === 'studio'
                ? 'text-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'studio' ? "'FILL' 1" : "'FILL' 0" }}
            >
              auto_fix_high
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest leading-none">Studio</span>
          </button>

          {/* 3. Pros */}
          <button
            onClick={() => {
              setActiveTab('professionals');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors gap-1 ${
              activeTab === 'professionals' || activeTab === 'priya-at-home' || activeTab === 'priya-signal'
                ? 'text-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: (activeTab === 'professionals' || activeTab === 'priya-at-home' || activeTab === 'priya-signal') ? "'FILL' 1" : "'FILL' 0" }}
            >
              work_outline
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest leading-none">Pros</span>
          </button>

          {/* 4. Community */}
          <button
            onClick={() => {
              setActiveTab('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors gap-1 ${
              activeTab === 'community'
                ? 'text-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'community' ? "'FILL' 1" : "'FILL' 0" }}
            >
              grid_view
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest leading-none">Community</span>
          </button>

          {/* 5. My AURA (Loyalty Vault / Archive) */}
          <button
            onClick={() => {
              setActiveTab('myAura');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors gap-1 ${
              activeTab === 'myAura' || activeTab === 'vault' || activeTab === 'myaura'
                ? 'text-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: (activeTab === 'myAura' || activeTab === 'vault' || activeTab === 'myaura') ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark_border
            </span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest leading-none">My AURA</span>
          </button>
        </div>
      </nav>
    </>
  );
};
