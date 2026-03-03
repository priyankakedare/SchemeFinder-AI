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
      console.error("Gemini API key not found.");
      return NextResponse.json(
        { reply: "AI service not configured properly." },
        { status: 200 }
      );
    }

    let context =
      "You are Navira AI Assistant for SchemeFinder AI. Provide accurate and professional responses.\n\n";

    if (history && history.length > 0) {
      history.forEach((msg: any) => {
        context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    context += `\nUser: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: context }],
            },
          ],
        }),
      }
    );

    // 🔥 DEBUG BLOCK — show real Google error
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini HTTP error:", errorText);

      return NextResponse.json({
        reply: "Gemini Error: " + errorText,
      });
    }

    const data = await response.json();

    console.log("Gemini raw response:", JSON.stringify(data));

    let reply = "AI response format unexpected.";

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      { reply: "Server Error: " + error?.message },
      { status: 200 }
    );
  }
}