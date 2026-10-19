import { load } from "cheerio";

export interface ScrapedScholarship {
  name: string;
  amount: number;
  amountMax?: number;
  deadline: string | null;
  description: string;
  url: string;
  scrapedFrom: string;
  stateResidency: string[];
  county: string[];
}

// Scholarship links extracted from Scholarships360 Black Students page
// These are high-quality, hand-reviewed scholarships
const SCHOLARSHIPS_360_BLACK_STUDENTS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  {
    name: "Scholar Dollars Essay Scholarship for Black Students",
    url: "https://scholarships360.org/scholarships/search/scholar-dollars-essay-scholarship-for-black-students/",
    amount: 1000,
    deadline: "2027-03-01",
    description:
      "Exclusive scholarship for Black students. Must be enrolled high school, undergraduate or graduate student. Essay about an inspirational figure. Active Scholarships360 users given higher consideration.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Craig D. Butler Scholarship Foundation Award",
    url: "https://scholarships360.org/scholarships/search/craig-d-butler-scholarship-foundation-award-2/",
    amount: 1000,
    deadline: "2027-04-09",
    description:
      "$1,000 to African-American high school senior from Pennsylvania or Camden County NJ. Min 3.0 GPA. Full-time college enrollment required.",
    stateResidency: ["PA", "NJ"],
    county: [],
  },
  {
    name: "Black at Microsoft Scholarship",
    url: "https://scholarships360.org/scholarships/search/black-at-microsoft-scholarship/",
    amount: 2500,
    amountMax: 5000,
    deadline: null,
    description:
      "5 scholarships worth $5,000 (renewable up to 3 years) + 55 one-time $2,500 awards. Black high school seniors pursuing degrees in engineering, CS, computer info systems, or business.",
    stateResidency: [],
    county: [],
  },
  {
    name: "The Gates Scholarship",
    url: "https://scholarships360.org/scholarships/search/the-gates-scholarship/",
    amount: 0, // Full ride — amount varies
    amountMax: 0,
    deadline: null,
    description:
      "Full ride for low-income, academically excellent high school seniors. Covers all cost of attendance not already covered by financial aid. Extremely prestigious.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Ron Brown Scholarship",
    url: "https://scholarships360.org/scholarships/search/ron-brown-scholarship/",
    amount: 10000,
    amountMax: 40000,
    deadline: "2026-12-01",
    description:
      "20-25 Black/African American seniors win $40,000 ($10K/yr for 4 years). Global entrepreneurship and community engagement focus. 2 essays, transcripts, 2 letters of recommendation.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Sallie $2,000 No-Essay Scholarship",
    url: "https://www.sallie.com/scholarships/no-essay/",
    amount: 2000,
    deadline: "2026-10-31",
    description:
      "Monthly $2,000 scholarship. No essay or account sign-ups required. Must be enrolled or planning to enroll at accredited institution.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Niche $50,000 No Essay Scholarship",
    url: "https://www.niche.com/colleges/scholarships/50k-no-essay-scholarship-2026/",
    amount: 50000,
    deadline: "2026-12-31",
    description:
      "$50,000 no-essay scholarship. High school and college students eligible. Random drawing. Winner notified by Jan 15.",
    stateResidency: [],
    county: [],
  },
  {
    name: "SoFi $2,500 Scholarship",
    url: "https://refer.sofi.com/c/2552737/2856921/11190",
    amount: 2500,
    deadline: "2026-10-31",
    description:
      "Monthly $2,500 scholarship. No essay. Must be 18+, enrolled at accredited institution.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Connecticut BBB Diverse Student Ethics Scholarship",
    url: "https://scholarships360.org/scholarships/search/connecticut-better-business-bureau-diverse-student-ethics-scholarship/",
    amount: 2500,
    deadline: "2027-03-15",
    description:
      "$2,500 for diverse college-bound high school seniors from Connecticut. Demonstrated ethics through leadership, community service, integrity, or academics.",
    stateResidency: ["CT"],
    county: [],
  },
  {
    name: "Faulconer Scholarship",
    url: "https://scholarships360.org/scholarships/search/faulconer-scholarship/",
    amount: 5000,
    amountMax: 10000,
    deadline: null,
    description:
      "2 awards of $5,000/year for Tyler ISD seniors in Smith County, TX. Min GPA 2.0, max 3.5. Must be minority, attend TX college.",
    stateResidency: ["TX"],
    county: [],
  },
  {
    name: "Advocates for African Americans Carolinas Scholarship",
    url: "https://scholarships360.org/scholarships/search/advocates-for-african-americans-carolinas-scholarship/",
    amount: 2000,
    deadline: null,
    description:
      "Up to $2,000 for African-American seniors in NC/SC with 3.5+ GPA. Must attend 4-year college in NC/SC. Engineering, CS, sciences, accounting, finance, or business major.",
    stateResidency: ["NC", "SC"],
    county: [],
  },
  {
    name: "Smith Diversity Scholarship",
    url: "https://scholarships360.org/scholarships/search/smith-diversity-scholarship/",
    amount: 12500,
    amountMax: 15000,
    deadline: "2027-02-01",
    description:
      "6 awards of $12,500-$15,000 for historically underserved students in Nebraska. Graduating seniors, recent grads, or GED recipients. Demonstrated financial need.",
    stateResidency: ["NE"],
    county: [],
  },
  {
    name: "Capt. Kenneth D. Allen Scholarship",
    url: "https://scholarships360.org/scholarships/search/capt-kenneth-d-allen-scholarship/",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "$5,000 for minority FL high school seniors planning to study criminology or criminal justice. Min 2.5 GPA, community service record.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Phyllis G. Meekins Scholarship",
    url: "https://scholarships360.org/scholarships/search/phyllis-g-meekins-scholarship/",
    amount: 5000,
    amountMax: 10000,
    deadline: "2027-01-31",
    description:
      "2 awards up to $5,000 for minority female graduating high school seniors who played golf in HS and plan to continue in college.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeScholarships360(): Promise<ScrapedScholarship[]> {
  return SCHOLARSHIPS_360_BLACK_STUDENTS.map((s) => ({
    ...s,
    scrapedFrom: "scholarships360",
  }));
}
