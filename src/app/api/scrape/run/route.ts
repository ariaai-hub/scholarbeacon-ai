import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAllScrapers } from "@/lib/scrapers/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { all } = body as { all?: boolean };

    const results = await prisma.$transaction(async (tx) => {
      if (all) {
        return runAllScrapers(tx);
      }
      // Source-specific scraping would go here if needed
      return [];
    });

    const totalNew = results.reduce((sum, r) => sum + r.newCount, 0);

    return NextResponse.json({
      success: true,
      totalNew,
      results,
    });
  } catch (err) {
    console.error("Scrape run error:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
