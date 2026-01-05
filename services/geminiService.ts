
import { GoogleGenAI, Type } from "@google/genai";
import { BusRoute, Message } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * APSRTC-Focused Bus Route Discovery
 * Uses gemini-3-pro-preview with Google Search for actual real-world accuracy.
 */
export const fetchBusRoutes = async (pickup: string, drop: string): Promise<BusRoute[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Search for live bus routes between "${pickup}" and "${drop}" in India, specifically prioritizing APSRTC (Andhra Pradesh State Road Transport Corporation) data.
      
      CRITICAL ACCURACY REQUIREMENTS:
      1. Use REAL bus numbers and service names (e.g., "65H", "Palle Velugu", "Express", "Indra").
      2. Check official APSRTC schedules via live search grounding.
      3. Provide realistic arrival times based on current typical traffic patterns.
      4. If APSRTC doesn't serve this specific route, look for the closest local state transport (TSRTC, BMTC, etc.).
      
      Return exactly 5 options in JSON format.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              busNumber: { type: Type.STRING },
              arrivalTime: { type: Type.STRING },
              passingAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              endDestination: { type: Type.STRING },
              duration: { type: Type.STRING },
              type: { type: Type.STRING }, // Palle Velugu, Express, Garuda, etc.
              isLate: { type: Type.BOOLEAN },
              baseFare: { type: Type.STRING },
              provider: { type: Type.STRING, description: "Transport authority name, e.g., APSRTC" },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    time: { type: Type.STRING },
                    fareFromStart: { type: Type.STRING }
                  },
                  required: ["name", "time", "fareFromStart"]
                }
              }
            },
            required: ["id", "busNumber", "arrivalTime", "passingAreas", "endDestination", "duration", "type", "isLate", "baseFare", "provider"]
          }
        }
      }
    });

    const text = response.text || "[]";
    const data = JSON.parse(text);
    
    // Extract grounding sources for transparency
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(c => c.web)
      .map(c => ({ title: c.web?.title, uri: c.web?.uri })) || [];

    return data.map((route: any) => ({
      ...route,
      currentLocation: { lat: 15.9129, lng: 79.7400 }, // Default near AP coordinates
      verifiedSources: sources
    }));
  } catch (error) {
    console.error("Accuracy Error:", error);
    return [];
  }
};

/**
 * Geographic Exploration with Maps Grounding
 */
export const searchNearbyStops = async (query: string, lat?: number, lng?: number): Promise<{ text: string, sources: any[] }> => {
  const ai = getAI();
  try {
    const config: any = {
      tools: [{ googleMaps: {} }]
    };

    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find ${query} near this location. Focus on APSRTC bus stands and major railway stations.`,
      config
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.maps)
      .map(chunk => ({ 
        title: chunk.maps?.title || 'Location', 
        uri: chunk.maps?.uri || '#' 
      })) || [];

    return { text: response.text || "No detailed transit info found.", sources };
  } catch (error) {
    console.error("Maps Error:", error);
    return { text: "Location services currently unavailable.", sources: [] };
  }
};

export const getChatResponse = async (prompt: string): Promise<Message> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are ATLAS AI. You help users find real-time APSRTC and Indian transit data using official search results.",
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      .map(chunk => ({ title: chunk.web?.title || 'Source', uri: chunk.web?.uri || '#' })) || [];

    return {
      role: 'model',
      text: response.text || "I'm sorry, I couldn't find that information.",
      timestamp: new Date(),
      sources: sources
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return { role: 'model', text: "Connectivity issues.", timestamp: new Date() };
  }
};
