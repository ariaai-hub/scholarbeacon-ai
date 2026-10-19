import { ScrapedScholarship } from "./index";

// STEM, trade, vocational, and international scholarships
const STEM_TRADE_INTL: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === STEM SCHOLARSHIPS ===
  {
    name: "Science and Engineering Hallmarks Scholarship",
    url: "https://www.registrar.ucla.edu/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in STEM majors. Based on academic achievement and research potential.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Science Foundation (NSF) Graduate Research Fellowship",
    url: "https://www.nsfgrfp.org/",
    amount: 16000,
    amountMax: 69000,
    deadline: "2027-01-15",
    description:
      "For graduate students in STEM. $16,000/year for 3 years + tuition. Extremely prestigious.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Barry M. Goldwater Scholarship",
    url: "https://goldwaterscholarship.edu/",
    amount: 7500,
    deadline: "2027-01-31",
    description:
      "Up to $7,500 for STEM students transferring to 4-year institutions. Based on research potential in STEM.",
    stateResidency: [],
    county: [],
  },
  {
    name: "NIST Research Fellowship",
    url: "https://www.nist.gov/hr/employment/gpis",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For students in STEM fields interested in government research careers.",
    stateResidency: [],
    county: [],
  },
  {
    name: "NASA Space Grant Scholarship",
    url: "https://www.nasa.gov/gateways/stem-education/home-grant-programs/",
    amount: 5000,
    deadline: null,
    description:
      "NASA Space Grant programs in each state. For students in STEM fields, particularly aerospace.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Society of Women Engineers (SWE) Scholarship",
    url: "https://swe.org/scholarships/",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-02-15",
    description:
      "Multiple scholarships for women in engineering, computer science, and related STEM fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "NSPE (National Society of Professional Engineers) Scholarship",
    url: "https://www.nspe.org/resources/students/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For engineering students. Based on academic achievement and engineering potential.",
    stateResidency: [],
    county: [],
  },
  {
    name: "IEEE Life Members Graduate Scholarship",
    url: "https://www.ieee.org/education/scholarships.html",
    amount: 4000,
    deadline: "2027-01-31",
    description:
      "For graduate students in electrical engineering, electronics, or related fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "ACM (Association for Computing Machinery) Scholarship",
    url: "https://www.acm.org/scholarships",
    amount: 5000,
    deadline: "2027-01-15",
    description:
      "For computer science students. Based on academic achievement and technology innovation.",
    stateResidency: [],
    county: [],
  },
  {
    name: "CyberCorps Scholarship for Service (SFS)",
    url: "https://www.scholarships.gov/Programs.cfm?search=SFS",
    amount: 25000,
    deadline: null,
    description:
      "Federal scholarship for cybersecurity students. Full tuition + stipend in exchange for government service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Security Agency (NSA) Stokes Scholarship",
    url: "https://www.nsa.gov/careers/student-opportunities/scholarships/",
    amount: 30000,
    deadline: "2027-01-15",
    description:
      "For STEM students in mathematics, engineering, computer science. Full tuition + stipend in exchange for NSA service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "DOE Computational Science Graduate Fellowship",
    url: "https://www.krellinst.org/csgf/",
    amount: 36000,
    deadline: "2027-01-15",
    description:
      "For graduate students in computational science. $36,000/year + tuition for 4 years.",
    stateResidency: [],
    county: [],
  },
  {
    name: "SIAM (Society for Industrial and Applied Math) Scholarship",
    url: "https://www.siam.org/careers-education/scholarships/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in applied mathematics, computational science, or related fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "AMS (American Meteorological Society) Scholarship",
    url: "https://www.ametsoc.org/ams-student-services/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For atmospheric and oceanic science students. Based on academic achievement and research potential.",
    stateResidency: [],
    county: [],
  },
  {
    name: "ASM Materials Education Foundation Scholarship",
    url: "https://www.asmrc.org/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For materials science and engineering students. Based on academic record and materials-related work.",
    stateResidency: [],
    county: [],
  },
  {
    name: "AIChE (American Institute of Chemical Engineers) Scholarship",
    url: "https://www.aiche.org/community/students/scholarships",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For chemical engineering students. Based on academic achievement and engineering potential.",
    stateResidency: [],
    county: [],
  },
  {
    name: "ASME (American Society of Mechanical Engineers) Scholarship",
    url: "https://www.asme.org/career-education/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For mechanical engineering students. Based on academics and engineering achievements.",
    stateResidency: [],
    county: [],
  },
  {
    name: "American Society of Civil Engineers (ASCE) Scholarship",
    url: "https://www.asce.org/careers-education/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For civil engineering students. Multiple awards based on academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Business Machines (IBM) Quantum Internship Scholarship",
    url: "https://www.ibm.com/quantum-computing/q-experience/",
    amount: 10000,
    deadline: "2027-02-15",
    description:
      "For students in quantum computing, computer science, and physics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Actuarial Scholarship (Casualty Actuarial Society)",
    url: "https://www.casact.org/scholarships/",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "For students pursuing actuarial science. Exams passed considered.",
    stateResidency: [],
    county: [],
  },
  // === TRADE / VOCATIONAL ===
  {
    name: "Associated General Contractors of America (AGC) Scholarship",
    url: "https://www.agc.org/education/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students in construction management, civil engineering, or skilled trades programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Association of Home Builders (NAHB) Scholarship",
    url: "https://www.nahb.org/education/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in residential building, construction management, or skilled trades.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Air Conditioning Contractors of America Scholarship",
    url: "https://www.acca.org/education/scholarships",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For HVAC/R students entering the trades. Based on academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Electrical Contractors Association (NECA) Scholarship",
    url: "https://www.necanet.org/education/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For electrical apprentices and students in electrical programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "IBEW Electrical Workers Scholarship",
    url: "https://www.ibew.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in electrical apprenticeship or electrical engineering programs.",
    stateResidency: [],
    county: [],
  },
  {
    name: "United Association (Plumbing/Pipefitting) Scholarship",
    url: "https://www.uaw.org/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students in pipe trades, plumbing, or HVAC programs.",
    stateResidency: [],
    county: [],
  },
  // === STUDY ABROAD / INTERNATIONAL ===
  {
    name: "Fulbright Scholar Program (Undergrad)",
    url: "https://fulbrightscholars.org/",
    amount: 0,
    deadline: null,
    description:
      "US government program for study abroad. For undergraduate and graduate students. Includes travel and living stipend.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Gilman Scholarship (Study Abroad)",
    url: "https://www.gilmanscholarship.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "Up to $5,000 for Pell Grant recipients studying abroad. Diverse and underrepresented students prioritized.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Boren Scholarship (Study Abroad)",
    url: "https://www.borenawards.org/",
    amount: 25000,
    deadline: "2027-02-01",
    description:
      "Up to $25,000 for study abroad in critical need languages. Service commitment to federal government.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Critical Language Scholarship (CLS)",
    url: "https://clscholarship.org/",
    amount: 0,
    deadline: "2027-01-15",
    description:
      "Fully funded summer language programs in critical need languages (Arabic, Chinese, etc.).",
    stateResidency: [],
    county: [],
  },
  {
    name: "Freeman Asia Scholarship (Study Abroad in Asia)",
    url: "https://www.freemanasia.org/",
    amount: 3000,
    amountMax: 7000,
    deadline: "2027-03-01",
    description:
      "For US students studying abroad in East and Southeast Asia. Need-based. Includes travel and living expenses.",
    stateResidency: [],
    county: [],
  },
  // === BUSINESS / ENTREPRENEURSHIP ===
  {
    name: "National Association of Black Accountants (NABA) Student Scholarship",
    url: "https://www.nabainc.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For minority students majoring in accounting, finance, or business. NABA membership preferred.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Association of Latino Professionals in Finance (ALPFA) Scholarship",
    url: "https://www.alpfa.org/scholarships",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For Latino students in finance, accounting, or business. Leadership and academic achievement considered.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Black MBA Association (NBMBAA) Leaders of Tomorrow Scholarship",
    url: "https://www.nbmbaa.org/scholarships",
    amount: 10000,
    deadline: "2027-02-28",
    description:
      "For Black/African American students pursuing graduate business degrees. Renewable.",
    stateResidency: [],
    county: [],
  },
  {
    name: "US Black Engineers (USBE) Scholarship",
    url: "https://www.usbcone.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For African American students in engineering, science, or technology at participating colleges.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Society of Hispanic Professional Engineers (SHPE) Scholarship",
    url: "https://www.shpe.org/scholarships",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For Hispanic students in STEM. Multiple award levels based on academic level and need.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Asian American Business Council Scholarship",
    url: "https://www.aabcsf.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For Asian American students in business, technology, or related fields.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeSTEMTradeIntl(): Promise<ScrapedScholarship[]> {
  return STEM_TRADE_INTL.map((s) => ({
    ...s,
    scrapedFrom: "stem-trade-intl",
  }));
}
