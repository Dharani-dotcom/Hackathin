import React from "react";
import { FIRESTORE_CONSOLE_URL } from "../lib/firebase";

interface HeaderProps {
  onOpenGuide: () => void;
  onSelectTab: (tab: "upload" | "methodology" | "samples" | "database" | "manual") => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onSelectTab,
  activeTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Header */}
        <div 
          onClick={() => onSelectTab("upload")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-950">
                Drug Authenticity Verification
              </span>
              <span className="text-[10px] font-mono font-medium tracking-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline-block">
                GS1 / WHO Database
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Pharmaceutical Forensic Screening & Packaging Inspection
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <a
            id="btn-open-firebase-console"
            href={FIRESTORE_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            title="Open Firebase Firestore Database Console"
          >
            Database Console
          </a>

          <button
            id="btn-methodology-top"
            onClick={() => onSelectTab("methodology")}
            className="inline-flex items-center px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            title="View Solution, Tech Stack & Methodology"
          >
            Methodology
          </button>
        </div>
      </div>

      {/* Navigation tabs - Clean text based, no excessive icons */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5">
        <div className="max-w-6xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
          <button
            id="tab-upload-image"
            onClick={() => onSelectTab("upload")}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "upload"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            Upload Photo
          </button>
          <button
            id="tab-methodology-showcase"
            onClick={() => onSelectTab("methodology")}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "methodology"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            Solution & Methodology
          </button>
          <button
            id="tab-test-samples"
            onClick={() => onSelectTab("samples")}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "samples"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            Test Scenarios (3 Risk Tiers)
          </button>
          <button
            id="tab-medicine-database"
            onClick={() => onSelectTab("database")}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "database"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            Medicine Database
          </button>
          <button
            id="tab-manual-entry"
            onClick={() => onSelectTab("manual")}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "manual"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            Manual Batch Lookup
          </button>
        </div>
      </div>
    </header>
  );
};
