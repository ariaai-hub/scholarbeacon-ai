export { scrapeCampusReel, scrapeCampusReelAll, scrapeCampusReelFlorida } from "./campusreel";
export { scrapeBrowardMomCollective } from "./browardmomcollective";
export { scrapeScholarshipsAndGrants } from "./scholarshipsandgrants";
export { scrapeScholarships360 } from "./scholarships360";
export { scrapeNationalScholarships } from "./national";
export { scrapeFloridaScholarships } from "./florida";
export { scrapeBrowardEdFoundation } from "./browardfoundation";
export { scrapeHBCUScholarships } from "./hbcus";
export { scrapeCorporateScholarships } from "./corporate";
export { scrapeOrganizationalScholarships } from "./organizational";
export { scrapeSTEMTradeIntl } from "./stem";
export { scrapePrivateFoundations } from "./private";
export { scrapeAllStates } from "./states";
export { scrapeEasyAndLocal } from "./additional";
export { scrapeFinalBatch } from "./finalbatch";

import { scrapeCampusReelAll } from "./campusreel";
import { scrapeBrowardMomCollective } from "./browardmomcollective";
import { scrapeScholarshipsAndGrants } from "./scholarshipsandgrants";
import { Prisma } from "@prisma/client";

export type ScrapedScholarship = {
  name: string;
  amount: number;
  amountMax?: number;
  deadline: string | null;
  description: string;
  url: string;
  scrapedFrom: string;
  stateResidency: string[];
  county: string[];
  ethnicityNew?: string[];
  majorsNew?: string[];
  genderNew?: string[];
  minGpa?: number;
  maxIncome?: number;
  minCommunityHours?: number;
  dualEnrollmentOk?: boolean;
  gradYears?: number[];
};

export async function upsertScholarship(
  prisma: Prisma.TransactionClient,
  s: ScrapedScholarship
): Promise<boolean> {
  try {
    const existing = await prisma.scholarship.findUnique({
      where: { canonicalUrl: s.url },
    });

    const data: Prisma.ScholarshipCreateInput = {
      name: s.name,
      amount: s.amount,
      amountMax: s.amountMax ?? null,
      deadline: s.deadline ? new Date(s.deadline) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      applicationUrl: s.url,
      source: s.scrapedFrom || "manual",
      scrapedFrom: s.scrapedFrom,
      canonicalUrl: s.url,
      nameHash: s.name.toLowerCase().replace(/\s+/g, ""),
      eligibilityFingerprint: `${s.name}:${s.amount}`,
      stateResidencyNew: s.stateResidency,
      county: s.county,
      ethnicityNew: s.ethnicityNew ?? [],
      majorsNew: s.majorsNew ?? [],
      genderNew: s.genderNew ?? [],
      minGpa: s.minGpa ?? null,
      maxIncome: s.maxIncome ?? null,
      minCommunityHours: s.minCommunityHours ?? null,
      dualEnrollmentOk: s.dualEnrollmentOk ?? null,
      gradYears: s.gradYears ?? [],
    };

    if (existing) {
      await prisma.scholarship.update({
        where: { canonicalUrl: s.url },
        data,
      });
      return false; // not new
    } else {
      await prisma.scholarship.create({ data });
      return true; // new
    }
  } catch (err) {
    console.error("Upsert error for", s.url, err);
    return false;
  }
}

export interface ScrapeResult {
  source: string;
  total: number;
  newCount: number;
  error?: string;
}

export async function runAllScrapers(prisma: Prisma.TransactionClient) {
  const results: ScrapeResult[] = [];

  // CampusReel
  try {
    const items = await scrapeCampusReelAll(3);
    let newCount = 0;
    for (const item of items) {
      const isNew = await upsertScholarship(prisma, item);
      if (isNew) newCount++;
    }
    results.push({ source: "campusreel", total: items.length, newCount });
  } catch (err) {
    results.push({ source: "campusreel", total: 0, newCount: 0, error: String(err) });
  }

  // BrowardMomCollective
  try {
    const items = await scrapeBrowardMomCollective();
    let newCount = 0;
    for (const item of items) {
      const isNew = await upsertScholarship(prisma, item);
      if (isNew) newCount++;
    }
    results.push({ source: "browardmomcollective", total: items.length, newCount });
  } catch (err) {
    results.push({ source: "browardmomcollective", total: 0, newCount: 0, error: String(err) });
  }

  // ScholarshipsAndGrants
  try {
    const items = await scrapeScholarshipsAndGrants();
    let newCount = 0;
    for (const item of items) {
      const isNew = await upsertScholarship(prisma, item);
      if (isNew) newCount++;
    }
    results.push({ source: "sag", total: items.length, newCount });
  } catch (err) {
    results.push({ source: "sag", total: 0, newCount: 0, error: String(err) });
  }

  return results;
}
