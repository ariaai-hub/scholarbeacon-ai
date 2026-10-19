import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/eligibility";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const source = searchParams.get("source");
    const minAmount = parseInt(searchParams.get("minAmount") || "0");
    const eligible = searchParams.get("eligible") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const sort = searchParams.get("sort") || "amount";

    // Get student profile (first/only)
    const profile = await prisma.discoveryProfile.findFirst();
    const profileMajors = profile?.majors.split(",").map((m) => m.trim()) ?? [];

    // Build where clause
    const where: Record<string, unknown> = {};
    if (source) where.scrapedFrom = source;
    if (minAmount > 0) where.amount = { gte: minAmount };
    where.isArchived = false;

    const scholarships = await prisma.scholarship.findMany({
      where,
      take: limit,
      orderBy:
        sort === "amount"
          ? { amount: "desc" }
          : sort === "deadline"
          ? { deadline: "asc" }
          : { amount: "desc" },
    });

    let results = scholarships.map((s) => {
      let matchScore = 50;
      let matchReasons: string[] = [];
      let hardFail = false;
      let hardFailReason: string | undefined;

      if (profile) {
        const result = calculateMatchScore(s, profile);
        matchScore = result.score;
        matchReasons = result.reasons;
        hardFail = result.hardFail;
        hardFailReason = result.hardFailReason;
      }

      return {
        id: s.id,
        name: s.name,
        amount: s.amount,
        amountMax: s.amountMax,
        deadline: s.deadline,
        source: s.scrapedFrom,
        url: s.applicationUrl,
        matchScore,
        matchReasons,
        hardFail,
        hardFailReason,
        minGpa: s.minGpa,
        stateResidency: s.stateResidencyNew,
        county: s.county,
        majors: s.majorsNew,
        ethnicity: s.ethnicityNew,
        description: "",
      };
    });

    if (eligible && profile) {
      results = results.filter((r) => !r.hardFail);
    }

    if (sort === "matchScore") {
      results.sort((a, b) => b.matchScore - a.matchScore);
    }

    return NextResponse.json({ scholarships: results });
  } catch (err) {
    console.error("Scholarship search error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
