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

    const lowerMessage = message.toLowerCase();

    const apiKey = process.env.GEMINI_API_KEY;

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
`,
      });
    }

    if (lowerMessage.includes("eligible")) {
      return NextResponse.json({
        reply:
          "Eligibility depends on age, income, occupation, and social category. Please check the scheme details shown above.",
      });
    }

    return NextResponse.json({
      reply:
        "I can help you understand government schemes and eligibility. Please ask about a specific scheme.",
    });
  } catch (error) {
    return NextResponse.json(
      { reply: "Chat service temporarily unavailable." },
      { status: 200 }
    );
  }
}