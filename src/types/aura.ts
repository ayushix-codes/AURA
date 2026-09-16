export interface MakeupLook {
  style: string;
  eyes: string;
  lips: string;
  finish: string;
  colors: string;
}

export interface HairLook {
  style: string;
  length: string;
  finish: string;
}

export interface NailsLook {
  style: string;
  color: string;
}

export interface GroomingLook {
  brows?: string;
  skinPrep?: string;
  details?: string;
}

export interface SkinLook {
  prep?: string;
  aesthetic?: string;
}

export interface JewelryLook {
  pairing?: string;
  metals?: string;
  recommendation?: string;
}

export interface OutfitLook {
  harmony?: string;
  palette?: string;
  silhouette?: string;
}

export interface StructuredLook {
  id?: string;
  lookId?: string;
  creatorId?: string;
  creatorName?: string;
  creatorPhoto?: string;
  title?: string;
  caption?: string;
  image?: string;
  aestheticMatch?: string;
  price?: string;
  makeup: MakeupLook;
  hair: HairLook;
  nails: NailsLook;
  grooming?: GroomingLook;
  skin?: SkinLook;
  jewelry?: JewelryLook;
  outfit?: OutfitLook;
  occasion: string;
  overallStyle: string;
  services: string[];
  referenceImages?: string[];
  notes?: string;
  createdAt?: string;
  savedAt?: string;
  dateSaved?: string;
  isBookmarkedReference?: boolean;
}

export interface ProfessionalService {
  id: string;
  name: string;
  category: 'makeup' | 'hair' | 'nails' | 'skin' | 'grooming';
  price: number;
  durationMinutes: number;
  description: string;
}

export interface ProfessionalPortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  styleTags: string[];
  occasion: string;
}

export interface ProfessionalReview {
  id: string;
  userId: string;
  userName: string;
  bookingId: string;
  professionalId?: string;
  rating: number;
  reviewText: string;
  service: string;
  date: string;
}

export interface Professional {
  id: string;
  name: string;
  tagline: string;
  profilePhoto: string;
  coverPhoto: string;
  location: string;
  citiesCovered: string[];
  atHomeCoverageAreas?: string[];
  specialization: string;
  services: ProfessionalService[];
  pricingTier: string;
  basePrice: number;
  portfolio: ProfessionalPortfolioItem[];
  availability: string[];
  rating: number;
  reviewsCount: number;
  auraPointsReward: number;
  auraPointsMultiplier?: number;
  homeService: boolean;
  verified: boolean;
  badges: string[];
  description: string;
  instagramHandle?: string;
}

export interface MatchReason {
  score: number;
  reasons: string[];
  matchedServices: string[];
}

export interface Booking {
  id: string;
  userId: string;
  professionalId: string;
  professionalName?: string;
  professionalPhoto?: string;
  services: ProfessionalService[];
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  pointsDiscount?: number;
  pointsEarned?: number;
  lookId?: string;
  lookTitle?: string;
  visualBriefId?: string;
  coverageType: 'at-home' | 'studio';
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface MultiProfessionalAppointment {
  step: number;
  serviceCategory: string;
  professionalId: string;
  professionalName: string;
  service: ProfessionalService;
  time: string;
}

export interface MultiProfessionalPlan {
  id: string;
  userId: string;
  lookId?: string;
  date: string;
  appointments: MultiProfessionalAppointment[];
  totalPrice: number;
  totalDurationMinutes: number;
  status: 'confirmed' | 'draft';
  createdAt: string;
}

export interface VisualBrief {
  id: string;
  userId: string;
  userName?: string;
  customerRequest: string;
  personalizedLook: StructuredLook;
  referenceImages?: string[];
  outfitNotes?: string;
  occasion: string;
  requestedServices: string[];
  makeupDirectives: string;
  hairDirectives: string;
  nailDirectives: string;
  jewelryDirectives: string;
  specialDirectives?: string;
  status: 'active' | 'shared';
  createdAt: string;
}

export interface AuraPointsTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  reason: string;
  date: string;
  referenceId?: string;
}

export interface UserPreferences {
  skinType?: string;
  undertone?: string;
  favoriteMakeupStyles: string[];
  preferredColors: string[];
  preferredHairStyles: string[];
  preferredCity: string;
  homeServicePreference: boolean;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto: string;
  auraPoints: number;
  tier: 'Silver' | 'Gold' | 'Noir';
  preferences: UserPreferences;
  createdAt: string;
}
