import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <SiteNav />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Over $7 billion in scholarships available
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
          The AI that finds every<br />
          <span className="text-indigo-600">scholarship you&apos;re eligible for</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Stop searching. Stop guessing. ScholarBeacon analyzes your academic profile,
          demographics, and financial situation to match you with scholarships you actually qualify for.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="bg-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Get Started Free
          </Link>
          <Link
            href="#how-it-works"
            className="text-slate-700 text-lg font-medium px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-300 transition"
          >
            See How It Works
          </Link>
        </div>
        <p className="text-sm text-slate-500 mt-6">No credit card required · Free plan available</p>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Find your scholarships in 3 steps
            </h2>
            <p className="text-lg text-slate-600">
              From profile to application — we handle the matching.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Build your profile",
                desc: "Tell us about your grades, background, finances, and goals. Our AI enrichment adds context you might not have considered.",
                icon: "📋",
              },
              {
                step: "2",
                title: "Get matched instantly",
                desc: "Our engine scans thousands of scholarships and returns only those you're highly eligible for — ranked by award amount and deadline.",
                icon: "🎯",
              },
              {
                step: "3",
                title: "Apply with confidence",
                desc: "We guide you through each application's essays and requirements. Track every deadline in one dashboard.",
                icon: "🚀",
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 font-bold text-sm rounded-full mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">
              Start free. Upgrade when you're ready to apply to more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="border border-slate-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-slate-900 mb-1">$0</div>
              <p className="text-slate-500 mb-6">forever</p>
              <ul className="space-y-3 mb-8">
                {["5 scholarship matches/mo", "Basic profile", "Standard search", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="block text-center w-full py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition">
                Get Started
              </Link>
            </div>

            {/* Individual */}
            <div className="border-2 border-indigo-600 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Individual</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">$9.99</span>
                <span className="text-slate-500 mb-1.5">/mo</span>
              </div>
              <p className="text-slate-500 mb-6">or $99/year</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited scholarship matches", "AI-powered profile enrichment", "Essay coaching & review", "Deadline reminders", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up?plan=individual" className="block text-center w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                Start Free Trial
              </Link>
            </div>

            {/* Family */}
            <div className="border border-slate-200 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Family</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">$29.99</span>
                <span className="text-slate-500 mb-1.5">/mo</span>
              </div>
              <p className="text-slate-500 mb-6">or $299/year</p>
              <ul className="space-y-3 mb-8">
                {["Up to 5 student profiles", "Everything in Individual", "Parent dashboard", "Application status tracking", "Dedicated success manager"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up?plan=family" className="block text-center w-full py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Institutions: license ScholarBeacon for your students
              </h2>
              <p className="text-slate-300 text-lg mb-8">
                Give your students an unfair advantage. Our institutional tier includes branded portals,
                bulk student onboarding, analytics dashboards, and custom scholarship feeds.
              </p>
              <ul className="space-y-3 mb-8">
                {["Unlimited student seats", "Custom branding & domain", "Admin analytics dashboard", "Bulk CSV import", "API access for scholarship feeds", "Dedicated account manager"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="mailto:institutions@scholarbeacon.com" className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition">
                Contact Us for Pricing
              </Link>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8">
              <div className="text-sm text-slate-400 mb-4">Trusted by institutions</div>
              <div className="space-y-4">
                {["Atlanta Public Schools", "University of Texas System", "Chicago Public Schools", "California Community Colleges"].map((s) => (
                  <div key={s} className="flex items-center gap-3 py-3 border-b border-slate-700 last:border-0">
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-300">
                      {s.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-200">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">SB</span>
              </div>
              <span className="font-semibold text-slate-900">ScholarBeacon</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-slate-700">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-700">Terms of Service</Link>
              <Link href="mailto:hello@scholarbeacon.com" className="hover:text-slate-700">Contact</Link>
            </div>
            <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} ScholarBeacon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
