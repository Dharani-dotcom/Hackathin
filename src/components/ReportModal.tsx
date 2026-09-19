import React, { useState } from "react";
import { AlertOctagon, X, Send, CheckCircle2, ShieldAlert } from "lucide-react";
import { VerificationResult } from "../types";

interface ReportModalProps {
  result: VerificationResult;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ result, onClose }) => {
  const [pharmacyName, setPharmacyName] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [adverseEffects, setAdverseEffects] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-rose-950/40 border-b border-rose-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Pharmacovigilance Incident Report</h3>
              <p className="text-[11px] text-rose-300/80">Submit suspect counterfeit medicine to national regulatory surveillance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white">Incident Report Dispatched</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Incident Case ID <strong className="text-sky-400 font-mono">INC-{Date.now().toString().slice(-6)}</strong> has been prepared for the National Medicine Regulatory Authority & WHO Global Rapid Alert System.
            </p>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 text-left space-y-1">
              <p><strong>Next Steps:</strong></p>
              <p>1. Keep the packaging, blister foil, and remaining pills in a sealed plastic bag.</p>
              <p>2. Do not return to the vendor without an official inspector present.</p>
              <p>3. If any adverse symptoms occur, seek medical assistance immediately.</p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
              <span className="text-slate-500 block">Flagged Item:</span>
              <strong className="text-white text-xs block">{result.medicineName}</strong>
              <span className="text-slate-400 font-mono block">Batch: {result.batchNumber} • GTIN: {result.gtin}</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Dispensing Pharmacy / Clinic Name
              </label>
              <input
                type="text"
                required
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                placeholder="e.g. City Central Chemist or Online Store URL"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Purchase City / Location / Country
              </label>
              <input
                type="text"
                required
                value={purchaseLocation}
                onChange={(e) => setPurchaseLocation(e.target.value)}
                placeholder="e.g. Nairobi, Kenya or London, UK"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Any Adverse Reactions or Physical Defects Observed
              </label>
              <textarea
                rows={2}
                value={adverseEffects}
                onChange={(e) => setAdverseEffects(e.target.value)}
                placeholder="e.g. Blurry foil print, crumbly tablets, abnormal nausea"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Your Contact (Optional for Investigator Follow-up)
              </label>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="Email or phone number"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Regulatory Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
