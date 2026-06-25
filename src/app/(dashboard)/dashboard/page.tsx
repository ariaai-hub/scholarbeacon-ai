import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateProfileCompleteness } from "@/lib/profile-completeness";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      subscription: true,
      applications: {
        include: { scholarship: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const profile = user.studentProfile;
  const applications = user.applications;

  const completenessScore = profile
    ? calculateProfileCompleteness(profile as Parameters<typeof calculateProfileCompleteness>[0])
    : 0;

  const savedCount = applications.filter((a) => a.status === "SAVED").length;
  const appliedCount = applications.filter((a) => a.status === "APPLIED").length;
  const acceptedCount = applications.filter((a) => a.status === "ACCEPTED").length;
  const totalAwarded = applications
    .filter((a) => a.awardedAmount)
    .reduce((sum, a) => sum + (a.awardedAmount || 0), 0);

  // Get top 5 saved matches
  const topMatches = applications
    .filter((a) => a.status === "SAVED")
    .slice(0, 5);

  const now = new Date();
  const nextDeadline = applications
    .filter((a) => a.status === "SAVED" && new Date(a.scholarship.deadline) > now)
    .sort((a, b) => new Date(a.scholarship.deadline).getTime() - new Date(b.scholarship.deadline).getTime())[0];

  const isFree = user.subscription?.plan === "FREE" || !user.subscription;
  const hasProfile = !!profile;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back{profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-slate-600 mt-1">
          Here's your scholarship overview
        </p>
      </div>

      {/* Profile completeness */}
      {hasProfile && (
        <div className="mb-6 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-900">Profile Completeness</h3>
              <p className="text-sm text-slate-500">More info = better matches</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{completenessScore}%</div>
              {completenessScore < 100 && (
                <Link href="/onboarding" className="text-xs text-indigo-600 hover:text-indigo-700">
                  Complete profile →
                </Link>
              )}
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all"
              style={{ width: `${completenessScore}%` }}
            />
          </div>
        </div>
      )}

      {/* No profile CTA */}
      {!hasProfile && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-indigo-900 mb-1">Complete your profile</h3>
              <p className="text-sm text-indigo-700">
                A complete profile unlocks more scholarship matches and AI-powered insights.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition shrink-0"
            >
              Build Profile
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Matched" value={savedCount} icon="🎯" />
        <StatCard label="Applied" value={appliedCount} icon="✅" />
        <StatCard label="Accepted" value={acceptedCount} icon="🏆" />
        <StatCard label="Total Awarded" value={totalAwarded > 0 ? `$${totalAwarded.toLocaleString()}` : "$0"} icon="💰" />
      </div>

      {/* Next deadline */}
      {nextDeadline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">Next Deadline</p>
              <h3 className="font-semibold text-amber-900">{nextDeadline.scholarship.name}</h3>
              <p className="text-sm text-amber-700 mt-0.5">
                ${nextDeadline.scholarship.amount.toLocaleString()} · Due {new Date(nextDeadline.scholarship.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-2xl font-bold text-amber-600">
                {Math.max(0, Math.ceil((new Date(nextDeadline.scholarship.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}d
              </div>
              <p className="text-xs text-amber-600">left</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Matches */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Your Top Matches</h2>
          <div className="flex gap-3">
            <form>
              <button
                formAction={async () => {
                  "use server";
                  const { prisma: db } = await import("@/lib/prisma");
                  const { auth: getAuth } = await import("@clerk/nextjs/server");
                  const { userId: uid } = await getAuth();
                  if (!uid) return;
                  const profile = await db.studentProfile.findUnique({ where: { userId: uid } });
                  if (!profile) return;
                  await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/match`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileId: profile.id }),
                  });
                }}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
              >
                Refresh Matches
              </button>
            </form>
            <Link href="/scholarships" className="text-sm text-slate-500 hover:text-slate-700 font-medium">
              View all →
            </Link>
          </div>
        </div>

        {!hasProfile ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-500">Complete your profile to see scholarship matches</p>
            <Link
              href="/onboarding"
              className="inline-block mt-4 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Build Profile
            </Link>
          </div>
        ) : topMatches.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-slate-500 mb-4">No matches yet — let's find scholarships for you</p>
            <form action={async () => {
              "use server";
              // Trigger matchmaking
              const { prisma: db } = await import("@/lib/prisma");
              const { auth: getAuth } = await import("@clerk/nextjs/server");
              const { userId: uid } = await getAuth();
              if (!uid) return;
              const profile = await db.studentProfile.findUnique({ where: { userId: uid } });
              if (!profile) return;
              // Fire and forget matchmaking
              fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/match`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id }),
              });
            }}>
              <button
                type="submit"
                className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Find My Scholarships
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {topMatches.map((app) => {
              const daysLeft = Math.max(0, Math.ceil((new Date(app.scholarship.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              return (
                <div key={app.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 truncate">{app.scholarship.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          daysLeft <= 7 ? "bg-red-100 text-red-700" :
                          daysLeft <= 30 ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {daysLeft}d left
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <span className="font-semibold text-slate-700">
                          ${app.scholarship.amount.toLocaleString()}
                        </span>
                        <span>{app.scholarship.source}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={app.scholarship.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                        >
                          Apply Now
                        </a>
                        <Link
                          href={`/scholarships/${app.scholarship.id}`}
                          className="border border-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:border-slate-400 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {isFree && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 text-center">
                <p className="text-sm text-indigo-700 font-medium">
                  🔒 Upgrade to unlock unlimited matches
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  Free plan shows 5 matches. Get unlimited access for $9.99/mo.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block mt-3 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
