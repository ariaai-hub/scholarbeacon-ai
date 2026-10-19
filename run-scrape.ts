import { PrismaClient } from "@prisma/client";
import {
  scrapeNationalScholarships,
  scrapeScholarships360,
  scrapeBrowardMomCollective,
  scrapeBrowardEdFoundation,
  scrapeFloridaScholarships,
  scrapeHBCUScholarships,
  scrapeCorporateScholarships,
  scrapeOrganizationalScholarships,
  scrapeSTEMTradeIntl,
  scrapePrivateFoundations,
} from "./src/lib/scrapers/index";
import { upsertScholarship } from "./src/lib/scrapers/index";

const prisma = new PrismaClient();

async function main() {
  const sources = [
    { name: "National Scholarships", fn: scrapeNationalScholarships },
    { name: "Scholarships360", fn: scrapeScholarships360 },
    { name: "BrowardMomCollective", fn: scrapeBrowardMomCollective },
    { name: "Broward Ed Foundation", fn: scrapeBrowardEdFoundation },
    { name: "Florida Programs & Universities", fn: scrapeFloridaScholarships },
    { name: "HBCU Scholarships", fn: scrapeHBCUScholarships },
    { name: "Corporate Scholarships", fn: scrapeCorporateScholarships },
    { name: "Organizational Scholarships", fn: scrapeOrganizationalScholarships },
    { name: "STEM / Trade / Study Abroad", fn: scrapeSTEMTradeIntl },
    { name: "Private Foundations", fn: scrapePrivateFoundations },
  ];

  let grandTotal = 0;
  for (const src of sources) {
    console.log(`Scraping ${src.name}...`);
    try {
      const items = await src.fn();
      let count = 0;
      for (const s of items) {
        const isNew = await upsertScholarship(prisma, s);
        if (isNew) { count++; grandTotal++; }
      }
      console.log(`  Added ${count} new (${items.length} found)`);
    } catch (e) {
      console.log(`  Error: ${e instanceof Error ? e.message : e}`);
    }
  }

  const total = await prisma.scholarship.count();
  console.log(`\nTotal in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch(console.error);
