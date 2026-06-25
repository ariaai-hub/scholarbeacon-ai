"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 10;

interface WizardState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  currentStep: number;
  saving: boolean;
  error: string | null;
}

interface ProfileWizardProps {
  initialData?: Record<string, unknown>;
}

export function ProfileWizard({ initialData = {} }: ProfileWizardProps) {
  const router = useRouter();
  const [state, setState] = useState<WizardState>({
    data: initialData,
    currentStep: 1,
    saving: false,
    error: null,
  });

  const { data, currentStep, saving, error } = state;

  const updateData = useCallback((fields: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...fields },
      error: null,
    }));
  }, []);

  const saveToServer = useCallback(async (finalSubmit = false) => {
    setState((prev) => ({ ...prev, saving: true, error: null }));
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save profile");
      }
      if (finalSubmit) {
        // Trigger matchmaking
        const matchRes = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!matchRes.ok) {
          console.error("Matchmaking failed:", await matchRes.text());
        }
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        saving: false,
        error: err instanceof Error ? err.message : "Save failed",
      }));
      return;
    }
    setState((prev) => ({ ...prev, saving: false }));
  }, [data, router]);

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1),
      error: null,
    }));
  };

  const handleContinue = () => {
    if (currentStep < TOTAL_STEPS) {
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        error: null,
      }));
    } else {
      saveToServer(true);
    }
  };

  const handleSaveExit = () => {
    saveToServer(false);
  };

  const isGrad = Boolean(data.educationLevel?.startsWith("GRAD_") || data.educationLevel === "NON_DEGREE");
  const isInternational = Boolean(data.citizenshipStatus && !["US_CITIZEN", "PERMANENT_RESIDENT"].includes(data.citizenshipStatus as string));
  const totalSteps = TOTAL_STEPS;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {currentStep === 1 && <StepCoreIdentity data={data} update={updateData} />}
        {currentStep === 2 && <StepAcademicStanding data={data} update={updateData} />}
        {currentStep === 3 && <StepDemographics data={data} update={updateData} />}
        {currentStep === 4 && <StepFinancialProfile data={data} update={updateData} />}
        {currentStep === 5 && <StepBackground data={data} update={updateData} />}
        {currentStep === 6 && <StepExtracurriculars data={data} update={updateData} />}
        {currentStep === 7 && <StepPersonalStory data={data} update={updateData} />}
        {currentStep === 8 && isGrad && <StepGradProfessional data={data} update={updateData} />}
        {currentStep === 9 && isInternational && <StepInternational data={data} update={updateData} />}
        {currentStep === 10 && <StepDocuments data={data} update={updateData} />}
        {/* Fallback steps if grad/international hidden */}
        {(currentStep === 8 && !isGrad) && (
          <>
            {isInternational ? <StepInternational data={data} update={updateData} /> : <StepDocuments data={data} update={updateData} />}
          </>
        )}
        {(currentStep === 9 && !isInternational) && (
          <StepDocuments data={data} update={updateData} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleSaveExit}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:border-slate-400 transition disabled:opacity-50"
          >
            Save &amp; Exit
          </button>
          <button
            onClick={handleContinue}
            disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="animate-spin">⟳</span>
                Saving...
              </>
            ) : currentStep === TOTAL_STEPS ? (
              "Submit Profile"
            ) : (
              "Continue →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Step Components ---

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const EDUCATION_LEVELS = [
  { value: "HS_JUNIOR", label: "High School Junior" },
  { value: "HS_SENIOR", label: "High School Senior" },
  { value: "COMMUNITY_COLLEGE", label: "Community College" },
  { value: "UNDERGRAD_YEAR_1", label: "Undergraduate Year 1" },
  { value: "UNDERGRAD_YEAR_2", label: "Undergraduate Year 2" },
  { value: "UNDERGRAD_YEAR_3", label: "Undergraduate Year 3" },
  { value: "UNDERGRAD_YEAR_4", label: "Undergraduate Year 4" },
  { value: "GRAD_MASTERS", label: "Graduate — Master's" },
  { value: "GRAD_PHD", label: "Graduate — PhD" },
  { value: "GRAD_PROFESSIONAL", label: "Graduate — Professional (JD/MD/MBA)" },
  { value: "NON_DEGREE", label: "Non-Degree" },
  { value: "CERTIFICATE", label: "Certificate Program" },
];

const TARGET_DEGREES = [
  { value: "BA", label: "Bachelor of Arts (BA)" },
  { value: "BS", label: "Bachelor of Science (BS)" },
  { value: "MA", label: "Master of Arts (MA)" },
  { value: "MS", label: "Master of Science (MS)" },
  { value: "PhD", label: "Doctor of Philosophy (PhD)" },
  { value: "JD", label: "Juris Doctor (JD)" },
  { value: "MD", label: "Doctor of Medicine (MD)" },
  { value: "MBA", label: "Master of Business Administration (MBA)" },
  { value: "DDS", label: "Doctor of Dental Surgery (DDS)" },
  { value: "PharmD", label: "PharmD" },
  { value: "MFA", label: "Master of Fine Arts (MFA)" },
  { value: "CERTIFICATE", label: "Certificate" },
];

const GPA_SCALES = [
  { value: 4, label: "4.0" },
  { value: 4.3, label: "4.3" },
  { value: 5, label: "5.0" },
  { value: 100, label: "100 (percentage)" },
];

const CITIZENSHIP_TYPES = [
  { value: "US_CITIZEN", label: "U.S. Citizen" },
  { value: "PERMANENT_RESIDENT", label: "Permanent Resident" },
  { value: "F1_STUDENT", label: "F-1 Student" },
  { value: "J1_EXCHANGE", label: "J-1 Exchange Visitor" },
  { value: "H1B_WORKER", label: "H-1B Worker" },
  { value: "OPT", label: "OPT (Optional Practical Training)" },
  { value: "CPT", label: "CPT (Curricular Practical Training)" },
  { value: "DACA", label: "DACA" },
  { value: "TPS", label: "TPS (Temporary Protected Status)" },
  { value: "ASYLUM", label: "Asylum Seeker" },
  { value: "REFUGEE", label: "Refugee" },
  { value: "OTHER", label: "Other" },
];

const INCOME_BRACKETS = [
  { value: "UNDER_15000", label: "Under $15,000" },
  { value: "BRACKET_15000_30000", label: "$15,000 – $30,000" },
  { value: "BRACKET_30000_50000", label: "$30,000 – $50,000" },
  { value: "BRACKET_50000_75000", label: "$50,000 – $75,000" },
  { value: "BRACKET_75000_100000", label: "$75,000 – $100,000" },
  { value: "OVER_100000", label: "Over $100,000" },
  { value: "DECLINE_TO_STATE", label: "Decline to State" },
];

const PARENT_EDUCATION = [
  { value: "some_high_school", label: "Some High School" },
  { value: "high_school_diploma", label: "High School Diploma/GED" },
  { value: "some_college", label: "Some College" },
  { value: "associates", label: "Associate's Degree" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (PhD, JD, MD)" },
  { value: "professional", label: "Professional Degree" },
  { value: "unknown", label: "Unknown / Not Applicable" },
];

const GEO_BACKGROUNDS = [
  { value: "RURAL", label: "Rural" },
  { value: "SUBURBAN", label: "Suburban" },
  { value: "URBAN", label: "Urban" },
];

const ATHLETE_STATUSES = [
  { value: "NONE", label: "None" },
  { value: "VARSITY", label: "Varsity Athlete" },
  { value: "DIVISION_1", label: "Division I Athlete" },
  { value: "PROFESSIONAL", label: "Professional Athlete" },
];

const RACE_ETHNICITY_OPTIONS = [
  "African American",
  "Hispanic/Latino",
  "Asian/Pacific Islander",
  "Native American/Alaska Native",
  "White/Caucasian",
  "Middle Eastern/North African",
  "Other",
];

const HERITAGE_TAGS_OPTIONS = [
  "African American",
  "Hispanic/Latino",
  "Asian/Pacific Islander",
  "Native American",
  "Middle Eastern",
  "Jewish",
  "LGBTQ+",
  "First-generation college student",
  "Veteran",
  "Disability",
  "Low-income background",
  "First-generation immigrant",
];

// Generic field components
function FormField({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", required, className = "", step }: {
  value?: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean; className?: string; step?: string;
}) {
  return (
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      step={step}
      className={`w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
    />
  );
}

function SelectInput({ value, onChange, options, required, placeholder }: {
  value?: string | number; onChange: (v: string) => void; options: { value: string | number; label: string }[]; required?: boolean; placeholder?: string;
}) {
  return (
    <select
      value={value != null ? String(value) : ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
      ))}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }: {
  value?: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
    />
  );
}

function Toggle({ value, onChange, label }: { value?: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-slate-700">{label}</span>
    </div>
  );
}

function DynamicList({ value = [], onChange, renderItem, addLabel = "Add item" }: {
  value?: unknown[]; onChange: (v: unknown[]) => void; renderItem: (item: unknown, index: number, onRemove: () => void) => React.ReactNode; addLabel?: string;
}) {
  const items = value as unknown[];
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">{renderItem(item, i, () => {
            const next = items.filter((_, idx) => idx !== i);
            onChange(next);
          })}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, {}])}
        className="text-sm text-indigo-600 font-medium hover:text-indigo-700 mt-1"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function CheckboxGroup({ options, value = [], onChange }: {
  options: string[]; value?: string[]; onChange: (v: string[]) => void;
}) {
  const selected = value || [];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => {
            if (selected.includes(opt)) {
              onChange(selected.filter((v) => v !== opt));
            } else {
              onChange([...selected, opt]);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
            selected.includes(opt)
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// --- Step 1: Core Identity ---
function StepCoreIdentity({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Core Identity</h2>
      <p className="text-sm text-slate-500 mb-6">Let's start with the basics.</p>

      <FormField label="Full Name" required>
        <TextInput value={data.fullName as string} onChange={(v) => update({ fullName: v })} placeholder="Your full legal name" required />
      </FormField>

      <FormField label="Date of Birth" required>
        <input
          type="date"
          value={data.dateOfBirth as string}
          onChange={(e) => update({ dateOfBirth: e.target.value })}
          required
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Current City" required>
          <TextInput value={data.currentCity as string} onChange={(v) => update({ currentCity: v })} placeholder="City" required />
        </FormField>
        <FormField label="State" required>
          <SelectInput value={data.currentState as string} onChange={(v) => update({ currentState: v })} options={US_STATES.map((s) => ({ value: s, label: s }))} required placeholder="Select" />
        </FormField>
      </div>

      <FormField label="Phone Number">
        <TextInput type="tel" value={data.phone as string} onChange={(v) => update({ phone: v })} placeholder="(555) 123-4567" />
      </FormField>
    </div>
  );
}

// --- Step 2: Academic Standing ---
function StepAcademicStanding({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  const isHS = data.educationLevel === "HS_JUNIOR" || data.educationLevel === "HS_SENIOR";
  const isCollege = Boolean(!isHS && data.educationLevel);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Academic Standing</h2>
      <p className="text-sm text-slate-500 mb-6">Tell us about your education.</p>

      <FormField label="Current Education Level" required>
        <SelectInput value={data.educationLevel as string} onChange={(v) => update({ educationLevel: v })} options={EDUCATION_LEVELS} required placeholder="Select your level" />
      </FormField>

      <FormField label={isHS ? "High School Name" : "Institution Name"}>
        <TextInput value={data.institutionName as string} onChange={(v) => update({ institutionName: v })} placeholder={isHS ? "e.g. Jefferson High School" : "e.g. University of Michigan"} />
      </FormField>

      {isCollege && (
        <div className="grid grid-cols-2 gap-4">
          <FormField label="GPA">
            <TextInput type="number" value={data.gpa as string} onChange={(v) => update({ gpa: parseFloat(v) })} placeholder="3.75" />
          </FormField>
          <FormField label="GPA Scale">
            <SelectInput value={String(data.gpaScale || 4)} onChange={(v) => update({ gpaScale: parseFloat(v) })} options={GPA_SCALES} />
          </FormField>
        </div>
      )}

      <FormField label="Intended Major">
        <TextInput value={data.intendedMajor as string} onChange={(v) => update({ intendedMajor: v })} placeholder="e.g. Computer Science, Biology" />
      </FormField>

      <FormField label="Target Degree">
        <SelectInput value={data.targetDegree as string} onChange={(v) => update({ targetDegree: v })} options={TARGET_DEGREES} placeholder="Select degree" />
      </FormField>

      {!isHS && (
        <FormField label="College Credits Earned (for transfer students)">
          <TextInput type="number" value={data.collegeCreditsEarned as string} onChange={(v) => update({ collegeCreditsEarned: parseInt(v) })} placeholder="0" />
        </FormField>
      )}
    </div>
  );
}

// --- Step 3: Demographics ---
function StepDemographics({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  const isNonUS = Boolean(data.citizenshipStatus && !["US_CITIZEN", "PERMANENT_RESIDENT"].includes(data.citizenshipStatus as string));

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Demographics</h2>
      <p className="text-sm text-slate-500 mb-6">This helps match you with eligibility-specific scholarships.</p>

      <FormField label="Race/Ethnicity">
        <CheckboxGroup
          options={RACE_ETHNICITY_OPTIONS}
          value={data.raceEthnicity as string[]}
          onChange={(v) => update({ raceEthnicity: v })}
        />
      </FormField>

      <FormField label="Gender">
        <SelectInput value={data.gender as string} onChange={(v) => update({ gender: v })} options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "non-binary", label: "Non-binary" },
          { value: "prefer-not-to-say", label: "Prefer not to say" },
          { value: "other", label: "Other" },
        ]} placeholder="Select" />
      </FormField>

      <FormField label="Citizenship Status" required>
        <SelectInput value={data.citizenshipStatus as string} onChange={(v) => update({ citizenshipStatus: v })} options={CITIZENSHIP_TYPES} required placeholder="Select" />
      </FormField>

      {isNonUS && (
        <>
          <FormField label="Country of Citizenship">
            <TextInput value={data.countryOfCitizenship as string} onChange={(v) => update({ countryOfCitizenship: v })} placeholder="e.g. Mexico, India" />
          </FormField>
          <FormField label="Visa Type">
            <SelectInput value={data.visaType as string} onChange={(v) => update({ visaType: v })} options={CITIZENSHIP_TYPES.filter((c) => c.value !== "US_CITIZEN" && c.value !== "PERMANENT_RESIDENT")} placeholder="Select visa type" />
          </FormField>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="State of Residence" required>
          <SelectInput value={data.stateOfResidence as string} onChange={(v) => update({ stateOfResidence: v })} options={US_STATES.map((s) => ({ value: s, label: s }))} required placeholder="Select" />
        </FormField>
        <FormField label="ZIP Code">
          <TextInput value={data.zipCode as string} onChange={(v) => update({ zipCode: v })} placeholder="12345" />
        </FormField>
      </div>
    </div>
  );
}

// --- Step 4: Financial Profile ---
function StepFinancialProfile({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Financial Profile</h2>
      <p className="text-sm text-slate-500 mb-6">Financial info helps match you with need-based awards.</p>

      <FormField label="Household Income Bracket" required>
        <SelectInput value={data.householdIncomeBracket as string} onChange={(v) => update({ householdIncomeBracket: v })} options={INCOME_BRACKETS} required placeholder="Select range" />
      </FormField>

      <FormField label="Financial Need Level" required>
        <SelectInput value={data.financialNeedLevel as string} onChange={(v) => update({ financialNeedLevel: v })} options={[
          { value: "LOW", label: "Low — I can fund most of my education" },
          { value: "MODERATE", label: "Moderate — Some financial assistance needed" },
          { value: "SIGNIFICANT", label: "Significant — Financial aid is very important" },
          { value: "SEVERE", label: "Severe — I cannot attend without substantial aid" },
        ]} required placeholder="Select" />
      </FormField>

      <div className="space-y-5 mt-4">
        <Toggle
          label="First-generation college student"
          value={data.firstGenerationCollegeStudent as boolean}
          onChange={(v) => update({ firstGenerationCollegeStudent: v })}
        />
        <Toggle
          label="Responsible for contributing to family income"
          value={data.responsibleForContributingToFamilyIncome as boolean}
          onChange={(v) => update({ responsibleForContributingToFamilyIncome: v })}
        />
      </div>
    </div>
  );
}

// --- Step 5: Background ---
function StepBackground({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Background</h2>
      <p className="text-sm text-slate-500 mb-6">Additional background helps us find the right matches.</p>

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Toggle label="Single-parent household" value={data.singleParentHousehold as boolean} onChange={(v) => update({ singleParentHousehold: v })} />
        </div>
        <div className="flex items-center gap-3">
          <Toggle label="Sibling(s) currently in college" value={data.siblingInCollege as boolean} onChange={(v) => update({ siblingInCollege: v })} />
        </div>
        <div className="flex items-center gap-3">
          <Toggle label="Veteran or veteran-dependent" value={data.veteranStatus as boolean} onChange={(v) => update({ veteranStatus: v })} />
        </div>
        <div className="flex items-center gap-3">
          <Toggle label="Student with a disability" value={data.disabilityStatus as boolean} onChange={(v) => update({ disabilityStatus: v })} />
        </div>
      </div>

      <FormField label="Parent's Highest Education Level" className="mt-4">
        <SelectInput value={data.parentHighestEducation as string} onChange={(v) => update({ parentHighestEducation: v })} options={PARENT_EDUCATION} placeholder="Select" />
      </FormField>

      <FormField label="Heritage / Background Tags">
        <CheckboxGroup
          options={HERITAGE_TAGS_OPTIONS}
          value={data.heritageTags as string[]}
          onChange={(v) => update({ heritageTags: v })}
        />
      </FormField>

      <FormField label="Religious Affiliation (optional)">
        <TextInput value={data.religiousAffiliation as string} onChange={(v) => update({ religiousAffiliation: v })} placeholder="e.g. Catholic, Muslim, None" />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Geographic Background">
          <SelectInput value={data.geographicBackground as string} onChange={(v) => update({ geographicBackground: v })} options={GEO_BACKGROUNDS} placeholder="Select" />
        </FormField>
        <FormField label="Athletic Status">
          <SelectInput value={data.athleteStatus as string} onChange={(v) => update({ athleteStatus: v })} options={ATHLETE_STATUSES} />
        </FormField>
      </div>
    </div>
  );
}

// --- Step 6: Extracurriculars ---
function StepExtracurriculars({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  const activities = (data.activities as { name: string; role: string }[]) || [];
  const leadership = (data.leadershipPositions as string[]) || [];
  const work = (data.workExperience as { title: string; employer: string; years: string }[]) || [];
  const awards = (data.awardsAndHonors as string[]) || [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Extracurriculars</h2>
      <p className="text-sm text-slate-500 mb-6">Show us what you're involved in beyond the classroom.</p>

      <FormField label="Activities">
        <DynamicList
          value={activities}
          onChange={(v) => update({ activities: v })}
          addLabel="Add activity"
          renderItem={(item, i, onRemove) => {
            const act = item as { name: string; role: string };
            return (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={act.name}
                  onChange={(e) => {
                    const next = [...activities];
                    next[i] = { ...next[i], name: e.target.value };
                    update({ activities: next });
                  }}
                  placeholder="Activity name (e.g. Debate Club)"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={act.role}
                  onChange={(e) => {
                    const next = [...activities];
                    next[i] = { ...next[i], role: e.target.value };
                    update({ activities: next });
                  }}
                  placeholder="Role (e.g. Member, President)"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
              </div>
            );
          }}
        />
      </FormField>

      <FormField label="Leadership Positions">
        <DynamicList
          value={leadership}
          onChange={(v) => update({ leadershipPositions: v })}
          addLabel="Add position"
          renderItem={(item, i, onRemove) => {
            return (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item as string}
                  onChange={(e) => {
                    const next = [...leadership];
                    next[i] = e.target.value;
                    update({ leadershipPositions: next });
                  }}
                  placeholder="e.g. Student Body President"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
              </div>
            );
          }}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Community Service Hours">
          <TextInput type="number" value={data.communityServiceHours as string} onChange={(v) => update({ communityServiceHours: parseInt(v) })} placeholder="0" />
        </FormField>
      </div>
      <FormField label="Community Service Focus (optional)">
        <TextInput value={data.communityServiceFocus as string} onChange={(v) => update({ communityServiceFocus: v })} placeholder="What did you do? (e.g. Tutoring, Food bank)" />
      </FormField>

      <FormField label="Work Experience">
        <DynamicList
          value={work}
          onChange={(v) => update({ workExperience: v })}
          addLabel="Add job"
          renderItem={(item, i, onRemove) => {
            const job = item as { title: string; employer: string; years: string };
            return (
              <div className="flex gap-2">
                <input type="text" value={job.title} onChange={(e) => { const next = [...work]; next[i] = { ...next[i], title: e.target.value }; update({ workExperience: next }); }} placeholder="Job title" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="text" value={job.employer} onChange={(e) => { const next = [...work]; next[i] = { ...next[i], employer: e.target.value }; update({ workExperience: next }); }} placeholder="Employer" className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="text" value={job.years} onChange={(e) => { const next = [...work]; next[i] = { ...next[i], years: e.target.value }; update({ workExperience: next }); }} placeholder="Years" className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
              </div>
            );
          }}
        />
      </FormField>

      <FormField label="Awards & Honors">
        <DynamicList
          value={awards}
          onChange={(v) => update({ awardsAndHonors: v })}
          addLabel="Add award"
          renderItem={(item, i, onRemove) => {
            return (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item as string}
                  onChange={(e) => {
                    const next = [...awards];
                    next[i] = e.target.value;
                    update({ awardsAndHonors: next });
                  }}
                  placeholder="e.g. National Merit Semifinalist"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
              </div>
            );
          }}
        />
      </FormField>

      <FormField label="Special Skills (optional)">
        <TextArea value={data.specialSkills as string} onChange={(v) => update({ specialSkills: v })} placeholder="Languages, certifications, technical skills..." rows={3} />
      </FormField>
    </div>
  );
}

// --- Step 7: Personal Story ---
function StepPersonalStory({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Personal Story</h2>
      <p className="text-sm text-slate-500 mb-6">These essays help scholarships understand who you are beyond your grades.</p>

      <FormField label="Describe a significant challenge you've overcome">
        <TextArea
          value={data.mostSignificantChallenge as string}
          onChange={(v) => update({ mostSignificantChallenge: v })}
          placeholder="Walk us through a difficult moment and how you handled it..."
          rows={4}
        />
      </FormField>

      <FormField label="What do you want admissions committees to know about you?">
        <TextArea
          value={data.whatToKnowAboutYou as string}
          onChange={(v) => update({ whatToKnowAboutYou: v })}
          placeholder="Share something about yourself that's not in the rest of your application..."
          rows={4}
        />
      </FormField>

      <FormField label="What is your academic and career goal?">
        <TextArea
          value={data.futureGoal as string}
          onChange={(v) => update({ futureGoal: v })}
          placeholder="Where do you see yourself in 5–10 years?"
          rows={3}
        />
      </FormField>

      <FormField label="Why do you need this scholarship?">
        <TextArea
          value={data.whyNeedScholarship as string}
          onChange={(v) => update({ whyNeedScholarship: v })}
          placeholder="Help us understand your financial need and how this would help..."
          rows={3}
        />
      </FormField>

      <FormField label="Any circumstances you'd like to explain? (optional)">
        <TextArea
          value={data.circstancesToExplain as string}
          onChange={(v) => update({ circumstancesToExplain: v })}
          placeholder="e.g. GPA dip due to family illness, gap year, etc."
          rows={3}
        />
      </FormField>
    </div>
  );
}

// --- Step 8: Grad/Professional ---
function StepGradProfessional({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  const publications = (data.publications as string[]) || [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Graduate / Professional</h2>
      <p className="text-sm text-slate-500 mb-6">Tell us about your graduate-level academic background.</p>

      <FormField label="Undergraduate Institution">
        <TextInput value={data.undergraduateInstitution as string} onChange={(v) => update({ undergraduateInstitution: v })} placeholder="e.g. UC Berkeley" />
      </FormField>

      <FormField label="Undergraduate GPA">
        <TextInput type="number" value={data.undergraduateGpa as string} onChange={(v) => update({ undergraduateGpa: parseFloat(v) })} placeholder="3.5" />
      </FormField>

      <div className="space-y-5">
        <Toggle label="Thesis track" value={data.thesisTrack as boolean} onChange={(v) => update({ thesisTrack: v })} />
        <Toggle label="Research assistant" value={data.researchAssistant as boolean} onChange={(v) => update({ researchAssistant: v })} />
        <Toggle label="Teaching assistant" value={data.teachingAssistant as boolean} onChange={(v) => update({ teachingAssistant: v })} />
        <Toggle label="Seeking full funding" value={data.seekingFullFunding as boolean} onChange={(v) => update({ seekingFullFunding: v })} />
        <Toggle label="Letters of recommendation ready" value={data.lettersOfRecommendationReady as boolean} onChange={(v) => update({ lettersOfRecommendationReady: v })} />
      </div>

      <FormField label="Publications">
        <DynamicList
          value={publications}
          onChange={(v) => update({ publications: v })}
          addLabel="Add publication"
          renderItem={(item, i, onRemove) => (
            <div className="flex gap-2">
              <input
                type="text"
                value={item as string}
                onChange={(e) => {
                  const next = [...publications];
                  next[i] = e.target.value;
                  update({ publications: next });
                }}
                placeholder="e.g. 'The Impact of AI on Education', Journal of EdTech"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
            </div>
          )}
        />
      </FormField>

      <FormField label="Years of Professional Experience">
        <TextInput type="number" value={data.yearsProfessionalExperience as string} onChange={(v) => update({ yearsProfessionalExperience: parseInt(v) })} placeholder="0" />
      </FormField>
    </div>
  );
}

// --- Step 9: International ---
function StepInternational({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">International Students</h2>
      <p className="text-sm text-slate-500 mb-6">Additional information for international applicants.</p>

      <FormField label="Country of Origin">
        <TextInput value={data.countryOfOrigin as string} onChange={(v) => update({ countryOfOrigin: v })} placeholder="e.g. Nigeria, Vietnam" />
      </FormField>

      <div className="space-y-5 mt-4">
        <Toggle
          label="Has a U.S. citizen sponsor"
          value={data.hasUSCitizenSponsor as boolean}
          onChange={(v) => update({ hasUSCitizenSponsor: v })}
        />
        <Toggle
          label="Currently employed in the U.S."
          value={data.currentlyEmployedUS as boolean}
          onChange={(v) => update({ currentlyEmployedUS: v })}
        />
        <Toggle
          label="Eligible for home-country scholarships"
          value={data.homeCountryScholarshipEligibility as boolean}
          onChange={(v) => update({ homeCountryScholarshipEligibility: v })}
        />
      </div>

      {Boolean(data.hasUSCitizenSponsor) && (
        <FormField label="Sponsor Type" className="mt-4">
          <SelectInput value={data.sponsorType as string} onChange={(v) => update({ sponsorType: v })} options={[
            { value: "individual", label: "Individual (family friend, relative)" },
            { value: "government", label: "Government" },
            { value: "employer", label: "Employer" },
            { value: "institution", label: "Institution" },
          ]} placeholder="Select sponsor type" />
        </FormField>
      )}

      {Boolean(data.currentlyEmployedUS) && (
        <FormField label="Employment Type" className="mt-4">
          <TextInput value={data.employmentType as string} onChange={(v) => update({ employmentType: v })} placeholder="e.g. Part-time, CPT, OPT" />
        </FormField>
      )}

      <FormField label="English Proficiency Score (optional)">
        <div className="flex gap-3">
          <select
            value={(data.englishProficiencyScore as { test?: string })?.test || ""}
            onChange={(e) => {
              const current = (data.englishProficiencyScore as { test?: string; score?: number }) || {};
              update({ englishProficiencyScore: { ...current, test: e.target.value } });
            }}
            className="px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Test</option>
            <option value="TOEFL">TOEFL</option>
            <option value="IELTS">IELTS</option>
          </select>
          <input
            type="number"
            value={(data.englishProficiencyScore as { score?: number })?.score || ""}
            onChange={(e) => {
              const current = (data.englishProficiencyScore as { test?: string; score?: number }) || {};
              update({ englishProficiencyScore: { ...current, score: parseInt(e.target.value) } });
            }}
            placeholder="Score"
            className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </FormField>

      <FormField label="Do you plan to return to your home country after studies?" className="mt-4">
        <SelectInput value={data.planToReturnToHomeCountry as string} onChange={(v) => update({ planToReturnToHomeCountry: v === "true" })} options={[
          { value: "true", label: "Yes, I plan to return" },
          { value: "false", label: "No, I plan to stay in the U.S." },
        ]} placeholder="Select" />
      </FormField>
    </div>
  );
}

// --- Step 10: Documents ---
function StepDocuments({ data, update }: { data: Record<string, unknown>; update: (d: Record<string, unknown>) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Documents & Assets</h2>
      <p className="text-sm text-slate-500 mb-6">Let us know what documents you have ready.</p>

      <div className="space-y-5">
        <Toggle
          label="I have a resume"
          value={data.hasResume as boolean}
          onChange={(v) => update({ hasResume: v })}
        />
        <Toggle
          label="I have my unofficial transcript"
          value={data.hasUnofficialTranscript as boolean}
          onChange={(v) => update({ hasUnofficialTranscript: v })}
        />
        <Toggle
          label="I can get letters of recommendation"
          value={data.canGetRecommendationLetters as boolean}
          onChange={(v) => update({ canGetRecommendationLetters: v })}
        />
        <Toggle
          label="I can certify my documents"
          value={data.canCertifyDocuments as boolean}
          onChange={(v) => update({ canCertifyDocuments: v })}
        />
        <Toggle
          label="I have reliable computer and internet access"
          value={data.hasReliableComputerAndInternet !== false}
          onChange={(v) => update({ hasReliableComputerAndInternet: v })}
        />
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-700">
          💡 Once you submit your profile, we'll run our matching engine and show you scholarships you're highly eligible for — ranked by award amount and deadline.
        </p>
      </div>
    </div>
  );
}
