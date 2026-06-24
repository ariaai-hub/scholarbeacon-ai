import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, scholar
        </h1>
        <p className="text-slate-600 mt-1">
          Here&apos;s your scholarship overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Saved Scholarships", value: "0", icon: "📚" },
          { label: "Applications Submitted", value: "0", icon: "✅" },
          { label: "Total Awarded", value: "$0", icon: "🏆" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-3xl font-bold text-slate-900">{value}</div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Profile CTA */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-10">
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

      {/* Recent Scholarships */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Top Matches For You</h2>
          <Link href="/scholarships" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            View all
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-12 text-center text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>Complete your profile to see scholarship matches</p>
          </div>
        </div>
      </div>
    </div>
  );
}
