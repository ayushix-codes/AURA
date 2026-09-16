import React, { useState } from 'react';
import { isFirebaseConfigured, auth } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('pooja.verma@example.com');
  const [name, setName] = useState('Pooja Verma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoSignIn = () => {
    const demoUser = {
      id: 'usr_aura_primary',
      name: name || 'Pooja Verma',
      email: email || 'pooja.verma@example.com',
      auraPoints: 1450,
      tier: 'Gold Connoisseur',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    localStorage.setItem('aura_user_id', demoUser.id);
    onAuthSuccess(demoUser);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    if (isFirebaseConfigured && auth) {
      setLoading(true);
      setError(null);
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const uData = {
          id: user.uid,
          name: user.displayName || 'AURA Client',
          email: user.email || '',
          profilePhoto: user.photoURL || undefined,
          auraPoints: 500,
          tier: 'Silver'
        };
        localStorage.setItem('aura_user_id', user.uid);
        onAuthSuccess(uData);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Firebase Google Sign-In failed.');
      } finally {
        setLoading(false);
      }
    } else {
      handleDemoSignIn();
    }
  };

  return (
    <div aria-modal="true" className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" role="dialog">
      <div className="bg-surface-container-lowest border border-surface-container max-w-md w-full p-6 space-y-5 shadow-2xl relative my-8 text-on-surface">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
          type="button"
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span className="font-label-caps text-label-caps uppercase tracking-widest font-semibold">
              The AURA Client Vault
            </span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
            {mode === 'signin' ? 'Access Haute Profile' : 'Register AURA Account'}
          </h2>
          <p className="font-caption text-caption text-secondary">
            Sync calibrated formulations, jewelry archives &amp; verified artisan bookings
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-error/10 border border-error/20 text-error text-[11px]">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3 pt-2">
          {mode === 'signup' && (
            <div>
              <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border border-surface-container p-2.5 text-body-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="e.g. Pooja Verma"
              />
            </div>
          )}
          <div>
            <label className="font-caption text-caption uppercase tracking-wider text-secondary block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container p-2.5 text-body-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="pooja.verma@example.com"
            />
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full h-11 bg-primary text-on-primary font-label-caps text-label-caps uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            type="button"
          >
            <span>{mode === 'signin' ? 'Enter Client Vault' : 'Complete Registration'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>

          {isFirebaseConfigured && (
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 bg-surface-container-low text-on-surface border border-surface-container font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
              type="button"
            >
              <span>Continue with Google</span>
            </button>
          )}
        </div>

        {/* Mode Switcher */}
        <div className="pt-2 text-center border-t border-surface-container">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-caption text-caption text-secondary hover:text-on-surface underline"
            type="button"
          >
            {mode === 'signin' ? "Don't have an account? Create one" : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
