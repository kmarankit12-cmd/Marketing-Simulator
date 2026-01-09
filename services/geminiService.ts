import { GoogleGenAI, Type } from "@google/genai";
import { FunnelStep, StepType } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize safe AI instance (will fail gracefully if no key, but UI handles that)
const ai = new GoogleGenAI({ apiKey });

export const generateFunnelStrategy = async (niche: string): Promise<FunnelStep[]> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Create a marketing funnel strategy for the following niche: "${niche}".
    Return a JSON array of funnel steps.
    Each step should have a logical flow (e.g., Traffic -> Optin -> Sales).
    Include realistic conversion rates and product prices based on industry standards for this niche.
    
    The steps should be one of these types: TRAFFIC, LANDING, OPTIN, SALES, CHECKOUT, UPSELL, THANK_YOU.
    For 'TRAFFIC', include trafficVolume (default 1000) and cpc (cost per click).
    For others, include conversionRate (percentage) and productPrice (if applicable, else 0).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: Object.values(StepType) },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              conversionRate: { type: Type.NUMBER },
              productPrice: { type: Type.NUMBER },
              trafficVolume: { type: Type.NUMBER },
              cpc: { type: Type.NUMBER }
            },
            required: ["type", "name", "conversionRate", "productPrice"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Add IDs
      return data.map((step: any, index: number) => ({
        ...step,
        id: `gen-${Date.now()}-${index}`,
        visitorsIn: 0,
        visitorsOut: 0,
        revenue: 0,
        cost: 0
      }));
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeFunnel = async (steps: FunnelStep[], totals: any): Promise<string> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Analyze this marketing funnel simulation:
    
    Funnel Structure:
    ${JSON.stringify(steps.map(s => ({ name: s.name, type: s.type, conversion: s.conversionRate + '%', price: '$' + s.productPrice })), null, 2)}
    
    Performance Totals:
    ${JSON.stringify(totals, null, 2)}
    
    Provide 3 concrete, actionable suggestions to improve Profit and ROAS. 
    Focus on the weakest points in the funnel (bottlenecks).
    Keep it concise (under 200 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate analysis at this time.";
  }
};