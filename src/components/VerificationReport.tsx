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
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  Calendar,
  Barcode,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { VerificationResult, VerificationStatus, RiskLevel } from "../types";

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
          sub: "Matches official manufacturer registry and passed all GS1 security standards.",
          bannerBg: "bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900",
          borderColor: "border-emerald-500/40",
          badgeBg: "bg-emerald-500 text-slate-950",
          icon: <ShieldCheck className="w-9 h-9 text-emerald-400" />,
          accentText: "text-emerald-400",
        };
      case "SUSPECTED_COUNTERFEIT":
        return {
          title: "CRITICAL: Suspected Counterfeit Drug",
          sub: "DO NOT INGEST! Severe discrepancies found matching known falsified medical products.",
          bannerBg: "bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900",
          borderColor: "border-rose-500/50",
          badgeBg: "bg-rose-500 text-white animate-pulse",
          icon: <AlertOctagon className="w-9 h-9 text-rose-400" />,
          accentText: "text-rose-400",
        };
      case "RECALLED":
        return {
          title: "Regulatory Product Recall Alert",
          sub: "This specific batch has been recalled by health authorities due to quality defects.",
          bannerBg: "bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900",
          borderColor: "border-amber-500/40",
          badgeBg: "bg-amber-500 text-slate-950",
          icon: <AlertTriangle className="w-9 h-9 text-amber-400" />,
          accentText: "text-amber-400",
        };
      case "EXPIRED":
        return {
          title: "Expired Pharmaceutical Product",
          sub: "This medicine has exceeded manufacturer guaranteed shelf-life and stability.",
          bannerBg: "bg-gradient-to-br from-yellow-950 via-slate-900 to-slate-900",
          borderColor: "border-yellow-500/40",
          badgeBg: "bg-yellow-500 text-slate-950",
          icon: <Clock className="w-9 h-9 text-yellow-400" />,
          accentText: "text-yellow-400",
        };
      default:
        return {
          title: "Suspicious / Unverified Packaging",
          sub: "Insufficient anti-counterfeit markings or non-compliant GS1 2D barcode format.",
          bannerBg: "bg-gradient-to-br from-orange-950 via-slate-900 to-slate-900",
          borderColor: "border-orange-500/40",
          badgeBg: "bg-orange-500 text-white",
          icon: <AlertCircle className="w-9 h-9 text-orange-400" />,
          accentText: "text-orange-400",
        };
    }
  };

  const config = getStatusConfig(result.status);

  const handleCopySummary = () => {
    const text = `PharmaShield AI Verification Report:\nProduct: ${result.medicineName}\nBatch: ${result.batchNumber}\nStatus: ${result.status} (${result.confidenceScore}% Confidence)\nRisk Level: ${result.riskLevel}\nSummary: ${result.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getCheckIcon = (checkStatus: string) => {
    switch (checkStatus) {
      case "PASS":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "FAIL":
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Primary Result Banner */}
      <div
        className={`rounded-2xl border ${config.borderColor} ${config.bannerBg} p-5 sm:p-6 shadow-2xl relative overflow-hidden`}
      >
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-sky-500/5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center shadow-lg">
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${config.badgeBg}`}>
                  {result.status.replace("_", " ")}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Risk: <strong className={config.accentText}>{result.riskLevel}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {config.title}
              </h2>
            </div>
          </div>

          {/* Confidence Score Circle */}
          <div className="self-end sm:self-center flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-xl">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                AI Confidence
              </span>
              <span className={`text-lg font-black ${config.accentText}`}>
                {result.confidenceScore}%
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-sky-400 flex items-center justify-center text-[10px] font-bold text-slate-300">
              ✓
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          {result.summary}
        </p>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            id="btn-scan-another"
            onClick={onReset}
            className="py-2 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another Medicine</span>
          </button>

          <button
            id="btn-copy-report"
            onClick={handleCopySummary}
            className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copiedLink ? "Copied!" : "Share Report"}</span>
          </button>

          {result.status === "SUSPECTED_COUNTERFEIT" && (
            <button
              id="btn-report-fake-modal"
              onClick={onOpenReportModal}
              className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Report Illicit Drug</span>
            </button>
          )}
        </div>
      </div>

      {/* Red Flags Alert Card (If applicable) */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="bg-rose-950/30 rounded-2xl border border-rose-500/30 p-4 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>Identified Red Flags & Forensic Discrepancies ({result.redFlags.length})</span>
          </div>
          <ul className="space-y-1.5 text-xs text-rose-200/90">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span className="leading-snug">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medicine Specifications Dossier */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Pharmaceutical Dossier</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Medicine Commercial Name
            </span>
            <span className="text-white font-bold text-sm block">
              {result.medicineName}
            </span>
            <span className="text-slate-400 text-[11px] block">
              {result.activeIngredient}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Indicated Manufacturer
            </span>
            <span className="text-white font-semibold text-xs flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              {result.manufacturer}
            </span>
            <span className="text-slate-400 text-[11px] block">
              Dosage: {result.dosage}
            </span>
          </div>
        </div>

        {/* Decoded GS1 Identifiers Table */}
        <div className="mt-3 bg-slate-950 rounded-xl p-3 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Barcode className="w-3.5 h-3.5 text-sky-400" />
              <span>Decoded GS1 Healthcare Identifiers</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              GS1 2D DataMatrix
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[9px] block">AI (01) GTIN</span>
              <span className="text-slate-200 font-medium truncate block" title={result.gtin}>
                {result.gtin || "N/A"}
              </span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[9px] block">AI (10) BATCH / LOT</span>
              <span className="text-slate-200 font-bold text-sky-300 truncate block" title={result.batchNumber}>
                {result.batchNumber || "N/A"}
              </span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[9px] block">AI (17) EXPIRY</span>
              <span className={`font-semibold block ${result.isExpired ? "text-rose-400 font-bold" : "text-slate-200"}`}>
                {result.expiryDate || "N/A"}
              </span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[9px] block">AI (21) SERIAL</span>
              <span className="text-slate-200 truncate block" title={result.serialNumber}>
                {result.serialNumber || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Checks Matrix */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Forensic Security Verifications</span>
        </h3>

        <div className="space-y-2">
          {result.securityChecks.map((chk, index) => (
            <div
              key={index}
              className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                {getCheckIcon(chk.status)}
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    {chk.name}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {chk.detail}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  chk.status === "PASS"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : chk.status === "FAIL"
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {chk.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Action Checklist */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-400" />
          <span>Patient & Consumer Action Directives</span>
        </h3>

        <div className="space-y-2 text-xs">
          {result.actionRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                {i + 1}
              </span>
              <span className="text-slate-300 leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Packaging Inspection & Raw Barcode Data */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Packaging Forensics & Raw Data Payload</span>
          </span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 text-xs">
            {result.packagingAnalysis && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Optical & Seal Analysis:
                </span>
                <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-850 leading-relaxed text-[11px]">
                  {result.packagingAnalysis}
                </p>
              </div>
            )}

            {result.rawQrData && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Decoded Raw Barcode Payload:
                </span>
                <p className="text-slate-300 font-mono text-[10px] break-all bg-slate-950 p-2.5 rounded-xl border border-slate-850">
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
