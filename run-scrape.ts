import { PrismaClient } from "@prisma/client";
import {
  scrapeNationalScholarships,
  scrapeScholarships360,
  scrapeBrowardMomCollective,
  scrapeBrowardEdFoundation,
  scrapeFloridaScholarships,
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
  ];

  for (const src of sources) {
    console.log(`Scraping ${src.name}...`);
    try {
      const items = await src.fn();
      let count = 0;
      for (const s of items) {
        const isNew = await upsertScholarship(prisma, s);
        if (isNew) count++;
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
