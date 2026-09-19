import React, { useState } from "react";
import { Search, Sparkles, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { ManualEntryData } from "../types";

interface ManualLookupProps {
  onVerify: (data: ManualEntryData) => void;
  isAnalyzing: boolean;
}

export const ManualLookup: React.FC<ManualLookupProps> = ({
  onVerify,
  isAnalyzing,
}) => {
  const [formData, setFormData] = useState<ManualEntryData>({
    medicineName: "",
    manufacturer: "",
    gtin: "",
    batchNumber: "",
    expiryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchNumber && !formData.gtin && !formData.medicineName) {
      alert("Please provide at least a Batch/Lot Number, GTIN, or Medicine Name.");
      return;
    }
    onVerify(formData);
  };

  const handleQuickFill = (preset: "authentic" | "counterfeit" | "recalled") => {
    if (preset === "authentic") {
      setFormData({
        medicineName: "Augmentin 625mg",
        manufacturer: "GlaxoSmithKline Pharmaceuticals Ltd.",
        gtin: "05012345678900",
        batchNumber: "AUG2025B1",
        expiryDate: "2027-12-31",
      });
    } else if (preset === "counterfeit") {
      setFormData({
        medicineName: "Ozempic 1mg/dose Pen",
        manufacturer: "Novo Nordisk A/S",
        gtin: "05712249001428",
        batchNumber: "MP5B060",
        expiryDate: "2026-05-15",
      });
    } else {
      setFormData({
        medicineName: "Lipitor 20mg",
        manufacturer: "Pfizer Inc.",
        gtin: "00300694200319",
        batchNumber: "C9103",
        expiryDate: "2026-09-30",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
          <Search className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Manual Batch & GTIN Lookup</h3>
          <p className="text-[11px] text-slate-400">
            For unreadable or scratched QR codes on foil packaging
          </p>
        </div>
      </div>

      {/* Quick Fill Shortcuts */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-slate-500 font-medium">Quick Fill:</span>
        <button
          type="button"
          onClick={() => handleQuickFill("authentic")}
          className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
        >
          Valid GSK Batch
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill("counterfeit")}
          className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
        >
          Flagged MP5B060
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill("recalled")}
          className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
        >
          Recalled C9103
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            Medicine Brand / Product Name
          </label>
          <input
            type="text"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            placeholder="e.g. Augmentin 625mg or Lipitor"
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Batch / Lot Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="e.g. AUG2025B1"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              GTIN / Barcode (14 digits)
            </label>
            <input
              type="text"
              name="gtin"
              value={formData.gtin}
              onChange={handleChange}
              placeholder="05012345678900"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Stated Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="e.g. Pfizer, GSK, Cipla"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Checking Regulatory Registries...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Verify Batch Authenticity</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
