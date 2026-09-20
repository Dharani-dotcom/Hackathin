import { SampleMedicine } from "../types";

export const DEFAULT_SAMPLE_MEDICINES: SampleMedicine[] = [
  {
    id: "mvp-low-risk-augmentin",
    title: "Augmentin 625mg (Low Risk - Authentic)",
    medicineName: "Augmentin 625mg",
    category: "Antibacterial / Penicillin",
    expectedStatus: "AUTHENTIC",
    badgeColor: "emerald",
    riskLevel: "LOW",
    description: "Verified genuine GS1 DataMatrix code with valid batch AUG2025B1, active expiry, and intact manufacturer holographic security seal.",
    qrPayload: "01050123456789001727123110AUG2025B121GSK492019482",
    batchNumber: "AUG2025B1",
    gtin: "05012345678900",
    expiryDate: "2027-12-31",
    manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd.",
    imageHint: "Genuine holographic GSK security seal, sharp laser-etched lot number, sealed blister pack."
  },
  {
    id: "mvp-med-risk-panadol",
    title: "Panadol Extra (Medium Risk - Suspicious Packaging)",
    medicineName: "Panadol Extra with Optizorb",
    category: "Analgesic / Pain Relief",
    expectedStatus: "SUSPICIOUS",
    badgeColor: "amber",
    riskLevel: "MEDIUM",
    description: "Packaging anomaly detected: Non-standard barcode payload, missing blister foil watermark, and unverified supply chain lot PAN-SUSP-01.",
    qrPayload: "PANADOL-EXTRA-500-SUSP-LOT-PAN-SUSP-01",
    batchNumber: "PAN-SUSP-01",
    gtin: "05000167041235",
    expiryDate: "2026-10-31",
    manufacturer: "Haleon Consumer Healthcare",
    imageHint: "Missing Haleon micro-hologram on carton seal, non-standard QR payload format."
  },
  {
    id: "mvp-high-risk-ozempic",
    title: "Ozempic 1mg Pen (High Risk - Critical Counterfeit)",
    medicineName: "Ozempic 1mg/dose Pre-filled Pen",
    category: "Antidiabetic / GLP-1",
    expectedStatus: "SUSPECTED_COUNTERFEIT",
    badgeColor: "rose",
    riskLevel: "HIGH",
    description: "High-alert counterfeit batch MP5B060 flagged internationally by WHO. Forged serial number, fake font kerning, and lethal insulin substitution.",
    qrPayload: "01057122490014281726051510MP5B06021FAKE992010492",
    batchNumber: "MP5B060",
    gtin: "05712249001428",
    expiryDate: "2026-05-15",
    manufacturer: "Novo Nordisk A/S (Forged)",
    imageHint: "Color deviation on pen dose selector, mismatched needle thread, missing micro-optic security thread."
  },
  {
    id: "mvp-low-risk-lipitor",
    title: "Lipitor 20mg (Low Risk - Authentic)",
    medicineName: "Lipitor 20mg",
    category: "Cardiovascular / Statin",
    expectedStatus: "AUTHENTIC",
    badgeColor: "emerald",
    riskLevel: "LOW",
    description: "Standard Pfizer serialization check passed. Valid lot PFIZ2025A with complete tamper-evident carton glue lines.",
    qrPayload: "01003006942003191727123110PFIZ2025A21PFIZ994821",
    batchNumber: "PFIZ2025A",
    gtin: "00300694200319",
    expiryDate: "2027-12-31",
    manufacturer: "Pfizer Inc.",
    imageHint: "Pfizer security embossing, clean typography, verified seal."
  }
];
