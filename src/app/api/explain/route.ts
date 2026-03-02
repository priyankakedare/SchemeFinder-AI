import { NextResponse } from 'next/server';
import { EligibilityResult, Scheme } from '../../../types';

// In a real application, this would call OpenAI, Gemini, etc.
// Here we simulate an AI explaining the STRICTly deterministic results.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scheme, evaluation }: { scheme: Scheme, evaluation: EligibilityResult } = body;

    if (!scheme || !evaluation) {
         return NextResponse.json({ error: 'Scheme and evaluation result are required' }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let explanationText = `Based on the official criteria for the **${scheme.title}** from the ${scheme.ministry}, here is why you are eligible:\n\n`;

    evaluation.matchedCriteria.forEach(match => {
        explanationText += `* **✓** ${match}\n`;
    });

    explanationText += `\nThis makes you eligible to receive:\n`;
    scheme.benefits.forEach(benefit => {
        explanationText += `* ${benefit}\n`;
    });

     explanationText += `\n*Note: This explanation is generated deterministically based on your provided profile to ensure accuracy and prevent hallucination.*`;


    return NextResponse.json({ explanation: explanationText });

  } catch (error) {
    console.error('Error in explanation API:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
