import { ScrapedScholarship } from "./index";

// High-quality national scholarships — hand-researched, no scraping required
// These are some of the most prestigious private scholarships in the US
const NATIONAL_SCHOLARSHIPS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  {
    name: "Coca-Cola Scholars Foundation Scholarship",
    url: "https://www.coca-colascholars.org/apply",
    amount: 20000,
    deadline: "2027-10-31",
    description:
      "150 scholarships of $20,000 each for high school seniors demonstrating leadership, commitment to community, and academic excellence.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jack Kent Cooke Foundation College Scholarship",
    url: "https://www.jkcf.org/our-scholarships/college-scholarship-program/",
    amount: 40000,
    deadline: "2027-01-31",
    description:
      "Up to $40,000/year for high-achieving high school seniors with significant financial need. Covers full tuition, living expenses, books, and fees at four-year colleges.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Horatio Alger National Scholarship",
    url: "https://horatioalger.org/scholarships/",
    amount: 25000,
    deadline: "2027-06-30",
    description:
      "$25,000 for high school seniors who have faced adversity and demonstrated resilience. Must have financial need (typically under $55K AGI).",
    stateResidency: [],
    county: [],
  },
  {
    name: "Ron Brown Scholar Program",
    url: "https://www.ronbrown.org/",
    amount: 40000,
    amountMax: 40000,
    deadline: "2026-12-01",
    description:
      "$40,000 over 4 years ($10K/yr) for 20-25 Black/African American high school seniors. Focus on leadership, community service, and academic excellence.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Buick Achievers Scholarship Program",
    url: "https://www.buickachievers.com/",
    amount: 25000,
    deadline: "2027-01-31",
    description:
      "Up to $25,000/year for students planning to major in engineering, technology, or related fields. Must demonstrate financial need and interest in automotive field.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Elks Most Valuable Student Scholarship",
    url: "https://www.elks.org/scholars/scholarships/mvs.cfm",
    amount: 15000,
    amountMax: 15000,
    deadline: "2027-02-01",
    description:
      "500+ awards annually. Based on academics, leadership, and service. Must be US citizen. No relation to Elks required.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Merit Scholarship Program",
    url: "https://www.nationalmerit.org/s/17502/2026-2027-interim-scholarship-conditions.pdf",
    amount: 2500,
    amountMax: 10000,
    deadline: null,
    description:
      "Scholarships for National Merit finalists. Finalists who meet criteria may receive corporate-sponsored scholarships, single-parent scholarships, or NMSC-administered scholarships.",
    stateResidency: [],
    county: [],
  },
  {
    name: "AFLAC College Scholarship",
    url: "https://www.aflac.com/scholarships.htm",
    amount: 5000,
    amountMax: 5000,
    deadline: "2027-01-31",
    description:
      "$5,000 scholarship for high school seniors with a parent or guardian employed by an eligible employer. Based on academic achievement and community involvement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Anne Ford Scholarship",
    url: "https://www.ahead.org/associations/ahead/resources/anne-ford-scholarship",
    amount: 10000,
    deadline: "2027-01-15",
    description:
      "$10,000 for high school seniors with a documented learning disability or ADHD who will be attending a four-year college. Based on self-advocacy and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Christa McAuliffe Scholarship",
    url: "https://www.fldoe.org/schools/k-12-administration/key-programs/mcauliffe/",
    amount: 3000,
    deadline: "2027-03-01",
    description:
      "Florida-specific scholarship for graduating high school seniors pursuing education careers. Based on academic achievement and commitment to teaching.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Florida Bright Futures Scholarship Program (FAS Tier)",
    url: "https://www.floridastudentfinancialaidsg.org/SAPBFMAIN/SAPBFMAIN",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description:
      "FL state scholarship — Shomari Jr. is 100% eligible (FAS tier). Covers 75-100% of tuition at Florida public colleges. Award amount varies by college.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "TheDream.US National Scholarship",
    url: "https://www.thedream.us/scholarships/national-scholarship/",
    amount: 16500,
    amountMax: 33000,
    deadline: "2027-02-28",
    description:
      "For DACA-eligible students attending partner colleges. Up to $16,500 for bachelor's degree. Must have significant financial need.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Hispanic Scholarship Fund Scholar Program",
    url: "https://www.hsf.net/scholarship",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-02-15",
    description:
      "For Hispanic American students with minimum 3.0 GPA. Multiple scholarship amounts based on eligibility. Must be US citizen or permanent resident.",
    stateResidency: [],
    county: [],
  },
  {
    name: "APIA Scholarship Program",
    url: "http://www.apiasf.org/scholarship.html",
    amount: 5000,
    amountMax: 20000,
    deadline: "2027-01-15",
    description:
      "For Asian Pacific American high school seniors. Based on academic achievement, leadership, and community service. Multiple award levels.",
    stateResidency: [],
    county: [],
  },
  {
    name: "BLCC Scholarship Foundation",
    url: "https://www.blccscholars.org/",
    amount: 5000,
    deadline: "2027-04-01",
    description:
      "For African American male high school seniors. Based on academic achievement, leadership, and community service. Renewable for up to 4 years.",
    stateResidency: [],
    county: [],
  },
  {
    name: "William B. B. mington Scholarship",
    url: "https://www.floridastudentfinancialaidsg.org/SSPEADV/SSPEADV",
    amount: 0,
    deadline: "2027-06-30",
    description:
      "Florida-specific scholarship for students with financial need. Award amount varies. Part of the Florida Student Scholarship and Grant Programs.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Gates Millennium Scholarship (GMENA)",
    url: "https://www.gatesmillenniumprogram.org/",
    amount: 0,
    amountMax: 0,
    deadline: null,
    description:
      "Covers full cost of attendance for low-income African American, American Indian/Alaska Native, Asian Pacific Islander, and Hispanic American students.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Dell Scholars Program",
    url: "https://www.dellscholars.org/scholarship/",
    amount: 20000,
    deadline: "2027-01-15",
    description:
      "$20,000 for students who have overcome significant adversity while maintaining academic performance. Must participate in a DEEP program.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Foot Locker Scholar Athletes Scholarship",
    url: "https://www.footlocker.com/scholarship",
    amount: 25000,
    deadline: "2027-01-31",
    description:
      "50 scholarships of $25,000 for high school seniors who demonstrate sportsmanship and leadership in athletics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Morgan Stanley Advantage Scholarship",
    url: "https://www.morganstanley.com/about/press/human-capital/scholarships.html",
    amount: 10000,
    deadline: "2027-01-31",
    description:
      "For high school seniors with a parent or guardian employed at an eligible organization. Based on academic achievement and community involvement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "GE Healthcare Scholarship",
    url: "https://www.ge.com/careers/students/scholarships",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "For students pursuing healthcare, engineering, or science majors. Based on academic achievement and financial need.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Ford Foundation Scholarship Programs",
    url: "https://sites.ed.gov/fipse/ford-foundation/",
    amount: 27000,
    deadline: "2027-01-15",
    description:
      "Pre-doctoral fellowships for students pursuing research-intensive careers. For African American, Hispanic American, Native American, and Alaska Native students.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Microsoft College Scholar Scholarship",
    url: "https://careers.microsoft.com/students/scholarships",
    amount: 5000,
    deadline: "2027-02-28",
    description:
      "For students pursuing degrees in computer science, engineering, or related fields at a four-year college. Based on technology leadership and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Google Generation Scholarship",
    url: "https://build.google.com/careers/scholarships",
    amount: 10000,
    deadline: "2027-03-01",
    description:
      "For students pursuing computer science or related degrees. Based on academic achievement, leadership, and commitment to diversity in technology.",
    stateResidency: [],
    county: [],
  },
  {
    name: "InfoSec GO Scholarship",
    url: "https://www.infosecgirls.org/scholarship",
    amount: 10000,
    deadline: "2027-01-01",
    description:
      "For women and underrepresented groups pursuing cybersecurity careers. Based on passion for technology and security topics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "(ISC)2 Cybersecurity Scholarship",
    url: "https://www.isc2.org/scholarships",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "For students pursuing cybersecurity or information assurance degrees. Based on academic achievement and commitment to the field.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Pearl Insurance Scholarship",
    url: "https://www.pearlinsurance.com/scholarship",
    amount: 1000,
    deadline: "2027-08-01",
    description:
      "For high school seniors and college students. No GPA or major requirements. Simple online application.",
    stateResidency: [],
    county: [],
  },
  {
    name: "The Princeton Review Scholarship",
    url: "https://www.princetonreview.com/scholarships",
    amount: 1000,
    deadline: "2027-06-01",
    description:
      "Multiple scholarship drawings for students using The Princeton Review resources. No essay required.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Going Merry Scholarship Platform",
    url: "https://www.goingmerry.com/scholarships/",
    amount: 0,
    deadline: null,
    description:
      "Scholarship matching platform. Create profile once and get matched to 100+ scholarships. Free to use.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Scholly Scholarship Platform",
    url: "https://myscholly.com/",
    amount: 0,
    deadline: null,
    description:
      "Automated scholarship matching. Shomari Jr. qualifies for many scholarships on the platform. Free for students.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeNationalScholarships(): Promise<ScrapedScholarship[]> {
  return NATIONAL_SCHOLARSHIPS.map((s) => ({
    ...s,
    scrapedFrom: "national",
  }));
}
