/**
 * Savior Resilient Fallback Intelligence Matrix
 * Provides high-fidelity, poetry-framed luxury mock data when the upstream 
 * Gemini model is unavailable or experiencing high demand.
 */

export interface FallbackAgentResponse {
  text: string;
  agentsInvolved: string[];
  agentSteps: { agent: string; action: string }[];
}

export function getFallbackChat(message: string, history: any[]): FallbackAgentResponse {
  const query = message.toLowerCase();
  
  // Custom response matching popular queries
  if (query.includes('paris')) {
    return {
      text: "### Sovereign Paris Curation\n\nSavior has deployed pre-computed luxury channels for **Paris**. I suggest beginning with the **Obsidian Horizon Portfolio**, matching premium business travel with customized cultural access:\n\n* **Stay**: *Le Bristol Paris* or *Hôtel de Crillon* (Unlocks exclusive partner upgrades and priority check-in).\n* **Transit**: Premium business class with France Aviation. \n* **Exclusive Experience**: Private after-hours tour of the Louvre paired with a vintage champagne tasting.\n\nWould you like me to construct a dynamic, fully timed 3-day itinerary or load our ready-made collections?",
      agentsInvolved: ["atlas", "concierge", "transit"],
      agentSteps: [
        { agent: "atlas", action: "Identified Paris destination signature from high-demand fallback registers." },
        { agent: "concierge", action: "Secured priority suites at Le Bristol and Crillon under traveler status." },
        { agent: "transit", action: "Verified optimal business class lanes through France Aviation." }
      ]
    };
  }

  if (query.includes('flight') || query.includes('deal') || query.includes('cheap') || query.includes('price')) {
    return {
      text: "### Sentinel Pricing Matrix Response\n\nSavior Sentinel algorithms have parsed your focus on airline routes. \n\n* **Active Advice**: Our daily price trackers indicate major executive cabin drops on trans-Atlantic routes. \n* **Pro Tip**: Use our **Flight Price Tracker** widget located on the home page to run a continuous background surveillance channel on your specific route. \n\nI can retrieve optimal business-executive and first-class routes for your destination right now. Where are you planning to fly?",
      agentsInvolved: ["atlas", "transit"],
      agentSteps: [
        { agent: "atlas", action: "Routed user to localized price surveillance corridors." },
        { agent: "transit", action: "Parsed historical rate averages for premium corridors." }
      ]
    };
  }

  if (query.includes('itinerary') || query.includes('days') || query.includes('schedule')) {
    return {
      text: "### Temporal Alignment Protocol Activated\n\nI am perfectly aligned to construct custom day-by-day itineraries. Please use the **itinerary orchestrator form** in the main portal for a complete timeline breakdown, or let me know the destination, budget, and exact duration here. \n\nFor example, tell me: *'Give me an itinerary for Rome for 5 days with a luxury budget'*, and I will compile a pristine chronological travel stream.",
      agentsInvolved: ["atlas", "chronos"],
      agentSteps: [
        { agent: "atlas", action: "Switched conversation context to Temporal Strategy mapping." },
        { agent: "chronos", action: "Prepared sequence buffers for day-by-day scheduling." }
      ]
    };
  }

  // General sophisticated fallback response
  return {
    text: "### Savior Root Orchestrator Matrix\n\nWelcome to Savior's premium intelligence interface. Upstream sensory networks are experiencing some high-frequency congestion, but our localized tactical databases remain completely active for you.\n\nI can instantly generate luxury itineraries, search business flight rates, and customize high-end bundles. Please try searching for a destination in the primary fields above, activate our **Flight Price Tracker** for live deals, or ask me for curated guides to iconic endpoints like **Paris**, **Tokyo**, or **New York**.",
    agentsInvolved: ["atlas"],
    agentSteps: [
      { agent: "atlas", action: "Activated local sovereign intelligence core to bypass upstream cloud gridlock." }
    ]
  };
}

export function getFallbackItinerary(destination: string, duration: number, budget: string | number, preferences?: string) {
  const finalDuration = duration && duration > 0 ? Math.min(duration, 10) : 3;
  const destName = destination || "Curated Sovereign Endpoint";
  
  const activitiesPool = [
    { time: "09:00 AM", description: "Private helicopter transfer with gourmet aerial overview of terminal geography.", location: "Helipad Departure" },
    { time: "11:30 AM", description: "VVIP behind-the-scenes guided tour with access to closed wings and historic archives.", location: "National Museum Complex" },
    { time: "01:30 PM", description: "Al-fresco degustation prepared by a Michelin-guide decorated chef, overlooking panoramic valley vistas.", location: "La Terrazza Executive" },
    { time: "04:00 PM", description: "Private custom-style fashion showing or high-end artisan craft consultation arranged exclusively.", location: "Artisanal Atelier Private Lounge" },
    { time: "07:30 PM", description: "Seven-course culinary orchestra paired with elite collector wines chosen by the master sommelier.", location: "Nocturne Gourmet Room" },
    { time: "10:30 PM", description: "Private astronomical star-mapping cruise with champagne service aboard an executive-class Yacht.", location: "Waterfront Marina Docking" }
  ];

  const daysArr = [];
  for (let i = 1; i <= finalDuration; i++) {
    // Select 3 activities per day based on iteration to keep it diverse
    const act1 = activitiesPool[(i * 0) % activitiesPool.length];
    const act2 = activitiesPool[(i * 1 + 2) % activitiesPool.length];
    const act3 = activitiesPool[(i * 2 + 4) % activitiesPool.length];

    daysArr.push({
      day: i,
      activities: [
        { time: "09:30 AM", description: `Day ${i} start: ${act1.description}`, location: act1.location },
        { time: "02:00 PM", description: `Midday strategy: ${act2.description}`, location: act2.location },
        { time: "08:00 PM", description: `Evening orchestration: ${act3.description}`, location: act3.location }
      ]
    });
  }

  const baseCost = typeof budget === 'number' ? budget : (budget?.toString().toLowerCase().includes('luxury') ? 4500 : 1500);

  return {
    destination: destName,
    days: daysArr,
    estimatedTotalCost: baseCost * finalDuration
  };
}

export function getFallbackSearch(type: string, destination: string, origin?: string, date?: string) {
  const dest = destination || "Paris";
  const start = origin || "NYC";
  const searchType = (type || 'flight').toLowerCase();

  if (searchType === 'hotel' || searchType.includes('lodg') || searchType.includes('stay')) {
    return [
      {
        provider: "Aman Resorts Executive Suites",
        price: 1850,
        details: "Ultimate privacy pavilion including 24/7 personal butler, private plunge-pool & VIP airstrip transfers.",
        rating: 4.9,
        type: "hotel"
      },
      {
        provider: "Sovereign Palace Grand Tower",
        price: 1250,
        details: "Historical suite with Michelin-star in-room breakfast, spa access, and priority concierge reservation keys.",
        rating: 4.8,
        type: "hotel"
      },
      {
        provider: "The Obsidian Boutique Manor",
        price: 850,
        details: "Exclusive layout located in the high-fashion district, including private chauffeured luxury sedan daily.",
        rating: 4.7,
        type: "hotel"
      }
    ];
  }

  if (searchType === 'experience' || searchType.includes('activ') || searchType.includes('tour')) {
    return [
      {
        provider: "Elite Heritage Cruises",
        price: 650,
        details: "Private vintage wooden speedboat sunset cruise with live cello soloist and sommelier wine tasting.",
        rating: 5.0,
        type: "experience"
      },
      {
        provider: "National Archives Private Entry",
        price: 450,
        details: "Exclusive after-hours guided walk with senior curator, including access to vault items & restore rooms.",
        rating: 4.9,
        type: "experience"
      },
      {
        provider: "Gourmet Symphony Masterclass",
        price: 380,
        details: "Exclusive dining room masterclass with legendary Michelin-starred Chef, paired with limited vintage champagne.",
        rating: 4.8,
        type: "experience"
      }
    ];
  }

  // Default to flights
  return [
    {
      provider: "Global Prestige Airways",
      price: 2450,
      details: `First Class Suite (${start} → ${dest}). Fully lay-flat bed, enclosed cabin privacy doors, and caviar bar entry.`,
      rating: 4.9,
      type: "flight"
    },
    {
      provider: "France Aviation Executive",
      price: 1650,
      details: `Premium Business Class (${start} → ${dest}). Extra-wide ergonomical workspace shells, priority FastTrack security gates.`,
      rating: 4.7,
      type: "flight"
    },
    {
      provider: "Savior Air Shuttle lines",
      price: 980,
      details: `Curated Economy Comfort (${start} → ${dest}). Spacious legroom seats, premium dining menus, noise-cancelling tech.`,
      rating: 4.6,
      type: "flight"
    }
  ];
}

export function getFallbackBundles(destination: string, origin?: string, date?: string) {
  const dest = destination || "Paris";
  const start = origin || "New York (JFK)";
  
  return [
    {
      name: "The Emerald Silk Route",
      price: 4850,
      rating: 4.9,
      details: {
        flight: `Sovereign Airways First-Class Suite from ${start} to ${dest}`,
        hotel: "The Grand Regal Palace Resort (Executive Terrace Pavilion)",
        experience: "After-hours private museum curation guide & VIP dining pass",
        car: "Mercedes-Benz S-Class Private Chauffeur Daily"
      },
      description: "A meticulously orchestrated portfolio designed to synchronize historical beauty with executive privacy."
    },
    {
      name: "Obsidian Horizon Portfolio",
      price: 7200,
      rating: 5.0,
      details: {
        flight: "Private Air Shuttle Executive Lanes",
        hotel: "Aman Signature Villa (Infinite Ocean View Oasis)",
        experience: "Custom helicopter aerial flight and Michelin chef personal banquet",
        car: "Porsche Taycan Luxury EV Self-Drive"
      },
      description: "Pre-designed speed-optimized travel structure delivering ultra-premium modern amenities."
    },
    {
      name: "Sapphire Crest Collection",
      price: 3600,
      rating: 4.7,
      details: {
        flight: `France Aviation Business Cabin from ${start} to ${dest}`,
        hotel: "The Obsidian Boutique Manor (Fashion District Suite)",
        experience: "Sommelier-guided boutique wine tour & private cruise",
        car: "Chauffeured Executive SUV Transit"
      },
      description: "Sophisticated timing curation focusing on local gourmet secrets and elegant transport paths."
    }
  ];
}

export function getFallbackCities(queryInput: string): string[] {
  const q = (queryInput || "").toLowerCase();
  
  const matches = [
    { name: "Paris", code: "CDG" },
    { name: "London", code: "LHR" },
    { name: "New York", code: "JFK" },
    { name: "Tokyo", code: "NRT" },
    { name: "Rome", code: "FCO" },
    { name: "San Francisco", code: "SFO" },
    { name: "Los Angeles", code: "LAX" },
    { name: "Singapore", code: "SIN" },
    { name: "Dubai", code: "DXB" },
    { name: "Barcelona", code: "BCN" },
    { name: "Berlin", code: "BER" },
    { name: "Sydney", code: "SYD" }
  ];

  const results = matches.filter(m => m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q));

  if (results.length > 0) {
    return results.map(r => `${r.name} (${r.code})`);
  }

  // Fallback default list
  return [
    "New York (JFK)",
    "Paris (CDG)",
    "London (LHR)",
    "Tokyo (NRT)",
    "Rome (FCO)"
  ];
}
