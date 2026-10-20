import { PrismaClient } from "@prisma/client";
import { scrapeApplicable, scrapeBatch2, scrapeBatch3 } from "./src/lib/scrapers/index";
import { upsertScholarship } from "./src/lib/scrapers/index";

const prisma = new PrismaClient();

async function main() {
  console.log("Running all scrapers...");

  const scrapers = [
    { name: "Applicable", fn: scrapeApplicable },
    { name: "Batch2", fn: scrapeBatch2 },
    { name: "Batch3", fn: scrapeBatch3 },
  ];

  let totalNew = 0;
  for (const { name, fn } of scrapers) {
    console.log(`\nScraping ${name}...`);
    const items = await fn();
    let newCount = 0;
    for (const s of items) {
      const isNew = await upsertScholarship(prisma, s);
      if (isNew) newCount++;
    }
    console.log(`  ${items.length} found, ${newCount} new`);
    totalNew += newCount;
  }

  const total = await prisma.scholarship.count();
  console.log(`\nTotal in DB: ${total} | New added this run: ${totalNew}`);
  await prisma.$disconnect();
}

main().catch(console.error);
