import React from "react";
import {
  History,
  X,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Clock,
  ArrowRight
} from "lucide-react";
import { VerificationResult } from "../types";

interface HistoryDrawerProps {
  history: VerificationResult[];
  onSelectResult: (result: VerificationResult) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onClose,
}) => {
  const getBadge = (status: string) => {
    switch (status) {
      case "AUTHENTIC":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            AUTHENTIC
          </span>
        );
      case "SUSPECTED_COUNTERFEIT":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            COUNTERFEIT
          </span>
        );
      case "RECALLED":
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            RECALLED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <h3 className="font-bold text-sm text-white">Scan & Verification History</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors p-1"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
              <History className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
              <p className="font-semibold text-slate-400 mb-1">No Scans Recorded Yet</p>
              <p className="text-slate-500 max-w-xs">
                Medicines you scan using your smartphone camera or upload will be stored here for future reference.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="bg-slate-950 hover:bg-slate-850 p-3.5 rounded-xl border border-slate-850 hover:border-slate-700 cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white group-hover:text-sky-400 transition-colors">
                      {item.medicineName}
                    </span>
                    {getBadge(item.status)}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Batch: <span className="text-slate-300">{item.batchNumber}</span> • {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    {item.summary}
                  </p>
                </div>

                <div className="self-center">
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Stored locally on this device for clinical continuity.
        </div>
      </div>
    </div>
  );
};
