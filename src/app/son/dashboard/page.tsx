"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "scholarship_profile";

interface Match {
  id: string;
  name: string;
  amount: number;
  amountMax: number;
  deadline: string;
  source: string;
  gpaMin: string;
  matchScore: number;
  matchReasons: string[];
  educationLevel: string[];
  citizenshipTypes: string[];
}

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  educationLevel: string;
  gpa: string;
  major: string;
  incomeBrackets: string[];
  demographics: string[];
  ethnicity: string;
  gender: string;
  hasLeadership: boolean;
  hasCommunityService: boolean;
  hasAthleticInvolvement: boolean;
  hasWorkExperience: boolean;
  isFirstGeneration: boolean;
}

export default function PersonalDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Match | null>(null);
  const [essayLoading, setEssayLoading] = useState(false);
  const [essay, setEssay] = useState("");
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const p = JSON.parse(stored);
      setProfile(p);
      if (p.state && p.educationLevel) {
        fetchMatches(p);
      }
    } else {
      setShowWizard(true);
    }
  }, []);

  const fetchMatches = async (p: Profile) => {
    setMatchLoading(true);
    try {
      const res = await fetch("/api/match-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          educationLevel: p.educationLevel,
          state: p.state,
          gpa: p.gpa,
          demographics: p.demographics,
          incomeBrackets: p.incomeBrackets,
          isFirstGeneration: p.isFirstGeneration,
        }),
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setMatchLoading(false);
    }
  };

  const generateEssay = async (scholarship: Match) => {
    setSelectedScholarship(scholarship);
    setExpanded(scholarship.id);
    setEssayLoading(true);
    setEssay("");
    try {
      const res = await fetch("/api/essay/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipName: scholarship.name,
          prompt: "Write a compelling personal statement essay.",
          profile: profile,
        }),
      });
      const data = await res.json();
      setEssay(data.essay || "Essay generation failed. Please try again.");
    } catch (err) {
      setEssay("Error generating essay. Please try again.");
    } finally {
      setEssayLoading(false);
    }
  };

  if (showWizard || !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-indigo-600 text-white px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold">ScholarSon</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Build Your Profile</h2>
          <p className="text-slate-600 mb-8">Set up your profile so we can find scholarships tailored to you.</p>
          <Link
            href="/profile"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
          >
            Build My Profile →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">ScholarSon</h1>
            <p className="text-indigo-200 text-sm">Welcome back, {profile.firstName || "there"}</p>
          </div>
          <Link
            href="/profile"
            className="text-indigo-200 hover:text-white text-sm font-medium"
          >
            Edit Profile →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Scholarships Found", value: matches.length, color: "text-indigo-600" },
            { label: "Deadline This Month", value: matches.filter((m) => {
              const d = new Date(m.deadline);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length, color: "text-amber-600" },
            { label: "High Match (90%+)", value: matches.filter((m) => m.matchScore >= 90).length, color: "text-green-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Match Loading */}
        {matchLoading && (
          <div className="text-center py-12 text-slate-500">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
            </div>
            <p className="mt-4 text-sm">Finding scholarships for you...</p>
          </div>
        )}

        {/* Match List */}
        {!matchLoading && matches.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No scholarships found yet. Make sure your profile is complete.</p>
            <Link href="/profile" className="text-indigo-600 font-medium mt-2 inline-block">→ Complete your profile</Link>
          </div>
        )}

        {!matchLoading && matches.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Scholarships For You ({matches.length})
            </h2>
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{match.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            match.matchScore >= 90
                              ? "bg-green-100 text-green-700"
                              : match.matchScore >= 75
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {match.matchScore}% match
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="font-semibold text-green-600">
                          ${match.amount.toLocaleString()}
                          {match.amountMax > match.amount ? ` – $${match.amountMax.toLocaleString()}` : ""}
                        </span>
                        <span>Deadline: {new Date(match.deadline).toLocaleDateString()}</span>
                        <span>{match.source}</span>
                      </div>
                      {/* Match reasons */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {match.matchReasons.slice(0, 3).map((reason) => (
                          <span key={reason} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => generateEssay(match)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                      >
                        {essayLoading && selectedScholarship?.id === match.id ? "Writing..." : "AI Essay"}
                      </button>
                      <button
                        onClick={() => setExpanded(expanded === match.id ? null : match.id)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-lg font-medium hover:border-slate-400 transition-colors"
                      >
                        {expanded === match.id ? "Hide" : "Details"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === match.id && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-700 mb-1">Eligibility</p>
                        <ul className="space-y-0.5 text-slate-600">
                          <li>• Min GPA: {match.gpaMin || "None"}</li>
                          <li>• Education: {match.educationLevel.join(", ")}</li>
                          <li>• Citizenship: {match.citizenshipTypes.join(", ")}</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-slate-700 mb-1">Quick Apply</p>
                        <a
                          href={match.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 text-sm hover:underline"
                        >
                          Visit scholarship site →
                        </a>
                      </div>
                    </div>

                    {/* Essay */}
                    {(essayLoading || essay) && selectedScholarship?.id === match.id && (
                      <div className="border-t border-slate-200 pt-4">
                        {essayLoading ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                            <p className="text-slate-400 text-sm italic">AI is writing your essay draft...</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-slate-700 mb-2">AI Essay Draft</p>
                            <div className="bg-white border border-indigo-200 rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {essay}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                              This is a draft — review and personalize before submitting.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
