"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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

interface DashboardStats {
  totalScraped: number;
  totalEligible: number;
  totalPotentialAward: number;
  loading: boolean;
  scraping: boolean;
}

export default function PersonalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScraped: 0,
    totalEligible: 0,
    totalPotentialAward: 0,
    loading: true,
    scraping: false,
  });
  const [scholarships, setScholarships] = useState<PrioritizedScholarship[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scrapeResult, setScrapeResult] = useState<string>("");

  const loadData = useCallback(async () => {
    setStats((s) => ({ ...s, loading: true }));
    try {
      const [prioritizedRes, countRes] = await Promise.all([
        fetch("/api/scholarships/prioritized?limit=600"),
        fetch("/api/scholarships?limit=1"),
      ]);
      const prioritized = await prioritizedRes.json();
      const countData = await countRes.json();

      const allScholarships = prioritized.scholarships ?? [];
      setScholarships(allScholarships);

      const eligible = allScholarships.filter((s: PrioritizedScholarship) => s.matchScore > 0);
      const totalAward = eligible.reduce(
        (sum: number, s: PrioritizedScholarship) => sum + (s.amountMax ?? s.amount),
        0
      );

      setStats({
        totalScraped: (countData.scholarships?.total ?? 0) || allScholarships.length,
        totalEligible: eligible.length,
        totalPotentialAward: totalAward,
        loading: false,
        scraping: false,
      });
    } catch (err) {
      console.error("Load error:", err);
      setStats((s) => ({ ...s, loading: false, scraping: false }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScrape = async () => {
    setStats((s) => ({ ...s, scraping: true }));
    setScrapeResult("");
    try {
      const res = await fetch("/api/scrape/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();
      setScrapeResult(
        `✅ Scraped! ${data.totalNew} new scholarships added from ${data.results?.length ?? 0} sources.`
      );
      await loadData();
    } catch (err) {
      setScrapeResult("❌ Scrape failed. Check server logs.");
      setStats((s) => ({ ...s, scraping: false }));
    }
  };

  const handleExport = () => {
    window.open("/api/scholarships/export", "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Shomari Jr.'s Scholarships</h1>
            <p className="text-indigo-200 text-sm">536 matches · Sorted by eligibility & deadline</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleScrape}
              disabled={stats.scraping}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {stats.scraping ? "⏳ Scraping..." : "🔍 Scrape More"}
            </button>
            <button
              onClick={handleExport}
              className="bg-white text-indigo-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              📥 Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Scrape result banner */}
        {scrapeResult && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-lg text-sm">
            {scrapeResult}
          </div>
        )}

        {/* Stats Row */}
        {stats.loading ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 text-center animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-indigo-600">{stats.totalScraped.toLocaleString()}</p>
              <p className="text-slate-500 text-sm mt-1">Scholarships Scraped</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.totalEligible.toLocaleString()}</p>
              <p className="text-slate-500 text-sm mt-1">Eligible for You</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-amber-600">
                ${stats.totalPotentialAward.toLocaleString()}
              </p>
              <p className="text-slate-500 text-sm mt-1">Total Potential Award</p>
            </div>
          </div>
        )}

        {/* Scholarship Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">
              All {scholarships.length} Scholarships for Shomari Jr.
            </h2>
            <p className="text-slate-500 text-sm">
              Sorted by match score × award amount × deadline urgency
            </p>
          </div>

          {stats.loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : scholarships.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No scholarships found. Click "Scrape More" to discover scholarships.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-3 font-semibold text-slate-600">Scholarship</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Amount</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Match</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Deadline</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Source</th>
                    <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scholarships.map((s) => {
                    const daysUntil = Math.ceil(
                      (new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysUntil <= 14 && daysUntil > 0;
                    const isPast = daysUntil < 0;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-900 max-w-xs truncate">{s.name}</div>
                          <div className="text-slate-400 text-xs mt-0.5">
                            {s.majors?.slice(0, 2).join(", ") || "All majors"}
                            {s.county?.length ? ` • ${s.county.join(", ")}` : ""}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-green-700">
                            ${s.amount.toLocaleString()}
                            {s.amountMax && s.amountMax > s.amount
                              ? `–$${s.amountMax.toLocaleString()}`
                              : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              s.matchScore >= 80
                                ? "bg-green-100 text-green-700"
                                : s.matchScore >= 60
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {s.matchScore}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              isPast
                                ? "text-red-500"
                                : isUrgent
                                ? "text-amber-600 font-medium"
                                : "text-slate-600"
                            }
                          >
                            {new Date(s.deadline).toLocaleDateString()}
                            {isPast ? " (passed)" : isUrgent ? ` (${daysUntil}d)` : ""}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.source}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                            >
                              Apply →
                            </a>
                            <button
                              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                              className="text-slate-500 hover:text-slate-700 text-xs"
                            >
                              {expanded === s.id ? "Hide" : "Details"}
                            </button>
                          </div>
                          {expanded === s.id && (
                            <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded p-2">
                              {s.matchReasons.slice(0, 4).map((r) => (
                                <span key={r} className="inline-block bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded mr-1 mb-1">
                                  {r}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
