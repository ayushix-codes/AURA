import fs from 'node:fs';
import path from 'node:path';
import {
  UserProfile,
  StructuredLook,
  Booking,
  VisualBrief,
  AuraPointsTransaction,
  Professional,
  ProfessionalReview
} from '../../src/types/aura';
import { SEED_PROFESSIONALS, SEED_DISCOVER_LOOKS } from '../mockData';

class AuraStore {
  public users: Map<string, UserProfile> = new Map();
  public savedLooks: Map<string, StructuredLook[]> = new Map(); // userId -> looks
  public favorites: Map<string, Set<string>> = new Map(); // userId -> professionalIds
  public bookings: Map<string, Booking[]> = new Map(); // userId -> bookings
  public pointsHistory: Map<string, AuraPointsTransaction[]> = new Map();
  public visualBriefs: Map<string, VisualBrief> = new Map();
  public professionals: Map<string, Professional> = new Map();
  public reviews: ProfessionalReview[] = [];
  public communityLooks: StructuredLook[] = [];

  private dbPath: string;

  constructor() {
    const dataDir = path.join(process.cwd(), 'server', 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create server data directory:', err);
      }
    }
    this.dbPath = path.join(dataDir, 'aura_db.json');
    this.initDemoData();
    this.loadFromDisk();
  }

  private persistToDisk() {
    try {
      const payload = {
        users: Object.fromEntries(this.users.entries()),
        savedLooks: Object.fromEntries(this.savedLooks.entries()),
        favorites: Object.fromEntries(Array.from(this.favorites.entries()).map(([k, s]) => [k, Array.from(s)])),
        bookings: Object.fromEntries(this.bookings.entries()),
        pointsHistory: Object.fromEntries(this.pointsHistory.entries()),
        visualBriefs: Object.fromEntries(this.visualBriefs.entries()),
        reviews: this.reviews,
        communityLooks: this.communityLooks
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist AuraStore to disk:', err);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) {
          for (const [k, v] of Object.entries(parsed.users)) {
            this.users.set(k, v as UserProfile);
          }
        }
        if (parsed.savedLooks) {
          for (const [k, v] of Object.entries(parsed.savedLooks)) {
            this.savedLooks.set(k, v as StructuredLook[]);
          }
        }
        if (parsed.favorites) {
          for (const [k, v] of Object.entries(parsed.favorites)) {
            this.favorites.set(k, new Set(v as string[]));
          }
        }
        if (parsed.bookings) {
          for (const [k, v] of Object.entries(parsed.bookings)) {
            this.bookings.set(k, v as Booking[]);
          }
        }
        if (parsed.pointsHistory) {
          for (const [k, v] of Object.entries(parsed.pointsHistory)) {
            this.pointsHistory.set(k, v as AuraPointsTransaction[]);
          }
        }
        if (parsed.visualBriefs) {
          for (const [k, v] of Object.entries(parsed.visualBriefs)) {
            this.visualBriefs.set(k, v as VisualBrief);
          }
        }
        if (parsed.reviews && Array.isArray(parsed.reviews)) {
          this.reviews = parsed.reviews;
        }
        if (parsed.communityLooks && Array.isArray(parsed.communityLooks) && parsed.communityLooks.length > 0) {
          this.communityLooks = parsed.communityLooks;
        } else {
          this.communityLooks = [...SEED_DISCOVER_LOOKS];
        }
      } else {
        this.persistToDisk();
      }
    } catch (err) {
      console.error('Failed to load AuraStore from disk, using in-memory state:', err);
      this.persistToDisk();
    }
  }

  private initDemoData() {
    this.communityLooks = [...SEED_DISCOVER_LOOKS];
    // Seed Professionals
    for (const prof of SEED_PROFESSIONALS) {
      this.professionals.set(prof.id, prof);
    }

    // Seed Verified Reviews
    this.reviews = [
      {
        id: 'rev_1',
        userId: 'demo_user',
        userName: 'Aanya Singhania',
        bookingId: 'bk_hist_1',
        rating: 5,
        reviewText: 'Priya Sharma is pure magic! My wedding makeup in Bandra stayed immaculate through 8 hours of ceremonies and dancing. The skin looked real, radiant, and photograph-ready without a single touch-up.',
        service: 'Signature Royal Bridal Couture',
        date: '2026-02-18'
      },
      {
        id: 'rev_2',
        userId: 'demo_user_2',
        userName: 'Rhea Kapoor',
        bookingId: 'bk_hist_2',
        rating: 5,
        reviewText: 'Booked Priya Sharma via AURA for my South Delhi Sangeet. The visual brief we generated made communication seamless. She knew my exact eye shimmer preference before walking into the room.',
        service: 'Modern Minimalist Sangeet Glam',
        date: '2026-01-24'
      }
    ];

    // Seed Primary Authenticated User
    const primaryUserId = 'usr_aura_primary';
    const primaryUser: UserProfile = {
      id: primaryUserId,
      name: 'Ayushi Singh',
      email: 'ayushi.singh210875@gmail.com',
      phone: '+91 98201 44521',
      profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      auraPoints: 1250,
      tier: 'Gold',
      preferences: {
        skinType: 'Combination Glow',
        undertone: 'Warm Golden Olive',
        favoriteMakeupStyles: ['Soft Glam Radiance', 'Dewy Minimalist', 'Kohl Defined Eyes'],
        preferredColors: ['Champagne Gold', 'Terracotta', 'Rose Gold', 'Caramel'],
        preferredHairStyles: ['Cascading Hollywood Waves', 'Messy Textured Bun'],
        preferredCity: 'Mumbai & Delhi NCR',
        homeServicePreference: true,
        notes: 'Enjoys subtle glitter on eyes, prefers featherweight breathable foundation formulas.'
      },
      createdAt: '2026-01-15T10:00:00.000Z'
    };

    this.users.set(primaryUserId, primaryUser);

    // Initial Saved Looks for Primary User
    this.savedLooks.set(primaryUserId, [
      {
        ...SEED_DISCOVER_LOOKS[0],
        id: 'saved_look_sangeet',
        title: 'My Custom Sangeet Champagne Glow',
        createdAt: '2026-02-10T14:30:00.000Z'
      }
    ]);

    // Initial Favorites
    this.favorites.set(primaryUserId, new Set(['priya_sharma', 'ananya_roy']));

    // Initial Bookings
    this.bookings.set(primaryUserId, [
      {
        id: 'bk_aura_101',
        userId: primaryUserId,
        professionalId: 'priya_sharma',
        professionalName: 'Priya Sharma',
        professionalPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        services: [SEED_PROFESSIONALS[0].services[1]], // Modern Minimalist Sangeet Glam
        date: '2026-04-12',
        time: '03:00 PM',
        status: 'confirmed',
        totalPrice: 16000,
        pointsDiscount: 500,
        pointsEarned: 250,
        coverageType: 'at-home',
        address: 'Bandra West, Mumbai (Signature At-Home Coverage)',
        lookId: 'saved_look_sangeet',
        lookTitle: 'My Custom Sangeet Champagne Glow',
        createdAt: '2026-02-15T11:20:00.000Z'
      }
    ]);

    // Initial Points History
    this.pointsHistory.set(primaryUserId, [
      {
        id: 'tx_1',
        type: 'earned',
        amount: 500,
        reason: 'Welcome to AURA Gold Tier',
        date: '2026-01-15'
      },
      {
        id: 'tx_2',
        type: 'earned',
        amount: 250,
        reason: 'Booking confirmed: Priya Sharma (Sangeet Glam)',
        date: '2026-02-15',
        referenceId: 'bk_aura_101'
      },
      {
        id: 'tx_3',
        type: 'earned',
        amount: 100,
        reason: 'Favorited Master Artisan: Priya Sharma',
        date: '2026-02-10'
      },
      {
        id: 'tx_4',
        type: 'earned',
        amount: 400,
        reason: 'Completed Style Profile & AURA Memory survey',
        date: '2026-02-01'
      }
    ]);

    // Initial Visual Brief
    const briefId = 'brief_priya_sangeet';
    this.visualBriefs.set(briefId, {
      id: briefId,
      userId: primaryUserId,
      userName: 'Ayushi Singh',
      customerRequest: 'Soft glam but with a little glitter. I want my eyes to pop with champagne shimmer but still keep everything neutral.',
      personalizedLook: SEED_DISCOVER_LOOKS[0],
      occasion: 'Sangeet / Mehendi',
      requestedServices: ['Modern Minimalist Sangeet Glam', 'Old-Hollywood Polished Waves with Micro-Volume'],
      makeupDirectives: 'Champagne lid shimmer, soft diffused brown kohl, lifted lashes, satin dewy finish.',
      hairDirectives: 'Glossy Hollywood waves with deep side parting, humidity shield.',
      nailDirectives: 'Glazed chrome almond tips.',
      jewelryDirectives: 'Uncut Polki choker with mint droplet tourmaline.',
      status: 'active',
      createdAt: '2026-02-12T16:00:00.000Z'
    });
  }

  // User methods
  getUser(userId: string): UserProfile | undefined {
    return this.users.get(userId);
  }

  getOrCreateUser(userId: string, data?: Partial<UserProfile>): UserProfile {
    let user = this.users.get(userId);
    if (!user) {
      user = {
        id: userId,
        name: data?.name || 'AURA Connoisseur',
        email: data?.email || `${userId}@aura.internal`,
        phone: data?.phone || '+91 98000 00000',
        profilePhoto: data?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        auraPoints: data?.auraPoints ?? 500,
        tier: data?.tier || 'Silver',
        preferences: {
          skinType: 'Hydra Radiant',
          undertone: 'Warm Golden',
          favoriteMakeupStyles: ['Soft Glam', 'Glass Skin'],
          preferredColors: ['Champagne', 'Terracotta'],
          preferredHairStyles: ['Soft Waves', 'Chignon'],
          preferredCity: 'Delhi NCR & Mumbai',
          homeServicePreference: true,
          notes: 'Personalized couture beauty calibration.'
        },
        createdAt: new Date().toISOString()
      };
      this.users.set(userId, user);
      if (!this.savedLooks.has(userId)) {
        this.savedLooks.set(userId, []);
      }
      this.persistToDisk();
    }
    return user;
  }

  updateUser(userId: string, data: Partial<UserProfile>): UserProfile {
    const user = this.getOrCreateUser(userId);
    const updated = { ...user, ...data };
    this.users.set(userId, updated);
    this.persistToDisk();
    return updated;
  }

  // Points methods (Server authoritative only)
  addAuraPoints(userId: string, amount: number, reason: string, referenceId?: string): number {
    const user = this.getOrCreateUser(userId);
    user.auraPoints += amount;
    // Update tier
    if (user.auraPoints >= 2500) user.tier = 'Noir';
    else if (user.auraPoints >= 1000) user.tier = 'Gold';
    else user.tier = 'Silver';

    const txs = this.pointsHistory.get(userId) || [];
    txs.unshift({
      id: 'tx_' + Date.now(),
      type: 'earned',
      amount,
      reason,
      date: new Date().toISOString().split('T')[0],
      referenceId
    });
    this.pointsHistory.set(userId, txs);
    this.persistToDisk();
    return user.auraPoints;
  }

  redeemAuraPoints(userId: string, amount: number, reason: string): boolean {
    const user = this.users.get(userId);
    if (!user || user.auraPoints < amount) return false;
    user.auraPoints -= amount;

    const txs = this.pointsHistory.get(userId) || [];
    txs.unshift({
      id: 'tx_' + Date.now(),
      type: 'redeemed',
      amount,
      reason,
      date: new Date().toISOString().split('T')[0]
    });
    this.pointsHistory.set(userId, txs);
    this.persistToDisk();
    return true;
  }

  // Saved Looks - Persistent, User-specific Bookmarks
  getSavedLooks(userId: string): StructuredLook[] {
    return this.savedLooks.get(userId) || [];
  }

  getSavedLookIds(userId: string): string[] {
    const list = this.savedLooks.get(userId) || [];
    return list.map(l => l.lookId || l.id).filter(Boolean) as string[];
  }

  saveLook(userId: string, look: Partial<StructuredLook> & { id?: string }): StructuredLook {
    const looks = this.savedLooks.get(userId) || [];
    const targetLookId = look.lookId || look.id || 'look_' + Date.now();
    
    // Check if already saved by user
    const existingIndex = looks.findIndex(l => (l.lookId && l.lookId === targetLookId) || l.id === targetLookId || l.id === `saved_${userId}_${targetLookId}`);
    if (existingIndex >= 0) {
      return looks[existingIndex];
    }

    const now = new Date();
    const dateSavedFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Build the bookmarked look retaining all 6 required fields:
    // 1. look ID (lookId)
    // 2. creator/user ID (creatorId)
    // 3. image
    // 4. caption/details
    // 5. services/style information
    // 6. date saved (savedAt / dateSaved)
    // plus isBookmarkedReference: true (Rule 7: saving means bookmarking/reference, not copying ownership)
    const newSavedLook: StructuredLook = {
      id: `saved_${userId}_${targetLookId}`,
      lookId: targetLookId,
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
      dateSaved: dateSavedFormatted,
      isBookmarkedReference: true // Rule 7: strictly a saved reference bookmark, NOT a self-authored post
    };

    looks.unshift(newSavedLook);
    this.savedLooks.set(userId, looks);
    this.addAuraPoints(userId, 50, `Saved bespoke look: "${newSavedLook.title}"`);
    this.persistToDisk();
    return newSavedLook;
  }

  toggleSaveLook(userId: string, look: Partial<StructuredLook> & { id: string }): { saved: boolean; look?: StructuredLook; pointsAdded?: boolean } {
    const looks = this.savedLooks.get(userId) || [];
    const targetLookId = look.lookId || look.id;

    const existingIndex = looks.findIndex(l => (l.lookId && l.lookId === targetLookId) || l.id === targetLookId || l.id === `saved_${userId}_${targetLookId}`);

    if (existingIndex >= 0) {
      // Unsave/remove bookmark
      looks.splice(existingIndex, 1);
      this.savedLooks.set(userId, looks);
      this.persistToDisk();
      return { saved: false };
    } else {
      // Save bookmark
      const savedLook = this.saveLook(userId, look);
      return { saved: true, look: savedLook, pointsAdded: true };
    }
  }

  deleteSavedLook(userId: string, lookIdOrBookmarkId: string): boolean {
    const looks = this.savedLooks.get(userId) || [];
    const filtered = looks.filter(l => l.id !== lookIdOrBookmarkId && l.lookId !== lookIdOrBookmarkId);
    this.savedLooks.set(userId, filtered);
    this.persistToDisk();
    return true;
  }

  // Favorites
  getFavorites(userId: string): string[] {
    const set = this.favorites.get(userId) || new Set();
    return Array.from(set);
  }

  toggleFavorite(userId: string, professionalId: string): { isFavorite: boolean; pointsAdded: boolean } {
    let set = this.favorites.get(userId);
    if (!set) {
      set = new Set();
      this.favorites.set(userId, set);
    }
    if (set.has(professionalId)) {
      set.delete(professionalId);
      this.persistToDisk();
      return { isFavorite: false, pointsAdded: false };
    } else {
      set.add(professionalId);
      const prof = this.professionals.get(professionalId);
      this.addAuraPoints(userId, 50, `Favorited Artisan: ${prof?.name || professionalId}`);
      this.persistToDisk();
      return { isFavorite: true, pointsAdded: true };
    }
  }

  // Bookings
  getBookings(userId: string): Booking[] {
    return this.bookings.get(userId) || [];
  }

  createBooking(userId: string, bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const existing = this.bookings.get(userId) || [];
    
    // Check schedule conflict with same professional on same slot
    const conflict = existing.find(b => 
      b.professionalId === bookingData.professionalId &&
      b.date === bookingData.date && 
      b.time === bookingData.time && 
      b.status !== 'cancelled'
    );
    if (conflict) {
      throw new Error(`Schedule conflict: You already have a confirmed session with ${conflict.professionalName} on ${conflict.date} at ${conflict.time}`);
    }

    const prof = this.professionals.get(bookingData.professionalId);
    const newBooking: Booking = {
      ...bookingData,
      id: 'bk_' + Date.now(),
      userId,
      professionalName: prof?.name || bookingData.professionalName || 'Verified Artisan',
      professionalPhoto: prof?.profilePhoto || bookingData.professionalPhoto || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    existing.unshift(newBooking);
    this.bookings.set(userId, existing);

    // Award AURA Points
    const pointsAward = prof ? prof.auraPointsReward : 200;
    this.addAuraPoints(userId, pointsAward, `Booking confirmed: ${newBooking.professionalName} (${newBooking.services.map(s => s.name).join(', ')})`, newBooking.id);
    this.persistToDisk();
    return newBooking;
  }

  // Community Looks methods
  getCommunityLooks(): StructuredLook[] {
    return this.communityLooks && this.communityLooks.length > 0 ? this.communityLooks : SEED_DISCOVER_LOOKS;
  }

  getLookById(id: string): StructuredLook | undefined {
    const fromCommunity = (this.communityLooks || []).find(l => l.id === id || l.lookId === id);
    if (fromCommunity) return fromCommunity;
    for (const looks of this.savedLooks.values()) {
      const found = looks.find(l => l.id === id || l.lookId === id);
      if (found) return found;
    }
    return SEED_DISCOVER_LOOKS.find(l => l.id === id || l.lookId === id);
  }

  publishToCommunity(userId: string, lookData: Partial<StructuredLook>): StructuredLook {
    const user = this.getUser(userId);
    const id = 'look_comm_' + Date.now();
    const newLook: StructuredLook = {
      id,
      lookId: id,
      creatorId: userId,
      creatorName: user?.name || 'AURA Creator',
      creatorPhoto: user?.profilePhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      title: lookData.title || 'Curated Community Look',
      caption: lookData.caption || lookData.notes || '',
      image: lookData.image || (lookData.referenceImages && lookData.referenceImages[0]) || '',
      referenceImages: lookData.referenceImages || (lookData.image ? [lookData.image] : []),
      aestheticMatch: lookData.aestheticMatch || '98%',
      price: lookData.price || '₹3,000',
      occasion: lookData.occasion || 'Celebration',
      overallStyle: lookData.overallStyle || 'Contemporary Haute',
      services: lookData.services || ['Bespoke Styling'],
      makeup: lookData.makeup,
      hair: lookData.hair,
      nails: lookData.nails,
      jewelry: lookData.jewelry,
      outfit: lookData.outfit,
      dateSaved: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    this.communityLooks.unshift(newLook);
    this.persistToDisk();
    return newLook;
  }

  cancelBooking(userId: string, bookingId: string): Booking {
    const list = this.bookings.get(userId) || [];
    const item = list.find(b => b.id === bookingId);
    if (!item) throw new Error('Booking not found');
    item.status = 'cancelled';
    this.persistToDisk();
    return item;
  }

  // Visual Briefs
  createVisualBrief(briefData: Omit<VisualBrief, 'id' | 'createdAt'>): VisualBrief {
    const id = 'brief_' + Date.now();
    const brief: VisualBrief = {
      ...briefData,
      id,
      createdAt: new Date().toISOString()
    };
    this.visualBriefs.set(id, brief);
    this.persistToDisk();
    return brief;
  }

  getVisualBrief(id: string): VisualBrief | undefined {
    return this.visualBriefs.get(id);
  }

  // Reviews
  createReview(userId: string, data: { professionalId: string; bookingId: string; rating: number; reviewText: string; service: string }): ProfessionalReview {
    // Validate booking completion
    const userBookings = this.bookings.get(userId) || [];
    const validBooking = userBookings.find(b => b.id === data.bookingId && b.professionalId === data.professionalId);
    if (!validBooking) {
      throw new Error('You can only review professionals with whom you have a verified booking record.');
    }

    const user = this.users.get(userId);
    const review: ProfessionalReview = {
      id: 'rev_' + Date.now(),
      userId,
      userName: user?.name || 'Verified Client',
      bookingId: data.bookingId,
      professionalId: data.professionalId,
      rating: data.rating,
      reviewText: data.reviewText,
      service: data.service,
      date: new Date().toISOString().split('T')[0]
    };

    this.reviews.unshift(review);
    this.addAuraPoints(userId, 100, `Published verified review for ${validBooking.professionalName}`);
    this.persistToDisk();
    return review;
  }

  getReviewsForProfessional(professionalId: string): ProfessionalReview[] {
    return this.reviews.filter(r => r.professionalId === professionalId);
  }
}

export const auraStore = new AuraStore();
