
import { GoogleGenAI, Type } from "@google/genai";
import { InspirationResult } from "../types";

export const generateInspiration = async (topic: string): Promise<InspirationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // 1. Generate Idea Text in Spanish
  const textResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Genera una idea creativa y única para un proyecto, negocio o pieza de arte relacionada con: "${topic}". Responde siempre en español.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Un título llamativo para la idea." },
          description: { type: Type.STRING, description: "Una o dos frases describiendo la idea." },
          imagePrompt: { type: Type.STRING, description: "Un prompt visual detallado para un generador de imágenes basado en esta idea (este prompt puede estar en inglés para mejor calidad de imagen)." }
        },
        required: ["title", "description", "imagePrompt"]
      }
    }
  });

  const textResult = JSON.parse(textResponse.text || "{}");
  return textResult as InspirationResult;
};

export const generateVisual = async (prompt: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high quality, professional, cinematic image of: ${prompt}` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
};
