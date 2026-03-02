import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check API key FIRST
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          reply:
            'AI service is not configured properly. Please contact administrator.'
        },
        { status: 200 }
      );
    }

    // Create AI instance safely INSIDE function
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    let conversationContext =
      "You are the Navira AI Assistant for 'SchemeFinder AI', a government-grade platform for discovering Indian government schemes. Provide accurate, concise, professional responses. Do NOT hallucinate eligibility. If unsure, say you don't know.\n\n";

    if (history && history.length > 0) {
      conversationContext += "Recent conversation:\n";
      history.forEach((msg: any) => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    conversationContext += `\nUser: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: conversationContext,
    });

    const reply =
      response?.text?.trim() ||
      "I'm sorry, I couldn't process that request at the moment.";

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('CHAT API ERROR:', error);

    return NextResponse.json(
      {
        reply:
          "I encountered an issue connecting to the AI service. Please try again shortly."
      },
      { status: 200 }
    );
  }
}