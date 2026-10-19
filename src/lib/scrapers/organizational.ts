import { ScrapedScholarship } from "./index";

// Organizational, fraternal, and special interest scholarships
const ORGANIZATIONAL_SCHOLARSHIPS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === FRATERNAL ORGANIZATIONS ===
  {
    name: "Elks National Foundation Most Valuable Student Scholarship",
    url: "https://www.elks.org/scholars/scholarships/mvs.cfm",
    amount: 15000,
    deadline: "2027-02-01",
    description:
      "500+ awards annually for high school seniors. Based on academics, leadership, and service. No relation to Elks required.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Elks Florida State Scholarship",
    url: "https://www.elks.org/florida/scholarships",
    amount: 4000,
    deadline: "2027-03-01",
    description:
      "Florida Elks state-level scholarship for Florida high school seniors. Additional award for Elks members or relatives.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "Moose International Scholarship",
    url: "https://www.moose.org/scholarship",
    amount: 5000,
    deadline: "2027-04-01",
    description:
      "For Moose Lodge members and their dependents. Multiple award levels based on affiliation.",
    stateResidency: [],
    county: [],
  },
  {
    name: "VFW (Veterans of Foreign Wars) Scholarship",
    url: "https://www.vfw.org/assistance/youth-scholarships/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For dependent children of VFW members. Military service and community involvement considered.",
    stateResidency: [],
    county: [],
  },
  {
    name: "American Legion National Emergency Scholarship",
    url: "https://www.legion.org/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For children of American Legion members or veterans. Multiple scholarships available.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Daughters of the American Revolution (DAR) Scholarship",
    url: "https://www.dar.org/national-society/scholarships",
    amount: 5000,
    amountMax: 20000,
    deadline: "2027-01-31",
    description:
      "Multiple scholarships for female students with connection to Revolutionary War ancestry. Various criteria.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Knights of Columbus Scholarship",
    url: "https://www.kofc.org/en/scholarships/index.html",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For Catholic students. Based on academics, leadership, and service. Sons and daughters of Knights of Columbus members receive priority.",
    stateResidency: [],
    county: [],
  },
  // === SERVICE CLUBS ===
  {
    name: "Rotary International Scholarship",
    url: "https://www.rotary.org/en/our-programs/scholarships",
    amount: 5000,
    amountMax: 30000,
    deadline: "2027-03-01",
    description:
      "Various Rotary scholarships for undergraduate and graduate study abroad. Contact local Rotary club for application.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Lions Club International Scholarship",
    url: "https://www.lionsclubs.org/en/start/our-ways/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students with visual impairment or community service in Lions Club areas. Contact local Lions Club.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Kiwanis International Scholarship",
    url: "https://www.kiwanis.org/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "Various scholarships through Kiwanis clubs for students demonstrating service and leadership.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jaycees Scholarship Program",
    url: "https://www.usjaycees.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For young leaders aged 18-35. Based on leadership and community impact.",
    stateResidency: [],
    county: [],
  },
  // === FIRST GENERATION / LOW INCOME ===
  {
    name: "McKay Scholarship (Florida)",
    url: "https://www.floridaschoolchoice.org/mckay/",
    amount: 0,
    deadline: null,
    description:
      "Florida scholarship for students with disabilities to attend private schools. For students with IEP or 504 plan.",
    stateResidency: ["FL"],
    county: [],
  },
  {
    name: "First Generation College Graduate Scholarship",
    url: "https://www.fafsa.ed.gov/",
    amount: 5000,
    deadline: null,
    description:
      "Many colleges offer first-generation scholarships. Complete FAFSA to be considered for federal and institutional aid.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Coca-Cola First Generation Scholarship",
    url: "https://www.coca-colascholars.org/first-generation",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "For first-generation college students. Based on financial need and academic achievement.",
    stateResidency: [],
    county: [],
  },
  // === ESSAY / CREATIVE CONTESTS ===
  {
    name: "College Board Scholarship Essay Contest",
    url: "https://www.collegeboard.org/scholarships",
    amount: 500,
    amountMax: 5000,
    deadline: "2027-04-01",
    description:
      "Periodic essay contests through College Board. Check website for active contests.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Writer's Digest Annual Writing Competition",
    url: "https://writersdigest.com/writers-digest-competitions",
    amount: 5000,
    deadline: "2027-05-31",
    description:
      "Essay and writing contest for students. Categories include personal essay, humor, and fiction.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Young Writers Award (Bennington College)",
    url: "https://www.bennington.edu/young-writers-award",
    amount: 500,
    amountMax: 5000,
    deadline: "2027-01-31",
    description:
      "For high school students demonstrating exceptional writing ability. Poetry and fiction categories.",
    stateResidency: [],
    county: [],
  },
  // === ATHLETIC ===
  {
    name: "NCAA National Scholarship",
    url: "https://www.ncaa.org/sports/scholarships",
    amount: 0,
    deadline: null,
    description:
      "NCAA provides scholarships for Division I and II athletes. Contact college athletic departments directly.",
    stateResidency: [],
    county: [],
  },
  // === TALENT / ARTS ===
  {
    name: "National YoungArts Foundation",
    url: "https://youngarts.org/",
    amount: 10000,
    amountMax: 25000,
    deadline: "2027-01-15",
    description:
      "For emerging artists in visual, literary, design, and performing arts. Talent-based awards and mentorship.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Merit Scholarship Corporation Fine Arts Award",
    url: "https://www.nationalmerit.org/s/17502/",
    amount: 2500,
    deadline: null,
    description:
      "For National Merit finalists with exceptional talent in music or fine arts.",
    stateResidency: [],
    county: [],
  },
  // === JOURNALISM / DEBATE ===
  {
    name: "Howard R. Swearer Student Prize (Debate)",
    url: "https://www.americanbar.org/groups/young_lawyers/student-competition/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For high school debaters. ABA sponsored national competition with scholarship awards.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Journalism Education Association Scholarship",
    url: "https://jeonline.org/scholarships/",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For high school journalists. Based on journalism work and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Society of Professional Journalists Scholarship",
    url: "https://www.spj.org/education.php",
    amount: 2500,
    deadline: "2027-04-01",
    description:
      "For students pursuing journalism or communications. Based on journalism experience and academic record.",
    stateResidency: [],
    county: [],
  },
  // === ENTREPRENEURSHIP ===
  {
    name: "NFIB Young Entrepreneur of the Year Award",
    url: "https://www.nfib.com/engros/small-business-topics/young-entrepreneur-award",
    amount: 15000,
    deadline: "2027-01-31",
    description:
      "For high school seniors who own or operate a small business. Based on entrepreneurial achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Cartier Women's Initiative Scholarship",
    url: "https://www.cartierwomensinitiative.com/",
    amount: 30000,
    deadline: "2027-03-01",
    description:
      "For women entrepreneurs worldwide. Includes mentorship and funding for early-stage women-owned businesses.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Entrepreneurship Scholarship (National Association)",
    url: "https://www.score.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students demonstrating entrepreneurial initiative and business innovation.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapeOrganizationalScholarships(): Promise<ScrapedScholarship[]> {
  return ORGANIZATIONAL_SCHOLARSHIPS.map((s) => ({
    ...s,
    scrapedFrom: "organizational",
  }));
}
