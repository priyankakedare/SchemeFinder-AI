import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ reply: 'Please configure your GEMINI_API_KEY in the .env.local file to enable the AI assistant.' }, { status: 200 });
    }

    let conversationContext = "You are the Navira AI Assistant for 'SchemeFinder AI', a government-grade platform for discovering Indian government schemes. You provide accurate, helpful, and concise information about government schemes. You MUST NOT hallucinate eligibility. If you don't know something, say you don't know. Always maintain a professional, government-appropriate tone.\n\n";
    
    if (history && history.length > 0) {
       conversationContext += "Recent conversation history:\n";
       history.forEach((msg: any) => {
          conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
       });
    }

    conversationContext += `\nUser's new message: ${message}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: conversationContext,
    });

    const reply = response.text || "I'm sorry, I couldn't process that request at the moment.";

    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
