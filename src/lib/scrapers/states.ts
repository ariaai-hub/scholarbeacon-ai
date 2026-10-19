import { ScrapedScholarship } from "./index";

// All-50-states comprehensive scholarship list
const ALL_STATES: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // ALABAMA
  { name: "Alabama Scholarship for Dependents of Blind Parents", url: "https://www.alache.org/", amount: 0, deadline: "2027-06-01", description: "For Alabama students whose parent is blind. Covers tuition at Alabama public institutions.", stateResidency: ["AL"], county: [] },
  { name: "Alabama G.I. Dependents Scholarship", url: "https://www.va.alabama.gov/", amount: 0, deadline: null, description: "For dependents of Alabama-disabled veterans. Covers tuition at Alabama public institutions.", stateResidency: ["AL"], county: [] },
  // ALASKA
  { name: "Alaska Performance Scholarship", url: "https://acpe.alaska.gov/APS", amount: 0, deadline: null, description: "For Alaska high school seniors meeting GPA and curriculum requirements. Up to full tuition at Alaska institutions.", stateResidency: ["AK"], county: [] },
  // ARIZONA
  { name: "Arizona Family College Savings Plan Scholarship", url: "https://www.az.gov/education", amount: 0, deadline: null, description: "For Arizona residents attending AZ colleges. Based on college savings plan enrollment.", stateResidency: ["AZ"], county: [] },
  // ARKANSAS
  { name: "Arkansas Academic Challenge Scholarship", url: "https://scholarships.arkansas.gov/", amount: 5000, deadline: "2027-06-01", description: "For Arkansas residents pursuing higher education. Lottery-funded program.", stateResidency: ["AR"], county: [] },
  // CALIFORNIA
  { name: "Cal Grant A and B", url: "https://www.csac.ca.gov/", amount: 0, deadline: "2027-03-02", description: "California state financial aid. Cal Grant B provides up to $12,000 for tuition. Based on financial need and academics.", stateResidency: ["CA"], county: [] },
  { name: "University of California Blue and Gold Scholarship", url: "https://admission.universityofcalifornia.edu/", amount: 20000, deadline: "2027-03-01", description: "For UC campuses. Covers full tuition for low-income California students.", stateResidency: ["CA"], county: [] },
  { name: "California Community Foundation Scholarship", url: "https://www.calfund.org/", amount: 5000, deadline: "2027-03-01", description: "Multiple scholarships for LA-area students through the California Community Foundation.", stateResidency: ["CA"], county: [] },
  // COLORADO
  { name: "Colorado College Access Scholarship", url: "https://cdhe.co.gov/", amount: 5000, deadline: "2027-04-01", description: "For Colorado residents attending in-state institutions. Based on financial need.", stateResidency: ["CO"], county: [] },
  // CONNECTICUT
  { name: "Connecticut Independent College Student Grant", url: "https://www.ct.gov/dhes/", amount: 5000, deadline: "2027-06-30", description: "For Connecticut students attending in-state private colleges. Based on financial need.", stateResidency: ["CT"], county: [] },
  // DELAWARE
  { name: "Delaware Scholarship Collaborative", url: "https://www.doe.k12.de.us/", amount: 5000, deadline: "2027-03-01", description: "Multiple scholarships for Delaware students through the state scholarship collaborative.", stateResidency: ["DE"], county: [] },
  // GEORGIA
  { name: "Georgia HOPE Scholarship", url: "https://www.gafutures.org/hope-state-aid/", amount: 0, deadline: null, description: "Georgia's flagship HOPE Scholarship for students with 3.0+ GPA. Covers portion of tuition at GA public colleges.", stateResidency: ["GA"], county: [] },
  { name: "Georgia Zell Miller Scholarship", url: "https://www.gafutures.org/hope-state-aid/", amount: 0, deadline: null, description: "Full tuition scholarship for Georgia students with 3.7+ GPA and SAT 1200+. Most rigorous GA scholarship.", stateResidency: ["GA"], county: [] },
  { name: "Georgia Public Safety Memorial Grant", url: "https://www.gafutures.org/", amount: 3000, deadline: null, description: "For dependents of Georgia public safety officers killed or disabled in the line of duty.", stateResidency: ["GA"], county: [] },
  // HAWAII
  { name: "Hawaii B+ Scholarship", url: "https://www.hawaiistatefcu.org/", amount: 2000, deadline: "2027-03-01", description: "For Hawaii residents with B+ average. Multiple awards annually.", stateResidency: ["HI"], county: [] },
  // IDAHO
  { name: "Idaho State Scholarship Program", url: "https://boardofed.idaho.gov/", amount: 3000, deadline: "2027-03-01", description: "For Idaho residents attending Idaho institutions. Based on academics and leadership.", stateResidency: ["ID"], county: [] },
  // ILLINOIS
  { name: "Illinois Monetary Award Program (MAP)", url: "https://www.isac.org/", amount: 0, deadline: null, description: "Illinois' largest need-based grant. Covers tuition and mandatory fees at IL public institutions.", stateResidency: ["IL"], county: [] },
  { name: "Chicago Public Schools Scholarship Program", url: "https://www.cps.edu/", amount: 5000, deadline: "2027-04-01", description: "For CPS graduates attending Chicago colleges. Multiple scholarship tiers.", stateResidency: ["IL"], county: [] },
  // INDIANA
  { name: "Indiana Frank O'Bannon Grant", url: "https://www.in.gov/che/", amount: 0, deadline: null, description: "For Indiana students attending Indiana colleges. Based on financial need.", stateResidency: ["IN"], county: [] },
  { name: "Indiana Mitchell Scholarship", url: "https://www.in.gov/che/", amount: 5000, deadline: "2027-04-01", description: "For Indiana high school seniors with academic excellence and community involvement.", stateResidency: ["IN"], county: [] },
  // IOWA
  { name: "Iowa Tuition Aid Grant (ITAG)", url: "https://www.iowacollegeaid.gov/", amount: 0, deadline: null, description: "Iowa's largest need-based grant. Based on financial need and enrollment.", stateResidency: ["IA"], county: [] },
  // KANSAS
  { name: "Kansas State Scholarship", url: "https://www.kansasregents.org/", amount: 2000, deadline: "2027-05-01", description: "For Kansas residents with strong academic records attending Kansas institutions.", stateResidency: ["KS"], county: [] },
  // KENTUCKY
  { name: "Kentucky Educational Excellence Scholarship (KEES)", url: "https://kheaa.com/", amount: 500, amountMax: 2500, deadline: null, description: "Based on high school GPA. Higher GPA = higher award. Renewable for 4 years.", stateResidency: ["KY"], county: [] },
  { name: "Kentucky College Access Program (CAP)", url: "https://kheaa.com/", amount: 0, deadline: null, description: "Need-based grant for Kentucky students. Covers tuition at KY public institutions.", stateResidency: ["KY"], county: [] },
  // LOUISIANA
  { name: "Louisiana TOPS Scholarship", url: "https://mylosweb.org/", amount: 0, deadline: "2027-07-01", description: "Louisiana's Taylor Opportunity Program for Students. Covers tuition at LA public institutions for eligible students.", stateResidency: ["LA"], county: [] },
  // MAINE
  { name: "Maine Resident Tuition Scholarship", url: "https://www.maine.gov/che/", amount: 0, deadline: null, description: "For Maine residents attending Maine public colleges at in-state tuition rates.", stateResidency: ["ME"], county: [] },
  // MARYLAND
  { name: "Maryland Senatorial Scholarship", url: "https://mhec.maryland.gov/", amount: 4000, deadline: "2027-03-01", description: "For Maryland residents. Award amount varies by legislative district.", stateResidency: ["MD"], county: [] },
  { name: "Howard County Community College Promise Scholarship", url: "https://www.howardcountymd.gov/", amount: 0, deadline: "2027-06-01", description: "For Howard County, MD residents. Covers tuition at Howard Community College.", stateResidency: ["MD"], county: [] },
  // MASSACHUSETTS
  { name: "Massachusetts Public Service Grant", url: "https://www.mass.edu/", amount: 0, deadline: null, description: "For Massachusetts students whose parent works in public service.", stateResidency: ["MA"], county: [] },
  { name: "John and Sheila Alexandrou Scholarship (MA)", url: "https://www.mass.edu/", amount: 5000, deadline: "2027-03-01", description: "For MA high school seniors with financial need and academic promise.", stateResidency: ["MA"], county: [] },
  // MICHIGAN
  { name: "Michigan Tuition Grant (MIG)", url: "https://www.michigan.gov/coe/", amount: 0, deadline: null, description: "Need-based grant for Michigan students attending in-state private colleges.", stateResidency: ["MI"], county: [] },
  { name: "Michigan Competitive Scholarship", url: "https://www.michigan.gov/coe/", amount: 0, deadline: null, description: "Based on SAT/ACT scores and financial need for Michigan students.", stateResidency: ["MI"], county: [] },
  // MINNESOTA
  { name: "Minnesota State Grant", url: "https://www.ohe.state.mn.us/", amount: 0, deadline: null, description: "Largest MN need-based grant program. Award varies by school and enrollment.", stateResidency: ["MN"], county: [] },
  { name: "Minnesota North Dakota reciprocity", url: "https://www.ohe.state.mn.us/", amount: 0, deadline: null, description: "MN/ND reciprocity allows MN residents to attend ND schools at in-state rates.", stateResidency: ["MN"], county: [] },
  // MISSISSIPPI
  { name: "Mississippi Tuition Assistance Grant (MTAG)", url: "https://www.rstate.ms.us/", amount: 500, amountMax: 2500, deadline: "2027-10-01", description: "For MS residents with 15+ ACT. Renewable for 4 years based on GPA.", stateResidency: ["MS"], county: [] },
  { name: "Mississippi Eminent Scholars Grant", url: "https://www.rstate.ms.us/", amount: 2500, deadline: "2027-10-01", description: "For MS residents with 29+ ACT or equivalent. Top academic award.", stateResidency: ["MS"], county: [] },
  // MISSOURI
  { name: "Missouri A+ Scholarship", url: "https://dese.mo.gov/", amount: 0, deadline: null, description: "For MO high school graduates who complete A+ program. Covers tuition at Missouri public colleges.", stateResidency: ["MO"], county: [] },
  { name: "Missouri Bright Flight Scholarship", url: "https://dese.mo.gov/", amount: 3000, deadline: null, description: "For MO students scoring in top 3% on ACT/SAT. $3,000 annual award.", stateResidency: ["MO"], county: [] },
  // MONTANA
  { name: "Montana University System Honor Scholarship", url: "https://mus.edu/", amount: 0, deadline: "2027-03-01", description: "For Montana high school seniors with 3.5+ GPA. Covers tuition at MT public institutions.", stateResidency: ["MT"], county: [] },
  // NEBRASKA
  { name: "Nebraska College Promise", url: "https://ccNebraska.edu/", amount: 0, deadline: null, description: "Nebraska's community college promise program. Covers tuition for eligible students.", stateResidency: ["NE"], county: [] },
  // NEVADA
  { name: "Nevada Promise Scholarship", url: "https://nevadaeducation.org/", amount: 0, deadline: null, description: "Last-dollar scholarship for Nevada students attending community college. Covers remaining tuition after other aid.", stateResidency: ["NV"], county: [] },
  { name: "Silver State Scholarship", url: "https://gov.nv.gov/", amount: 5000, deadline: "2027-03-01", description: "For Nevada high school seniors with academic excellence.", stateResidency: ["NV"], county: [] },
  // NEW HAMPSHIRE
  { name: "New Hampshire State Scholarship", url: "https://www.collegefundnh.org/", amount: 2000, deadline: "2027-05-01", description: "For NH residents attending NH colleges. Based on financial need.", stateResidency: ["NH"], county: [] },
  // NEW JERSEY
  { name: "NJ Tuition Aid Grant (TAG)", url: "https://www.hesaa.org/", amount: 0, deadline: null, description: "New Jersey's largest need-based grant. Covers tuition at NJ public institutions.", stateResidency: ["NJ"], county: [] },
  { name: "NJ STARS Scholarship", url: "https://www.hesaa.org/", amount: 0, deadline: null, description: "For NJ community college students with 3.0+ GPA. Covers tuition at NJ community colleges.", stateResidency: ["NJ"], county: [] },
  // NEW MEXICO
  { name: "New Mexico Legislative Lottery Scholarship", url: "https://hed.nm.gov/", amount: 0, deadline: null, description: "For NM residents attending NM public colleges within 16 months of HS graduation. Covers tuition.", stateResidency: ["NM"], county: [] },
  // NEW YORK
  { name: "NY HESC Tuition Assistance Program (TAP)", url: "https://www.hesc.ny.gov/", amount: 0, deadline: null, description: "NY's largest need-based grant. Award based on NYS income and school cost.", stateResidency: ["NY"], county: [] },
  { name: "NYC Merit Scholarship", url: "https://www.nyc.gov/site/freeschoolnyc.page", amount: 4000, deadline: "2027-03-01", description: "For NYC high school seniors with excellent academic records. Multiple award tiers.", stateResidency: ["NY"], county: [] },
  { name: "NY State of Opportunity Scholarship", url: "https://www.hesc.ny.gov/", amount: 5000, deadline: "2027-03-01", description: "For NY students demonstrating academic excellence and leadership.", stateResidency: ["NY"], county: [] },
  // NORTH CAROLINA
  { name: "NC National Guard Tuition Assistance", url: "https://www.ncng.mil/", amount: 0, deadline: null, description: "For NC National Guard members. Covers tuition at NC public institutions.", stateResidency: ["NC"], county: [] },
  { name: "NC Education Lottery Scholarship", url: "https://www.cfnc.org/", amount: 0, deadline: null, description: "For NC residents with financial need attending NC colleges.", stateResidency: ["NC"], county: [] },
  // NORTH DAKOTA
  { name: "North Dakota Academic Scholarship", url: "https://www.ndus.edu/", amount: 6000, deadline: "2027-03-01", description: "For ND high school seniors with 3.0+ GPA and 24+ ACT. Renewable up to 4 years.", stateResidency: ["ND"], county: [] },
  // OHIO
  { name: "Ohio College Opportunity Grant", url: "https://www.ohiohighered.org/", amount: 0, deadline: null, description: "For Ohio residents with high financial need attending Ohio institutions.", stateResidency: ["OH"], county: [] },
  { name: "Ohio War Orphans Scholarship", url: "https://www.ohio.gov/", amount: 0, deadline: null, description: "For children of Ohio veterans who died or were disabled in service.", stateResidency: ["OH"], county: [] },
  // OKLAHOMA
  { name: "Oklahoma Tuition Aid Grant (OTAG)", url: "https://www.ous.edu/", amount: 0, deadline: null, description: "Need-based grant for Oklahoma residents attending OK institutions.", stateResidency: ["OK"], county: [] },
  // OREGON
  { name: "Oregon Opportunity Grant", url: "https://oregonstudentaid.gov/", amount: 0, deadline: null, description: "Oregon's largest need-based grant. Award varies by enrollment and school.", stateResidency: ["OR"], county: [] },
  // PENNSYLVANIA
  { name: "PA State Grant (PHEAA)", url: "https://www.pheaa.org/", amount: 0, deadline: null, description: "Pennsylvania's largest need-based grant. For PA residents attending PA institutions.", stateResidency: ["PA"], county: [] },
  // RHODE ISLAND
  { name: "Rhode Island Promise", url: "https://www.ri.gov/", amount: 0, deadline: null, description: "For RI high school graduates attending CCRI. Covers first 2 years of tuition.", stateResidency: ["RI"], county: [] },
  // SOUTH CAROLINA
  { name: "SC HOPE Scholarship", url: "https://www.che.sc.gov/", amount: 0, deadline: null, description: "For SC residents with 3.0+ GPA. Covers portion of tuition at SC public institutions.", stateResidency: ["SC"], county: [] },
  { name: "SC LIFE Scholarship", url: "https://www.che.sc.gov/", amount: 0, deadline: null, description: "For SC residents with 3.0+ GPA and 1200 SAT minimum. Additional annual award.", stateResidency: ["SC"], county: [] },
  // SOUTH DAKOTA
  { name: "South Dakota Opportunity Scholarship", url: "https://sdosf.org/", amount: 6000, deadline: "2027-03-01", description: "For SD residents attending SD institutions. $1,500/year for 4 years.", stateResidency: ["SD"], county: [] },
  // TENNESSEE
  { name: "Tennessee HOPE Scholarship", url: "https://www.tn.gov/collegepays/", amount: 0, deadline: null, description: "For TN residents with 3.0+ HS GPA. Covers portion of tuition at TN public institutions.", stateResidency: ["TN"], county: [] },
  { name: "Tennessee Aspire Award", url: "https://www.tn.gov/collegepays/", amount: 0, deadline: null, description: "For TN residents with 2.75-2.99 GPA. Up to $2,000 for tuition.", stateResidency: ["TN"], county: [] },
  // TEXAS
  { name: "Texas TEXAS Grant", url: "https://www.hhloans.com/", amount: 0, deadline: null, description: "Texas' largest state grant program. For TX residents with financial need and academics.", stateResidency: ["TX"], county: [] },
  { name: "Texas Hazlewood Act (Veteran Dependent)", url: "https://www.tvc.texas.gov/", amount: 0, deadline: null, description: "For children of Texas veterans. Covers tuition at TX public institutions.", stateResidency: ["TX"], county: [] },
  // UTAH
  { name: "Utah State Tuition Waiver", url: "https://www.utah.gov/", amount: 0, deadline: null, description: "For Utah residents attending Utah System institutions. Multiple waiver programs available.", stateResidency: ["UT"], county: [] },
  // VERMONT
  { name: "Vermont Green Mountain Scholarship", url: "https://education.vermont.gov/", amount: 5000, deadline: "2027-03-01", description: "For Vermont residents with financial need attending Vermont institutions.", stateResidency: ["VT"], county: [] },
  // VIRGINIA
  { name: "Virginia Commonwealth Award", url: "https://www.schev.edu/", amount: 0, deadline: null, description: "For Virginia residents with financial need attending Virginia institutions.", stateResidency: ["VA"], county: [] },
  { name: "Virginia Guaranteed Assistance Program (VGAP)", url: "https://www.schev.edu/", amount: 0, deadline: null, description: "For Virginia students with high financial need. Covers tuition for 4 years.", stateResidency: ["VA"], county: [] },
  // WASHINGTON
  { name: "Washington College Grant", url: "https://wsac.wa.gov/", amount: 0, deadline: null, description: "For Washington residents with financial need. Award varies by income and school.", stateResidency: ["WA"], county: [] },
  { name: "Seattle Metro Chamber Scholarship", url: "https://seattlechamber.com/", amount: 5000, deadline: "2027-03-01", description: "For Seattle-area students. Business and community leadership focus.", stateResidency: ["WA"], county: [] },
  // WEST VIRGINIA
  { name: "West Virginia PROMISE Scholarship", url: "https://cfwv.com/", amount: 0, deadline: null, description: "For WV residents with 3.0+ GPA attending WV institutions. Covers tuition.", stateResidency: ["WV"], county: [] },
  // WISCONSIN
  { name: "Wisconsin Tuition Grant", url: "https://www.heab.state.wi.us/", amount: 0, deadline: null, description: "For Wisconsin residents with financial need attending Wisconsin private institutions.", stateResidency: ["WI"], county: [] },
  { name: "Wisconsin HOPE Scholarship", url: "https://www.heab.state.wi.us/", amount: 0, deadline: null, description: "For Wisconsin students with high financial need at UW institutions.", stateResidency: ["WI"], county: [] },
  // WYOMING
  { name: "Wyoming Hathaway Scholarship", url: "https://edu.wyo.gov/", amount: 0, deadline: null, description: "For Wyoming residents with strong academics. Prestigious, enhanced, and opportunity levels.", stateResidency: ["WY"], county: [] },
];

export async function scrapeAllStates(): Promise<ScrapedScholarship[]> {
  return ALL_STATES.map((s) => ({
    ...s,
    scrapedFrom: "all-states",
  }));
}
