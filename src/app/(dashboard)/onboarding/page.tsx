import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileWizard } from "@/components/profile-wizard";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Load existing profile data if resuming
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  const initialData = profile
    ? {
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().split("T")[0] : "",
        currentCity: profile.currentCity,
        currentState: profile.currentState,
        phone: profile.phone || "",
        educationLevel: profile.educationLevel,
        institutionName: profile.institutionName || "",
        gpa: profile.gpa ? String(profile.gpa) : "",
        gpaScale: profile.gpaScale,
        intendedMajor: profile.intendedMajor || "",
        targetDegree: profile.targetDegree || "",
        collegeCreditsEarned: profile.collegeCreditsEarned ?? "",
        raceEthnicity: profile.raceEthnicity || [],
        gender: profile.gender || "",
        citizenshipStatus: profile.citizenshipStatus,
        stateOfResidence: profile.stateOfResidence,
        zipCode: profile.zipCode || "",
        countryOfCitizenship: profile.countryOfCitizenship || "",
        visaType: profile.visaType || "",
        householdIncomeBracket: profile.householdIncomeBracket,
        financialNeedLevel: profile.financialNeedLevel,
        firstGenerationCollegeStudent: profile.firstGenerationCollegeStudent,
        responsibleForContributingToFamilyIncome: profile.responsibleForContributingToFamilyIncome,
        singleParentHousehold: profile.singleParentHousehold,
        siblingInCollege: profile.siblingInCollege,
        parentHighestEducation: profile.parentHighestEducation || "",
        veteranStatus: profile.veteranStatus,
        disabilityStatus: profile.disabilityStatus,
        heritageTags: profile.heritageTags || [],
        religiousAffiliation: profile.religiousAffiliation || "",
        geographicBackground: profile.geographicBackground || "",
        athleteStatus: profile.athleteStatus,
        activities: profile.activities || [],
        leadershipPositions: profile.leadershipPositions || [],
        communityServiceHours: profile.communityServiceHours ?? "",
        communityServiceFocus: profile.communityServiceFocus || "",
        workExperience: profile.workExperience || [],
        awardsAndHonors: profile.awardsAndHonors || [],
        specialSkills: profile.specialSkills || "",
        mostSignificantChallenge: profile.mostSignificantChallenge || "",
        whatToKnowAboutYou: profile.whatToKnowAboutYou || "",
        futureGoal: profile.futureGoal || "",
        whyNeedScholarship: profile.whyNeedScholarship || "",
        circumstancesToExplain: profile.circumstancesToExplain || "",
        undergraduateInstitution: profile.undergraduateInstitution || "",
        undergraduateGpa: profile.undergraduateGpa ? String(profile.undergraduateGpa) : "",
        thesisTrack: profile.thesisTrack,
        researchAssistant: profile.researchAssistant,
        teachingAssistant: profile.teachingAssistant,
        publications: profile.publications || [],
        yearsProfessionalExperience: profile.yearsProfessionalExperience ?? "",
        lettersOfRecommendationReady: profile.lettersOfRecommendationReady,
        seekingFullFunding: profile.seekingFullFunding,
        countryOfOrigin: profile.countryOfOrigin || "",
        hasUSCitizenSponsor: profile.hasUSCitizenSponsor,
        sponsorType: profile.sponsorType || "",
        englishProficiencyScore: profile.englishProficiencyScore || null,
        currentlyEmployedUS: profile.currentlyEmployedUS,
        employmentType: profile.employmentType || "",
        homeCountryScholarshipEligibility: profile.homeCountryScholarshipEligibility,
        planToReturnToHomeCountry: profile.planToReturnToHomeCountry,
        hasResume: profile.hasResume,
        hasUnofficialTranscript: profile.hasUnofficialTranscript,
        canGetRecommendationLetters: profile.canGetRecommendationLetters,
        canCertifyDocuments: profile.canCertifyDocuments,
        hasReliableComputerAndInternet: profile.hasReliableComputerAndInternet,
      }
    : {};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SB</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">ScholarBeacon</span>
          </div>
          <div className="text-sm text-slate-500">
            {profile ? "Continue your profile" : "Build your profile"}
          </div>
        </div>
      </div>

      {/* Wizard */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Student Profile</h1>
          <p className="text-sm text-slate-500">
            Answer these questions to unlock personalized scholarship matches.
            Your data is private and used only to find scholarships you're eligible for.
          </p>
        </div>
        <ProfileWizard initialData={initialData} />
      </div>
    </div>
  );
}
