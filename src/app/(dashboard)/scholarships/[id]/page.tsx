import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ScholarshipDetailPage({ params }: Params) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
  });

  if (!scholarship) {
    notFound();
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
  });

  const application = await prisma.application.findUnique({
    where: {
      userId_scholarshipId: {
        userId,
        scholarshipId: id,
      },
    },
  });

  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (scholarship.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const requiredDocs = (scholarship.requiredDocs as string[] | null) || [];
  const essayPrompts = (scholarship.essayPrompts as string[] | null) || [];
  const isExpired = scholarship.deadline < now;

  // Determine which docs the student likely has
  const studentDocStatus = {
    hasResume: profile?.hasResume ?? false,
    hasTranscript: profile?.hasUnofficialTranscript ?? false,
    hasRecommendations: profile?.canGetRecommendationLetters ?? false,
  };

  const handleSave = async () => {
    "use server";
    const { prisma: db } = await import("@/lib/prisma");
    const { auth: getAuth } = await import("@clerk/nextjs/server");
    const { userId: uid } = await getAuth();
    if (!uid) return;
    await db.application.upsert({
      where: { userId_scholarshipId: { userId: uid, scholarshipId: id } },
      create: { userId: uid, scholarshipId: id, status: "SAVED" },
      update: { status: "SAVED" },
    });
  };

  const handleApply = async () => {
    "use server";
    const { prisma: db } = await import("@/lib/prisma");
    const { auth: getAuth } = await import("@clerk/nextjs/server");
    const { userId: uid } = await getAuth();
    if (!uid) return;
    await db.application.upsert({
      where: { userId_scholarshipId: { userId: uid, scholarshipId: id } },
      create: { userId: uid, scholarshipId: id, status: "APPLIED", appliedAt: new Date() },
      update: { status: "APPLIED", appliedAt: new Date() },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
        ← Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isExpired ? "bg-slate-100 text-slate-600" :
                    daysLeft <= 7 ? "bg-red-100 text-red-700" :
                    daysLeft <= 30 ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {isExpired ? "Deadline passed" : `${daysLeft} days left`}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{scholarship.name}</h1>
                <p className="text-slate-500 text-sm mt-1">{scholarship.source}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-indigo-600">
                  ${scholarship.amount.toLocaleString()}
                </div>
                {scholarship.amountMax && (
                  <div className="text-sm text-slate-500">
                    up to ${scholarship.amountMax.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {scholarship.educationLevel.map((level) => (
                <span key={level} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {level.replace(/_/g, " ")}
                </span>
              ))}
            </div>

            {/* Deadline */}
            <div className="bg-slate-50 rounded-lg p-4 mb-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Deadline</p>
                  <p className="font-semibold text-slate-900">
                    {scholarship.deadline.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {scholarship.gpaMin && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Min GPA</p>
                    <p className="font-semibold text-slate-900">{Number(scholarship.gpaMin).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <a
                href={scholarship.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm"
              >
                Apply Now
              </a>
              <form action={handleSave}>
                <button
                  type="submit"
                  className={`font-medium px-4 py-2.5 rounded-xl border transition ${
                    application?.status === "SAVED"
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-slate-300 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {application?.status === "SAVED" ? "✓ Saved" : "Save to My List"}
                </button>
              </form>
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Eligibility</h2>
            <ul className="space-y-2">
              {scholarship.citizenshipTypes.length > 0 && (
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Citizenship: {scholarship.citizenshipTypes.join(", ").replace(/_/g, " ")}</span>
                </li>
              )}
              {scholarship.gpaMin && (
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Minimum GPA: {Number(scholarship.gpaMin).toFixed(2)}</span>
                </li>
              )}
              {scholarship.communityServiceRequired && (
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Community service required</span>
                </li>
              )}
              {scholarship.disabilityStatusRequired && (
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Open to students with disabilities</span>
                </li>
              )}
              {scholarship.majors && (
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>Preferred majors: {(scholarship.majors as string[]).join(", ")}</span>
                </li>
              )}
              {scholarship.incomeBrackets && (
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>Income consideration: {(scholarship.incomeBrackets as string[]).join(", ")}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Essay prompts */}
          {essayPrompts.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Essay Prompts</h2>
              <ul className="space-y-3">
                {essayPrompts.map((prompt, i) => (
                  <li key={i} className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700">
                    <span className="font-semibold text-slate-500 mr-2">Q{i + 1}:</span>
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Required docs */}
          {requiredDocs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Required Documents</h3>
              <ul className="space-y-2">
                {requiredDocs.map((doc) => {
                  const hasIt = doc.toLowerCase().includes("transcript")
                    ? studentDocStatus.hasTranscript
                    : doc.toLowerCase().includes("resume")
                    ? studentDocStatus.hasResume
                    : doc.toLowerCase().includes("recommendation")
                    ? studentDocStatus.hasRecommendations
                    : null;
                  return (
                    <li key={doc} className="flex items-center gap-2 text-sm">
                      {hasIt !== null && (
                        <span className={hasIt ? "text-green-500" : "text-amber-500"}>
                          {hasIt ? "✓" : "○"}
                        </span>
                      )}
                      <span className={hasIt === false ? "text-amber-700" : "text-slate-700"}>
                        {doc}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Why you match */}
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5">
            <h3 className="font-semibold text-indigo-900 mb-3">Why You Match</h3>
            {profile && (
              <div className="space-y-2 text-sm text-indigo-800">
                {scholarship.educationLevel.includes(profile.educationLevel) && (
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>Your education level ({profile.educationLevel.replace(/_/g, " ")}) matches</span>
                  </div>
                )}
                {scholarship.citizenshipTypes.includes(profile.citizenshipStatus) && (
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>Your citizenship status qualifies</span>
                  </div>
                )}
                {(!scholarship.gpaMin || (profile.gpa && Number(profile.gpa) >= Number(scholarship.gpaMin))) && (
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>Your GPA meets the minimum requirement</span>
                  </div>
                )}
              </div>
            )}
            {!profile && (
              <p className="text-sm text-indigo-700">
                Complete your profile to see why you match.
              </p>
            )}
          </div>

          {/* AI tools */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">AI Tools</h3>
            <div className="space-y-2">
              <a
                href={`/api/prefill/${id}`}
                className="flex items-center gap-2 w-full text-sm text-slate-700 hover:text-indigo-600 py-1.5 transition"
              >
                <span>📋</span> Pre-fill My Application
              </a>
              <form action={async () => {
                // Essay generation would be triggered via API
              }}>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full text-sm text-slate-700 hover:text-indigo-600 py-1.5 transition"
                  onClick={async () => {
                    const res = await fetch("/api/essay/generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ scholarshipId: id, promptType: "personal_statement" }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      alert("Essay generated! Check your dashboard for the draft.");
                    }
                  }}
                >
                  <span>✍️</span> Draft My Essay
                </button>
              </form>
            </div>
          </div>

          {/* Source */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Source</p>
            <a
              href={scholarship.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-700 break-all"
            >
              {scholarship.canonicalUrl}
            </a>
            <p className="text-xs text-slate-400 mt-2">
              Last verified: {scholarship.lastVerifiedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
