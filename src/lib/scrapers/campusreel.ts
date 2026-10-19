import * as cheerio from "cheerio";
import { load } from "cheerio";

export interface ScrapedScholarship {
  name: string;
  amount: number;
  amountMax?: number;
  deadline: string | null;
  description: string;
  url: string;
  scrapedFrom: "campusreel";
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
  // Try common date formats
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

export async function scrapeCampusReel(
  page = 1
): Promise<ScrapedScholarship[]> {
  const url = `https://www.campusreel.org/scholarships/location/florida-scholarships/broward-county?page=${page}`;
  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.error(`CampusReel fetch error (page ${page}):`, err);
    return [];
  }

  const $ = load(html);
  const results: ScrapedScholarship[] = [];

  // Adapt selector based on actual page structure
  // Common patterns for scholarship list pages
  const items = $("[class*='scholarship'], [class*='card'], article, .listing-item");

  if (items.length === 0) {
    // Try generic paragraph/div scanning
    $("div, p, li").each((_, el) => {
      const text = $(el).text().trim();
      // Look for patterns like "$5,000" and scholarship names nearby
    });
  }

  items.each((_, el) => {
    try {
      const nameEl = $(el).find("h2, h3, h4, [class*='title'], [class*='name']").first();
      const name = nameEl.text().trim();

      const amountEl = $(el).find("[class*='amount'], [class*='award'], [class*='value']").first();
      const amountText = amountEl.text().trim();
      const { amount, amountMax } = parseAmount(amountText);

      const deadlineEl = $(el).find("[class*='deadline'], [class*='due'], time").first();
      const deadlineText = deadlineEl.text().trim();
      const deadline = parseDeadline(deadlineText);

      const descEl = $(el).find("p, [class*='description'], [class*='summary']").first();
      const description = descEl.text().trim().slice(0, 500);

      const linkEl = $(el).find("a[href]").first();
      const relativeHref = linkEl.attr("href") || "";
      const url = relativeHref.startsWith("http")
        ? relativeHref
        : `https://www.campusreel.org${relativeHref}`;

      if (name && url && url.includes(".")) {
        results.push({
          name: name.slice(0, 200),
          amount,
          amountMax,
          deadline,
          description: description.slice(0, 1000),
          url,
          scrapedFrom: "campusreel",
          stateResidency: ["FL"],
          county: ["Broward"],
        });
      }
    } catch {
      // skip malformed item
    }
  });

  return results;
}

/**
 * Scrape multiple pages of CampusReel
 */
export async function scrapeCampusReelAll(pages = 3): Promise<ScrapedScholarship[]> {
  const all: ScrapedScholarship[] = [];
  for (let i = 1; i <= pages; i++) {
    const results = await scrapeCampusReel(i);
    if (results.length === 0) break;
    all.push(...results);
  }
  return all;
}
