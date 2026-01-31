
import { GoogleGenAI, Type } from "@google/genai";
import { Habit, Completion } from "./types";

// Fix: Always use named parameter for apiKey and use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartInsights(habits: Habit[], completions: Completion[]) {
  if (!process.env.API_KEY) return "AI insights are unavailable without an API key.";

  const prompt = `
    Analyze the following habit data and provide a short, motivating professional insight.
    Habits: ${JSON.stringify(habits.map(h => h.name))}
    Completions: ${JSON.stringify(completions.map(c => ({ h: c.habitId, d: c.date })))}
    
    Structure your response as:
    1. Trend: A brief observation about their consistency.
    2. Tip: A practical piece of advice.
    3. Prediction: A small encouragement about their progress.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Fix: Access .text property directly to get the generated content
    return response.text || "Keep up the great work!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focus on maintaining your current streaks. Consistency is the key to mastery!";
  }
}
