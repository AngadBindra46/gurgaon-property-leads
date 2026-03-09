require("dotenv").config();
const db = require("./db");

const buyers = [
  // Model Town — Premium Residential
  { name: "Harpreet Singh Gill", phone: "9814012345", email: "harpreet.gill@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Model Town", budgetMin: 15000000, budgetMax: 30000000, timeline: "1-3 months", status: "interested", source: "99acres", projects: "Model Town Extension, Sarabha Nagar side", notes: "Industrialist family. Wants kothi with basement. Minimum 300 sq yard. Prefers Model Town Extension." },
  { name: "Neelam Bhatia", phone: "9876543211", email: "neelam.bhatia@yahoo.com", leadType: "buyer", propertyType: "3BHK", area: "Model Town", budgetMin: 8000000, budgetMax: 15000000, timeline: "3-6 months", status: "site-visit", source: "Housing.com", projects: "Maya Garden City, Omaxe North", notes: "Doctor couple. Want flat in gated society with club. Kids in BCM School. Close to DMC Hospital preferred." },

  // Sarabha Nagar — Elite
  { name: "Gurpreet Kaur Sandhu", phone: "9815678901", email: "gurpreet.sandhu@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Sarabha Nagar", budgetMin: 30000000, budgetMax: 60000000, timeline: "Immediately", status: "negotiating", source: "Client Referral", notes: "NRI family from Canada. Want large kothi for retirement. 500+ sq yard. Ready to pay cash. Needs power backup." },
  { name: "Rajiv Aggarwal", phone: "9878123456", email: "rajiv.ag@hotmail.com", leadType: "buyer", propertyType: "5BHK+", area: "Sarabha Nagar", budgetMin: 40000000, budgetMax: 80000000, timeline: "3-6 months", status: "interested", source: "Builder Referral", notes: "Joint family. Hosiery business owner. Wants independent house with showroom space on ground floor." },

  // BRS Nagar — Mid-Premium
  { name: "Amandeep Singh", phone: "9814567890", email: "aman.deep@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "BRS Nagar", budgetMin: 6000000, budgetMax: 12000000, timeline: "1-3 months", status: "new", source: "Facebook Ads", projects: "SBP Group, Savitry Towers", notes: "IT professional working remotely for Bangalore company. First-time buyer. Needs good internet area." },
  { name: "Manpreet Kaur", phone: "9876012345", email: "manpreet.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "BRS Nagar", budgetMin: 4000000, budgetMax: 7000000, timeline: "6-12 months", status: "contacted", source: "Public Form", notes: "School teacher at Kundan Vidya Mandir. Single. Wants safe gated community. Home loan pre-approved from SBI." },

  // Dugri — Affordable Residential
  { name: "Vikramjit Singh", phone: "9872345678", email: "vikram.jit@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Dugri", budgetMin: 3000000, budgetMax: 5500000, timeline: "Immediately", status: "new", source: "WhatsApp", notes: "Auto parts dealer. Wants ready possession flat. Family of 4. Close to Dugri Phase 2 market." },
  { name: "Sunita Rani", phone: "9815234567", email: "sunita.rani@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Dugri", budgetMin: 5000000, budgetMax: 8000000, timeline: "3-6 months", status: "contacted", source: "Landing Page", notes: "Upgrading from 2BHK. Husband works in Focal Point. Kids in Sacred Heart School. Wants park-facing." },

  // Pakhowal Road — Commercial Hub
  { name: "Rohit Jain", phone: "9878901234", email: "rohit.jain.ldh@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Pakhowal Road", budgetMin: 20000000, budgetMax: 40000000, timeline: "1-3 months", status: "site-visit", source: "99acres", notes: "Wants showroom space 3000-5000 sq ft on Pakhowal Road. Furniture business expansion. Ground floor mandatory." },
  { name: "Deepak Mittal", phone: "9814098765", email: "deepak.mittal@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Pakhowal Road", budgetMin: 10000000, budgetMax: 20000000, timeline: "3-6 months", status: "interested", source: "Housing.com", notes: "Wants office space for CA firm. 1500-2500 sq ft. Needs lift and parking. SCO preferred." },

  // Ferozepur Road — Growth Corridor
  { name: "Jaspal Singh", phone: "9876789012", email: "jaspal.singh@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ferozepur Road", budgetMin: 5000000, budgetMax: 10000000, timeline: "3-6 months", status: "new", source: "Facebook Ads", projects: "Maya Garden Magnesia, Motiaz Royal Citi", notes: "Government employee. PNB manager. Home loan sanctioned. Wants society with temple and community hall." },
  { name: "Kamaljeet Kaur", phone: "9815890123", email: "kamal.kaur@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Ferozepur Road", budgetMin: 8000000, budgetMax: 15000000, timeline: "Immediately", status: "negotiating", source: "Client Referral", notes: "Wants residential plot 200-300 sq yard near Ferozepur Road. Plans to build kothi. Clear title essential." },

  // Civil Lines — Heritage Area
  { name: "Rakesh Khanna", phone: "9872567890", email: "rakesh.khanna@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Civil Lines", budgetMin: 25000000, budgetMax: 50000000, timeline: "6-12 months", status: "interested", source: "99acres", notes: "Advocate at Punjab & Haryana High Court (Ludhiana bench). Wants heritage-style kothi. Near District Courts." },

  // Haibowal — Emerging
  { name: "Parvinder Singh", phone: "9814345678", email: "parvinder.s@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Haibowal", budgetMin: 2500000, budgetMax: 4500000, timeline: "1-3 months", status: "new", source: "Public Form", notes: "Factory worker at Haibowal Dairy Complex. First home. PMAY subsidy eligible. Wants affordable flat." },
  { name: "Gurdeep Kaur", phone: "9876345612", email: "gurdeep.k@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Haibowal", budgetMin: 4000000, budgetMax: 7000000, timeline: "3-6 months", status: "contacted", source: "WhatsApp", notes: "Husband runs transport business. Wants ground floor with parking for truck. Near Haibowal main road." },

  // Focal Point — Industrial/Commercial
  { name: "Amit Singla", phone: "9878234567", email: "amit.singla@company.com", leadType: "buyer", propertyType: "Commercial", area: "Focal Point", budgetMin: 15000000, budgetMax: 30000000, timeline: "Immediately", status: "negotiating", source: "Builder Referral", notes: "Hosiery manufacturer. Needs industrial shed 10000 sq ft in Focal Point. Power 100 KVA minimum." },
  { name: "Navdeep Brar", phone: "9815456789", email: "navdeep.brar@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Focal Point", budgetMin: 8000000, budgetMax: 18000000, timeline: "1-3 months", status: "interested", source: "99acres", notes: "Cycle parts manufacturer. Wants plot in Focal Point Phase 5. Will build factory. PSIEC allotment also okay." },

  // Chandigarh Road — Premium Growth
  { name: "Simran Dhillon", phone: "9872890123", email: "simran.dhillon@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Chandigarh Road", budgetMin: 7000000, budgetMax: 13000000, timeline: "3-6 months", status: "site-visit", source: "Housing.com", projects: "Omaxe Royal Residency, Hero Homes", notes: "IT couple. Both work in Chandigarh, want midway location. Gated society with modern amenities." },
  { name: "Balwinder Singh", phone: "9814678901", email: "balwinder.s@yahoo.com", leadType: "buyer", propertyType: "Plot", area: "Chandigarh Road", budgetMin: 12000000, budgetMax: 25000000, timeline: "6-12 months", status: "contacted", source: "Landing Page", notes: "NRI from UK. Wants to invest in plots near Chandigarh Road for long-term appreciation. 300+ sq yard." },

  // Jamalpur — Traditional Area
  { name: "Mohammed Irfan", phone: "9876456789", email: "irfan.ldh@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Jamalpur", budgetMin: 5000000, budgetMax: 12000000, timeline: "1-3 months", status: "new", source: "WhatsApp", notes: "Textile trader. Wants haveli-style house in old Jamalpur. Joint family of 12. Needs 5+ rooms." },

  // Rajguru Nagar
  { name: "Sukhwinder Kaur", phone: "9815012345", email: "sukhwinder.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Rajguru Nagar", budgetMin: 3500000, budgetMax: 6000000, timeline: "Immediately", status: "interested", source: "Facebook Ads", notes: "Widow. Pension income. Wants ground floor flat near gurudwara. Safe neighborhood. PAU campus adjacent preferred." },

  // Giaspura / LPU Area
  { name: "Ankur Sharma", phone: "9878567890", email: "ankur.sharma@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Giaspura", budgetMin: 2000000, budgetMax: 4000000, timeline: "3-6 months", status: "new", source: "Landing Page", notes: "Investor. Wants flat near LPU for rental income from students. 2BHK preferred for higher rent. ROI focused." },
  { name: "Priya Verma", phone: "9814789012", email: "priya.v@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Giaspura", budgetMin: 4000000, budgetMax: 7000000, timeline: "6-12 months", status: "contacted", source: "Public Form", notes: "LPU faculty member. Wants permanent home near university. Currently in rented accommodation." },

  // Jawaddi — Mid Segment
  { name: "Harjinder Singh", phone: "9872012345", email: "harjinder.singh@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Jawaddi", budgetMin: 5000000, budgetMax: 9000000, timeline: "1-3 months", status: "new", source: "99acres", projects: "GBP Athens, Savitry Greens", notes: "Retd. army subedar. Wants secure gated community. Ex-servicemen quota flat if available. Near Jawaddi Taksal." },

  // Sherpur — Industrial Suburb
  { name: "Rajinder Kumar", phone: "9815567890", email: "rajinder.k@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Sherpur", budgetMin: 6000000, budgetMax: 12000000, timeline: "Immediately", status: "interested", source: "WhatsApp", notes: "Wants industrial plot near Sherpur Chowk. Bicycle parts unit. 5000 sq ft minimum. GLADA approved zone." },

  // Hambran Road — New Development
  { name: "Gagandeep Singh", phone: "9876567890", email: "gagan.deep@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Hambran Road", budgetMin: 4500000, budgetMax: 8000000, timeline: "3-6 months", status: "new", source: "Facebook Ads", projects: "SBP Gateway of Dreams, GBP Eco Greens", notes: "Young couple. Both work in IT Park Chandigarh Road. Want affordable gated society near PAU." },
  { name: "Kulwant Singh", phone: "9814901234", email: "kulwant.s@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Hambran Road", budgetMin: 5000000, budgetMax: 10000000, timeline: "6-12 months", status: "contacted", source: "99acres", notes: "Farmer selling agricultural land in village, wants to invest in residential plot. 200 sq yard. GLADA approved." },
];

let count = 0;
const now = Date.now();

for (const b of buyers) {
  const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
  b.area = "Ludhiana — " + b.area;
  
  db.createLead({
    ...b,
    createdAt: now - offset,
  });
  count++;
}

console.log(`Seeded ${count} Ludhiana buyer leads into the database.`);
