import React, { useState } from "react";
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  QrCode,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FlaskConical
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
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const getRiskTierBadge = (sample: SampleMedicine) => {
    const isLow = sample.expectedStatus === "AUTHENTIC" || sample.riskLevel === "LOW";
    const isHigh = sample.expectedStatus === "SUSPECTED_COUNTERFEIT" || sample.riskLevel === "HIGH";

    if (isLow) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          LOW RISK · AUTHENTIC
        </span>
      );
    }

    if (isHigh) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-100 text-rose-900 border border-rose-300">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
          HIGH RISK · FALSIFIED
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
        MEDIUM RISK · ANOMALY
      </span>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Intro header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 mb-2">
          <FlaskConical className="w-3 h-3 text-slate-600" />
          <span>BENCHMARK TEST SUITE</span>
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-950 mb-1">
          Forensic Verification Test Scenarios
        </h3>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          Standardized clinical test scenarios modeling genuine pharmaceutical supply chains, packaging defects, and illicit counterfeit alert batches.
        </p>
      </div>

      {/* Grid of MVP test cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {samples.map((sample) => {
          const qrSvg = createSampleQrSvg(sample.qrPayload, 120);
          const isLow = sample.expectedStatus === "AUTHENTIC" || sample.riskLevel === "LOW";
          const isHigh = sample.expectedStatus === "SUSPECTED_COUNTERFEIT" || sample.riskLevel === "HIGH";

          const cardBorder = isLow
            ? "border-emerald-300/80 bg-emerald-50/20"
            : isHigh
            ? "border-rose-300/80 bg-rose-50/20"
            : "border-amber-300/80 bg-amber-50/20";

          return (
            <div
              key={sample.id}
              className={`bg-white rounded-lg border ${cardBorder} p-4 shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getRiskTierBadge(sample)}
                </div>

                <h4 className="font-display text-sm font-bold text-slate-950 mb-0.5 leading-snug">
                  {sample.medicineName}
                </h4>

                <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider block mb-2">
                  {sample.category}
                </span>

                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {sample.description}
                </p>

                {/* Technical data box */}
                <div className="bg-slate-50 rounded p-2.5 border border-slate-200 mb-3 text-[10px] font-mono text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch/Lot:</span>
                    <span className="font-bold text-slate-900">{sample.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GTIN:</span>
                    <span className="text-slate-700">{sample.gtin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry:</span>
                    <span className="text-slate-700">{sample.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectSample(sample)}
                  disabled={isAnalyzing}
                  className={`w-full py-2 px-3 rounded text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                    isLow
                      ? "bg-slate-900 hover:bg-slate-800"
                      : isHigh
                      ? "bg-rose-700 hover:bg-rose-600"
                      : "bg-amber-700 hover:bg-amber-600"
                  }`}
                >
                  <span>Run Verification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSelectedPreview(selectedPreview === sample.id ? null : sample.id)}
                  className="w-full py-1.5 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono font-medium transition-colors flex items-center justify-center gap-1"
                  title="View DataMatrix barcode to scan from phone"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedPreview === sample.id ? "Hide QR Code" : "Show Scannable QR"}</span>
                </button>
              </div>

              {/* Expandable QR Display */}
              {selectedPreview === sample.id && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center text-center">
                  <p className="text-[11px] text-slate-700 mb-2 font-medium">
                    Point camera at this GS1 barcode:
                  </p>
                  <div
                    className="p-2 bg-white rounded border border-slate-200 shadow-xs mb-2"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <span className="text-[9px] font-mono text-slate-600 break-all px-1">
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
