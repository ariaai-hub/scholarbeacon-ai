"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

interface FilterState {
  amountMin: number;
  amountMax: number;
  deadlineWindow: number; // days, 0 = all
  matchMin: number;
  types: ScholarshipCategory[];
  showFLOnly: boolean;
  showBrowardOnly: boolean;
}

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

  // Merit: no ethnicity/gender/income fields set
  const hasIdentitySignal =
    (s.ethnicity?.length ?? 0) > 0 ||
    (s.majors?.length ?? 0) > 0 ||
    (s.county?.length ?? 0) > 0;
  if (!hasIdentitySignal && !isCorporate && !isFoundation) {
    cats.push("Merit");
  }

  // Need-based: has county or identity signals suggesting financial need
  if ((s.county?.length ?? 0) > 0 || hasIdentitySignal) {
    if (!isCorporate && !isFoundation) {
      // could be need-based
    }
  }

  // Identity-specific: ethnicity or gender tagged
  if ((s.ethnicity?.length ?? 0) > 0) {
    cats.push("Identity");
  }

  if (isCorporate) cats.push("Corporate");
  if (isFoundation) cats.push("Foundation");
  if (isHBCU) cats.push("HBCU");

  // Residency
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

function formatCurrency(amount: number): string {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `$${amount.toLocaleString()}`;
}

const MATCH_COLOR = (score: number) =>
  score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-indigo-500" : "bg-slate-300";

const MATCH_TEXT_COLOR = (score: number) =>
  score >= 80 ? "text-emerald-700" : score >= 60 ? "text-indigo-700" : "text-slate-500";

const MATCH_BG_COLOR = (score: number) =>
  score >= 80 ? "bg-emerald-50 border-emerald-200" : score >= 60 ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<ScholarshipCategory, string> = {
  Merit: "bg-slate-100 text-slate-700 border-slate-200",
  "Need-Based": "bg-amber-50 text-amber-700 border-amber-200",
  Identity: "bg-violet-50 text-violet-700 border-violet-200",
  Corporate: "bg-blue-50 text-blue-700 border-blue-200",
  Foundation: "bg-rose-50 text-rose-700 border-rose-200",
  HBCU: "bg-orange-50 text-orange-700 border-orange-200",
  "FL Resident": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Broward: "bg-teal-50 text-teal-700 border-teal-200",
};

const DEADLINE_VARIANT_STYLES = {
  passed: "bg-slate-100 text-slate-400 line-through",
  today: "bg-red-100 text-red-700 border border-red-200 animate-pulse",
  urgent: "bg-red-50 text-red-700 border border-red-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  soon: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  upcoming: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  normal: "bg-slate-100 text-slate-500",
};

const STORAGE_KEYS = {
  filters: "sb_filters_v2",
  view: "sb_view",
  sidebarOpen: "sb_sidebar_open",
  drafts: "sb_essay_drafts",
  profile: "sb_profile",
  applied: "sb_applied",
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SonDashboard() {
  const [scholarships, setScholarships] = useState<PrioritizedScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<PriorityView>("deadline");
  const [amountMin, setAmountMin] = useState(0);
  const [amountMax, setAmountMax] = useState(25000);
  const [deadlineWindow, setDeadlineWindow] = useState(0); // 0 = all
  const [matchMin, setMatchMin] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<ScholarshipCategory[]>([]);
  const [flOnly, setFlOnly] = useState(false);
  const [browardOnly, setBrowardOnly] = useState(false);
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
        const parsed: Partial<FilterState> = JSON.parse(f);
        if (parsed.amountMin !== undefined) setAmountMin(parsed.amountMin);
        if (parsed.amountMax !== undefined) setAmountMax(parsed.amountMax);
        if (parsed.deadlineWindow !== undefined) setDeadlineWindow(parsed.deadlineWindow);
        if (parsed.matchMin !== undefined) setMatchMin(parsed.matchMin);
        if (parsed.types !== undefined) setSelectedTypes(parsed.types);
        if (parsed.showFLOnly !== undefined) setFlOnly(parsed.showFLOnly);
        if (parsed.showBrowardOnly !== undefined) setBrowardOnly(parsed.showBrowardOnly);
      }
      const v = localStorage.getItem(STORAGE_KEYS.view);
      if (v && ["deadline", "amount", "match", "strategic"].includes(v)) {
        setActiveView(v as PriorityView);
      }
      const so = localStorage.getItem(STORAGE_KEYS.sidebarOpen);
      if (so !== null) setSidebarOpen(so === "true");
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
    const state: Partial<FilterState> = {
      amountMin,
      amountMax,
      deadlineWindow,
      matchMin,
      types: selectedTypes,
      showFLOnly: flOnly,
      showBrowardOnly: browardOnly,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(state));
    } catch {}
  }, [amountMin, amountMax, deadlineWindow, matchMin, selectedTypes, flOnly, browardOnly]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.view, activeView);
    } catch {}
  }, [activeView]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.sidebarOpen, String(sidebarOpen));
    } catch {}
  }, [sidebarOpen]);

  // ── Derived: categorized scholarships ───────────────────────────────────────

  const categorized = useMemo(() => {
    return scholarships.map((s) => ({ ...s, _cats: categorize(s) }));
  }, [scholarships]);

  // ── Derived: amount range ───────────────────────────────────────────────────

  const maxAmountInData = useMemo(() => {
    if (scholarships.length === 0) return 25000;
    return Math.max(...scholarships.map((s) => s.amountMax ?? s.amount));
  }, [scholarships]);

  // ── Derived: unique sources for filter ──────────────────────────────────────

  const uniqueSources = useMemo(() => {
    const srcs = scholarships.map((s) => s.source).filter(Boolean);
    return [...new Set(srcs)].slice(0, 30);
  }, [scholarships]);

  // ── Derived: filtered + sorted scholarships ─────────────────────────────────

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
      return true;
    });

    // Sort
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
  }, [categorized, amountMin, amountMax, deadlineWindow, matchMin, selectedTypes, flOnly, browardOnly, activeView]);

  // ── Stats ───────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalAmt = filtered.reduce(
      (sum, s) => sum + (s.amountMax ?? s.amount),
      0
    );
    const now = Date.now();
    const urgent = filtered.filter(
      (s) =>
        Math.ceil((new Date(s.deadline).getTime() - now) / 86400000) <= 14 &&
        Math.ceil((new Date(s.deadline).getTime() - now) / 86400000) > 0
    ).length;
    const highMatch = filtered.filter((s) => s.matchScore >= 80).length;
    return { total: filtered.length, totalAmt, urgent, highMatch };
  }, [filtered]);

  // ── Essay panel helpers ─────────────────────────────────────────────────────

  function openEssayPanel(s: PrioritizedScholarship) {
    setEssayPanelScholarship(s);
    try {
      const drafts = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.drafts) ?? "{}"
      ) as Record<string, string>;
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
      const drafts = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.drafts) ?? "{}"
      ) as Record<string, string>;
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
        localStorage.setItem(
          STORAGE_KEYS.applied,
          JSON.stringify(Object.keys(next).filter((k) => next[k]))
        );
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

      if (data.content) {
        drafted = data.content;
        setEssayDraft(drafted);
        saveDraft(scholarship.id, drafted);
      } else if (data.text) {
        drafted = data.text;
        setEssayDraft(drafted);
        saveDraft(scholarship.id, drafted);
      }
    } catch (err) {
      console.error("Essay generation error:", err);
    } finally {
      setAiGenerating(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const wordCount = essayDraft.trim()
    ? essayDraft.trim().split(/\s+/).length
    : 0;

  const activeFilterCount =
    (amountMin > 0 || amountMax < maxAmountInData ? 1 : 0) +
    (deadlineWindow > 0 ? 1 : 0) +
    (matchMin > 0 ? 1 : 0) +
    (selectedTypes.length > 0 ? 1 : 0) +
    (flOnly ? 1 : 0) +
    (browardOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Top Header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Shomari Jr.&apos;s Scholarships
              </h1>
              <p className="text-xs text-slate-500">
                {loading ? "Loading..." : `${stats.total.toLocaleString()} matches`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatCurrency(stats.totalAmt)} potential
            </span>
            {stats.urgent > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                {stats.urgent} urgent
              </span>
            )}
            <Link
              href="/son/search"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Search
            </Link>
          </div>
        </div>

        {/* Filter chips strip */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-slate-400 whitespace-nowrap">Filters:</span>
            {amountMin > 0 && (
              <FilterChip
                label={`Min $${amountMin.toLocaleString()}`}
                onRemove={() => setAmountMin(0)}
              />
            )}
            {amountMax < maxAmountInData && (
              <FilterChip
                label={`Max $${amountMax.toLocaleString()}`}
                onRemove={() => setAmountMax(maxAmountInData)}
              />
            )}
            {deadlineWindow > 0 && (
              <FilterChip
                label={`≤${deadlineWindow} days`}
                onRemove={() => setDeadlineWindow(0)}
              />
            )}
            {matchMin > 0 && (
              <FilterChip
                label={`Match ≥${matchMin}%`}
                onRemove={() => setMatchMin(0)}
              />
            )}
            {selectedTypes.map((t) => (
              <FilterChip
                key={t}
                label={t}
                onRemove={() => setSelectedTypes((prev) => prev.filter((x) => x !== t))}
              />
            ))}
            {flOnly && (
              <FilterChip
                label="FL Resident"
                onRemove={() => setFlOnly(false)}
              />
            )}
            {browardOnly && (
              <FilterChip
                label="Broward County"
                onRemove={() => setBrowardOnly(false)}
              />
            )}
            <button
              onClick={() => {
                setAmountMin(0);
                setAmountMax(maxAmountInData);
                setDeadlineWindow(0);
                setMatchMin(0);
                setSelectedTypes([]);
                setFlOnly(false);
                setBrowardOnly(false);
              }}
              className="text-xs text-slate-400 hover:text-red-500 whitespace-nowrap transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </header>

      <div className="flex">
        {/* ── Profile Sidebar ────────────────────────────────────────────── */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-20 bg-white border-r border-slate-200 shadow-lg
            transform transition-transform duration-300 ease-in-out
            w-72 overflow-y-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:relative lg:translate-x-0 lg:shadow-none lg:border-0 lg:bg-transparent lg:overflow-visible
          `}
        >
          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-[-1] lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="p-5 lg:sticky lg:top-0 lg:pt-6">
            {/* Student Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-200 border-2 border-indigo-300 rounded-full w-12 h-12 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    S
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{STUDENT_PROFILE.name}</p>
                    <p className="text-indigo-200 text-xs">{STUDENT_PROFILE.school}</p>
                    <p className="text-indigo-200 text-xs">Class of {STUDENT_PROFILE.gradYear}</p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <StatPill label="GPA" value={STUDENT_PROFILE.gpa} />
                  <StatPill label="SAT" value={STUDENT_PROFILE.sat} />
                  <StatPill label="Major" value={STUDENT_PROFILE.major} />
                  <StatPill label="Income" value={STUDENT_PROFILE.income} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    STUDENT_PROFILE.ethnicity,
                    STUDENT_PROFILE.gender,
                    STUDENT_PROFILE.county,
                    "FL Resident",
                    `${STUDENT_PROFILE.communityHours}h volunteer`,
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Match legend */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Match Score Legend
              </p>
              <div className="space-y-2">
                <MatchLegendItem score={80} label="Strong match" color="emerald" />
                <MatchLegendItem score={60} label="Good match" color="indigo" />
                <MatchLegendItem score={40} label="Partial match" color="slate" />
              </div>
            </div>

            {/* Priority Views */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Sort By
              </p>
              <div className="space-y-1">
                {([
                  ["deadline", "Deadline", "⚡"],
                  ["amount", "Biggest Award", "$"],
                  ["match", "Best Match", "✓"],
                  ["strategic", "Strategic", "★"],
                ] as const).map(([key, label, icon]) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${activeView === key
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "text-slate-600 hover:bg-slate-50 border border-transparent"
                      }
                    `}
                  >
                    <span className="text-base">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Amount range */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Amount:</span>
                <input
                  type="number"
                  value={amountMin}
                  onChange={(e) => setAmountMin(Math.max(0, Number(e.target.value)))}
                  className="w-20 text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Min"
                />
                <span className="text-xs text-slate-400">–</span>
                <input
                  type="number"
                  value={amountMax}
                  onChange={(e) => setAmountMax(Math.max(amountMin, Number(e.target.value)))}
                  className="w-20 text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Max"
                />
              </div>

              <div className="w-px h-5 bg-slate-200 hidden sm:block" />

              {/* Deadline tabs */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                {([
                  [0, "All"],
                  [30, "≤30d"],
                  [60, "≤60d"],
                  [90, "≤90d"],
                ] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setDeadlineWindow(val)}
                    className={`
                      px-2.5 py-1 rounded-md text-xs font-medium transition-all
                      ${deadlineWindow === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="w-px h-5 bg-slate-200 hidden sm:block" />

              {/* Match score */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">Match:</span>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                  {[0, 40, 60, 80].map((val) => (
                    <button
                      key={val}
                      onClick={() => setMatchMin(val)}
                      className={`
                        px-2.5 py-1 rounded-md text-xs font-medium transition-all
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

              <div className="w-px h-5 bg-slate-200 hidden sm:block" />

              {/* More filters toggle */}
              <button
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                  ${filterSidebarOpen
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                More
                {activeFilterCount > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Results count */}
              <span className="ml-auto text-xs text-slate-500 whitespace-nowrap">
                {loading ? "…" : `${stats.total.toLocaleString()} scholarships`}
              </span>
            </div>
          </div>

          {/* Expanded filter sidebar (slide-in on mobile, inline on lg) */}
          {filterSidebarOpen && (
            <div className="bg-white border-b border-slate-200 px-4 py-4">
              <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Scholarship type */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Type</p>
                  <div className="flex flex-col gap-1">
                    {(["Merit", "Need-Based", "Identity", "Corporate", "Foundation", "HBCU"] as const).map((t) => (
                      <label key={t} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(t)}
                          onChange={(e) => {
                            setSelectedTypes((prev) =>
                              e.target.checked
                                ? [...prev, t]
                                : prev.filter((x) => x !== t)
                            );
                          }}
                          className="rounded border-slate-300 text-indigo-600 w-3.5 h-3.5"
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Residency */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Residency</p>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={flOnly}
                        onChange={(e) => setFlOnly(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 w-3.5 h-3.5"
                      />
                      FL Resident
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                      <input
                        type="checkbox"
                        checked={browardOnly}
                        onChange={(e) => setBrowardOnly(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 w-3.5 h-3.5"
                      />
                      Broward County
                    </label>
                  </div>
                </div>

                {/* Stats summary */}
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Quick Stats</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-emerald-600">{stats.highMatch}</p>
                      <p className="text-[10px] text-slate-500">≥80%</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-amber-600">{stats.urgent}</p>
                      <p className="text-[10px] text-slate-500">≤14 days</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-indigo-600">{stats.total}</p>
                      <p className="text-[10px] text-slate-500">Total</p>
                    </div>
                  </div>
                </div>

                {/* Source quick filter */}
                {uniqueSources.length > 0 && (
                  <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Top Sources</p>
                    <div className="flex flex-wrap gap-1">
                      {uniqueSources.slice(0, 8).map((src) => (
                        <span key={src} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {src.length > 20 ? src.slice(0, 20) + "…" : src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card grid */}
          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold mb-1">No scholarships match your filters</p>
                <p className="text-slate-500 text-sm mb-4">Try adjusting the filters above to see more results</p>
                <button
                  onClick={() => {
                    setAmountMin(0);
                    setAmountMax(maxAmountInData);
                    setDeadlineWindow(0);
                    setMatchMin(0);
                    setSelectedTypes([]);
                    setFlOnly(false);
                    setBrowardOnly(false);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
          </div>
        </main>
      </div>

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

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-indigo-900 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg px-2 py-1.5">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
    </div>
  );
}

function MatchLegendItem({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: "emerald" | "indigo" | "slate";
}) {
  const colorMap = {
    emerald: "bg-emerald-500",
    indigo: "bg-indigo-500",
    slate: "bg-slate-300",
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 rounded-full h-1.5 ${colorMap[color]}`} />
      <span className="text-xs text-slate-600">
        <span className="font-semibold">≥{score}%</span> — {label}
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
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
  const deadlineLeft =
    deadline.daysUntil < 0 ? null : Math.ceil((new Date(s.deadline).getTime() - Date.now()) / 86400000);
  const isUrgent = deadlineLeft !== null && deadlineLeft <= 14;

  const cardBorderAccent =
    isUrgent
      ? "border-l-4 border-l-amber-400"
      : s.matchScore >= 80
      ? "border-l-4 border-l-emerald-400"
      : s.matchScore >= 60
      ? "border-l-4 border-l-indigo-400"
      : "";

  return (
    <div
      className={`
        group bg-white rounded-2xl border border-slate-200 shadow-sm
        hover:shadow-md hover:border-slate-300 transition-all duration-200
        ${cardBorderAccent}
        relative
      `}
    >
      <div className="p-5">
        {/* Top row: categories + amount + deadline */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
              >
                {cat}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="text-[10px] text-slate-400">+{categories.length - 2}</span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-emerald-700 leading-tight">
              {amount >= 1000 ? `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K` : `$${amount.toLocaleString()}`}
            </p>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${DEADLINE_VARIANT_STYLES[deadline.variant]}`}
            >
              {deadline.label}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-2">
          {s.name}
        </h3>

        {/* Source */}
        <p className="text-xs text-slate-400 mb-3 truncate">{s.source}</p>

        {/* Match score bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${MATCH_COLOR(s.matchScore)}`}
              style={{ width: `${s.matchScore}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${MATCH_TEXT_COLOR(s.matchScore)}`}>
            {s.matchScore}%
          </span>
        </div>

        {/* Match reasons (truncated) */}
        {s.matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {s.matchReasons.slice(0, 2).map((r) => (
              <span
                key={r}
                className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
              >
                {r.length > 25 ? r.slice(0, 25) + "…" : r}
              </span>
            ))}
            {s.matchReasons.length > 2 && (
              <span className="text-[10px] text-slate-400">
                +{s.matchReasons.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 py-2 rounded-lg transition-colors"
          >
            Apply →
          </a>
          <button
            onClick={onOpenEssay}
            className={`
              flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-lg border transition-all
              ${hasDraft
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                : "text-slate-600 border-slate-200 hover:bg-slate-50"
              }
            `}
          >
            {hasDraft ? (
              <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
            Draft
          </button>
          <button
            onClick={onToggleApplied}
            className={`
              flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-lg border transition-all
              ${isApplied
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : "text-slate-500 border-slate-200 hover:bg-slate-50"
              }
            `}
            title={isApplied ? "Marked as applied" : "Mark as applied"}
          >
            {isApplied ? (
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
              {s.name}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-bold text-emerald-700">
                {amount >= 1000 ? `$${(amount / 1000).toFixed(1)}K` : `$${amount.toLocaleString()}`}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DEADLINE_VARIANT_STYLES[deadline.variant]}`}>
                {deadline.label}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
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
          <div className="px-6 py-3 border-b border-slate-100 bg-indigo-50">
            <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-1.5">
              Why you match
            </p>
            <div className="flex flex-wrap gap-1">
              {s.matchReasons.map((r) => (
                <span
                  key={r}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Draft area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-700">Essay Draft</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {wordCount} words
                {draft && <span className="ml-2">{draft.length} chars</span>}
              </span>
              {draft && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(draft).catch(() => {});
                  }}
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
            className="w-full h-64 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed placeholder:text-slate-400"
          />

          {wordCount > 0 && wordCount < 100 && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠ Most scholarship essays are 400–600 words. You&apos;re at {wordCount} — consider expanding your response.
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onGenerate}
              disabled={generating}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
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
            <button
              onClick={() => onDraftChange("")}
              className="text-xs text-slate-500 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Drafts are saved locally in your browser. No data is sent to external servers except for AI generation.
          </p>
        </div>
      </div>
    </>
  );
}
