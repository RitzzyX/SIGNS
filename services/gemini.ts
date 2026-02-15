
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chatWithConcierge(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) {
    const chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the "Signature Spaces Concierge," an elite AI real estate advisor. 
        Be sophisticated, helpful, and knowledgeable about luxury properties. 
        Help users find homes based on their needs, explain market trends, and offer investment advice. 
        Keep responses concise but elegant.`,
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  }

  async visualizeSpace(prompt: string, base64Image?: string) {
    if (base64Image) {
      // Image editing/re-imagining
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: `Re-imagine this room interior design based on this request: ${prompt}. Return the updated interior image.` }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } else {
      // Text to image generation
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High-end luxury real estate interior, architectural photography, 8k resolution, elegant lighting: ${prompt}` }]
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  }
}
