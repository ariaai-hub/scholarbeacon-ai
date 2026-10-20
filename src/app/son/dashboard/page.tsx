"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrioritizedScholarship {
  id: string;
  name: string;
  amount: number;
  amountMax?: number | null;
  deadline: string;
  source: string;
  url: string;
  matchScore: number;
  matchReasons: string[];
  priorityScore: number;
  minGpa?: number | null;
  stateResidency: string[];
  county: string[];
  majors: string[];
  ethnicity: string[];
}

type PriorityView = "deadline" | "amount" | "match" | "strategic";

type ScholarshipCategory =
  | "Merit"
  | "Need-Based"
  | "Identity"
  | "Corporate"
  | "Foundation"
  | "HBCU"
  | "FL Resident"
  | "Broward";

// ─── Static Profile ────────────────────────────────────────────────────────────

const STUDENT_PROFILE = {
  name: "Shomari Akhdar Jr.",
  school: "Everglades High, Miramar FL",
  gpa: "3.53 / 4.98 weighted",
  sat: "1320",
  major: "Business / Finance",
  ethnicity: "African American",
  gender: "Male",
  income: "$50,000",
  communityHours: 255,
  county: "Broward County",
  state: "FL",
  gradYear: 2026,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categorize(s: PrioritizedScholarship): ScholarshipCategory[] {
  const cats: ScholarshipCategory[] = [];
  const src = s.source ?? "";

  const corporateKws = [
    "coca-cola", "coca cola", "wells fargo", "pepsi", "microsoft", "google",
    "apple", "amazon", "walt disney", "disney", "jnj", "johnson & johnson",
    "bp ", "shell", "exxon", "chevron", "ford", "gm ", "general motors",
    "verizon", "at&t", "t-mobile", "mcdonald", "starbucks", "walmart",
    "target", "home depot", "lowes", "intel", "nvidia", "amd", " Dell ",
    "HP ", "Hewlett", "Morgan", "Goldman", "JPMorgan", "Bank of America",
    "Visa", "Mastercard", "PayPal", "Square", "Salesforce", "Adobe",
    "Oracle", "IBM", "ATT", "FedEx", "UPS", "Delta", "American Airlines",
    "Southwest", "Marriott", "Hilton", "Hyatt", "Starwood", "Kroger",
    "safeway", "albertsons", "publix", "kroger",
  ];
  const foundationKws = [
    "foundation", "gates", "melinda", "bill & melinda", "rockefeller",
    "ford foundation", "kellogg", "harvard", "yale", "stanford",
    "mellon", "carnegie", "howard hughes", "kaiser", "hewlett",
    "-Packard", "intel foundation", "mitsubishi", "suntory",
    "schmidt", "dae", "kresge", "sprite", "tumblr", "twitch",
  ];
  const hbcuKws = ["hbcu", "historically black", "hbcU"];

  const isCorporate =
    corporateKws.some((k) => src.toLowerCase().includes(k)) &&
    !foundationKws.some((k) => src.toLowerCase().includes(k));
  const isFoundation =
    foundationKws.some((k) => src.toLowerCase().includes(k)) || false;
  const isHBCU = hbcuKws.some((k) => src.toLowerCase().includes(k));

  const hasIdentitySignal =
    (s.ethnicity?.length ?? 0) > 0 ||
    (s.majors?.length ?? 0) > 0 ||
    (s.county?.length ?? 0) > 0;
  if (!hasIdentitySignal && !isCorporate && !isFoundation) {
    cats.push("Merit");
  }

  if ((s.ethnicity?.length ?? 0) > 0) {
    cats.push("Identity");
  }

  if (isCorporate) cats.push("Corporate");
  if (isFoundation) cats.push("Foundation");
  if (isHBCU) cats.push("HBCU");

  const isFL = (s.stateResidency ?? []).some(
    (r) => r?.toLowerCase().includes("florida") || r === "FL"
  );
  const isBroward = (s.county ?? []).some(
    (c) => c?.toLowerCase().includes("broward")
  );
  if (isFL) cats.push("FL Resident");
  if (isBroward) cats.push("Broward");

  return cats.length ? cats : ["Merit"];
}

function getDeadlineMeta(deadlineStr: string) {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const daysUntil = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntil < 0) return { daysUntil, label: "Closed", variant: "passed" as const };
  if (daysUntil === 0) return { daysUntil, label: "Today!", variant: "today" as const };
  if (daysUntil === 1) return { daysUntil, label: "1 day", variant: "urgent" as const };
  if (daysUntil <= 7) return { daysUntil, label: `${daysUntil} days`, variant: "urgent" as const };
  if (daysUntil <= 14) return { daysUntil, label: `${daysUntil} days`, variant: "warning" as const };
  if (daysUntil <= 30) return { daysUntil, label: `${daysUntil} days`, variant: "soon" as const };
  if (daysUntil <= 90) return { daysUntil, label: `${daysUntil} days`, variant: "upcoming" as const };
  return { daysUntil, label: `${daysUntil} days`, variant: "normal" as const };
}

function formatCurrencyFull(amount: number): string {
  if (amount >= 1000000) return "$1M+";
  return `$${amount.toLocaleString()}`;
}

function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) return "$1M+";
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `$${amount.toLocaleString()}`;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<ScholarshipCategory, string> = {
  Merit: "bg-slate-100 text-slate-700",
  "Need-Based": "bg-amber-50 text-amber-700",
  Identity: "bg-violet-50 text-violet-700",
  Corporate: "bg-blue-50 text-blue-700",
  Foundation: "bg-rose-50 text-rose-700",
  HBCU: "bg-orange-50 text-orange-700",
  "FL Resident": "bg-cyan-50 text-cyan-700",
  Broward: "bg-teal-50 text-teal-700",
};

const DEADLINE_PILL_STYLES: Record<string, string> = {
  passed: "bg-slate-100 text-slate-400 line-through",
  today: "bg-red-100 text-red-700 border border-red-200",
  urgent: "bg-red-50 text-red-700 border border-red-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  soon: "bg-blue-50 text-blue-700 border border-blue-200",
  upcoming: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  normal: "bg-slate-100 text-slate-500",
};

const STORAGE_KEYS = {
  filters: "sb_filters_v2",
  view: "sb_view",
  drafts: "sb_drafts",
  profile: "sb_profile",
  applied: "sb_applied",
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SonDashboard() {
  const [scholarships, setScholarships] = useState<PrioritizedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState<PriorityView>("strategic");
  const [amountMin, setAmountMin] = useState(0);
  const [amountMax, setAmountMax] = useState(25000);
  const [deadlineWindow, setDeadlineWindow] = useState(0);
  const [matchMin, setMatchMin] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<ScholarshipCategory[]>([]);
  const [flOnly, setFlOnly] = useState(false);
  const [browardOnly, setBrowardOnly] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [essayPanelScholarship, setEssayPanelScholarship] = useState<PrioritizedScholarship | null>(null);
  const [essayDraft, setEssayDraft] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [hasDraftMap, setHasDraftMap] = useState<Record<string, boolean>>({});
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});

  // ── Load data ──────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scholarships/prioritized?limit=600");
      const data = await res.json();
      const list: PrioritizedScholarship[] = data.scholarships ?? [];
      setScholarships(list);
      if (list.length > 0) {
        const maxAmt = Math.max(...list.map((s) => s.amountMax ?? s.amount));
        setAmountMax(Math.min(maxAmt, 50000));
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Restore localStorage state ─────────────────────────────────────────────

  useEffect(() => {
    try {
      const f = localStorage.getItem(STORAGE_KEYS.filters);
      if (f) {
        const parsed = JSON.parse(f);
        if (parsed.amountMin !== undefined) setAmountMin(parsed.amountMin);
        if (parsed.amountMax !== undefined) setAmountMax(parsed.amountMax);
        if (parsed.deadlineWindow !== undefined) setDeadlineWindow(parsed.deadlineWindow);
        if (parsed.matchMin !== undefined) setMatchMin(parsed.matchMin);
        if (parsed.types !== undefined) setSelectedTypes(parsed.types);
        if (parsed.flOnly !== undefined) setFlOnly(parsed.flOnly);
        if (parsed.browardOnly !== undefined) setBrowardOnly(parsed.browardOnly);
        if (parsed.sources !== undefined) setSelectedSources(parsed.sources);
      }
      const v = localStorage.getItem(STORAGE_KEYS.view);
      if (v && ["deadline", "amount", "match", "strategic"].includes(v)) {
        setActiveView(v as PriorityView);
      }
      const drafts = localStorage.getItem(STORAGE_KEYS.drafts);
      if (drafts) {
        const parsed = JSON.parse(drafts) as Record<string, string>;
        const map: Record<string, boolean> = {};
        Object.keys(parsed).forEach((k) => (map[k] = true));
        setHasDraftMap(map);
      }
      const applied = localStorage.getItem(STORAGE_KEYS.applied);
      if (applied) {
        const ids = JSON.parse(applied) as string[];
        const map: Record<string, boolean> = {};
        ids.forEach((id) => (map[id] = true));
        setAppliedMap(map);
      }
    } catch {}
  }, []);

  // ── Persist filter state ───────────────────────────────────────────────────

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify({
        amountMin, amountMax, deadlineWindow, matchMin,
        types: selectedTypes, flOnly, browardOnly, sources: selectedSources,
      }));
    } catch {}
  }, [amountMin, amountMax, deadlineWindow, matchMin, selectedTypes, flOnly, browardOnly, selectedSources]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.view, activeView); } catch {}
  }, [activeView]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const categorized = useMemo(() => {
    return scholarships.map((s) => ({ ...s, _cats: categorize(s) }));
  }, [scholarships]);

  const maxAmountInData = useMemo(() => {
    if (scholarships.length === 0) return 25000;
    return Math.max(...scholarships.map((s) => s.amountMax ?? s.amount));
  }, [scholarships]);

  const uniqueSources = useMemo(() => {
    const srcs = scholarships.map((s) => s.source).filter(Boolean);
    return [...new Set(srcs)].sort();
  }, [scholarships]);

  const filteredSources = useMemo(() => {
    if (!sourceSearch) return uniqueSources;
    const q = sourceSearch.toLowerCase();
    return uniqueSources.filter((s) => s.toLowerCase().includes(q));
  }, [uniqueSources, sourceSearch]);

  const filtered = useMemo(() => {
    const now = Date.now();
    let result = categorized.filter((s) => {
      const amt = s.amountMax ?? s.amount;
      if (amt < amountMin || amt > amountMax) return false;
      if (matchMin > 0 && s.matchScore < matchMin) return false;
      if (deadlineWindow > 0) {
        const days = Math.ceil((new Date(s.deadline).getTime() - now) / 86400000);
        if (days < 0 || days > deadlineWindow) return false;
      }
      if (flOnly) {
        const isFL = (s.stateResidency ?? []).some(
          (r) => r?.toLowerCase().includes("florida") || r === "FL"
        );
        if (!isFL) return false;
      }
      if (browardOnly) {
        const isBroward = (s.county ?? []).some(
          (c) => c?.toLowerCase().includes("broward")
        );
        if (!isBroward) return false;
      }
      if (selectedTypes.length > 0) {
        const overlap = s._cats.some((c) => selectedTypes.includes(c));
        if (!overlap) return false;
      }
      if (selectedSources.length > 0) {
        if (!selectedSources.includes(s.source)) return false;
      }
      return true;
    });

    if (activeView === "deadline") {
      result = [...result].sort((a, b) => {
        const aDays = Math.ceil((new Date(a.deadline).getTime() - now) / 86400000);
        const bDays = Math.ceil((new Date(b.deadline).getTime() - now) / 86400000);
        const aUrgent = aDays <= 14;
        const bUrgent = bDays <= 14;
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        return aDays - bDays;
      });
    } else if (activeView === "amount") {
      result = [...result].sort(
        (a, b) => (b.amountMax ?? b.amount) - (a.amountMax ?? a.amount)
      );
    } else if (activeView === "match") {
      result = [...result].sort((a, b) => b.matchScore - a.matchScore);
    } else {
      result = [...result].sort((a, b) => b.priorityScore - a.priorityScore);
    }

    return result;
  }, [categorized, amountMin, amountMax, deadlineWindow, matchMin, selectedTypes, flOnly, browardOnly, selectedSources, activeView]);

  // ── Stats ───────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalAmt = filtered.reduce((sum, s) => sum + (s.amountMax ?? s.amount), 0);
    const now = Date.now();
    const urgent = filtered.filter((s) => {
      const d = Math.ceil((new Date(s.deadline).getTime() - now) / 86400000);
      return d > 0 && d <= 14;
    }).length;
    const highMatch = filtered.filter((s) => s.matchScore >= 80).length;
    return { total: filtered.length, totalAmt, urgent, highMatch };
  }, [filtered]);

  // ── Active filter count ─────────────────────────────────────────────────────

  const activeFilterCount = useMemo(() => {
    return (
      (amountMin > 0 || amountMax < maxAmountInData ? 1 : 0) +
      (deadlineWindow > 0 ? 1 : 0) +
      (matchMin > 0 ? 1 : 0) +
      (selectedTypes.length > 0 ? 1 : 0) +
      (flOnly ? 1 : 0) +
      (browardOnly ? 1 : 0) +
      (selectedSources.length > 0 ? 1 : 0)
    );
  }, [amountMin, amountMax, deadlineWindow, matchMin, selectedTypes, flOnly, browardOnly, selectedSources, maxAmountInData]);

  // ── Essay helpers ───────────────────────────────────────────────────────────

  function openEssayPanel(s: PrioritizedScholarship) {
    setEssayPanelScholarship(s);
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.drafts) ?? "{}") as Record<string, string>;
      setEssayDraft(drafts[s.id] ?? "");
    } catch {
      setEssayDraft("");
    }
  }

  function closeEssayPanel() {
    setEssayPanelScholarship(null);
    setEssayDraft("");
    setAiGenerating(false);
  }

  function saveDraft(scholarshipId: string, content: string) {
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.drafts) ?? "{}") as Record<string, string>;
      if (content.trim()) {
        drafts[scholarshipId] = content;
        setHasDraftMap((m) => ({ ...m, [scholarshipId]: true }));
      } else {
        delete drafts[scholarshipId];
        setHasDraftMap((m) => {
          const next = { ...m };
          delete next[scholarshipId];
          return next;
        });
      }
      localStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(drafts));
    } catch {}
  }

  function toggleApplied(id: string) {
    setAppliedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEYS.applied, JSON.stringify(Object.keys(next).filter((k) => next[k])));
      } catch {}
      return next;
    });
  }

  async function generateEssay(scholarship: PrioritizedScholarship) {
    setAiGenerating(true);
    setEssayDraft("");
    let drafted = "";
    try {
      let profile: Record<string, unknown> = {};
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.profile);
        if (stored) profile = JSON.parse(stored);
      } catch {}
      const res = await fetch("/api/essay/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipName: scholarship.name,
          profile,
          promptType: "personal_statement",
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      drafted = data.content ?? data.text ?? "";
      setEssayDraft(drafted);
      saveDraft(scholarship.id, drafted);
    } catch (err) {
      console.error("Essay generation error:", err);
    } finally {
      setAiGenerating(false);
    }
  }

  function clearAllFilters() {
    setAmountMin(0);
    setAmountMax(maxAmountInData);
    setDeadlineWindow(0);
    setMatchMin(0);
    setSelectedTypes([]);
    setFlOnly(false);
    setBrowardOnly(false);
    setSelectedSources([]);
    setSourceSearch("");
  }

  const wordCount = essayDraft.trim() ? essayDraft.trim().split(/\s+/).length : 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-3">
          {/* Left: title + count */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Shomari Jr.&apos;s Scholarships
              </h1>
              <p className="text-xs text-slate-500">
                {loading ? "Loading…" : `${stats.total.toLocaleString()} matches`}
              </p>
            </div>
          </div>

          {/* Right: stats chips + avatar + filters */}
          <div className="flex items-center gap-3">
            {/* Stats chips (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatCurrencyFull(stats.totalAmt)}
              </span>
              {stats.urgent > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  {stats.urgent} urgent
                </span>
              )}
              {stats.highMatch > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                  {stats.highMatch} ≥80%
                </span>
              )}
            </div>

            {/* Profile avatar button */}
            <button
              onClick={() => setProfileOpen(true)}
              className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center hover:bg-indigo-700 transition-colors"
              aria-label="Open profile"
            >
              S
            </button>

            {/* Filters button */}
            <button
              onClick={() => setFilterOpen(true)}
              className={`
                inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium border transition-all
                ${activeFilterCount > 0
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Link
              href="/son/search"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Search
            </Link>
          </div>
        </div>

        {/* ── Stats bar ────────────────────────────────────────────────── */}
        {!loading && (
          <div className="grid grid-cols-4 gap-px bg-slate-200 border-t border-slate-200">
            {[
              { label: "Matched", value: stats.total.toLocaleString(), accent: "text-slate-900" },
              { label: "Potential", value: formatCurrencyFull(stats.totalAmt), accent: "text-emerald-600" },
              { label: "≤14 Days", value: String(stats.urgent), accent: stats.urgent > 0 ? "text-red-600" : "text-slate-900" },
              { label: "≥80% Match", value: String(stats.highMatch), accent: "text-indigo-600" },
            ].map(({ label, value, accent }) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "≤14 Days") { setDeadlineWindow(14); setFilterOpen(true); }
                  else if (label === "≥80% Match") { setMatchMin(80); setFilterOpen(true); }
                }}
                className="bg-white px-4 py-3 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <p className={`text-2xl font-bold ${accent} group-hover:opacity-80 transition-opacity`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Filter bar (inline quick pills) ──────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* Quick sort pills */}
          {([
            ["strategic", "Strategic", "★"],
            ["deadline", "Deadline", "⚡"],
            ["amount", "Amount", "$"],
            ["match", "Match", "✓"],
          ] as const).map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                ${activeView === key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              <span>{icon}</span> {label}
            </button>
          ))}

          <div className="w-px h-4 bg-slate-200 flex-shrink-0" />

          {/* Quick deadline pills */}
          {([[0, "All"], [7, "≤7d"], [14, "≤14d"], [30, "≤30d"], [60, "≤60d"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setDeadlineWindow(val)}
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap
                ${deadlineWindow === val
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {label}
            </button>
          ))}

          <div className="w-px h-4 bg-slate-200 flex-shrink-0" />

          {/* Quick match pills */}
          {([[0, "All Match"], [40, "≥40%"], [60, "≥60%"], [80, "≥80%"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setMatchMin(val)}
              className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap
                ${matchMin === val
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="p-5">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-2">No scholarships match your filters</p>
            <p className="text-sm text-slate-500 mb-6">Try adjusting the filters to see more results</p>
            <button
              onClick={clearAllFilters}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((s) => (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                categories={s._cats}
                hasDraft={!!hasDraftMap[s.id]}
                isApplied={!!appliedMap[s.id]}
                onOpenEssay={() => openEssayPanel(s)}
                onToggleApplied={() => toggleApplied(s.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Profile Panel ──────────────────────────────────────────────── */}
      {profileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setProfileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 text-sm">Profile</h2>
              <button
                onClick={() => setProfileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 rounded-2xl w-14 h-14 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <div>
                  <p className="font-bold text-slate-900">{STUDENT_PROFILE.name}</p>
                  <p className="text-sm text-slate-500">{STUDENT_PROFILE.school}</p>
                  <p className="text-sm text-slate-500">Class of {STUDENT_PROFILE.gradYear}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "GPA", value: STUDENT_PROFILE.gpa },
                  { label: "SAT", value: STUDENT_PROFILE.sat },
                  { label: "Major", value: STUDENT_PROFILE.major },
                  { label: "Income", value: STUDENT_PROFILE.income },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl px-3 py-2.5">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">{label}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Identity tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  STUDENT_PROFILE.ethnicity,
                  STUDENT_PROFILE.gender,
                  STUDENT_PROFILE.county,
                  "FL Resident",
                  `${STUDENT_PROFILE.communityHours}h volunteer`,
                ].map((tag) => (
                  <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Match explanation */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">
                  Why you&apos;re matched
                </p>
                <p className="text-sm text-indigo-900 leading-relaxed">
                  FL residency, Broward County, African American, Business/Finance major, High school senior
                </p>
              </div>

              {/* Edit profile link */}
              <Link
                href="/son/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 transition-colors w-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit profile
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ── Filter Panel (slide-over from right) ─────────────────────────── */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 text-sm">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-7">
              {/* Deadline */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Deadline</p>
                <div className="space-y-1.5">
                  {([[0, "All"], [7, "This week"], [30, "≤ 30 days"], [60, "≤ 60 days"], [90, "≤ 90 days"]] as const).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                      <input
                        type="radio"
                        name="deadline"
                        checked={deadlineWindow === val}
                        onChange={() => setDeadlineWindow(val)}
                        className="w-4 h-4 text-indigo-600 border-slate-300"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount range */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Amount</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-slate-400 block mb-1">Min</label>
                    <input
                      type="number"
                      value={amountMin}
                      onChange={(e) => setAmountMin(Math.max(0, Number(e.target.value)))}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] text-slate-400 block mb-1">Max</label>
                    <input
                      type="number"
                      value={amountMax}
                      onChange={(e) => setAmountMax(Math.max(amountMin, Number(e.target.value)))}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxAmountInData}
                  value={amountMax}
                  onChange={(e) => setAmountMax(Math.max(amountMin, Number(e.target.value)))}
                  className="w-full mt-3 accent-indigo-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-slate-400">$0</span>
                  <span className="text-[11px] text-slate-400">${maxAmountInData.toLocaleString()}</span>
                </div>
              </div>

              {/* Match score */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Match Score</p>
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                  {([0, 40, 60, 80] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => setMatchMin(val)}
                      className={`
                        flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                        ${matchMin === val
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                        }
                      `}
                    >
                      {val === 0 ? "All" : `≥${val}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Type</p>
                <div className="flex flex-wrap gap-2">
                  {(["Merit", "Need-Based", "Identity", "Corporate", "Foundation", "HBCU", "FL Resident", "Broward"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTypes((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                        );
                      }}
                      className={`
                        text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                        ${selectedTypes.includes(t)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Residency */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Residency</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={flOnly}
                      onChange={(e) => setFlOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                    />
                    FL Resident
                  </label>
                  <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={browardOnly}
                      onChange={(e) => setBrowardOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600"
                    />
                    Broward County
                  </label>
                </div>
              </div>

              {/* Source */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Source</p>
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  placeholder="Search sources…"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredSources.slice(0, 20).map((src) => (
                    <label key={src} className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(src)}
                        onChange={(e) => {
                          setSelectedSources((prev) =>
                            e.target.checked ? [...prev, src] : prev.filter((x) => x !== src)
                          );
                        }}
                        className="w-3.5 h-3.5 mt-0.5 rounded border-slate-300 text-indigo-600"
                      />
                      <span className="leading-snug">{src.length > 40 ? src.slice(0, 40) + "…" : src}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter panel footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              {activeFilterCount > 0 && (
                <p className="text-xs text-slate-500 mb-3">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </p>
              )}
              <div className="flex gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 text-sm font-medium text-slate-600 hover:text-red-600 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Essay Panel ──────────────────────────────────────────────────── */}
      {essayPanelScholarship && (
        <EssayPanel
          scholarship={essayPanelScholarship}
          draft={essayDraft}
          generating={aiGenerating}
          wordCount={wordCount}
          onDraftChange={(v) => {
            setEssayDraft(v);
            saveDraft(essayPanelScholarship.id, v);
          }}
          onGenerate={() => generateEssay(essayPanelScholarship)}
          onClose={closeEssayPanel}
        />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
      <div className="mt-6 h-10 bg-slate-100 rounded-xl" />
    </div>
  );
}

function ScholarshipCard({
  scholarship: s,
  categories,
  hasDraft,
  isApplied,
  onOpenEssay,
  onToggleApplied,
}: {
  scholarship: PrioritizedScholarship;
  categories: ScholarshipCategory[];
  hasDraft: boolean;
  isApplied: boolean;
  onOpenEssay: () => void;
  onToggleApplied: () => void;
}) {
  const deadline = getDeadlineMeta(s.deadline);
  const amount = s.amountMax ?? s.amount;

  const isUrgent = deadline.daysUntil > 0 && deadline.daysUntil <= 7;
  const isWarning = deadline.daysUntil > 7 && deadline.daysUntil <= 14;
  const isSoon = deadline.daysUntil > 14 && deadline.daysUntil <= 30;

  const borderColor = isUrgent
    ? "border-l-4 border-l-red-500"
    : isWarning
    ? "border-l-4 border-l-amber-500"
    : isSoon
    ? "border-l-4 border-l-blue-400"
    : s.matchScore >= 80
    ? "border-l-4 border-l-emerald-400"
    : "";

  const matchBarColor =
    s.matchScore >= 80 ? "bg-emerald-500" : s.matchScore >= 60 ? "bg-indigo-500" : "bg-slate-300";

  return (
    <div
      className={`
        group bg-white rounded-2xl border border-slate-200 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
        ${borderColor}
        flex flex-col
      `}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Top row: amount + deadline pill */}
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Amount — the hero */}
          <p className="text-2xl font-bold text-emerald-600 leading-none">
            {formatCurrencyFull(amount)}
          </p>

          {/* Deadline pill */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DEADLINE_PILL_STYLES[deadline.variant]} flex-shrink-0`}>
            {deadline.label}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-slate-900 text-[15px] leading-snug mb-3 line-clamp-2 flex-1">
          {s.name}
        </h3>

        {/* Match score bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${matchBarColor}`}
              style={{ width: `${s.matchScore}%` }}
            />
          </div>
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-1.5 mb-3">
          {categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-slate-100 text-slate-600"}`}
            >
              {cat}
            </span>
          ))}
          {categories.length > 2 && (
            <span className="text-[11px] text-slate-400">+{categories.length - 2}</span>
          )}
        </div>

        {/* Source */}
        <p className="text-xs text-slate-400 mb-4 truncate">{s.source}</p>

        {/* Apply button */}
        <div className="flex items-center gap-2 mt-auto">
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 py-2.5 rounded-xl transition-colors"
          >
            Apply →
          </a>
          <button
            onClick={onOpenEssay}
            className={`
              flex items-center justify-center w-11 h-11 rounded-xl border transition-all
              ${hasDraft
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                : "text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600"
              }
            `}
            title={hasDraft ? "View draft" : "Write essay"}
          >
            <svg className="w-4 h-4" fill={hasDraft ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onToggleApplied}
            className={`
              flex items-center justify-center w-11 h-11 rounded-xl border transition-all
              ${isApplied
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                : "text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600"
              }
            `}
            title={isApplied ? "Applied" : "Mark as applied"}
          >
            <svg className="w-4 h-4" fill={isApplied ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function EssayPanel({
  scholarship: s,
  draft,
  generating,
  wordCount,
  onDraftChange,
  onGenerate,
  onClose,
}: {
  scholarship: PrioritizedScholarship;
  draft: string;
  generating: boolean;
  wordCount: number;
  onDraftChange: (v: string) => void;
  onGenerate: () => void;
  onClose: () => void;
}) {
  const deadline = getDeadlineMeta(s.deadline);
  const amount = s.amountMax ?? s.amount;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{s.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-base font-bold text-emerald-600">{formatCurrencyFull(amount)}</span>
              <span className="text-xs text-slate-400">·</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DEADLINE_PILL_STYLES[deadline.variant]}`}>
                {deadline.label}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                View scholarship →
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Match reasons */}
        {s.matchReasons.length > 0 && (
          <div className="px-8 py-3 border-b border-slate-100 bg-indigo-50">
            <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-1.5">Why you match</p>
            <div className="flex flex-wrap gap-1">
              {s.matchReasons.map((r) => (
                <span key={r} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Draft area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">Essay Draft</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {wordCount} word{wordCount !== 1 ? "s" : ""}
                {draft && <span className="ml-2">{draft.length} chars</span>}
              </span>
              {draft && (
                <button
                  onClick={() => navigator.clipboard.writeText(draft).catch(() => {})}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Copy
                </button>
              )}
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Start writing your essay here, or click 'AI Write' to generate a draft…"
            className="w-full h-72 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed placeholder:text-slate-400"
          />

          {wordCount > 0 && wordCount < 100 && (
            <p className="text-xs text-amber-600 mt-3">
              ⚠ Most scholarship essays are 400–600 words. You&apos;re at {wordCount} — consider expanding your response.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onGenerate}
              disabled={generating}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${generating
                  ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                }
              `}
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Writing…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Write Draft
                </>
              )}
            </button>
            {draft && (
              <button
                onClick={() => onDraftChange("")}
                className="text-xs text-slate-500 hover:text-red-500 transition-colors px-3 py-2"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Drafts are saved locally in your browser. No data is sent except for AI generation.
          </p>
        </div>
      </div>
    </>
  );
}
