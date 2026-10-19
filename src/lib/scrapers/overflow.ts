import { ScrapedScholarship } from "./index";

const OVERFLOW: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // Additional HBCU
  { name: "Tuskegee University Institutional Scholarship", url: "https://www.tuskegee.edu/admissions/scholarships", amount: 20000, deadline: "2027-02-01", description: "Institutional scholarships for Tuskegee University undergrads. Merit and need-based.", stateResidency: [], county: [] },
  { name: "Spelman College Merit Scholarship", url: "https://www.spelman.edu/admissions/aid", amount: 25000, deadline: "2027-02-01", description: "Full and partial merit scholarships for Spelman College students.", stateResidency: [], county: [] },
  { name: "Morehouse College King Scholarship", url: "https://www.morehouse.edu/admissions/aid/scholarships", amount: 25000, deadline: "2027-02-01", description: "Full-tuition scholarship for exceptional Morehouse applicants.", stateResidency: [], county: [] },
  { name: "Hampton University Scholarship Program", url: "https://www.hamptonu.edu/admissions/scholarships", amount: 15000, deadline: "2027-03-01", description: "Multiple scholarship tiers for Hampton University incoming students.", stateResidency: [], county: [] },
  { name: "Clark Atlanta University Scholarship", url: "https://www.cau.edu/admissions/scholarships", amount: 15000, deadline: "2027-03-01", description: "Institutional scholarships for CAU undergrads.", stateResidency: [], county: [] },
  // Additional corporate
  { name: "Chick-fil-A Scholars Program", url: "https://www.chick-fil-a.com/college", amount: 25000, deadline: "2027-02-01", description: "For Chick-fil-A team members and dependents. Leadership and community focus.", stateResidency: [], county: [] },
  { name: "Wendy's Scholarship Program", url: "https://www.wendys.com/", amount: 5000, deadline: "2027-02-01", description: "For Wendy's employees and dependents. Multiple award levels.", stateResidency: [], county: [] },
  { name: "Darden Restaurants Scholarship", url: "https://www.darden.com/", amount: 5000, deadline: "2027-02-15", description: "For Darden restaurant employees and dependents.", stateResidency: [], county: [] },
  { name: "Marriott International Scholarship", url: "https://www.marriott.com/", amount: 10000, deadline: "2027-02-01", description: "For hospitality management students. Marriott employee dependents included.", stateResidency: [], county: [] },
  { name: "Hilton Worldwide Scholarship", url: "https://www.hilton.com/", amount: 10000, deadline: "2027-02-01", description: "For hospitality students. Based on academics and industry interest.", stateResidency: [], county: [] },
  // Additional state
  { name: "Georgia Hope Scholarship (Private Colleges)", url: "https://www.gafutures.org/", amount: 3000, deadline: null, description: "Georgia HOPE for private colleges provides $3,000/year for 3.0+ GPA students.", stateResidency: ["GA"], county: [] },
  { name: "Alabama Scholarship for Dependent Children of Veterans", url: "https://www.va.alabama.gov/", amount: 0, deadline: null, description: "For children of Alabama veterans. Covers tuition at Alabama public institutions.", stateResidency: ["AL"], county: [] },
  // Additional easy
  { name: "ScholarshipPoints $5,000 Scholarship", url: "https://www.scholarshippoints.com/", amount: 5000, deadline: null, description: "Earn points by doing activities, redeem for scholarship entries.", stateResidency: [], county: [] },
  { name: "StumbleUpon Scholarship Contest", url: "https://www.stumbleupon.com/", amount: 5000, deadline: null, description: "Simple scholarship drawing. Create a StumbleUpon profile.", stateResidency: [], county: [] },
  { name: "Zamora Scholarship (Hispanic Heritage)", url: "https://www.hispanicheritagemonth.gov/", amount: 5000, deadline: "2027-10-15", description: "For Hispanic students. Essay contest during Hispanic Heritage Month.", stateResidency: [], county: [] },
  { name: "Hispanic Heritage Foundation Leadership Awards", url: "https://hispanicheritage.org/", amount: 1000, deadline: "2027-07-31", description: "Leadership awards for Hispanic students in various categories.", stateResidency: [], county: [] },
  // Additional STEM
  { name: "Intel International Science and Engineering Fair (ISEF) Award", url: "https://www.societyforscience.org/", amount: 5000, deadline: null, description: "For students who competed in Intel ISEF. Multiple award levels.", stateResidency: [], county: [] },
  { name: "Siemens Competition (Math/Science/Technology)", url: "https://www.siemens-foundation.org/", amount: 10000, deadline: "2027-01-15", description: "For high school students in math, science, or technology research.", stateResidency: [], county: [] },
  { name: "Regeneron Science Talent Search (STS)", url: "https://www.regeneron.com/", amount: 25000, deadline: "2027-01-15", description: "Top science competition for high school seniors. Up to $250,000 awards.", stateResidency: [], county: [] },
  { name: "Davidson Institute Scholarship", url: "https://www.davidsoninstitutes.org/", amount: 5000, deadline: "2027-02-01", description: "For profoundly gifted students. Multiple award levels.", stateResidency: [], county: [] },
  // Additional professional
  { name: "American Dental Education Association (ADEA) Scholarship", url: "https://www.adea.org/", amount: 5000, deadline: "2027-02-15", description: "For dental school students. Based on academic achievement.", stateResidency: [], county: [] },
  { name: "American Library Association (ALA) Scholarship", url: "https://www.ala.org/", amount: 5000, deadline: "2027-02-01", description: "For library science and information studies students.", stateResidency: [], county: [] },
  { name: "Society of Professional Engineers (NSPE) Future Engineers Scholarship", url: "https://www.nspe.org/", amount: 5000, deadline: "2027-02-01", description: "For engineering students. Based on engineering potential.", stateResidency: [], county: [] },
  // Additional local Broward
  { name: "Miramar Regional Library Scholarship", url: "https://www.broward.org/Library/", amount: 500, deadline: "2027-04-01", description: "For Miramar library patrons pursuing higher education.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Broward County Library Staff Scholarship", url: "https://www.broward.org/Library/", amount: 1000, deadline: "2027-04-01", description: "For Broward County residents pursuing library science or education.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Hallandale Beach Chamber Scholarship", url: "https://www.hallandalebeach.org/", amount: 1000, deadline: "2027-04-01", description: "For Hallandale Beach and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Dania Beach Chamber Scholarship", url: "https://www.daniabeach.org/", amount: 1000, deadline: "2027-04-01", description: "For Dania Beach area students pursuing higher education.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Pompano Beach Chamber Scholarship", url: "https://www.pompano.org/", amount: 1000, deadline: "2027-04-01", description: "For Pompano Beach area students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Lauderdale Lakes Educational Advisory Committee Scholarship", url: "https://www.lauderdalelakes.org/", amount: 1000, deadline: "2027-04-01", description: "For Lauderdale Lakes residents pursuing higher education.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Oakland Park Education Scholarship", url: "https://oaklandparkfl.gov/", amount: 1000, deadline: "2027-04-01", description: "For Oakland Park residents. Based on academics and community service.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Wilton Manors Community Scholarship", url: "https://www.wiltonmanors.com/", amount: 1000, deadline: "2027-04-01", description: "For Wilton Manors and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Coconut Creek Chamber Scholarship", url: "https://www.coconutcreek.net/", amount: 1000, deadline: "2027-04-01", description: "For Coconut Creek and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Margate Chamber Scholarship", url: "https://www.margate.com/", amount: 1000, deadline: "2027-04-01", description: "For Margate and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Tamarac Chamber Scholarship", url: "https://www.tamarac.org/", amount: 1000, deadline: "2027-04-01", description: "For Tamarac and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  { name: "Deerfield Beach Chamber Scholarship", url: "https://www.deerfield-beach.com/", amount: 1000, deadline: "2027-04-01", description: "For Deerfield Beach and Broward County students.", stateResidency: ["FL"], county: ["Broward"] },
  // Additional national
  { name: "AFL-CIO Union Scholarship", url: "https://www.aflcio.org/", amount: 5000, deadline: "2027-03-01", description: "For union members and dependents. Multiple union-sponsored awards.", stateResidency: [], county: [] },
  { name: "International Union of Operating Engineers Scholarship", url: "https://www.iuoe.org/", amount: 5000, deadline: "2027-03-01", description: "For dependents of IUOE union members.", stateResidency: [], county: [] },
  { name: "Laborers' International Union of North America Scholarship", url: "https://www.liuna.org/", amount: 5000, deadline: "2027-03-01", description: "For LIUNA union member dependents.", stateResidency: [], county: [] },
  { name: "Teamsters Union Scholarship", url: "https://teamsters.org/", amount: 5000, deadline: "2027-03-01", description: "For Teamster family members pursuing higher education.", stateResidency: [], county: [] },
  { name: "Actors' Equity Foundation Scholarship", url: "https://www.actorsequity.org/", amount: 5000, deadline: "2027-02-01", description: "For theatrical arts students. Based on talent and need.", stateResidency: [], county: [] },
  { name: "American Society of Composers, Authors and Publishers (ASCAP) Scholarship", url: "https://www.ascap.com/", amount: 5000, deadline: "2027-02-01", description: "For music composition and songwriting students.", stateResidency: [], county: [] },
  { name: "Recording Academy (Grammy) Scholarship", url: "https://www.grammy.com/", amount: 10000, deadline: "2027-02-15", description: "For music industry students. Multiple scholarship programs.", stateResidency: [], county: [] },
  { name: "United Nations Scholarship Program", url: "https://www.un.org/scholarships", amount: 10000, deadline: "2027-02-01", description: "For students committed to international relations and diplomacy.", stateResidency: [], county: [] },
];

export async function scrapeOverflow(): Promise<ScrapedScholarship[]> {
  return OVERFLOW.map((s) => ({
    ...s,
    scrapedFrom: "overflow",
  }));
}
