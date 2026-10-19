"use client";

import { useState } from "react";

const EDUCATION_LEVELS = [
  { value: "HS_SENIOR", label: "High School Senior" },
  { value: "HS_JUNIOR", label: "High School Junior" },
  { value: "UNDERGRAD_YEAR_1", label: "College Freshman" },
  { value: "UNDERGRAD_YEAR_2", label: "College Sophomore" },
  { value: "UNDERGRAD_YEAR_3", label: "College Junior" },
  { value: "UNDERGRAD_YEAR_4", label: "College Senior" },
  { value: "GRADUATE", label: "Graduate Student" },
];

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const GPA_OPTIONS = [
  { value: "4.0", label: "4.0 (Straight A's)" },
  { value: "3.5-3.9", label: "3.5 – 3.9" },
  { value: "3.0-3.4", label: "3.0 – 3.4" },
  { value: "2.5-2.9", label: "2.5 – 2.9" },
  { value: "2.0-2.4", label: "2.0 – 2.4" },
  { value: "Below 2.0", label: "Below 2.0" },
];

const MAJORS = [
  "Undecided","Business","Computer Science","Engineering","Health Sciences",
  "Social Sciences","Liberal Arts","Education","Biology","Mathematics",
  "Arts & Humanities","Communications","Criminal Justice","Nursing","Psychology",
];

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

const STORAGE_KEY = "scholarship_profile";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<Profile>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    }
    return {
      firstName: "", lastName: "", email: "", phone: "", state: "",
      educationLevel: "", gpa: "", major: "",
      incomeBrackets: [], demographics: [],
      ethnicity: "", gender: "",
      hasLeadership: false, hasCommunityService: false,
      hasAthleticInvolvement: false, hasWorkExperience: false,
      isFirstGeneration: false,
    };
  });

  const update = (field: keyof Profile, value: unknown) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const toggleArr = (field: keyof Profile, val: string) => {
    const arr = profile[field] as string[];
    update(field, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const completeness = [
    profile.firstName, profile.lastName, profile.email, profile.state,
    profile.educationLevel, profile.gpa, profile.major,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Your Profile</h1>
            <p className="text-sm text-slate-500">Tell us about yourself so we can find the right scholarships</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{Math.round((completeness / 7) * 100)}%</p>
            <p className="text-xs text-slate-500">profile complete</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Identity */}
        <Section title="Basic Info">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={profile.firstName} onChange={(v) => update("firstName", v)} placeholder="James" />
            <Input label="Last Name" value={profile.lastName} onChange={(v) => update("lastName", v)} placeholder="Smith" />
          </div>
          <Input label="Email" type="email" value={profile.email} onChange={(v) => update("email", v)} placeholder="james@email.com" />
          <Input label="Phone" type="tel" value={profile.phone} onChange={(v) => update("phone", v)} placeholder="(555) 867-5309" />
          <Select label="State of Residence" value={profile.state} onChange={(v) => update("state", v)} options={STATES.map((s) => ({ value: s, label: s }))} />
        </Section>

        {/* Academic */}
        <Section title="Academic Background">
          <Select label="Current Education Level" value={profile.educationLevel} onChange={(v) => update("educationLevel", v)} options={EDUCATION_LEVELS.map((l) => ({ value: l.value, label: l.label }))} />
          <Select label="GPA" value={profile.gpa} onChange={(v) => update("gpa", v)} options={GPA_OPTIONS.map((g) => ({ value: g.value, label: g.label }))} />
          <Select label="Intended Major" value={profile.major} onChange={(v) => update("major", v)} options={MAJORS.map((m) => ({ value: m, label: m }))} />
        </Section>

        {/* Demographics */}
        <Section title="Demographics">
          <Select
            label="Race/Ethnicity"
            value={profile.ethnicity}
            onChange={(v) => update("ethnicity", v)}
            options={[
              { value: "African American", label: "African American / Black" },
              { value: "Hispanic / Latino", label: "Hispanic / Latino" },
              { value: "Asian American", label: "Asian American" },
              { value: "Caucasian / White", label: "Caucasian / White" },
              { value: "American Indian / Alaska Native", label: "American Indian / Alaska Native" },
              { value: "Native Hawaiian / Pacific Islander", label: "Native Hawaiian / Pacific Islander" },
              { value: "Two or More Races", label: "Two or More Races" },
              { value: "Prefer not to say", label: "Prefer not to say" },
            ]}
          />
          <Select
            label="Gender"
            value={profile.gender}
            onChange={(v) => update("gender", v)}
            options={[
              { value: "Female", label: "Female" },
              { value: "Male", label: "Male" },
              { value: "Non-binary", label: "Non-binary" },
              { value: "Prefer not to say", label: "Prefer not to say" },
            ]}
          />
        </Section>

        {/* Financial */}
        <Section title="Financial Background">
          <p className="text-sm text-slate-600 mb-3">Annual Household Income (select all that apply)</p>
          <div className="grid grid-cols-2 gap-2">
            {["Under $15,000", "$15,000 – $30,000", "$30,000 – $50,000", "$50,000 – $75,000", "$75,000 – $100,000", "Over $100,000"].map((inc) => (
              <Checkbox
                key={inc}
                label={inc}
                checked={profile.incomeBrackets.includes(inc)}
                onChange={() => toggleArr("incomeBrackets", inc)}
              />
            ))}
          </div>
        </Section>

        {/* Activities */}
        <Section title="Activities & Background">
          <div className="grid grid-cols-2 gap-3">
            <Checkbox label="Leadership experience (club, sports, work)" checked={profile.hasLeadership} onChange={(v) => update("hasLeadership", v)} />
            <Checkbox label="Community service / volunteering" checked={profile.hasCommunityService} onChange={(v) => update("hasCommunityService", v)} />
            <Checkbox label="Athletic involvement" checked={profile.hasAthleticInvolvement} onChange={(v) => update("hasAthleticInvolvement", v)} />
            <Checkbox label="Work experience (part-time or full-time)" checked={profile.hasWorkExperience} onChange={(v) => update("hasWorkExperience", v)} />
            <Checkbox label="First-generation college student" checked={profile.isFirstGeneration} onChange={(v) => update("isFirstGeneration", v)} />
          </div>
        </Section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            {saved ? "✓ Saved!" : "Save Profile"}
          </button>
          {saved && (
            <p className="text-green-600 text-sm">Profile saved to your browser.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
