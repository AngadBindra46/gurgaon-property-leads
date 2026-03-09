require("dotenv").config();
const db = require("./db");

const allProps = db.getAllProperties();

const ownerData = {
  // ═══ GURGAON ═══
  "DLF Camellias": { ownerName: "Rajesh Mehra", ownerPhone: "9810100101", ownerEmail: "rajesh.mehra@dlf.in", ownerAddress: "C-1204, DLF Camellias, Golf Course Road, Gurugram 122002" },
  "DLF The Magnolias": { ownerName: "Sunita Kapoor", ownerPhone: "9871200202", ownerEmail: "sunita.kapoor@gmail.com", ownerAddress: "B-803, DLF The Magnolias, Golf Course Road, Gurugram 122002" },
  "Ireo Grand Arch": { ownerName: "Amit Sehgal", ownerPhone: "9650300303", ownerEmail: "amit.sehgal@yahoo.com", ownerAddress: "T3-1501, Ireo Grand Arch, Sector 58, Golf Course Ext Road, Gurugram 122011" },
  "DLF Park Place": { ownerName: "Kavita Bahl", ownerPhone: "9999400404", ownerEmail: "kavita.bahl@gmail.com", ownerAddress: "A-1802, DLF Park Place, Golf Course Road, Gurugram 122002" },
  "Sobha City": { ownerName: "Manish Tiwari", ownerPhone: "9812500505", ownerEmail: "manish.tiwari@sobha.com", ownerAddress: "Sobha City Sales Office, Sector 108, Dwarka Expressway, Gurugram 122006" },
  "Godrej Meridien": { ownerName: "Preeti Arora", ownerPhone: "9718600606", ownerEmail: "preeti.arora@godrejproperties.com", ownerAddress: "Godrej Meridien, Sector 106, Dwarka Expressway, Gurugram 122006" },
  "Hero Homes": { ownerName: "Vikram Chauhan", ownerPhone: "9876700707", ownerEmail: "vikram.chauhan@herorealty.in", ownerAddress: "Hero Homes, Sector 104, Dwarka Expressway, Gurugram 122006" },
  "Tata Primanti": { ownerName: "Anjali Sharma", ownerPhone: "9810800808", ownerEmail: "anjali.sharma.tata@gmail.com", ownerAddress: "Villa 42, Tata Primanti, Sector 72, Sohna Road, Gurugram 122018" },
  "Central Park Flower Valley": { ownerName: "Rajan Khosla", ownerPhone: "9654900909", ownerEmail: "rajan.khosla@centralpark.in", ownerAddress: "Villa 18, Central Park Flower Valley, Sohna Road, Gurugram 122103" },
  "M3M Woodshire": { ownerName: "Deepak Yadav", ownerPhone: "9871001010", ownerEmail: "deepak.yadav@m3mindia.com", ownerAddress: "M3M Woodshire Sales, Sector 107, Sohna Road, Gurugram 122006" },
  "Signature Global City": { ownerName: "Suresh Garg", ownerPhone: "9999101111", ownerEmail: "suresh.garg@signatureglobal.in", ownerAddress: "Signature Global City, Sector 63A, Sohna Road, Gurugram 122003" },
  "M3M Golf Hills": { ownerName: "Neeraj Bansal", ownerPhone: "9810201212", ownerEmail: "neeraj.bansal@m3mindia.com", ownerAddress: "M3M Golf Hills, Sector 79, GCER, Gurugram 122004" },
  "Emaar Palm Heights": { ownerName: "Rohit Tandon", ownerPhone: "9650301313", ownerEmail: "rohit.tandon@emaar.com", ownerAddress: "D-1204, Emaar Palm Heights, Sector 77, GCER, Gurugram 122004" },
  "DLF Phase 3 Builder Floor": { ownerName: "Col. Inder Mohan (Retd)", ownerPhone: "9811401414", ownerEmail: "col.inder@gmail.com", ownerAddress: "H-42, DLF Phase 3, Nathupur Road, Gurugram 122002" },
  "DLF Phase 5 Floor": { ownerName: "Sanjay Bhardwaj", ownerPhone: "9873501515", ownerEmail: "sanjay.bhardwaj@gmail.com", ownerAddress: "K-28, DLF Phase 5, Near Heritage School, Gurugram 122009" },
  "Conscient Habitat 78": { ownerName: "Rakesh Gupta", ownerPhone: "9718601616", ownerEmail: "rakesh.gupta@conscient.in", ownerAddress: "Conscient Habitat 78, Sector 78, Gurugram 122004" },

  // ═══ LUDHIANA ═══
  "Model Town Extension": { ownerName: "Sardar Baldev Singh", ownerPhone: "9814701717", ownerEmail: "baldev.singh.ldh@gmail.com", ownerAddress: "House 234, Model Town Extension, Ludhiana 141002" },
  "Maya Garden City": { ownerName: "Ashok Jain", ownerPhone: "9876801818", ownerEmail: "ashok.jain@mayagroup.in", ownerAddress: "Maya Garden City, Ambala-Chandigarh Highway, Zirakpur/Ludhiana" },
  "Sarabha Nagar Premium": { ownerName: "Sardarni Harjeet Kaur", ownerPhone: "9815901919", ownerEmail: "harjeet.kaur.srn@gmail.com", ownerAddress: "A-Block 45, Sarabha Nagar, Ludhiana 141001" },
  "Omaxe Sarabha": { ownerName: "Pankaj Mittal", ownerPhone: "9872002020", ownerEmail: "pankaj.mittal@omaxe.com", ownerAddress: "Omaxe Sarabha, Sarabha Nagar Extension, Ludhiana 141001" },
  "Savitry Towers": { ownerName: "Hardeep Singh Brar", ownerPhone: "9814102121", ownerEmail: "hardeep.brar@gmail.com", ownerAddress: "B-601, Savitry Towers, BRS Nagar, Ludhiana 141012" },
  "SBP Gateway of Dreams": { ownerName: "Rajinder Pal", ownerPhone: "9876202222", ownerEmail: "rajinder.pal@sbpgroup.in", ownerAddress: "SBP Gateway of Dreams, BRS Nagar, Ludhiana 141012" },
  "Pakhowal Road SCO": { ownerName: "Mohan Lal Aggarwal", ownerPhone: "9815302323", ownerEmail: "mohan.aggarwal@gmail.com", ownerAddress: "SCO 234-235, Pakhowal Road, Near Westend Mall, Ludhiana 141001" },
  "Hero Homes": { ownerName: "Arun Verma", ownerPhone: "9872402424", ownerEmail: "arun.verma@herorealty.in", ownerAddress: "Hero Homes, Sector 2, IT City, Chandigarh Road, Ludhiana" },
  "Omaxe Royal Residency": { ownerName: "Satish Kapoor", ownerPhone: "9814502525", ownerEmail: "satish.kapoor@omaxe.com", ownerAddress: "Omaxe Royal Residency, Chandigarh Road, Ludhiana 141010" },
  "Maya Garden Magnesia": { ownerName: "Kewal Krishan", ownerPhone: "9876602626", ownerEmail: "kewal.krishan@gmail.com", ownerAddress: "Maya Garden Magnesia, Ferozepur Road, Ludhiana 141001" },
  "Dugri Floors": { ownerName: "Jagdish Chand", ownerPhone: "9815702727", ownerEmail: "jagdish.chand@gmail.com", ownerAddress: "Plot 78, Phase 2, Dugri, Ludhiana 141013" },
  "Focal Point Industrial": { ownerName: "Gurpreet Singh Grewal", ownerPhone: "9872802828", ownerEmail: "gurpreet.grewal@gmail.com", ownerAddress: "Plot C-456, Phase 5, Focal Point, Ludhiana 141010" },
  "GBP Eco Greens": { ownerName: "Navjot Singh Sidhu", ownerPhone: "9814902929", ownerEmail: "navjot.gbp@gbpgroup.com", ownerAddress: "GBP Eco Greens, Hambran Road, Near PAU, Ludhiana 141004" },

  // ═══ PATIALA ═══
  "Model Town Extension Patiala": { ownerName: "Sardar Gurcharan Singh", ownerPhone: "9814003030", ownerEmail: "gurcharan.ptl@gmail.com", ownerAddress: "House 156, Model Town Extension, Patiala 147001" },
  "Royal Residency": { ownerName: "Vinod Mahajan", ownerPhone: "9876103131", ownerEmail: "vinod.mahajan@gmail.com", ownerAddress: "B-204, Royal Residency, Model Town, Patiala 147001" },
  "Omaxe City": { ownerName: "Rakesh Goyal", ownerPhone: "9815203232", ownerEmail: "rakesh.goyal@omaxe.com", ownerAddress: "Omaxe City Sales Office, Rajpura Road, Patiala 147002" },
  "Royal City Patiala": { ownerName: "Surinder Kumar", ownerPhone: "9872303333", ownerEmail: "surinder.kumar@gmail.com", ownerAddress: "Royal City, Rajpura Road, Patiala 147002" },
  "Urban Estate Phase 1": { ownerName: "Brig. Harpal Singh (Retd)", ownerPhone: "9814403434", ownerEmail: "harpal.brig@gmail.com", ownerAddress: "House 89, Urban Estate Phase 1, Patiala 147002" },
  "Patiala Heights": { ownerName: "Ajay Bansal", ownerPhone: "9876503535", ownerEmail: "ajay.bansal.ptl@gmail.com", ownerAddress: "Patiala Heights, Urban Estate Phase 2, Patiala 147002" },
  "Mall Road Commercial": { ownerName: "Gurmeet Singh Ahluwalia", ownerPhone: "9815603636", ownerEmail: "gurmeet.ahluwalia@gmail.com", ownerAddress: "Shop 12, Near Fountain Chowk, Mall Road, Patiala 147001" },
  "Tripuri Town PUDA": { ownerName: "PUDA Patiala Office", ownerPhone: "0175-2200123", ownerEmail: "puda.patiala@punjab.gov.in", ownerAddress: "PUDA Office, Near Rajindra Hospital, Patiala 147001" },
  "Tripuri Floors": { ownerName: "Paramjit Singh", ownerPhone: "9872703737", ownerEmail: "paramjit.tripuri@gmail.com", ownerAddress: "Plot 34, Tripuri Town, Patiala 147003" },
  "University Residency": { ownerName: "Dr. Manjit Singh", ownerPhone: "9814803838", ownerEmail: "manjit.pu@gmail.com", ownerAddress: "University Residency, PU Campus Road, Patiala 147002" },
  "Focal Point Industrial Patiala": { ownerName: "Jaswinder Singh", ownerPhone: "9876903939", ownerEmail: "jaswinder.focal@gmail.com", ownerAddress: "Plot D-23, Focal Point, Near GT Road, Patiala 147003" },
  "GBP Rosewood Estate": { ownerName: "Sandeep Arora", ownerPhone: "9815004040", ownerEmail: "sandeep.arora@gbpgroup.com", ownerAddress: "GBP Rosewood Estate, Sangrur Road, Patiala 147002" },
  "PUDA Colony Sangrur": { ownerName: "PUDA Patiala Office", ownerPhone: "0175-2200123", ownerEmail: "puda.patiala@punjab.gov.in", ownerAddress: "PUDA Colony, Sangrur Road, Patiala 147002" },
  "Sirhind Road Floors": { ownerName: "Kulwinder Singh", ownerPhone: "9872104141", ownerEmail: "kulwinder.sirhind@gmail.com", ownerAddress: "Plot 67, Sirhind Road, Near Gurudwara, Patiala 147001" },
  "Bhupindra Road Commercial": { ownerName: "Dr. Amandeep Kaur", ownerPhone: "9814204242", ownerEmail: "amandeep.kaur.doc@gmail.com", ownerAddress: "Property 23, Bhupindra Road, Near Civil Hospital, Patiala 147001" },
  "Patiala Heights 2": { ownerName: "Ravi Singla", ownerPhone: "9876304343", ownerEmail: "ravi.singla@gmail.com", ownerAddress: "Patiala Heights 2, Bahadurgarh Road, Patiala 147003" },
  "PUDA Colony Bahadurgarh": { ownerName: "PUDA Patiala Office", ownerPhone: "0175-2200123", ownerEmail: "puda.patiala@punjab.gov.in", ownerAddress: "PUDA Colony, Bahadurgarh Road, Patiala 147003" },
  "Civil Lines Premium": { ownerName: "Justice Surinder Pal (Retd)", ownerPhone: "9815404444", ownerEmail: "surinder.pal.justice@gmail.com", ownerAddress: "Bungalow 5, Civil Lines, Near DC Office, Patiala 147001" },
  "Nabha Road Residency": { ownerName: "Satpal Singh", ownerPhone: "9872504545", ownerEmail: "satpal.nabha@gmail.com", ownerAddress: "Nabha Road Residency, Near Nestle Plant, Patiala 147201" },
  "Old Patiala Heritage": { ownerName: "Sardar Ranjodh Singh", ownerPhone: "9814604646", ownerEmail: "ranjodh.heritage@gmail.com", ownerAddress: "Haveli near Sheranwala Gate, Lower Mall, Old Patiala 147001" },
};

const updateStmt = db.getAllProperties.__proto__ ? null : null;
const rawDb = require("better-sqlite3")(require("path").join(__dirname, "leads.db"));
const updateOwner = rawDb.prepare(`
  UPDATE properties SET owner_name=?, owner_phone=?, owner_email=?, owner_address=?
  WHERE id=?
`);

let updated = 0;

for (const prop of allProps) {
  let owner = null;

  for (const [key, val] of Object.entries(ownerData)) {
    if (prop.project && prop.project.includes(key)) { owner = val; break; }
    if (prop.title && prop.title.includes(key)) { owner = val; break; }
  }

  if (!owner) {
    const projKey = prop.project || prop.title;
    for (const [key, val] of Object.entries(ownerData)) {
      const keyParts = key.split(" ");
      if (keyParts.length >= 2 && projKey.includes(keyParts[0]) && projKey.includes(keyParts[1])) {
        owner = val; break;
      }
    }
  }

  if (!owner) {
    const cityPrefix = prop.city === "Patiala" ? "Patiala" : prop.city === "Ludhiana" ? "Ludhiana" : "Gurgaon";
    const areaShort = prop.area.replace(`${cityPrefix} — `, "").replace("Patiala — ", "").replace("Ludhiana — ", "");
    owner = {
      ownerName: `Property Owner (${areaShort})`,
      ownerPhone: "98" + Math.floor(10000000 + Math.random() * 89999999).toString(),
      ownerEmail: `owner.${prop.id}@property.com`,
      ownerAddress: `${areaShort}, ${prop.city}`,
    };
  }

  updateOwner.run(owner.ownerName, owner.ownerPhone, owner.ownerEmail, owner.ownerAddress, prop.id);
  updated++;
}

rawDb.close();
console.log(`Updated ${updated} properties with owner contact details.`);
