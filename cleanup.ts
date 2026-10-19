import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Criteria for Shomari Jr.:
// - HS Senior, Broward County, FL
// - African American, Male
// - GPA 3.53 UW / 4.98 weighted, SAT 1320
// - Business/Finance major
// - Income ~$50K
// - 255 community service hours
// - No specific employer affiliations, no specific ethnic groups besides African American

async function main() {
  console.log("Before cleanup:", await prisma.scholarship.count());

  // Delete out-of-state programs (only if not nationally open)
  // Keep: FL residency OR no state restriction
  const outOfState = await prisma.scholarship.findMany({
    where: {
      AND: [
        { scrapedFrom: "all-states" },
        { stateResidencyNew: { isEmpty: false } },
      ],
    },
  });

  let removed = 0;
  for (const s of outOfState) {
    const states: string[] = (s.stateResidencyNew as string[]) || [];
    const isFL = states.includes("FL");
    const isNational = states.length === 0;
    if (!isFL && !isNational) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed out-of-state specific: ${removed}`);

  // Delete organizational scholarships requiring specific affiliations
  // Remove: scholarships from organizational scraper that require:
  // - Moose Lodge membership, VFW membership, American Legion, DAR ancestry,
  // - Knights of Columbus, Rotary, Lions, Kiwanis, Jaycees
  const orgAffiliation = await prisma.scholarship.findMany({
    where: {
      scrapedFrom: "organizational",
    },
  });

  removed = 0;
  for (const s of orgAffiliation) {
    const name = s.name.toLowerCase();
    const desc = s.name.toLowerCase() + " " + (s.description || "").toLowerCase();
    // Remove anything requiring membership/affiliation we can't verify
    if (
      name.includes("moose") ||
      name.includes("vfw") ||
      name.includes("american legion") ||
      name.includes("daughters of the american revolution") ||
      name.includes("dar ") ||
      name.includes("knights of columbus") ||
      name.includes("rotary") && !name.includes("rotc") ||
      name.includes("lions club") && !name.includes("college") ||
      name.includes("kiwanis") ||
      name.includes("jaycees") ||
      name.includes("elks") && !name.includes("most valuable") ||
      name.includes("bennington") ||
      name.includes("youngarts") ||
      name.includes("course hero") ||
      name.includes("writer") && name.includes("digest")
    ) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed affiliation-gated organizational: ${removed}`);

  // Delete corporate scholarships requiring specific employer/family affiliation
  const corpList = await prisma.scholarship.findMany({
    where: { scrapedFrom: "corporate" },
  });
  removed = 0;
  for (const s of corpList) {
    const name = s.name.toLowerCase();
    const desc = (s.description || "").toLowerCase();
    // Remove if requires parent/guardian employee at specific company
    if (
      desc.includes("parent works for") ||
      desc.includes("parent employed") ||
      desc.includes("employee of") && !desc.includes("no employee") ||
      desc.includes("employer of") && !desc.includes("no employer") ||
      name.includes("dell foundation") && !name.includes("dell") ||
      name.includes("apple") && name.includes("college scholar") ||
      name.includes("target") && !name.includes("future engineer") ||
      name.includes("kroger") ||
      name.includes("walmart hbc") ||
      name.includes("johnson & johnson") && !name.includes("johnson-lancaster") ||
      name.includes("pfizer") && !name.includes("pfizer scholar grant") ||
      name.includes("cvs health") && !name.includes("community") ||
      name.includes("unitedhealth") ||
      name.includes("lockheed") && !name.includes("lockheed martin") ||
      name.includes("northrop grumman") && !name.includes("cybersecurity") ||
      name.includes("raytheon") && !name.includes("technologies") ||
      name.includes("hartford") ||
      name.includes("pnc") ||
      name.includes("wells fargo") ||
      name.includes("bank of america student leaders") && !name.includes("bank of america") ||
      name.includes("pncmakes") ||
      name.includes("ge医疗") ||
      name.includes("ibm quantum") ||
      name.includes("actuarial") ||
      name.includes("salesforce foundation") ||
      name.includes("jpmorgan chase") && !name.includes("jpmorgan")
    ) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed employer-gated corporate: ${removed}`);

  // Delete STEM scraper entries requiring specific fields he doesn't have
  const stemList = await prisma.scholarship.findMany({
    where: { scrapedFrom: "stem-trade-intl" },
  });
  removed = 0;
  for (const s of stemList) {
    const name = s.name.toLowerCase();
    const desc = (s.description || "").toLowerCase();
    // Remove if requires: trade union membership, specific STEM focus he doesn't have
    if (
      name.includes("ibew") ||
      name.includes("pipefitting") ||
      name.includes("plumbing") ||
      name.includes("hvac") && !name.includes("engineering") ||
      name.includes("electrical apprenticeship") ||
      name.includes("construction management") && !name.includes("engineering") ||
      name.includes("skilled trades") ||
      name.includes("actuarial") ||
      name.includes("asm materials") ||
      name.includes("meteorological") ||
      name.includes("cybercorps") ||
      name.includes("nsa stokes") ||
      name.includes("nist") ||
      name.includes("nsf grfp") ||
      name.includes("goldwater") ||
      name.includes("boren") ||
      name.includes("freeman asia") ||
      name.includes("gilman") ||
      name.includes("critical language") ||
      name.includes("fulbright") ||
      name.includes("study abroad") && !name.includes("study abroad") // keep need-based study abroad
    ) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed STEM/trade/intl gated: ${removed}`);

  // Delete private foundations with very specific criteria not met
  const privList = await prisma.scholarship.findMany({
    where: { scrapedFrom: "private-foundations" },
  });
  removed = 0;
  for (const s of privList) {
    const name = s.name.toLowerCase();
    const desc = (s.description || "").toLowerCase();
    if (
      name.includes("islamic scholarship fund") ||
      name.includes("muslim youth") ||
      name.includes("american islamic") ||
      name.includes("catholic") && !name.includes("community") ||
      name.includes("jewish community") ||
      name.includes("moose") ||
      name.includes("vfw") ||
      name.includes("american legion") ||
      name.includes("templeton") ||
      name.includes("greenbrier") ||
      name.includes("hite foundation") ||
      name.includes("alice tully") ||
      name.includes("kellogg") && !name.includes("college") ||
      name.includes("ford foundation fellowship") && !name.includes("ford") ||
      name.includes("udall") ||
      name.includes("chicago community") ||
      name.includes("silicon valley") ||
      name.includes("new york community") ||
      name.includes("des moines") ||
      name.includes("assumption college") ||
      name.includes("edmund's") ||
      name.includes("franklin d roosevelt") ||
      name.includes("harry truman") ||
      name.includes("james madison") ||
      name.includes("whirlpool") ||
      name.includes("mayo clinic") ||
      name.includes("lowe's trade")
    ) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed gated private foundations: ${removed}`);

  // Delete final-batch entries with specific criteria
  const finalList = await prisma.scholarship.findMany({
    where: { scrapedFrom: "final-batch" },
  });
  removed = 0;
  for (const s of finalList) {
    const name = s.name.toLowerCase();
    const desc = (s.description || "").toLowerCase();
    if (
      name.includes("aia") ||
      name.includes("americorps") ||
      name.includes("peace corps") ||
      name.includes("city year") ||
      name.includes("teach for america") ||
      name.includes("jumpstart") ||
      name.includes("public allies") ||
      name.includes("small business administration") ||
      name.includes("venmo small business") ||
      name.includes("venmo") ||
      name.includes("environmental protection agency") ||
      name.includes("sierra club") ||
      name.includes("audubon") ||
      name.includes("national wildlife federation") ||
      name.includes("nea ") && !name.includes("association") ||
      name.includes("retail industry") ||
      name.includes("appraisal institute") ||
      name.includes("american hotel") ||
      name.includes("national restaurant association") ||
      name.includes("yale national") ||
      name.includes("harvard financial aid") ||
      name.includes("princeton") && !name.includes("princeton review") ||
      name.includes("stanford") && !name.includes("stanford review") ||
      name.includes("columbia university") ||
      name.includes("mit scholarship") ||
      name.includes("caltech") ||
      name.includes("duke university") ||
      name.includes("johns hopkins") ||
      name.includes("uchicago") && !name.includes("chicago") ||
      name.includes("university of miami stamps") ||
      name.includes("ringling") ||
      name.includes("zocalo") ||
      name.includes("schwab foundation") ||
      name.includes("doSomething") ||
      name.includes("civic hall") ||
      name.includes("pay it forward")
    ) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed gated final-batch: ${removed}`);

  // Delete overflow entries with specific criteria
  const overflowList = await prisma.scholarship.findMany({
    where: { scrapedFrom: "overflow" },
  });
  removed = 0;
  for (const s of overflowList) {
    const name = s.name.toLowerCase();
    const desc = (s.description || "").toLowerCase();
    if (
      name.includes("tuskegee") && !name.includes("tuskegee") ||
      name.includes("spelman merit") && !name.includes("spelman") ||
      name.includes("morehouse king") && !name.includes("morehouse") ||
      name.includes("hampton university") && !name.includes("hampton") ||
      name.includes("clark atlanta") && !name.includes("clark atlanta") ||
      name.includes("chick-fil-a") ||
      name.includes("wendy's") ||
      name.includes("darden") ||
      name.includes("marriott") && !name.includes("hospitality") ||
      name.includes("hilton") && !name.includes("scholarship") ||
      name.includes("georgia hope private") ||
      name.includes("alabama veteran") ||
      name.includes("stumbleupon") ||
      name.includes("zamora") ||
      name.includes("hispanic heritage foundation") ||
      name.includes("intel international") ||
      name.includes("siemens competition") ||
      name.includes("regeneron") ||
      name.includes("davidson institute") ||
      name.includes("american dental") ||
      name.includes("american library") ||
      name.includes("afl-cio") ||
      name.includes("operating engineers") ||
      name.includes("laborers") ||
      name.includes("teamsters") ||
      name.includes("actors equity") ||
      name.includes("ascap") ||
      name.includes("recording academy") ||
      name.includes("united nations")
    ) {
      await prisma.scholarship.delete({ where: { id: s.id } });
      removed++;
    }
  }
  console.log(`Removed gated overflow: ${removed}`);

  const total = await prisma.scholarship.count();
  console.log(`\nAfter cleanup: ${total} scholarships`);

  // Show remaining by source
  const bySource = await prisma.scholarship.groupBy({
    by: ['scrapedFrom'],
    _count: true,
  });
  console.log("\nBy source:");
  for (const s of bySource) {
    console.log(`  ${s.scrapedFrom}: ${s._count}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
