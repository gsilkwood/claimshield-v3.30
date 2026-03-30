export const REPAIR_ESTIMATE_EXTRACTION_PROMPT = `
Extract all relevant repair data from the provided repair estimate document.
Focus on identifying structural damage, labor hours breakdown, and itemized repair components.

You must return the data in the following JSON format:
{
  "totalRepairCost": number,
  "laborHours": {
    "body": number,
    "frame": number,
    "refinish": number,
    "mechanical": number,
    "total": number
  },
  "itemizedRepairs": [
    {
      "description": "string",
      "partType": "structural" | "cosmetic" | "mechanical",
      "action": "repair" | "replace",
      "laborHours": number,
      "partsCost": number,
      "laborCost": number,
      "totalCost": number
    }
  ],
  "damageIndicators": {
    "structuralDamage": boolean,
    "frameDamage": boolean,
    "framePullingRequired": boolean,
    "airbagDeployment": boolean,
    "alignmentRequired": boolean
  },
  "repairFacility": {
    "name": "string" | null,
    "address": "string" | null
  },
  "confidence": number (0-1)
}

Ensure all numeric values are numbers, not strings.
If a value is not found, use 0 for numbers and null for strings.
`
