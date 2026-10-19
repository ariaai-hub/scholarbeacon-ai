import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePriorityScore, calculateMatchScore } from "@/lib/eligibility";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const limit = parseInt(searchParams.get("limit") || "500");
    const minAmount = parseInt(searchParams.get("minAmount") || "0");

    const profile = await prisma.discoveryProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "No student profile found" }, { status: 404 });
    }

    const where: Record<string, unknown> = {
      isArchived: false,
    };
    if (minAmount > 0) where.amount = { gte: minAmount };

    const scholarships = await prisma.scholarship.findMany({
      where,
      take: 2000, // get many to sort/filter
    });

    const scored = scholarships
      .map((s) => {
        const matchResult = calculateMatchScore(s, profile);
        if (matchResult.hardFail) return null;
        const priorityScore = calculatePriorityScore(s, profile);
        return {
          id: s.id,
          name: s.name,
          amount: s.amount,
          amountMax: s.amountMax,
          deadline: s.deadline,
          source: s.scrapedFrom,
          url: s.applicationUrl,
          matchScore: matchResult.score,
          matchReasons: matchResult.reasons,
          priorityScore,
          minGpa: s.minGpa,
          stateResidency: s.stateResidencyNew,
          county: s.county,
          majors: s.majorsNew,
          ethnicity: s.ethnicityNew,
        };
      })
      .filter(Boolean) as Array<{
      id: string; name: string; amount: number; amountMax?: number | null;
      deadline: Date; source: string; url: string; matchScore: number;
      matchReasons: string[]; priorityScore: number; minGpa?: number | null;
      stateResidency: string[]; county: string[]; majors: string[]; ethnicity: string[];
    }>;

    scored.sort((a, b) => b.priorityScore - a.priorityScore);

    const top = scored.slice(0, limit);

    return NextResponse.json({ scholarships: top, total: scored.length });
  } catch (err) {
    console.error("Prioritized list error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
