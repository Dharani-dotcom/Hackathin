import React, { useState } from "react";
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Clock,
  QrCode,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react";
import { SampleMedicine } from "../types";
import { createSampleQrSvg } from "../utils/qrScanner";

interface SampleMedicinesProps {
  samples: SampleMedicine[];
  onSelectSample: (sample: SampleMedicine) => void;
  isAnalyzing: boolean;
}

export const SampleMedicines: React.FC<SampleMedicinesProps> = ({
  samples,
  onSelectSample,
  isAnalyzing,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<SampleMedicine | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AUTHENTIC":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authentic Sample
          </span>
        );
      case "SUSPECTED_COUNTERFEIT":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25">
            <AlertOctagon className="w-3.5 h-3.5" />
            Known Counterfeit Alert
          </span>
        );
      case "RECALLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <AlertTriangle className="w-3.5 h-3.5" />
            Official Recall
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
            <Clock className="w-3.5 h-3.5" />
            Expired Shelf-Life
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/25">
            Demo Sample
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Intro header */}
      <div className="text-center mb-5">
        <h3 className="text-base font-bold text-white mb-1">
          Instant Test Cases & Forensic Scenarios
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Don't have a medicine box on hand? Click any real-world forensic scenario below to test the AI verification engine instantly.
        </p>
      </div>

      {/* Grid of test cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {samples.map((sample) => {
          const qrSvg = createSampleQrSvg(sample.qrPayload, 120);

          return (
            <div
              key={sample.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-4 transition-all hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sample.category}
                  </span>
                  {getStatusBadge(sample.expectedStatus)}
                </div>

                <h4 className="text-sm font-bold text-white mb-1 group-hover:text-sky-400 transition-colors">
                  {sample.medicineName}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {sample.description}
                </p>

                {/* Technical data pill */}
                <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-850 mb-3 text-[10px] font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch/Lot:</span>
                    <span className="font-semibold text-slate-200">{sample.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">GTIN:</span>
                    <span className="text-slate-300">{sample.gtin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expiry:</span>
                    <span className="text-slate-300">{sample.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => setSelectedPreview(selectedPreview?.id === sample.id ? null : sample)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                  title="View DataMatrix barcode to scan from phone"
                >
                  <QrCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>Show QR</span>
                </button>

                <button
                  onClick={() => onSelectSample(sample)}
                  disabled={isAnalyzing}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/20 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verify with AI</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Expandable QR Display */}
              {selectedPreview?.id === sample.id && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center text-center animate-fade-in">
                  <p className="text-[11px] text-slate-300 mb-2 font-medium">
                    Point your smartphone camera at this DataMatrix code:
                  </p>
                  <div
                    className="p-2 bg-white rounded-lg shadow-md mb-2"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 break-all px-2">
                    {sample.qrPayload}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
