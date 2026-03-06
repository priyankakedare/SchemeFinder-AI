import { NextResponse } from "next/server";
import schemesData from "../../../data/schemes.json";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const lowerMessage = message.toLowerCase();

    // ===============================
    // Greeting Detection
    // ===============================

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return NextResponse.json({
        reply:
          "Hello! 👋 I am Navira AI Assistant. I can help you understand Indian government schemes and eligibility. Ask me about schemes like PM Kisan, Ayushman Bharat, PM Awas Yojana, etc.",
      });
    }

    // ===============================
    // Suggest Scheme
    // ===============================

    if (
      lowerMessage.includes("suggest") ||
      lowerMessage.includes("recommend")
    ) {
      const randomScheme =
        schemesData.schemes[
          Math.floor(Math.random() * schemesData.schemes.length)
        ];

      return NextResponse.json({
        reply: `
You may find this scheme useful:

${randomScheme.title}

Ministry: ${randomScheme.ministry}

Description: ${randomScheme.description}

Benefits:
${randomScheme.benefits.map((b: string) => "- " + b).join("\n")}
`,
      });
    }

    // ===============================
    // Local Scheme Search
    // ===============================

    const matchedScheme = schemesData.schemes.find((scheme: any) =>
      lowerMessage.includes(scheme.title.toLowerCase()) ||
      scheme.title.toLowerCase().includes(lowerMessage)
    );

    if (matchedScheme) {
      return NextResponse.json({
        reply: `
${matchedScheme.title}

Ministry: ${matchedScheme.ministry}

Description: ${matchedScheme.description}

Benefits:
${matchedScheme.benefits.map((b: string) => "- " + b).join("\n")}
`,
      });
    }

    // ===============================
    // Gemini AI Response
    // ===============================

    if (apiKey) {
      try {
        const geminiPrompt = `
You are Navira AI Assistant for SchemeFinder AI.

Your main job is helping users discover and understand Indian government schemes.

If users ask general questions, answer briefly but guide them back to schemes when relevant.

Rules:
- If the user greets you, greet them politely.
- If the user asks about a government scheme, explain clearly.
- If the user asks which scheme is best, suggest a relevant one.
- Keep answers simple and helpful.

User message: ${message}
`;

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
                  role: "user",
                  parts: [{ text: geminiPrompt }],
                },
              ],
            }),
          }
        );

        const data = await response.json();

        if (
          data?.candidates &&
          data.candidates.length > 0 &&
          data.candidates[0]?.content?.parts?.length > 0
        ) {
          return NextResponse.json({
            reply: data.candidates[0].content.parts[0].text,
          });
        }
      } catch (err) {
        console.error("Gemini error:", err);
      }
    }

    // ===============================
    // Eligibility Fallback
    // ===============================

    if (lowerMessage.includes("eligible")) {
      return NextResponse.json({
        reply:
          "Eligibility depends on age, income, occupation, and social category. Please check the scheme details above or ask about a specific scheme.",
      });
    }

    // ===============================
    // Default Fallback
    // ===============================

    return NextResponse.json({
      reply:
        "I can help you understand Indian government schemes. Try asking about schemes like PM Kisan, Ayushman Bharat, PM Awas Yojana, or ask me to suggest a scheme.",
    });
  } catch (error) {
    console.error("Chat error:", error);

    return NextResponse.json(
      { reply: "Chat service temporarily unavailable." },
      { status: 200 }
    );
  }
}