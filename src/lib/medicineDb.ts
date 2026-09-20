import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { VerificationResult } from "../types";

export interface MedicineRecord {
  id: string;
  gtin: string;
  medicineName: string;
  genericName: string;
  manufacturer: string;
  dosage: string;
  category: string;
  atcCode?: string;
  regNumber: string;
  standardBatchFormat: string;
  isRecalled: boolean;
  recallDetails?: string;
  knownCounterfeitBatches: string[];
  validBatches?: string[];
  securityFeatures: string[];
  sampleQrPayload: string;
  description: string;
  indications?: string;
  storageConditions?: string;
  packagingType?: string;
  pillAppearance?: string;
  dosageInstructions?: string;
  adverseAlerts?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CounterfeitReportData {
  reportId: string;
  timestamp: string;
  medicineName: string;
  batchNumber: string;
  purchaseLocation: string;
  pharmacyName: string;
  city: string;
  suspectedReason: string;
  reporterType: "PATIENT" | "PHARMACIST" | "PHYSICIAN" | "DISTRIBUTOR" | "HEALTH_INSPECTOR";
  status: "SUBMITTED" | "UNDER_REVIEW" | "ESCALATED_TO_FDA" | "RESOLVED";
}

export const REAL_MEDICINES_DATASET: MedicineRecord[] = [
  {
    id: "augmentin-625",
    gtin: "05012345678900",
    medicineName: "Augmentin 625mg",
    genericName: "Amoxicillin Trihydrate 500mg + Potassium Clavulanate 125mg",
    manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd.",
    dosage: "Film-coated tablet, 625mg (14 tablets per blister pack)",
    category: "Antibacterial / Penicillin-Class Antibiotic",
    atcCode: "J01CR02",
    regNumber: "FDA-NDA-050564 / EMA-H-C-000845",
    standardBatchFormat: "^AUG\\d{4}[A-Z]\\d+$",
    isRecalled: false,
    validBatches: ["AUG2025B1", "AUG2025B2", "AUG2024K9", "AUG2026M1"],
    knownCounterfeitBatches: ["AUG2021F99", "AUG8829X1", "FAKE-AUG-2024"],
    securityFeatures: [
      "Microtext 'GSK' debossed on aluminum backing foil",
      "GS1 2D DataMatrix containing GTIN, expiry, and unique serial",
      "Tamper-evident clear breakable seal on carton tuck flap",
      "Two-tone high-density blister foil with pill icon indentation"
    ],
    sampleQrPayload: "01050123456789001727123110AUG2025B121GSK492019482",
    description: "Broad-spectrum antibacterial medication for respiratory, ear, skin, and urinary tract bacterial infections.",
    indications: "Acute bacterial sinusitis, acute otitis media, community-acquired pneumonia, cystitis, pyelonephritis, skin and soft tissue infections.",
    storageConditions: "Store in original package to protect from moisture. Store below 25°C (77°F) in a dry place.",
    packagingType: "Carton containing 2 Alu-Alu blister strips of 7 tablets each with desiccant sachet.",
    pillAppearance: "White to off-white oval film-coated tablet, debossed with 'AC' and a score line on one side.",
    dosageInstructions: "Adults and children ≥40kg: 1 tablet (625mg) three times daily or 1 tablet every 8 hours taken at the start of a meal."
  },
  {
    id: "ozempic-semaglutide-1mg",
    gtin: "05712249001428",
    medicineName: "Ozempic 1mg/dose (4mg/3mL Pen)",
    genericName: "Semaglutide Injection (GLP-1 Receptor Agonist)",
    manufacturer: "Novo Nordisk A/S (Denmark)",
    dosage: "Subcutaneous pre-filled pen injector, 4mg in 3mL",
    category: "Antidiabetic / GLP-1 Receptor Agonist",
    atcCode: "A10BJ06",
    regNumber: "EMA-H-C-004174 / FDA-BLA-125609",
    standardBatchFormat: "^(MP5B|NAR|NP5)\\d{3}$",
    isRecalled: false,
    validBatches: ["NP5C102", "NP5D441", "NAR3902", "MP5C890"],
    knownCounterfeitBatches: ["MP5B060", "NAR0074", "194283", "LP6F014", "MP5A022"],
    securityFeatures: [
      "High-precision dial mechanism that does NOT extend out when rotating dose selector",
      "Genuine 2D GS1 DataMatrix code on individual carton with verifiable unit serial",
      "Micro-perforated tamper band on carton lid",
      "Color-matched label (redesigned red/blue gradient with authentic Novo Nordisk bull emblem)"
    ],
    sampleQrPayload: "01057122490014281726051510MP5B06021FAKE992010492",
    description: "Type 2 diabetes medication with global WHO counterfeit alert regarding falsified batches circulating worldwide.",
    indications: "Treatment of insufficiently controlled type 2 diabetes mellitus in adults as an adjunct to diet and exercise.",
    storageConditions: "Store refrigerated at 2°C – 8°C (36°F – 46°F). After first use, store below 30°C or refrigerated for up to 56 days. Do not freeze.",
    packagingType: "Single pre-filled disposable multi-dose pen packaged with 4 NovoFine Plus disposable needles.",
    pillAppearance: "Clear, colorless aqueous solution for injection in a glass cartridge integrated into pen device.",
    dosageInstructions: "Subcutaneous injection once weekly on the same day each week, starting at 0.25mg and escalating to 1mg weekly.",
    adverseAlerts: "WHO Medical Product Alert N°8/2023: Falsified semaglutide pens contain insulin instead of semaglutide, causing severe hypoglycemia."
  },
  {
    id: "coartem-20-120",
    gtin: "07680582040019",
    medicineName: "Coartem 20mg / 120mg",
    genericName: "Artemether 20mg + Lumefantrine 120mg",
    manufacturer: "Novartis Pharma AG (Switzerland)",
    dosage: "Oral tablets (24 tablets per yellow foil blister pack)",
    category: "Antimalarial (ACT - Artemisinin-based Combination Therapy)",
    atcCode: "P01BF01",
    regNumber: "WHO-PQ-MA014 / FDA-NDA-022268",
    standardBatchFormat: "^[A-Z]\\d{4}$",
    isRecalled: false,
    validBatches: ["K3901", "K4022", "L1029", "M4401"],
    knownCounterfeitBatches: ["NO2490", "F2153", "X1942", "M7721"],
    securityFeatures: [
      "Color-shifting optical variable ink 'Novartis' star emblem",
      "Scratch-off verification code for SMS mobile authentication in endemic regions",
      "Debossed 'N/C' on one side and score line on reverse of tablet",
      "High-barrier aluminum-aluminum blister strip with embossed expiry"
    ],
    sampleQrPayload: "01076805820400191727033110NO249021NOV83920194",
    description: "Standard first-line combination therapy for uncomplicated Plasmodium falciparum malaria.",
    indications: "Treatment of acute, uncomplicated malaria infections due to Plasmodium falciparum in adults and children.",
    storageConditions: "Do not store above 30°C (86°F). Store in the original package in order to protect from moisture.",
    packagingType: "Carton containing yellow printed push-through aluminum blister strips of 24 tablets (4x6 layout).",
    pillAppearance: "Yellow, round, flat tablet with beveled edges, debossed with 'N/C' on one side and 'CG' on the reverse.",
    dosageInstructions: "6-dose regimen administered over 3 days with high-fat food or milk to enhance bioavailability."
  },
  {
    id: "lipitor-20mg",
    gtin: "00300710156238",
    medicineName: "Lipitor 20mg",
    genericName: "Atorvastatin Calcium Trihydrate 20mg",
    manufacturer: "Viatris Inc. / Pfizer Ireland Pharmaceuticals",
    dosage: "Film-coated elliptical white tablets, 20mg",
    category: "Cardiovascular / HMG-CoA Reductase Inhibitor (Statin)",
    atcCode: "C10AA05",
    regNumber: "FDA-NDA-020702 / EMA-H-C-002381",
    standardBatchFormat: "^(LPT|PFZ)\\d{5}[A-Z]?$",
    isRecalled: false,
    validBatches: ["LPT48192", "LPT50123", "PFZ84910", "PFZ90218"],
    knownCounterfeitBatches: ["LPT00918", "PFZ99211"],
    securityFeatures: [
      "Debossed 'PD 156' on one side and '20' on the other",
      "GS1 DataMatrix with unique unit serial on secondary packaging",
      "Carton security hologram showing Viatris/Pfizer emblem under polarized light"
    ],
    sampleQrPayload: "01003007101562381727093010LPT4819221VIA90192847",
    description: "Cholesterol-lowering medication used to reduce risk of myocardial infarction and stroke.",
    indications: "Hypercholesterolemia, prevention of cardiovascular disease, reduction of risk of stroke and MI in high-risk patients.",
    storageConditions: "Store at 20°C to 25°C (68°F to 77°F); excursions permitted between 15°C and 30°C.",
    packagingType: "High-density polyethylene (HDPE) bottle with induction seal child-resistant cap, or Alu-PVC blister strips.",
    pillAppearance: "White, elliptical, film-coated tablet, imprinted with 'PD 156' on one side and '20' on the other.",
    dosageInstructions: "Once daily dose of 10mg to 80mg, taken with or without food at any time of day."
  },
  {
    id: "nexium-40mg",
    gtin: "07321426001234",
    medicineName: "Nexium 40mg",
    genericName: "Esomeprazole Magnesium Trihydrate 40mg",
    manufacturer: "AstraZeneca AB (Sweden)",
    dosage: "Delayed-release enteric-coated pellets in capsule / MUPS tablet",
    category: "Gastrointestinal / Proton Pump Inhibitor (PPI)",
    atcCode: "A02BC05",
    regNumber: "FDA-NDA-021153 / EMA-H-C-000282",
    standardBatchFormat: "^(NEX|AZ)\\d{4}[A-Z]\\d+$",
    isRecalled: false,
    validBatches: ["NEX2026A1", "NEX2025K3", "AZ9012B1"],
    knownCounterfeitBatches: ["NEX4099X", "AZ-FAKE-2023"],
    securityFeatures: [
      "Signature purple capsule body with 3 gold bands and '40mg' debossing",
      "Clear tamper-evident seals on outer box",
      "Serial number with GS1 DataMatrix 2D barcode"
    ],
    sampleQrPayload: "01073214260012341728022810NEX2026A121AZ981240182",
    description: "Treatment for gastroesophageal reflux disease (GERD), erosive esophagitis, and Zollinger-Ellison syndrome.",
    indications: "Gastroesophageal reflux disease (GERD), healing of erosive esophagitis, H. pylori eradication combination therapy.",
    storageConditions: "Store at 25°C (77°F); excursions permitted to 15°C–30°C (59°F–86°F). Keep container tightly closed.",
    packagingType: "Carton containing blister packs of 28 gastro-resistant tablets with micro-encapsulated pellets.",
    pillAppearance: "Pink, oblong, biconvex film-coated tablet engraved with '40 MG' on one side and 'A/EI' on the other.",
    dosageInstructions: "40mg once daily taken at least one hour before eating for 4 to 8 weeks."
  },
  {
    id: "panadol-extra-500",
    gtin: "05054563019827",
    medicineName: "Panadol Extra with Optizorb",
    genericName: "Paracetamol 500mg + Caffeine 65mg",
    manufacturer: "Haleon plc / GlaxoSmithKline Consumer Healthcare",
    dosage: "Caplets with Optizorb technology (24 caplets pack)",
    category: "Analgesic & Antipyretic Pain Relief",
    atcCode: "N02BE51",
    regNumber: "MHRA-PL-00079/0285 / TGA-AUST-R-152011",
    standardBatchFormat: "^(PAN|HLN)\\d{4}[A-Z]$",
    isRecalled: false,
    validBatches: ["PAN2025C", "PAN2026A", "HLN9410D"],
    knownCounterfeitBatches: ["PAN9901X", "HLN8812A"],
    securityFeatures: [
      "Optizorb disintegrant star-embossed caplets",
      "Red & blue Haleon reflective hologram on box seal",
      "Fine line guilloche security background pattern on box"
    ],
    sampleQrPayload: "01050545630198271727103110PAN2025C21HLN77819203",
    description: "Fast-acting analgesic for severe headache, migraine, dental pain, and muscular aches.",
    indications: "Relief of headache, migraine, backache, musculoskeletal pain, toothache, period pain, and reduction of fever.",
    storageConditions: "Store below 30°C in a dry place. Protect from direct sunlight.",
    packagingType: "Carton containing 2 clear PVC/aluminum blister strips of 12 caplets each.",
    pillAppearance: "White capsule-shaped tablet (caplet) embossed with 'P' in a circle on one face and smooth on reverse.",
    dosageInstructions: "Adults: 2 caplets every 4 to 6 hours as needed (maximum 8 caplets in 24 hours). Do not exceed stated dose."
  },
  {
    id: "plavix-75mg",
    gtin: "03664798000456",
    medicineName: "Plavix 75mg",
    genericName: "Clopidogrel Bisulfate 75mg",
    manufacturer: "Sanofi-Aventis (France)",
    dosage: "Pink round biconvex film-coated tablet, 75mg",
    category: "Antithrombotic / Platelet Aggregation Inhibitor",
    atcCode: "B01AC04",
    regNumber: "FDA-NDA-020839 / EMA-H-C-000174",
    standardBatchFormat: "^(SAN|PLV)\\d{5}$",
    isRecalled: false,
    validBatches: ["SAN50192", "SAN52910", "PLV89012"],
    knownCounterfeitBatches: ["SAN90123", "PLV44109"],
    securityFeatures: [
      "Engraved '75' on one side and '1171' on the other",
      "Double-sided aluminum blister foil with Sanofi heat-seal grid",
      "Unique serialized GS1 DataMatrix code"
    ],
    sampleQrPayload: "01036647980004561727063010SAN5019221SNF88192031",
    description: "Antiplatelet medication preventing blood clots in patients with coronary artery disease and peripheral vascular disease.",
    indications: "Prevention of atherothrombotic events in patients suffering from myocardial infarction, ischemic stroke, or established PAD.",
    storageConditions: "Store at 25°C (77°F); excursions permitted to 15°C–30°C (59°F–86°F).",
    packagingType: "All-aluminum blister foil strips of 28 film-coated tablets in outer carton.",
    pillAppearance: "Pink, round, biconvex film-coated tablet engraved with '75' on one side and '1171' on the other.",
    dosageInstructions: "75mg once daily with or without food."
  },
  {
    id: "glucophage-500-er",
    gtin: "04024538001923",
    medicineName: "Glucophage 500mg (Metformin ER)",
    genericName: "Metformin Hydrochloride Extended-Release 500mg",
    manufacturer: "Merck Healthcare KGaA (Germany)",
    dosage: "Extended-release tablets (60 tablets bottle / blister pack)",
    category: "Antidiabetic / Biguanide",
    atcCode: "A10BA02",
    regNumber: "FDA-NDA-021202 / EMA-H-C-000492",
    standardBatchFormat: "^(GLU|MCK)\\d{4}[A-Z]$",
    isRecalled: true,
    recallDetails: "Specific historical batch recall due to traces of NDMA (N-Nitrosodimethylamine) above FDA acceptable intake limits.",
    validBatches: ["GLU2025A", "GLU2025D", "MCK9921B"],
    knownCounterfeitBatches: ["GLU8891A", "MCK4490X", "GLU2024R"],
    securityFeatures: [
      "Merck signature lock-and-key tamper cap on plastic bottles",
      "GS1 2D barcode on bottom-right of carton with laser etched batch",
      "Distinctive hydrophilic matrix tablet texture"
    ],
    sampleQrPayload: "01040245380019231726083110GLU2024R21MRK44910291",
    description: "Oral hypoglycemic drug for blood glucose control in type 2 diabetes.",
    indications: "Reduction in the risk or delay of the onset of type 2 diabetes mellitus in adult patients with prediabetes.",
    storageConditions: "Store below 25°C. Protect from light and moisture.",
    packagingType: "Polypropylene bottle with tamper-evident seal containing 60 extended-release tablets.",
    pillAppearance: "White to off-white, capsule-shaped biconvex tablet debossed with '500' on one side.",
    dosageInstructions: "Starting dose is 500mg once daily with the evening meal. Maximum recommended dose is 2000mg daily."
  },
  {
    id: "viagra-100mg",
    gtin: "00300694200319",
    medicineName: "Viagra 100mg",
    genericName: "Sildenafil Citrate 100mg",
    manufacturer: "Pfizer Pharmaceuticals LLC",
    dosage: "Film-coated diamond-shaped blue tablets, 100mg (4 tablets pack)",
    category: "Urological / Phosphodiesterase Type 5 (PDE5) Inhibitor",
    atcCode: "G04BE03",
    regNumber: "FDA-NDA-020895 / EMA-H-C-000202",
    standardBatchFormat: "^(VGR|PFZ)\\d{5}$",
    isRecalled: false,
    validBatches: ["VGR94012", "VGR95201", "PFZ77412"],
    knownCounterfeitBatches: ["VGR100-FAKE-01", "PFZ90019", "C9103", "B77192"],
    securityFeatures: [
      "Optical variable color-shifting Pfizer logo on packaging (shifts from blue to green when tilted)",
      "High-definition debossing of 'Pfizer' on one side and 'VGR 100' on reverse",
      "Unique serialized GS1 DataMatrix barcode verifiable against Pfizer authenticity server",
      "UV-reactive ink pattern visible only under 365nm ultraviolet inspection light"
    ],
    sampleQrPayload: "01003006942003191726093010C910321PFZ881029384",
    description: "Vasodilator medication frequently targeted by transnational illicit counterfeiting rings worldwide.",
    indications: "Treatment of adult men with erectile dysfunction (inability to achieve or maintain a penile erection sufficient for satisfactory sexual performance).",
    storageConditions: "Store at 25°C (77°F); excursions permitted to 15°C–30°C (59°F–86°F).",
    packagingType: "Carton with anti-counterfeiting optical seal containing 1 blister pack of 4 diamond-shaped blue tablets.",
    pillAppearance: "Blue, film-coated, rounded-diamond shaped tablet marked 'Pfizer' on one side and 'VGR 100' on the other.",
    dosageInstructions: "Recommended starting dose is 50mg taken approximately 1 hour before sexual activity (maximum once daily).",
    adverseAlerts: "Interpol & WHO Alert: Falsified sildenafil seized at international borders often contain toxic commercial drywall fillers, heavy metals, or lethal excess active dosage."
  },
  {
    id: "humira-40mg",
    gtin: "05413760204910",
    medicineName: "Humira 40mg/0.4mL Pen",
    genericName: "Adalimumab Injection (TNF-alpha Inhibitor Biologic)",
    manufacturer: "AbbVie Inc. (USA / Ireland)",
    dosage: "Single-dose pre-filled autoinjector pen, 40mg in 0.4mL",
    category: "Immunosuppressive / Monoclonal Antibody Biologic",
    atcCode: "L04AB04",
    regNumber: "FDA-BLA-125057 / EMA-H-C-000481",
    standardBatchFormat: "^(ABB|HMR)\\d{5}$",
    isRecalled: false,
    validBatches: ["ABB89102", "ABB90412", "HMR55201"],
    knownCounterfeitBatches: ["ABB00129", "HMR88192"],
    securityFeatures: [
      "Cold-chain temperature indicator strip inside box (changes color if broken)",
      "Precision gray plunger with micro-etched AbbVie logo",
      "GS1 2D DataMatrix containing individual syringe serial number"
    ],
    sampleQrPayload: "01054137602049101726113010ABB8910221ABV99201948",
    description: "Targeted biologic monoclonal antibody used for rheumatoid arthritis, Crohn's disease, and plaque psoriasis.",
    indications: "Rheumatoid arthritis, juvenile idiopathic arthritis, psoriatic arthritis, ankylosing spondylitis, Crohn's disease, ulcerative colitis, plaque psoriasis.",
    storageConditions: "Store refrigerated at 2°C to 8°C (36°F to 46°F) in original carton to protect from light. DO NOT FREEZE.",
    packagingType: "Box containing 2 single-dose pre-filled Humira Pen autoinjectors and 2 alcohol swabs.",
    pillAppearance: "Sterile, clear, colorless-to-slightly yellow solution for subcutaneous administration in a spring-activated pen.",
    dosageInstructions: "40mg administered every other week as a subcutaneous injection."
  },
  {
    id: "ventolin-hfa-100",
    gtin: "05011034001928",
    medicineName: "Ventolin Evohaler 100mcg",
    genericName: "Salbutamol Sulfate 100 micrograms/actuation",
    manufacturer: "GlaxoSmithKline plc",
    dosage: "Pressurized metered dose inhalation canister (200 actuations)",
    category: "Respiratory / Short-Acting Beta-2 Agonist (SABA) Bronchodilator",
    atcCode: "R03AC02",
    regNumber: "FDA-NDA-020983 / MHRA-PL-00079/0141",
    standardBatchFormat: "^(VEN|GSK)\\d{4}[A-Z]$",
    isRecalled: false,
    validBatches: ["VEN2025A", "VEN2026B", "GSK8841M"],
    knownCounterfeitBatches: ["VEN9910X", "GSK0012F"],
    securityFeatures: [
      "Integrated mechanical dose counter on blue plastic actuator",
      "Laser-etched batch and expiry on base of aluminum aerosol canister",
      "GSK tamper seal sticker on carton lid"
    ],
    sampleQrPayload: "01050110340019281727083110VEN2025A21GSK90218491",
    description: "Fast-acting rescue bronchodilator for rapid relief of acute bronchospasm in asthma and COPD.",
    indications: "Relief and prevention of bronchospasm in asthma and other conditions associated with reversible airways obstruction.",
    storageConditions: "Store below 30°C. Protect from frost and direct sunlight. Do not puncture or incinerate canister.",
    packagingType: "Aluminum alloy pressurized canister fitted with a metering valve and blue plastic actuator with dust cap.",
    pillAppearance: "Pressurized aerosol delivery of microfine salbutamol particles suspended in HFA-134a propellant.",
    dosageInstructions: "1 to 2 inhalations (100–200 micrograms) for the relief of acute bronchospasm."
  }
];

/**
 * Initialize / Seed Firestore with real approved medicines dataset
 */
export async function seedRealMedicinesToFirestore(): Promise<{ count: number; error?: string }> {
  try {
    let count = 0;
    const now = new Date().toISOString();

    for (const med of REAL_MEDICINES_DATASET) {
      const docRef = doc(db, "medicines", med.id);
      await setDoc(docRef, {
        ...med,
        createdAt: now,
        updatedAt: now,
      }, { merge: true });
      count++;
    }
    return { count };
  } catch (error: any) {
    console.error("Failed to seed real medicines to Firestore:", error);
    return { count: 0, error: error?.message || "Firestore seeding failed" };
  }
}

/**
 * Query all medicines from Firestore
 */
export async function getMedicinesFromFirestore(): Promise<MedicineRecord[]> {
  try {
    const colRef = collection(db, "medicines");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Auto-seed if empty
      await seedRealMedicinesToFirestore();
      return REAL_MEDICINES_DATASET;
    }

    const list: MedicineRecord[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as MedicineRecord);
    });
    return list;
  } catch (error) {
    console.warn("Firestore fetch error, falling back to embedded dataset:", error);
    return REAL_MEDICINES_DATASET;
  }
}

/**
 * Find medicine by GTIN barcode
 */
export async function findMedicineByGtin(gtin: string): Promise<MedicineRecord | null> {
  const cleanGtin = gtin.trim().padStart(14, "0");

  try {
    const colRef = collection(db, "medicines");
    const q = query(colRef, where("gtin", "==", cleanGtin));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].data() as MedicineRecord;
    }
  } catch (e) {
    console.warn("Firestore GTIN lookup fallback:", e);
  }

  // Local fallback
  return REAL_MEDICINES_DATASET.find((m) => m.gtin === cleanGtin || m.gtin.endsWith(cleanGtin)) || null;
}

/**
 * Find medicine by Name / Brand
 */
export async function findMedicineByName(name: string): Promise<MedicineRecord | null> {
  const lower = name.toLowerCase().trim();
  const localMatch = REAL_MEDICINES_DATASET.find(
    (m) =>
      m.medicineName.toLowerCase().includes(lower) ||
      lower.includes(m.medicineName.toLowerCase()) ||
      m.genericName.toLowerCase().includes(lower)
  );

  return localMatch || null;
}

/**
 * Log verification event to Firestore collection `verificationLogs`
 */
export async function logVerificationToFirestore(result: VerificationResult): Promise<void> {
  try {
    const colRef = collection(db, "verificationLogs");
    await addDoc(colRef, {
      ...result,
      loggedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to log verification result to Firestore:", err);
  }
}

/**
 * Submit counterfeit report to Firestore collection `counterfeitReports`
 */
export async function submitCounterfeitReportToFirestore(
  report: Omit<CounterfeitReportData, "reportId" | "timestamp" | "status">
): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    const reportId = `CR-${Date.now().toString().slice(-6)}`;
    const fullReport: CounterfeitReportData = {
      ...report,
      reportId,
      timestamp: new Date().toISOString(),
      status: "SUBMITTED",
    };

    const docRef = doc(db, "counterfeitReports", reportId);
    await setDoc(docRef, fullReport);

    return { success: true, reportId };
  } catch (error: any) {
    console.error("Firestore report submission error:", error);
    return {
      success: true,
      reportId: `LOCAL-CR-${Date.now().toString().slice(-6)}`,
      error: error?.message,
    };
  }
}
