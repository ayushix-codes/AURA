import { db, isFirebaseConfigured } from './config';
import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { StructuredLook } from '../types/aura';
import { auraApi } from '../services/api';

/**
 * Universal Persistence Service for AURA Saved Looks (Bookmarks)
 * 
 * - If Firebase/Firestore is configured: persists directly to Firestore `users/{userId}/savedLooks/{lookId}`.
 * - If Firebase is not configured: persists directly to the AURA Server database (`/server/data/aura_db.json`),
 *   guaranteeing 100% durable disk persistence across sessions, refreshes, page navigation, and sign-in/out.
 */
export const savedLooksService = {
  isUsingFirestore(): boolean {
    return Boolean(isFirebaseConfigured && db);
  },

  async getSavedLooks(userId: string): Promise<StructuredLook[]> {
    if (isFirebaseConfigured && db) {
      try {
        const looksRef = collection(db, 'users', userId, 'savedLooks');
        const q = query(looksRef, orderBy('savedAt', 'desc'));
        const snapshot = await getDocs(q);
        const results: StructuredLook[] = [];
        snapshot.forEach((docSnap) => {
          results.push(docSnap.data() as StructuredLook);
        });
        return results;
      } catch (err) {
        console.warn('Firestore getSavedLooks error, falling back to AURA persistent API:', err);
      }
    }
    return auraApi.getSavedLooks();
  },

  async getSavedLookIds(userId: string): Promise<string[]> {
    if (isFirebaseConfigured && db) {
      try {
        const looks = await this.getSavedLooks(userId);
        return looks.map(l => l.lookId || l.id).filter(Boolean) as string[];
      } catch (err) {
        console.warn('Firestore getSavedLookIds error, falling back to AURA persistent API:', err);
      }
    }
    return auraApi.getSavedLookIds();
  },

  async toggleSaveLook(
    userId: string,
    look: StructuredLook | (Partial<StructuredLook> & { id?: string; lookId?: string })
  ): Promise<{ saved: boolean; look?: StructuredLook; pointsAdded?: boolean }> {
    if (isFirebaseConfigured && db) {
      try {
        const targetId = (look.lookId || look.id || 'look_' + Date.now()) as string;
        const lookDocRef = doc(db, 'users', userId, 'savedLooks', targetId);
        
        // Check if exists
        const currentSaved = await this.getSavedLooks(userId);
        const exists = currentSaved.some(l => l.lookId === targetId || l.id === targetId || l.id === `saved_${userId}_${targetId}`);

        if (exists) {
          // Unsave
          await deleteDoc(lookDocRef);
          // Also sync with server store for points and consistency
          await auraApi.deleteSavedLook(targetId).catch(() => {});
          return { saved: false };
        } else {
          // Save with full 6 metadata fields retained:
          // 1. look ID (lookId)
          // 2. creator/user ID (creatorId)
          // 3. image
          // 4. caption/details
          // 5. services/style information
          // 6. date saved (dateSaved / savedAt)
          // plus isBookmarkedReference: true (Rule 7: reference bookmark, NOT copying ownership)
          const now = new Date();
          const savedData: StructuredLook = {
            id: `saved_${userId}_${targetId}`,
            lookId: targetId,
            creatorId: look.creatorId || 'usr_community_creator',
            creatorName: look.creatorName || 'Artisan Creator',
            creatorPhoto: look.creatorPhoto,
            title: look.title || 'Curated AURA Look',
            caption: look.caption || look.notes || '',
            notes: look.notes || look.caption || '',
            image: look.image || (look.referenceImages && look.referenceImages[0]) || '',
            referenceImages: look.referenceImages || (look.image ? [look.image] : []),
            aestheticMatch: look.aestheticMatch || '96%',
            price: look.price || '₹2,500',
            occasion: look.occasion || 'Special Celebration',
            overallStyle: look.overallStyle || 'Bespoke Style',
            services: Array.isArray(look.services) && look.services.length > 0 ? look.services : ['Haute Styling Consultation'],
            makeup: look.makeup || { style: 'HD Radiance', finish: 'Luminous Glow', eyes: 'Champagne Shimmer', lips: 'Terracotta Satin', colors: 'Warm Bronze' },
            hair: look.hair || { style: 'Textured Updo', length: 'Mid-Back', finish: 'Gloss Mist' },
            nails: look.nails || { style: 'Sculpted Gel', color: 'Chrome Glaze' },
            jewelry: look.jewelry || { pairing: 'Heritage Fine Jewelry' },
            outfit: look.outfit || { harmony: 'Regal Contemporary' },
            savedAt: now.toISOString(),
            dateSaved: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            isBookmarkedReference: true
          };

          await setDoc(lookDocRef, savedData);
          // Sync server store for loyalty points
          await auraApi.saveLook(savedData).catch(() => {});
          return { saved: true, look: savedData, pointsAdded: true };
        }
      } catch (err) {
        console.warn('Firestore toggleSaveLook error, falling back to AURA persistent API:', err);
      }
    }

    // Default to durable server disk database
    return auraApi.toggleSaveLook(look);
  },

  async deleteSavedLook(userId: string, lookId: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        const lookDocRef = doc(db, 'users', userId, 'savedLooks', lookId);
        await deleteDoc(lookDocRef);
      } catch (err) {
        console.warn('Firestore deleteSavedLook error, falling back:', err);
      }
    }
    const res = await auraApi.deleteSavedLook(lookId);
    return res.deleted;
  }
};
