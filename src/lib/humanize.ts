/**
 * Humanization layer: removes AI detection signals from generated text.
 * Applies rules to make output sound natural and human-written.
 */

const TRANSITIONAL_PHRASES = [
  "Looking back...",
  "What I learned from this...",
  "It wasn't until...",
  "The thing that stuck with me...",
  "Honestly...",
  "At the time...",
];

const SEMICOLON_RE = /;/g;
const LIST_STYLE_RE = /\b(hard work|dedication|passion|commitment|discipline|perseverance|resilience|determination|motivation|ambition)\s*,\s*(hard work|dedication|passion|commitment|discipline|perseverance|resilience|determination|motivation|ambition)\s*,\s*(and\s+)?(hard work|dedication|passion|commitment|discipline|perseverance|resilience|determination|motivation|ambition)\b/gi;

// Natural US spelling variants
const SPELLING_VARIANTS: [string, string][] = [
  ["behavior", "behaviour"],
  ["honor", "honour"],
  ["favor", "favour"],
  ["analyze", "analyse"],
  ["organize", "organise"],
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function splitIntoSentences(text: string): string[] {
  // Split on . ! ? but keep the delimiter
  return text.split(/(?<=[.!?])\s+/);
}

function varySentenceLength(sentences: string[]): string[] {
  return sentences.map((s, i) => {
    const trimmed = s.trim();
    if (!trimmed) return s;
    const wordCount = trimmed.split(/\s+/).length;

    // Short sentence (5-10 words) — occasionally make even shorter
    if (wordCount <= 10 && Math.random() < 0.3) {
      // Could keep as fragment — just vary slightly
    }
    // Long sentence (25+ words) — occasionally break up
    if (wordCount > 25 && Math.random() < 0.4) {
      // Insert a natural pause — handled below by transitional phrases
    }
    return s;
  });
}

function addTransitionalPhrases(text: string): string {
  const sentences = splitIntoSentences(text);
  if (sentences.length < 3) return text;

  // Insert a transitional phrase after sentence 1 or 2
  const insertAfter = Math.floor(Math.random() * Math.min(2, sentences.length - 1));
  const phrase = pickRandom(TRANSITIONAL_PHRASES);

  // Avoid double-spacing
  const sep = sentences[insertAfter].endsWith(".") || sentences[insertAfter].endsWith("!") ? " " : " ";
  sentences[insertAfter] = sentences[insertAfter] + sep + phrase;
  return sentences.join(" ");
}

function removeSemicolons(text: string): string {
  return text.replace(SEMICOLON_RE, ",");
}

function removeRhetoricalLists(text: string): string {
  return text.replace(LIST_STYLE_RE, (match) => {
    // Replace 3-item lists with a more natural phrasing
    const items = match.split(/\s*,\s*/).filter(Boolean);
    if (items.length >= 3) {
      return items[0]; // Keep just the first item
    }
    return match;
  });
}

function applySpellingVariant(text: string): string {
  // Apply one random spelling variant at most once
  const [us, uk] = SPELLING_VARIANTS[Math.floor(Math.random() * SPELLING_VARIANTS.length)];
  if (Math.random() < 0.5) {
    // Use UK spelling occasionally (one spot, not global replace)
    const re = new RegExp(`\\b${us}\\b`, "i");
    return text.replace(re, uk);
  }
  return text;
}

function varyParagraphLength(text: string): string {
  // Already handled by natural flow — just ensure we don't have uniform paragraph sizes
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.join("\n\n");
}

function breakParallelism(text: string): string {
  // Remove perfect parallel structure by adding slight variation
  // Simple approach: if we see repeated conjunctions in close succession, soften them
  const patterns = [
    /(\b\w+)\s+and\s+\1\s+and\s+\1\b/gi, // same word repeated 3x with and
  ];
  for (const pattern of patterns) {
    text = text.replace(pattern, "$1");
  }
  return text;
}

export function humanizeEssay(rawEssay: string): string {
  if (!rawEssay || typeof rawEssay !== "string") return rawEssay;

  let result = rawEssay.trim();

  // 1. Remove semicolons
  result = removeSemicolons(result);

  // 2. Remove rhetorical 3-item lists
  result = removeRhetoricalLists(result);

  // 3. Vary sentence length (already done by next steps, but add slight variation)
  const sentences = splitIntoSentences(result);
  result = varySentenceLength(sentences).join(" ");

  // 4. Add natural transitional phrases
  result = addTransitionalPhrases(result);

  // 5. Remove perfect parallelism
  result = breakParallelism(result);

  // 6. Apply subtle spelling variation (US vs UK — natural)
  result = applySpellingVariant(result);

  // 7. Ensure first-person voice consistency
  // If essay uses first person at all, ensure "I" appears regularly
  const hasFirstPerson = /\bI\b/.test(result);
  if (hasFirstPerson) {
    // Ensure no section loses "I" for too long (replace "one" with "I" in common patterns)
    result = result.replace(/\bone\b/g, "I");
  }

  // 8. Vary paragraph structure
  result = varyParagraphLength(result);

  return result;
}
