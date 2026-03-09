require("dotenv").config();
const db = require("./db");

const buyers = [
  // Model Town — Premium Residential
  { name: "Jaswinder Singh Sidhu", phone: "9814112233", email: "jaswinder.sidhu@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Model Town", budgetMin: 12000000, budgetMax: 25000000, timeline: "1-3 months", status: "interested", source: "99acres", notes: "Retired IAS officer. Wants spacious kothi with lawn. 250+ sq yard. Near Rajindra Hospital. Vastu-compliant mandatory." },
  { name: "Ranjit Kaur Grewal", phone: "9876112233", email: "ranjit.grewal@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Model Town", budgetMin: 6000000, budgetMax: 12000000, timeline: "3-6 months", status: "site-visit", source: "Housing.com", notes: "Professor at Punjabi University. Husband in Army. Want gated flat near Model Town market and kids' school." },

  // Rajpura Road — Growth Corridor
  { name: "Mohit Bansal", phone: "9815223344", email: "mohit.bansal.ptl@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Rajpura Road", budgetMin: 4000000, budgetMax: 8000000, timeline: "3-6 months", status: "new", source: "Facebook Ads", projects: "Omaxe City, Royal City", notes: "Pharma rep at Cipla. First-time buyer. Home loan from HDFC approved. Wants modern society with gym and pool." },
  { name: "Gurleen Kaur", phone: "9872334455", email: "gurleen.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Rajpura Road", budgetMin: 2500000, budgetMax: 5000000, timeline: "Immediately", status: "contacted", source: "WhatsApp", notes: "School teacher at YPS. Single. Wants affordable flat near workplace. Ground floor preferred for elderly mother." },
  { name: "Deepak Goyal", phone: "9878445566", email: "deepak.goyal@yahoo.com", leadType: "buyer", propertyType: "Plot", area: "Rajpura Road", budgetMin: 6000000, budgetMax: 12000000, timeline: "6-12 months", status: "interested", source: "99acres", notes: "Investor. Wants 200-300 sq yard residential plot. PUDA approved mandatory. Plans to hold 3-5 years." },

  // Urban Estate — Established
  { name: "Harmanpreet Singh", phone: "9814334455", email: "harman.singh@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Urban Estate Phase 1", budgetMin: 15000000, budgetMax: 30000000, timeline: "1-3 months", status: "negotiating", source: "Client Referral", notes: "Industrialist. Cycle parts factory in Focal Point. Wants independent kothi 350+ sq yard. Basement + 2 floors." },
  { name: "Kamalpreet Kaur", phone: "9876334455", email: "kamal.kaur.ptl@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Urban Estate Phase 2", budgetMin: 5000000, budgetMax: 9000000, timeline: "3-6 months", status: "new", source: "Public Form", notes: "Government clerk at DC office. Home loan from PNB. Wants flat with parking. Close to bus stand." },

  // Leela Bhawan / Mall Road — Central
  { name: "Vikram Ahuja", phone: "9815556677", email: "vikram.ahuja@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Leela Bhawan / Mall Road", budgetMin: 20000000, budgetMax: 40000000, timeline: "Immediately", status: "site-visit", source: "Builder Referral", notes: "Jeweler. Wants showroom 1500-2500 sq ft on Mall Road. Ground floor. High footfall area near Fountain Chowk." },
  { name: "Anita Sharma", phone: "9872556677", email: "anita.sharma.ptl@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Leela Bhawan / Mall Road", budgetMin: 8000000, budgetMax: 18000000, timeline: "3-6 months", status: "interested", source: "99acres", notes: "CA firm. Wants office space 1000-1500 sq ft. SCO or first floor. Near District Courts preferred." },

  // New Mahindra Colony — Mid Segment
  { name: "Raghbir Singh", phone: "9814667788", email: "raghbir.singh@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "New Mahindra Colony", budgetMin: 4000000, budgetMax: 7500000, timeline: "1-3 months", status: "interested", source: "Landing Page", notes: "Retd. Punjab Police inspector. Pension income. Wants independent floor with terrace. Gurdwara nearby preferred." },
  { name: "Priya Dhawan", phone: "9876667788", email: "priya.dhawan@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "New Mahindra Colony", budgetMin: 2500000, budgetMax: 4500000, timeline: "Immediately", status: "new", source: "WhatsApp", notes: "Nurse at Rajindra Hospital. Wants affordable flat close to hospital. Night shift so needs quiet area." },

  // Tripuri — Affordable
  { name: "Sukhdev Singh", phone: "9815778899", email: "sukhdev.s@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Tripuri", budgetMin: 2000000, budgetMax: 4000000, timeline: "3-6 months", status: "contacted", source: "Facebook Ads", notes: "Auto driver. First home buyer. PMAY subsidy eligible. Wants affordable EWS/LIG flat in Tripuri Town." },
  { name: "Balwinder Kaur", phone: "9872778899", email: "balwinder.k@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Tripuri", budgetMin: 3500000, budgetMax: 6000000, timeline: "1-3 months", status: "new", source: "Public Form", notes: "Husband runs kiryana shop. 3 kids. Upgrading from 1BHK. Wants bigger space. Close to Tripuri market." },

  // Punjabi University Area — Student/Faculty
  { name: "Dr. Navjot Kaur", phone: "9814889900", email: "navjot.kaur.pu@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Punjabi University Area", budgetMin: 5000000, budgetMax: 10000000, timeline: "6-12 months", status: "interested", source: "Housing.com", notes: "Associate Professor at Punjabi University. Wants permanent residence near campus. Currently in university quarters." },
  { name: "Ankush Verma", phone: "9876889900", email: "ankush.verma@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Punjabi University Area", budgetMin: 2000000, budgetMax: 3500000, timeline: "3-6 months", status: "new", source: "Landing Page", notes: "Investor. Wants flat near university for student rental income. 2BHK gives better ROI. PG conversion possible." },

  // Focal Point — Industrial
  { name: "Paramjit Singh", phone: "9815990011", email: "paramjit.focal@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Focal Point", budgetMin: 10000000, budgetMax: 25000000, timeline: "Immediately", status: "negotiating", source: "Builder Referral", notes: "Textile manufacturer. Needs industrial shed 8000-12000 sq ft. Power 80 KVA minimum. PSIEC plot preferred." },
  { name: "Satinder Pal", phone: "9872990011", email: "satinder.pal@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Focal Point", budgetMin: 5000000, budgetMax: 12000000, timeline: "1-3 months", status: "interested", source: "99acres", notes: "Hosiery unit. Wants smaller industrial plot 3000-5000 sq ft. Ready-built shed preferred. Near Phase 5." },

  // Lower Mall — Heritage
  { name: "Tarlochan Singh", phone: "9814001122", email: "tarlochan.s@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Lower Mall / Old Patiala", budgetMin: 8000000, budgetMax: 20000000, timeline: "6-12 months", status: "contacted", source: "Client Referral", notes: "NRI from Australia. Wants heritage haveli-style house in old city. Ancestral connection to Patiala. Restoration okay." },

  // Sangrur Road — New Development
  { name: "Lovepreet Singh", phone: "9815112233", email: "lovepreet.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Sangrur Road", budgetMin: 3500000, budgetMax: 7000000, timeline: "3-6 months", status: "new", source: "Facebook Ads", projects: "GBP Rosewood Estate, Gillco Parkhills", notes: "Bank PO at SBI. Young couple. Want modern flat in gated society. Home loan pre-approved. Near highway preferred." },
  { name: "Ravinder Kumar", phone: "9876001122", email: "ravinder.k@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Sangrur Road", budgetMin: 4000000, budgetMax: 8000000, timeline: "Immediately", status: "interested", source: "WhatsApp", notes: "Wants residential plot 150-200 sq yard on Sangrur Road. PUDA approved colony. Plans to build in 2 years." },

  // Sirhind Road — Connecting Corridor
  { name: "Manjinder Kaur", phone: "9814223344", email: "manjinder.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Sirhind Road", budgetMin: 2500000, budgetMax: 4500000, timeline: "1-3 months", status: "contacted", source: "Landing Page", notes: "Anganwadi worker. Modest budget. Wants safe flat near Sirhind Road. PMAY eligible. SBI loan in process." },
  { name: "Gurmail Singh", phone: "9872223344", email: "gurmail.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Sirhind Road", budgetMin: 4000000, budgetMax: 7000000, timeline: "3-6 months", status: "new", source: "99acres", notes: "Runs transport company. Wants ground floor flat or independent floor. Parking for commercial vehicle essential." },

  // Bhupindra Road — Central Patiala
  { name: "Dr. Amrit Pal", phone: "9815334455", email: "amritpal.doc@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Bhupindra Road", budgetMin: 15000000, budgetMax: 30000000, timeline: "3-6 months", status: "site-visit", source: "Housing.com", notes: "Orthopedic surgeon. Wants to open private clinic. 2000-3000 sq ft. Ground floor mandatory. Parking essential." },

  // Bahadurgarh Road — Emerging
  { name: "Jaskirat Singh", phone: "9876445566", email: "jaskirat.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Bahadurgarh Road", budgetMin: 3000000, budgetMax: 6000000, timeline: "6-12 months", status: "new", source: "Public Form", projects: "Royal Estate, Patiala Heights", notes: "Works in BSNL. Looking for affordable society near Bahadurgarh Road. Wife teaches at local school." },
  { name: "Hardeep Kaur", phone: "9814445566", email: "hardeep.k@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Bahadurgarh Road", budgetMin: 3000000, budgetMax: 6000000, timeline: "Immediately", status: "interested", source: "WhatsApp", notes: "Wants PUDA-approved plot 100-150 sq yard. Budget builder floor construction later. Near Ghagga village side." },
];

let count = 0;
const now = Date.now();

for (const b of buyers) {
  const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
  b.area = "Patiala — " + b.area;

  db.createLead({
    ...b,
    createdAt: now - offset,
  });
  count++;
}

console.log(`Seeded ${count} Patiala buyer leads into the database.`);
