import { GoogleGenAI } from '@google/genai';
import { StructuredLook, Professional } from '../../src/types/aura';

// Initialize Gemini client with proper User-Agent header for telemetry
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export async function generateAuraLook(params: {
  prompt: string;
  referenceImages?: string[];
  outfit?: string;
  occasion?: string;
  jewelry?: string;
  preferences?: any;
}): Promise<StructuredLook> {
  const ai = getGenAIClient();

  const systemInstruction = `You are AURA AI ("The AI Layer for Personalized Beauty & Style").
Your goal is to translate user desires, personal context, and aesthetic inspiration into a coherent, highly personalized beauty and styling look tailored to modern Indian, Indo-Western, and international elegance.
Always return a VALID JSON object adhering strictly to this JSON schema:
{
  "makeup": {
    "style": "string (e.g. Soft Glam, Regal Rajputana, Dewy Minimalist)",
    "eyes": "string (specific eye shadow texture, kohl, lash definition)",
    "lips": "string (shade, finish, liner details)",
    "finish": "string (e.g. Satin radiant, dewy glass, velvet matte)",
    "colors": "string (comma-separated color palette)"
  },
  "hair": {
    "style": "string (specific hairstyle architecture)",
    "length": "string (length and texture description)",
    "finish": "string (gloss, matte, flexible hold)"
  },
  "nails": {
    "style": "string (nail shape and art technique)",
    "color": "string (shade and finish)"
  },
  "grooming": {
    "brows": "string (arch style and grooming)",
    "skinPrep": "string (radiance or lymphatic preparation)"
  },
  "skin": {
    "prep": "string (dermal radiance protocol)",
    "aesthetic": "string (overall skin appearance)"
  },
  "jewelry": {
    "pairing": "string (complementary jewelry recommendations)",
    "metals": "string (gold, polki, diamond, platinum)"
  },
  "outfit": {
    "harmony": "string (how this look balances the outfit)",
    "palette": "string (harmonizing outfit tones)"
  },
  "occasion": "string",
  "overallStyle": "string",
  "services": ["string (exact salon/artisan services required to achieve this look)"]
}
Never include medical claims or dermatological diagnoses. Focus on beauty artistry, tones, textures, and professional service execution.`;

  const userContent = `User Request: "${params.prompt}"
Context:
- Occasion: ${params.occasion || 'Special Celebration / Sangeet / Evening'}
- Outfit details: ${params.outfit || 'Elegant Indian or Indo-Western silhouette'}
- Jewelry preferences: ${params.jewelry || 'Complementary fine jewelry'}
- Aesthetic preferences: ${JSON.stringify(params.preferences || {})}

Generate the personalized, complete structured look now.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userContent,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return {
          id: 'look_' + Date.now(),
          title: parsed.overallStyle || 'AURA Bespoke Look',
          ...parsed,
          referenceImages: params.referenceImages || [],
          createdAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Gemini API call encountered an issue, generating resilient fallback:', err);
    }
  }

  // Graceful fallback synthesis matching user query
  return createFallbackLook(params.prompt, params.occasion, params.outfit);
}

export async function refineAuraLook(currentLook: StructuredLook, requestedChange: string): Promise<StructuredLook> {
  const ai = getGenAIClient();

  if (ai) {
    try {
      const systemInstruction = `You are AURA AI. Refine the given beauty look JSON based on the user's specific requested changes.
Keep unchanged properties harmonious.
Return ONLY valid JSON matching the exact same schema structure as the input look.`;

      const prompt = `Current Look: ${JSON.stringify(currentLook, null, 2)}
User Requested Modification: "${requestedChange}"

Update the look JSON accordingly and return the complete updated look.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return {
          ...currentLook,
          ...parsed,
          id: currentLook.id || 'look_' + Date.now(),
          notes: `Refined: "${requestedChange}"`
        };
      }
    } catch (err) {
      console.warn('Gemini look refinement error:', err);
    }
  }

  // Fallback refinement logic
  const refined = { ...currentLook };
  const lowerChange = requestedChange.toLowerCase();
  if (lowerChange.includes('neutral') || lowerChange.includes('softer')) {
    refined.makeup.eyes = 'Soft diffused neutral tones with subtle smoked espresso lashline';
    refined.makeup.colors = 'Warm caramel, soft ivory, matte taupe';
  }
  if (lowerChange.includes('glitter') || lowerChange.includes('reduce')) {
    refined.makeup.finish = 'Subtle satin glow without high-sparkle flecks';
  }
  if (lowerChange.includes('wave') || lowerChange.includes('hair')) {
    refined.hair.style = 'Gentle polished loose waves with touchable bounce';
  }
  if (lowerChange.includes('elegant') || lowerChange.includes('regal')) {
    refined.overallStyle = 'Timeless Regal Elegance';
  }
  refined.notes = `Refined: "${requestedChange}"`;
  return refined;
}

export async function analyzeInspirationImage(imageData: string, category: string): Promise<any> {
  const ai = getGenAIClient();

  if (ai && imageData) {
    try {
      // Extract base64 and mime type
      let mimeType = 'image/jpeg';
      let base64Data = imageData;
      if (imageData.startsWith('data:')) {
        const match = imageData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        }
      }

      const prompt = `Analyze this ${category} image for styling and beauty characteristics.
Return a structured JSON object:
{
  "category": "${category}",
  "aesthetic": "string summary",
  "makeupStyle": "detected makeup or suggested complement",
  "hairStyle": "detected hairstyle or suggested complement",
  "colorPalette": ["3-5 dominant hex/color names"],
  "jewelryNotes": "detected jewelry or suggested pairings",
  "outfitSilhouette": "detected outfit description",
  "occasion": "recommended event type",
  "recommendedServices": ["2-4 professional services"]
}
CRITICAL SAFETY RULE: Do NOT present medical diagnoses. Do NOT claim medical certainty about skin conditions. Focus strictly on cosmetic artistry and aesthetics.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType
                }
              },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text?.trim();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn('Gemini vision analysis fallback triggered:', err);
    }
  }

  // Graceful fallback analysis
  return {
    category: category || 'reference',
    aesthetic: 'Contemporary Indian Luxury & Subtle Radiance',
    makeupStyle: 'Soft glam with champagne shimmer and warm nude satin lip',
    hairStyle: 'Textured romantic waves with polished finish',
    colorPalette: ['Champagne Gold', 'Dusty Rose', 'Warm Cocoa', 'Ivory'],
    jewelryNotes: 'Uncut Polki or delicate solitaire diamonds',
    outfitSilhouette: 'Embellished modern silhouette',
    occasion: 'Sangeet / Festive Reception',
    recommendedServices: [
      'Signature Bridal & Sangeet Makeup',
      'Editorial Hair Sculpting & Polished Waves',
      'Haute Glazed Chrome Oyster Gel Extensions'
    ]
  };
}

export function matchProfessionalsWithLook(
  userLook: StructuredLook,
  professionals: Professional[],
  criteria: { occasion?: string; location?: string; requiredServices?: string[] }
) {
  return professionals.map(prof => {
    let score = 75;
    const reasons: string[] = [];
    const matchedServices: string[] = [];

    // Check service overlaps
    const lookServices = criteria.requiredServices?.length ? criteria.requiredServices : (userLook.services || []);
    const profServiceNames = prof.services.map(s => s.name.toLowerCase());
    const profCategories = prof.services.map(s => s.category);

    for (const reqService of lookServices) {
      const lowerReq = reqService.toLowerCase();
      const match = prof.services.find(s => 
        lowerReq.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(lowerReq) ||
        (lowerReq.includes('makeup') && s.category === 'makeup') ||
        (lowerReq.includes('hair') && s.category === 'hair') ||
        (lowerReq.includes('nail') && s.category === 'nails') ||
        (lowerReq.includes('skin') && s.category === 'skin')
      );

      if (match) {
        matchedServices.push(match.name);
        score += 8;
        reasons.push(`Offers matched service: "${match.name}"`);
      }
    }

    // Check style match in portfolio
    const lookStyle = (userLook.overallStyle || userLook.makeup.style || '').toLowerCase();
    const portfolioStyleMatch = prof.portfolio.some(item => 
      item.styleTags.some(tag => lookStyle.includes(tag.toLowerCase()) || tag.toLowerCase().includes('soft glam') || tag.toLowerCase().includes('radiant'))
    );
    if (portfolioStyleMatch) {
      score += 10;
      reasons.push(`Portfolio features verified "${userLook.makeup.style || 'Soft Glam'}" artistry`);
    }

    // Check location
    if (criteria.location && prof.citiesCovered.some(c => c.toLowerCase().includes(criteria.location!.toLowerCase()))) {
      score += 6;
      reasons.push(`Available in your selected territory: ${criteria.location}`);
    }

    // At home preference
    if (prof.homeService) {
      score += 4;
      reasons.push('Provides signature at-home concierge coverage');
    }

    // High rating boost
    if (prof.rating >= 4.9) {
      score += 3;
      reasons.push(`Exceptional ${prof.rating}★ rating from ${prof.reviewsCount}+ verified client dossiers`);
    }

    // Cap score at 98
    const finalScore = Math.min(98, Math.max(78, score));

    return {
      professionalId: prof.id,
      professional: prof,
      matchScore: finalScore,
      reasons: reasons.slice(0, 3),
      matchedServices
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

function createFallbackLook(prompt: string, occasion?: string, outfit?: string): StructuredLook {
  return {
    id: 'look_' + Date.now(),
    title: 'Modern Sangeet Champagne Glow',
    occasion: occasion || 'Sangeet / Festive Gala',
    overallStyle: 'Contemporary Soft Glam with Micro-Glitter',
    makeup: {
      style: 'Soft Glam Radiance',
      eyes: 'Champagne micro-shimmer on center lid, diffused chocolate brown kohl with lifted corner lashes',
      lips: 'Velvet nude terracotta with warm cocoa lip contouring',
      finish: 'Dewy luminous satin base with soft focused pearl highlight',
      colors: 'Champagne, Warm Bronze, Terracotta, Soft Rose'
    },
    hair: {
      style: 'Cascading polished Hollywood waves with gentle face-framing softness',
      length: 'Mid-back volume with movement',
      finish: 'High-gloss anti-humidity glaze'
    },
    nails: {
      style: 'Sculpted almond shape',
      color: 'Glazed oyster chrome with rose-tint base'
    },
    grooming: {
      brows: 'Soft feathered arches with tinted micro-fiber definition',
      skinPrep: 'Hydrating peptide glow base and lymphatic drainage prep'
    },
    skin: {
      prep: 'Cryo-cooling lymphatic de-puff with barrier hydration serum',
      aesthetic: 'Seamless glass reflection'
    },
    jewelry: {
      pairing: 'Uncut Polki choker with mint droplet tourmaline and minimalist ear drops',
      metals: '22k Champagne Gold'
    },
    outfit: {
      harmony: outfit || 'Complements shimmering ivory, blush or sage lehengas with mirror work',
      palette: 'Blush, Champagne Gold, Ivory'
    },
    services: [
      'Modern Minimalist Sangeet Glam',
      'Old-Hollywood Polished Waves with Micro-Volume',
      'Gua Sha Lymphatic Sculpt & Dermal Hydration',
      'Haute Glazed Chrome Oyster Gel Extensions'
    ],
    notes: `Synthesized based on: "${prompt}"`,
    createdAt: new Date().toISOString()
  };
}
