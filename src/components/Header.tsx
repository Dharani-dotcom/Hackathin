import React from "react";
import { ShieldCheck, History, BookOpen, Database, ExternalLink, Camera, UploadCloud, Layers, FlaskConical, Search, FileSpreadsheet } from "lucide-react";
import { FIRESTORE_CONSOLE_URL } from "../lib/firebase";

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onSelectTab: (tab: "scan" | "upload" | "methodology" | "samples" | "database" | "manual") => void;
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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Header */}
        <div 
          onClick={() => onSelectTab("scan")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-950">
                Drug Authenticity Verification
              </span>
              <span className="text-[10px] font-mono font-medium tracking-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 hidden sm:inline-block">
                GS1 / WHO Registry
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
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            title="Open Firebase Firestore Console"
          >
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>Database</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            id="btn-methodology-top"
            onClick={() => onSelectTab("methodology")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition-colors"
            title="View Solution, Tech Stack & Methodology"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Methodology</span>
          </button>

          <button
            id="btn-scan-history"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            title="Scan audit history"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Log</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5">
        <div className="max-w-6xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
          <button
            id="tab-camera-scan"
            onClick={() => onSelectTab("scan")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "scan"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            id="tab-upload-image"
            onClick={() => onSelectTab("upload")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "upload"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <button
            id="tab-methodology-showcase"
            onClick={() => onSelectTab("methodology")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "methodology"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Methodology & Tech Stack</span>
          </button>
          <button
            id="tab-test-samples"
            onClick={() => onSelectTab("samples")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "samples"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Test Scenarios (3 Risk Tiers)</span>
          </button>
          <button
            id="tab-medicine-database"
            onClick={() => onSelectTab("database")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "database"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Medicine Dossiers</span>
          </button>
          <button
            id="tab-manual-entry"
            onClick={() => onSelectTab("manual")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
              activeTab === "manual"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Manual Batch Lookup</span>
          </button>
        </div>
      </div>
    </header>
  );
};

