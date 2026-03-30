import { GoogleGenAI } from '@google/genai'

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export const MODELS = {
  FAST: 'gemini-2.5-flash',   // Document extraction, VIN lookup, quick tasks
  PRO:  'gemini-2.5-pro',     // Damage severity narrative, market stigma, demand letter
} as const
