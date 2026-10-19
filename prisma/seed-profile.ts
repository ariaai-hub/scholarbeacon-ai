import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding student profile...");

  const profile = await prisma.discoveryProfile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      name: "Shomari Jr.",
      state: "FL",
      county: "Broward",
      city: "Miramar",
      school: "Everglades High School",
      gradYear: 2027,
      ethnicity: "African American",
      gender: "Male",
      gpa: 3.53,
      weightedGpa: 4.98,
      satScore: 1320,
      income: 50000,
      majors: "Business,Finance,Entrepreneurship",
      communityHours: 255,
      dualEnrollment: true,
    },
  });

  console.log("Seeded:", profile);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
