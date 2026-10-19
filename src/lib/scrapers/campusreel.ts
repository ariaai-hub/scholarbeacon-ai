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

// CampusReel has multiple FL county pages
const FL_COUNTIES = [
  "broward-county",
  "miami-dade-county",
  "palm-beach-county",
  "orange-county",
  "hillsborough-county",
  "pinellas-county",
  "duval-county",
];

export async function scrapeCampusReel(page = 1, county = "broward-county"): Promise<ScrapedScholarship[]> {
  const url = `https://www.campusreel.org/scholarships/location/florida-scholarships/${county}?page=${page}`;
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    html = await res.text();
  } catch (err) {
    console.error(`CampusReel fetch error (${county} page ${page}):`, err);
    return [];
  }

  const $ = load(html);
  const results: ScrapedScholarship[] = [];

  // The page has scholarship entries as anchor tags with URLs containing /scholarship/
  $("a[href*='/scholarship/']").each((_, el) => {
    try {
      const $el = $(el);
      const href = $el.attr("href") || "";
      const fullUrl = href.startsWith("http")
        ? href
        : `https://www.campusreel.org${href}`;

      const name = $el.text().trim().replace(/\s+/g, " ");
      if (!name || name.length < 3) return;

      // Get description from the parent container's next sibling or surrounding text
      const parent = $el.parent();
      const grandParent = parent.parent();
      let description = "";
      parent.nextAll("p, div").each((_, sib) => {
        const txt = $(sib).text().trim();
        if (txt.length > 50 && !txt.startsWith("$") && !txt.toLowerCase().includes("deadline")) {
          description = txt.slice(0, 500);
          return false;
        }
      });

      // Amount is often in the same text block — look for $ amounts nearby
      const parentText = parent.text();
      const amountMatch = parentText.match(/\$[\d,]+/);
      const { amount, amountMax } = parseAmount(amountMatch?.[0] ?? null);

      // Deadline
      let deadline: string | null = null;
      parent.parents().eq(0).nextAll("p, div, span").each((_, sib) => {
        const txt = $(sib).text();
        if (txt.toLowerCase().includes("deadline")) {
          deadline = parseDeadline(txt);
          return false;
        }
      });

      results.push({
        name: name.slice(0, 200),
        amount,
        amountMax,
        deadline,
        description: description || "See scholarship page for details.",
        url: fullUrl,
        scrapedFrom: "campusreel",
        stateResidency: ["FL"],
        county: [county.replace("-county", "").replace(/-/g, " ")],
      });
    } catch {
      // skip
    }
  });

  return results;
}

export async function scrapeCampusReelAll(pages = 3): Promise<ScrapedScholarship[]> {
  const all: ScrapedScholarship[] = [];
  for (let i = 1; i <= pages; i++) {
    const results = await scrapeCampusReel(i, "broward-county");
    if (results.length === 0) break;
    all.push(...results);
  }
  return all;
}

export async function scrapeCampusReelFlorida(): Promise<ScrapedScholarship[]> {
  const all: ScrapedScholarship[] = [];
  for (const county of FL_COUNTIES) {
    const results = await scrapeCampusReelAll(3);
    all.push(...results);
  }
  return all;
}
