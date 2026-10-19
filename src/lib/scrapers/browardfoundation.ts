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

function parseDeadline(text: string | null): string | null {
  if (!text) return null;
  const dateMatch = text.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}/
  );
  if (dateMatch) {
    try {
      const d = new Date(dateMatch[0]);
      if (!isNaN(d.getTime())) return d.toISOString();
    } catch {
      // fall through
    }
  }
  return null;
}

function parseAmount(text: string | null): { amount: number; amountMax?: number } {
  if (!text) return { amount: 0 };
  const cleaned = text.replace(/[^0-9,]/g, "");
  const parts = cleaned.split(",").join("").split("-");
  if (parts.length === 2) {
    return {
      amount: parseInt(parts[0]) || 0,
      amountMax: parseInt(parts[1]) || undefined,
    };
  }
  return { amount: parseInt(parts[0]) || 0 };
}

// Scholarships found on Broward Education Foundation apply page
// https://browardedfoundation.org/apply/
const KNOWN_BROWARD_FOUNDATION: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  {
    name: "William T. Hennessey, Jr. Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-04-01",
    description:
      "For Broward County Public School 12th graders with intended major in a technology-related field. Deadline: April 1, 2027.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Marlene Methelis Memorial Art Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-03-15",
    description:
      "For Broward County seniors pursuing Fine Arts: photography, sculpting, ceramics, fashion design, painting, drawing, graphical arts. Deadline: March 15, 2027.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "City of Sunrise Outstanding Citizen Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-03-15",
    description:
      "For Sunrise residents. Must be a Broward County graduating senior. Deadline: March 15, 2027.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "iCoast CIO Council of South Florida Technology Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-03-15",
    description:
      "For students pursuing careers in technology and innovation. Open to Broward County seniors. Deadline: March 15, 2027.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Sprouting Scholar Award",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-03-15",
    description:
      "For students with financial need who have academic capabilities to be exceptional students. Broward County seniors. Deadline: March 15, 2027.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "NextEra Energy Scholarship (SECME Students)",
    url: "https://browardedfoundation.org/apply/",
    amount: 20000,
    deadline: null,
    description:
      "10 awards up to $20,000 for graduating high school seniors with at least one year of SECME experience. For STEM fields.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Broward Health Medical Staff Scholarships",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: null,
    description:
      "One-time lump sum scholarship for students pursuing healthcare careers. Based on eligibility and availability.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Self Help Credit Union Community Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: null,
    description:
      "Community scholarship for Broward County students. Check website for deadline and requirements.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Community Foundation of Broward Scholarship",
    url: "https://www.cfbroward.org/receive/apply-for-scholarships",
    amount: 0,
    deadline: null,
    description:
      "Multiple scholarship opportunities for Broward County students at different educational stages. Community-focused awards.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "American Association of Blacks in Energy (AABE) Scholarship",
    url: "https://www.cfbroward.org/receive/apply-for-scholarships",
    amount: 3000,
    amountMax: 5000,
    deadline: null,
    description:
      "National and regional scholarship for underrepresented minority students pursuing energy-related fields.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeBrowardEdFoundation(): Promise<ScrapedScholarship[]> {
  return KNOWN_BROWARD_FOUNDATION.map((s) => ({
    ...s,
    scrapedFrom: "broward-ed-foundation",
  }));
}
