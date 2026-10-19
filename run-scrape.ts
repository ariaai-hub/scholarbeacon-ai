import { PrismaClient } from "@prisma/client";
import { scrapeFocused } from "./src/lib/scrapers/index";
import { upsertScholarship } from "./src/lib/scrapers/index";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding focused scholarships...");
  const items = await scrapeFocused();
  let count = 0;
  for (const s of items) {
    const isNew = await upsertScholarship(prisma, s);
    if (isNew) count++;
  }
  console.log(`Added ${count} new (${items.length} total)`);

  const total = await prisma.scholarship.count();
  console.log(`Total in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch(console.error);
