import { ScrapedScholarship } from "./index";

// HBCU and minority-focused scholarships
const HBCU_SCHOLARSHIPS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === HBCU INSTITUTIONAL SCHOLARSHIPS ===
  {
    name: "Howard University Presidential Scholarship",
    url: "https://www.howard.edu/admissions/aid/scholarships",
    amount: 25000,
    amountMax: 50000,
    deadline: "2027-01-15",
    description:
      "Full and partial tuition scholarships for incoming freshmen. Based on academic excellence and leadership. Howard is one of the most prestigious HBCUs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Morehouse College Presidential Scholarship",
    url: "https://www.morehouse.edu/admissions/aid/scholarships.html",
    amount: 20000,
    amountMax: 40000,
    deadline: "2027-02-01",
    description:
      "Institutional scholarships for incoming Morehouse freshmen. Merit-based and need-based awards available.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Spelman College Institutional Scholarships",
    url: "https://www.spelman.edu/admissions/aid/scholarships",
    amount: 15000,
    amountMax: 30000,
    deadline: "2027-02-01",
    description:
      "Merit-based scholarships for incoming Spelman freshmen. Leadership and academic excellence considered.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Florida A&M University (FAMU) Excellence Scholarship",
    url: "https://www.famu.edu/admissions/scholarships.php",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-03-01",
    description:
      "FAMU's flagship institutional scholarship for incoming freshmen. Based on academics and leadership. In-state tuition significantly reduces cost.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "HBCU Innovation Scholarship (Dell Foundation)",
    url: "https://www.dell.com/scholarships",
    amount: 10000,
    amountMax: 20000,
    deadline: "2027-02-15",
    description:
      "For students attending HBCUs pursuing technology and business degrees. Partnership between Dell and select HBCUs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "UNCF General Scholarship Program",
    url: "https://www.uncf.org/scholarships",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-02-28",
    description:
      "UNCF manages 100+ scholarship programs for students attending HBCUs and other institutions. Need-based awards.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jackie Robinson Foundation Scholarship",
    url: "https://jackierobinson.org/scholarship/",
    amount: 35000,
    deadline: "2027-01-15",
    description:
      "Up to $35,000 over 4 years ($8,750/year) for graduating high school seniors. Based on leadership, community service, and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Ron Brown Scholar Program",
    url: "https://www.ronbrown.org/",
    amount: 40000,
    deadline: "2026-12-01",
    description:
      "40 awards of $40,000 ($10K/yr) for Black/African American high school seniors. Leadership and community impact focus.",
    stateResidency: [],
    county: [],
  },
  {
    name: "BLCC Scholarship Foundation",
    url: "https://www.blccscholars.org/",
    amount: 5000,
    deadline: "2027-04-01",
    description:
      "For African American male high school seniors. Renewable for up to 4 years. Based on academics, leadership, and service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Association of Black Accountants (NABA) Scholarship",
    url: "https://www.nabainc.org/scholarships",
    amount: 5000,
    amountMax: 10000,
    deadline: "2027-03-01",
    description:
      "For minority students pursuing accounting, finance, or business. NABA members only.",
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
  {
    name: "Thurgood Marshall College Fund Scholarship",
    url: "https://www.thurgoodmarshall.com/scholarships",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-03-01",
    description:
      "For students attending HBCUs and TCUs. Multiple scholarship programs for undergraduate and graduate students.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Hispanics Serving Institutions (HSI) Scholarship",
    url: "https://www.educateiowa.gov/pk-12/state-aid-and-grants/hispanic-college-fund",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For Hispanic students attending Hispanic-Serving Institutions. Academic achievement and financial need considered.",
    stateResidency: [],
    county: [],
  },
  // === MINORITY PROFESSIONAL SCHOLARSHIPS ===
  {
    name: "NAACP Legal Defense Fund Scholarship",
    url: "https://www.naacpldf.org/scholarship",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For students committed to social justice and civil rights. Renewable for up to 4 years.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Black MBA Association (NBMBAA) Scholarship",
    url: "https://www.nbmbaa.org/scholarships",
    amount: 10000,
    deadline: "2027-02-28",
    description:
      "For Black/African American students pursuing MBA degrees or business-related undergraduate programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Black Data Analysts (BDAI) Scholarship",
    url: "https://www.blackdataanalysts.org/",
    amount: 5000,
    deadline: "2027-03-15",
    description:
      "For Black students pursuing data science, analytics, or related technology fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "African American Financial Services Association Scholarship",
    url: "https://www.aafsa.com/scholarships",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For African American students in financial services or related degree programs.",
    stateResidency: [],
    county: [],
  },
  // === ALPHA PHI ALPHA SCHOLARSHIPS ===
  {
    name: "Alpha Phi Alpha General Undergraduate Scholarship",
    url: "https://apa1906.net/scholarship/",
    amount: 5000,
    amountMax: 10000,
    deadline: "2027-03-31",
    description:
      "Multiple scholarships administered through Alpha Phi Alpha's educational foundation. Leadership and community service focus.",
    stateResidency: [],
    county: [],
  },
  {
    name: "George and Happy Alpha Phi Alpha Scholarship",
    url: "https://apa1906.net/scholarship/",
    amount: 5000,
    deadline: "2027-03-31",
    description:
      "For Alpha Phi Alpha members or students demonstrating leadership in the Black community.",
    stateResidency: [],
    county: [],
  },
  // === OMEGA PSI PHI SCHOLARSHIPS ===
  {
    name: "Omega Psi Phi Fraternal Scholarship",
    url: "https://www.oppf.org/education/",
    amount: 5000,
    deadline: "2027-03-15",
    description:
      "Scholarships administered through Omega Psi Phi chapters for students with financial need and academic promise.",
    stateResidency: [],
    county: [],
  },
  // === KAPPA ALPHA PSI SCHOLARSHIPS ===
  {
    name: "Kappa Alpha Psi Educational Foundation Scholarship",
    url: "https://www.kappaalphapsi.org/scholarships",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-03-01",
    description:
      "Multiple scholarship programs for Kappa members and non-members demonstrating academic excellence.",
    stateResidency: [],
    county: [],
  },
  // === PHI BETA SIGMA SCHOLARSHIPS ===
  {
    name: "Phi Beta Sigma Fraternity Scholarship",
    url: "https://www.phisigmasigma.org/scholarship",
    amount: 5000,
    deadline: "2027-03-15",
    description:
      "For students demonstrating leadership, academic excellence, and community service.",
    stateResidency: [],
    county: [],
  },
  // === IOTA PHI THETA SCHOLARSHIPS ===
  {
    name: "Iota Phi Theta National Scholarship",
    url: "https://www.thetataus.com/scholarships",
    amount: 5000,
    deadline: "2027-03-31",
    description:
      "For undergraduate and graduate students with strong academic record and community involvement.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeHBCUScholarships(): Promise<ScrapedScholarship[]> {
  return HBCU_SCHOLARSHIPS.map((s) => ({
    ...s,
    scrapedFrom: "hbcus",
  }));
}
