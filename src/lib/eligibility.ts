import { Prisma } from "@prisma/client";

export type Scholarship = Prisma.ScholarshipGetPayload<{}>;
export type DiscoveryProfile = Prisma.DiscoveryProfileGetPayload<{}>;

export interface MatchResult {
  score: number; // 0-100
  reasons: string[];
  hardFail: boolean;
  hardFailReason?: string;
}

/**
 * Calculate match score between a scholarship and student profile.
 * Returns 0-100 score plus reasons and hard-fail flag.
 */
export function calculateMatchScore(
  scholarship: Scholarship,
  profile: DiscoveryProfile
): MatchResult {
  let score = 50; // base score
  const reasons: string[] = [];
  let hardFail = false;
  let hardFailReason: string | undefined;

  // --- HARD FAIL CHECKS ---
  // GPA too low
  if (scholarship.minGpa != null && profile.gpa < scholarship.minGpa) {
    hardFail = true;
    hardFailReason = `GPA ${profile.gpa} below minimum ${scholarship.minGpa}`;
    return { score: 0, reasons: [], hardFail: true, hardFailReason };
  }

  // State residency required
  if (
    scholarship.stateResidencyNew &&
    scholarship.stateResidencyNew.length > 0 &&
    !scholarship.stateResidencyNew.includes(profile.state)
  ) {
    hardFail = true;
    hardFailReason = `State ${profile.state} not in allowed: ${scholarship.stateResidencyNew.join(", ")}`;
    return { score: 0, reasons: [], hardFail: true, hardFailReason };
  }

  // County required
  if (
    scholarship.county &&
    scholarship.county.length > 0 &&
    !scholarship.county.includes(profile.county)
  ) {
    hardFail = true;
    hardFailReason = `County ${profile.county} not in allowed: ${scholarship.county.join(", ")}`;
    return { score: 0, reasons: [], hardFail: true, hardFailReason };
  }

  // Grad year required
  if (
    scholarship.gradYears &&
    scholarship.gradYears.length > 0 &&
    !scholarship.gradYears.includes(profile.gradYear)
  ) {
    hardFail = true;
    hardFailReason = `Grad year ${profile.gradYear} not in allowed: ${scholarship.gradYears.join(", ")}`;
    return { score: 0, reasons: [], hardFail: true, hardFailReason };
  }

  // Income too high (for need-based)
  if (
    scholarship.maxIncome != null &&
    profile.income > scholarship.maxIncome
  ) {
    hardFail = true;
    hardFailReason = `Income ${profile.income} exceeds max ${scholarship.maxIncome}`;
    return { score: 0, reasons: [], hardFail: true, hardFailReason };
  }

  // --- SOFT SCORE FACTORS ---
  // Ethnicity match
  if (
    scholarship.ethnicityNew &&
    scholarship.ethnicityNew.length > 0 &&
    scholarship.ethnicityNew.includes(profile.ethnicity)
  ) {
    score += 20;
    reasons.push(`Ethnicity match: ${profile.ethnicity}`);
  }

  // Gender match
  if (
    scholarship.genderNew &&
    scholarship.genderNew.length > 0 &&
    scholarship.genderNew.includes(profile.gender)
  ) {
    score += 10;
    reasons.push(`Gender match: ${profile.gender}`);
  }

  // Major match
  const profileMajors = profile.majors.split(",").map((m) => m.trim());
  if (scholarship.majorsNew && scholarship.majorsNew.length > 0) {
    const matchedMajor = profileMajors.find((m) =>
      scholarship.majorsNew!.includes(m)
    );
    if (matchedMajor) {
      score += 15;
      reasons.push(`Major match: ${matchedMajor}`);
    }
  }

  // Community service
  if (
    scholarship.minCommunityHours != null &&
    profile.communityHours >= scholarship.minCommunityHours
  ) {
    score += 10;
    reasons.push(
      `Community service: ${profile.communityHours}h (min ${scholarship.minCommunityHours}h)`
    );
  }

  // Dual enrollment bonus
  if (scholarship.dualEnrollmentOk && profile.dualEnrollment) {
    score += 5;
    reasons.push("Dual enrollment accepted");
  }

  // Cap at 100
  score = Math.min(score, 100);

  return { score, reasons, hardFail: false };
}

/**
 * Priority score for ranking scholarships.
 * Combines match percentage, award amount (log scale), and deadline urgency.
 */
export function calculatePriorityScore(
  scholarship: Scholarship,
  profile: DiscoveryProfile
): number {
  const { score, hardFail } = calculateMatchScore(scholarship, profile);
  if (hardFail) return 0;

  const matchPct = score / 100;
  const amount = scholarship.amountMax ?? scholarship.amount;
  const logAmount = Math.log10(amount + 1);

  const now = new Date();
  const deadline = new Date(scholarship.deadline);
  const daysUntil = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const deadlineWeight = Math.min(Math.max(daysUntil, 0) / 90, 1);

  return matchPct * logAmount * deadlineWeight;
}
