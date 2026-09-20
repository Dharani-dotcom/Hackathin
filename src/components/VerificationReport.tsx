import React, { useState } from "react";
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Share2,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  Barcode,
  Sparkles,
  Database,
  Printer
} from "lucide-react";
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
          sub: "Matches official manufacturer GS1 registry and passed forensic checks.",
          bannerBg: "bg-emerald-50 border-emerald-300 text-emerald-950",
          badgeBg: "bg-emerald-600 text-white",
          icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
          accentText: "text-emerald-700",
        };
      case "SUSPECTED_COUNTERFEIT":
        return {
          title: "CRITICAL: Suspected Counterfeit Drug",
          sub: "DO NOT INGEST! Severe discrepancies found matching known falsified medicines.",
          bannerBg: "bg-rose-50 border-rose-300 text-rose-950",
          badgeBg: "bg-rose-600 text-white animate-pulse",
          icon: <AlertOctagon className="w-8 h-8 text-rose-600" />,
          accentText: "text-rose-700",
        };
      case "RECALLED":
        return {
          title: "Regulatory Product Recall Alert",
          sub: "This batch has been officially recalled by health regulatory authorities.",
          bannerBg: "bg-amber-50 border-amber-300 text-amber-950",
          badgeBg: "bg-amber-600 text-white",
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          accentText: "text-amber-700",
        };
      case "EXPIRED":
        return {
          title: "Expired Pharmaceutical Product",
          sub: "This medicine has passed its expiration date and must not be used.",
          bannerBg: "bg-yellow-50 border-yellow-300 text-yellow-950",
          badgeBg: "bg-yellow-600 text-white",
          icon: <Clock className="w-8 h-8 text-yellow-700" />,
          accentText: "text-yellow-800",
        };
      default:
        return {
          title: "Suspicious / Unverified Packaging",
          sub: "Non-standard barcode format or insufficient packaging security markings.",
          bannerBg: "bg-orange-50 border-orange-300 text-orange-950",
          badgeBg: "bg-orange-600 text-white",
          icon: <AlertCircle className="w-8 h-8 text-orange-600" />,
          accentText: "text-orange-700",
        };
    }
  };

  const config = getStatusConfig(result.status);

  const handleCopySummary = () => {
    const text = `PharmaShield Verification Certificate:\nMedicine: ${result.medicineName}\nBatch: ${result.batchNumber}\nStatus: ${result.status} (${result.confidenceScore}% Confidence)\nRisk Level: ${result.riskLevel}\nSummary: ${result.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCheckIcon = (checkStatus: string) => {
    switch (checkStatus) {
      case "PASS":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case "FAIL":
        return <XCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Primary Result Banner */}
      <div className={`rounded-xl border ${config.bannerBg} p-5 shadow-xs relative`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${config.badgeBg}`}>
                  {result.status.replace("_", " ")}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Risk Level: <strong className={config.accentText}>{result.riskLevel}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {config.title}
              </h2>
            </div>
          </div>

          {/* Confidence Badge */}
          <div className="self-end sm:self-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                Confidence
              </span>
              <span className={`text-base font-bold ${config.accentText}`}>
                {result.confidenceScore}%
              </span>
            </div>
            <span className="text-xs text-emerald-600 font-bold">✓</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-slate-200/60 mb-3">
          {result.summary}
        </p>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
          <button
            id="btn-scan-another"
            onClick={onReset}
            className="py-2 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Medicine</span>
          </button>

          <button
            id="btn-copy-report"
            onClick={handleCopySummary}
            className="py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedLink ? "Copied!" : "Share Summary"}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors flex items-center gap-1 shadow-xs"
            title="Print Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {result.status === "SUSPECTED_COUNTERFEIT" && (
            <button
              id="btn-report-fake-modal"
              onClick={onOpenReportModal}
              className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto shadow-xs"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Report to FDA / Police</span>
            </button>
          )}
        </div>
      </div>

      {/* Red Flags Alert Card */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="bg-rose-50 rounded-xl border border-rose-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Identified Red Flags & Anomalies ({result.redFlags.length})</span>
          </div>
          <ul className="space-y-1 text-xs text-rose-900">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medicine Specifications Dossier */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-600" />
          <span>Pharmaceutical Dossier</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Medicine Commercial Name
            </span>
            <span className="text-slate-900 font-bold text-sm block">
              {result.medicineName}
            </span>
            <span className="text-slate-600 text-xs block">
              {result.activeIngredient}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Manufacturer & Strength
            </span>
            <span className="text-slate-900 font-semibold text-xs flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              {result.manufacturer}
            </span>
            <span className="text-slate-600 text-xs block">
              Form: {result.dosage}
            </span>
          </div>
        </div>

        {/* Decoded GS1 Identifiers */}
        <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <Barcode className="w-3.5 h-3.5 text-sky-600" />
              <span>Decoded GS1 Healthcare Identifiers</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-medium">
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
              <span className="text-slate-900 font-bold text-sky-700 truncate block" title={result.batchNumber}>
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Forensic Security Checkpoints</span>
        </h3>

        <div className="space-y-2">
          {result.securityChecks.map((chk, index) => (
            <div
              key={index}
              className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                {getCheckIcon(chk.status)}
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">
                    {chk.name}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {chk.detail}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  chk.status === "PASS"
                    ? "bg-emerald-100 text-emerald-800"
                    : chk.status === "FAIL"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {chk.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Action Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600" />
          <span>Consumer & Patient Guidelines</span>
        </h3>

        <div className="space-y-2 text-xs">
          {result.actionRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {i + 1}
              </span>
              <span className="text-slate-700 leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Packaging Inspection */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Packaging Forensics & Raw Data Payload</span>
          </span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="p-4 pt-0 border-t border-slate-100 space-y-3 text-xs">
            {result.packagingAnalysis && (
              <div>
                <span className="text-slate-600 font-semibold block mb-1">
                  Optical & Seal Analysis:
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed text-[11px]">
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
