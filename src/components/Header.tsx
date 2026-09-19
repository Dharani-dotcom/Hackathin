import React from "react";
import { ShieldCheck, History, BookOpen, AlertTriangle } from "lucide-react";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onSelectTab: (tab: "scan" | "upload" | "samples" | "manual") => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenGuide,
  onSelectTab,
  activeTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab("scan")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Pharma<span className="text-sky-400">Shield</span> AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                GS1 Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smartphone Counterfeit Medicine & Packaging Detector
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-safety-guide"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors"
            title="How to spot counterfeit drugs"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Safety Guide</span>
          </button>

          <button
            id="btn-scan-history"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors"
            title="View scan history"
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-500 text-slate-950">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation tabs for mobile / smartphone user ease */}
      <div className="bg-slate-950/70 border-t border-slate-800/60 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            id="tab-camera-scan"
            onClick={() => onSelectTab("scan")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              activeTab === "scan"
                ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            📸 Live Scanner
          </button>
          <button
            id="tab-upload-image"
            onClick={() => onSelectTab("upload")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              activeTab === "upload"
                ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            📁 Upload Photo / QR
          </button>
          <button
            id="tab-test-samples"
            onClick={() => onSelectTab("samples")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              activeTab === "samples"
                ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            🧪 Test Demo Meds
          </button>
          <button
            id="tab-manual-entry"
            onClick={() => onSelectTab("manual")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              activeTab === "manual"
                ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/25"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            ⌨️ Manual Batch Lookup
          </button>
        </div>
      </div>
    </header>
  );
};
