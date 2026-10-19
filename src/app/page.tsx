import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-slate-900">ScholarSon</span>
          </div>
          <Link
            href="/son/dashboard"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Go to Dashboard →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            Your personal scholarship assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Find every scholarship<br />
            <span className="text-indigo-600">you&apos;re actually eligible for</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Build your profile once. Get matched to scholarships automatically.
            Draft application essays with AI — refined to sound human.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/son/dashboard"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-center"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/son/profile"
              className="border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-medium hover:bg-slate-100 transition-colors text-center"
            >
              Build Your Profile
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            No account required. No credit card. Just results.
          </p>
        </div>
      </main>
    </div>
  );
}
