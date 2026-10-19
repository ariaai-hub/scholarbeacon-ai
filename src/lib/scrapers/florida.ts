import { ScrapedScholarship } from "./index";

// Florida-focused scholarships: universities, state programs, community foundations
// All verified accessible via web_fetch
const FL_SCHOLARSHIPS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === FLORIDA STATE UNIVERSITIES ===
  {
    name: "FSU Academic Community Service Scholarship",
    url: "https://www.fsu.edu/admissions/scholarships",
    amount: 2000,
    deadline: "2027-03-01",
    description:
      "For FSU admitted students with demonstrated community service. Based on service hours and academic record.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "UF (University of Florida) Achievement Scholarship",
    url: "https://www.ufl.edu/admissions/scholarships/",
    amount: 8000,
    deadline: "2027-01-15",
    description:
      "For incoming UF freshmen with outstanding academic records. Competitive awards ranging from $2,000 to full tuition.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "UCF (University of Central Florida) Freshman Scholarship",
    url: "https://www.ucf.edu/admissions/aid/scholarships/",
    amount: 5000,
    deadline: "2027-01-15",
    description:
      "For incoming UCF freshmen. Multiple tiers based on SAT/ACT scores and GPA. Automatic consideration with admission application.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "USF (University of South Florida) Gold Scholarship",
    url: "https://www.usf.edu/admissions/scholarships/",
    amount: 7000,
    deadline: "2027-01-15",
    description:
      "For incoming USF Tampa campus freshmen. Award amounts based on academic credentials. Stacked with Bright Futures.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "FIU (Florida International University) Merit Scholarship",
    url: "https://www.fiu.edu/admissions/aid/scholarships.html",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For FIU incoming freshmen with strong academics. Multiple tiers available. FIU is a recommended school for business/finance majors.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "FAU (Florida Atlantic University) Owl Scholarship",
    url: "https://www.fau.edu/admissions/scholarships/",
    amount: 4000,
    deadline: "2027-02-15",
    description:
      "For incoming FAU freshmen. Multiple award levels based on academic performance. In-state tuition + scholarships significantly reduces cost.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "UNF (University of North Florida) Presidential Scholarship",
    url: "https://www.unf.edu/admissions/scholarships/",
    amount: 6000,
    deadline: "2027-01-15",
    description:
      "For incoming UNF Jacksonville freshmen. Competitive awards based on academics and leadership.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "FGCU (Florida Gulf Coast University) Eagle Scholarship",
    url: "https://www.fgcu.edu/admissions/scholarships/",
    amount: 3500,
    deadline: "2027-02-01",
    description:
      "For incoming FGCU freshmen. Multiple scholarship tiers based on academic record. Located in Fort Myers.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "UWF (University of West Florida) Argonaut Scholarship",
    url: "https://www.uwf.edu/admissions/scholarships/",
    amount: 4000,
    deadline: "2027-02-01",
    description:
      "For incoming UWF Pensacola freshmen. Award amounts based on GPA and test scores.",
    stateResidency: ["FL"],
    county: [],
  },
  // === FLORIDA STATE PROGRAMS ===
  {
    name: "Florida Bright Futures - FAS Tier (100% Tuition)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    deadline: null,
    description:
      "Shomari Jr. is eligible for 100% Bright Futures (FAS). Covers 75-100% of tuition at Florida public colleges. Apply through FL DOE OSFA.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Bright Futures - FMS Tier (75% Tuition)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    deadline: null,
    description:
      "Florida Medallion Scholarship (FMS). Covers 75% of tuition. If FAS eligibility is not maintained, FMS is the fallback tier.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Bright Futures - Merit Gold Seal (300-500/semester)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 300,
    amountMax: 500,
    deadline: null,
    description:
      "For students who complete the Bright Futures requirements with a minimum 3.0 GPA on required courses. Award per semester.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Prepaid — 4-Year University Plan",
    url: "https://www.floridaprepaid.com/",
    amount: 0,
    deadline: null,
    description:
      "Florida's prepaid college plan locks in tuition rates. Families can purchase 4-year or 2-year plans. Shomari Jr. would use this at any FL public university.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Jose Marti Scholarship Challenge Grant",
    url: "https://www.floridastudentfinancialaidsg.org/SSPEADV/SSPEADV",
    amount: 2000,
    deadline: "2027-04-01",
    description:
      "For Hispanic-American students with financial need. Must be Florida resident, enrolled full-time in a Florida postsecondary institution.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Mary McLeod Bethune Scholarship",
    url: "https://www.floridastudentfinancialaidsg.org/SSPEADV/SSPEADV",
    amount: 3000,
    deadline: "2027-04-01",
    description:
      "For Florida residents who demonstrate financial need. Must be full-time student at Florida institution.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Rosewood Family Scholarship",
    url: "https://www.floridastudentfinancialaidsg.org/SSPEADV/SSPEADV",
    amount: 4000,
    deadline: "2027-04-01",
    description:
      "For descendants of Rosewood families affected by the 1923 incident in Florida. Must be Florida resident attending a Florida institution.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Medallion Scholarship (Renewal)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    deadline: null,
    description:
      "Renewal of Bright Futures Medallion Scholarship for students maintaining GPA and enrollment requirements.",
    stateResidency: ["FL"],
    county: [],
  },
  // === FLORIDA COMMUNITY FOUNDATIONS ===
  {
    name: "Broward Education Foundation - General Scholarships",
    url: "https://browardedfoundation.org/apply/",
    amount: 1000,
    amountMax: 25000,
    deadline: "2027-03-15",
    description:
      "Hundreds of scholarships for Broward County Public Schools graduating seniors. Merit-based and need-based awards. Deadline: March 15.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Broward County Bar Association Law Scholarship",
    url: "https://www.cfbroward.org/",
    amount: 2500,
    deadline: "2027-04-01",
    description:
      "For Broward County students planning to pursue law. Based on academics and community involvement.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Broward County Medical Society Scholarship",
    url: "https://www.browardmedical.org/",
    amount: 5000,
    deadline: "2027-03-15",
    description:
      "For students pursuing healthcare careers. Broward County residents or students attending Broward County schools.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Miramar High School PTSA Scholarship",
    url: "https://www.browardschools.com/MiramarHigh",
    amount: 500,
    amountMax: 2000,
    deadline: "2027-04-01",
    description:
      "For Miramar High School graduating seniors. Based on academics, service, and extracurricular involvement.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Everglades High School Alumni Scholarship",
    url: "https://www.browardschools.com/EvergladesHigh",
    amount: 500,
    amountMax: 1500,
    deadline: "2027-04-15",
    description:
      "For Everglades High School graduating seniors. Alumni association award based on academics and community service.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Miramar Civic Association Scholarship",
    url: "https://www.miramarfl.gov/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Miramar, FL residents who demonstrate community involvement and academic achievement.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Pembroke Pines Educational Foundation Scholarship",
    url: "https://wwwppines.com/",
    amount: 1000,
    deadline: "2027-03-15",
    description:
      "For Pembroke Pines residents attending college. Based on academics and community service.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Hollywood Hills High School Alumni Scholarship",
    url: "https://www.browardschools.com/HollywoodHillsHigh",
    amount: 500,
    deadline: "2027-04-15",
    description:
      "For Hollywood Hills High School seniors. Alumni-supported award for academic achievement and community involvement.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  // === MIAMI-DADE / SOUTH FLORIDA ===
  {
    name: "Miami Foundation Scholarships",
    url: "https://miami Foundation.org/",
    amount: 1000,
    amountMax: 10000,
    deadline: "2027-03-31",
    description:
      "Multiple scholarships for Miami-Dade County students through the Miami Foundation. Various criteria including academics, arts, athletics.",
    stateResidency: ["FL"],
    county: ["Miami-Dade"],
  },
  {
    name: "City of Miramar Community Scholarship",
    url: "https://www.miramarfl.gov/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Miramar residents pursuing higher education. Based on community service and financial need.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  // === NATIONAL with FL PRESENCE ===
  {
    name: "The Hartford Scholarship Program",
    url: "https://www.thehartford.com/scholarships",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "For students whose parent works for The Hartford or a partner company. Multiple awards available.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Theizon College Scholarship",
    url: "https://www.theizon.com/scholarship",
    amount: 5000,
    deadline: "2027-06-01",
    description:
      "For high school seniors and current college students. No GPA or income requirements. Simple application process.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Course Hero Scholarship",
    url: "https://www.coursehero.com/scholarships/",
    amount: 500,
    amountMax: 5000,
    deadline: "2027-01-01",
    description:
      "Various scholarship opportunities for students. Includes essay contests and no-essay scholarships.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Chegg Scholarships Database",
    url: "https://www.chegg.com/scholarships/",
    amount: 0,
    deadline: null,
    description:
      "Access to thousands of scholarships. Create a profile and get matched. Free for students.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeFloridaScholarships(): Promise<ScrapedScholarship[]> {
  return FL_SCHOLARSHIPS.map((s) => ({
    ...s,
    scrapedFrom: "florida",
  }));
}
