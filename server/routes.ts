import { Router, Request, Response } from 'express';
import { auraStore } from './services/store';
import {
  generateAuraLook,
  refineAuraLook,
  analyzeInspirationImage,
  matchProfessionalsWithLook
} from './services/geminiService';
import { SEED_DISCOVER_LOOKS } from './mockData';

export const apiRouter = Router();

// Helper for standardized API responses
function sendSuccess(res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function sendError(res: Response, code: string, message: string, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

// Session resolver
function getUserId(req: Request): string {
  const headerUserId = req.headers['x-user-id'] as string;
  return headerUserId || 'usr_aura_primary';
}

// ==========================================
// 1. AI LOOK CREATION & REFINEMENT
// ==========================================

apiRouter.post('/ai/create-look', async (req: Request, res: Response) => {
  try {
    const { prompt, referenceImages, outfit, occasion, jewelry, preferences } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return sendError(res, 'INVALID_PROMPT', 'Please provide a beauty and style vision prompt.');
    }

    const look = await generateAuraLook({
      prompt,
      referenceImages,
      outfit,
      occasion,
      jewelry,
      preferences
    });

    return sendSuccess(res, look);
  } catch (err: any) {
    console.error('Error creating look:', err);
    return sendError(res, 'AI_LOOK_FAILED', 'Unable to create personalized look right now. Please try again.', 500);
  }
});

apiRouter.post('/ai/refine-look', async (req: Request, res: Response) => {
  try {
    const { currentLook, requestedChange } = req.body;
    if (!currentLook || !requestedChange) {
      return sendError(res, 'INVALID_REFINEMENT_INPUT', 'Current look and requested change are required.');
    }

    const updated = await refineAuraLook(currentLook, requestedChange);
    return sendSuccess(res, updated);
  } catch (err: any) {
    console.error('Error refining look:', err);
    return sendError(res, 'AI_REFINE_FAILED', 'Unable to refine look right now. Please try again.', 500);
  }
});

apiRouter.post('/ai/analyze-image', async (req: Request, res: Response) => {
  try {
    const { image, category } = req.body;
    if (!image) {
      return sendError(res, 'NO_IMAGE_PROVIDED', 'Please upload or provide an image to analyze.');
    }

    const analysis = await analyzeInspirationImage(image, category || 'reference');
    return sendSuccess(res, analysis);
  } catch (err: any) {
    console.error('Error analyzing image:', err);
    return sendError(res, 'AI_ANALYSIS_FAILED', 'Unable to analyze the image. Please try again.', 500);
  }
});

apiRouter.post('/ai/match-professionals', async (req: Request, res: Response) => {
  try {
    const { userLook, requiredServices, occasion, location, preferences } = req.body;
    if (!userLook) {
      return sendError(res, 'MISSING_LOOK', 'User look is required to calculate artisan matches.');
    }

    const allProfessionals = Array.from(auraStore.professionals.values());
    const matches = matchProfessionalsWithLook(userLook, allProfessionals, {
      occasion,
      location,
      requiredServices
    });

    return sendSuccess(res, matches);
  } catch (err: any) {
    console.error('Error matching professionals:', err);
    return sendError(res, 'MATCHING_FAILED', 'Unable to match professionals at this moment.', 500);
  }
});

// ==========================================
// 2. PROFESSIONALS & PORTFOLIOS
// ==========================================

apiRouter.get('/professionals', (req: Request, res: Response) => {
  try {
    const { specialization, location, city, homeOnly } = req.query;
    let list = Array.from(auraStore.professionals.values());

    if (specialization) {
      const spec = (specialization as string).toLowerCase();
      list = list.filter(p => p.specialization.toLowerCase().includes(spec));
    }

    if (city) {
      const c = (city as string).toLowerCase();
      list = list.filter(p => p.citiesCovered.some(cc => cc.toLowerCase().includes(c)));
    }

    if (homeOnly === 'true') {
      list = list.filter(p => p.homeService);
    }

    return sendSuccess(res, list);
  } catch (err) {
    return sendError(res, 'LOAD_FAILED', 'Unable to load professionals.', 500);
  }
});

apiRouter.get('/professionals/:id', (req: Request, res: Response) => {
  try {
    const prof = auraStore.professionals.get(req.params.id);
    if (!prof) {
      return sendError(res, 'NOT_FOUND', 'Artisan profile not found.', 404);
    }
    const reviews = auraStore.getReviewsForProfessional(prof.id);
    return sendSuccess(res, { ...prof, reviews });
  } catch (err) {
    return sendError(res, 'FETCH_FAILED', 'Failed to retrieve artisan profile.', 500);
  }
});

// ==========================================
// 3. BOOKINGS & MULTI-PLAN
// ==========================================

apiRouter.get('/bookings', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const bookings = auraStore.getBookings(userId);
    return sendSuccess(res, bookings);
  } catch (err) {
    return sendError(res, 'FETCH_FAILED', 'Unable to retrieve bookings.', 500);
  }
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { professionalId, services, date, time, totalPrice, pointsToRedeem, coverageType, address, lookId, lookTitle, visualBriefId } = req.body;

    if (!professionalId || !services || !services.length || !date || !time) {
      return sendError(res, 'INVALID_BOOKING', 'Please select professional, services, date, and time slot.');
    }

    // Points redemption check
    let pointsDiscount = 0;
    if (pointsToRedeem && pointsToRedeem > 0) {
      const redeemed = auraStore.redeemAuraPoints(userId, pointsToRedeem, `Redeemed ${pointsToRedeem} points on booking`);
      if (redeemed) {
        pointsDiscount = pointsToRedeem; // 1 pt = ₹1 discount
      }
    }

    const finalPrice = Math.max(0, (totalPrice || 0) - pointsDiscount);

    const booking = auraStore.createBooking(userId, {
      userId,
      professionalId,
      services,
      date,
      time,
      status: 'confirmed',
      totalPrice: finalPrice,
      pointsDiscount,
      coverageType: coverageType || 'at-home',
      address,
      lookId,
      lookTitle,
      visualBriefId
    });

    return sendSuccess(res, booking, 201);
  } catch (err: any) {
    return sendError(res, 'BOOKING_FAILED', err.message || 'Your booking could not be completed.', 400);
  }
});

apiRouter.patch('/bookings/:id', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { status } = req.body;
    const bookings = auraStore.getBookings(userId);
    const item = bookings.find(b => b.id === req.params.id);
    if (!item) {
      return sendError(res, 'NOT_FOUND', 'Booking record not found.', 404);
    }
    if (status) item.status = status;
    return sendSuccess(res, item);
  } catch (err: any) {
    return sendError(res, 'UPDATE_FAILED', err.message || 'Failed to update booking.', 500);
  }
});

apiRouter.delete('/bookings/:id', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const cancelled = auraStore.cancelBooking(userId, req.params.id);
    return sendSuccess(res, cancelled);
  } catch (err: any) {
    return sendError(res, 'CANCEL_FAILED', err.message || 'Failed to cancel booking.', 400);
  }
});

// Multi-Professional Plan Generator
apiRouter.post('/multi-professional-plan', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { appointments, date, lookId } = req.body;
    // max 3 appointments as specified in MVP rule #19
    if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
      return sendError(res, 'INVALID_PLAN', 'Appointments list required.');
    }
    if (appointments.length > 3) {
      return sendError(res, 'LIMIT_EXCEEDED', 'AURA MVP allows up to 3 coordinated specialist appointments in a single day plan.');
    }

    // Check time conflicts among appointments
    const times = new Set<string>();
    for (const apt of appointments) {
      if (times.has(apt.time)) {
        return sendError(res, 'SCHEDULE_CONFLICT', `Time conflict: Multiple specialists assigned to ${apt.time}. Please space out services.`);
      }
      times.add(apt.time);
    }

    const totalPrice = appointments.reduce((sum, a) => sum + (a.service?.price || 0), 0);
    const totalDurationMinutes = appointments.reduce((sum, a) => sum + (a.service?.durationMinutes || 60), 0);

    const plan = {
      id: 'plan_' + Date.now(),
      userId,
      lookId,
      date: date || new Date().toISOString().split('T')[0],
      appointments,
      totalPrice,
      totalDurationMinutes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    return sendSuccess(res, plan);
  } catch (err: any) {
    return sendError(res, 'PLAN_FAILED', err.message || 'Failed to create multi-professional plan.', 500);
  }
});

// ==========================================
// 4. SAVED LOOKS (User-Specific Bookmarks)
// ==========================================

apiRouter.get('/saved-looks', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const looks = auraStore.getSavedLooks(userId);
    return sendSuccess(res, looks);
  } catch (err) {
    return sendError(res, 'FETCH_FAILED', 'Unable to retrieve saved looks.', 500);
  }
});

apiRouter.get('/saved-looks/ids', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const ids = auraStore.getSavedLookIds(userId);
    return sendSuccess(res, ids);
  } catch (err) {
    return sendError(res, 'FETCH_FAILED', 'Unable to retrieve saved look IDs.', 500);
  }
});

apiRouter.post('/saved-looks', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const lookData = req.body;
    if (!lookData || (!lookData.id && !lookData.lookId && !lookData.title)) {
      return sendError(res, 'INVALID_LOOK', 'Valid look data is required to save.');
    }

    const saved = auraStore.saveLook(userId, lookData);
    return sendSuccess(res, saved, 201);
  } catch (err: any) {
    return sendError(res, 'SAVE_FAILED', err.message || 'Failed to save look.', 500);
  }
});

apiRouter.post('/saved-looks/toggle', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const lookData = req.body;
    if (!lookData || (!lookData.id && !lookData.lookId)) {
      return sendError(res, 'INVALID_LOOK', 'Look ID is required to toggle save status.');
    }

    const result = auraStore.toggleSaveLook(userId, lookData);
    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, 'TOGGLE_FAILED', err.message || 'Failed to toggle saved look.', 500);
  }
});

apiRouter.delete('/saved-looks/:id', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    auraStore.deleteSavedLook(userId, req.params.id);
    return sendSuccess(res, { deleted: true, id: req.params.id });
  } catch (err: any) {
    return sendError(res, 'DELETE_FAILED', err.message || 'Failed to delete look.', 500);
  }
});

// ==========================================
// 5. VISUAL BRIEFS
// ==========================================

apiRouter.post('/visual-briefs', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const user = auraStore.getUser(userId);
    const {
      customerRequest,
      personalizedLook,
      referenceImages,
      outfitNotes,
      occasion,
      requestedServices,
      makeupDirectives,
      hairDirectives,
      nailDirectives,
      jewelryDirectives,
      specialDirectives
    } = req.body;

    if (!personalizedLook) {
      return sendError(res, 'MISSING_DATA', 'Personalized look is required to generate visual brief.');
    }

    const brief = auraStore.createVisualBrief({
      userId,
      userName: user?.name || 'AURA Client',
      customerRequest: customerRequest || 'Personalized Look Consultation',
      personalizedLook,
      referenceImages,
      outfitNotes,
      occasion: occasion || personalizedLook.occasion || 'Special Celebration',
      requestedServices: requestedServices || personalizedLook.services || [],
      makeupDirectives: makeupDirectives || `${personalizedLook.makeup?.style}: ${personalizedLook.makeup?.eyes}, ${personalizedLook.makeup?.lips}`,
      hairDirectives: hairDirectives || `${personalizedLook.hair?.style} (${personalizedLook.hair?.finish})`,
      nailDirectives: nailDirectives || `${personalizedLook.nails?.style} in ${personalizedLook.nails?.color}`,
      jewelryDirectives: jewelryDirectives || personalizedLook.jewelry?.pairing || 'Complementary fine jewelry',
      specialDirectives,
      status: 'active'
    });

    return sendSuccess(res, brief, 201);
  } catch (err: any) {
    return sendError(res, 'BRIEF_FAILED', err.message || 'Failed to generate visual brief.', 500);
  }
});

apiRouter.get('/visual-briefs/:id', (req: Request, res: Response) => {
  try {
    const brief = auraStore.getVisualBrief(req.params.id);
    if (!brief) {
      return sendError(res, 'NOT_FOUND', 'Visual brief not found.', 404);
    }
    return sendSuccess(res, brief);
  } catch (err) {
    return sendError(res, 'FETCH_FAILED', 'Failed to retrieve visual brief.', 500);
  }
});

// ==========================================
// 6. MY AURA & USER PROFILE
// ==========================================

apiRouter.get('/my-aura', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const user = auraStore.getOrCreateUser(userId);

    const savedLooks = auraStore.getSavedLooks(userId);
    const favoriteIds = auraStore.getFavorites(userId);
    const favoriteProfessionals = favoriteIds.map(id => auraStore.professionals.get(id)).filter(Boolean);
    const bookings = auraStore.getBookings(userId);
    const pointsHistory = auraStore.pointsHistory.get(userId) || [];

    return sendSuccess(res, {
      user,
      savedLooks,
      favoriteProfessionals,
      bookings,
      pointsHistory,
      discoverLooks: SEED_DISCOVER_LOOKS
    });
  } catch (err) {
    return sendError(res, 'FETCH_FAILED', 'Unable to retrieve My AURA data.', 500);
  }
});

apiRouter.post('/favorites', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { professionalId } = req.body;
    if (!professionalId) {
      return sendError(res, 'MISSING_ID', 'Professional ID is required.');
    }

    const result = auraStore.toggleFavorite(userId, professionalId);
    return sendSuccess(res, result);
  } catch (err: any) {
    return sendError(res, 'FAVORITE_FAILED', err.message || 'Failed to update favorites.', 500);
  }
});

apiRouter.put('/user/preferences', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { preferences } = req.body;
    const updated = auraStore.updateUser(userId, { preferences });
    return sendSuccess(res, updated.preferences);
  } catch (err: any) {
    return sendError(res, 'UPDATE_FAILED', err.message || 'Failed to update preferences.', 500);
  }
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { professionalId, bookingId, rating, reviewText, service } = req.body;

    if (!professionalId || !bookingId || !rating || !reviewText) {
      return sendError(res, 'INVALID_REVIEW', 'Professional ID, verified booking ID, rating, and review text are required.');
    }

    const review = auraStore.createReview(userId, {
      professionalId,
      bookingId,
      rating: Number(rating),
      reviewText,
      service: service || 'Bridal & Styling Service'
    });

    return sendSuccess(res, review, 201);
  } catch (err: any) {
    return sendError(res, 'REVIEW_REJECTED', err.message || 'Only verified clients with completed bookings can review this artisan.', 400);
  }
});

// ==========================================
// 7. DISCOVER LOOKS SEED
// ==========================================

apiRouter.get('/discover', (req: Request, res: Response) => {
  return sendSuccess(res, SEED_DISCOVER_LOOKS);
});

// ==========================================
// 8. COMMUNITY LOOKS & LOOKBOOK
// ==========================================

apiRouter.get('/community', (req: Request, res: Response) => {
  const communityLooks = auraStore.getCommunityLooks();
  return sendSuccess(res, communityLooks);
});

apiRouter.get('/community/:id', (req: Request, res: Response) => {
  const look = auraStore.getLookById(req.params.id);
  if (!look) {
    return sendError(res, 'NOT_FOUND', 'Community look not found.', 404);
  }
  return sendSuccess(res, look);
});

apiRouter.post('/community/looks', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const lookData = req.body;
  if (!lookData || !lookData.title) {
    return sendError(res, 'INVALID_LOOK', 'Look data with title is required.', 400);
  }
  const published = auraStore.publishToCommunity(userId, lookData);
  return sendSuccess(res, published, 201);
});
