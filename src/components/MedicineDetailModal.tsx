import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Building,
  Barcode,
  PackageCheck,
  FileText,
  Sparkles,
  ThermometerSnowflake,
  Pill,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Layers,
  ArrowRight,
  Printer
} from "lucide-react";
import { MedicineRecord } from "../lib/medicineDb";
import { createSampleQrSvg } from "../utils/qrScanner";

interface MedicineDetailModalProps {
  medicine: MedicineRecord;
  onClose: () => void;
  onTestVerify: (medicine: MedicineRecord, useCounterfeitBatch?: boolean) => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
  onTestVerify,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "gs1" | "forensics" | "safety">("overview");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showEnlargedQr, setShowEnlargedQr] = useState<boolean>(false);

  const qrSvg = createSampleQrSvg(medicine.sampleQrPayload, showEnlargedQr ? 220 : 140);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const hasCounterfeitAlerts = medicine.knownCounterfeitBatches && medicine.knownCounterfeitBatches.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-xs shrink-0 mt-0.5">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                  {medicine.category.split("/")[0]}
                </span>
                {medicine.atcCode && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    ATC: {medicine.atcCode}
                  </span>
                )}
                {medicine.isRecalled ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    RECALLED BATCHES
                  </span>
                ) : hasCounterfeitAlerts ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3" />
                    WHO SURVEILLANCE ALERT
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED PHARMACEUTICAL
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {medicine.medicineName}
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {medicine.genericName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200"
              title="Print Medicine Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-5 flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "border-sky-600 text-sky-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 Clinical & Pharmacology Data
          </button>
          <button
            onClick={() => setActiveTab("gs1")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "gs1"
                ? "border-sky-600 text-sky-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            🏷️ GS1 Barcode & Serial Lots
          </button>
          <button
            onClick={() => setActiveTab("forensics")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "forensics"
                ? "border-sky-600 text-sky-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            🛡️ Packaging Security Features
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "safety"
                ? "border-sky-600 text-sky-700 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚠️ Counterfeit Alerts & Recalls
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-700">
          {/* TAB 1: Clinical & Pharmacology Data */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Manufacturer / Marketing Authorization Holder
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{medicine.manufacturer}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Regulatory Registration Number
                  </span>
                  <div className="flex items-center justify-between text-slate-900 font-mono text-xs">
                    <span>{medicine.regNumber}</span>
                    <button
                      onClick={() => handleCopy(medicine.regNumber, "Reg Number")}
                      className="text-[10px] text-sky-600 hover:text-sky-800 font-sans"
                    >
                      {copiedText === "Reg Number" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {medicine.description && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Pharmacological Overview</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {medicine.description}
                  </p>
                </div>
              )}

              {medicine.indications && (
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Therapeutic Indications</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {medicine.indications}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {medicine.dosageInstructions && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Dosage & Administration
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {medicine.dosageInstructions}
                    </p>
                  </div>
                )}

                {medicine.storageConditions && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1 flex items-center gap-1">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-600" />
                      <span>Storage & Handling Specifications</span>
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {medicine.storageConditions}
                    </p>
                  </div>
                )}
              </div>

              {medicine.pillAppearance && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Visual Physical Characteristics (Tablet / Solution)
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {medicine.pillAppearance}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GS1 Barcode & Serial Lots */}
          {activeTab === "gs1" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
                  <div
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowEnlargedQr(!showEnlargedQr)}
                    title="Click to toggle size"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <span className="text-[9px] text-slate-400 mt-1 font-mono">
                    GS1 2D DataMatrix
                  </span>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Global Trade Item Number (GTIN-14)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {medicine.gtin}
                      </span>
                      <button
                        onClick={() => handleCopy(medicine.gtin, "GTIN")}
                        className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                        title="Copy GTIN"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Standard Batch / Lot Regex Pattern
                    </span>
                    <code className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-[11px] text-sky-800 block">
                      {medicine.standardBatchFormat}
                    </code>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Sample Encoded GS1 Barcode Payload
                    </span>
                    <p className="font-mono text-[10px] text-slate-600 break-all bg-white p-2 rounded border border-slate-200">
                      {medicine.sampleQrPayload}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Active Batches */}
              {medicine.validBatches && medicine.validBatches.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Legitimate Manufacturing Batches (2024–2026)</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Registered in Firestore
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {medicine.validBatches.map((batch, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-50/60 border border-emerald-200 p-2 rounded-lg text-center font-mono text-xs font-bold text-emerald-900"
                      >
                        {batch}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Identifiers Explanation */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
                <span className="font-bold text-slate-900 block mb-1">
                  GS1 Healthcare Application Identifiers (AI) Breakdown:
                </span>
                <p>• <strong className="font-mono text-slate-800">(01) GTIN:</strong> 14-digit global unique product identification code.</p>
                <p>• <strong className="font-mono text-slate-800">(17) Expiry Date:</strong> YYMMDD standardized expiration format.</p>
                <p>• <strong className="font-mono text-slate-800">(10) Batch / Lot:</strong> Manufacturer production cycle reference.</p>
                <p>• <strong className="font-mono text-slate-800">(21) Serial Number:</strong> Randomized unit-level serialization for anti-tampering.</p>
              </div>
            </div>
          )}

          {/* TAB 3: Packaging Security Features */}
          {activeTab === "forensics" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Physical & Optical Packaging Safeguards</span>
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Legitimate batches from {medicine.manufacturer} incorporate multi-layer overt, covert, and forensic anti-counterfeiting technologies:
                </p>

                <div className="space-y-2">
                  {medicine.securityFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 font-medium text-xs leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {medicine.packagingType && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Primary & Secondary Packaging Configuration
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {medicine.packagingType}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Counterfeit Alerts & Recalls */}
          {activeTab === "safety" && (
            <div className="space-y-4">
              {hasCounterfeitAlerts ? (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>WHO & Interpol Flagged Falsified Batches</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    The following batch numbers have been reported to international health surveillance agencies as falsified or counterfeit formulations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {medicine.knownCounterfeitBatches.map((b, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-rose-300 text-rose-900 font-mono font-bold text-xs px-2.5 py-1 rounded shadow-xs"
                      >
                        ⚠️ Lot: {b}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No active global counterfeit alerts registered for this product line.</span>
                </div>
              )}

              {medicine.isRecalled && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Official Regulatory Product Recall</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {medicine.recallDetails || "This product has active batches subject to voluntary or mandatory health recall."}
                  </p>
                </div>
              )}

              {medicine.adverseAlerts && (
                <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Public Health Warning Bulletin
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {medicine.adverseAlerts}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Verification Testing Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onTestVerify(medicine, false);
                onClose();
              }}
              className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Genuine Batch</span>
            </button>

            {hasCounterfeitAlerts && (
              <button
                onClick={() => {
                  onTestVerify(medicine, true);
                  onClose();
                }}
                className="flex-1 sm:flex-initial py-2 px-3.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Test Counterfeit Batch ({medicine.knownCounterfeitBatches[0]})</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
