import { NextResponse } from 'next/server';
import schemesData from '../../../data/schemes.json';

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

    let context =
      "You are Navira AI Assistant for SchemeFinder AI. Provide accurate, professional responses about Indian government schemes.\n\n";

    if (history && history.length > 0) {
      history.forEach((msg: any) => {
        context += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    context += `\nUser: ${message}`;

    // ✅ STEP 1 — Try Gemini
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

        if (response.ok) {
          const data = await response.json();

          if (
            data &&
            data.candidates &&
            data.candidates.length > 0 &&
            data.candidates[0].content?.parts?.length > 0
          ) {
            return NextResponse.json({
              reply: data.candidates[0].content.parts[0].text,
            });
          }
        } else {
          const errorText = await response.text();
          console.error("Gemini HTTP Error:", errorText);
        }
      } catch (err) {
        console.error("Gemini failed, switching to fallback.");
      }
    }

    // ✅ STEP 2 — Fallback (Always Works)

    const lowerMessage = message.toLowerCase();

    const matchedScheme = schemesData.schemes.find((scheme: any) =>
      lowerMessage.includes(scheme.title.toLowerCase())
    );

    if (matchedScheme) {
      return NextResponse.json({
        reply: `
${matchedScheme.title}

Ministry: ${matchedScheme.ministry}

Description: ${matchedScheme.description}

Benefits:
${matchedScheme.benefits.map((b: string) => "- " + b).join("\n")}
`
      });
    }

    if (lowerMessage.includes("eligible")) {
      return NextResponse.json({
        reply:
          "Eligibility depends on age, income, occupation, and social category. Please check the scheme details shown above."
      });
    }

    return NextResponse.json({
      reply:
        "I can help you understand government schemes and eligibility. Please ask about a specific scheme."
    });

  } catch (error) {
    return NextResponse.json(
      { reply: "Chat service temporarily unavailable." },
      { status: 200 }
    );
  }
}