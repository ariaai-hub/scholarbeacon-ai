import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
  const scholarships = await prisma.scholarship.findMany({
    take: 100,
    orderBy: { deadline: "asc" },
  });

  console.log("=== FULL SCHOLARSHIP INVENTORY ===\n");
  scholarships.forEach((s) => {
    console.log("---");
    console.log("NAME:", s.name);
    console.log("AMOUNT: $" + s.amount.toLocaleString(), s.amountMax ? "- $" + s.amountMax.toLocaleString() : "");
    console.log("DEADLINE:", new Date(s.deadline).toLocaleDateString());
    console.log("EDU LEVELS:", JSON.stringify(s.educationLevel));
    console.log("STATE RES:", JSON.stringify(s.stateResidency));
    console.log("GPA MIN:", s.gpaMin);
    console.log("DEMOGRAPHICS:", JSON.stringify(s.demographics));
    console.log("INCOME:", JSON.stringify(s.incomeBrackets));
    console.log("SOURCE:", s.source);
    console.log("URL:", s.applicationUrl);
  });

  await prisma.$disconnect();
}
run().catch(console.error);
