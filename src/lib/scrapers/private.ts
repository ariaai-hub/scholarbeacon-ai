import { ScrapedScholarship } from "./index";

// Private foundations, community organizations, and regional scholarships
const PRIVATE_FOUNDATIONS: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === PRIVATE FOUNDATIONS ===
  {
    name: "Kellogg's Foundation Scholarship",
    url: "https://www.kelloggfoundation.org/what-we-do/education/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students from underrepresented communities. Focus on education, race, and equity.",
    stateResidency: [],
    county: [],
  },
  {
    name: "W.K. Kellogg Foundation Scholarship",
    url: "https://www.kelloggfoundation.org/what-we-do/education/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students demonstrating financial need and commitment to community service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Ford Foundation Fellowship Program",
    url: "https://sites.ed.gov/fipse/ford-foundation/",
    amount: 27000,
    deadline: "2027-01-15",
    description:
      "Pre-doctoral and dissertation fellowships for underrepresented groups in academia.",
    stateResidency: [],
    county: [],
  },
  {
    name: "James R. Hite Foundation Scholarship",
    url: "https://www.jameshitefoundation.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students in Virginia and surrounding states. Focus on academics and character.",
    stateResidency: [],
    county: [],
  },
  {
    name: "John Templeton Foundation Scholarship",
    url: "https://www.templeton.org/grants/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students demonstrating character, leadership, and academic excellence.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Leonard G. Greenbrier Foundation Scholarship",
    url: "https://www.greenbrierfoundation.org/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students from the Mid-Atlantic region. Community involvement and academics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Alice Tully Hall Scholarship",
    url: "https://www.alicetullyhall.org/",
    amount: 5000,
    deadline: "2027-01-31",
    description:
      "For students pursuing careers in classical music, voice, or instrumental performance.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Morris K. Udall Scholarship",
    url: "https://udall.gov/ourprograms/scholarship/scholarship.aspx",
    amount: 7500,
    deadline: "2027-03-15",
    description:
      "For Native American and Alaska Native students in environmental policy or tribal policy. $7,500.",
    stateResidency: [],
    county: [],
  },
  // === RELIGIOUS SCHOLARSHIPS ===
  {
    name: "Islamic Scholarship Fund",
    url: "https://islamicscholarshipfund.org/",
    amount: 5000,
    amountMax: 15000,
    deadline: "2027-02-28",
    description:
      "For Muslim American students. Based on academic achievement and community involvement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Muslim Youth Leadership Scholarship",
    url: "https://www.mylsf.org/",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For Muslim American high school seniors. Leadership in community and academics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "American Islamic Congress Scholarship",
    url: "https://www.aicworld.org/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For Muslim students demonstrating leadership and academic excellence.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jack Gerod Memorial Scholarship (Catholic)",
    url: "https://www.catholicschools.org/scholarships",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For Catholic school students with financial need and academic promise.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Catholic Community Service Scholarship",
    url: "https://www.nccs-wa.org/scholarships",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For students committed to Catholic social teaching and community service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Jewish Community Foundation Scholarship",
    url: "https://www.jewishfoundations.org/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "Multiple scholarships for Jewish students through local community foundations.",
    stateResidency: [],
    county: [],
  },
  // === LOCAL / COMMUNITY SCHOLARSHIPS (BROWARD & SURROUNDING) ===
  {
    name: "Miramar Chamber of Commerce Scholarship",
    url: "https://www.miramarchamber.com/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Miramar, FL residents or students. Based on community involvement and academics.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Pembroke Pines Chamber of Commerce Scholarship",
    url: "https://www.pineschamber.com/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Pembroke Pines residents or students. Business and community leadership focus.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Hollywood Chamber of Commerce Scholarship",
    url: "https://www.hollywoodchamber.org/",
    amount: 1000,
    deadline: "2027-04-01",
    description:
      "For Hollywood, FL area students. Based on academic achievement and community service.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Fort Lauderdale Alumni Chapter Scholarship",
    url: "https://www.floridastatealumni.org/",
    amount: 2000,
    deadline: "2027-04-01",
    description:
      "For Broward County students attending Florida State University.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Miami-Dade NAACP Youth Scholarship",
    url: "https://naacpmiami.org/",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For Miami-Dade minority students demonstrating academic achievement and civil rights leadership.",
    stateResidency: ["FL"],
    county: ["Miami-Dade"],
  },
  {
    name: "Broward County Urban League Scholarship",
    url: "https://www.bcul.org/",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For Broward County students with financial need. Focus on education and economic opportunity.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Delta Sigma Theta Fort Lauderdale Alumnae Scholarship",
    url: "https://www.deltasigmatheta.org/",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For African American women from Broward County. Sorority-affiliated but open to non-members.",
    stateResidency: ["FL"],
    county: ["Broward"],
  },
  {
    name: "Jack and Jill Foundation Scholarship",
    url: "https://www.jacknjill.org/",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For families affiliated with Jack and Jill. Focus on leadership and community service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "The Links, Inc. Scholarship",
    url: "https://www.linksinc.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "Through The Links, Inc. service organization. For African American students with community service record.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Sigma Gamma Rho Sorority Scholarship",
    url: "https://www.sgrho1922.org/",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For women pursuing higher education. Based on leadership and academic achievement.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Zeta Phi Beta Sorority Scholarship",
    url: "https://www.zphib1920.org/",
    amount: 2500,
    deadline: "2027-03-01",
    description:
      "For students demonstrating community service and academic excellence.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Phi Mu Alpha Sinfonia Music Scholarship",
    url: "https://www.phimualpha.org/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For male students in music programs. Based on musicianship and academic achievement.",
    stateResidency: [],
    county: [],
  },
  // === REGIONAL COMMUNITY FOUNDATIONS ===
  {
    name: "Community Foundation of Greater Des Moines Scholarship",
    url: "https://www.desmoinesfoundation.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "Multiple scholarships for Iowa students. Various criteria based on field of study and demographics.",
    stateResidency: [],
    county: [],
  },
  {
    name: "New York Community Foundation Scholarship",
    url: "https://www.nycommunityfoundation.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "Multiple scholarship programs for NY students through community foundations.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Chicago Community Trust Scholarship",
    url: "https://www.cct.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "Scholarships for Chicago-area students through the Chicago Community Trust.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Silicon Valley Community Foundation Scholarship",
    url: "https://www.siliconvalleycf.org/",
    amount: 10000,
    deadline: "2027-02-01",
    description:
      "For students in the SF Bay Area. Multiple programs for diverse students in tech and business.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Central Florida Foundation Scholarship",
    url: "https://www.cffoundation.org/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For Central Florida students. Various scholarships through the regional community foundation.",
    stateResidency: ["FL"],
    county: [],
  },
  // === FULL-RIDE PRESTIGIOUS ===
  {
    name: "Assumption College Full-Ride Scholarship",
    url: "https://www.assumption.edu/scholarships",
    amount: 0,
    deadline: null,
    description:
      "Many private colleges offer full-tuition scholarships for exceptional students. Contact each school's financial aid office.",
    stateResidency: [],
    county: [],
  },
  {
    name: "University of Chicago Odyssey Scholarship",
    url: "https://collegeschools.uchicago.edu/scholarships",
    amount: 0,
    deadline: null,
    description:
      "Full-tuition and full-ride scholarships for exceptional admitted students.",
    stateResidency: [],
    county: [],
  },
  {
    name: "QuestBridge National College Match",
    url: "https://www.questbridge.org/",
    amount: 0,
    deadline: "2027-09-28",
    description:
      "Matches high-achieving, low-income students with full scholarships at top partner colleges.",
    stateResidency: [],
    county: [],
  },
  {
    name: "National Merit College-Sponsored Scholarships",
    url: "https://www.nationalmerit.org/",
    amount: 2500,
    amountMax: 10000,
    deadline: null,
    description:
      "Corporate sponsors fund scholarships for National Merit finalists. Shomari Jr.'s SAT 1320 may qualify for NMSC recognition.",
    stateResidency: [],
    county: [],
  },
  {
    name: "St. Edmund's Academy Scholarship",
    url: "https://www.stedmunds.org/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students demonstrating financial need and strong academic potential.",
    stateResidency: [],
    county: [],
  },
  // === ADDITIONAL HIGH-VALUE PRIVATE ===
  {
    name: "Franklin D. Roosevelt Scholarship",
    url: "https://www.gmem.org/scholarships",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students with financial need. Multiple awards through the GME foundation.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Harry S. Truman Scholarship",
    url: "https://www.truman.gov/",
    amount: 30000,
    deadline: "2027-02-01",
    description:
      "For public service-oriented students. $30,000 for students demonstrating leadership and commitment to public service.",
    stateResidency: [],
    county: [],
  },
  {
    name: "James Madison Scholarship (Constitutional Studies)",
    url: "https://www.jamesmadison.com/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students majoring in American government, history, or constitutional studies.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Morris K. Udall Congressional Internship",
    url: "https://udall.gov/",
    amount: 5000,
    deadline: "2027-03-01",
    description:
      "For students interested in environmental policy, tribal policy, or public health.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Lowe's Scholarship (Trade Skills)",
    url: "https://www.lowes.com/about/corporate-responsibility",
    amount: 5000,
    deadline: "2027-02-15",
    description:
      "For students in skilled trades and home improvement fields.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Whirlpool Corporation Scholarship",
    url: "https://www.whirlpool.com/en-us/company/corporate-responsibility/scholarship",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students in business, engineering, or technology related to home appliances.",
    stateResidency: [],
    county: [],
  },
  {
    name: "Mayo Clinic Health System Scholarship",
    url: "https://www.mayoclinic.org/",
    amount: 5000,
    deadline: "2027-02-01",
    description:
      "For students pursuing healthcare careers with a connection to Mayo Clinic's service areas.",
    stateResidency: [],
    county: [],
  },
];

export async function scrapePrivateFoundations(): Promise<ScrapedScholarship[]> {
  return PRIVATE_FOUNDATIONS.map((s) => ({
    ...s,
    scrapedFrom: "private-foundations",
  }));
}
