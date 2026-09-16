import { Professional, StructuredLook } from '../src/types/aura';

export const SEED_PROFESSIONALS: Professional[] = [
  {
    id: 'priya_sharma',
    name: 'Priya Sharma',
    tagline: 'Celebrity Makeup Master & Heritage Bridal Couturier',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    location: 'Mumbai & Delhi NCR',
    citiesCovered: ['Mumbai', 'Delhi NCR', 'Destination Weddings'],
    atHomeCoverageAreas: [
      'South Delhi (Greater Kailash, Vasant Vihar, Defence Colony)',
      'Gurugram (DLF Phase 1-5, Golf Course Rd)',
      'Bandra West & Juhu, Mumbai',
      'Worli & Altamount Road, Mumbai'
    ],
    specialization: 'Bridal Couture & Soft Glam Radiance',
    services: [
      {
        id: 'ps_serv_1',
        name: 'Signature Royal Bridal Couture',
        category: 'makeup',
        price: 28000,
        durationMinutes: 180,
        description: 'Bespoke HD bridal makeup, 24K gold skin hydration prep, custom lash architecture, setting for high-heat mandap lighting.'
      },
      {
        id: 'ps_serv_2',
        name: 'Modern Minimalist Sangeet Glam',
        category: 'makeup',
        price: 16000,
        durationMinutes: 90,
        description: 'Dewy champagne eyes, feathered kohl, long-wear matte terracotta lips with satin skin highlight.'
      },
      {
        id: 'ps_serv_3',
        name: 'Cocktail & Reception Radiant Airbrush',
        category: 'makeup',
        price: 12500,
        durationMinutes: 75,
        description: 'Micro-fine waterproof airbrush base, sculpted cheekbones, monochromatic bronze hues.'
      },
      {
        id: 'ps_serv_4',
        name: 'Pre-Event Glow Prep & Consultation',
        category: 'skin',
        price: 6500,
        durationMinutes: 60,
        description: 'Lymphatic drainage massage, collagen hydro-infusion and personalized look trial blueprint.'
      }
    ],
    pricingTier: '₹₹₹ Luxury Artisanal',
    basePrice: 12500,
    portfolio: [
      {
        id: 'p1',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
        title: 'Pastel Rose Gold Sangeet Bride',
        category: 'Bridal Soft Glam',
        styleTags: ['Soft Glam', 'Champagne Shimmer', 'Dewy Skin', 'Subtle Kohl'],
        occasion: 'Sangeet'
      },
      {
        id: 'p2',
        imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop',
        title: 'Crimson Velvet Heritage Mandap',
        category: 'Traditional Bridal',
        styleTags: ['Heritage Red Lip', 'Smoked Wing', 'Matte Velvet', 'Polki Match'],
        occasion: 'Pheras / Wedding'
      },
      {
        id: 'p3',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        title: 'Modern Minimalist Reception Dew',
        category: 'Reception Glam',
        styleTags: ['Glass Skin', 'Terracotta Nude', 'Glow Glaze'],
        occasion: 'Reception'
      },
      {
        id: 'p4',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
        title: 'Boho Cocktail Bronzed Goddess',
        category: 'Cocktail',
        styleTags: ['Bronze Smoky', 'Nude Gloss', 'Lifted Brows'],
        occasion: 'Cocktail'
      }
    ],
    availability: ['10:00 AM', '12:30 PM', '03:00 PM', '06:00 PM'],
    rating: 4.96,
    reviewsCount: 342,
    auraPointsReward: 250,
    auraPointsMultiplier: 2.0,
    homeService: true,
    verified: true,
    badges: ['AURA Verified Master', 'Top Tier Bridal 2026', 'At-Home Priority', 'AURA Points Preferred'],
    description: 'Trained under global runway cosmetologists in Paris and Mumbai, Priya Sharma balances time-honored Indian royal heritage with effortless modern skin-first beauty.',
    instagramHandle: '@priyasharmamakeup'
  },
  {
    id: 'ananya_roy',
    name: 'Ananya Roy',
    tagline: 'Architectural Hair Sculptor & Texture Virtuoso',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop',
    location: 'Mumbai & Bengaluru',
    citiesCovered: ['Mumbai', 'Bengaluru', 'Goa'],
    atHomeCoverageAreas: ['Bandra', 'Khar', 'Indiranagar', 'Koramangala'],
    specialization: 'High-Volume Waves & Floral Braids',
    services: [
      {
        id: 'ar_serv_1',
        name: 'Old-Hollywood Polished Waves with Micro-Volume',
        category: 'hair',
        price: 8500,
        durationMinutes: 75,
        description: 'Precision thermal contouring, humidity shield glaze, seamless clip-in extensions blending.'
      },
      {
        id: 'ar_serv_2',
        name: 'Heritage Jasmine Fishtail Braid with Pearl Pins',
        category: 'hair',
        price: 9500,
        durationMinutes: 90,
        description: 'Textured regal Indian braid with fresh mogra or baby breath wire placement.'
      },
      {
        id: 'ar_serv_3',
        name: 'Messy French Bun with Tendril Framing',
        category: 'hair',
        price: 7000,
        durationMinutes: 60,
        description: 'Effortless textured bridal updo suited for heavy dupatta pinning.'
      }
    ],
    pricingTier: '₹₹ Premium',
    basePrice: 7000,
    portfolio: [
      {
        id: 'ar1',
        imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop',
        title: 'Cascading Gloss Glam Waves',
        category: 'Hair Styling',
        styleTags: ['Hollywood Waves', 'Gloss Finish', 'Volume Boost'],
        occasion: 'Sangeet'
      },
      {
        id: 'ar2',
        imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop',
        title: 'Pearl Embellished Textured Chignon',
        category: 'Bridal Bun',
        styleTags: ['Pearl Accents', 'Dupatta Anchor', 'Regal'],
        occasion: 'Wedding'
      }
    ],
    availability: ['11:00 AM', '01:30 PM', '04:00 PM', '07:00 PM'],
    rating: 4.92,
    reviewsCount: 189,
    auraPointsReward: 150,
    auraPointsMultiplier: 1.5,
    homeService: true,
    verified: true,
    badges: ['AURA Master Hairstylist', 'Bridal Texture Specialist'],
    description: 'Ananya redefines modern Indian hair architecture, specializing in humidity-proof holds that dance effortlessly from sunset till morning.',
    instagramHandle: '@ananyaroyhair'
  },
  {
    id: 'rajesh_patel',
    name: 'Rajesh Patel',
    tagline: 'Clinical Dermal Radiance & Facial Lymphatic Artisan',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    location: 'Delhi NCR',
    citiesCovered: ['Delhi NCR', 'Noida', 'Gurugram'],
    atHomeCoverageAreas: ['Vasant Kunj', 'Chanakyapuri', 'Golf Links', 'DLF Phase 4'],
    specialization: 'Pre-Event Glass Skin & Micro-Circulation Prep',
    services: [
      {
        id: 'rp_serv_1',
        name: 'Gua Sha Lymphatic Sculpt & Dermal Hydration',
        category: 'skin',
        price: 6000,
        durationMinutes: 60,
        description: 'Deep de-puffing facial contouring, peptide cryo-therapy, and radiance plumping base.'
      },
      {
        id: 'rp_serv_2',
        name: '24K Gold & Saffron Cellular Radiance Ritual',
        category: 'skin',
        price: 8500,
        durationMinutes: 80,
        description: 'Ayurvedic bio-active luxury infusion for illuminated skin prior to high-definition cameras.'
      }
    ],
    pricingTier: '₹₹ Premium',
    basePrice: 6000,
    portfolio: [
      {
        id: 'rp1',
        imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f5be6bc6a41?q=80&w=800&auto=format&fit=crop',
        title: 'Glass Dew Base Preparation',
        category: 'Skin Prep',
        styleTags: ['Glass Skin', 'Lymphatic Sculpt', 'Radiance'],
        occasion: 'All Occasions'
      }
    ],
    availability: ['09:30 AM', '12:00 PM', '02:30 PM', '05:00 PM'],
    rating: 4.89,
    reviewsCount: 145,
    auraPointsReward: 120,
    auraPointsMultiplier: 1.2,
    homeService: true,
    verified: true,
    badges: ['Skin Radiance Expert', 'Cruelty Free'],
    description: 'Certified dermal therapist focusing on immediate canvas preparation so makeup glides seamlessly without cake or crease.',
    instagramHandle: '@rajeshpateldermal'
  },
  {
    id: 'meera_sen',
    name: 'Meera Sen',
    tagline: 'Fine Art Nail Couturier & Gold Leaf Artisan',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    coverPhoto: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=1200&auto=format&fit=crop',
    location: 'Mumbai',
    citiesCovered: ['Mumbai', 'Thane', 'Navi Mumbai'],
    atHomeCoverageAreas: ['Juhu', 'Bandra West', 'Colaba', 'Khar'],
    specialization: 'Glazed Chrome & Hand-Painted Mehendi Tips',
    services: [
      {
        id: 'ms_serv_1',
        name: 'Haute Glazed Chrome Oyster Gel Extensions',
        category: 'nails',
        price: 4500,
        durationMinutes: 90,
        description: 'Sculpted soft almond shapes, iridescent chrome glaze, micro-crystal cuticle cuffs.'
      },
      {
        id: 'ms_serv_2',
        name: 'Bridal 24K Gold Leaf & Henna Motif Tips',
        category: 'nails',
        price: 5500,
        durationMinutes: 105,
        description: 'Custom miniature bridal motifs matching your lehenga border and jewelry gold hue.'
      }
    ],
    pricingTier: '₹ Artisanal',
    basePrice: 4500,
    portfolio: [
      {
        id: 'ms1',
        imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
        title: 'Oyster Pearl Glaze Extensions',
        category: 'Nail Couture',
        styleTags: ['Chrome', 'Almond Shape', 'Minimalist Luxury'],
        occasion: 'Reception'
      }
    ],
    availability: ['11:30 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
    rating: 4.95,
    reviewsCount: 210,
    auraPointsReward: 100,
    homeService: true,
    verified: true,
    badges: ['Nail Artist of the Year', 'Handmade Detail'],
    description: 'Meera blends fine jewelry aesthetics with structural gel enhancement to create hand jewelry in nail form.',
    instagramHandle: '@meerasennails'
  }
];

export const SEED_DISCOVER_LOOKS: StructuredLook[] = [
  {
    id: 'look_ivory_dew',
    creatorId: 'usr_radhika_merchant',
    creatorName: 'Radhika Merchant',
    creatorPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    title: 'Ivory Saree & Gilded Dew',
    caption: 'Bridal HD Makeup • Hair Sculpt • Mogra Setting & Kundan Jewelry Styling. Humidity-proof finish with radiant veil.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCZrKi2SgazJYCPoYXcYkVl-H3MYrehpYHHgjmDF1PBEuYALZFWU6AZ9dCs7vLh5nkfo1an5lVqSfbHcbHEteOlB_9724gcJ2hgXK312VAAE1lQ55vqEEvTJkDfuOzTrhA1TWFWnOlJyMBlmUr9JN_yunnJrI0h6KVvREFvoYqIwwo5wkfZnNbYDX1LfvQ4vb39PjLmyWxdec2YNswqG-vbNHkeem7ddMR552DdpB7vQnmtvKlpOfRVw',
    referenceImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCZrKi2SgazJYCPoYXcYkVl-H3MYrehpYHHgjmDF1PBEuYALZFWU6AZ9dCs7vLh5nkfo1an5lVqSfbHcbHEteOlB_9724gcJ2hgXK312VAAE1lQ55vqEEvTJkDfuOzTrhA1TWFWnOlJyMBlmUr9JN_yunnJrI0h6KVvREFvoYqIwwo5wkfZnNbYDX1LfvQ4vb39PjLmyWxdec2YNswqG-vbNHkeem7ddMR552DdpB7vQnmtvKlpOfRVw'
    ],
    aestheticMatch: '98%',
    price: '₹3,500',
    occasion: 'Bridal Guest / Reception',
    overallStyle: 'Ivory Saree & Gilded Dew',
    makeup: {
      style: 'Radiant Soft Glam',
      eyes: 'Champagne liquid shimmer with soft diffused chocolate brown kohl and winged flutter lashes',
      lips: 'Nude terracotta satin velvet with muted chestnut lip contour',
      finish: 'Dewy luminous with micro-pearl glass skin cheek glaze',
      colors: 'Champagne, Warm Bronze, Rose Gold, Terracotta'
    },
    hair: {
      style: 'Glossy Hollywood waves with deep side parting',
      length: 'Mid-back cascading with flexible texture',
      finish: 'Ultra-gloss anti-humidity shield'
    },
    nails: {
      style: 'Almond soft sculpted gel tips',
      color: 'Glazed oyster chrome with rose-tint base'
    },
    grooming: {
      brows: 'Feathered full natural arches with tinted fiber hold',
      skinPrep: 'Hydrating peptide glow base and lymphatic de-puff'
    },
    skin: {
      prep: 'Cryo-cooling lymphatic de-puff and peptide moisture lock',
      aesthetic: 'Seamless glass reflection'
    },
    jewelry: {
      pairing: 'Uncut Polki choker with mint droplet tourmaline and minimalist stud drops',
      metals: '22k Champagne Gold'
    },
    outfit: {
      harmony: 'Complements shimmering ivory, blush or sage lehengas with mirror work',
      palette: 'Blush pink, champagne gold, sage mint'
    },
    services: [
      'Bridal HD Makeup',
      'Hair Sculpt',
      'Mogra Setting & Kundan Jewelry Styling'
    ],
    notes: 'Curated for high-energy Sangeet dancing with humidity-resistant setting techniques.'
  },
  {
    id: 'look_bronze_chignon',
    creatorId: 'usr_kavya_sethi',
    creatorName: 'Kavya Sethi',
    creatorPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    title: 'Contemporary Chignon & Bronze Smoke',
    caption: 'Soft Bronze Glam • Architectural Low Bun • Minimalist Pearl Detailing. Airbrushed radiance crafted for Indo-Western styling.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLSBMBLEh7ECudfa-3JMCj-nxzCPmgRj6_abDjyVpUcho7u6VxN_R-85GFruaYbSuCZzh6QbZ76gJY57cwFQOtxb78cajX76sYRct0ekQYbUpF1XTMl16vy4ewyN31eo6pTzHdHd_fnGRPuXdNQvkPbXmlYvErTmsGGY8QorFuGEFXo1NBIf3rGyeWKPuwwTx3Vy_F7FGMqTWMcMWl5BSd_Wf8IIvuMLjPAZ0nPvLX7ewZNP0AxIMKUw',
    referenceImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLSBMBLEh7ECudfa-3JMCj-nxzCPmgRj6_abDjyVpUcho7u6VxN_R-85GFruaYbSuCZzh6QbZ76gJY57cwFQOtxb78cajX76sYRct0ekQYbUpF1XTMl16vy4ewyN31eo6pTzHdHd_fnGRPuXdNQvkPbXmlYvErTmsGGY8QorFuGEFXo1NBIf3rGyeWKPuwwTx3Vy_F7FGMqTWMcMWl5BSd_Wf8IIvuMLjPAZ0nPvLX7ewZNP0AxIMKUw'
    ],
    aestheticMatch: '95%',
    price: '₹2,200',
    occasion: 'Cocktail / Sangeet',
    overallStyle: 'Contemporary Chignon & Bronze Smoke',
    makeup: {
      style: 'Heritage Regal Velvet',
      eyes: 'Intense smoked kohl waterline with warm copper-gold cut crease and dramatic bridal lash fan',
      lips: 'Rich deep vermillion rose with velvet matte finish',
      finish: 'Flawless camera-proof matte-radiant hybrid base',
      colors: 'Antique Gold, Deep Rose Vermillion, Warm Saffron'
    },
    hair: {
      style: 'Regal architectural braided bun with fresh Mogra wrap and concealed dupatta anchor',
      length: 'Braided updo',
      finish: 'Structured all-day hold'
    },
    nails: {
      style: 'Square rounded sculpted tips',
      color: 'Deep crimson with micro 24k gold leaf cuff'
    },
    grooming: {
      brows: 'Clean defined regal arch',
      skinPrep: '24K gold cellular infusion'
    },
    skin: {
      prep: 'Deep hydration barrier repair',
      aesthetic: 'Velveteen porcelain radiance'
    },
    jewelry: {
      pairing: 'Heavy Kundan and Basra pearl haar with matching mathapatti and nath',
      metals: 'Antique Yellow Gold'
    },
    outfit: {
      harmony: 'Traditional crimson or deep maroon zardozi velvet bridal lehenga',
      palette: 'Sindoor red, antique gold, emerald green'
    },
    services: [
      'Soft Bronze Glam',
      'Architectural Low Bun',
      'Minimalist Pearl Detailing'
    ],
    notes: 'Designed specifically to withstand holy sacred fire mandap temperatures.'
  },
  {
    id: 'look_bombay_sunset',
    creatorId: 'usr_zara_shroff',
    creatorName: 'Zara Shroff',
    creatorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    title: 'Bombay Sunset Cocktail Dew',
    caption: 'High-impact glass dew on cheekbones, smudged bronze espresso wash, and sleek center-parted hair.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvJaJJ3tPWyQ7A86Qq7w0G9_JEaJ393B7sK96kSO3uJRVc-LCGSsXL0plIZ7b_Fu_Tt2p1cIvLbR5kXWHvTUoEDBzSMNImdZ-XmCLX_eH85tMWXlKwgp7ER_MXQ5BEhXsdlc7Cj7Aqz1v80GK21kx14xHNZCu70diFsW6N0eoJYD17Kj8HB1895qQBMRbvH3c-RFtm9oFijFbNWZMig8ckp_Kk1E83UBwzPGj4OEdkjTJA6ISY4IrMRw',
    referenceImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvJaJJ3tPWyQ7A86Qq7w0G9_JEaJ393B7sK96kSO3uJRVc-LCGSsXL0plIZ7b_Fu_Tt2p1cIvLbR5kXWHvTUoEDBzSMNImdZ-XmCLX_eH85tMWXlKwgp7ER_MXQ5BEhXsdlc7Cj7Aqz1v80GK21kx14xHNZCu70diFsW6N0eoJYD17Kj8HB1895qQBMRbvH3c-RFtm9oFijFbNWZMig8ckp_Kk1E83UBwzPGj4OEdkjTJA6ISY4IrMRw'
    ],
    aestheticMatch: '97%',
    price: '₹2,800',
    occasion: 'Cocktail / Welcome Party',
    overallStyle: 'Bombay Sunset Cocktail Dew',
    makeup: {
      style: 'Modern Bronzed Glass',
      eyes: 'Smudged bronze espresso wash with wet-look gloss lid and clean separated lashes',
      lips: 'Glossy 90s nude with cocoa lip liner',
      finish: 'High-impact glass dew on cheekbones, collarbones and temple',
      colors: 'Espresso, Warm Copper, Caramel, Glazed Cocoa'
    },
    hair: {
      style: 'Sleek glass straight parted in the center tucked behind ears',
      length: 'Long waist-length shine',
      finish: 'Liquid mirror glass shine'
    },
    nails: {
      style: 'Coffin edge nude chrome',
      color: 'Espresso nude with chrome sheen'
    },
    grooming: {
      brows: 'Soap brows brushed upward',
      skinPrep: 'Ceramide barrier glaze'
    },
    skin: {
      prep: 'Gua sha facial sculpt',
      aesthetic: 'Hyper-dewy'
    },
    jewelry: {
      pairing: 'Contemporary emerald baguette ear-cuffs with modern diamond solitaire ring',
      metals: 'Platinum / White Gold'
    },
    outfit: {
      harmony: 'Metallic metallic saree gown or modern structured drape silhouette',
      palette: 'Gunmetal, bronze, midnight black'
    },
    services: [
      'Cocktail & Reception Radiant Airbrush',
      'Messy French Bun with Tendril Framing',
      'Haute Glazed Chrome Oyster Gel Extensions'
    ],
    notes: 'Sleek international party aesthetic with an effortless Mumbai beach club vibe.'
  },
  {
    id: 'look_pastel_kundan',
    creatorId: 'usr_ananya_roy',
    creatorName: 'Dr. Ananya Roy',
    creatorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    title: 'Pastel Saree & Kundan Harmony',
    caption: 'HD Satin Luminous finish with Rosewood Satin Glaze lips, textured low chignon, and 22k gold Kundan pairing.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA',
    referenceImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPwyMPQ14shbk7YzdSKBfOQSWOF3LJG2-PWZXDmybRaABNUYEpsDB8EP22xYKEZHRCCltvZd4_C7HKWYFy5QgzulDfDl5aysBjVrMLFpv0UiW2mblJ3mRlzDU0_o9SfQCsp7BDl1E6NU1oFSHLr6_8IT62iCVrB3pXHkoQIaW8s1LVvyZ8ZHY9xJrAp4i1bYsQBZGmtuRrMfh1oS1kqJtFOFQxmPmmBgNnjR3jj0sKbNq8BpEmLgkQJA'
    ],
    aestheticMatch: '96%',
    price: '₹3,200',
    occasion: "Friend's Wedding Reception • Evening",
    overallStyle: 'Pastel Saree & Kundan Harmony',
    makeup: {
      style: 'HD Satin Luminous',
      finish: 'Hydra Silk Dew (Warm Olive #03)',
      eyes: 'Bronze tightline & micro-clusters',
      lips: 'Rosewood Satin Glaze (Ref: V-108)',
      colors: 'Ivory, Rosewood, Soft Champagne'
    },
    hair: {
      style: 'Textured Low Chignon & Flora',
      length: 'Mid-Back',
      finish: 'Anti-humidity gloss & tender face tendrils'
    },
    nails: {
      style: 'Almond Mother-of-Pearl',
      color: 'Champagne'
    },
    grooming: {},
    skin: {},
    jewelry: {
      pairing: '22k Gold Kundan & Basra Pearls'
    },
    outfit: {},
    services: ['Bridal Guest HD Makeup', 'Hair Artistry', 'Saree Draping'],
    notes: 'Classic pastel pairing for grand reception halls.'
  }
];
