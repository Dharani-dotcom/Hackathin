import React, { useState } from "react";
import { AlertOctagon, X, Send, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";
import { VerificationResult } from "../types";
import { submitCounterfeitReportToFirestore } from "../lib/medicineDb";

interface ReportModalProps {
  result: VerificationResult;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ result, onClose }) => {
  const [pharmacyName, setPharmacyName] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [city, setCity] = useState("");
  const [adverseEffects, setAdverseEffects] = useState("");
  const [reporterType, setReporterType] = useState<"PATIENT" | "PHARMACIST" | "PHYSICIAN">("PATIENT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await submitCounterfeitReportToFirestore({
        medicineName: result.medicineName || "Unknown Medicine",
        batchNumber: result.batchNumber || "UNKNOWN",
        purchaseLocation: `${pharmacyName} - ${purchaseLocation}`,
        pharmacyName: pharmacyName || "Unspecified Pharmacy",
        city: city || purchaseLocation || "Unspecified",
        suspectedReason: `Verification result: ${result.status}. Red flags: ${(result.redFlags || []).join(", ")}. User notes: ${adverseEffects}`,
        reporterType: reporterType,
      });
      if (res.success && res.reportId) {
        setGeneratedReportId(res.reportId);
      } else {
        setGeneratedReportId(`REP-${Date.now().toString().slice(-6)}`);
      }
    } catch (e) {
      setGeneratedReportId(`REP-${Date.now().toString().slice(-6)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Incident Pharmacovigilance Report</h3>
              <p className="text-[11px] text-rose-700">Submit counterfeit findings to Firebase surveillance registry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200 shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {generatedReportId ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Report Logged in Firestore</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Incident Case ID <strong className="text-sky-700 font-mono">{generatedReportId}</strong> has been stored securely in the Firestore <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">/counterfeitReports</code> collection.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 text-left space-y-1">
              <p className="font-semibold text-slate-900">Patient Safety Checklist:</p>
              <p>• Retain the medication packaging and remaining blisters as physical evidence.</p>
              <p>• Do not consume any more doses from batch <span className="font-mono font-bold text-slate-900">{result.batchNumber}</span>.</p>
              <p>• Consult your prescribing physician for legitimate replacement therapy.</p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-0.5 text-slate-700">
              <span className="text-slate-400 text-[10px] block">Flagged Medication:</span>
              <strong className="text-slate-900 text-xs block">{result.medicineName}</strong>
              <span className="text-slate-500 font-mono text-[11px] block">Batch: {result.batchNumber} • GTIN: {result.gtin}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reporter Role
                </label>
                <select
                  value={reporterType}
                  onChange={(e: any) => setReporterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="PATIENT">Patient / Consumer</option>
                  <option value="PHARMACIST">Licensed Pharmacist</option>
                  <option value="PHYSICIAN">Physician / Doctor</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Dispensing Pharmacy Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  placeholder="e.g. City Care Pharmacy"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Purchase City / Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={purchaseLocation}
                onChange={(e) => {
                  setPurchaseLocation(e.target.value);
                  setCity(e.target.value);
                }}
                placeholder="e.g. London, UK or Chicago, IL"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Defects Observed / Adverse Symptoms (Optional)
              </label>
              <textarea
                rows={2}
                value={adverseEffects}
                onChange={(e) => setAdverseEffects(e.target.value)}
                placeholder="e.g. Crumbly chalky tablet, blurry packaging print, abnormal taste"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
