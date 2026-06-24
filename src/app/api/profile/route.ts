import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return NextResponse.json(user);
}

// POST /api/profile
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

  const profile = await prisma.studentProfile.create({
    data: {
      userId,
      fullName: body.fullName,
      dateOfBirth: new Date(body.dateOfBirth),
      currentCity: body.currentCity,
      currentState: body.currentState,
      phone: body.phone ?? null,
      educationLevel: body.educationLevel,
      institutionName: body.institutionName ?? null,
      gpa: body.gpa ?? null,
      gpaScale: body.gpaScale ?? 4,
      classRank: body.classRank ?? null,
      standardizedTests: body.standardizedTests ?? null,
      collegeCreditsEarned: body.collegeCreditsEarned ?? null,
      intendedMajor: body.intendedMajor ?? null,
      targetDegree: body.targetDegree ?? null,
      raceEthnicity: body.raceEthnicity ?? null,
      gender: body.gender ?? null,
      nationality: body.nationality ?? null,
      citizenshipStatus: body.citizenshipStatus,
      stateOfResidence: body.stateOfResidence,
      zipCode: body.zipCode ?? null,
      householdIncomeBracket: body.householdIncomeBracket,
      financialNeedLevel: body.financialNeedLevel,
      firstGenerationCollegeStudent: body.firstGenerationCollegeStudent ?? false,
      responsibleForContributingToFamilyIncome: body.responsibleForContributingToFamilyIncome ?? false,
      singleParentHousehold: body.singleParentHousehold ?? false,
      siblingInCollege: body.siblingInCollege ?? false,
      parentHighestEducation: body.parentHighestEducation ?? null,
      veteranStatus: body.veteranStatus ?? false,
      disabilityStatus: body.disabilityStatus ?? false,
      heritageTags: body.heritageTags ?? null,
      religiousAffiliation: body.religiousAffiliation ?? null,
      geographicBackground: body.geographicBackground ?? null,
      athleteStatus: body.athleteStatus ?? "NONE",
      activities: body.activities ?? null,
      leadershipPositions: body.leadershipPositions ?? null,
      communityServiceHours: body.communityServiceHours ?? null,
      communityServiceFocus: body.communityServiceFocus ?? null,
      workExperience: body.workExperience ?? null,
      awardsAndHonors: body.awardsAndHonors ?? null,
      specialSkills: body.specialSkills ?? null,
      mostSignificantChallenge: body.mostSignificantChallenge ?? null,
      whatToKnowAboutYou: body.whatToKnowAboutYou ?? null,
      futureGoal: body.futureGoal ?? null,
      whyNeedScholarship: body.whyNeedScholarship ?? null,
      circumstancesToExplain: body.circumstancesToExplain ?? null,
      undergraduateInstitution: body.undergraduateInstitution ?? null,
      undergraduateGpa: body.undergraduateGpa ?? null,
      thesisTrack: body.thesisTrack ?? false,
      researchAssistant: body.researchAssistant ?? false,
      teachingAssistant: body.teachingAssistant ?? false,
      publications: body.publications ?? null,
      yearsProfessionalExperience: body.yearsProfessionalExperience ?? null,
      lettersOfRecommendationReady: body.lettersOfRecommendationReady ?? false,
      seekingFullFunding: body.seekingFullFunding ?? false,
      countryOfCitizenship: body.countryOfCitizenship ?? null,
      visaType: body.visaType ?? null,
      countryOfOrigin: body.countryOfOrigin ?? null,
      hasUSCitizenSponsor: body.hasUSCitizenSponsor ?? false,
      sponsorType: body.sponsorType ?? null,
      englishProficiencyScore: body.englishProficiencyScore ?? null,
      currentlyEmployedUS: body.currentlyEmployedUS ?? false,
      employmentType: body.employmentType ?? null,
      homeCountryScholarshipEligibility: body.homeCountryScholarshipEligibility ?? false,
      planToReturnToHomeCountry: body.planToReturnToHomeCountry ?? null,
      hasResume: body.hasResume ?? false,
      hasUnofficialTranscript: body.hasUnofficialTranscript ?? false,
      canGetRecommendationLetters: body.canGetRecommendationLetters ?? false,
      canCertifyDocuments: body.canCertifyDocuments ?? false,
      hasReliableComputerAndInternet: body.hasReliableComputerAndInternet ?? true,
    },
  });

  return NextResponse.json(profile, { status: 201 });
}
