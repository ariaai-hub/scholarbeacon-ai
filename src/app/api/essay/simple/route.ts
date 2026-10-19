import { NextRequest, NextResponse } from "next/server";
import { minimaxChat } from "@/lib/minimax";
import { humanizeEssay } from "@/lib/humanize";

// POST /api/essay/simple — no auth required
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scholarshipName, profile, promptType = "personal_statement" } = body;

    if (!scholarshipName) {
      return NextResponse.json(
        { error: "scholarshipName is required" },
        { status: 400 }
      );
    }

    // Build profile summary from the simple profile object
    const profileSummary = profile
      ? [
          profile.firstName && `Name: ${profile.firstName} ${profile.lastName || ""}`,
          profile.state && `State: ${profile.state}`,
          profile.educationLevel && `Education: ${profile.educationLevel}`,
          profile.gpa && `GPA: ${profile.gpa}`,
          profile.major && `Intended Major: ${profile.major}`,
          profile.isFirstGeneration ? "First-generation college student" : null,
          profile.hasLeadership ? "Has leadership experience" : null,
          profile.hasCommunityService ? "Has community service experience" : null,
          profile.ethnicity && `Ethnicity: ${profile.ethnicity}`,
        ]
          .filter(Boolean)
          .join("\n")
      : "";

    const systemPrompt = `You are an expert scholarship essay writer. You write compelling, authentic personal statements that are:
- Specific and concrete (named examples, real stories, measurable outcomes)
- Emotionally resonant without being sentimental
- Free of clichés, generic statements, and filler phrases
- Written in a conversational but polished tone
- 400-600 words
- Structured with a hook opening, 2-3 body paragraphs with specific examples, and a forward-looking conclusion`;

    const userPrompt = promptType === "sop"
      ? `Write a Statement of Purpose for "${scholarshipName}" based on this student profile:

${profileSummary}

Requirements:
- Open with a specific, compelling hook related to your field or background
- Discuss 2 concrete experiences that shaped your motivation
- Connect experiences to future goals in this field
- Close with a compelling vision
- Do NOT use phrases like "from a young age", "I have always been passionate", or "the world today"`
      : `Write a personal statement essay for "${scholarshipName}" based on this student profile:

${profileSummary}

Requirements:
- Open with a specific moment or story (not "from a young age")
- Use 2-3 concrete examples with real details
- Show character and values through specific moments, not abstract claims
- End with a forward-looking statement
- Do NOT use clichés: "hard work pays off", "believe in yourself", "I have always been passionate"`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ];

    const rawEssay = await minimaxChat(messages);
    const essay = humanizeEssay(rawEssay);

    return NextResponse.json({ essay });
  } catch (err) {
    console.error("Essay generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate essay. Please try again." },
      { status: 500 }
    );
  }
}
