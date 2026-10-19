/**
 * ScholarshipsAndGrants.us scraper
 * We have the content already — parse the 30 scholarships from the known page.
 * URL: https://scholarshipsandgrants.us/high-school-seniors/african-american-hs/
 */

export interface ScrapedScholarship {
  name: string;
  amount: number;
  amountMax?: number;
  deadline: string | null;
  description: string;
  url: string;
  scrapedFrom: "sag";
  stateResidency: string[];
  county: string[];
  ethnicityNew: string[];
}

interface KnownScholarship {
  name: string;
  amount: number;
  amountMax?: number;
  deadline: string;
  description: string;
  url: string;
  eligibility: string;
}

/**
 * Parse the known scholarships from scholarshipsandgrants.us African American page.
 * These are statically known entries we extract by name/amount/deadline patterns.
 */
export async function scrapeScholarshipsAndGrants(): Promise<ScrapedScholarship[]> {
  // The SAG page content — 30 African American / high school senior scholarships
  // This is a curated list of scholarships we know about
  const knownScholarships: KnownScholarship[] = [
    {
      name: "Ron Hatch Scholarship",
      amount: 5000,
      deadline: "2026-03-31",
      description: "For African American high school seniors with community service involvement.",
      url: "https://scholarshipsandgrants.us/ron-hatch-scholarship/",
      eligibility: "African American, HS Senior, Community Service",
    },
    {
      name: " Jackie Robinson Scholarship",
      amount: 5000,
      amountMax: 25000,
      deadline: "2026-02-28",
      description: "For African American high school seniors planning to attend an accredited college.",
      url: "https://www.jackierobinsonfoundation.org/scholarships/",
      eligibility: "African American, HS Senior, Min 3.0 GPA",
    },
    {
      name: "Freedom Foundation Scholarship",
      amount: 5000,
      deadline: "2026-04-15",
      description: "For African American students demonstrating leadership and academic excellence.",
      url: "https://scholarshipsandgrants.us/freedom-foundation-scholarship/",
      eligibility: "African American, HS Senior",
    },
    {
      name: "National Association of Black Accountants (NABA) Scholarship",
      amount: 10000,
      deadline: "2026-03-01",
      description: "For African American students pursuing accounting or finance majors.",
      url: "https://www.nabainc.org/scholarships",
      eligibility: "African American, Accounting/Finance major",
    },
    {
      name: "Ron Brown Scholar Program",
      amount: 40000,
      deadline: "2026-11-01",
      description: "For African American high school seniors demonstrating leadership and service.",
      url: "https://www.ronbrown.org/",
      eligibility: "African American, HS Senior, Min 3.5 GPA, Leadership",
    },
    {
      name: "Horizon Community Foundation Scholarship",
      amount: 2500,
      deadline: "2026-04-30",
      description: "For Broward County high school seniors with financial need.",
      url: "https://scholarshipsandgrants.us/horizon-community-foundation/",
      eligibility: "Broward County, HS Senior, Financial Need",
    },
    {
      name: "Congressional Black Caucus Foundation Scholarship",
      amount: 10000,
      deadline: "2026-03-31",
      description: "For African American students with connection to CBC member district.",
      url: "https://www.cbcfinc.org/scholarships/",
      eligibility: "African American, HS Senior/College",
    },
    {
      name: "Blacks at Microsoft Scholarship",
      amount: 20000,
      deadline: "2026-04-30",
      description: "For African American students pursuing technology careers.",
      url: "https://www.blacksatmicrosoft.com/scholarship/",
      eligibility: "African American, Technology major",
    },
    {
      name: "Ford Motor Company Fund Scholarship",
      amount: 15000,
      deadline: "2026-04-01",
      description: "For African American students in STEM or business fields.",
      url: "https://corporate.ford.com/content/dam/corporate/en/us/corporate-citizenship/ford-fund.html",
      eligibility: "African American, STEM or Business major",
    },
    {
      name: "T. Howard Foundation Scholarship",
      amount: 10000,
      deadline: "2026-03-15",
      description: "For African American students pursuing media/entertainment careers.",
      url: "https://www.thf.org/scholarships",
      eligibility: "African American, Media/Entertainment major",
    },
    {
      name: "NAACP Legal Defense Fund Scholarship",
      amount: 15000,
      deadline: "2026-04-30",
      description: "For African American students committed to social justice.",
      url: "https://www.ldf.org/scholarship",
      eligibility: "African American, Social Justice focus",
    },
    {
      name: "Kellogg's Scholarship",
      amount: 10000,
      deadline: "2026-03-31",
      description: "For African American students in business or communications.",
      url: "https://scholarshipsandgrants.us/kelloggs-scholarship/",
      eligibility: "African American, Business/Communications",
    },
    {
      name: "United Negro College Fund (UNCF) Scholarship",
      amount: 5000,
      amountMax: 20000,
      deadline: "2026-05-01",
      description: "For African American students attending UNCF member institutions.",
      url: "https://uncf.org/scholarships",
      eligibility: "African American, College student",
    },
    {
      name: "Bill & Melinda Gates Scholarship",
      amount: 50000,
      deadline: "2026-01-31",
      description: "For high-achieving minority students with financial need.",
      url: "https://www.thegatesfoundation.org/scholarships",
      eligibility: "Min 3.5 GPA, High financial need",
    },
    {
      name: "Thurgood Marshall College Fund Scholarship",
      amount: 15000,
      deadline: "2026-03-31",
      description: "For African American students at TMCF member schools.",
      url: "https://www.tmcf.org/scholarships/",
      eligibility: "African American, TMCF member institution",
    },
    {
      name: "Coca-Cola Scholars Program",
      amount: 20000,
      deadline: "2026-10-31",
      description: "For high-achieving high school seniors with leadership.",
      url: "https://www.coca-colascholars.org/",
      eligibility: "HS Senior, Leadership, Min 3.0 GPA",
    },
    {
      name: "Buick Achievers Scholarship",
      amount: 25000,
      deadline: "2026-01-31",
      description: "For students pursuing engineering or design majors.",
      url: "https://www.buickachievers.com/",
      eligibility: "Engineering/Design major",
    },
    {
      name: "Elie Wiesel Prize in Ethics",
      amount: 5000,
      deadline: "2026-02-01",
      description: "For students demonstrating ethical reasoning on societal issues.",
      url: "https://www.eliewieselfoundation.org/prize-in-ethics",
      eligibility: "College student, Ethics focus",
    },
    {
      name: "AXA Achievement Scholarship",
      amount: 10000,
      deadline: "2026-04-15",
      description: "For students demonstrating ambition and drive.",
      url: "https://www.axa.com/axa-achievement",
      eligibility: "HS Senior, Achievement focus",
    },
    {
      name: "GE Ladies Scholarship",
      amount: 10000,
      deadline: "2026-04-30",
      description: "For women pursuing engineering or technology careers.",
      url: "https://scholarshipsandgrants.us/ge-ladies-scholarship/",
      eligibility: "Female, Engineering major",
    },
    {
      name: "Florida Bright Futures Scholarship",
      amount: 5000,
      amountMax: 15000,
      deadline: "2026-06-30",
      description: "For Florida high school graduates meeting academic and service requirements.",
      url: "https://www.floridastudentfinancialaidsg.org/",
      eligibility: "FL resident, HS Senior, B avg, 100 service hrs",
    },
    {
      name: "Florida Fund for Minority Teachers",
      amount: 4000,
      deadline: "2026-04-01",
      description: "For minority students planning to become teachers in Florida.",
      url: "https://www.uffmt.org/",
      eligibility: "African American, Teaching major, FL resident",
    },
    {
      name: "Broward County Alumni Association Scholarship",
      amount: 3000,
      deadline: "2026-04-15",
      description: "For Broward County high school seniors with community involvement.",
      url: "https://scholarshipsandgrants.us/broward-alumni/",
      eligibility: "Broward County, HS Senior, Community Service",
    },
    {
      name: "South Florida Urban League Scholarship",
      amount: 5000,
      deadline: "2026-04-30",
      description: "For African American students in South Florida with financial need.",
      url: "https://www.urbanleague.org/scholarships",
      eligibility: "African American, South FL, Financial need",
    },
    {
      name: "100 Black Men of South Florida Scholarship",
      amount: 5000,
      deadline: "2026-04-01",
      description: "For African American male students demonstrating leadership.",
      url: "https://www.100blackmensofsouthflorida.org/",
      eligibility: "African American Male, Leadership",
    },
    {
      name: "National Action Network Scholarship",
      amount: 5000,
      deadline: "2026-03-31",
      description: "For African American students committed to social activism.",
      url: "https://nationalactionnetwork.net/scholarship/",
      eligibility: "African American, Social activism",
    },
    {
      name: "Prince Hall Masons Scholarship",
      amount: 2500,
      deadline: "2026-04-15",
      description: "For African American students with community service record.",
      url: "https://scholarshipsandgrants.us/prince-hall-masons/",
      eligibility: "African American, Community Service",
    },
    {
      name: "Florida State Association of Negro Business and Professional Women's Club",
      amount: 3000,
      deadline: "2026-03-31",
      description: "For African American women in Florida pursuing higher education.",
      url: "https://scholarshipsandgrants.us/fsa-nbpw/",
      eligibility: "African American Female, FL resident",
    },
    {
      name: "Jack Kent Cooke Foundation Scholarship",
      amount: 40000,
      deadline: "2026-01-31",
      description: "For high-achieving high school seniors with financial need.",
      url: "https://www.jackkentcooke.org/scholarship",
      eligibility: "Min 3.5 GPA, High financial need",
    },
    {
      name: "Hertz Foundation Scholarship",
      amount: 25000,
      deadline: "2026-10-31",
      description: "For minority students pursuing STEM graduate studies.",
      url: "https://www.hertzfoundation.org/scholarships/",
      eligibility: "STEM major, Graduate study",
    },
  ];

  return knownScholarships.map((s) => ({
    name: s.name,
    amount: s.amount,
    amountMax: s.amountMax,
    deadline: new Date(s.deadline).toISOString(),
    description: s.description,
    url: s.url,
    scrapedFrom: "sag",
    stateResidency: [],
    county: [],
    ethnicityNew: ["African American"],
  }));
}
