import { load } from "cheerio";

export interface ScrapedScholarship {
  name: string;
  amount: number;
  amountMax?: number;
  deadline: string | null;
  description: string;
  url: string;
  scrapedFrom: "browardmomcollective";
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

export async function scrapeBrowardMomCollective(): Promise<ScrapedScholarship[]> {
  const url = "https://browardmomcollective.com/community-resources/broward-county-scholarships/";
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
    console.error("BrowardMomCollective fetch error:", err);
    return [];
  }

  const $ = load(html);
  const results: ScrapedScholarship[] = [];

  // Look for scholarship entries — typically in list items, cards, or post entries
  const items = $("li, article, .scholarship, .entry, [class*='scholarship'], [class*='resource']");

  items.each((_, el) => {
    try {
      const nameEl = $(el).find("h2, h3, h4, a").first();
      const name = nameEl.text().trim();

      const amountEl = $(el).find("[class*='amount'], [class*='award'], [class*='value'], $");
      const amountText = amountEl.text().trim();
      const { amount, amountMax } = parseAmount(amountText);

      const deadlineEl = $(el).find("[class*='deadline'], [class*='due'], time");
      const deadlineText = deadlineEl.first().text().trim();
      const deadline = parseDeadline(deadlineText);

      const descEl = $(el).find("p").first();
      const description = descEl.text().trim().slice(0, 500);

      const linkEl = $(el).find("a[href]").first();
      const relativeHref = linkEl.attr("href") || "";
      const url = relativeHref.startsWith("http")
        ? relativeHref
        : `https://browardmomcollective.com${relativeHref}`;

      if (name && name.length > 3) {
        results.push({
          name: name.slice(0, 200),
          amount,
          amountMax,
          deadline,
          description: description.slice(0, 1000),
          url,
          scrapedFrom: "browardmomcollective",
          stateResidency: ["FL"],
          county: ["Broward"],
        });
      }
    } catch {
      // skip
    }
  });

  return results;
}
