import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type JsonArray = (string | number | boolean | object)[];
type Scholarship = Awaited<ReturnType<typeof prisma.scholarship.findMany>>[number];

// POST /api/match-simple — simplified matchmaking for personal dashboard (no auth)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      state,
      educationLevel,
      gpa,
      demographics = [] as string[],
      incomeBrackets = [] as string[],
      isFirstGeneration = false,
      hasLeadership = false,
      hasCommunityService = false,
      limit = 20,
    } = body;

    if (!state || !educationLevel) {
      return NextResponse.json(
        { error: "State and education level are required." },
        { status: 400 }
      );
    }

    const gpaNum = parseFloat(gpa) || 0;
    const targetEduSet = new Set([educationLevel, "ANY"]);

    let scholarships: Scholarship[];
    try {
      scholarships = await prisma.scholarship.findMany({
        take: 100,
        orderBy: { deadline: "asc" },
      });
    } catch (dbErr) {
      console.error("DB error:", dbErr);
      return NextResponse.json(
        { error: "Database not connected. Please try again later." },
        { status: 503 }
      );
    }

    const scored = scholarships
      .map((s) => {
        let score = 50;
        const reasons: string[] = [];

        const eduLevels = (s.educationLevel as string[]) || [];
        const eduMatch = eduLevels.some(
          (l: string) => targetEduSet.has(l) || l === "ANY"
        );
        if (!eduMatch) return null;

        const stateRes = (s.stateResidency as string[] | null) || [];
        if (stateRes.length > 0 && !stateRes.includes(state) && !stateRes.includes("ANY")) {
          return null;
        }

        if (s.deadline && new Date(s.deadline) < new Date()) return null;

        score += 20;
        reasons.push("Education level match");

        const minGpa = Number(s.gpaMin);
        if (!isNaN(minGpa)) {
          if (gpaNum >= minGpa) {
            score += 10;
            reasons.push(`GPA ${s.gpaMin}+`);
          }
        } else {
          score += 5;
          reasons.push("No GPA minimum");
        }

        const demoArr = (s.demographics as string[] | null) || [];
        if (demographics.length > 0 && demoArr.some((d: string) => demographics.includes(d))) {
          score += 15;
          reasons.push("Demographic match");
        }

        if (isFirstGeneration && demoArr.includes("FIRST_GENERATION")) {
          score += 10;
          reasons.push("First-generation eligible");
        }

        const incomeArr = (s.incomeBrackets as string[] | null) || [];
        if (incomeBrackets.length > 0 && incomeArr.some((i: string) => incomeBrackets.includes(i))) {
          score += 10;
          reasons.push("Income-eligible");
        }

        if (hasLeadership && demoArr.includes("LEADERSHIP")) {
          score += 5;
          reasons.push("Leadership recognized");
        }

        return {
          id: s.id,
          name: s.name,
          amount: s.amount,
          amountMax: s.amountMax,
          deadline: s.deadline,
          source: s.source,
          gpaMin: s.gpaMin ? String(s.gpaMin) : null,
          matchScore: Math.min(score, 99),
          matchReasons: reasons,
          educationLevel: eduLevels,
          citizenshipTypes: (s.citizenshipTypes as string[]) || [],
          applicationUrl: s.applicationUrl,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.matchScore - a!.matchScore)
      .slice(0, limit);

    return NextResponse.json({ matches: scored });
  } catch (err) {
    console.error("Match error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
