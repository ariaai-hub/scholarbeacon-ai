import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { minimaxChat } from "@/lib/minimax";

// POST /api/enrich
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { profileId } = body;

  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { id: profileId, userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Build student profile summary for enrichment
  const profileSummary = {
    fullName: profile.fullName,
    educationLevel: profile.educationLevel,
    gpa: profile.gpa,
    gpaScale: profile.gpaScale,
    citizenshipStatus: profile.citizenshipStatus,
    householdIncomeBracket: profile.householdIncomeBracket,
    financialNeedLevel: profile.financialNeedLevel,
    firstGenerationCollegeStudent: profile.firstGenerationCollegeStudent,
    raceEthnicity: profile.raceEthnicity,
    heritageTags: profile.heritageTags,
    veteranStatus: profile.veteranStatus,
    disabilityStatus: profile.disabilityStatus,
    geographicBackground: profile.geographicBackground,
    athleteStatus: profile.athleteStatus,
    singleParentHousehold: profile.singleParentHousehold,
    siblingInCollege: profile.siblingInCollege,
    parentHighestEducation: profile.parentHighestEducation,
    communityServiceHours: profile.communityServiceHours,
    activities: profile.activities,
    intendedMajor: profile.intendedMajor,
    targetDegree: profile.targetDegree,
    mostSignificantChallenge: profile.mostSignificantChallenge,
    futureGoal: profile.futureGoal,
    workExperience: profile.workExperience,
  };

  const messages = [
    {
      role: "user" as const,
      content: `You are a scholarship eligibility expert. Analyze this student profile and identify additional eligibility categories and background factors they may not have explicitly claimed. Return a JSON array of additional eligibility tags.

Student profile:
${JSON.stringify(profileSummary, null, 2)}

Return ONLY a valid JSON array of strings. Each string is a specific eligibility tag that qualifies this student for scholarships they may not know about. Examples: "First-generation college student", "Children of union members", "Women in STEM", "Rural student", "Community college transfer", "Displaced worker dependent".`,
    },
  ];

  let enrichmentTags: string[] = [];
  try {
    const response = await minimaxChat(messages);
    // Try to extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      enrichmentTags = JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error("MiniMax enrichment error:", err);
    // Return empty on failure — don't block the user
  }

  // Save enrichment tags to profile
  await prisma.studentProfile.update({
    where: { id: profileId },
    data: { enrichmentTags: enrichmentTags as unknown as object },
  });

  return NextResponse.json({ enrichmentTags });
}
