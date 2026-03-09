require("dotenv").config();
const db = require("./db");

const patiala = [
  // Model Town / Premium
  { name: "Charanjit Singh Dhaliwal", phone: "9814201001", email: "charanjit.dhaliwal@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Patiala — Model Town", budgetMin: 20000000, budgetMax: 38000000, timeline: "Immediately", status: "negotiating", source: "Client Referral", notes: "NRI from Birmingham UK. Wants double-story kothi 350 sq yard. Italian marble. Modular kitchen. Lift provision." },
  { name: "Jasmeet Kaur Bains", phone: "9876201002", email: "jasmeet.bains@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Model Town", budgetMin: 7000000, budgetMax: 13000000, timeline: "3-6 months", status: "interested", source: "99acres", notes: "Lawyer at District Courts. Husband is SDM. Want gated flat near Model Town market. Parking for 2 cars." },
  { name: "Satwant Singh Grewal", phone: "9815201003", email: "satwant.grewal@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Patiala — Model Town", budgetMin: 14000000, budgetMax: 25000000, timeline: "1-3 months", status: "site-visit", source: "Housing.com", notes: "Retired colonel. Family of 6. Wants independent floor with terrace garden. South-facing. Near Rajindra Hospital." },

  // Rajpura Road
  { name: "Harjinder Kaur Sandhu", phone: "9872201004", email: "harjinder.sandhu@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Patiala — Rajpura Road", budgetMin: 2200000, budgetMax: 4200000, timeline: "Immediately", status: "new", source: "Facebook Ads", notes: "Tailoring business from home. Widow with son in 10th class. Needs affordable flat. SC quota PMAY benefits." },
  { name: "Kuldeep Singh Randhawa", phone: "9814201005", email: "kuldeep.randhawa@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Patiala — Rajpura Road", budgetMin: 5000000, budgetMax: 9000000, timeline: "3-6 months", status: "interested", source: "WhatsApp", notes: "Retired school headmaster. Pension savings. Wants 200 sq yard plot. PUDA approved. Build retirement home." },
  { name: "Navneet Kaur", phone: "9876201006", email: "navneet.k.ptl@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Rajpura Road", budgetMin: 4500000, budgetMax: 7500000, timeline: "1-3 months", status: "contacted", source: "Landing Page", projects: "Omaxe City, Royal City", notes: "Pharmacist at Apollo Pharmacy. Husband drives Uber. Combined income 70K. Home loan from ICICI." },

  // Urban Estate
  { name: "Dalbir Singh Dhillon", phone: "9815201007", email: "dalbir.dhillon@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Patiala — Urban Estate Phase 1", budgetMin: 18000000, budgetMax: 32000000, timeline: "6-12 months", status: "interested", source: "Builder Referral", notes: "NRI from Dubai. Agricultural land income. Wants luxury kothi 400 sq yard. Swimming pool space in backyard." },
  { name: "Anmol Preet Kaur", phone: "9872201008", email: "anmol.kaur@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Patiala — Urban Estate Phase 2", budgetMin: 3000000, budgetMax: 5500000, timeline: "Immediately", status: "new", source: "Public Form", notes: "IT support at Infosys (remote). Single. First home. Wants society flat with wifi. Near bus stand for parents visit." },

  // Leela Bhawan / Mall Road
  { name: "Jugraj Singh Aujla", phone: "9814201009", email: "jugraj.aujla@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Patiala — Leela Bhawan / Mall Road", budgetMin: 15000000, budgetMax: 28000000, timeline: "1-3 months", status: "site-visit", source: "99acres", notes: "Wants branded clothing showroom. 1200-2000 sq ft. Mall Road for brand visibility. Display window essential." },
  { name: "Reena Sethi", phone: "9876201010", email: "reena.sethi@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Patiala — Leela Bhawan / Mall Road", budgetMin: 6000000, budgetMax: 12000000, timeline: "3-6 months", status: "interested", source: "Housing.com", notes: "Beauty salon owner expanding. Wants 800-1200 sq ft space. First floor okay. Near Fountain Chowk preferred." },

  // Tripuri
  { name: "Jagdeep Singh", phone: "9815201011", email: "jagdeep.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Tripuri", budgetMin: 2800000, budgetMax: 5200000, timeline: "3-6 months", status: "contacted", source: "WhatsApp", notes: "Electrician. Steady govt contract income. Family of 5. Upgrading from rented 2-room. Near children's school." },
  { name: "Sarabjit Kaur", phone: "9872201012", email: "sarabjit.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Patiala — Tripuri", budgetMin: 1500000, budgetMax: 3000000, timeline: "Immediately", status: "new", source: "Public Form", notes: "Sweeper at municipal corp. Husband is rickshaw puller. EWS housing. Govt subsidy under PMAY Gramin." },

  // Punjabi University Area
  { name: "Prof. Gurmeet Singh Sidhu", phone: "9814201013", email: "gurmeet.sidhu@pu.ac.in", leadType: "buyer", propertyType: "4BHK", area: "Patiala — Punjabi University Area", budgetMin: 9000000, budgetMax: 16000000, timeline: "3-6 months", status: "interested", source: "99acres", notes: "HOD Punjabi Dept. Retiring in 3 years. Wants permanent home near campus. Large study room for library." },
  { name: "Rajveer Kaur", phone: "9876201014", email: "rajveer.k@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Patiala — Punjabi University Area", budgetMin: 3000000, budgetMax: 6000000, timeline: "1-3 months", status: "new", source: "Facebook Ads", notes: "Investor from Chandigarh. Wants plot near PU for PG hostel construction. 200 sq yard minimum. Corner preferred." },

  // Focal Point
  { name: "Baljinder Singh", phone: "9815201015", email: "baljinder.focal@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Patiala — Focal Point", budgetMin: 8000000, budgetMax: 18000000, timeline: "Immediately", status: "negotiating", source: "99acres", notes: "Sports goods manufacturer. Needs shed 5000-8000 sq ft. Near GT Road for dispatch. 3-phase power mandatory." },

  // Sangrur Road
  { name: "Sarbjit Singh Brar", phone: "9872201016", email: "sarbjit.brar@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Sangrur Road", budgetMin: 3200000, budgetMax: 5800000, timeline: "3-6 months", status: "contacted", source: "Landing Page", notes: "Army JCO posted in Rajasthan. Buying for family. Wife and parents in Patiala. Near gurudwara important." },
  { name: "Mandeep Kaur Brar", phone: "9814201017", email: "mandeep.brar@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Patiala — Sangrur Road", budgetMin: 2200000, budgetMax: 4000000, timeline: "Immediately", status: "new", source: "WhatsApp", notes: "Runs beauty parlour. Divorced. Single mother with daughter. Needs affordable safe flat. Loan from PNB." },

  // Sirhind Road
  { name: "Lakhwinder Singh", phone: "9876201018", email: "lakhwinder.s@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Patiala — Sirhind Road", budgetMin: 6000000, budgetMax: 11000000, timeline: "1-3 months", status: "interested", source: "Housing.com", notes: "Rice mill owner in Rajpura. Wants Patiala home for kids' college. 4BHK independent floor. Car parking 2." },
  { name: "Paramjit Kaur Gill", phone: "9815201019", email: "paramjit.gill@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Patiala — Sirhind Road", budgetMin: 4000000, budgetMax: 7000000, timeline: "6-12 months", status: "contacted", source: "99acres", notes: "NRI from Germany. Wants PUDA plot 150-200 sq yard. Long-term investment. Will visit in December to finalize." },

  // Bhupindra Road
  { name: "Dr. Satnam Singh", phone: "9872201020", email: "satnam.doc@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Patiala — Bhupindra Road", budgetMin: 12000000, budgetMax: 22000000, timeline: "3-6 months", status: "site-visit", source: "Builder Referral", notes: "Pediatrician. Opening children's hospital. 3000-4000 sq ft. Ground + first floor. Near residential area." },

  // Bahadurgarh Road
  { name: "Amritpal Singh", phone: "9814201021", email: "amritpal.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Bahadurgarh Road", budgetMin: 3000000, budgetMax: 5500000, timeline: "1-3 months", status: "new", source: "Facebook Ads", notes: "Electrician at PSPCL. Govt job stability. Wants society flat near Bahadurgarh Road. Children in 3rd and 5th." },
  { name: "Gurjeet Kaur", phone: "9876201022", email: "gurjeet.k@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Patiala — Bahadurgarh Road", budgetMin: 2500000, budgetMax: 5000000, timeline: "3-6 months", status: "interested", source: "WhatsApp", notes: "Teacher at govt school. Wants affordable plot 100-150 sq yard. Will build small house in 2-3 years." },

  // Lower Mall / Heritage
  { name: "Mohinder Singh Gill", phone: "9815201023", email: "mohinder.gill@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Patiala — Lower Mall / Old Patiala", budgetMin: 12000000, budgetMax: 25000000, timeline: "6-12 months", status: "interested", source: "Client Referral", notes: "NRI from Toronto. Emotional connection to old Patiala. Wants haveli near Sheranwala Gate. Will restore it." },

  // Civil Lines
  { name: "Brig. Ranjit Singh (Retd)", phone: "9872201024", email: "ranjit.brig@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Patiala — Civil Lines", budgetMin: 15000000, budgetMax: 28000000, timeline: "1-3 months", status: "negotiating", source: "99acres", notes: "Retired brigadier. Currently in Chandigarh. Moving back to Patiala roots. Wants bungalow-style with garden." },

  // Nabha Road
  { name: "Sukhchain Singh", phone: "9814201025", email: "sukhchain.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Nabha Road", budgetMin: 3000000, budgetMax: 5500000, timeline: "3-6 months", status: "new", source: "Landing Page", notes: "Works at Nestle factory Mahi Nangal. Wants home closer to workplace. Society flat preferred. School nearby." },
  { name: "Jasleen Kaur", phone: "9876201026", email: "jasleen.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Patiala — Nabha Road", budgetMin: 2000000, budgetMax: 3800000, timeline: "Immediately", status: "contacted", source: "Public Form", notes: "Nursing student at Govt Medical College. Parents funding. Wants small flat near hospital. Safe for girls." },

  // Adalat Bazaar
  { name: "Adv. Harpal Singh Dhillon", phone: "9815201027", email: "harpal.adv@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Patiala — Adalat Bazaar", budgetMin: 8000000, budgetMax: 15000000, timeline: "1-3 months", status: "interested", source: "Client Referral", notes: "Senior advocate. Wants law chambers near District Courts. 1000-1500 sq ft. First floor okay. AC building." },

  // Passiana Road (New)
  { name: "Resham Singh Bhullar", phone: "9872201028", email: "resham.bhullar@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Patiala — Passiana Road", budgetMin: 4000000, budgetMax: 8000000, timeline: "6-12 months", status: "new", source: "99acres", notes: "Young farmer diversifying. Selling 2 acres farmland, wants city plot. 200 sq yard. PUDA approved colony." },
  { name: "Maninder Kaur", phone: "9814201029", email: "maninder.k@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Patiala — Passiana Road", budgetMin: 3500000, budgetMax: 6500000, timeline: "3-6 months", status: "contacted", source: "WhatsApp", notes: "Husband in merchant navy. Gone 6 months. Wants safe gated society. Currently with in-laws. Independent space." },

  // Samana Road (New)
  { name: "Tarsem Singh", phone: "9876201030", email: "tarsem.s@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Patiala — Samana Road", budgetMin: 1800000, budgetMax: 3500000, timeline: "Immediately", status: "new", source: "Facebook Ads", notes: "Bus conductor PRTC. Savings + PF withdrawal. First home. Wants affordable flat near bus depot Samana Road." },
];

const ludhiana = [
  // Model Town
  { name: "Surjit Singh Bains", phone: "9814301001", email: "surjit.bains@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Ludhiana — Model Town", budgetMin: 18000000, budgetMax: 35000000, timeline: "1-3 months", status: "negotiating", source: "Client Referral", notes: "NRI from Melbourne. Return plan. Wants modern kothi 400 sq yard. Home theater room. Landscaped garden." },
  { name: "Dr. Rupinder Kaur Brar", phone: "9876301002", email: "rupinder.brar@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Ludhiana — Model Town", budgetMin: 10000000, budgetMax: 18000000, timeline: "3-6 months", status: "interested", source: "99acres", notes: "Gynecologist at DMCH. Wants spacious flat. Servant quarter needed. Close to hospital for emergency calls." },
  { name: "Mohinder Pal Sharma", phone: "9815301003", email: "mohinder.sharma@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Model Town", budgetMin: 8000000, budgetMax: 14000000, timeline: "Immediately", status: "site-visit", source: "Housing.com", notes: "Chartered accountant. Office in Feroze Gandhi Market. Wants walkable distance home. Top floor with terrace." },

  // Sarabha Nagar
  { name: "Gurinder Singh Dhillon", phone: "9872301004", email: "gurinder.dhillon@gmail.com", leadType: "buyer", propertyType: "5BHK+", area: "Ludhiana — Sarabha Nagar", budgetMin: 40000000, budgetMax: 75000000, timeline: "6-12 months", status: "interested", source: "Builder Referral", notes: "Textile exporter. Wants mansion 600+ sq yard. Guest suite separate. Italian marble. Central AC. CCTV." },
  { name: "Neeru Aggarwal", phone: "9814301005", email: "neeru.ag@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Sarabha Nagar", budgetMin: 12000000, budgetMax: 20000000, timeline: "1-3 months", status: "site-visit", source: "Housing.com", notes: "Wants premium flat in Sarabha Nagar society. Husband retired from Air Force. Near park and temple." },

  // BRS Nagar
  { name: "Lovepreet Kaur", phone: "9876301006", email: "lovepreet.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — BRS Nagar", budgetMin: 3000000, budgetMax: 5500000, timeline: "3-6 months", status: "new", source: "Facebook Ads", notes: "Air hostess at IndiGo. Mostly traveling. Wants lock-and-leave flat in secure society. Low maintenance." },
  { name: "Ashok Kumar", phone: "9815301007", email: "ashok.k.ldh@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — BRS Nagar", budgetMin: 5500000, budgetMax: 9000000, timeline: "1-3 months", status: "contacted", source: "WhatsApp", notes: "Runs tuition center. Wants ground floor flat. Can use one room for coaching. Society that allows it." },

  // Dugri
  { name: "Balbir Singh", phone: "9872301008", email: "balbir.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Dugri", budgetMin: 4000000, budgetMax: 7000000, timeline: "Immediately", status: "new", source: "Public Form", notes: "Auto parts shop owner in Dugri market. Wants home near shop. Walking distance. Family of 6." },
  { name: "Kuljeet Kaur", phone: "9814301009", email: "kuljeet.k@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Ludhiana — Dugri", budgetMin: 5000000, budgetMax: 9000000, timeline: "3-6 months", status: "interested", source: "99acres", notes: "Wants MC approved plot in Dugri Phase 2. 150-200 sq yard. Will build 2-story. Ground for parents, first for self." },

  // Pakhowal Road
  { name: "Vivek Goyal", phone: "9876301010", email: "vivek.goyal@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — Pakhowal Road", budgetMin: 25000000, budgetMax: 45000000, timeline: "1-3 months", status: "negotiating", source: "Builder Referral", notes: "Car dealership. Wants 5000+ sq ft showroom on Pakhowal Road. Frontage 50ft minimum. Parking for 20 cars." },
  { name: "Preeti Malhotra", phone: "9815301011", email: "preeti.m@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — Pakhowal Road", budgetMin: 5000000, budgetMax: 10000000, timeline: "3-6 months", status: "interested", source: "Landing Page", notes: "Physiotherapist. Wants clinic space 600-1000 sq ft. Ground floor. Ramp access for wheelchair patients." },

  // Ferozepur Road
  { name: "Jaswant Singh Multani", phone: "9872301012", email: "jaswant.multani@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Ludhiana — Ferozepur Road", budgetMin: 7000000, budgetMax: 12000000, timeline: "1-3 months", status: "contacted", source: "99acres", projects: "Maya Garden, Motiaz Royal Citi", notes: "Joint family. 8 members. Wants 4BHK in society. Kids play area. Shopping complex nearby. Temple in society." },
  { name: "Kamini Devi", phone: "9814301013", email: "kamini.devi@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — Ferozepur Road", budgetMin: 2500000, budgetMax: 4500000, timeline: "Immediately", status: "new", source: "WhatsApp", notes: "Retired schoolteacher. Pension 25K. Wants quiet affordable flat. Near temple and park. Ground floor only." },

  // Chandigarh Road
  { name: "Jagmohan Singh", phone: "9876301014", email: "jagmohan.s@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Chandigarh Road", budgetMin: 6000000, budgetMax: 11000000, timeline: "3-6 months", status: "interested", source: "Housing.com", projects: "Omaxe Royal Residency, Hero Homes", notes: "Software engineer at TCS (remote). Wants modern flat with fiber internet. Near IT Park for co-working." },
  { name: "Harleen Sandhu", phone: "9815301015", email: "harleen.sandhu@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Ludhiana — Chandigarh Road", budgetMin: 9000000, budgetMax: 16000000, timeline: "1-3 months", status: "site-visit", source: "Client Referral", notes: "NRI from Norway. Daughter studying at LPU. Wants large flat for family visits. Brand new construction only." },

  // Haibowal
  { name: "Balraj Singh", phone: "9872301016", email: "balraj.s@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — Haibowal", budgetMin: 2000000, budgetMax: 3800000, timeline: "1-3 months", status: "new", source: "Facebook Ads", notes: "Dairy farm worker. Saving for 10 years. First home. PMAY eligible. Near Haibowal Dairy Complex. Ground floor." },
  { name: "Kiran Bala", phone: "9814301017", email: "kiran.bala@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Haibowal", budgetMin: 3500000, budgetMax: 6000000, timeline: "6-12 months", status: "contacted", source: "Landing Page", notes: "Husband is truck driver. Wants secure flat for family while husband travels. Near school. Low maintenance." },

  // Focal Point
  { name: "Gurlal Singh", phone: "9876301018", email: "gurlal.s@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — Focal Point", budgetMin: 18000000, budgetMax: 35000000, timeline: "Immediately", status: "negotiating", source: "99acres", notes: "Sewing machine parts manufacturer. Expanding from Phase 5. Needs 10000 sq ft shed. Overhead crane provision." },
  { name: "Rohit Kalra", phone: "9815301019", email: "rohit.kalra@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — Focal Point", budgetMin: 6000000, budgetMax: 12000000, timeline: "3-6 months", status: "interested", source: "Builder Referral", notes: "Packaging unit. Needs 3000-5000 sq ft shed. Phase 7 or 8. Power backup essential. Godown attached." },

  // Civil Lines
  { name: "Justice Surinder Kaur (Retd)", phone: "9872301020", email: "surinder.justice@gmail.com", leadType: "buyer", propertyType: "Villa", area: "Ludhiana — Civil Lines", budgetMin: 25000000, budgetMax: 45000000, timeline: "3-6 months", status: "interested", source: "Client Referral", notes: "Retired High Court judge. Wants prestigious bungalow in Civil Lines. 400+ sq yard. Library room mandatory." },

  // Rajguru Nagar
  { name: "Sukhmani Kaur", phone: "9814301021", email: "sukhmani.k@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Rajguru Nagar", budgetMin: 4000000, budgetMax: 7000000, timeline: "1-3 months", status: "new", source: "Public Form", notes: "PAU research scholar. Husband is lecturer. Want permanent home near PAU campus. Society with park." },

  // Giaspura
  { name: "Sandeep Bhatia", phone: "9876301022", email: "sandeep.bhatia@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Ludhiana — Giaspura", budgetMin: 3000000, budgetMax: 6000000, timeline: "6-12 months", status: "contacted", source: "99acres", notes: "Investor. Wants to build 4 one-room sets near LPU for student rental. ROI 10-12% target. 150 sq yard." },

  // Jawaddi
  { name: "Gurmukh Kaur", phone: "9815301023", email: "gurmukh.k@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — Jawaddi", budgetMin: 3000000, budgetMax: 5000000, timeline: "Immediately", status: "interested", source: "WhatsApp", notes: "Husband works at Hero Cycles. Wants flat near Jawaddi Taksal gurudwara. Religious family. Park nearby." },

  // Sherpur
  { name: "Raman Kumar", phone: "9872301024", email: "raman.k@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — Sherpur", budgetMin: 10000000, budgetMax: 20000000, timeline: "1-3 months", status: "site-visit", source: "Housing.com", notes: "Bicycle rim manufacturer. Needs industrial plot 5000-7000 sq ft. Near Sherpur industrial area. Rail siding nearby." },

  // Hambran Road
  { name: "Gaganpreet Singh", phone: "9814301025", email: "gaganpreet.s@gmail.com", leadType: "buyer", propertyType: "4BHK", area: "Ludhiana — Hambran Road", budgetMin: 6000000, budgetMax: 10000000, timeline: "3-6 months", status: "new", source: "Facebook Ads", projects: "SBP Gateway, GBP Eco Greens", notes: "Zomato delivery franchise owner. 3 kids. Needs big home. Wants gated society with sports facility." },

  // Gill Road (New)
  { name: "Harmeet Singh Gill", phone: "9876301026", email: "harmeet.gill@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Gill Road", budgetMin: 5000000, budgetMax: 9000000, timeline: "1-3 months", status: "interested", source: "99acres", notes: "Runs gym on Gill Road. Wants home nearby. Ground floor preference. Space for home gym setup in extra room." },
  { name: "Manpreet Kaur Bajwa", phone: "9815301027", email: "manpreet.bajwa@gmail.com", leadType: "buyer", propertyType: "Commercial", area: "Ludhiana — Gill Road", budgetMin: 8000000, budgetMax: 16000000, timeline: "3-6 months", status: "contacted", source: "Landing Page", notes: "Wants space for women's boutique + tailoring. 1000-1500 sq ft. Gill Road for women customer traffic." },

  // Shimlapuri (New)
  { name: "Sunny Kumar", phone: "9872301028", email: "sunny.k.ldh@gmail.com", leadType: "buyer", propertyType: "2BHK", area: "Ludhiana — Shimlapuri", budgetMin: 2000000, budgetMax: 3500000, timeline: "Immediately", status: "new", source: "WhatsApp", notes: "Knitting machine operator. Night shift. Wants affordable flat close to Shimlapuri hosiery units. First home." },

  // Ludhiana — Jassian Road (New)
  { name: "Amanpreet Singh", phone: "9814301029", email: "amanpreet.s@gmail.com", leadType: "buyer", propertyType: "Plot", area: "Ludhiana — Jassian Road", budgetMin: 4000000, budgetMax: 8000000, timeline: "6-12 months", status: "interested", source: "Facebook Ads", notes: "Young CA. Wants to invest in plot on Jassian Road. Upcoming area near IT City. 200 sq yard. MC approved." },

  // Ludhiana — Ferozpur Road Extension (New)
  { name: "Harjinder Kaur Multani", phone: "9876301030", email: "harjinder.multani@gmail.com", leadType: "buyer", propertyType: "3BHK", area: "Ludhiana — Ferozpur Road Extension", budgetMin: 4500000, budgetMax: 7500000, timeline: "3-6 months", status: "contacted", source: "Public Form", projects: "Sushma Joynest, Maya Garden City 2", notes: "Husband posted in BSF. Wants safe society for family. CCTV and security guard. Near school and hospital." },
];

const now = Date.now();
let count = 0;

[...patiala, ...ludhiana].forEach(b => {
  const offset = Math.floor(Math.random() * 45 * 24 * 60 * 60 * 1000);
  db.createLead({ ...b, createdAt: now - offset });
  count++;
});

console.log(`Seeded ${count} additional leads (${patiala.length} Patiala + ${ludhiana.length} Ludhiana)`);
