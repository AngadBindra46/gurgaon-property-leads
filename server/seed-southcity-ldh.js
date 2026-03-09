require("dotenv").config();
const db = require("./db");

// ═══ PROPERTIES: South City, Ludhiana ═══
const properties = [
  { title: "South City — 3BHK Premium Flat", project: "South City", developer: "SPS Infrastructure", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — South City", city: "Ludhiana", price: 7500000, pricePerSqft: 5200, carpetArea: "1440 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2019-0154", amenities: "Club, Pool, Gym, Power backup, Park, Gated security", description: "Well-maintained 3BHK in South City township. Near South City Mall. Marble flooring.", ownerName: "Harpreet Singh Gill", ownerPhone: "9814112233", ownerEmail: "harpreet.gill.sc@gmail.com", ownerAddress: "B-204, South City Tower A, South City, Ludhiana 141013" },
  { title: "South City — 4BHK Corner Villa", project: "South City Villas", developer: "SPS Infrastructure", propertyType: "Villa", bedrooms: "4", area: "Ludhiana — South City", city: "Ludhiana", price: 14500000, pricePerSqft: 5800, carpetArea: "2500 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2018-0098", amenities: "Private garden, Terrace, 2 parking, Servant room, Club access, Modular kitchen", description: "Spacious 4BHK corner villa with private garden in South City. Near Westend Mall. Vastu-compliant.", ownerName: "Dr. Amarjit Sandhu", ownerPhone: "9876334455", ownerEmail: "dr.amarjit.sandhu@gmail.com", ownerAddress: "Villa 67, South City Phase 1, Ludhiana 141013" },
  { title: "South City — 2BHK Ready Flat", project: "South City Heights", developer: "SPS Infrastructure", propertyType: "2BHK", bedrooms: "2", area: "Ludhiana — South City", city: "Ludhiana", price: 4200000, pricePerSqft: 4600, carpetArea: "912 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2020-0267", amenities: "Lift, Power backup, Park, Security, Covered parking", description: "Affordable 2BHK in South City Heights. Ideal for young couples. Near Rishi Nagar bus stand.", ownerName: "Rajesh Kumar Bhatia", ownerPhone: "9815556677", ownerEmail: "rajesh.bhatia.ldh@gmail.com", ownerAddress: "Flat 312, South City Heights, Ludhiana 141013" },
  { title: "South City — 3BHK Builder Floor", project: "South City Floors", developer: "Private Builder", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — South City", city: "Ludhiana", price: 6200000, pricePerSqft: 4900, carpetArea: "1265 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Terrace rights, Parking, Modular kitchen, Marble flooring, Power backup", description: "First floor builder floor on 250 sq yard plot. Terrace rights. 10 min from Clock Tower.", ownerName: "Mandeep Kaur", ownerPhone: "9872778899", ownerEmail: "mandeep.kaur.sc@gmail.com", ownerAddress: "House 145, Street 7, South City Phase 2, Ludhiana 141013" },
  { title: "South City — 4BHK Luxury Apartment", project: "South City Grandeur", developer: "Hero Realty", propertyType: "4BHK", bedrooms: "4", area: "Ludhiana — South City", city: "Ludhiana", price: 11800000, pricePerSqft: 5500, carpetArea: "2145 sq ft", status: "available", possession: "Jun 2026", reraId: "PBRERA-LDH-2022-0189", amenities: "Club, Pool, Gym, Jogging track, Meditation, EV charging, Kids zone", description: "Premium 4BHK in South City Grandeur by Hero. High ceilings. Balcony with city view.", ownerName: "Arun Verma", ownerPhone: "9872402424", ownerEmail: "arun.verma@herorealty.in", ownerAddress: "Hero Homes Sales Office, Sector 2, IT City, Chandigarh Road, Ludhiana" },
  { title: "South City — SCO Commercial Space", project: "South City Market", developer: "SPS Infrastructure", propertyType: "Commercial", bedrooms: "", area: "Ludhiana — South City", city: "Ludhiana", price: 18000000, pricePerSqft: 12000, carpetArea: "1500 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2019-0312", amenities: "Ground + First floor, Parking, Power backup, Near main road, High footfall", description: "Double-storey SCO in South City commercial hub. Suitable for retail, clinic or office. Main road facing.", ownerName: "Balwinder Singh Cheema", ownerPhone: "9814990011", ownerEmail: "balwinder.cheema@gmail.com", ownerAddress: "SCO 45, South City Market, Ludhiana 141013" },
  { title: "South City — 200 Sq Yd Plot", project: "South City Extension", developer: "GLADA", propertyType: "Plot", bedrooms: "", area: "Ludhiana — South City", city: "Ludhiana", price: 6000000, pricePerSqft: 3333, carpetArea: "200 sq yards (1800 sq ft)", status: "available", possession: "Immediate", reraId: "PBRERA-LDH-2021-0445", amenities: "Wide roads, Sewerage, Water, Electricity, Near school, Park facing", description: "GLADA-approved residential plot in South City Extension. Park-facing. Build your dream home.", ownerName: "Surjit Singh Dhillon", ownerPhone: "9876112233", ownerEmail: "surjit.dhillon@gmail.com", ownerAddress: "Plot 89, South City Extension, Ludhiana 141013" },
  { title: "South City — 3BHK Duplex", project: "South City Duplex Homes", developer: "Omaxe", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — South City", city: "Ludhiana", price: 9500000, pricePerSqft: 5100, carpetArea: "1862 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2020-0178", amenities: "Duplex, Private terrace, Parking x2, Club access, Gym, Modular kitchen", description: "Spacious 3BHK duplex with private terrace. Ground + First ownership feel in a gated complex.", ownerName: "Pankaj Mittal", ownerPhone: "9872002020", ownerEmail: "pankaj.mittal@omaxe.com", ownerAddress: "Omaxe Sales Office, Sarabha Nagar Extension, Ludhiana 141001" },
];

let propCount = 0;
for (const p of properties) {
  db.createProperty(p);
  propCount++;
}
console.log(`Inserted ${propCount} South City Ludhiana properties.`);

// ═══ LEADS: Buyers looking in South City, Ludhiana ═══
const leads = [
  { name: "Gurpreet Singh Bains", phone: "9814223344", email: "gurpreet.bains@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — South City", budgetMin: 6000000, budgetMax: 8500000, timeline: "3 months", status: "interested", source: "99acres", projects: "South City, South City Heights", notes: "Looking for gated society. Prefers ground or first floor. Family of 4." },
  { name: "Simran Kaur Dhillon", phone: "9876445566", email: "simran.dhillon@yahoo.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — South City", budgetMin: 3500000, budgetMax: 5000000, timeline: "Immediate", status: "site-visit", source: "Housing.com", projects: "South City Heights", notes: "First-time buyer. Works at Infosys IT campus. Wants ready-to-move." },
  { name: "Mohit Aggarwal", phone: "9815667788", email: "mohit.aggarwal.ldh@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Ludhiana — South City", budgetMin: 12000000, budgetMax: 16000000, timeline: "6 months", status: "interested", source: "Manual", projects: "South City Villas, South City Extension", notes: "Hosiery businessman. Looking for independent living. Has 2 kids." },
  { name: "Dr. Navneet Sharma", phone: "9872889900", email: "dr.navneet.sharma@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Ludhiana — South City", budgetMin: 10000000, budgetMax: 13000000, timeline: "3 months", status: "negotiating", source: "Referral", projects: "South City Grandeur", notes: "Surgeon at DMC Hospital. Needs 4BHK. Interested in Hero Realty project." },
  { name: "Tejinder Pal Singh", phone: "9814001122", email: "tejinder.pal@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Ludhiana — South City", budgetMin: 5000000, budgetMax: 7000000, timeline: "1 month", status: "interested", source: "99acres", projects: "South City Extension", notes: "Wants GLADA-approved plot. Plans to build custom house. Budget flexible for right plot." },
  { name: "Neha Gupta", phone: "9876223344", email: "neha.gupta.ldh@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — South City", budgetMin: 5500000, budgetMax: 7000000, timeline: "2 months", status: "new", source: "Facebook Ads", projects: "South City, South City Floors", notes: "Teacher at BCM School. Husband runs transport business. Want semi-furnished." },
  { name: "Ramandeep Kaur", phone: "9815445566", email: "ramandeep.kaur@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — South City", budgetMin: 8000000, budgetMax: 10000000, timeline: "Immediate", status: "site-visit", source: "Housing.com", projects: "South City Duplex Homes", notes: "Looking for duplex. Currently renting in BRS Nagar. Wants more space." },
  { name: "Sukhwinder Singh Mann", phone: "9872667788", email: "sukhwinder.mann@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — South City", budgetMin: 15000000, budgetMax: 20000000, timeline: "Immediate", status: "negotiating", source: "Direct Walk-in", projects: "South City Market", notes: "Wants SCO for medical clinic. Currently at Ferozepur Road. Looking to expand." },
  { name: "Jasleen Kaur Sandhu", phone: "9814889900", email: "jasleen.sandhu@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — South City", budgetMin: 3800000, budgetMax: 4800000, timeline: "3 months", status: "interested", source: "WhatsApp Inquiry", projects: "South City Heights", notes: "NRI (Canada). Buying for parents. Parents currently in Model Town." },
  { name: "Karan Bajaj", phone: "9876001122", email: "karan.bajaj.ldh@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Ludhiana — South City", budgetMin: 13000000, budgetMax: 16000000, timeline: "6 months", status: "new", source: "99acres", projects: "South City Villas, South City Grandeur", notes: "Cycle parts manufacturer. Family of 6. Wants villa or large 4BHK." },
  { name: "Parveen Kumar", phone: "9815001122", email: "parveen.kumar.sc@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — South City", budgetMin: 6500000, budgetMax: 8000000, timeline: "2 months", status: "interested", source: "Facebook Ads", projects: "South City, South City Floors", notes: "Government employee (Punjab Civil Services). Wife is teacher. Need loan assistance." },
  { name: "Amandeep Singh Brar", phone: "9872334455", email: "amandeep.brar@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Ludhiana — South City", budgetMin: 4000000, budgetMax: 6500000, timeline: "Immediate", status: "site-visit", source: "Referral", projects: "South City Extension", notes: "NRI (Australia). Building for retirement home. Brother managing on ground." },
  { name: "Ritu Mahajan", phone: "9814556677", email: "ritu.mahajan@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — South City", budgetMin: 7000000, budgetMax: 9500000, timeline: "3 months", status: "new", source: "Manual", projects: "South City, South City Duplex Homes", notes: "Runs boutique business. Husband in real estate. Looking to upgrade from 2BHK." },
  { name: "Gaganjot Singh", phone: "9876778899", email: "gaganjot.singh@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — South City", budgetMin: 16000000, budgetMax: 22000000, timeline: "1 month", status: "interested", source: "Direct Walk-in", projects: "South City Market", notes: "Wants retail space for branded clothing showroom. Currently at Chaura Bazaar." },
  { name: "Deepak Soni", phone: "9815990011", email: "deepak.soni.ldh@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — South City", budgetMin: 3500000, budgetMax: 4500000, timeline: "Immediate", status: "interested", source: "Housing.com", projects: "South City Heights", notes: "Chartered accountant. Wants investment property for rental income." },
];

let leadCount = 0;
for (const l of leads) {
  db.createLead(l);
  leadCount++;
}
console.log(`Inserted ${leadCount} South City Ludhiana leads.`);

// ═══ AUTO-LINK ═══
const allLeads = db.getAllLeads().filter(l => (l.area || "").includes("South City"));
const allProps = db.getAllProperties().filter(p => (p.area || "").includes("South City") && p.city === "Ludhiana");

let linked = 0;
for (const lead of allLeads) {
  for (const prop of allProps) {
    if (prop.propertyType !== lead.propertyType && lead.propertyType !== "Plot" && prop.propertyType !== "Plot") {
      if (lead.propertyType && prop.propertyType && lead.propertyType !== prop.propertyType) continue;
    }
    if (prop.price >= lead.budgetMin && prop.price <= lead.budgetMax * 1.15) {
      db.linkProperty(lead.id, prop.id, "auto");
      linked++;
    }
  }
}
console.log(`Auto-linked ${linked} lead-property matches.`);
