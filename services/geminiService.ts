import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

let genAI: GoogleGenAI | null = null;

// Initialize comfortably with environment variable
if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateProductContent = async (productName: string, category: string): Promise<AIResponse | null> => {
  if (!genAI) {
    console.warn("Gemini API Key not found.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert Nigerian marketing copywriter. 
      Create catchy, localized content for a product named "${productName}" in the category "${category}".
      
      Requirements:
      1. 'salesPitch': A persuasive paragraph (approx 50 words) mixing professional English with a touch of Nigerian Pidgin flavor to make it relatable (e.g., use words like "correct", "durable", "shines").
      2. 'keyFeatures': 3-4 bullet points of realistic features for this type of product.
      3. 'seoTags': 5 relevant SEO keywords for a Nigerian e-commerce store.
    `;

    const response = await model.generateContent({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            salesPitch: { type: Type.STRING },
            keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            seoTags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["salesPitch", "keyFeatures", "seoTags"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AIResponse;
    }
    return null;

  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string | null> => {
    if (!genAI) {
        console.warn("Gemini API Key not found for image generation.");
        return null;
    }

    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "16:9"
                }
            }
        });

        // The response contains multiple parts; we need to find the inlineData
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    return `data:image/png;base64,${base64EncodeString}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};
