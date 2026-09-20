import React, { useState } from "react";
import { VerificationResult, VerificationStatus } from "../types";

interface VerificationReportProps {
  result: VerificationResult;
  onReset: () => void;
  onOpenReportModal: () => void;
}

export const VerificationReport: React.FC<VerificationReportProps> = ({
  result,
  onReset,
  onOpenReportModal,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case "AUTHENTIC":
        return {
          title: "Verified Authentic Medicine",
          sub: "Matches official manufacturer database records and passed forensic checks.",
          bannerBg: "bg-emerald-50 border-emerald-300 text-emerald-950",
          badgeBg: "bg-emerald-700 text-white",
          accentText: "text-emerald-800",
        };
      case "SUSPECTED_COUNTERFEIT":
        return {
          title: "CRITICAL: Suspected Counterfeit Drug",
          sub: "DO NOT INGEST! Severe discrepancies found matching known falsified medicines.",
          bannerBg: "bg-rose-50 border-rose-300 text-rose-950",
          badgeBg: "bg-rose-700 text-white",
          accentText: "text-rose-800",
        };
      case "RECALLED":
        return {
          title: "Regulatory Product Recall Alert",
          sub: "This batch has been officially recalled by health regulatory authorities.",
          bannerBg: "bg-amber-50 border-amber-300 text-amber-950",
          badgeBg: "bg-amber-700 text-white",
          accentText: "text-amber-800",
        };
      case "EXPIRED":
        return {
          title: "Expired Pharmaceutical Product",
          sub: "This medicine has passed its expiration date and must not be used.",
          bannerBg: "bg-yellow-50 border-yellow-300 text-yellow-950",
          badgeBg: "bg-yellow-700 text-white",
          accentText: "text-yellow-900",
        };
      default:
        return {
          title: "Suspicious / Unverified Packaging",
          sub: "Non-standard barcode format or insufficient packaging security markings.",
          bannerBg: "bg-orange-50 border-orange-300 text-orange-950",
          badgeBg: "bg-orange-700 text-white",
          accentText: "text-orange-800",
        };
    }
  };

  const config = getStatusConfig(result.status);

  const handleCopySummary = () => {
    const text = `Verification Report:\nMedicine: ${result.medicineName}\nBatch: ${result.batchNumber}\nStatus: ${result.status} (${result.confidenceScore}% Confidence)\nRisk Level: ${result.riskLevel}\nSummary: ${result.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Primary Result Banner */}
      <div className={`rounded border ${config.bannerBg} p-5 shadow-xs relative`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${config.badgeBg}`}>
                {result.status.replace("_", " ")}
              </span>
              <span className="text-xs font-semibold text-slate-700 font-mono">
                Risk Level: <strong className={config.accentText}>{result.riskLevel}</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {config.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {config.sub}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="self-end sm:self-center bg-white border border-slate-200 px-3 py-1.5 rounded shadow-xs text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none font-mono">
              Confidence
            </span>
            <span className={`text-base font-bold font-mono ${config.accentText}`}>
              {result.confidenceScore}%
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/90 p-3 rounded border border-slate-200/80 mb-3 font-sans">
          {result.summary}
        </p>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80">
          <button
            id="btn-scan-another"
            onClick={onReset}
            className="py-2 px-3.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Scan Another Medicine
          </button>

          <button
            id="btn-copy-report"
            onClick={handleCopySummary}
            className="py-2 px-3 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-xs"
          >
            {copiedLink ? "Copied!" : "Share Summary"}
          </button>

          <button
            onClick={handlePrint}
            className="py-2 px-3 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors shadow-xs"
            title="Print Report"
          >
            Print
          </button>

          {result.status === "SUSPECTED_COUNTERFEIT" && (
            <button
              id="btn-report-fake-modal"
              onClick={onOpenReportModal}
              className="py-2 px-3 rounded bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-colors ml-auto shadow-xs"
            >
              Report to FDA / Police
            </button>
          )}
        </div>
      </div>

      {/* Red Flags Alert Card */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="bg-rose-50 rounded border border-rose-200 p-4 shadow-xs">
          <div className="text-rose-900 font-mono font-bold text-xs mb-2 uppercase tracking-wider">
            Identified Red Flags & Anomalies ({result.redFlags.length})
          </div>
          <ul className="space-y-1.5 text-xs text-rose-950 font-sans">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono text-rose-700 font-bold">[{idx + 1}]</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medicine Specifications Dossier */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
          Pharmaceutical Dossier
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-mono">
              Medicine Commercial Name
            </span>
            <span className="text-slate-900 font-bold text-sm block font-sans">
              {result.medicineName}
            </span>
            <span className="text-slate-600 text-xs block font-sans">
              {result.activeIngredient}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block font-mono">
              Manufacturer & Strength
            </span>
            <span className="text-slate-900 font-semibold text-xs block font-sans">
              {result.manufacturer}
            </span>
            <span className="text-slate-600 text-xs block font-sans">
              Form: {result.dosage}
            </span>
          </div>
        </div>

        {/* Decoded GS1 Identifiers */}
        <div className="mt-3 bg-slate-50 rounded p-3 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
              Decoded GS1 Healthcare Identifiers
            </span>
            <span className="text-[10px] text-slate-700 font-mono">
              GS1 2D DataMatrix
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-400 text-[9px] block">AI (01) GTIN</span>
              <span className="text-slate-800 font-medium truncate block" title={result.gtin}>
                {result.gtin || "N/A"}
              </span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-400 text-[9px] block">AI (10) BATCH</span>
              <span className="text-slate-900 font-bold text-sky-800 truncate block" title={result.batchNumber}>
                {result.batchNumber || "N/A"}
              </span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-400 text-[9px] block">AI (17) EXPIRY</span>
              <span className={`font-semibold block ${result.isExpired ? "text-rose-600 font-bold" : "text-slate-800"}`}>
                {result.expiryDate || "N/A"}
              </span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="text-slate-400 text-[9px] block">AI (21) SERIAL</span>
              <span className="text-slate-800 truncate block" title={result.serialNumber}>
                {result.serialNumber || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Checks Matrix */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
          Forensic Security Checkpoints
        </h3>

        <div className="space-y-2">
          {result.securityChecks.map((chk, index) => (
            <div
              key={index}
              className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-900 block mb-0.5">
                  {chk.name}
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {chk.detail}
                </p>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                  chk.status === "PASS"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : chk.status === "FAIL"
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {chk.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Action Checklist */}
      <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
          Consumer & Patient Guidelines
        </h3>

        <div className="space-y-2 text-xs">
          {result.actionRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded bg-slate-50 border border-slate-200">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-bold text-[10px] shrink-0">
                {i + 1}
              </span>
              <span className="text-slate-700 leading-relaxed font-sans">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Packaging Inspection */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <span>Packaging Forensics & Raw Data Payload</span>
          <span className="text-slate-400 font-mono text-[10px]">
            {showTechnicalDetails ? "[HIDE]" : "[SHOW]"}
          </span>
        </button>

        {showTechnicalDetails && (
          <div className="p-4 pt-0 border-t border-slate-100 space-y-3 text-xs">
            {result.packagingAnalysis && (
              <div>
                <span className="text-slate-600 font-semibold block mb-1">
                  Optical & Seal Analysis:
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed text-[11px] font-sans">
                  {result.packagingAnalysis}
                </p>
              </div>
            )}

            {result.rawQrData && (
              <div>
                <span className="text-slate-600 font-semibold block mb-1">
                  Raw Barcode Payload:
                </span>
                <p className="text-slate-800 font-mono text-[10px] break-all bg-slate-50 p-2 rounded border border-slate-200">
                  {result.rawQrData}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
