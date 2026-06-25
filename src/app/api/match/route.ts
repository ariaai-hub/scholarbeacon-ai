import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { minimaxChat } from "@/lib/minimax";
import { calculateProfileCompleteness } from "@/lib/profile-completeness";

// GET /api/match — return saved matches
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId, status: "SAVED" },
    include: { scholarship: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ matches: applications });
}

// POST /api/match — run matchmaking
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { profileId, limit = 20 } = body;

  // Get profile — either by profileId or current user's profile
  const profile = profileId
    ? await prisma.studentProfile.findUnique({ where: { id: profileId, userId } })
    : await prisma.studentProfile.findUnique({ where: { userId } });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Step 1: Enrich profile with MiniMax
  let profileEnrichmentTags: string[] = [];
  try {
    const profileSummary = {
      fullName: profile.fullName,
      educationLevel: profile.educationLevel,
      gpa: profile.gpa ? Number(profile.gpa) : null,
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
      intendedMajor: profile.intendedMajor,
      targetDegree: profile.targetDegree,
    };

    const messages = [
      {
        role: "user" as const,
        content: `You are a scholarship eligibility expert. Analyze this student profile and identify additional eligibility categories and background factors they may not have explicitly claimed. Return a JSON array of additional eligibility tags.

Student profile:
${JSON.stringify(profileSummary, null, 2)}

Return ONLY a valid JSON array of strings. Each string is a specific eligibility tag that qualifies this student for scholarships they may not know about.`,
      },
    ];

    const response = await minimaxChat(messages);
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      profileEnrichmentTags = JSON.parse(jsonMatch[0]);
      // Save enrichment tags
      await prisma.studentProfile.update({
        where: { id: profile.id },
        data: { enrichmentTags: profileEnrichmentTags as unknown as object },
      });
    }
  } catch (err) {
    console.error("MiniMax enrichment error:", err);
  }

  // Step 2: Build hard filters
  const now = new Date();
  const studentGpa = profile.gpa ? Number(profile.gpa) : 0;
  const studentGpaNormalized = profile.gpaScale === 5 ? studentGpa / 5 * 4 : studentGpa;

  // Step 3: Query scholarships with hard filters applied in DB
  const scholarships = await prisma.scholarship.findMany({
    where: {
      isArchived: false,
      deadline: { gt: now },
      educationLevel: { has: profile.educationLevel },
      citizenshipTypes: { has: profile.citizenshipStatus },
      OR: [
        { gpaMin: null },
        { gpaMin: { lte: studentGpaNormalized } },
      ],
    },
    take: Number(limit) * 3, // Fetch extra for re-ranking
    orderBy: { deadline: "asc" },
  });

  // Additional hard filter: GPA must be satisfied
  const filteredScholarships = scholarships.filter((s) => {
    if (s.gpaMin === null) return true;
    const scholarshipGpaMin = Number(s.gpaMin);
    return studentGpaNormalized >= scholarshipGpaMin;
  });

  // Step 4: Generate match reasoning for top candidates using MiniMax
  const topScholarships = filteredScholarships.slice(0, 20);
  const matchResults = await Promise.allSettled(
    topScholarships.map(async (scholarship, index) => {
      try {
        const reasoningResponse = await minimaxChat([
          {
            role: "user",
            content: `You are a scholarship expert. A student is applying for this scholarship. Generate a match reasoning block.

Student profile:
${JSON.stringify({
              fullName: profile.fullName,
              educationLevel: profile.educationLevel,
              gpa: studentGpaNormalized.toFixed(2),
              citizenshipStatus: profile.citizenshipStatus,
              householdIncomeBracket: profile.householdIncomeBracket,
              financialNeedLevel: profile.financialNeedLevel,
              firstGeneration: profile.firstGenerationCollegeStudent,
              raceEthnicity: profile.raceEthnicity,
              heritageTags: profile.heritageTags,
              veteranStatus: profile.veteranStatus,
              disabilityStatus: profile.disabilityStatus,
              geographicBackground: profile.geographicBackground,
              athleteStatus: profile.athleteStatus,
              enrichmentTags: profileEnrichmentTags,
              communityServiceHours: profile.communityServiceHours,
              intendedMajor: profile.intendedMajor,
              targetDegree: profile.targetDegree,
            }, null, 2)}

Scholarship:
${JSON.stringify({
              name: scholarship.name,
              amount: scholarship.amount,
              amountMax: scholarship.amountMax,
              deadline: scholarship.deadline,
              gpaMin: scholarship.gpaMin,
              majors: scholarship.majors,
              demographics: scholarship.demographics,
              incomeBrackets: scholarship.incomeBrackets,
              requiredDocs: scholarship.requiredDocs,
              essayPrompts: scholarship.essayPrompts,
              communityServiceRequired: scholarship.communityServiceRequired,
            }, null, 2)}

Generate a JSON object with these fields:
{
  "matchReasons": ["reason 1", "reason 2", "reason 3"],
  "requiredDocs": ["doc 1", "doc 2"],
  "essayPrompts": ["prompt 1", "prompt 2"],
  "strategicNote": "string",
  "difficulty": "LOW" | "MEDIUM" | "HIGH"
}

Return ONLY the JSON object.`,
          },
        ]);

        const rawResponse = reasoningResponse;

        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        let reasoning = {
          matchReasons: ["Strong eligibility match based on profile criteria"],
          requiredDocs: ["Transcript", "Personal statement"],
          essayPrompts: ["Tell us about yourself"],
          strategicNote: "Apply early to maximize your chances",
          difficulty: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
        };

        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            reasoning = {
              matchReasons: Array.isArray(parsed.matchReasons) ? parsed.matchReasons.slice(0, 3) : reasoning.matchReasons,
              requiredDocs: Array.isArray(parsed.requiredDocs) ? parsed.requiredDocs : reasoning.requiredDocs,
              essayPrompts: Array.isArray(parsed.essayPrompts) ? parsed.essayPrompts : reasoning.essayPrompts,
              strategicNote: parsed.strategicNote || reasoning.strategicNote,
              difficulty: ["LOW", "MEDIUM", "HIGH"].includes(parsed.difficulty) ? parsed.difficulty : reasoning.difficulty,
            };
          } catch {
            // Use defaults
          }
        }

        const daysUntilDeadline = Math.ceil(
          (scholarship.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          scholarship,
          rank: index + 1,
          matchReasons: reasoning.matchReasons,
          requiredDocs: reasoning.requiredDocs,
          essayPrompts: reasoning.essayPrompts,
          deadline: scholarship.deadline.toISOString(),
          daysUntilDeadline,
          strategicNote: reasoning.strategicNote,
          difficulty: reasoning.difficulty,
        };
      } catch (err) {
        console.error(`Error generating reasoning for scholarship ${scholarship.id}:`, err);
        return {
          scholarship,
          rank: index + 1,
          matchReasons: ["Profile matches eligibility criteria"],
          requiredDocs: ["Transcript", "Personal statement"],
          essayPrompts: [],
          deadline: scholarship.deadline.toISOString(),
          daysUntilDeadline: Math.ceil(
            (scholarship.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          ),
          strategicNote: "Apply early",
          difficulty: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
        };
      }
    })
  );

  const matches = matchResults
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter(Boolean);

  // Sort by deadline (most urgent first) and assign ranks
  matches.sort((a, b) => a!.daysUntilDeadline - b!.daysUntilDeadline);
  matches.forEach((m, i) => { if (m) m.rank = i + 1; });

  // Save matches to applications table
  for (const match of matches.slice(0, Number(limit))) {
    if (!match) continue;
    await prisma.application.upsert({
      where: {
        userId_scholarshipId: {
          userId,
          scholarshipId: match.scholarship.id,
        },
      },
      create: {
        userId,
        scholarshipId: match.scholarship.id,
        status: "SAVED",
      },
      update: {},
    });
  }

  return NextResponse.json({
    matches: matches.slice(0, Number(limit)),
    totalMatched: filteredScholarships.length,
    profileEnrichmentTags,
  });
}
