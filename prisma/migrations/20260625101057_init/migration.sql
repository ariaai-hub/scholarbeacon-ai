-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'PARENT', 'INSTITUTION_ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SAVED', 'APPLIED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'INDIVIDUAL_MONTHLY', 'FAMILY_MONTHLY', 'INDIVIDUAL_ANNUAL', 'FAMILY_ANNUAL', 'INSTITUTION');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HS_JUNIOR', 'HS_SENIOR', 'COMMUNITY_COLLEGE', 'UNDERGRAD_YEAR_1', 'UNDERGRAD_YEAR_2', 'UNDERGRAD_YEAR_3', 'UNDERGRAD_YEAR_4', 'GRAD_MASTERS', 'GRAD_PHD', 'GRAD_PROFESSIONAL', 'NON_DEGREE', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('BA', 'BS', 'MA', 'MS', 'PHD', 'JD', 'MD', 'MBA', 'DDS', 'PharmD', 'MFA', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "CitizenshipType" AS ENUM ('US_CITIZEN', 'PERMANENT_RESIDENT', 'F1_STUDENT', 'J1_EXCHANGE', 'H1B_WORKER', 'OPT', 'CPT', 'DACA', 'TPS', 'ASYLUM', 'REFUGEE', 'OTHER');

-- CreateEnum
CREATE TYPE "IncomeBracket" AS ENUM ('UNDER_15000', 'BRACKET_15000_30000', 'BRACKET_30000_50000', 'BRACKET_50000_75000', 'BRACKET_75000_100000', 'OVER_100000', 'DECLINE_TO_STATE');

-- CreateEnum
CREATE TYPE "FinancialNeedLevel" AS ENUM ('LOW', 'MODERATE', 'SIGNIFICANT', 'SEVERE');

-- CreateEnum
CREATE TYPE "GeographicType" AS ENUM ('RURAL', 'URBAN', 'SUBURBAN');

-- CreateEnum
CREATE TYPE "AthleteStatus" AS ENUM ('NONE', 'VARSITY', 'DIVISION_1', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "DemographicTag" AS ENUM ('FIRST_GENERATION', 'SINGLE_PARENT', 'VETERAN', 'DISABILITY', 'RURAL', 'URBAN', 'LOW_INCOME', 'DISPLACED_WORKER', 'INCARCERATED', 'FOSTER_CARE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "institutionId" TEXT,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "parentalConsent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "currentCity" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "phone" TEXT,
    "educationLevel" "EducationLevel" NOT NULL,
    "institutionName" TEXT,
    "gpa" DECIMAL(65,30),
    "gpaScale" INTEGER NOT NULL DEFAULT 4,
    "classRank" INTEGER,
    "standardizedTests" JSONB,
    "collegeCreditsEarned" INTEGER,
    "intendedMajor" TEXT,
    "targetDegree" "DegreeType",
    "raceEthnicity" JSONB,
    "gender" TEXT,
    "nationality" TEXT,
    "citizenshipStatus" "CitizenshipType" NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "zipCode" TEXT,
    "householdIncomeBracket" "IncomeBracket" NOT NULL,
    "financialNeedLevel" "FinancialNeedLevel" NOT NULL,
    "firstGenerationCollegeStudent" BOOLEAN NOT NULL DEFAULT false,
    "responsibleForContributingToFamilyIncome" BOOLEAN NOT NULL DEFAULT false,
    "singleParentHousehold" BOOLEAN NOT NULL DEFAULT false,
    "siblingInCollege" BOOLEAN NOT NULL DEFAULT false,
    "parentHighestEducation" TEXT,
    "veteranStatus" BOOLEAN NOT NULL DEFAULT false,
    "disabilityStatus" BOOLEAN NOT NULL DEFAULT false,
    "heritageTags" JSONB,
    "religiousAffiliation" TEXT,
    "geographicBackground" "GeographicType",
    "athleteStatus" "AthleteStatus" NOT NULL DEFAULT 'NONE',
    "activities" JSONB,
    "leadershipPositions" JSONB,
    "communityServiceHours" INTEGER,
    "communityServiceFocus" JSONB,
    "workExperience" JSONB,
    "awardsAndHonors" JSONB,
    "specialSkills" JSONB,
    "mostSignificantChallenge" TEXT,
    "whatToKnowAboutYou" TEXT,
    "futureGoal" TEXT,
    "whyNeedScholarship" TEXT,
    "circumstancesToExplain" TEXT,
    "undergraduateInstitution" TEXT,
    "undergraduateGpa" DECIMAL(65,30),
    "thesisTrack" BOOLEAN NOT NULL DEFAULT false,
    "researchAssistant" BOOLEAN NOT NULL DEFAULT false,
    "teachingAssistant" BOOLEAN NOT NULL DEFAULT false,
    "publications" JSONB,
    "yearsProfessionalExperience" INTEGER,
    "lettersOfRecommendationReady" BOOLEAN NOT NULL DEFAULT false,
    "seekingFullFunding" BOOLEAN NOT NULL DEFAULT false,
    "countryOfCitizenship" TEXT,
    "visaType" "CitizenshipType",
    "countryOfOrigin" TEXT,
    "hasUSCitizenSponsor" BOOLEAN NOT NULL DEFAULT false,
    "sponsorType" TEXT,
    "englishProficiencyScore" JSONB,
    "currentlyEmployedUS" BOOLEAN NOT NULL DEFAULT false,
    "employmentType" TEXT,
    "homeCountryScholarshipEligibility" BOOLEAN NOT NULL DEFAULT false,
    "planToReturnToHomeCountry" BOOLEAN,
    "hasResume" BOOLEAN NOT NULL DEFAULT false,
    "hasUnofficialTranscript" BOOLEAN NOT NULL DEFAULT false,
    "canGetRecommendationLetters" BOOLEAN NOT NULL DEFAULT false,
    "canCertifyDocuments" BOOLEAN NOT NULL DEFAULT false,
    "hasReliableComputerAndInternet" BOOLEAN NOT NULL DEFAULT true,
    "profileCompletenessScore" INTEGER NOT NULL DEFAULT 0,
    "enrichmentTags" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "amountMax" INTEGER,
    "deadline" TIMESTAMP(3) NOT NULL,
    "applicationUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastVerifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requiredDocs" JSONB,
    "essayPrompts" JSONB,
    "educationLevel" "EducationLevel"[],
    "citizenshipTypes" "CitizenshipType"[],
    "gpaMin" DECIMAL(65,30),
    "gpaMax" DECIMAL(65,30),
    "majors" JSONB,
    "demographics" JSONB,
    "incomeBrackets" JSONB,
    "gender" TEXT,
    "ethnicity" JSONB,
    "stateResidency" JSONB,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "militaryAffiliation" JSONB,
    "communityServiceRequired" BOOLEAN NOT NULL DEFAULT false,
    "disabilityStatusRequired" BOOLEAN NOT NULL DEFAULT false,
    "religiousAffiliation" JSONB,
    "homeCountry" TEXT,
    "englishProficiency" BOOLEAN NOT NULL DEFAULT false,
    "postGraduationPlans" TEXT,
    "canonicalUrl" TEXT NOT NULL,
    "nameHash" TEXT NOT NULL,
    "eligibilityFingerprint" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "sopTags" JSONB,
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "sponsorInstitutionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scholarshipId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SAVED',
    "appliedAt" TIMESTAMP(3),
    "awardedAmount" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodEnd" TIMESTAMP(3),
    "annual" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "seatCount" INTEGER NOT NULL DEFAULT 0,
    "stripeCustomerId" TEXT,
    "customBrandingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyAccount" (
    "id" TEXT NOT NULL,
    "parentUserId" TEXT NOT NULL,
    "studentUserIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_canonicalUrl_key" ON "Scholarship"("canonicalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_scholarshipId_key" ON "Application"("userId", "scholarshipId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyAccount_parentUserId_key" ON "FamilyAccount"("parentUserId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyAccount" ADD CONSTRAINT "FamilyAccount_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
