import {
  StructuredLook,
  Professional,
  Booking,
  VisualBrief,
  UserProfile,
  UserPreferences,
  MatchReason,
  MultiProfessionalPlan
} from '../types/aura';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const currentUserId = localStorage.getItem('aura_user_id') || 'usr_aura_primary';
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': currentUserId,
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    const errorMsg = json?.error?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return json.data as T;
}

export const auraApi = {
  // AI Look Generation & Refinement
  async createLook(params: {
    prompt: string;
    referenceImages?: string[];
    outfit?: string;
    occasion?: string;
    jewelry?: string;
    preferences?: any;
  }): Promise<StructuredLook> {
    return request<StructuredLook>('/ai/create-look', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async refineLook(currentLook: StructuredLook, requestedChange: string): Promise<StructuredLook> {
    return request<StructuredLook>('/ai/refine-look', {
      method: 'POST',
      body: JSON.stringify({ currentLook, requestedChange })
    });
  },

  async analyzeImage(image: string, category: string): Promise<any> {
    return request<any>('/ai/analyze-image', {
      method: 'POST',
      body: JSON.stringify({ image, category })
    });
  },

  async matchProfessionals(
    userLook: StructuredLook,
    criteria: { occasion?: string; location?: string; requiredServices?: string[] } = {}
  ): Promise<{ professionalId: string; professional: Professional; matchScore: number; reasons: string[]; matchedServices: string[] }[]> {
    return request('/ai/match-professionals', {
      method: 'POST',
      body: JSON.stringify({ userLook, ...criteria })
    });
  },

  // Professionals
  async getProfessionals(filters?: { specialization?: string; city?: string; homeOnly?: boolean }): Promise<Professional[]> {
    const params = new URLSearchParams();
    if (filters?.specialization) params.append('specialization', filters.specialization);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.homeOnly) params.append('homeOnly', 'true');
    const qs = params.toString() ? `?${params.toString()}` : '';
    return request<Professional[]>(`/professionals${qs}`);
  },

  async getProfessionalById(id: string): Promise<Professional & { reviews: any[] }> {
    return request<Professional & { reviews: any[] }>(`/professionals/${id}`);
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return request<Booking[]>('/bookings');
  },

  async createBooking(data: {
    professionalId: string;
    professionalName?: string;
    professionalPhoto?: string;
    services: any[];
    date: string;
    time: string;
    totalPrice: number;
    pointsToRedeem?: number;
    coverageType?: 'at-home' | 'studio';
    address?: string;
    status?: 'confirmed' | 'cancelled';
    lookId?: string;
    lookTitle?: string;
    visualBriefId?: string;
  }): Promise<Booking> {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async cancelBooking(id: string): Promise<Booking> {
    return request<Booking>(`/bookings/${id}`, {
      method: 'DELETE'
    });
  },

  async createMultiPlan(data: {
    appointments: any[];
    date: string;
    lookId?: string;
  }): Promise<MultiProfessionalPlan> {
    return request<MultiProfessionalPlan>('/multi-professional-plan', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Saved Looks (Persistent User Bookmarks)
  async getSavedLooks(): Promise<StructuredLook[]> {
    return request<StructuredLook[]>('/saved-looks');
  },

  async getSavedLookIds(): Promise<string[]> {
    return request<string[]>('/saved-looks/ids');
  },

  // Community Looks
  async getCommunityLooks(): Promise<StructuredLook[]> {
    return request<StructuredLook[]>('/community');
  },

  async getCommunityLookById(id: string): Promise<StructuredLook> {
    return request<StructuredLook>(`/community/${id}`);
  },

  async publishLookToCommunity(look: Partial<StructuredLook>): Promise<StructuredLook> {
    return request<StructuredLook>('/community/looks', {
      method: 'POST',
      body: JSON.stringify(look)
    });
  },

  async saveLook(look: Partial<StructuredLook>): Promise<StructuredLook> {
    return request<StructuredLook>('/saved-looks', {
      method: 'POST',
      body: JSON.stringify(look)
    });
  },

  async toggleSaveLook(look: StructuredLook | (Partial<StructuredLook> & { id?: string; lookId?: string })): Promise<{ saved: boolean; look?: StructuredLook; pointsAdded?: boolean }> {
    return request<{ saved: boolean; look?: StructuredLook; pointsAdded?: boolean }>('/saved-looks/toggle', {
      method: 'POST',
      body: JSON.stringify(look)
    });
  },

  async deleteSavedLook(id: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>(`/saved-looks/${id}`, {
      method: 'DELETE'
    });
  },

  // Visual Briefs
  async createVisualBrief(data: any): Promise<VisualBrief> {
    return request<VisualBrief>('/visual-briefs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getVisualBrief(id: string): Promise<VisualBrief> {
    return request<VisualBrief>(`/visual-briefs/${id}`);
  },

  // My AURA & User Profile
  async getMyAura(): Promise<{
    user: UserProfile;
    savedLooks: StructuredLook[];
    favoriteProfessionals: Professional[];
    bookings: Booking[];
    pointsHistory: any[];
    discoverLooks: StructuredLook[];
  }> {
    return request('/my-aura');
  },

  async toggleFavorite(professionalId: string): Promise<{ isFavorite: boolean; pointsAdded: boolean }> {
    return request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ professionalId })
    });
  },

  async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    return request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences })
    });
  },

  async submitReview(data: {
    professionalId: string;
    bookingId: string;
    rating: number;
    reviewText: string;
    service?: string;
  }): Promise<any> {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
