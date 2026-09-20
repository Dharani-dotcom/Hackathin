import React from "react";
import {
  History,
  X,
  Trash2,
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
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            AUTHENTIC
          </span>
        );
      case "SUSPECTED_COUNTERFEIT":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
            COUNTERFEIT
          </span>
        );
      case "RECALLED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
            RECALLED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-sm text-slate-900">Scan & Verification Log</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors p-1"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
              <History className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="font-semibold text-slate-700 mb-1">No Scans Recorded Yet</p>
              <p className="text-slate-500 max-w-xs">
                Medicines you scan using your camera or upload will be logged here and synced to Firestore.
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
                className="bg-slate-50 hover:bg-sky-50/50 p-3 rounded-xl border border-slate-200 hover:border-sky-300 cursor-pointer transition-colors flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-sky-700 transition-colors">
                      {item.medicineName}
                    </span>
                    {getBadge(item.status)}
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Batch: <span className="text-slate-800 font-semibold">{item.batchNumber}</span> • {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-slate-600 line-clamp-1">
                    {item.summary}
                  </p>
                </div>

                <div className="self-center">
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 text-center text-[11px] text-slate-500 bg-slate-50">
          Stored securely in browser session & Firestore cloud audit log.
        </div>
      </div>
    </div>
  );
};
