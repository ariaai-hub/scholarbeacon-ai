import type { StudentProfile } from "@prisma/client";

type ProfileData = Partial<StudentProfile> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof StudentProfile]?: any;
};

interface BlockScore {
  block: number;
  name: string;
  weight: number;
  filled: number;
  total: number;
  score: number;
}

/**
 * Calculate weighted profile completeness score (0-100).
 * Each block is weighted and scored by % of required fields filled.
 */
export function calculateProfileCompleteness(profile: ProfileData): number {
  const blocks: BlockScore[] = [];

  // Block 1 — Core Identity (15%)
  const block1Filled =
    (profile.fullName ? 1 : 0) +
    (profile.dateOfBirth ? 1 : 0) +
    (profile.currentCity ? 1 : 0) +
    (profile.currentState ? 1 : 0);
  const block1Total = 4; // fullName, dateOfBirth, currentCity, currentState
  blocks.push({
    block: 1,
    name: "Core Identity",
    weight: 0.15,
    filled: block1Filled,
    total: block1Total,
    score: (block1Filled / block1Total) * 100,
  });

  // Block 2 — Academic Standing (20%)
  const block2Filled =
    (profile.educationLevel ? 1 : 0) +
    (profile.intendedMajor ? 1 : 0) +
    (profile.targetDegree ? 1 : 0);
  const block2Conditional =
    (isHighSchool(profile.educationLevel) ? (profile.institutionName ? 1 : 0) : 0) +
    (!isHighSchool(profile.educationLevel)
      ? (profile.institutionName ? 1 : 0) +
        (profile.gpa != null ? 1 : 0) +
        (profile.gpaScale ? 1 : 0)
      : 0);
  const block2Total = 3 + (isHighSchool(profile.educationLevel) ? 1 : 3);
  const block2AdjustedFilled = block2Filled + (isHighSchool(profile.educationLevel)
    ? (profile.institutionName ? 1 : 0)
    : (profile.institutionName ? 1 : 0) + (profile.gpa != null ? 1 : 0) + (profile.gpaScale ? 1 : 0));
  blocks.push({
    block: 2,
    name: "Academic Standing",
    weight: 0.20,
    filled: Math.min(block2AdjustedFilled, block2Total),
    total: block2Total,
    score: (Math.min(block2AdjustedFilled, block2Total) / block2Total) * 100,
  });

  // Block 3 — Demographics (10%)
  const block3Filled =
    (profile.raceEthnicity ? 1 : 0) +
    (profile.gender ? 1 : 0) +
    (profile.citizenshipStatus ? 1 : 0) +
    (profile.stateOfResidence ? 1 : 0) +
    (profile.zipCode ? 1 : 0);
  blocks.push({
    block: 3,
    name: "Demographics",
    weight: 0.10,
    filled: block3Filled,
    total: 5,
    score: (block3Filled / 5) * 100,
  });

  // Block 4 — Financial Profile (10%)
  const block4Filled =
    (profile.householdIncomeBracket ? 1 : 0) +
    (profile.financialNeedLevel ? 1 : 0) +
    (profile.firstGenerationCollegeStudent != null ? 1 : 0) +
    (profile.responsibleForContributingToFamilyIncome != null ? 1 : 0);
  blocks.push({
    block: 4,
    name: "Financial Profile",
    weight: 0.10,
    filled: block4Filled,
    total: 4,
    score: (block4Filled / 4) * 100,
  });

  // Block 5 — Background (10%)
  const block5Filled =
    (profile.parentHighestEducation ? 1 : 0) +
    (profile.geographicBackground ? 1 : 0) +
    (profile.athleteStatus != null ? 1 : 0) +
    (profile.singleParentHousehold != null ? 1 : 0) +
    (profile.siblingInCollege != null ? 1 : 0) +
    (profile.veteranStatus != null ? 1 : 0) +
    (profile.disabilityStatus != null ? 1 : 0) +
    (profile.heritageTags ? 1 : 0);
  blocks.push({
    block: 5,
    name: "Background",
    weight: 0.10,
    filled: block5Filled,
    total: 8,
    score: (block5Filled / 8) * 100,
  });

  // Block 6 — Extracurriculars (10%)
  const block6Filled =
    (profile.activities ? 1 : 0) +
    (profile.leadershipPositions ? 1 : 0) +
    (profile.communityServiceHours != null ? 1 : 0) +
    (profile.workExperience ? 1 : 0) +
    (profile.awardsAndHonors ? 1 : 0);
  blocks.push({
    block: 6,
    name: "Extracurriculars",
    weight: 0.10,
    filled: block6Filled,
    total: 5,
    score: (block6Filled / 5) * 100,
  });

  // Block 7 — Personal Story (15%)
  const block7Filled =
    (profile.mostSignificantChallenge ? 1 : 0) +
    (profile.whatToKnowAboutYou ? 1 : 0) +
    (profile.futureGoal ? 1 : 0) +
    (profile.whyNeedScholarship ? 1 : 0);
  blocks.push({
    block: 7,
    name: "Personal Story",
    weight: 0.15,
    filled: block7Filled,
    total: 4,
    score: (block7Filled / 4) * 100,
  });

  // Block 8 — Grad/Professional Only (10% if applicable)
  const isGrad = isGradLevel(profile.educationLevel);
  if (isGrad) {
    const block8Filled =
      (profile.undergraduateInstitution ? 1 : 0) +
      (profile.undergraduateGpa != null ? 1 : 0) +
      (profile.thesisTrack != null ? 1 : 0) +
      (profile.researchAssistant != null ? 1 : 0) +
      (profile.teachingAssistant != null ? 1 : 0) +
      (profile.publications ? 1 : 0) +
      (profile.yearsProfessionalExperience != null ? 1 : 0) +
      (profile.lettersOfRecommendationReady != null ? 1 : 0) +
      (profile.seekingFullFunding != null ? 1 : 0);
    blocks.push({
      block: 8,
      name: "Grad/Professional",
      weight: 0.10,
      filled: block8Filled,
      total: 9,
      score: (block8Filled / 9) * 100,
    });
  }

  // Block 9 — International Only (10% if applicable)
  const isInternational = isNonUSCitizen(profile.citizenshipStatus);
  if (isInternational) {
    const block9Filled =
      (profile.countryOfOrigin ? 1 : 0) +
      (profile.hasUSCitizenSponsor != null ? 1 : 0) +
      (profile.englishProficiencyScore ? 1 : 0) +
      (profile.currentlyEmployedUS != null ? 1 : 0) +
      (profile.planToReturnToHomeCountry != null ? 1 : 0);
    blocks.push({
      block: 9,
      name: "International",
      weight: 0.10,
      filled: block9Filled,
      total: 5,
      score: (block9Filled / 5) * 100,
    });
  }

  // Block 10 — Documents (10%)
  const block10Filled =
    (profile.hasResume != null ? 1 : 0) +
    (profile.hasUnofficialTranscript != null ? 1 : 0) +
    (profile.canGetRecommendationLetters != null ? 1 : 0) +
    (profile.canCertifyDocuments != null ? 1 : 0) +
    (profile.hasReliableComputerAndInternet != null ? 1 : 0);
  blocks.push({
    block: 10,
    name: "Documents & Assets",
    weight: 0.10,
    filled: block10Filled,
    total: 5,
    score: (block10Filled / 5) * 100,
  });

  // Calculate weighted score
  const totalWeight = blocks.reduce((sum, b) => sum + b.weight, 0);
  const weightedScore = blocks.reduce((sum, b) => sum + (b.score * b.weight), 0);

  return Math.round(weightedScore / totalWeight);
}

function isHighSchool(level?: string): boolean {
  return level === "HS_JUNIOR" || level === "HS_SENIOR";
}

function isGradLevel(level?: string): boolean {
  return !!(
    level?.startsWith("GRAD_") ||
    level === "NON_DEGREE"
  );
}

function isNonUSCitizen(status?: string): boolean {
  return !!(
    status &&
    status !== "US_CITIZEN" &&
    status !== "PERMANENT_RESIDENT"
  );
}

export { isHighSchool, isGradLevel, isNonUSCitizen };
