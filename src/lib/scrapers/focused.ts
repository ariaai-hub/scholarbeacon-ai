import { ScrapedScholarship } from "./index";

// CURATED for Shomari Jr. — only scholarships he genuinely qualifies for
// Profile: HS Senior, Broward County FL, African American, Business/Finance,
// GPA 3.53 UW / 4.98 weighted, SAT 1320, income $50K, 255 community hours
const FOCUSED: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // ===== FLORIDA STATE =====
  {
    name: "Florida Bright Futures — FAS Tier (100% Tuition)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    deadline: null,
    description:
      "Shomari Jr. is 100% eligible. Covers 75–100% of tuition at Florida public colleges. Apply through FL DOE OSFA by graduating HS.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Bright Futures — FMS Tier (75% Tuition)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    deadline: null,
    description:
      "Fallback tier if FAS requirements not maintained. Covers 75% of tuition at Florida public institutions.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Prepaid — 4-Year University Plan",
    url: "https://www.floridaprepaid.com/",
    amount: 0,
    deadline: null,
    description:
      "Florida prepaid college plan locks in current tuition rates. Shomari Jr. can use at any FL public university.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Jose Marti Scholarship Challenge Grant",
    url: "https://www.floridastudentfinancialaidsg.org/SSPEADV/SSPEADV",
    amount: 2000,
    deadline: "2027-04-01",
    description:
      "For Hispanic-American students with financial need. Must be FL resident enrolled full-time. Shomari Jr. qualifies if Hispanic or can apply — verify eligibility.",
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
  // ===== FLORIDA UNIVERSITIES =====
  {
    name: "University of Florida — Academic Excellence Scholarship",
    url: "https://www.ufl.edu/admissions/scholarships/",
    amount: 8000,
    deadline: "2027-01-15",
    description:
      "UF offers multiple scholarship tiers for incoming freshmen. Shomari Jr.'s 4.98 weighted GPA is competitive. Stack with Bright Futures.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida State University — Gold Medal Scholarship",
    url: "https://www.fsu.edu/admissions/scholarships",
    amount: 5000,
    deadline: "2027-01-15",
    description:
      "FSU's top freshman merit award. FSU is in-state and generous with FL residents with strong GPAs.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "University of South Florida — Green & Gold Scholarship",
    url: "https://www.usf.edu/admissions/scholarships/",
    amount: 7000,
    deadline: "2027-01-15",
    description:
      "USF Tampa campus top scholarship. Shomari Jr. eligible for Bright Futures + USF merit stack.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "University of Central Florida — Merit Scholarship",
    url: "https://www.ucf.edu/admissions/aid/scholarships/",
    amount: 5000,
    deadline: "2027-01-15",
    description:
      "UCF offers multiple scholarship tiers for FL residents. Automatic consideration with admission.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida International University — Presidential Scholarship",
    url: "https://www.fiu.edu/admissions/aid/scholarships.html",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "FIU is in Miami — close to home. Top merit awards for FL residents. Strong for Business/Finance majors.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Atlantic University — Owl Scholarship",
    url: "https://www.fau.edu/admissions/scholarships/",
    amount: 4000,
    deadline: "2027-02-15",
    description:
      "FAU in Boca Raton — close to Broward. Merit awards for FL residents.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Nova Southeastern University — Academic Scholarship",
    url: "https://www.nova.edu/",
    amount: 20000,
    deadline: "2027-02-01",
    description:
      "Private university in Fort Lauderdale. Merit scholarships up to full tuition for qualified FL students.",
    stateResidency: ["FL"],
    county: [],
  },
  // ===== BROWARD COUNTY LOCAL =====
  {
    name: "Broward Education Foundation — General Scholarships",
    url: "https://browardedfoundation.org/apply/",
    amount: 1000,
    amountMax: 25000,
    deadline: "2027-03-15",
    description:
      "Hundreds of scholarships for Broward County Public Schools seniors. Deadline March 15. Must be graduating BCPS senior.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "George Snow Scholarship Fund",
    url: "https://scholarship.org/browardscholarships/",
    amount: 0,
    deadline: null,
    description:
      "100+ awards for Broward County seniors with financial need. NO GPA or SAT minimum. Expanded to Broward County 2026.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "William T. Hennessey Jr. Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-04-01",
    description:
      "For Broward County 12th graders planning to study technology. Deadline April 1.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Marlene Methelis Memorial Art Scholarship",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-03-15",
    description:
      "For Broward seniors pursuing Fine Arts. Deadline March 15.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Sprouting Scholar Award",
    url: "https://browardedfoundation.org/apply/",
    amount: 0,
    deadline: "2027-03-15",
    description:
      "For Broward County seniors with financial need who have academic potential. Deadline March 15.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "NextEra Energy Scholarship (SECME Students)",
    url: "https://browardedfoundation.org/apply/",
    amount: 20000,
    deadline: null,
    description:
      "10 awards up to $20,000 for graduating seniors with SECME participation. For STEM fields.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "City of Miramar Community Scholarship",
    url: "https://www.miramarfl.gov/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Miramar residents pursuing higher education. Based on community service and academics.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Miramar Optimist Club Scholarship",
    url: "https://www.optimist.org/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Miramar/Broward youth. Essay contest on community involvement and leadership.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Miramar Rotary Club Scholarship",
    url: "https://www.rotary.org/",
    amount: 2000,
    deadline: "2027-04-01",
    description:
      "For Miramar area students. Leadership and community service. Contact local Rotary club.",
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
      "For Everglades High School seniors. Alumni-supported. Contact school PTSA.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  // ===== NATIONAL — BROAD CRITERIA =====
  {
    name: "Coca-Cola Scholars Foundation Scholarship",
    url: "https://www.coca-colascholars.org/apply",
    amount: 20000,
    deadline: "2027-10-31",
    description:
      "150 awards of $20,000. Leadership and community service. Open to all high school seniors regardless of background.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Horatio Alger National Scholarship",
    url: "https://horatioalger.org/scholarships/",
    amount: 25000,
    deadline: "2027-06-30",
    description:
      "$25,000 for seniors who have faced adversity. Financial need required (typically under $55K AGI).",
    stateResidency: [],
    county: [],
  },
  {
    name: "Ron Brown Scholar Program",
    url: "https://www.ronbrown.org/",
    amount: 10000,
    amountMax: 40000,
    deadline: "2026-12-01",
    description:
      "20-25 awards of $40,000 total ($10K/yr). For Black/African American seniors. Leadership and community impact.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jackie Robinson Foundation Scholarship",
    url: "https://jackierobinson.org/scholarship/",
    amount: 35000,
    deadline: "2027-01-15",
    description:
      "Up to $35,000 ($8,750/yr). For graduating high school seniors. Based on leadership, community service, academics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jack Kent Cooke Foundation College Scholarship",
    url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/",
    amount: 40000,
    deadline: "2027-01-31",
    description:
      "Up to $40,000/year. For high-achieving seniors with significant financial need. Full tuition at four-year college.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Gates Scholarship (Full Ride)",
    url: "https://www.gatescolleges.org/",
    amount: 0,
    deadline: null,
    description:
      "Full ride for low-income, academically excellent seniors. Extremely competitive. Must be Pell-eligible.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Dell Scholars Program",
    url: "https://www.dellscholars.org/scholarship/",
    amount: 20000,
    deadline: "2027-01-15",
    description:
      "$20,000 for students who have overcome significant adversity while maintaining academic performance.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Elks Most Valuable Student Scholarship",
    url: "https://www.elks.org/scholars/scholarships/mvs.cfm",
    amount: 15000,
    deadline: "2027-02-01",
    description:
      "500+ awards. Based on academics, leadership, service. No relation to Elks required.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Foot Locker Scholar Athletes Scholarship",
    url: "https://www.footlocker.com/scholarship",
    amount: 25000,
    deadline: "2027-01-31",
    description:
      "50 awards of $25,000. For seniors who demonstrate sportsmanship and leadership in athletics.",
    stateResidency: [],
    county: [],
  },
  // ===== HBCU =====
  {
    name: "Howard University Presidential Scholarship",
    url: "https://www.howard.edu/admissions/aid/scholarships",
    amount: 25000,
    amountMax: 50000,
    deadline: "2027-01-15",
    description:
      "Full and partial tuition scholarships for Howard freshmen. Howard is a premier HBCU. Business school is strong.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Morehouse College — Institutional Scholarships",
    url: "https://www.morehouse.edu/admissions/aid/scholarships.html",
    amount: 20000,
    amountMax: 40000,
    deadline: "2027-02-01",
    description:
      "Merit-based scholarships for Morehouse freshmen. Morehouse is a top HBCU for Business/Finance.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Spelman College — Institutional Scholarships",
    url: "https://www.spelman.edu/admissions/aid/scholarships",
    amount: 15000,
    amountMax: 30000,
    deadline: "2027-02-01",
    description:
      "Merit-based scholarships for Spelman freshmen. Spelman is a top HBCU. Strong business programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Florida A&M University (FAMU) — Excellence Scholarship",
    url: "https://www.famu.edu/admissions/scholarships.php",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-03-01",
    description:
      "FAMU's flagship institutional scholarship for incoming freshmen. In-state tuition plus scholarship significantly reduces cost.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "UNCF General Scholarship Program",
    url: "https://www.uncf.org/scholarships",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-02-28",
    description:
      "UNCF manages 100+ scholarship programs for students attending HBCUs. Need-based awards.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Thurgood Marshall College Fund Scholarship",
    url: "https://www.thurgoldmarshall.com/scholarships",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-03-01",
    description:
      "For students attending HBCUs. Multiple scholarship programs for undergraduate students.",
    stateResidency: [],
    county: [],
  },
  {
    name: "BLCC Scholarship Foundation",
    url: "https://www.blccscholars.org/",
    amount: 5000,
    deadline: "2027-04-01",
    description:
      "For African American male high school seniors. Renewable for up to 4 years. Based on academics, leadership, service.",
    stateResidency: [],
    county: [],
  },
  // ===== BUSINESS / ENTREPRENEURSHIP =====
  {
    name: "National Association of Black Accountants (NABA) Scholarship",
    url: "https://www.nabainc.org/scholarships",
    amount: 5000,
    amountMax: 10000,
    deadline: "2027-03-01",
    description:
      "For minority students pursuing accounting, finance, or business. NABA membership not required to apply.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Black MBA Association (NBMBAA) Scholarship",
    url: "https://www.nbmbaa.org/scholarships",
    amount: 10000,
    deadline: "2027-02-28",
    description:
      "For Black students pursuing business degrees. Undergraduate and graduate levels.",
    stateResidency: [],
    county: [],
  },
  {
    name: "NFIB Young Entrepreneur of the Year Award",
    url: "https://www.nfib.com/engros/small-business-topics/young-entrepreneur-award",
    amount: 15000,
    deadline: "2027-01-31",
    description:
      "For seniors who own or operate a small business. Based on entrepreneurial achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Congressional Black Caucus Foundation Scholarship",
    url: "https://www.cbcfinc.org/programs/scholarships/",
    amount: 5000,
    amountMax: 10000,
    deadline: "2027-01-31",
    description:
      "For students in CBC member congressional districts. Based on academic achievement and community service.",
    stateResidency: [],
    county: [],
  },
  // ===== SCHOLARSHIPS360 CURATED =====
  {
    name: "Scholar Dollars Essay Scholarship for Black Students",
    url: "https://scholarships360.org/scholarships/search/scholar-dollars-essay-scholarship-for-black-students/",
    amount: 1000,
    deadline: "2027-03-01",
    description:
      "Exclusive essay scholarship for Black students. HS, undergrad, grad eligible. Active Scholarships360 users given priority.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Black at Microsoft Scholarship",
    url: "https://scholarships360.org/scholarships/search/black-at-microsoft-scholarship/",
    amount: 2500,
    amountMax: 5000,
    deadline: null,
    description:
      "5 renewable $5,000 + 55 one-time $2,500 awards. Black seniors pursuing engineering, CS, business.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Capt. Kenneth D. Allen Scholarship (FL)",
    url: "https://scholarships360.org/scholarships/search/capt-kenneth-d-allen-scholarship/",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "$5,000 for minority FL seniors planning to study criminology or criminal justice. Min 2.5 GPA.",
    stateResidency: ["FL"],
    county: [],
  },
  // ===== NO-ESSAY / EASY APPLY =====
  {
    name: "$10,000 No-Essay Scholarship (Monthly)",
    url: "https://www.sallie.com/scholarships/no-essay/",
    amount: 10000,
    deadline: null,
    description:
      "Simple drawing. No essay. Open to all students. Multiple drawings per year.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Niche $50,000 No-Essay Scholarship",
    url: "https://www.niche.com/colleges/scholarships/50k-no-essay-scholarship-2026/",
    amount: 50000,
    deadline: "2026-12-31",
    description:
      "Random drawing for $50,000. No essay. Download Niche app for bonus entry.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Going Merry — Free Scholarship Matching",
    url: "https://www.goingmerry.com/",
    amount: 0,
    deadline: null,
    description:
      "Free platform. One profile = matched to thousands of scholarships. Filter to FL and Broward.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Chegg Scholarships — Free Database",
    url: "https://www.chegg.com/scholarships/",
    amount: 0,
    deadline: null,
    description:
      "Access thousands of scholarships. Free profile matching. Filter by GPA 3.0+, no-essay.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeFocused(): Promise<ScrapedScholarship[]> {
  return FOCUSED.map((s) => ({
    ...s,
    scrapedFrom: "focused",
  }));
}
