
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCaptionForImage(imageBase64: string): Promise<string> {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
        },
    };
    const textPart = {
        text: 'Analyze this image and suggest a short, funny meme caption. Format the response as a JSON object with "topText" and "bottomText" keys. The text should be concise and impactful, suitable for a meme.'
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    topText: {
                        type: Type.STRING,
                        description: "The text to display at the top of the meme."
                    },
                    bottomText: {
                        type: Type.STRING,
                        description: "The text to display at the bottom of the meme."
                    }
                }
            }
        }
    });

    return response.text;
}
