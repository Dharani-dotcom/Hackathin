import React, { useState } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 animate-fade-in font-sans">
      <div className="bg-white border border-slate-200 rounded w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                {medicine.category.split("/")[0]}
              </span>
              {medicine.atcCode && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  ATC: {medicine.atcCode}
                </span>
              )}
              {medicine.isRecalled ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  RECALLED BATCHES
                </span>
              ) : hasCounterfeitAlerts ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300">
                  SAFETY SURVEILLANCE ALERT
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  VERIFIED PHARMACEUTICAL
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight font-display">
              {medicine.medicineName}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {medicine.genericName}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-300"
              title="Print Medicine Dossier"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors border border-slate-300"
            >
              Close
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-5 flex items-center gap-2 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "overview"
                ? "border-slate-900 text-slate-950 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Clinical & Pharmacology Data
          </button>
          <button
            onClick={() => setActiveTab("gs1")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "gs1"
                ? "border-slate-900 text-slate-950 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            GS1 Barcode & Serial Lots
          </button>
          <button
            onClick={() => setActiveTab("forensics")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "forensics"
                ? "border-slate-900 text-slate-950 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Packaging Security Features
          </button>
          <button
            onClick={() => setActiveTab("safety")}
            className={`py-2.5 px-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "safety"
                ? "border-slate-900 text-slate-950 font-bold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Counterfeit Alerts & Recalls
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-700">
          {/* TAB 1: Clinical & Pharmacology Data */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                    Manufacturer / Marketing Authorization Holder
                  </span>
                  <div className="text-slate-900 font-semibold text-xs">
                    {medicine.manufacturer}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                    Regulatory Registration Number
                  </span>
                  <div className="flex items-center justify-between text-slate-900 font-mono text-xs">
                    <span>{medicine.regNumber}</span>
                    <button
                      onClick={() => handleCopy(medicine.regNumber, "Reg Number")}
                      className="text-[10px] text-slate-600 hover:text-slate-900 font-sans"
                    >
                      {copiedText === "Reg Number" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {medicine.description && (
                <div className="p-3.5 bg-white rounded border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 mb-1 text-xs font-mono uppercase">
                    Pharmacological Overview
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {medicine.description}
                  </p>
                </div>
              )}

              {medicine.indications && (
                <div className="p-3.5 bg-white rounded border border-slate-200 shadow-xs">
                  <h4 className="font-bold text-slate-900 mb-1 text-xs font-mono uppercase">
                    Therapeutic Indications
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {medicine.indications}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {medicine.dosageInstructions && (
                  <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                      Dosage & Administration
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {medicine.dosageInstructions}
                    </p>
                  </div>
                )}

                {medicine.storageConditions && (
                  <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
                      Storage & Handling Specifications
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {medicine.storageConditions}
                    </p>
                  </div>
                )}
              </div>

              {medicine.pillAppearance && (
                <div className="p-3.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
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
              <div className="bg-slate-50 p-4 rounded border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="p-2.5 bg-white rounded border border-slate-200 shadow-xs flex flex-col items-center">
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
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                      Global Trade Item Number (GTIN-14)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {medicine.gtin}
                      </span>
                      <button
                        onClick={() => handleCopy(medicine.gtin, "GTIN")}
                        className="text-xs text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                      Standard Batch / Lot Format Pattern
                    </span>
                    <code className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-[11px] text-slate-800 block">
                      {medicine.standardBatchFormat}
                    </code>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
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
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs font-mono uppercase">
                      Verified Manufacturing Batches
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono">
                      Database Records
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {medicine.validBatches.map((batch, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-50 border border-emerald-200 p-2 rounded text-center font-mono text-xs font-bold text-emerald-900"
                      >
                        {batch}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Identifiers Explanation */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
                <span className="font-bold text-slate-900 block mb-1 font-mono uppercase">
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
              <div className="bg-white p-4 rounded border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs font-mono uppercase">
                  Physical & Optical Packaging Safeguards
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Legitimate batches from {medicine.manufacturer} incorporate multi-layer packaging technologies:
                </p>

                <div className="space-y-2">
                  {medicine.securityFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded border border-slate-200 flex items-start gap-2.5"
                    >
                      <span className="font-mono font-bold text-slate-700 text-xs shrink-0">
                        [{idx + 1}]
                      </span>
                      <span className="text-slate-800 font-medium text-xs leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {medicine.packagingType && (
                <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
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
                <div className="bg-rose-50 border border-rose-200 p-4 rounded space-y-3">
                  <div className="text-rose-900 font-bold text-xs font-mono uppercase">
                    Safety & Surveillance Flagged Falsified Batches
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    The following batch numbers have been reported as falsified or counterfeit formulations:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {medicine.knownCounterfeitBatches.map((b, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-rose-300 text-rose-900 font-mono font-bold text-xs px-2.5 py-1 rounded shadow-xs"
                      >
                        Lot: {b}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded text-emerald-900 text-xs font-mono">
                  No active global counterfeit alerts registered for this product line.
                </div>
              )}

              {medicine.isRecalled && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded space-y-2">
                  <div className="text-amber-900 font-bold text-xs font-mono uppercase">
                    Official Regulatory Product Recall
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {medicine.recallDetails || "This product has active batches subject to voluntary or mandatory health recall."}
                  </p>
                </div>
              )}

              {medicine.adverseAlerts && (
                <div className="bg-white border border-slate-200 p-3.5 rounded shadow-xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
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
              className="flex-1 sm:flex-initial py-2 px-3.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors"
            >
              Verify Genuine Batch
            </button>

            {hasCounterfeitAlerts && (
              <button
                onClick={() => {
                  onTestVerify(medicine, true);
                  onClose();
                }}
                className="flex-1 sm:flex-initial py-2 px-3.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-medium text-xs shadow-xs transition-colors"
              >
                Test Counterfeit Batch ({medicine.knownCounterfeitBatches[0]})
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2 px-4 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
