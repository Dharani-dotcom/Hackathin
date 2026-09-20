import React, { useState } from "react";
import {
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Server,
  Database,
  Cloud,
  Video,
  ShieldAlert,
  Search,
  FileCheck,
  Eye,
  Check,
  Zap,
  TrendingUp,
  BarChart3,
  Camera,
  QrCode,
  FileText,
  Binary,
  Microscope,
  Boxes
} from "lucide-react";

interface MethodologyShowcaseProps {
  onSelectMvpTier?: (riskTier: "LOW" | "MEDIUM" | "HIGH") => void;
}

export const MethodologyShowcase: React.FC<MethodologyShowcaseProps> = ({
  onSelectMvpTier,
}) => {
  const [activeSlide, setActiveSlide] = useState<"methodology" | "techstack" | "usp">("methodology");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Slide Navigation Tabs */}
      <div className="bg-slate-100 rounded-lg p-1 border border-slate-200 flex flex-wrap sm:flex-nowrap gap-1">
        <button
          id="tab-slide-methodology"
          onClick={() => setActiveSlide("methodology")}
          className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSlide === "methodology"
              ? "bg-slate-900 text-white shadow-xs font-mono"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-mono"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>01. METHODOLOGY & PIPELINE</span>
        </button>

        <button
          id="tab-slide-techstack"
          onClick={() => setActiveSlide("techstack")}
          className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSlide === "techstack"
              ? "bg-slate-900 text-white shadow-xs font-mono"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-mono"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>02. TECHNICAL ARCHITECTURE</span>
        </button>

        <button
          id="tab-slide-usp"
          onClick={() => setActiveSlide("usp")}
          className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            activeSlide === "usp"
              ? "bg-slate-900 text-white shadow-xs font-mono"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-mono"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>03. COMPARATIVE BENCHMARK</span>
        </button>
      </div>

      {/* Slide 1: Solution & Methodology */}
      {activeSlide === "methodology" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 mb-2">
              VERIFICATION FRAMEWORK
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2">
              Multi-Signal Pharmaceutical Authentication Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Synchronized verification architecture combining optical forensics, GS1 application identifiers, and clinical master registries.
            </p>
          </div>

          {/* 3-Step Pipeline Diagram: Input -> Multi-Layer Verification -> Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* 1. INPUT */}
            <div className="lg:col-span-3 bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    01
                  </span>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900">
                    INPUT SIGNALS
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 text-[11px]">Packaging Image</strong>
                      <span className="text-[10px] text-slate-500 font-mono">Camera scan or upload</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 text-[11px]">2D DataMatrix</strong>
                      <span className="text-[10px] text-slate-500 font-mono">GS1 (01, 10, 17, 21)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <strong className="block text-slate-900 text-[11px]">Label OCR Data</strong>
                      <span className="text-[10px] text-slate-500 font-mono">Batch, GTIN, Expiry, Lab</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Multi-Modal Ingestion</span>
              </div>
            </div>

            {/* 2. MULTI-LAYER VERIFICATION */}
            <div className="lg:col-span-5 bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    02
                  </span>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900">
                    VERIFICATION MATRIX
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] mb-1">
                      <Eye className="w-3.5 h-3.5 text-slate-700" />
                      <span>Visual Inspection</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      Anomaly detection in font typography, foil debossing, and security seals.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] mb-1">
                      <Binary className="w-3.5 h-3.5 text-slate-700" />
                      <span>Digital Checksum</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      Modulo-10 GTIN checksum and GS1 standard application identifier parsing.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] mb-1">
                      <Database className="w-3.5 h-3.5 text-slate-700" />
                      <span>Registry Lookup</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      Cross-reference against authorized manufacturer lots and WHO alerts.
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] mb-1">
                      <FileCheck className="w-3.5 h-3.5 text-slate-700" />
                      <span>Format & Expiry</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      Lot format validation and shelf-life expiration chronological audit.
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 p-2.5 rounded bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] mb-0.5">
                    <Microscope className="w-3.5 h-3.5 text-slate-800" />
                    <span>Forensic Reasoning Engine</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Synthesizes physical packaging cues against clinical drug specifications to score authenticity.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 font-mono">5 Independent Forensic Vectors</span>
              </div>
            </div>

            {/* 3. OUTPUT */}
            <div className="lg:col-span-4 bg-slate-900 text-white rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded bg-emerald-400 text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center">
                    03
                  </span>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-100">
                    OUTPUT RISK CLASSIFICATION
                  </h3>
                </div>

                <div className="space-y-2 mb-3 text-xs">
                  <div className="p-2 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <strong className="text-[11px] text-emerald-300 font-mono">LOW RISK</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Verified Authentic</span>
                  </div>

                  <div className="p-2 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <strong className="text-[11px] text-amber-300 font-mono">MEDIUM RISK</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Anomaly / Warning</span>
                  </div>

                  <div className="p-2 rounded bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <strong className="text-[11px] text-rose-300 font-mono">HIGH RISK</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Falsified Counterfeit</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
                  <strong className="block text-white mb-0.5 font-semibold">+ Forensic Evidence Dossier</strong>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Point-by-point security checkpoint logs, identified discrepancies, and regulatory actions.
                  </p>
                </div>
              </div>

              {onSelectMvpTier && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-1 text-[10px]">
                  <span className="text-slate-400 font-mono">Test Tier:</span>
                  <div className="flex gap-1 font-mono">
                    <button
                      onClick={() => onSelectMvpTier("LOW")}
                      className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-700 hover:bg-emerald-900 transition-colors"
                    >
                      Low
                    </button>
                    <button
                      onClick={() => onSelectMvpTier("MEDIUM")}
                      className="px-2 py-1 rounded bg-amber-950 text-amber-300 font-bold border border-amber-700 hover:bg-amber-900 transition-colors"
                    >
                      Med
                    </button>
                    <button
                      onClick={() => onSelectMvpTier("HIGH")}
                      className="px-2 py-1 rounded bg-rose-950 text-rose-300 font-bold border border-rose-700 hover:bg-rose-900 transition-colors"
                    >
                      High
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide 2: Technology Stack */}
      {activeSlide === "techstack" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 mb-2">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2">
              Production Technology Stack
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              High-throughput architecture engineered for edge camera capture, low-latency verification, and persistent regulatory auditing.
            </p>
          </div>

          {/* Technology Stack Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Framework / Technology</th>
                  <th className="py-3 px-4">Role & Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-sans">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-700" />
                    Frontend Interface
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    React / Flutter / CameraX API
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    High-frame-rate optical scanning viewport with real-time barcode alignment guide.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-700" />
                    Backend Core
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    Node.js Express / FastAPI
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    High-throughput verification engine, GS1 DataMatrix parser & cryptographic checksum validator.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-slate-700" />
                    Vision Reasoning Engine
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    Multimodal Vision Models (Gemini Flash / GPT-4o mini)
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Sub-second packaging anomaly detection, typography kerning, and counterfeit seal identification.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-700" />
                    Registry & Audit Log
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    Firebase Firestore / PostgreSQL
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Cloud database for master drug product lists, batch registries, and counterfeit reports.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-slate-700" />
                    Deployment Infra
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    Google Cloud Run / Edge CDN
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Serverless containerized autoscaling architecture with global edge distribution.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-700" />
                    Input Guardrails
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    Out-of-Distribution (OOD) Filters
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    Pre-processing filter rejecting non-pharmaceutical images to protect verification accuracy.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide 3: USP & Existing vs Our Solution */}
      {activeSlide === "usp" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200 mb-2">
              COMPETITIVE ANALYSIS
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2">
              Existing Approaches vs. Multi-Signal Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Why single-layer barcode scanning fails against physical packaging counterfeiting, and how our multi-vector approach solves it.
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-rose-300">Vulnerability & Limitation</th>
                  <th className="py-3 px-4 text-emerald-300">Our Multi-Signal Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Standard Barcode Reader
                  </td>
                  <td className="py-3.5 px-4 text-rose-800 bg-rose-50/40">
                    Validates only QR text format; easily cloned and copied by counterfeiters onto fake boxes.
                  </td>
                  <td className="py-3.5 px-4 text-emerald-900 bg-emerald-50/40 font-medium">
                    Cross-examines decoded barcode data against packaging typography, seal integrity, and physical forensics.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Manual Pharmacist Inspection
                  </td>
                  <td className="py-3.5 px-4 text-rose-800 bg-rose-50/40">
                    Time-consuming, subjective, prone to human fatigue, and requires specialized regulatory training.
                  </td>
                  <td className="py-3.5 px-4 text-emerald-900 bg-emerald-50/40 font-medium">
                    Automated forensic packaging inspection completed in under 3 seconds with explainable red flags.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Simple Database Lookup
                  </td>
                  <td className="py-3.5 px-4 text-rose-800 bg-rose-50/40">
                    Checks only if batch number exists; cannot detect re-used authentic batch numbers on counterfeit boxes.
                  </td>
                  <td className="py-3.5 px-4 text-emerald-900 bg-emerald-50/40 font-medium">
                    Combines master registries with packaging visual anomaly checks to flag re-printed and illicit packaging.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Visual Spot Checks
                  </td>
                  <td className="py-3.5 px-4 text-rose-800 bg-rose-50/40">
                    Subtle font kerning errors, holographic variations, and foil texture deviations go unnoticed.
                  </td>
                  <td className="py-3.5 px-4 text-emerald-900 bg-emerald-50/40 font-medium">
                    High-precision optical anomaly detection inspecting micro-typography and tamper-evident security elements.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4 Unique Features Grid */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
              Core Architectural Advantages
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center">
                    01
                  </span>
                  <span>Multi-Vector Correlation</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Correlates physical optical cues, GS1 standard formats, regulatory registries, and shelf-life logic.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center">
                    02
                  </span>
                  <span>Forensic Packaging Analysis</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Identifies subtle manufacturer logo misprints, font kerning variations, and compromised tamper seals.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center">
                    03
                  </span>
                  <span>Tri-Tier Risk Categorization</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Outputs transparent Low, Medium, and High risk classifications with specific, actionable clinical steps.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                  <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center">
                    04
                  </span>
                  <span>Regulatory-Ready Audit Logs</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Direct integration with Firebase Firestore for persistent counterfeit medicine incident logging.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

