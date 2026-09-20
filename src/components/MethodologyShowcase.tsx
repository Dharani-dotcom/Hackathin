import React, { useState } from "react";

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
      <div className="bg-slate-100 rounded p-1 border border-slate-200 flex flex-wrap sm:flex-nowrap gap-1">
        <button
          id="tab-slide-methodology"
          onClick={() => setActiveSlide("methodology")}
          className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center transition-all ${
            activeSlide === "methodology"
              ? "bg-slate-900 text-white shadow-xs font-mono"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-mono"
          }`}
        >
          01. SOLUTION AND METHODOLOGY
        </button>

        <button
          id="tab-slide-techstack"
          onClick={() => setActiveSlide("techstack")}
          className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center transition-all ${
            activeSlide === "techstack"
              ? "bg-slate-900 text-white shadow-xs font-mono"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-mono"
          }`}
        >
          02. TECHNOLOGY STACK
        </button>

        <button
          id="tab-slide-usp"
          onClick={() => setActiveSlide("usp")}
          className={`flex-1 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center transition-all ${
            activeSlide === "usp"
              ? "bg-slate-900 text-white shadow-xs font-mono"
              : "text-slate-700 hover:text-slate-950 hover:bg-slate-200/60 font-mono"
          }`}
        >
          03. UPS(UNIQUE SELLING PROPOSITION)
        </button>
      </div>

      {/* Slide 1: Solution and Methodology */}
      {activeSlide === "methodology" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          {/* Slide Header */}
          <div className="text-center max-w-2xl mx-auto border-b border-slate-100 pb-5">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
              INNOVATION / TECHNIQUES DETAILS
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-1 uppercase">
              SOLUTION AND METHODOLOGY
            </h2>
            <h3 className="text-xs sm:text-sm font-bold text-sky-800 tracking-wide uppercase mb-3">
              AI POWERED COUNTERFEIT MEDICINE DETECTION
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              A Smart and easy to use platform that combines multiple verification signals to check the authenticity of the medicine packages .
            </p>
          </div>

          {/* Core 3-Stage Diagram: INPUT -> MULTI-LAYER VERIFICATION -> OUTPUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch pt-2">
            {/* 1. INPUT */}
            <div className="lg:col-span-3 bg-slate-50 rounded border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
                  INPUT :
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-full bg-white border-2 border-sky-400 text-center font-medium text-slate-800 shadow-xs">
                    Medicine Image via upload/scan
                  </div>

                  <div className="p-3 rounded-full bg-white border-2 border-sky-400 text-center font-medium text-slate-800 shadow-xs">
                    QR Code / Barcode
                  </div>

                  <div className="p-3 rounded-full bg-white border-2 border-sky-400 text-center font-medium text-slate-800 shadow-xs">
                    Text Information
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 text-center text-[10px] text-slate-400 font-mono">
                Physical Packaging & Barcodes
              </div>
            </div>

            {/* 2. MULTI-LAYER VERIFICATION */}
            <div className="lg:col-span-5 bg-slate-50 rounded border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
                  MULTI-LAYER VERIFICATION :
                </h3>

                {/* 5 Connected Verification Pillars */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="col-span-2 p-3 rounded bg-white border border-slate-300 text-center shadow-xs">
                    <span className="font-bold text-slate-900 block text-xs">Visual Analysis</span>
                    <span className="text-[11px] text-slate-500">Packaging typography, seal & hologram inspection</span>
                  </div>

                  <div className="p-3 rounded bg-white border border-slate-300 text-center shadow-xs">
                    <span className="font-bold text-slate-900 block text-xs">Digital Security</span>
                    <span className="text-[11px] text-slate-500">GS1 checksum & DataMatrix format</span>
                  </div>

                  <div className="p-3 rounded bg-white border border-slate-300 text-center shadow-xs">
                    <span className="font-bold text-slate-900 block text-xs">Database Check</span>
                    <span className="text-[11px] text-slate-500">Authentic batches & alert records</span>
                  </div>

                  <div className="p-3 rounded bg-white border border-slate-300 text-center shadow-xs">
                    <span className="font-bold text-slate-900 block text-xs">Data Validation</span>
                    <span className="text-[11px] text-slate-500">Expiry dates & serial validation</span>
                  </div>

                  <div className="p-3 rounded bg-white border border-slate-300 text-center shadow-xs">
                    <span className="font-bold text-slate-900 block text-xs">AI Reasoning</span>
                    <span className="text-[11px] text-slate-500">Multimodal discrepancy synthesis</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-center text-[10px] text-slate-400 font-mono">
                Comprehensive Multi-Signal Validation
              </div>
            </div>

            {/* 3. OUTPUT */}
            <div className="lg:col-span-4 bg-sky-50/60 rounded border-2 border-sky-300 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-900 mb-2 pb-2 border-b border-sky-200">
                  OUTPUT :
                </h3>

                <div className="bg-white rounded border border-sky-200 p-3.5 mb-3 shadow-xs">
                  <h4 className="font-display font-bold text-slate-950 text-xs sm:text-sm uppercase mb-1">
                    COUNTERFEIT RISK SCORE
                  </h4>
                  <p className="text-[11px] font-medium text-slate-600 mb-3">
                    Preliminary Authenticity Screening
                  </p>

                  {/* 3 Risk Tiers */}
                  <div className="space-y-1.5 text-xs font-mono font-semibold">
                    <div className="p-1.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 flex justify-between">
                      <span>Low Risk</span>
                      <span className="font-normal text-[10px]">Authentic</span>
                    </div>
                    <div className="p-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex justify-between">
                      <span>Medium Risk</span>
                      <span className="font-normal text-[10px]">Anomaly Detected</span>
                    </div>
                    <div className="p-1.5 rounded bg-rose-50 text-rose-900 border border-rose-200 flex justify-between">
                      <span>High Risk</span>
                      <span className="font-normal text-[10px]">Falsified</span>
                    </div>
                  </div>

                  <p className="text-[11px] font-sans font-medium text-slate-700 mt-3 pt-2 border-t border-slate-100">
                    + Explainable reasons for the result
                  </p>
                </div>
              </div>

              {onSelectMvpTier && (
                <div className="pt-2 border-t border-sky-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono text-[11px]">Test Scenarios:</span>
                  <div className="flex gap-1 font-mono text-xs">
                    <button
                      onClick={() => onSelectMvpTier("LOW")}
                      className="px-2 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      Low
                    </button>
                    <button
                      onClick={() => onSelectMvpTier("MEDIUM")}
                      className="px-2 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => onSelectMvpTier("HIGH")}
                      className="px-2 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
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

      {/* Slide 2: Technology Stack (Exact Content from Slide 6) */}
      {activeSlide === "techstack" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          {/* Slide Header */}
          <div className="text-center max-w-2xl mx-auto border-b border-slate-100 pb-5">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
              INNOVATION / TECHNIQUES DETAILS
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2 uppercase">
              TECHNOLOGY STACK
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Flow Column (SCANNING UI -> LLM Model -> Database and backend) */}
            <div className="lg:col-span-4 bg-slate-50 rounded border border-slate-200 p-4 sm:p-5 flex flex-col items-center space-y-4 text-center">
              {/* Node 1: SCANNING UI */}
              <div className="w-full space-y-2">
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-900 block">
                  SCANNING UI
                </span>
                <div className="bg-sky-100/70 border border-sky-300 rounded-lg p-3 text-slate-900 font-semibold text-xs shadow-xs">
                  Flutter / React Native + CameraX API
                </div>
              </div>

              {/* Arrow Down */}
              <div className="text-slate-400 font-mono text-base font-bold select-none">
                ▼
              </div>

              {/* Node 2: LLM Model */}
              <div className="w-full space-y-2">
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-900 block">
                  LLM Model
                </span>
                <div className="bg-sky-100/70 border border-sky-300 rounded-lg p-3 text-slate-900 font-semibold text-xs shadow-xs">
                  Open cv.js+ Gemini 3.5 and GPT-4o
                </div>
              </div>

              {/* Arrow Down */}
              <div className="text-slate-400 font-mono text-base font-bold select-none">
                ▼
              </div>

              {/* Node 3: Database and backend */}
              <div className="w-full space-y-2">
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-900 block">
                  Database and backend
                </span>
                <div className="bg-sky-100/70 border border-sky-300 rounded-lg p-3 text-slate-900 font-semibold text-xs shadow-xs">
                  FASTAPI+FIREBASE
                </div>
              </div>
            </div>

            {/* Right Table Column: Exact table from Slide 6 */}
            <div className="lg:col-span-8 overflow-x-auto rounded border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3.5 border-r border-slate-800">Layer / Component</th>
                    <th className="py-3 px-3.5 border-r border-slate-800">Technology</th>
                    <th className="py-3 px-3.5">Details & Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 font-sans">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      FRONTEND UI
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      FLUTTER/REACTNATIVE
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Native-speed cross-platform image acquisition
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      BACKEND API
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      FASTAPI/NODE.JS
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Scalable low-latency image backend.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      LLM MODEL(AI CORE)
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      GPT-4o mini /Gemini 3.5 flash
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Fast, low-cost multimodal text screening.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      DATABASE AND AUTH
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      FIREBASE/SUPABASE
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Serverless real-time data synchronization.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      DEPLOYMENT
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      Firebase-Frontend/Google cloud-Backend
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Instant mobile app delivery.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      Camera to stream live image(Scanning)
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      WebRTC / WebSockets
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Continuous camera stream fraud detection
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-bold text-slate-900 border-r border-slate-200 uppercase font-mono text-[11px]">
                      To Block invalid non-medicine camera scans
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 border-r border-slate-200">
                      Out-of-Distribution (OOD) Guardrails
                    </td>
                    <td className="py-3 px-3.5 text-slate-600">
                      Intelligent non-medicine image filter guardrails.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Slide 3: UPS (Unique Selling Proposition) (Exact Content from Slide 8) */}
      {activeSlide === "usp" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 space-y-6 animate-fade-in">
          {/* Slide Header */}
          <div className="text-center max-w-2xl mx-auto border-b border-slate-100 pb-5">
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
              INNOVATION / TECHNIQUES DETAILS
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2 uppercase">
              UPS(UNIQUE SELLING PROPOSITION)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: EXISTING SOLUTION VS OUR SOLUTION Table */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wide">
                EXISTING SOLUTION VS OUR SOLUTION :
              </h3>

              <div className="overflow-x-auto rounded border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-3.5 border-r border-slate-800">EXISTING SOLUTION</th>
                      <th className="py-3 px-3.5 border-r border-slate-800">LIMITATION</th>
                      <th className="py-3 px-3.5">OUR SOLUTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700 font-sans">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3.5 font-bold text-slate-900 border-r border-slate-200">
                        QR/Barcode Scanning
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 border-r border-slate-200 bg-slate-50/40">
                        Checks only if the code is valid
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-900 font-semibold bg-sky-50/40">
                        Multi-layer Verification instead of relying on the code
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3.5 font-bold text-slate-900 border-r border-slate-200">
                        Manual Inspection
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 border-r border-slate-200 bg-slate-50/40">
                        Slow and heavy human dependency
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-900 font-semibold bg-sky-50/40">
                        Automated AI assited screening
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3.5 font-bold text-slate-900 border-r border-slate-200">
                        Database Lookup
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 border-r border-slate-200 bg-slate-50/40">
                        Checks product & batch informations only
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-900 font-semibold bg-sky-50/40">
                        Combines product data with packaging analysis
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3.5 font-bold text-slate-900 border-r border-slate-200">
                        Visual Checking
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 border-r border-slate-200 bg-slate-50/40">
                        Small difference are hard to notice
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-900 font-semibold bg-sky-50/40">
                        AI based packaging anomaly detection
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: UNIQUE FEATURES */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wide">
                UNIQUE FEATURES :
              </h3>

              <div className="bg-slate-50 rounded border border-slate-200 p-5 space-y-4 shadow-xs">
                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-900 text-sm leading-none shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-950 font-bold">Multi Signal Verification</strong>
                      <span className="text-slate-600 font-normal"> - Combines multiple independent checks rather than just one</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-900 text-sm leading-none shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-950 font-bold">AI Packaging Analysis</strong>
                      <span className="text-slate-600 font-normal"> - Identifies suspicious diffrence in logo , packaging etc .</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-900 text-sm leading-none shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-950 font-bold">Counterfeit Risk Score</strong>
                      <span className="text-slate-600 font-normal"> - Converts the collected evidences into low/medium/high risk result</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="font-bold text-slate-900 text-sm leading-none shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-950 font-bold">Scalable Web Platform</strong>
                      <span className="text-slate-600 font-normal"> - Designed for consumers , pharmacies and hospitals</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
