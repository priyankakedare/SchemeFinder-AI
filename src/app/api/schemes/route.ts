import { NextResponse } from 'next/server';
import { UserProfile, Scheme } from '../../../types';
import { rankSchemes } from '../../../lib/eligibilityEngine';
import schemesData from '../../../data/schemes.json';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

// A hybrid architecture: Discovery via LLM -> Verification via Deterministic Engine
export async function POST(request: Request) {
  try {
    const profile: UserProfile = await request.json();

    if (!profile) {
      return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
    }

    let candidateSchemes: Scheme[] = [...(schemesData.schemes as Scheme[])];

    // If Gemini is configured, use it for real-time DISCOVERY
    if (process.env.GEMINI_API_KEY) {
        try {
            const prompt = `
You are a highly accurate Indian Government Scheme discovery engine.
Find 3-5 real, currently active Indian government schemes that perfectly match this user profile:
User Profile: ${JSON.stringify(profile, null, 2)}

Return the output EXACTLY in this JSON array format, matching the typescript schema. Do NOT include markdown blocks like \`\`\`json, just return the raw JSON array.
[
  {
      "id": "unique-scheme-id",
      "title": "Official Scheme Name",
      "ministry": "Ministry Name",
      "description": "Short description of the scheme.",
      "sourceUrl": "https://official-government-link.gov.in",
      "eligibility": { // VERY IMPORTANT: State the generic eligibility criteria for this scheme here
        "occupation": ["Farmer", "Student", "etc"], // or omit
        "minAge": 18, // or omit
        "maxAge": 60, // or omit
        "maxIncomeMonthly": 10000, 
        "socialCategory": ["SC", "ST", "General", "OBC", "BPL"],
        "gender": "Male/Female" // or omit
      },
      "benefits": ["Benefit 1", "Benefit 2"],
      "lifecycleState": "Active"
  }
]
Critical: Ensure the properties match exactly, and provide realistic eligibility bounds for 'eligibility'.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            let responseText = response.text || "[]";
            // Clean up possible markdown code bounds
            responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

            const discoveredSchemes: Scheme[] = JSON.parse(responseText);
            
            // Merge LLM discovered schemes with our deterministic fallback ones (avoiding duplicates based on ID)
            const combined = [...candidateSchemes];
            discoveredSchemes.forEach(ds => {
                if (!combined.some(cs => cs.id === ds.id || cs.title.toLowerCase() === ds.title.toLowerCase())) {
                    combined.push(ds);
                }
            });
            candidateSchemes = combined;

        } catch (llmError) {
            console.error("LLM Discovery failed, falling back to static deterministic DB", llmError);
            // We just use candidateSchemes as predefined
        }
    }

    // HYBRID VERIFICATION PHASE (ZERO HALLUCINATION CHECK)
    // Run the LLM's discovered schemes through our strict TypeScript verification engine
    const recommendedSchemes = rankSchemes(profile, candidateSchemes);

    return NextResponse.json({ recommendations: recommendedSchemes });
    
  } catch (error) {
    console.error('Error in schemes API:', error);
    return NextResponse.json({ error: 'Failed to process schemes' }, { status: 500 });
  }
}
