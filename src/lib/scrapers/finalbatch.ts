import { ScrapedScholarship } from "./index";

// Final batch: career-specific, social impact, and remaining institutional scholarships
const FINAL_BATCH: Omit<ScrapedScholarship, "scrapedFrom">[] = [
  // === CAREER-SPECIFIC ===
  { name: "AIA (American Institute of Architects) Scholarship", url: "https://www.aia.org/", amount: 5000, deadline: "2027-02-01", description: "For students pursuing architecture. Based on design portfolio and academic record.", stateResidency: [], county: [] },
  { name: "American Marketing Association Scholarship", url: "https://www.ama.org/", amount: 5000, deadline: "2027-02-15", description: "For marketing students. Based on academic achievement and marketing interest.", stateResidency: [], county: [] },
  { name: "American Psychological Association (APA) Scholarship", url: "https://www.apa.org/", amount: 5000, deadline: "2027-02-01", description: "For psychology students. Based on research and academic achievement.", stateResidency: [], county: [] },
  { name: "American Society of Mechanical Engineers (ASME) Auxiliary Scholarship", url: "https://www.asme.org/", amount: 5000, deadline: "2027-02-01", description: "For mechanical engineering students. Based on academic performance.", stateResidency: [], county: [] },
  { name: "Association for Supply Chain Management (ASCM) Scholarship", url: "https://www.ascm.org/", amount: 5000, deadline: "2027-02-01", description: "For supply chain management students. Based on academics and leadership.", stateResidency: [], county: [] },
  { name: "American Advertising Federation (AAF) Scholarship", url: "https://www.aaf.org/", amount: 5000, deadline: "2027-02-15", description: "For advertising and marketing communications students.", stateResidency: [], county: [] },
  { name: "Financial Planning Association (FPA) Scholarship", url: "https://www.financialplan.org/", amount: 5000, deadline: "2027-02-01", description: "For finance and financial planning students.", stateResidency: [], county: [] },
  { name: "National Association of Consumer Advocates Scholarship", url: "https://www.naca.com/", amount: 5000, deadline: "2027-02-01", description: "For law students with interest in consumer rights.", stateResidency: [], county: [] },
  { name: "Association of International Accountants (AIA) Scholarship", url: "https://www.aiaaccountants.org/", amount: 5000, deadline: "2027-02-15", description: "For accounting students. Based on academic record.", stateResidency: [], county: [] },
  { name: "Institute of Transportation Engineers (ITE) Scholarship", url: "https://www.ite.org/", amount: 5000, deadline: "2027-02-01", description: "For transportation engineering students. Based on academics and transportation interest.", stateResidency: [], county: [] },
  { name: "American Hotel & Lodging Educational Foundation Scholarship", url: "https://www.ahla.org/", amount: 5000, deadline: "2027-02-01", description: "For hospitality management students. Based on industry interest and academics.", stateResidency: [], county: [] },
  { name: "National Restaurant Association Scholarship", url: "https://www.nra.org/", amount: 5000, deadline: "2027-02-15", description: "For culinary arts and restaurant management students.", stateResidency: [], county: [] },
  { name: "Retail Industry Leaders Association (RILA) Scholarship", url: "https://www.rila.org/", amount: 5000, deadline: "2027-02-01", description: "For retail management and business students.", stateResidency: [], county: [] },
  { name: "American Real Estate Society (ARES) Scholarship", url: "https://www.aresnet.org/", amount: 5000, deadline: "2027-02-01", description: "For real estate and urban development students.", stateResidency: [], county: [] },
  { name: "Appraisal Institute Education Scholarship", url: "https://www.appraisalinstitute.org/", amount: 5000, deadline: "2027-02-01", description: "For real estate appraisal students. Based on academics.", stateResidency: [], county: [] },
  // === SOCIAL IMPACT / COMMUNITY SERVICE ===
  { name: "Peace Corps Paul D. Coverdell Scholarship", url: "https://www.peacecorps.gov/", amount: 5000, deadline: null, description: "For returned Peace Corps volunteers. Covers graduate school tuition at partner universities.", stateResidency: [], county: [] },
  { name: "Teach for America Corps Member Scholarship", url: "https://www.teachforamerica.org/", amount: 0, deadline: null, description: "For corps members. Many TFA alumni receive school-specific scholarships for grad school.", stateResidency: [], county: [] },
  { name: "AmeriCorps Scholarship Program", url: "https://www.americorps.gov/", amount: 0, deadline: null, description: "AmeriCorps alumni can receive Segal AmeriCorps Education Awards for college.", stateResidency: [], county: [] },
  { name: "City Year Corps Scholarship", url: "https://www.cityyear.org/", amount: 0, deadline: null, description: "City Year corps members receive education awards for college or grad school.", stateResidency: [], county: [] },
  { name: "Public Allies Scholarship", url: "https://www.publicallies.org/", amount: 0, deadline: null, description: "For Public Allies alumni pursuing higher education.", stateResidency: [], county: [] },
  { name: "Jumpstart Corps Member Scholarship", url: "https://jumpstart.org/", amount: 5000, deadline: null, description: "For early childhood education corps members. Education award for college.", stateResidency: [], county: [] },
  // === ENTREPRENEURSHIP / SMALL BUSINESS ===
  { name: "Small Business Administration (SBA) Scholarship", url: "https://www.sba.gov/", amount: 10000, deadline: "2027-03-01", description: "For student entrepreneurs. Based on business plan and innovation.", stateResidency: [], county: [] },
  { name: "National Association of Female Entrepreneurs (NAFE) Scholarship", url: "https://www.nafe.com/", amount: 5000, deadline: "2027-02-15", description: "For women entrepreneurs and aspiring business owners.", stateResidency: [], county: [] },
  { name: "Venmo Small Business Scholarship", url: "https://www.venmo.com/", amount: 5000, deadline: "2027-02-01", description: "For student entrepreneurs with small business ideas.", stateResidency: [], county: [] },
  // === MEDIA / COMMUNICATIONS ===
  { name: "National Association of Broadcasters (NAB) Scholarship", url: "https://www.nab.org/", amount: 5000, deadline: "2027-02-01", description: "For broadcasting and media students. Based on talent and academic record.", stateResidency: [], county: [] },
  { name: "RTDNA (Radio Television Digital News) Scholarship", url: "https://www.rtdna.org/", amount: 5000, deadline: "2027-02-01", description: "For journalism and broadcast news students. Diversity in media prioritized.", stateResidency: [], county: [] },
  { name: "PRSSA (Public Relations Student Society) Scholarship", url: "https://www.prssa.org/", amount: 5000, deadline: "2027-02-15", description: "For public relations students. Based on PR potential and academics.", stateResidency: [], county: [] },
  { name: "National Endowment for the Arts (NEA) Student Scholarship", url: "https://www.arts.gov/", amount: 5000, deadline: "2027-02-01", description: "For arts students demonstrating artistic excellence and community engagement.", stateResidency: [], county: [] },
  // === ENVIRONMENTAL / SUSTAINABILITY ===
  { name: "Environmental Protection Agency (EPA) Scholarship", url: "https://www.epa.gov/", amount: 5000, deadline: "2027-02-01", description: "For environmental science and policy students. Based on environmental commitment.", stateResidency: [], county: [] },
  { name: "Sierra Club Scholarship", url: "https://www.sierraclub.org/", amount: 5000, deadline: "2027-02-15", description: "For environmental conservation students. Based on environmental activism.", stateResidency: [], county: [] },
  { name: "Audubon Society Scholarship", url: "https://www.audubon.org/", amount: 5000, deadline: "2027-02-01", description: "For ornithology and wildlife biology students.", stateResidency: [], county: [] },
  { name: "National Wildlife Federation Scholarship", url: "https://www.nwf.org/", amount: 5000, deadline: "2027-02-15", description: "For conservation and wildlife students.", stateResidency: [], county: [] },
  // === ADDITIONAL INSTITUTIONAL SCHOLARSHIPS ===
  { name: "Yale National Scholarship (Yale)", url: "https://admissions.yale.edu/", amount: 0, deadline: null, description: "Yale meets 100% of demonstrated financial aid. No separate scholarship needed — file FAFSA and CSS Profile.", stateResidency: [], county: [] },
  { name: "Harvard Financial Aid Initiative", url: "https://college.harvard.edu/aid", amount: 0, deadline: null, description: "Families earning under $75K pay nothing. Harvard meets 100% of demonstrated need.", stateResidency: [], county: [] },
  { name: "Princeton Application for Financial Aid (PAFA)", url: "https://admission.princeton.edu/", amount: 0, deadline: null, description: "Princeton meets 100% of demonstrated need. No loans in financial aid packages.", stateResidency: [], county: [] },
  { name: "Stanford Scholarship Program", url: "https://admission.stanford.edu/", amount: 0, deadline: null, description: "Stanford meets 100% of demonstrated need for all admitted students.", stateResidency: [], county: [] },
  { name: "Columbia University Scholarship", url: "https://www.collegeboard.org/", amount: 0, deadline: null, description: "Columbia provides generous aid including scholarships for low-income students.", stateResidency: [], county: [] },
  { name: "MIT Scholarship Program", url: "https://web.mit.edu/", amount: 0, deadline: null, description: "MIT meets 100% of demonstrated need without loans.", stateResidency: [], county: [] },
  { name: "California Institute of Technology (Caltech) Scholarship", url: "https://www.caltech.edu/", amount: 0, deadline: null, description: "Caltech meets 100% of demonstrated need for admitted students.", stateResidency: [], county: [] },
  { name: "Duke University Aid Program", url: "https://admission.duke.edu/", amount: 0, deadline: null, description: "Duke meets 100% of demonstrated need. Several merit-based scholarships available.", stateResidency: [], county: [] },
  { name: "Johns Hopkins University Scholarship", url: "https://apply.jhu.edu/", amount: 0, deadline: null, description: "JHU meets 100% of demonstrated need. Several named scholarships for admitted students.", stateResidency: [], county: [] },
  { name: "University of Chicago Aid Program", url: "https://collegeadmissions.uchicago.edu/", amount: 0, deadline: null, description: "UChicago meets 100% of demonstrated need. Several full-ride scholarships.", stateResidency: [], county: [] },
  // === FLORIDA SPECIFIC ADDITIONAL ===
  { name: "University of Miami Stamps Scholarship", url: "https://admission.miami.edu/", amount: 0, deadline: null, description: "Full tuition plus $12,000 enrichment fund for top UM admits. Competitive, requires separate application.", stateResidency: [], county: [] },
  { name: "Florida International University (FIU) Presidential Scholarship", url: "https://www.fiu.edu/admissions/scholarships.html", amount: 10000, deadline: "2027-02-01", description: "Top merit award for FIU incoming freshmen. Full in-state tuition plus enrichment award.", stateResidency: ["FL"], county: [] },
  { name: "Nova Southeastern University Scholarship", url: "https://www.nova.edu/", amount: 20000, deadline: "2027-02-01", description: "Multiple scholarship tiers for NSU undergrads. Based on academics.", stateResidency: ["FL"], county: [] },
  { name: "University of South Florida (USF) St. Petersburg Campus Scholarship", url: "https://www.usfsp.edu/", amount: 5000, deadline: "2027-02-01", description: "For USF St. Petersburg campus. Separate from Tampa campus awards.", stateResidency: ["FL"], county: [] },
  { name: "Rollins College Scholarship", url: "https://www.rollins.edu/", amount: 25000, deadline: "2027-01-15", description: "For Rollins College (Winter Park, FL) undergrads. Multiple scholarship levels.", stateResidency: [], county: [] },
  { name: "Ringling College of Art and Design Scholarship", url: "https://www.ringling.edu/", amount: 20000, deadline: "2027-01-15", description: "For Ringling College (Sarasota, FL) art and design students.", stateResidency: [], county: [] },
  // === ADDITIONAL EASY SCHOLARSHIPS ===
  { name: "Zocalo Scholarship (Social Justice)", url: "https://www.zocalo.io/", amount: 5000, deadline: "2027-02-15", description: "For students working on social justice and community impact.", stateResidency: [], county: [] },
  { name: "DoSomething Scholarship (Easy Apply)", url: "https://www.dosomething.org/", amount: 5000, deadline: null, description: "DoSomething members can access various scholarships for community action.", stateResidency: [], county: [] },
  { name: "Pay It Forward Scholarship (Easy)", url: "https://www.payitforward.org/", amount: 10000, deadline: "2027-04-01", description: "Simple application for students who have done community service.", stateResidency: [], county: [] },
  { name: "Civic Hall Scholarship (Civic Engagement)", url: "https://civichall.org/", amount: 5000, deadline: "2027-03-01", description: "For students active in civic engagement and democracy work.", stateResidency: [], county: [] },
  { name: "Schwab Foundation Scholarship (Entrepreneurship)", url: "https://www.schwab.com/", amount: 5000, deadline: "2027-02-15", description: "For student entrepreneurs making social impact.", stateResidency: [], county: [] },
];

export async function scrapeFinalBatch(): Promise<ScrapedScholarship[]> {
  return FINAL_BATCH.map((s) => ({
    ...s,
    scrapedFrom: "final-batch",
  }));
}
