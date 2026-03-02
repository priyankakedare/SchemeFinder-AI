import { NextResponse } from 'next/server';
import { UserProfile, Scheme } from '../../../types';
import { rankSchemes } from '../../../lib/eligibilityEngine';
import schemesData from '../../../data/schemes.json';
import { GoogleGenAI } from '@google/genai';

// HYBRID ARCHITECTURE: LLM Discovery + Deterministic Verification
export async function POST(request: Request) {
  try {
    const profile: UserProfile = await request.json();

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Start with deterministic database
    let candidateSchemes: Scheme[] = [
      ...(schemesData.schemes as Scheme[])
    ];

    // ONLY use Gemini if key exists
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
You are a highly accurate Indian Government Scheme discovery engine.
Find 3-5 real, currently active Indian government schemes that perfectly match this user profile:

User Profile:
${JSON.stringify(profile, null, 2)}

Return ONLY raw JSON array in this format (no markdown blocks):

[
  {
    "id": "unique-scheme-id",
    "title": "Official Scheme Name",
    "ministry": "Ministry Name",
    "description": "Short description",
    "sourceUrl": "https://official-link.gov.in",
    "eligibility": {
      "occupation": ["Farmer", "Student"],
      "minAge": 18,
      "maxAge": 60,
      "maxIncomeMonthly": 10000,
      "socialCategory": ["SC", "ST", "OBC", "General"],
      "gender": "Male/Female"
    },
    "benefits": ["Benefit 1", "Benefit 2"],
    "lifecycleState": "Active"
  }
]
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        let responseText = response.text || "[]";

        // Remove accidental markdown formatting
        responseText = responseText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        const discoveredSchemes: Scheme[] = JSON.parse(responseText);

        // Merge LLM schemes into deterministic DB
        const combined = [...candidateSchemes];

        discoveredSchemes.forEach((ds) => {
          if (
            !combined.some(
              (cs) =>
                cs.id === ds.id ||
                cs.title.toLowerCase() === ds.title.toLowerCase()
            )
          ) {
            combined.push(ds);
          }
        });

        candidateSchemes = combined;

      } catch (llmError) {
        console.error("LLM Discovery failed. Falling back to static DB.", llmError);
      }
    } else {
      console.warn("GEMINI_API_KEY not configured. Using static DB only.");
    }

    // Deterministic Ranking (Zero Hallucination Control)
    const recommendedSchemes = rankSchemes(profile, candidateSchemes);

    return NextResponse.json({
      recommendations: recommendedSchemes
    });

  } catch (error: any) {
    console.error('Error in schemes API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process schemes' },
      { status: 500 }
    );
  }
}