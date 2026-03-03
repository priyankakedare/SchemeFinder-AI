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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing in production.");
      return NextResponse.json(
        {
          reply:
            "AI service is not configured properly. Please contact administrator."
        },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    let conversationContext =
      "You are the Navira AI Assistant for 'SchemeFinder AI'. Provide accurate, concise, and professional responses. Do NOT hallucinate.\n\n";

    if (history && history.length > 0) {
      conversationContext += "Conversation history:\n";
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