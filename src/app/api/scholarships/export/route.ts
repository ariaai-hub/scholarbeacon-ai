import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/eligibility";

export async function GET(req: NextRequest) {
  try {
    const profile = await prisma.discoveryProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "No student profile found" }, { status: 404 });
    }

    const scholarships = await prisma.scholarship.findMany({
      where: { isArchived: false },
      orderBy: { amount: "desc" },
      take: 5000,
    });

    const eligible = scholarships
      .map((s) => {
        const result = calculateMatchScore(s, profile);
        if (result.hardFail) return null;
        return {
          name: s.name,
          amount: s.amount,
          amountMax: s.amountMax,
          deadline: new Date(s.deadline).toLocaleDateString(),
          matchPercent: result.score,
          url: s.applicationUrl,
          source: s.scrapedFrom,
        };
      })
      .filter(Boolean) as Array<{
      name: string; amount: number; amountMax?: number | null;
      deadline: string; matchPercent: number; url: string; source: string;
    }>;

    // Build CSV
    const header = "Name,Amount,Max Amount,Deadline,Match %,URL,Source\n";
    const rows = eligible
      .map(
        (e) =>
          `"${e.name.replace(/"/g, '""')}","${e.amount}","${e.amountMax ?? e.amount}","${e.deadline}","${e.matchPercent}","${e.url}","${e.source}"`
      )
      .join("\n");

    const csv = header + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=eligible-scholarships.csv",
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
