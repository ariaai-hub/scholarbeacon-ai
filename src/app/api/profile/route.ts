import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProfileCompleteness } from "@/lib/profile-completeness";

// GET /api/profile
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { studentProfile: true, subscription: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const completenessScore =
    user.studentProfile
      ? calculateProfileCompleteness(user.studentProfile as Parameters<typeof calculateProfileCompleteness>[0])
      : 0;

  return NextResponse.json({
    ...user,
    profileCompletenessScore: completenessScore,
  });
}

// POST /api/profile — create or update
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Build profile data, stripping unknown fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileData: any = {};

  const scalarFields = [
    "fullName", "dateOfBirth", "currentCity", "currentState", "phone",
    "educationLevel", "institutionName", "gpa", "gpaScale", "classRank",
    "standardizedTests", "collegeCreditsEarned", "intendedMajor", "targetDegree",
    "raceEthnicity", "gender", "nationality", "citizenshipStatus",
    "stateOfResidence", "zipCode", "householdIncomeBracket", "financialNeedLevel",
    "firstGenerationCollegeStudent", "responsibleForContributingToFamilyIncome",
    "singleParentHousehold", "siblingInCollege", "parentHighestEducation",
    "veteranStatus", "disabilityStatus", "heritageTags", "religiousAffiliation",
    "geographicBackground", "athleteStatus",
    "activities", "leadershipPositions", "communityServiceHours",
    "communityServiceFocus", "workExperience", "awardsAndHonors", "specialSkills",
    "mostSignificantChallenge", "whatToKnowAboutYou", "futureGoal",
    "whyNeedScholarship", "circumstancesToExplain",
    "undergraduateInstitution", "undergraduateGpa", "thesisTrack",
    "researchAssistant", "teachingAssistant", "publications",
    "yearsProfessionalExperience", "lettersOfRecommendationReady", "seekingFullFunding",
    "countryOfCitizenship", "visaType", "countryOfOrigin", "hasUSCitizenSponsor",
    "sponsorType", "englishProficiencyScore", "currentlyEmployedUS",
    "employmentType", "homeCountryScholarshipEligibility", "planToReturnToHomeCountry",
    "hasResume", "hasUnofficialTranscript", "canGetRecommendationLetters",
    "canCertifyDocuments", "hasReliableComputerAndInternet",
  ];

  for (const field of scalarFields) {
    if (field in body) {
      profileData[field] = body[field];
    }
  }

  // Handle date conversion
  if (profileData.dateOfBirth) {
    profileData.dateOfBirth = new Date(profileData.dateOfBirth);
  }
  if (profileData.undergraduateGpa) {
    profileData.undergraduateGpa = Number(profileData.undergraduateGpa);
  }
  if (profileData.gpa) {
    profileData.gpa = Number(profileData.gpa);
  }
  if (profileData.communityServiceHours) {
    profileData.communityServiceHours = Number(profileData.communityServiceHours);
  }
  if (profileData.yearsProfessionalExperience) {
    profileData.yearsProfessionalExperience = Number(profileData.yearsProfessionalExperience);
  }

  const existingProfile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  let profile;
  if (existingProfile) {
    profile = await prisma.studentProfile.update({
      where: { userId },
      data: profileData,
    });
  } else {
    profile = await prisma.studentProfile.create({
      data: { userId, ...profileData },
    });
  }

  // Recalculate completeness
  const completenessScore = calculateProfileCompleteness(profile as Parameters<typeof calculateProfileCompleteness>[0]);
  profile = await prisma.studentProfile.update({
    where: { userId },
    data: { profileCompletenessScore: completenessScore },
  });

  return NextResponse.json(profile, { status: existingProfile ? 200 : 201 });
}
