-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "county" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "dualEnrollmentOk" BOOLEAN,
ADD COLUMN     "ethnicityNew" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "genderNew" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "gradYears" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "majorsNew" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "maxIncome" INTEGER,
ADD COLUMN     "minCommunityHours" INTEGER,
ADD COLUMN     "minGpa" DOUBLE PRECISION,
ADD COLUMN     "scrapedFrom" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "stateResidencyNew" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "DiscoveryProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Shomari Jr.',
    "state" TEXT NOT NULL DEFAULT 'FL',
    "county" TEXT NOT NULL DEFAULT 'Broward',
    "city" TEXT NOT NULL DEFAULT 'Miramar',
    "school" TEXT NOT NULL DEFAULT 'Everglades High School',
    "gradYear" INTEGER NOT NULL DEFAULT 2027,
    "ethnicity" TEXT NOT NULL DEFAULT 'African American',
    "gender" TEXT NOT NULL DEFAULT 'Male',
    "gpa" DOUBLE PRECISION NOT NULL DEFAULT 3.53,
    "weightedGpa" DOUBLE PRECISION NOT NULL DEFAULT 4.98,
    "satScore" INTEGER NOT NULL DEFAULT 1320,
    "income" INTEGER NOT NULL DEFAULT 50000,
    "majors" TEXT NOT NULL DEFAULT 'Business,Finance,Entrepreneurship',
    "communityHours" INTEGER NOT NULL DEFAULT 255,
    "dualEnrollment" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscoveryProfile_pkey" PRIMARY KEY ("id")
);
