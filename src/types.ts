export type VerificationStatus = 
  | 'AUTHENTIC'
  | 'SUSPECTED_COUNTERFEIT'
  | 'RECALLED'
  | 'EXPIRED'
  | 'TAMPERED'
  | 'SUSPICIOUS'
  | 'INSUFFICIENT_DATA';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityCheck {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'NOT_APPLICABLE';
  detail: string;
}

export interface VerificationResult {
  id: string;
  timestamp: string;
  status: VerificationStatus;
  confidenceScore: number; // 0 to 100
  riskLevel: RiskLevel;
  medicineName: string;
  activeIngredient: string;
  dosage: string;
  manufacturer: string;
  gtin: string;
  batchNumber: string;
  serialNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  isExpired: boolean;
  isRecalled: boolean;
  recallDetails?: string;
  summary: string;
  securityChecks: SecurityCheck[];
  redFlags: string[];
  actionRecommendations: string[];
  packagingAnalysis: string;
  rawQrData?: string;
  capturedImage?: string;
}

export interface SampleMedicine {
  id: string;
  title: string;
  medicineName: string;
  category: string;
  expectedStatus: VerificationStatus;
  badgeColor: string;
  riskLevel?: RiskLevel;
  description: string;
  qrPayload: string;
  batchNumber: string;
  gtin: string;
  expiryDate: string;
  manufacturer: string;
  imageHint?: string;
}

export interface ManualEntryData {
  medicineName: string;
  manufacturer: string;
  gtin: string;
  batchNumber: string;
  expiryDate: string;
}
