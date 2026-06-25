import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { minimaxChat } from "@/lib/minimax";
import { humanizeEssay } from "@/lib/humanize";

// POST /api/essay/generate
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { scholarshipId, promptType } = body;

  if (!scholarshipId || !promptType) {
    return NextResponse.json(
      { error: "scholarshipId and promptType are required" },
      { status: 400 }
    );
  }

  if (!["personal_statement", "sop"].includes(promptType)) {
    return NextResponse.json(
      { error: "promptType must be 'personal_statement' or 'sop'" },
      { status: 400 }
    );
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found. Complete your profile first." },
      { status: 404 }
    );
  }

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: scholarshipId },
  });

  if (!scholarship) {
    return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
  }

  const essayPrompts = (scholarship.essayPrompts as string[] | null) || [];

  // Build student context for essay generation
  const studentContext = {
    fullName: profile.fullName,
    mostSignificantChallenge: profile.mostSignificantChallenge,
    whatToKnowAboutYou: profile.whatToKnowAboutYou,
    futureGoal: profile.futureGoal,
    whyNeedScholarship: profile.whyNeedScholarship,
    circumstancesToExplain: profile.circumstancesToExplain,
    activities: profile.activities,
    communityServiceHours: profile.communityServiceHours,
    awardsAndHonors: profile.awardsAndHonors,
    intendedMajor: profile.intendedMajor,
    targetDegree: profile.targetDegree,
    firstGeneration: profile.firstGenerationCollegeStudent,
    heritageTags: profile.heritageTags,
    athleteStatus: profile.athleteStatus,
    geographicBackground: profile.geographicBackground,
  };

  const promptLabel = promptType === "personal_statement"
    ? "Personal Statement"
    : "Statement of Purpose";

  // Use the first essay prompt or a default
  const targetPrompt = essayPrompts[0] || "Tell us about yourself and why you deserve this scholarship.";

  const systemPrompt = `You are an expert admissions essay coach. You write compelling, authentic personal essays that sound human-written. Avoid AI clichés, padding, or formulaic structures.`;

  const userPrompt = `Write a ${promptLabel} for a student applying to this scholarship.

SCHOLARSHIP PROMPT: "${targetPrompt}"

STUDENT PROFILE & STORY:
${JSON.stringify(studentContext, null, 2)}

Write a first draft of the essay (500-800 words). It should:
- Address the scholarship prompt directly
- Be specific and personal — use concrete examples
- Show, don't just tell
- Have a clear narrative arc
- Sound authentic and human-written

Return ONLY the essay text, no meta-commentary.`;

  let rawEssay = "";
  try {
    rawEssay = await minimaxChat([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.error("MiniMax essay generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate essay. Please try again." },
      { status: 500 }
    );
  }

  // Humanize the essay to remove AI signals
  const humanizedEssay = humanizeEssay(rawEssay);

  return NextResponse.json({ essay: humanizedEssay });
}
