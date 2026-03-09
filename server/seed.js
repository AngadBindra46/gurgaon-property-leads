require("dotenv").config();
const db = require("./db");

const buyers = [
  // Golf Course Road — Premium
  { name: "Vikram Malhotra", phone: "9810234567", email: "vikram.m@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Golf Course Road", budgetMin: 50000000, budgetMax: 80000000, timeline: "1-3 months", status: "interested", source: "99acres", projects: "DLF Camellias, DLF The Aralias", notes: "NRI based in Dubai, wants luxury floor. Park-facing mandatory. Prefers ready possession." },
  { name: "Priya Kapoor", phone: "9871123456", email: "priya.kapoor@hotmail.com", leadType: "buyer", propertyType: "3BHK", area: "Golf Course Road", budgetMin: 30000000, budgetMax: 50000000, timeline: "3-6 months", status: "site-visit", source: "Housing.com", projects: "DLF The Magnolias, Ireo Grand Arch", notes: "Wants high-rise with club access. Currently renting in Sec 54. Husband works at Google." },
  { name: "Amit Jain", phone: "9999012345", email: "amitjain.gurgaon@gmail.com", leadType: "buyer", propertyType: "5BHK+", area: "Golf Course Road", budgetMin: 80000000, budgetMax: 150000000, timeline: "Immediately", status: "negotiating", source: "Client Referral", projects: "DLF Camellias", notes: "Business family, wants penthouse or top floor. Cash buyer, no loan needed." },

  // Dwarka Expressway — Growth
  { name: "Rahul Sharma", phone: "9876501234", email: "rahul.sharma92@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Dwarka Expressway", budgetMin: 10000000, budgetMax: 18000000, timeline: "3-6 months", status: "new", source: "Facebook Ads", projects: "Sobha City, Godrej Meridien", notes: "First-time buyer. Works in Cyber City. Wants metro connectivity. Needs home loan assistance." },
  { name: "Neha Gupta", phone: "9812345678", email: "neha.gupta.del@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Dwarka Expressway", budgetMin: 6000000, budgetMax: 10000000, timeline: "6-12 months", status: "contacted", source: "Public Form", projects: "Hero Homes, Shapoorji Pallonji Joyville", notes: "Young couple. Budget conscious. Okay with under-construction. Wants good school nearby." },
  { name: "Sanjay Verma", phone: "9650987654", email: "sanjay.v@yahoo.com", leadType: "buyer", propertyType: "3BHK", area: "Dwarka Expressway", budgetMin: 12000000, budgetMax: 20000000, timeline: "1-3 months", status: "interested", source: "WhatsApp", projects: "Tata Primanti, Elan Town Centre", notes: "Relocating from Noida. Wants bigger space. 2 kids, needs park and school in walking distance." },
  { name: "Deepak Taneja", phone: "9711456789", email: "deepak.taneja@outlook.com", leadType: "buyer", propertyType: "Plot", area: "Dwarka Expressway", budgetMin: 15000000, budgetMax: 30000000, timeline: "Immediately", status: "negotiating", source: "99acres", notes: "Wants to build custom house. Looking for 200-300 sq yard plot. Sectors 99-104 preferred." },

  // Sohna Road — Affordable Growth
  { name: "Manish Kumar", phone: "9818765432", email: "manish.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Sohna Road", budgetMin: 4000000, budgetMax: 7000000, timeline: "3-6 months", status: "new", source: "Landing Page", projects: "Signature Global, Eldeco Accolade", notes: "Budget buyer. Works in IMT Manesar. Wants affordable housing with good connectivity." },
  { name: "Pooja Singh", phone: "9899123456", email: "pooja.singh101@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Sohna Road", budgetMin: 8000000, budgetMax: 14000000, timeline: "1-3 months", status: "interested", source: "Facebook Ads", projects: "Central Park Flower Valley, M3M Woodshire", notes: "Family of 4. Wants green campus with sports facilities. Currently in rented 2BHK in Sec 49." },
  { name: "Rajat Bhalla", phone: "9560234567", email: "rajat.bhalla@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Sohna Road", budgetMin: 20000000, budgetMax: 40000000, timeline: "6-12 months", status: "contacted", source: "Housing.com", projects: "Central Park Resorts, Anant Raj Villas", notes: "Wants independent villa with private garden. Retired army officer. Investment + self-use." },

  // Golf Course Extension Road (GCER) — Luxury Growth
  { name: "Arjun Mehta", phone: "9873456789", email: "arjun.mehta@icloud.com", leadType: "buyer", propertyType: "4BHK", area: "Golf Course Ext Road (GCER)", budgetMin: 30000000, budgetMax: 55000000, timeline: "1-3 months", status: "site-visit", source: "99acres", projects: "M3M Golf Hills, Ireo Skyon, Emaar Digihomes", notes: "Senior VP at MNC. Upgrading from 3BHK in DLF Phase 4. Wants modern amenities and golf views." },
  { name: "Kavita Reddy", phone: "9910876543", email: "kavita.r@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Golf Course Ext Road (GCER)", budgetMin: 15000000, budgetMax: 25000000, timeline: "3-6 months", status: "interested", source: "WhatsApp", projects: "M3M Merlin, Emaar Palm Heights", notes: "Dual income couple. Both in IT. Want modern society with co-working space. No Vastu issues." },

  // New Gurgaon (Sectors 76-95)
  { name: "Rohit Agarwal", phone: "9654321098", email: "rohit.ag@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Sector 82-89", budgetMin: 8000000, budgetMax: 13000000, timeline: "Immediately", status: "new", source: "Public Form", projects: "Conscient Habitat, Pareena Hanu Residency", notes: "First home buyer. 28 years old. Software engineer. Needs home loan pre-approval guidance." },
  { name: "Sunita Yadav", phone: "9811234509", email: "sunita.yadav@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Sector 76-81", budgetMin: 5000000, budgetMax: 8000000, timeline: "3-6 months", status: "contacted", source: "Landing Page", projects: "Signature Global Proxima, Mahira Homes", notes: "Single working woman. Govt employee. Wants secure gated community. Subsidy eligible under PMAY." },
  { name: "Vivek Choudhary", phone: "9718654321", email: "vivek.ch@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Sector 90-95", budgetMin: 10000000, budgetMax: 20000000, timeline: "6-12 months", status: "new", source: "Facebook Ads", notes: "Investor. Looking for plots with appreciation potential. Wants to hold for 3-5 years." },

  // DLF Phases — Established
  { name: "Ananya Bhatia", phone: "9891234567", email: "ananya.bhatia@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "DLF Phase 5", budgetMin: 40000000, budgetMax: 70000000, timeline: "1-3 months", status: "interested", source: "Client Referral", projects: "DLF Park Place, DLF The Summit", notes: "Family business. 3 kids. Wants spacious apartment near Heritage School. Will pay in installments." },
  { name: "Karan Sethi", phone: "9810567890", email: "karan.sethi@yahoo.com", leadType: "buyer", propertyType: "Villa", area: "DLF Phase 1", budgetMin: 60000000, budgetMax: 120000000, timeline: "3-6 months", status: "site-visit", source: "Builder Referral", notes: "Wants to demolish and rebuild. Interested in 300+ sq yard plots with old construction." },

  // Sectors 42-57 — Cyber City Adjacent
  { name: "Meera Krishnan", phone: "9650123456", email: "meera.k@outlook.com", leadType: "buyer", propertyType: "3BHK", area: "Sector 47-49", budgetMin: 15000000, budgetMax: 25000000, timeline: "Immediately", status: "negotiating", source: "Housing.com", projects: "Vipul Belmonte, Unitech Horizon", notes: "Single mom, HR Director at MNC. Needs walkable distance to Cyber Hub. Daughter goes to DPS." },
  { name: "Gaurav Mishra", phone: "9999345678", email: "gaurav.m@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Sector 42-46", budgetMin: 20000000, budgetMax: 40000000, timeline: "3-6 months", status: "interested", source: "99acres", notes: "Wants office space 2000-3000 sq ft. Startup with 25 employees. Needs good parking." },

  // SPR / Southern Peripheral Road
  { name: "Aditya Narayan", phone: "9876123456", email: "aditya.n@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "SPR (Southern Peripheral Rd)", budgetMin: 10000000, budgetMax: 18000000, timeline: "1-3 months", status: "new", source: "WhatsApp", projects: "Bestech Park View Grand Spa, SS The Hibiscus", notes: "Couple with newborn. Want baby-friendly society with creche. Currently in Sec 56 rental." },

  // Sectors 58-75 — GCER Adjacent
  { name: "Nidhi Sharma", phone: "9810345678", email: "nidhi.sharma@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Sector 58-67", budgetMin: 7000000, budgetMax: 12000000, timeline: "6-12 months", status: "contacted", source: "Public Form", projects: "Emaar Emerald Hills, BPTP Terra", notes: "Young professional. Wants investment-cum-self-use. Ready to wait for under-construction if price is right." },
  { name: "Pankaj Dhawan", phone: "9711098765", email: "pankaj.d@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Sector 68-75", budgetMin: 20000000, budgetMax: 35000000, timeline: "Immediately", status: "interested", source: "Landing Page", projects: "M3M Golf Estate, Ireo Grand Arch", notes: "Joint family. Needs 4BHK with servant quarter. Prefers ground floor or first floor." },

  // Manesar — Industrial/Affordable
  { name: "Suresh Pal", phone: "9650876543", email: "suresh.pal@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Manesar", budgetMin: 2500000, budgetMax: 5000000, timeline: "Immediately", status: "new", source: "Facebook Ads", notes: "Factory supervisor at IMT Manesar. Wants affordable housing close to workplace. PMAY eligible." },
  { name: "Ritu Bansal", phone: "9818012345", email: "ritu.bansal@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Manesar", budgetMin: 8000000, budgetMax: 15000000, timeline: "3-6 months", status: "contacted", source: "99acres", notes: "Investor. Wants industrial plot near NH-8. Plans to build warehouse. Needs clear title documents." },

  // Palam Vihar
  { name: "Ashish Tandon", phone: "9899567890", email: "ashish.t@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Palam Vihar", budgetMin: 15000000, budgetMax: 30000000, timeline: "1-3 months", status: "site-visit", source: "WhatsApp", notes: "Doctor. Wants independent house with parking for 2 cars. Close to hospital. Considering builder floors." },

  // Sushant Lok
  { name: "Divya Nair", phone: "9873012345", email: "divya.nair@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Sushant Lok 1", budgetMin: 12000000, budgetMax: 20000000, timeline: "3-6 months", status: "interested", source: "Housing.com", projects: "DLF City Court, Sushant Lok Floors", notes: "Prefers builder floor over high-rise. Wants top floor with terrace rights. Close to Huda City Centre metro." },

  // Udyog Vihar — Commercial
  { name: "Rajesh Khanna", phone: "9810111222", email: "rajesh.khanna@company.com", leadType: "buyer", propertyType: "Commercial", area: "Udyog Vihar", budgetMin: 30000000, budgetMax: 60000000, timeline: "Immediately", status: "negotiating", source: "Builder Referral", notes: "Wants 5000 sq ft office space. IT company expanding from Noida. Needs fiber connectivity and power backup." },

  // South City
  { name: "Simran Kaur", phone: "9711222333", email: "simran.kaur@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "South City 1", budgetMin: 10000000, budgetMax: 18000000, timeline: "1-3 months", status: "new", source: "Public Form", projects: "Suncity, Unitech South City", notes: "Teacher at Pathways School. Wants society with pool and gym. Has 2 school-going children." },

  // Dwarka Expressway Sectors 106-109
  { name: "Mohit Saxena", phone: "9876999888", email: "mohit.saxena@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Sector 106-109 (Dwarka Exp)", budgetMin: 8000000, budgetMax: 15000000, timeline: "6-12 months", status: "new", source: "Facebook Ads", projects: "Godrej Summit, Conscient Heritage Max", notes: "IT professional. Works from home. Needs extra room as office. Under-construction okay for lower price." },

  // MG Road
  { name: "Prateek Malhotra", phone: "9810444555", email: "prateek.m@icloud.com", leadType: "buyer", propertyType: "Commercial", area: "MG Road", budgetMin: 50000000, budgetMax: 100000000, timeline: "3-6 months", status: "interested", source: "Client Referral", notes: "Wants retail showroom on MG Road. Jewelry business. Ground floor mandatory. Minimum 1500 sq ft." },
];

let count = 0;
const now = Date.now();

for (const b of buyers) {
  const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
  const created = now - offset;
  
  db.createLead({
    ...b,
    createdAt: created,
  });
  count++;
}

console.log(`Seeded ${count} buyer leads into the database.`);
