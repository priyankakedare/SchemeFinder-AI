import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "AI service not configured." },
        { status: 200 }
      );
    }

    let context =
      "You are Navira AI Assistant for SchemeFinder AI. Provide accurate, professional responses.\n\n";

    if (history?.length) {
      history.forEach((msg: any) => {
        context += `${msg.role}: ${msg.content}\n`;
      });
    }

    context += `User: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: context }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't process your request.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("CHAT API ERROR:", error);
    return NextResponse.json(
      { reply: "AI service error. Please try again shortly." },
      { status: 200 }
    );
  }
}