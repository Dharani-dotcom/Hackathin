import React, { useState } from "react";
import { Search, Sparkles, RefreshCw } from "lucide-react";
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
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
          <Search className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Manual Batch & GTIN Lookup</h3>
          <p className="text-[11px] text-slate-500">
            Verify damaged or scratched 2D barcodes by entering carton details
          </p>
        </div>
      </div>

      {/* Quick Fill Shortcuts */}
      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto text-[10px] pb-1">
        <span className="text-slate-400 font-medium">Presets:</span>
        <button
          type="button"
          onClick={() => handleQuickFill("authentic")}
          className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors font-medium whitespace-nowrap"
        >
          Valid GSK Batch
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill("counterfeit")}
          className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors font-medium whitespace-nowrap"
        >
          Flagged MP5B060
        </button>
        <button
          type="button"
          onClick={() => handleQuickFill("recalled")}
          className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors font-medium whitespace-nowrap"
        >
          Recalled C9103
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Medicine Brand / Product Name
          </label>
          <input
            type="text"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            placeholder="e.g. Augmentin 625mg or Lipitor"
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Batch / Lot Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              placeholder="e.g. AUG2025B1"
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              GTIN Barcode (14 digits)
            </label>
            <input
              type="text"
              name="gtin"
              value={formData.gtin}
              onChange={handleChange}
              placeholder="05012345678900"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Stated Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="e.g. Pfizer, GSK, Cipla"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full mt-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Checking Firestore & Registries...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Verify Batch Authenticity</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
