import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ scholarshipId: string }>;
}

// POST /api/prefill/[scholarshipId]
export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scholarshipId } = await params;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found. Complete your profile first." },
      { status: 404 }
    );
  }

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: scholarshipId },
  });

  if (!scholarship) {
    return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
  }

  // Map student profile to common scholarship form fields
  const prefillData = {
    // Personal info
    fullName: profile.fullName,
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().split("T")[0] : null,
    email: null, // from auth
    phone: profile.phone,
    address: {
      street: null,
      city: profile.currentCity,
      state: profile.currentState,
      zipCode: profile.zipCode,
    },

    // Academic
    currentInstitution: profile.institutionName,
    currentGradeLevel: profile.educationLevel,
    gpa: profile.gpa ? Number(profile.gpa) : null,
    gpaScale: profile.gpaScale,
    intendedMajor: profile.intendedMajor,
    targetDegree: profile.targetDegree,
    classRank: profile.classRank,

    // Demographics
    gender: profile.gender,
    ethnicity: profile.raceEthnicity,
    citizenshipStatus: profile.citizenshipStatus,
    stateOfResidence: profile.stateOfResidence,

    // Financial
    householdIncome: profile.householdIncomeBracket,
    financialNeedLevel: profile.financialNeedLevel,
    firstGenerationCollegeStudent: profile.firstGenerationCollegeStudent,

    // Background
    singleParentHousehold: profile.singleParentHousehold,
    siblingInCollege: profile.siblingInCollege,
    veteranStatus: profile.veteranStatus,
    disabilityStatus: profile.disabilityStatus,
    geographicBackground: profile.geographicBackground,
    athleteStatus: profile.athleteStatus,

    // Extracurricular
    activities: profile.activities,
    leadershipPositions: profile.leadershipPositions,
    communityServiceHours: profile.communityServiceHours,
    communityServiceFocus: profile.communityServiceFocus,
    awardsAndHonors: profile.awardsAndHonors,
    workExperience: profile.workExperience,

    // Personal statement / essays (from profile)
    personalStatement: profile.whatToKnowAboutYou,
    mostSignificantChallenge: profile.mostSignificantChallenge,
    futureGoals: profile.futureGoal,
    whyNeedScholarship: profile.whyNeedScholarship,

    // Documents status
    hasResume: profile.hasResume,
    hasTranscript: profile.hasUnofficialTranscript,
    canGetRecommendations: profile.canGetRecommendationLetters,

    // Grad-specific
    undergraduateInstitution: profile.undergraduateInstitution,
    undergraduateGpa: profile.undergraduateGpa ? Number(profile.undergraduateGpa) : null,
    thesisTrack: profile.thesisTrack,
    researchAssistant: profile.researchAssistant,
    teachingAssistant: profile.teachingAssistant,
    yearsProfessionalExperience: profile.yearsProfessionalExperience,

    // International
    countryOfCitizenship: profile.countryOfCitizenship,
    countryOfOrigin: profile.countryOfOrigin,
    englishProficiency: profile.englishProficiencyScore,
    hasUSCitizenSponsor: profile.hasUSCitizenSponsor,

    // Application metadata
    scholarshipName: scholarship.name,
    scholarshipAmount: scholarship.amount,
    scholarshipDeadline: scholarship.deadline.toISOString(),
    scholarshipUrl: scholarship.applicationUrl,
  };

  return NextResponse.json({ prefillData });
}
