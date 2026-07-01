import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { buildSystemInstruction } from "./server/agents/index";
import { 
  getFallbackChat, 
  getFallbackItinerary, 
  getFallbackSearch, 
  getFallbackBundles, 
  getFallbackCities 
} from "./server/fallbacks";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy loaded Gemini SDK client
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check AI Studio under Settings > Secrets to provide your API Key.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Robust JSON clean and parse helper
function cleanAndParseJSON(text: string | undefined): any {
  if (!text) {
    throw new Error("No response returned from the model.");
  }
  let cleanText = text.trim();
  if (cleanText.startsWith("```")) {
    const lines = cleanText.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1].startsWith("```")) {
      lines.pop();
    }
    cleanText = lines.join("\n").trim();
  }
  return JSON.parse(cleanText);
}

// Resilient Gemini API wrappers with retry logic and model selection fallback (e.g. 3.5-flash -> 3.1-flash-lite)
async function generateContentWithRetry(params: {
  contents: string;
  config?: any;
}) {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const ai = getAI();
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempt} to call ${model} failed: ${error.message || error}`);
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }
  throw lastError;
}

async function chatSendMessageWithRetry(params: {
  message: string;
  history: any[];
  systemInstruction?: string;
  responseMimeType?: string;
}) {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const ai = getAI();
        const chat = ai.chats.create({
          model,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: params.responseMimeType,
          },
          history: params.history,
        });
        const result = await chat.sendMessage({ message: params.message });
        return result;
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempt} to call ${model} for chat failed: ${error.message || error}`);
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }
  throw lastError;
}

// AI Agent Endpoint
app.post("/api/agent/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Safely clean historical model responses to extract just raw text representation (ignoring JSON structure)
    // so Gemini receives an elegant, clean contextual chat thread.
    const rawHistory = (history || []).map((h: any) => {
      if (h.role === 'model') {
        try {
          const parsed = JSON.parse(h.parts[0].text);
          return {
            role: h.role,
            parts: [{ text: parsed.text || h.parts[0].text }]
          };
        } catch {
          // If not structured JSON, proceed as is
        }
      }
      return h;
    });

    // Clean historical thread to strictly alternate user and model, starting with user (required by the Gemini SDK)
    const cleanHistory: any[] = [];
    let expectedRole = 'user';
    for (const h of rawHistory) {
      if (h.role === expectedRole) {
        cleanHistory.push(h);
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    const result = await chatSendMessageWithRetry({
      message,
      history: cleanHistory,
      systemInstruction: buildSystemInstruction(),
      responseMimeType: "application/json",
    });
    
    // Attempt parsing to verify valid structured output; if valid, we send it directly
    try {
      const parsed = cleanAndParseJSON(result.text);
      res.json(parsed);
    } catch {
      // Graceful fallback if any transient json formatting issues creep in
      res.json({
        text: result.text,
        agentsInvolved: ["atlas"],
        agentSteps: [{ agent: "atlas", action: "Coordinates complete response streams directly." }]
      });
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    try {
      const fallback = getFallbackChat(req.body.message, req.body.history || []);
      res.json(fallback);
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Failed to communicate with Savior agent" });
    }
  }
});

// Itinerary Planner Endpoint
app.post("/api/itinerary/generate", async (req, res) => {
  try {
    const { destination, duration, budget, preferences } = req.body;
    
    const response = await generateContentWithRetry({
      contents: `Create a detailed ${duration}-day itinerary for ${destination} with a ${budget} budget. 
      Preferences: ${preferences || 'None'}.
      Format the output as a JSON object with this structure:
      {
        "destination": "Name",
        "days": [
          {
            "day": 1,
            "activities": [
              { "time": "Morning", "description": "...", "location": "..." }
            ]
          }
        ],
        "estimatedTotalCost": 1200
      }`,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(cleanAndParseJSON(response.text));
  } catch (error: any) {
    console.error("Itinerary Error:", error);
    try {
      const { destination, duration, budget, preferences } = req.body;
      const fallback = getFallbackItinerary(destination, Number(duration), budget, preferences);
      res.json(fallback);
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Failed to generate itinerary" });
    }
  }
});

// Mock Travel Deals Endpoint (using Gemini to generate realistic varied deals)
app.post("/api/travel/search", async (req, res) => {
  try {
    const { type, destination, origin, date } = req.body;
    
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const response = await generateContentWithRetry({
      contents: `Generate 3 realistic ${type || 'travel'} deals.
      Origin: ${origin || 'Major Hubs'}
      Destination: ${destination}
      Date: ${date || 'Upcoming Season'}
      
      Provide a variety of prices (Budget, Value, Luxury).
      Return as JSON array of objects: 
      [{ "provider": "Name", "price": 123, "details": "Specific flight or hotel details...", "rating": 4.5, "type": "${type || 'experience'}" }]`,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(cleanAndParseJSON(response.text));
  } catch (error: any) {
    console.error("Search Error:", error);
    try {
      const { type, destination, origin, date } = req.body;
      const fallback = getFallbackSearch(type, destination, origin, date);
      res.json(fallback);
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Failed to fetch deals" });
    }
  }
});

// Bundled Packages Endpoint
app.post("/api/travel/bundles", async (req, res) => {
  try {
    const { destination, origin, date } = req.body;

    const response = await generateContentWithRetry({
      contents: `Generate 3 comprehensive travel bundles for ${destination || 'a luxury destination'} from ${origin || 'Major Hubs'} for ${date || 'upcoming season'}.
      Each bundle MUST include: Flight, Luxury Hotel, a curated Experience, and Car Rental.
      Return as JSON array of objects: 
      [{ 
        "name": "The Emerald Silk Route", 
        "price": 4500, 
        "rating": 4.9,
        "details": {
          "flight": "Business Class with Provider",
          "hotel": "5-star Resort Name",
          "experience": "Private guided tour of...",
          "car": "Luxury Sedan rental"
        },
        "description": "Short poetic description of the bundle vibe."
      }]`,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(cleanAndParseJSON(response.text));
  } catch (error: any) {
    console.error("Bundle Error:", error);
    try {
      const { destination, origin, date } = req.body;
      const fallback = getFallbackBundles(destination, origin, date);
      res.json(fallback);
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Failed to generate bundles" });
    }
  }
});

// City Search Endpoint
app.post("/api/travel/cities/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.length < 2) return res.json([]);

    const response = await generateContentWithRetry({
      contents: `List 5 major cities and their main airport codes that match or are related to the search query: "${query}". 
      Return ONLY a JSON array of strings in the format "City Name (IATA)". 
      Example: ["London (LHR)", "New York (JFK)"]`,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(cleanAndParseJSON(response.text));
  } catch (error: any) {
    console.error("City Search Error:", error);
    try {
      const fallback = getFallbackCities(req.body.query);
      res.json(fallback);
    } catch (fallbackError) {
      res.status(550).json({ error: error.message || "Failed to search cities" });
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
