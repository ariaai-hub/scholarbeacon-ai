import { ScrapedScholarship } from "./index";

// Corporate-sponsored and employer-based scholarships
const CORPORATE_SCHOLARSHIPS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === TECHNOLOGY COMPANIES ===
  {
    name: "Google PhD Fellowship",
    url: "https://research.google/blog/google-phd-fellowship-program/",
    amount: 10000,
    amountMax: 40000,
    deadline: "2027-01-31",
    description:
      "For PhD students in computer science and related fields. Fellowship includes funding and mentorship.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Google Women Techmakers Scholarship",
    url: "https://build.google.com/careers/scholarships",
    amount: 10000,
    deadline: "2027-03-01",
    description:
      "For women studying computer science, engineering, or related fields. Based on leadership and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Microsoft College Scholar Scholarship",
    url: "https://careers.microsoft.com/students/scholarships",
    amount: 5000,
    deadline: "2027-02-28",
    description:
      "For students pursuing degrees in computer science, engineering, or related technology fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Microsoft Disability Scholarship",
    url: "https://careers.microsoft.com/students/scholarships",
    amount: 5000,
    deadline: "2027-02-28",
    description:
      "For students with disabilities pursuing technology degrees. Based on financial need and academic performance.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Apple college Scholar Program",
    url: "https://www.apple.com/education/",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For students attending partner HBCUs and HSIs. Technology and business focus.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Amazon Future Engineer Scholarship",
    url: "https://www.amazon.jobs/en/landing_pages/future-engineer",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For high school seniors planning to study computer science or engineering. Renewable for up to 4 years.",
    stateResidency: [],
    county: [],
  },
  {
    name: "IBM Academic Initiative Scholarship",
    url: "https://www.ibm.com/company/corporate-responsibility/academic-initiative",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For students in technology fields. IBM partners with universities to support diverse students in tech.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Intel Diversity Scholarship",
    url: "https://www.intel.com/content/www/us/en/diversity/diversity-in-tech.html",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For underrepresented minority and women students in STEM fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Salesforce Foundation Scholarship",
    url: "https://www.salesforce.org/scholarships/",
    amount: 10000,
    deadline: "2027-02-15",
    description:
      "For students attending HBCUs and HSIs pursuing technology and business degrees.",
    stateResidency: [],
    county: [],
  },
  // === FINANCIAL SERVICES ===
  {
    name: "Goldman Sachs 10,000 Small Businesses Scholarship",
    url: "https://www.goldmansachs.com/citizenship/10ksb/scholarship.html",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "For small business owners and entrepreneurs. Associated with the 10,000 Small Businesses program.",
    stateResidency: [],
    county: [],
  },
  {
    name: "JP Morgan Chase Scholars Program",
    url: "https://www.jpmorganchase.com/company/corporate-responsibility/chase-scholars",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For minority students in business, finance, or technology. Renewable for up to 4 years.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Wells Fargo College Steps Scholarship",
    url: "https://www.wellsfargo.com/about/corporate/citizenship/scholarship",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For students with a Wells Fargo account or family member who works at Wells Fargo.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Bank of America Student Leaders Scholarship",
    url: "https://about.bankofamerica.com/en/our-commitment/student-leaders",
    amount: 5000,
    deadline: "2027-02-28",
    description:
      "For high school juniors and seniors. Includes paid internship and scholarship. Leadership focus.",
    stateResidency: [],
    county: [],
  },
  {
    name: "PNC Financial Services Scholarship",
    url: "https://www.pnc.com/content/pnc-com/en/about-pnc/corporate-responsibility/education.html",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "For students in PNC service areas pursuing business, finance, or technology degrees.",
    stateResidency: [],
    county: [],
  },
  // === RETAIL / CONSUMER COMPANIES ===
  {
    name: "Walmart HBCU Scholarship Program",
    url: "https://corporate.walmart.com/newsroom/news-and-insights",
    amount: 10000,
    deadline: "2027-02-15",
    description:
      "For students attending HBCUs pursuing degrees relevant to retail and supply chain management.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Target Scholars Program",
    url: "https://corporate.target.com/corporate-responsibility/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in Target communities. Focus on diverse students in retail and business programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Kroger College Scholarship",
    url: "https://www.kroger.com/corporate-responsibility/scholarships",
    amount: 2500,
    deadline: "2027-01-31",
    description:
      "For Kroger employees and their dependents. Also for students in Kroger communities.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Home Depot Scholarship",
    url: "https://www.homedepot.com/corporate-responsibility/scholarship",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For students pursuing careers in construction, engineering, supply chain, or business.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Lowes Scholarship Program",
    url: "https://www.lowes.com/about/corporate-responsibility",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For students in Lowes store communities. Trade skills, engineering, and business focus.",
    stateResidency: [],
    county: [],
  },
  // === ENERGY / UTILITIES ===
  {
    name: "NextEra Energy (FPL) Scholarship",
    url: "https://www.nexteraenergy.com/scholarships",
    amount: 20000,
    deadline: "2027-02-01",
    description:
      "For Florida students pursuing energy, engineering, or technology fields. $20,000 max award. SECME participants preferred.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Duke Energy Scholarship Program",
    url: "https://www.duke-energy.com/community/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in Duke Energy service areas. Engineering, energy, and environmental fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Southern Company HBCU Scholarship",
    url: "https://www.southerncompany.com/careers/scholarships",
    amount: 10000,
    deadline: "2027-02-15",
    description:
      "For students at HBCUs pursuing energy, engineering, and business degrees.",
    stateResidency: [],
    county: [],
  },
  {
    name: "ExxonMobil Scholarship Program",
    url: "https://corporate.exxonmobil.com/careers/scholarships",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For students in STEM fields, particularly engineering and geosciences.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Shell Oil Company Scholarship",
    url: "https://www.shell.us/careers/scholarships.html",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students pursuing energy, engineering, and environmental science degrees.",
    stateResidency: [],
    county: [],
  },
  // === HEALTHCARE / PHARMA ===
  {
    name: "Johnson & Johnson Scholars Program",
    url: "https://www.jnj.com/careers/johnson-johnson-scholars-program",
    amount: 10000,
    deadline: "2027-02-15",
    description:
      "For students in healthcare, life sciences, and business. Leadership and innovation focus.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Pfizer Scholar Grant",
    url: "https://www.pfizer.com/careers/scholars",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "For students in science, technology, and healthcare fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "CVS Health Scholarship",
    url: "https://www.cvshealth.com/social-responsibility/healthcare-education/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students pursuing healthcare careers. Based on financial need and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "UnitedHealth Group Diversity Scholarship",
    url: "https://www.unitedhealthgroup.com/careers/scholarships.html",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For underrepresented minority students in healthcare, technology, and business.",
    stateResidency: [],
    county: [],
  },
  // === AEROSPACE / DEFENSE ===
  {
    name: "Lockheed Martin Scholarship",
    url: "https://www.lockheedmartin.com/en-us/who-weare/community/scholarships.html",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "For students in STEM fields, particularly aerospace, engineering, and computer science.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Boeing Scholarship Program",
    url: "https://www.boeing.com/company/total-societal-engagement/scholarships.page",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For students in aerospace, engineering, and advanced manufacturing programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Raytheon Technologies Scholarship",
    url: "https://www.rtx.com/careers/scholarships",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "For STEM students, particularly in aerospace and defense technology fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Northrop Grumman Scholarship Program",
    url: "https://www.northropgrumman.com/community/education/Pages/scholarships.aspx",
    amount: 10000,
    deadline: "2027-02-15",
    description:
      "For STEM students with focus on aerospace, engineering, and cybersecurity.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeCorporateScholarships(): Promise<ScrapedScholarship[]> {
  return CORPORATE_SCHOLARSHIPS.map((s) => ({
    ...s,
    scrapedFrom: "corporate",
  }));
}
