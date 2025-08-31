// fix: Use correct import 'GoogleGenAI' instead of 'GoogleGenerativeAI'.
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { UserSettings } from './types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

// fix: Initialize with named parameter { apiKey: ... }
const genAI = new GoogleGenAI({ apiKey: API_KEY });

const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export async function generatePlanFromAI(settings: UserSettings) {
  const prompt = `
    Based on the following user profile, calculate the daily caloric needs and macronutrient split (protein, carbs, fat in grams).
    - Age: ${settings.age}
    - Sex: ${settings.sex}
    - Weight: ${settings.weight_kg} kg
    - Height: ${settings.height_cm} cm
    - Activity Level: ${settings.activity_level} (sedentary, light, moderate, active)
    - Goal: ${settings.goal} (lose_fat, gain_muscle, maintain)

    Use the Mifflin-St Jeor equation for BMR. Adjust for activity and goal.
    - For fat loss, create a 500 calorie deficit.
    - For muscle gain, create a 300 calorie surplus.
    - For maintenance, keep calories at TDEE.
    
    Provide a macro split of 40% carbs, 30% protein, 30% fat.

    Return a JSON object with the following structure:
    {
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number
    }
  `;

  // fix: Use ai.models.generateContent and update API call structure. Use 'gemini-2.5-flash' model.
  const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        ...generationConfig,
        responseMimeType: "application/json",
      },
      safetySettings,
  });

  // fix: Use response.text to get the text content.
  const responseText = result.text;
  return JSON.parse(responseText);
}

export async function analyzeImageWithAI(imageBuffer: Buffer, mimeType: string) {
    const prompt = `
      Analyze the food in this image.
      Provide an estimated nutritional breakdown.
      Your response MUST be a valid JSON object with the following structure, no extra text or markdown:
      {
        "description": "A short, descriptive name for the meal (e.g., 'Grilled Chicken Salad with Avocado').",
        "calories": number,
        "protein_g": number,
        "carbs_g": number,
        "fat_g": number
      }
    `;

    const imagePart = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
        },
    };

    // fix: Use ai.models.generateContent and update API call structure.
    const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          ...generationConfig,
          responseMimeType: "application/json",
        },
        safetySettings,
    });
    
    // fix: Use response.text to get the text content.
    const responseText = result.text;
    return JSON.parse(responseText);
}
