import { GoogleGenAI, Type } from "@google/genai";
import { ParsedItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseItemsFromText = async (text: string): Promise<ParsedItem[]> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Extract a list of items and their estimated price in Indian Rupees (INR) from the following text: "${text}".
      Return a JSON array of objects.
      If the user doesn't specify a price, estimate a reasonable market price in India for a quick commerce app.
      Keep names concise.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the item" },
              estimatedPrice: { type: Type.NUMBER, description: "Estimated price in INR" }
            },
            required: ["name", "estimatedPrice"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ParsedItem[];
    }
    return [];
  } catch (error) {
    console.error("Gemini parsing error:", error);
    return [];
  }
};