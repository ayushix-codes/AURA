import React, { useState } from 'react';
import { StructuredLook, VisualBrief } from '../types/aura';
import { auraApi } from '../services/api';

interface VisualBriefModalProps {
  look: StructuredLook;
  isOpen: boolean;
  onClose: () => void;
  onBriefCreated?: (brief: VisualBrief) => void;
}

export const VisualBriefModal: React.FC<VisualBriefModalProps> = ({
  look,
  isOpen,
  onClose,
  onBriefCreated
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleCreateAndSave = async () => {
    setIsSaving(true);
    try {
      const brief = await auraApi.createVisualBrief({
        personalizedLook: look,
        customerRequest: look.title || 'Personalized Look Consultation',
        occasion: look.occasion,
        requestedServices: look.services || []
      });
      if (onBriefCreated) onBriefCreated(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to create visual brief:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyText = () => {
    const text = `AURA VISUAL BRIEF // PROTOCOL 09
Occasion: ${look.occasion}
Look: ${look.title}
Skin Undertone Calibration: Warm Olive #03 (Ref: D480)
Makeup: ${look.makeup?.finish || 'Hydra Silk Dew'} | Eyes: ${look.makeup?.eyes || 'Bronze tightline'} | Lips: ${look.makeup?.lips || 'Rosewood Satin Glaze'}
Hair Architecture: ${look.hair?.style || 'Textured Low Chignon'}
Jewelry Matching: ${look.jewelry?.pairing || '22k Gold Kundan & Basra Pearls'}
Required Services: ${(look.services || []).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div aria-modal="true" className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" role="dialog">
      <div className="bg-surface-container-lowest border border-surface-container max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-8 text-on-surface">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
          type="button"
          aria-label="Close brief"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="border-b border-surface-container pb-4">
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            <span className="font-label-caps text-[10px] uppercase tracking-widest font-semibold">
              Client • Artisan Consultation Blueprint
            </span>
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            AURA Official Visual Brief
          </h2>
          <p className="font-caption text-caption text-secondary mt-0.5">
            Standardized technical directive for coordinated beauty specialists &amp; draping visagistes
          </p>
        </div>

        {/* Blueprint Content */}
        <div className="space-y-3 font-body-sm text-body-sm">
          {/* Hero Context Summary */}
          <div className="p-3 bg-surface-container-low border border-surface-container flex items-start gap-3">
            <div className="w-14 h-16 bg-surface-container shrink-0 overflow-hidden border border-surface-container-high">
              <img
                alt={look.title}
                className="w-full h-full object-cover"
                src={look.heroImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-caption text-[10px] uppercase tracking-wider text-secondary">{look.occasion}</span>
              <h3 className="font-subheading text-subheading font-medium text-on-surface mt-0.5">{look.title}</h3>
              <p className="font-caption text-[11px] text-on-surface-variant mt-0.5">Calibrated Undertone: Warm Olive #03 (Ref: D480)</p>
            </div>
          </div>

          {/* Section 1: Complexion & Makeup */}
          <div className="p-3 bg-surface-container-lowest border border-surface-container">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <span className="material-symbols-outlined text-[15px]">palette</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">01 // Visage Formulation</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px] mt-1.5">
              <div>
                <span className="font-caption text-[10px] uppercase text-secondary block">Base &amp; Finish:</span>
                <span className="text-on-surface">{look.makeup?.finish || 'Hydra Silk Dew Warm Olive'}</span>
              </div>
              <div>
                <span className="font-caption text-[10px] uppercase text-secondary block">Eye Definition:</span>
                <span className="text-on-surface">{look.makeup?.eyes || 'Subtle bronze tightline & micro-clusters'}</span>
              </div>
              <div>
                <span className="font-caption text-[10px] uppercase text-secondary block">Lip Chemistry:</span>
                <span className="text-on-surface">{look.makeup?.lips || 'Rosewood Satin Glaze (Ref: V-108)'}</span>
              </div>
              <div>
                <span className="font-caption text-[10px] uppercase text-secondary block">Color Harmony:</span>
                <span className="text-on-surface">{look.makeup?.colors || 'Ivory, Rosewood, Soft Champagne'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Hair & Drape */}
          <div className="p-3 bg-surface-container-lowest border border-surface-container">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <span className="material-symbols-outlined text-[15px]">gesture</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">02 // Hair Architecture &amp; Drape</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px] mt-1.5">
              <div>
                <span className="font-caption text-[10px] uppercase text-secondary block">Chignon / Updo:</span>
                <span className="text-on-surface">{look.hair?.style || 'Textured Low Chignon & Flora'}</span>
              </div>
              <div>
                <span className="font-caption text-[10px] uppercase text-secondary block">Finish / Hold:</span>
                <span className="text-on-surface">{look.hair?.finish || 'Anti-humidity gloss & tender face tendrils'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Jewelry & Silhouettes */}
          <div className="p-3 bg-surface-container-lowest border border-surface-container">
            <div className="flex items-center gap-1.5 text-primary mb-1">
              <span className="material-symbols-outlined text-[15px]">diamond</span>
              <span className="font-label-caps text-[10px] uppercase tracking-wider font-semibold">03 // Client Vault Jewelry</span>
            </div>
            <p className="text-[12px] text-on-surface mt-1">
              {look.jewelry?.pairing || '22k Gold Kundan & Basra Pearls (Personal Heirlooms // Box #2)'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
          <button
            onClick={handleCopyText}
            className="flex-1 py-2.5 px-3 bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-caps text-label-caps uppercase tracking-wider flex items-center justify-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copied ? 'Copied to Clipboard' : 'Copy Brief Text'}</span>
          </button>
          <button
            onClick={handleCreateAndSave}
            disabled={isSaving}
            className="flex-1 py-2.5 px-3 bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-label-caps text-label-caps uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
            <span>{isSaving ? 'Archiving...' : 'Save to Vault'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
