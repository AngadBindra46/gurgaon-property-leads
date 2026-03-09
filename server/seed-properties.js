require("dotenv").config();
const db = require("./db");

const properties = [
  // ═══════════════ GURGAON ═══════════════
  // Golf Course Road
  { title: "DLF Camellias — 4BHK Luxury Apartment", project: "DLF The Camellias", developer: "DLF Ltd", propertyType: "4BHK", bedrooms: "4", area: "Golf Course Road", city: "Gurgaon", price: 85000000, pricePerSqft: 32000, carpetArea: "2650 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2018-0001", amenities: "Private lift lobby, Italian marble, Club, Pool, Gym, Concierge, Valet parking", description: "Ultra-luxury 4BHK in Gurgaon's most iconic address. Sky garden, private lift, panoramic golf course views." },
  { title: "DLF The Magnolias — 3BHK Penthouse", project: "DLF The Magnolias", developer: "DLF Ltd", propertyType: "3BHK", bedrooms: "3", area: "Golf Course Road", city: "Gurgaon", price: 45000000, pricePerSqft: 28000, carpetArea: "1600 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2017-0088", amenities: "Terrace, Club, Infinity pool, Home automation, Power backup", description: "Premium 3BHK in Magnolias with terrace rights. Walking distance to DLF Golf Club." },
  { title: "Ireo Grand Arch — 3BHK High-Rise", project: "Ireo Grand Arch", developer: "Ireo", propertyType: "3BHK", bedrooms: "3", area: "Golf Course Road", city: "Gurgaon", price: 32000000, pricePerSqft: 18000, carpetArea: "1780 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2019-0245", amenities: "Clubhouse, Pool, Squash court, Jogging track, Kids area", description: "Spacious 3BHK with golf course views. Well-maintained society. Near Rapid Metro." },
  { title: "DLF Park Place — 4BHK Premium Floor", project: "DLF Park Place", developer: "DLF Ltd", propertyType: "4BHK", bedrooms: "4", area: "Golf Course Road", city: "Gurgaon", price: 62000000, pricePerSqft: 24000, carpetArea: "2580 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2018-0156", amenities: "Clubhouse, Tennis court, Pool, Gym, Kids zone, Power backup", description: "Luxurious 4BHK at DLF Park Place. Corner unit, cross-ventilation, servant quarter." },

  // Dwarka Expressway
  { title: "Sobha City — 3BHK Modern Flat", project: "Sobha City", developer: "Sobha Ltd", propertyType: "3BHK", bedrooms: "3", area: "Dwarka Expressway", city: "Gurgaon", price: 14500000, pricePerSqft: 9800, carpetArea: "1480 sq ft", status: "available", possession: "Dec 2026", reraId: "HRERA-GGM-2020-0412", amenities: "Club, Pool, Gym, Jogging track, Badminton, EV charging", description: "Premium 3BHK by Sobha. Near metro. Smart home features. East-facing balcony." },
  { title: "Godrej Meridien — 3BHK Tower", project: "Godrej Meridien", developer: "Godrej Properties", propertyType: "3BHK", bedrooms: "3", area: "Dwarka Expressway", city: "Gurgaon", price: 16500000, pricePerSqft: 10500, carpetArea: "1570 sq ft", status: "available", possession: "Mar 2027", reraId: "HRERA-GGM-2021-0189", amenities: "Golf putting, Pool, Gym, Meditation, Co-working, Kids zone", description: "Luxury 3BHK by Godrej. Airport connectivity. Multiple balconies. High ceilings." },
  { title: "Hero Homes — 2BHK Affordable", project: "Hero Homes", developer: "Hero Realty", propertyType: "2BHK", bedrooms: "2", area: "Dwarka Expressway", city: "Gurgaon", price: 7200000, pricePerSqft: 7200, carpetArea: "1000 sq ft", status: "available", possession: "Jun 2026", reraId: "HRERA-GGM-2022-0567", amenities: "Club, Pool, Park, Jogging track, Power backup", description: "Affordable 2BHK near Dwarka Expressway metro. PMAY eligible. Vastu compliant." },
  { title: "Tata Primanti — 4BHK with Garden", project: "Tata Primanti", developer: "Tata Housing", propertyType: "4BHK", bedrooms: "4", area: "Dwarka Expressway", city: "Gurgaon", price: 22000000, pricePerSqft: 11000, carpetArea: "2000 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2019-0334", amenities: "Private garden, Club, Pool, Tennis, Basketball, Jogging trail", description: "Premium 4BHK with attached private garden. Gated community. 15 acres of greens." },

  // Sohna Road
  { title: "Central Park Flower Valley — 3BHK Villa Plot", project: "Central Park Flower Valley", developer: "Central Park", propertyType: "Villa", bedrooms: "3", area: "Sohna Road", city: "Gurgaon", price: 25000000, pricePerSqft: 8500, carpetArea: "2950 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2019-0078", amenities: "Private garden, Club, Pool, Yoga, Meditation, Cycling track", description: "Independent villa in 500-acre township. Eco-friendly. Surrounded by Aravallis." },
  { title: "M3M Woodshire — 2BHK Value Buy", project: "M3M Woodshire", developer: "M3M Group", propertyType: "2BHK", bedrooms: "2", area: "Sohna Road", city: "Gurgaon", price: 6500000, pricePerSqft: 6800, carpetArea: "955 sq ft", status: "available", possession: "Sep 2026", reraId: "HRERA-GGM-2021-0456", amenities: "Club, Pool, Park, Gym, Kids area, Power backup", description: "Affordable 2BHK on Sohna Road. EV charging. Near Maruti plant. Good rental potential." },
  { title: "Signature Global City — 3BHK", project: "Signature Global City", developer: "Signature Global", propertyType: "3BHK", bedrooms: "3", area: "Sohna Road", city: "Gurgaon", price: 9800000, pricePerSqft: 7500, carpetArea: "1305 sq ft", status: "available", possession: "Dec 2026", reraId: "HRERA-GGM-2022-0234", amenities: "Club, Pool, Gym, Cricket pitch, Amphitheatre, Shopping", description: "Mid-segment 3BHK on Sohna Road. 20-acre township. Near KMP Expressway junction." },

  // GCER
  { title: "M3M Golf Hills — 4BHK Premium", project: "M3M Golf Hills", developer: "M3M Group", propertyType: "4BHK", bedrooms: "4", area: "Golf Course Ext Road (GCER)", city: "Gurgaon", price: 38000000, pricePerSqft: 16000, carpetArea: "2375 sq ft", status: "available", possession: "Jun 2027", reraId: "HRERA-GGM-2023-0112", amenities: "Golf simulator, Club, Pool, Co-working, Sky lounge, Pet park", description: "Ultra-modern 4BHK on GCER. Triple-height lobby. Smart home. Facing greens." },
  { title: "Emaar Palm Heights — 3BHK", project: "Emaar Palm Heights", developer: "Emaar India", propertyType: "3BHK", bedrooms: "3", area: "Golf Course Ext Road (GCER)", city: "Gurgaon", price: 19500000, pricePerSqft: 12500, carpetArea: "1560 sq ft", status: "available", possession: "Ready to Move", reraId: "HRERA-GGM-2018-0289", amenities: "Club, Pool, Gym, Tennis, Badminton, Kids play, Power backup", description: "Well-maintained 3BHK by Emaar. Park-facing. Close to Rapid Metro station." },

  // DLF Phases
  { title: "DLF Phase 3 — Independent Floor 400 Sq Yd", project: "DLF Phase 3 Builder Floor", developer: "Private", propertyType: "4BHK", bedrooms: "4", area: "DLF Phase 3", city: "Gurgaon", price: 48000000, pricePerSqft: 15000, carpetArea: "3200 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Private lift, Terrace, 2 parking, Servant quarter, Modular kitchen", description: "Luxurious independent floor on 400 sq yard plot. First floor with terrace rights. Near Galleria Market." },
  { title: "DLF Phase 5 — Builder Floor 300 Sq Yd", project: "DLF Phase 5 Floor", developer: "Private", propertyType: "4BHK", bedrooms: "4", area: "DLF Phase 5", city: "Gurgaon", price: 55000000, pricePerSqft: 18000, carpetArea: "3050 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Private lift, Garden, Parking x3, Servant room, Italian marble", description: "Premium builder floor in DLF Phase 5. Near Heritage School and DLF Club." },

  // New Gurgaon
  { title: "Conscient Habitat 78 — 3BHK Affordable", project: "Conscient Habitat 78", developer: "Conscient", propertyType: "3BHK", bedrooms: "3", area: "Sector 82-89", city: "Gurgaon", price: 9200000, pricePerSqft: 7000, carpetArea: "1315 sq ft", status: "available", possession: "Mar 2026", reraId: "HRERA-GGM-2021-0678", amenities: "Club, Pool, Gym, Jogging, Kids area, Solar panels", description: "Affordable luxury 3BHK in Sector 78. Near NH-8. Under-construction, great appreciation potential." },

  // ═══════════════ LUDHIANA ═══════════════
  // Model Town
  { title: "Model Town Ext — 300 Sq Yd Kothi", project: "Model Town Extension", developer: "Private", propertyType: "Villa", bedrooms: "5", area: "Ludhiana — Model Town", city: "Ludhiana", price: 22000000, pricePerSqft: 0, carpetArea: "300 sq yard", status: "available", possession: "Ready to Move", reraId: "", amenities: "Modular kitchen, RO, AC (5 units), Marble flooring, Covered parking x2", description: "Spacious 5BHK kothi in Model Town Extension. Double-story with basement. Renovated 2024." },
  { title: "Maya Garden City — 3BHK Flat", project: "Maya Garden City", developer: "Maya Group", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — Model Town", city: "Ludhiana", price: 9500000, pricePerSqft: 5800, carpetArea: "1640 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2019-0234", amenities: "Club, Pool, Gym, Badminton, Park, Power backup, Security", description: "Premium 3BHK in gated society near Model Town. 24x7 security. Walking distance to market." },

  // Sarabha Nagar
  { title: "Sarabha Nagar — 500 Sq Yd Mansion", project: "Sarabha Nagar Premium", developer: "Private", propertyType: "Villa", bedrooms: "6+", area: "Ludhiana — Sarabha Nagar", city: "Ludhiana", price: 55000000, pricePerSqft: 0, carpetArea: "500 sq yard", status: "available", possession: "Ready to Move", reraId: "", amenities: "Lift, Italian marble, Central AC, Modular kitchen, Covered parking x4, CCTV", description: "Elite 6BHK mansion in Sarabha Nagar. Triple-story with lift. Corner plot. Grand entrance." },
  { title: "Sarabha Nagar — 3BHK Luxury Flat", project: "Omaxe Sarabha", developer: "Omaxe", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — Sarabha Nagar", city: "Ludhiana", price: 14000000, pricePerSqft: 7200, carpetArea: "1945 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2020-0089", amenities: "Club, Pool, Gym, Park, Power backup, Security", description: "Luxury 3BHK flat in Sarabha Nagar society. Near DMCH. Top floor with terrace." },

  // BRS Nagar
  { title: "Savitry Towers — 3BHK", project: "Savitry Towers", developer: "Savitry Group", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — BRS Nagar", city: "Ludhiana", price: 7800000, pricePerSqft: 5200, carpetArea: "1500 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2019-0456", amenities: "Club, Gym, Park, Power backup, Parking, Security guard", description: "Well-maintained 3BHK in gated society. BRS Nagar location. Near schools and markets." },
  { title: "SBP Gateway — 2BHK Affordable", project: "SBP Gateway of Dreams", developer: "SBP Group", propertyType: "2BHK", bedrooms: "2", area: "Ludhiana — BRS Nagar", city: "Ludhiana", price: 5200000, pricePerSqft: 4500, carpetArea: "1155 sq ft", status: "available", possession: "Jun 2026", reraId: "PBRERA-LDH-2022-0345", amenities: "Club, Park, Gym, Kids area, CCTV, Power backup", description: "Affordable 2BHK near BRS Nagar. Under-construction. Good for first-time buyers." },

  // Pakhowal Road
  { title: "SCO on Pakhowal Road — Commercial", project: "Pakhowal Road SCO", developer: "Private", propertyType: "Commercial", bedrooms: "", area: "Ludhiana — Pakhowal Road", city: "Ludhiana", price: 28000000, pricePerSqft: 12000, carpetArea: "2335 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Lift, Parking, Power backup, Road frontage 40ft", description: "Prime SCO on Pakhowal Road. Ground + First floor. High footfall location. Near NRI market." },

  // Chandigarh Road
  { title: "Hero Homes Ludhiana — 3BHK", project: "Hero Homes", developer: "Hero Realty", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — Chandigarh Road", city: "Ludhiana", price: 8800000, pricePerSqft: 5500, carpetArea: "1600 sq ft", status: "available", possession: "Dec 2026", reraId: "PBRERA-LDH-2022-0567", amenities: "Club, Pool, Gym, Co-working, Kids zone, EV charging", description: "Modern 3BHK on Chandigarh Road. Near IT Park. Great for IT professionals." },
  { title: "Omaxe Royal Residency — 4BHK", project: "Omaxe Royal Residency", developer: "Omaxe", propertyType: "4BHK", bedrooms: "4", area: "Ludhiana — Chandigarh Road", city: "Ludhiana", price: 12500000, pricePerSqft: 6200, carpetArea: "2015 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2019-0678", amenities: "Club, Pool, Gym, Tennis, Badminton, Jogging track, Temple", description: "Spacious 4BHK in Omaxe. Established society on Chandigarh Road. Near highway." },

  // Ferozepur Road
  { title: "Maya Garden Magnesia — 3BHK", project: "Maya Garden Magnesia", developer: "Maya Group", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — Ferozepur Road", city: "Ludhiana", price: 7200000, pricePerSqft: 4800, carpetArea: "1500 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-LDH-2020-0234", amenities: "Club, Park, Temple, Gym, Shopping, Power backup", description: "Affordable 3BHK on Ferozepur Road. Near bus depot. Good connectivity to all areas." },

  // Dugri
  { title: "Dugri Phase 2 — 2BHK Builder Floor", project: "Dugri Floors", developer: "Private", propertyType: "2BHK", bedrooms: "2", area: "Ludhiana — Dugri", city: "Ludhiana", price: 4200000, pricePerSqft: 3800, carpetArea: "1105 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Parking, Power backup, Park nearby, Market walking distance", description: "Affordable 2BHK ground floor in Dugri Phase 2. Near market and school. Ready to move." },

  // Focal Point
  { title: "Focal Point Phase 5 — Industrial Shed", project: "Focal Point Industrial", developer: "PSIEC", propertyType: "Commercial", bedrooms: "", area: "Ludhiana — Focal Point", city: "Ludhiana", price: 18000000, pricePerSqft: 0, carpetArea: "10000 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "3-phase power 100 KVA, Loading dock, Road access, Water supply", description: "Industrial shed in Focal Point Phase 5. Ready for manufacturing. 20ft ceiling height." },

  // Hambran Road
  { title: "GBP Eco Greens — 3BHK", project: "GBP Eco Greens", developer: "GBP Group", propertyType: "3BHK", bedrooms: "3", area: "Ludhiana — Hambran Road", city: "Ludhiana", price: 6500000, pricePerSqft: 4200, carpetArea: "1550 sq ft", status: "available", possession: "Sep 2026", reraId: "PBRERA-LDH-2022-0789", amenities: "Club, Pool, Gym, Cricket pitch, Cycling track, Solar", description: "Green 3BHK on Hambran Road. Near PAU. Eco-friendly construction. 20-acre township." },

  // ═══════════════ PATIALA ═══════════════
  // Model Town
  { title: "Model Town Ext — 350 Sq Yd Kothi", project: "Model Town Extension", developer: "Private", propertyType: "Villa", bedrooms: "5", area: "Patiala — Model Town", city: "Patiala", price: 22000000, pricePerSqft: 0, carpetArea: "350 sq yard", status: "available", possession: "Ready to Move", reraId: "", amenities: "Modular kitchen, AC, Marble flooring, Covered parking x2, Lawn, Boundary wall", description: "Premium 5BHK kothi in Model Town Extension. Double-story. Near Rajindra Hospital." },
  { title: "Model Town — 3BHK Flat in Society", project: "Royal Residency", developer: "Royal Group", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Model Town", city: "Patiala", price: 8500000, pricePerSqft: 5000, carpetArea: "1700 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-PTL-2020-0045", amenities: "Club, Gym, Park, Power backup, Security, CCTV", description: "Well-maintained 3BHK in gated society. Model Town location. Near market and schools." },

  // Rajpura Road
  { title: "Omaxe City Patiala — 3BHK", project: "Omaxe City", developer: "Omaxe", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Rajpura Road", city: "Patiala", price: 6200000, pricePerSqft: 4200, carpetArea: "1475 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-PTL-2019-0123", amenities: "Club, Pool, Gym, Park, Kids area, Shopping complex, Temple", description: "Mid-segment 3BHK in Omaxe City on Rajpura Road. Established township with all amenities." },
  { title: "Royal City — 2BHK Affordable", project: "Royal City Patiala", developer: "Royal Group", propertyType: "2BHK", bedrooms: "2", area: "Patiala — Rajpura Road", city: "Patiala", price: 3800000, pricePerSqft: 3500, carpetArea: "1085 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-PTL-2019-0234", amenities: "Park, Security, Power backup, Community hall, Parking", description: "Affordable 2BHK in Royal City. Near Rajpura Road. PMAY eligible. Ready to move." },

  // Urban Estate
  { title: "Urban Estate Ph-1 — 300 Sq Yd Kothi", project: "Urban Estate Phase 1", developer: "PUDA", propertyType: "Villa", bedrooms: "4", area: "Patiala — Urban Estate Phase 1", city: "Patiala", price: 20000000, pricePerSqft: 0, carpetArea: "300 sq yard", status: "available", possession: "Ready to Move", reraId: "", amenities: "Marble flooring, Modular kitchen, AC, Parking x2, Garden, Boundary wall", description: "Independent 4BHK kothi in Urban Estate Phase 1. PUDA approved. Park-facing. Renovated." },
  { title: "Urban Estate Ph-2 — 2BHK Flat", project: "Patiala Heights", developer: "Private", propertyType: "2BHK", bedrooms: "2", area: "Patiala — Urban Estate Phase 2", city: "Patiala", price: 3500000, pricePerSqft: 3200, carpetArea: "1095 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-PTL-2021-0089", amenities: "Parking, Power backup, Security guard, Park nearby", description: "Affordable 2BHK flat in Urban Estate Phase 2. Near bus stand. PMAY eligible." },

  // Leela Bhawan / Mall Road
  { title: "Mall Road — Commercial Showroom", project: "Mall Road Commercial", developer: "Private", propertyType: "Commercial", bedrooms: "", area: "Patiala — Leela Bhawan / Mall Road", city: "Patiala", price: 25000000, pricePerSqft: 15000, carpetArea: "1670 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "AC, Display window, Road frontage, Parking, Power backup", description: "Prime showroom on Mall Road near Fountain Chowk. High footfall. Ground floor. Glass front." },

  // Tripuri
  { title: "Tripuri Town — 2BHK EWS Flat", project: "Tripuri Town PUDA", developer: "PUDA", propertyType: "2BHK", bedrooms: "2", area: "Patiala — Tripuri", city: "Patiala", price: 2200000, pricePerSqft: 2800, carpetArea: "785 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Parking, Park, Community hall, Water supply, Power backup", description: "EWS/LIG 2BHK flat in Tripuri Town. PMAY subsidy eligible. Basic amenities. Affordable." },
  { title: "Tripuri — 3BHK Builder Floor", project: "Tripuri Floors", developer: "Private", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Tripuri", city: "Patiala", price: 4500000, pricePerSqft: 3500, carpetArea: "1285 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Parking, Park nearby, Market 5 min, School 10 min", description: "Affordable 3BHK first floor in Tripuri. Near market and gurudwara. Good for families." },

  // Punjabi University Area
  { title: "PU Campus Road — 3BHK", project: "University Residency", developer: "Private", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Punjabi University Area", city: "Patiala", price: 7500000, pricePerSqft: 4500, carpetArea: "1665 sq ft", status: "available", possession: "Ready to Move", reraId: "PBRERA-PTL-2021-0156", amenities: "Club, Park, Gym, Security, Power backup, WiFi ready", description: "3BHK near Punjabi University campus. Ideal for faculty. Gated society with garden." },

  // Focal Point
  { title: "Focal Point — Industrial Shed 8000 sqft", project: "Focal Point Industrial", developer: "PSIEC", propertyType: "Commercial", bedrooms: "", area: "Patiala — Focal Point", city: "Patiala", price: 14000000, pricePerSqft: 0, carpetArea: "8000 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "3-phase power 80 KVA, Loading area, Road access, Water", description: "Industrial shed in Patiala Focal Point. Near GT Road. Ready for manufacturing. 18ft ceiling." },

  // Sangrur Road
  { title: "GBP Rosewood Estate — 3BHK", project: "GBP Rosewood Estate", developer: "GBP Group", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Sangrur Road", city: "Patiala", price: 5500000, pricePerSqft: 3800, carpetArea: "1450 sq ft", status: "available", possession: "Dec 2026", reraId: "PBRERA-PTL-2022-0234", amenities: "Club, Park, Gym, Kids area, Temple, Power backup", description: "Affordable 3BHK on Sangrur Road. Gated society. Near highway for easy connectivity." },
  { title: "Sangrur Road — 200 Sq Yd PUDA Plot", project: "PUDA Colony", developer: "PUDA", propertyType: "Plot", bedrooms: "", area: "Patiala — Sangrur Road", city: "Patiala", price: 5000000, pricePerSqft: 0, carpetArea: "200 sq yard", status: "available", possession: "Immediate Registry", reraId: "", amenities: "PUDA approved, MC water, Sewerage, Wide roads, Park", description: "PUDA approved residential plot on Sangrur Road. 200 sq yard. Clear title. Ready for construction." },

  // Sirhind Road
  { title: "Sirhind Road — 3BHK Builder Floor", project: "Sirhind Road Floors", developer: "Private", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Sirhind Road", city: "Patiala", price: 5200000, pricePerSqft: 3600, carpetArea: "1445 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Parking, Park nearby, School nearby, Market 5 min walk", description: "Independent 3BHK first floor on Sirhind Road. Near schools. Family-friendly neighborhood." },

  // Bhupindra Road
  { title: "Bhupindra Road — Commercial Space 2500 sqft", project: "Bhupindra Road Commercial", developer: "Private", propertyType: "Commercial", bedrooms: "", area: "Patiala — Bhupindra Road", city: "Patiala", price: 18000000, pricePerSqft: 7200, carpetArea: "2500 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "AC, Lift, Parking, Road frontage, Power backup, Water", description: "Commercial space on Bhupindra Road. Ground + First floor. Ideal for clinic or office." },

  // Bahadurgarh Road
  { title: "Bahadurgarh Road — 3BHK Society Flat", project: "Patiala Heights 2", developer: "Private", propertyType: "3BHK", bedrooms: "3", area: "Patiala — Bahadurgarh Road", city: "Patiala", price: 4800000, pricePerSqft: 3400, carpetArea: "1410 sq ft", status: "available", possession: "Mar 2026", reraId: "PBRERA-PTL-2023-0078", amenities: "Park, Security, Parking, Power backup, Kids area", description: "Affordable 3BHK in gated society on Bahadurgarh Road. Under-construction. Good schools nearby." },
  { title: "Bahadurgarh Road — 150 Sq Yd PUDA Plot", project: "PUDA Colony", developer: "PUDA", propertyType: "Plot", bedrooms: "", area: "Patiala — Bahadurgarh Road", city: "Patiala", price: 3500000, pricePerSqft: 0, carpetArea: "150 sq yard", status: "available", possession: "Immediate Registry", reraId: "", amenities: "PUDA approved, Wide road, Water, Sewerage, Park", description: "PUDA approved 150 sq yard plot on Bahadurgarh Road. Affordable. Good for custom house construction." },

  // Civil Lines
  { title: "Civil Lines — Heritage Bungalow 500 Sq Yd", project: "Civil Lines Premium", developer: "Private", propertyType: "Villa", bedrooms: "5+", area: "Patiala — Civil Lines", city: "Patiala", price: 35000000, pricePerSqft: 0, carpetArea: "500 sq yard", status: "available", possession: "Ready to Move", reraId: "", amenities: "Garden, Covered parking x3, Servant quarters, Old trees, Boundary wall", description: "Heritage bungalow in Civil Lines. 500 sq yard. Character property with large garden. Near DC office." },

  // Nabha Road
  { title: "Nabha Road — 2BHK Affordable Flat", project: "Nabha Road Residency", developer: "Private", propertyType: "2BHK", bedrooms: "2", area: "Patiala — Nabha Road", city: "Patiala", price: 2800000, pricePerSqft: 3000, carpetArea: "935 sq ft", status: "available", possession: "Ready to Move", reraId: "", amenities: "Parking, Security, Power backup, Park nearby", description: "Budget 2BHK flat on Nabha Road. Near Nestle factory. Good for working professionals." },

  // Lower Mall
  { title: "Lower Mall — Heritage Haveli for Restoration", project: "Old Patiala Heritage", developer: "Private", propertyType: "Villa", bedrooms: "6+", area: "Patiala — Lower Mall / Old Patiala", city: "Patiala", price: 15000000, pricePerSqft: 0, carpetArea: "400 sq yard", status: "available", possession: "Ready to Move", reraId: "", amenities: "Heritage architecture, Large courtyard, Near Qila Mubarak", description: "Historic haveli near Sheranwala Gate. 400 sq yard. Needs restoration. Tourism & heritage potential." },
];

const now = Date.now();
let propCount = 0;

for (const p of properties) {
  const offset = Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000);
  db.createProperty({ ...p, createdAt: now - offset });
  propCount++;
}

console.log(`Seeded ${propCount} properties.`);

// ───────── Auto-link properties to matching leads ─────────

const allLeads = db.getAllLeads();
const allProps = db.getAllProperties();
let linkCount = 0;

for (const lead of allLeads) {
  const matched = allProps.filter(p => {
    if (lead.propertyType === "Commercial" && p.propertyType !== "Commercial") return false;
    if (lead.propertyType === "Plot" && p.propertyType !== "Plot") return false;
    if (lead.propertyType === "Villa" && p.propertyType !== "Villa") return false;

    if (lead.propertyType !== "Commercial" && lead.propertyType !== "Plot" && lead.propertyType !== "Villa") {
      if (p.propertyType === "Commercial" || p.propertyType === "Plot") return false;
      if (lead.propertyType && p.bedrooms && lead.propertyType.replace("BHK","").replace("+","") !== "" ) {
        const leadBed = parseInt(lead.propertyType.replace("BHK","").replace("+",""));
        const propBed = parseInt(p.bedrooms);
        if (leadBed && propBed && Math.abs(leadBed - propBed) > 1) return false;
      }
    }

    const leadAreaLower = (lead.area || "").toLowerCase();
    const propAreaLower = (p.area || "").toLowerCase();
    const leadCityMatch = leadAreaLower.includes("patiala") ? "patiala" : leadAreaLower.includes("ludhiana") ? "ludhiana" : "gurgaon";
    const propCityMatch = propAreaLower.includes("patiala") ? "patiala" : propAreaLower.includes("ludhiana") ? "ludhiana" : "gurgaon";
    if (leadCityMatch !== propCityMatch) return false;

    if (p.price > 0 && lead.budgetMax > 0) {
      if (p.price > lead.budgetMax * 1.15) return false;
      if (p.price < lead.budgetMin * 0.7) return false;
    }

    return true;
  });

  const toLink = matched.slice(0, 4);
  for (const prop of toLink) {
    db.linkProperty(lead.id, prop.id, "auto");
    linkCount++;
  }
}

console.log(`Auto-linked ${linkCount} lead-property matches.`);
