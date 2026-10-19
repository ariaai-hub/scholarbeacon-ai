import { ScrapedScholarship } from "./index";

// No-essay, easy apply, and local Miramar/Broward-specific scholarships
const EASY_LOCAL: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === NO ESSAY / EASY APPLY ===
  { name: "$10,000 Scholarship — No Essay Required", url: "https://www.scholarships.com/", amount: 10000, deadline: "2027-06-30", description: "Simple drawing scholarship. No essay required. Open to all students.", stateResidency: [], county: [] },
  { name: "$5,000 Scholarship — No Essay (Monthly Drawings)", url: "https://www.scholarships.com/apply", amount: 5000, deadline: null, description: "Monthly scholarship drawings. No essay, no GPA requirements. Enter in under 2 minutes.", stateResidency: [], county: [] },
  { name: "Scholly — Automated Matching", url: "https://myscholly.com/", amount: 0, deadline: null, description: "Free scholarship matching platform. Answer questions once, get matched to 100+ scholarships.", stateResidency: [], county: [] },
  { name: "Going Merry — One Application, Many Matches", url: "https://www.goingmerry.com/", amount: 0, deadline: null, description: "Free platform. One profile = matched to thousands of scholarships.", stateResidency: [], county: [] },
  { name: "Cappex Scholarship Search", url: "https://www.cappex.com/scholarships", amount: 0, deadline: null, description: "Free scholarship database. Create profile and get matched to scholarships.", stateResidency: [], county: [] },
  { name: "Fastweb Scholarship Database", url: "https://www.fastweb.com/", amount: 0, deadline: null, description: "Free scholarship matching. Filter by GPA, major, state, ethnicity.", stateResidency: [], county: [] },
  { name: "Chegg Scholarships", url: "https://www.chegg.com/scholarships/", amount: 0, deadline: null, description: "Access thousands of scholarships. Free profile matching.", stateResidency: [], county: [] },
  { name: "$2,000 No-Essay Scholarship (Sallie)", url: "https://www.sallie.com/scholarships/no-essay/", amount: 2000, deadline: "2026-10-31", description: "Monthly $2,000 drawings. No essay, no account required.", stateResidency: [], county: [] },
  { name: "$1,000 Weekly Easy Entry Scholarship", url: "https://www.scholarships.com/weekly", amount: 1000, deadline: null, description: "Weekly drawings. Simple one-page application.", stateResidency: [], county: [] },
  { name: "CollegeBoard Scholarship Search", url: "https://bigfuture.collegeboard.org/scholarship-search", amount: 0, deadline: null, description: "Free database of 12,000+ scholarships. Filter by profile.", stateResidency: [], county: [] },
  { name: "$5,000 Cappex Easy App Scholarship", url: "https://www.cappex.com/scholarships", amount: 5000, deadline: null, description: "Easy application for multiple scholarships at once through Cappex.", stateResidency: [], county: [] },
  { name: "Niche $50,000 No-Essay Scholarship", url: "https://www.niche.com/colleges/scholarships/50k-no-essay-scholarship-2026/", amount: 50000, deadline: "2026-12-31", description: "Random drawing for $50,000. No essay. Download Niche app for bonus entry.", stateResidency: [], county: [] },
  // === MIRAMAR / BROWARD LOCAL ===
  { name: "Miramar Housing Authority Youth Scholarship", url: "https://www.miramarfl.gov/", amount: 1000, deadline: "2027-04-01", description: "For Miramar HA youth participants. Education advancement focus.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Miramar Optimist Club Scholarship", url: "https://www.optimist.org/", amount: 1000, deadline: "2027-04-01", description: "For Miramar/Broward youth. Essay contest on community involvement.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Miramar Lions Club Scholarship", url: "https://www.lionsclubs.org/", amount: 1000, deadline: "2027-04-01", description: "For Miramar area students with vision and health-related service.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Miramar Kiwanis Club Scholarship", url: "https://www.kiwanis.org/", amount: 1000, deadline: "2027-04-01", description: "For Miramar high school seniors. Service and leadership focus.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Miramar Rotary Club Scholarship", url: "https://www.rotary.org/", amount: 2000, deadline: "2027-04-01", description: "For Miramar area students. Leadership and community service.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Pembroke Pines Rotary Club Scholarship", url: "https://www.rotary.org/", amount: 1000, deadline: "2027-04-01", description: "For Pembroke Pines and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Hollywood Hills Alumni Association Scholarship", url: "https://www.browardschools.com/HollywoodHillsHigh", amount: 500, deadline: "2027-04-15", description: "For Hollywood Hills High School seniors. Alumni-supported.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "McArthur High School Alumni Scholarship (Miramar)", url: "https://www.browardschools.com/McArthurHigh", amount: 500, deadline: "2027-04-15", description: "For McArthur High School seniors in Miramar.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Everglades High School PTSA Scholarship", url: "https://www.browardschools.com/EvergladesHigh", amount: 500, deadline: "2027-04-15", description: "For Everglades High School seniors. PTSA-supported.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Broward County Schools Foundation Scholarship", url: "https://www.browardschools.com/", amount: 2000, deadline: "2027-03-15", description: "For Broward County Public Schools graduating seniors. Multiple awards.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "City of Pembroke Pines Education Grant", url: "https://wwwppines.com/", amount: 1000, deadline: "2027-04-01", description: "For Pembroke Pines residents pursuing higher education.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Miramar Jaycees Scholarship", url: "https://www.usjaycees.org/", amount: 1000, deadline: "2027-04-01", description: "For young Miramar leaders aged 18-35. Leadership focus.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Broward County Tax Collector Scholarship", url: "https://www.browardcounty.net/", amount: 1000, deadline: "2027-04-01", description: "For Broward County students with academic merit.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Sheriff's Association of Broward County Scholarship", url: "https://www.browardsheriff.org/", amount: 2000, deadline: "2027-03-15", description: "For Broward County students with community involvement.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Broward County Bar Association Scholarship", url: "https://www.browardbar.org/", amount: 2500, deadline: "2027-04-01", description: "For Broward students pursuing law or legal studies.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Florida Memorial University Community Scholarship", url: "https://www.floridamemorialuniversity.edu/", amount: 5000, deadline: "2027-04-01", description: "For students attending or planning to attend Florida Memorial University (HBCU in Miami).", stateResidency: ["FL"], county: ["Broward"] },
  // === ADDITIONAL HIGH-VALUE NATIONAL ===
  { name: "Coca-Cola Scholars Foundation (All Disciplines)", url: "https://www.coca-colascholars.org/apply", amount: 20000, deadline: "2027-10-31", description: "150 awards of $20,000 each. Leadership and community service focus. All majors.", stateResidency: [], county: [] },
  { name: "Anne Ford Scholarship (Learning Disability)", url: "https://www.ahead.org/associations/ahead/resources/anne-ford-scholarship", amount: 10000, deadline: "2027-01-15", description: "$10,000 for HS seniors with documented learning disability. Self-advocacy and academics.", stateResidency: [], county: [] },
  { name: "Pearl Insurance Scholarship (Simple App)", url: "https://www.pearlinsurance.com/scholarship", amount: 1000, deadline: "2027-08-01", description: "Simple application. No GPA or major requirements.", stateResidency: [], county: [] },
  { name: "Course Hero Monthly Scholarship", url: "https://www.coursehero.com/scholarships/", amount: 500, deadline: null, description: "Monthly drawings. Upload study materials to earn entries.", stateResidency: [], county: [] },
  { name: "Mighty Day Scholarship (No Requirements)", url: "https://www.scholarships.com/", amount: 2000, deadline: null, description: "Simple drawing scholarship. No requirements.", stateResidency: [], county: [] },
  { name: "OppU Scholarship (Credit Score Contest)", url: "https://www.opploans.com/scholarship/", amount: 2500, deadline: null, description: "Simple drawing. No GPA, income, or essay requirements.", stateResidency: [], county: [] },
  { name: "Student Scholarship Search Engine (SuperMoney)", url: "https://www.supermoney.com/scholarships/", amount: 0, deadline: null, description: "Free searchable database of 100,000+ scholarships.", stateResidency: [], county: [] },
  { name: "ValueLine Scholarship Program", url: "https://www.valueline.com/", amount: 2000, deadline: "2027-01-31", description: "For students demonstrating financial need and academic merit.", stateResidency: [], county: [] },
  { name: "Bold.org Free Scholarship Platform", url: "https://bold.org/", amount: 0, deadline: null, description: "Free scholarship platform with curated list of applications. Simple apply process.", stateResidency: [], county: [] },
  { name: "Scholarship Owl Platform", url: "https://www.scholarshipowl.com/", amount: 0, deadline: null, description: "Auto-apply to multiple scholarships with one form. Free for students.", stateResidency: [], county: [] },
  { name: "TeenLife Scholarship Database", url: "https://www.teenlife.com/scholarships/", amount: 0, deadline: null, description: "Curated scholarships for motivated students. All experience levels.", stateResidency: [], county: [] },
  // === GEEKLY / TECH APPLY ===
  { name: "#YouAreHere Scholarship (Tumblr)", url: "https://www.tumblr.com/scholarship", amount: 1000, deadline: "2027-04-01", description: "Simple social media scholarship. Create a post about your community.", stateResidency: [], county: [] },
  { name: "College Ave Scholarship Contest", url: "https://www.collegeave.com/", amount: 1000, deadline: null, description: "Monthly drawings for current college students. Simple application.", stateResidency: [], county: [] },
  { name: "Discover Student Loans Scholarship", url: "https://www.discover.com/student-loans/scholarship.html", amount: 5000, deadline: null, description: "Monthly $5,000 drawings. No essay required.", stateResidency: [], county: [] },
  { name: "Commonwealth Scholarship (PA)", url: "https://www.pheaa.org/", amount: 5000, deadline: "2027-03-01", description: "For PA students attending Pennsylvania colleges.", stateResidency: ["PA"], county: [] },
  { name: "Imagine America Foundation Scholarship", url: "https://imagineamerica.org/", amount: 1000, deadline: "2027-03-01", description: "For career college students. Simple application process.", stateResidency: [], county: [] },
  { name: "Rentalutions Scholarship", url: "https://www.rent.com/scholarship", amount: 1000, deadline: "2027-04-01", description: "Essay contest about financial literacy or renting. $1,000 award.", stateResidency: [], county: [] },
  { name: "Simplegraduate Scholarship", url: "https://www.simplegraduate.com/", amount: 5000, deadline: null, description: "Monthly drawings for college students. No requirements.", stateResidency: [], county: [] },
  { name: "Next Gen Personal Finance Scholarship", url: "https://www.ngpf.org/scholarship", amount: 2500, deadline: "2027-04-15", description: "For students completing financial literacy curriculum.", stateResidency: [], county: [] },
  { name: "Tello VoIP Scholarship", url: "https://www.tello.com/scholarship", amount: 1000, deadline: "2027-04-01", description: "For students in business or technology. Simple application.", stateResidency: [], county: [] },
  { name: "StudySoup Scholarship Contest", url: "https://studysoup.com/scholarship", amount: 1000, deadline: null, description: "For students who share study guides. Multiple awards.", stateResidency: [], county: [] },
  { name: "Graduate Record Exam (GRE) Waiver Program", url: "https://www.ets.org/gre/revised_general/about/fees/gre_fee_reduction.html", amount: 0, deadline: null, description: "For low-income students. Reduction in GRE test fees.", stateResidency: [], county: [] },
];

export async function scrapeEasyAndLocal(): Promise<ScrapedScholarship[]> {
  return EASY_LOCAL.map((s) => ({
    ...s,
    scrapedFrom: "easy-local",
  }));
}
