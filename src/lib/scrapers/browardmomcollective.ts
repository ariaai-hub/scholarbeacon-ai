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

function parseDeadline(text: string | null): string | null {
  if (!text) return null;
  const dateMatch = text.match(
    /(\w+\s+\d{1,2},?\s+\d{4})|(\d{1,2}\/\d{1,2}\/\d{2,4})|(\d{4}-\d{2}-\d{2})/
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

// Known scholarship links from the BrowardMomCollective curated article
const KNOWN_SCHOLARSHIPS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  {
    name: "George Snow Scholarship Fund",
    url: "https://scholarship.org/browardscholarships/",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description:
      "100+ scholarship awards for Broward County seniors demonstrating financial need. No minimum GPA or SAT/ACT required. Expanded to Broward County in 2026.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Broward Education Foundation Scholarships",
    url: "https://browardedfoundation.org/apply/",
    amount: 1000,
    amountMax: 25000,
    deadline: null,
    description:
      "Hundreds of scholarships for Broward County Public Schools graduating seniors. Merit-based and need-based awards from $1,000 to over $25,000.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Community Foundation of Broward Scholarships",
    url: "https://www.cfbroward.org/receive/apply-for-scholarships",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description:
      "Multiple scholarship opportunities for students at different stages. Administered directly and in partnership with Broward Education Foundation.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Broward College Scholarships",
    url: "https://www.broward.edu/admissions/financial-aid/scholarships/",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description:
      "Scholarships for eligible Broward College students based on financial need, academic achievement, and program of study.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Elks Most Valuable Student Scholarship",
    url: "https://www.elks.org/scholars/scholarships/mvs.cfm",
    amount: 1000,
    amountMax: 15000,
    deadline: null,
    description:
      "National scholarship for high school seniors based on academics, leadership, and service. No relation to Elks required.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Florida Bright Futures Scholarship Program",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description:
      "Florida state scholarship. Shomari Jr. is eligible for 100% Bright Futures (FAS tier). Covers 75-100% of tuition. Award varies by tier.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Elks Scholarships",
    url: "https://floridaelks.org/scholarships",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description: "Scholarship opportunities for Florida students through the Florida State Elks Association.",
    stateResidency: ["FL"],
    county: [],
  },
];

export async function scrapeBrowardMomCollective(): Promise<ScrapedScholarship[]> {
  const results: ScrapedScholarship[] = KNOWN_SCHOLARSHIPS.map((s) => ({
    ...s,
    scrapedFrom: "browardmomcollective",
  }));

  // Try to fetch article page for additional links
  try {
    const res = await fetch(
      "https://browardmomcollective.com/community-resources/broward-county-scholarships/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = load(html);

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      const text = $(el).text().trim();
      if (
        href.startsWith("http") &&
        (href.includes("scholarship") ||
          href.includes("financial-aid") ||
          href.includes("fafsa") ||
          href.includes("brightfutures")) &&
        !results.some((r) => r.url === href)
      ) {
        results.push({
          name: text.slice(0, 200) || "Broward Scholarship Link",
          amount: 0,
          deadline: null,
          description: "Found via BrowardMomCollective article.",
          url: href,
          scrapedFrom: "browardmomcollective",
          stateResidency: [],
          county: [],
        });
      }
    });
  } catch (err) {
    console.warn("BrowardMomCollective article fetch failed:", err);
  }

  return results;
}
