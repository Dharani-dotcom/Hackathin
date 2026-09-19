import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CameraScanner } from "./components/CameraScanner";
import { UploadScanner } from "./components/UploadScanner";
import { SampleMedicines } from "./components/SampleMedicines";
import { ManualLookup } from "./components/ManualLookup";
import { VerificationReport } from "./components/VerificationReport";
import { EducationalGuide } from "./components/EducationalGuide";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { ReportModal } from "./components/ReportModal";
import { VerificationResult, SampleMedicine, ManualEntryData } from "./types";
import { ShieldCheck, Sparkles, AlertCircle, RefreshCw, Smartphone, QrCode, FileText } from "lucide-react";

const STORAGE_KEY = "pharmashield_scan_history_v1";

export default function App() {
  const [activeTab, setActiveTab] = useState<"scan" | "upload" | "samples" | "manual">("scan");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<VerificationResult[]>([]);
  const [samples, setSamples] = useState<SampleMedicine[]>([]);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load history from localStorage:", e);
    }
  }, []);

  // Fetch sample medicines from backend
  useEffect(() => {
    fetch("/api/sample-medicines")
      .then((res) => res.json())
      .then((data) => {
        if (data.samples) {
          setSamples(data.samples);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch sample medicines, using fallback:", err);
      });
  }, []);

  const saveToHistory = (result: VerificationResult) => {
    setHistory((prev) => {
      // Avoid duplicate consecutive identical IDs
      const filtered = prev.filter((item) => item.id !== result.id);
      const updated = [result, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save history to localStorage:", e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear localStorage history:", e);
    }
  };

  const handleVerify = async (payload: {
    qrCodeText?: string;
    imageBase64?: string;
    manualData?: ManualEntryData;
  }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/verify-medicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error (${response.status})`);
      }

      const data = await response.json();
      if (data.result) {
        setCurrentResult(data.result);
        saveToHistory(data.result);
      } else {
        throw new Error("No verification payload returned from analysis server.");
      }
    } catch (err: any) {
      console.error("Verification failed:", err);
      setErrorMessage(
        err.message || "An unexpected error occurred while analyzing the medicine. Please retry."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: SampleMedicine) => {
    handleVerify({
      qrCodeText: sample.qrPayload,
      manualData: {
        medicineName: sample.medicineName,
        manufacturer: sample.manufacturer,
        gtin: sample.gtin,
        batchNumber: sample.batchNumber,
        expiryDate: sample.expiryDate,
      },
    });
  };

  const handleResetVerification = () => {
    setCurrentResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setShowHistory(true)}
        onOpenGuide={() => setShowGuide(true)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setCurrentResult(null);
        }}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block text-sm font-semibold text-rose-200 mb-0.5">
                Verification Issue
              </strong>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg bg-slate-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic View: If result is active, show the Forensic Verification Report */}
        {currentResult ? (
          <VerificationReport
            result={currentResult}
            onReset={handleResetVerification}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-start">
            {/* Top Subtitle / Context */}
            <div className="text-center mb-6 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-sky-400 font-medium mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Vision + GS1 2D DataMatrix Forensic Engine</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                Smartphone Counterfeit Medicine Detector
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan pharmaceutical QR codes, barcodes, or packaging with your smartphone camera to verify authentic batches, check recalls, and detect falsified drugs.
              </p>
            </div>

            {/* Tab Views */}
            {activeTab === "scan" && (
              <CameraScanner
                onScanComplete={handleVerify}
                isAnalyzing={isAnalyzing}
                onSwitchToUpload={() => setActiveTab("upload")}
              />
            )}

            {activeTab === "upload" && (
              <UploadScanner
                onVerify={handleVerify}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === "samples" && (
              <SampleMedicines
                samples={samples}
                onSelectSample={handleSelectSample}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === "manual" && (
              <ManualLookup
                onVerify={(manualData) => handleVerify({ manualData })}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            PharmaShield AI • Verified against WHO & GS1 Healthcare Standards
          </span>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={() => setShowGuide(true)}
              className="hover:text-sky-400 transition-colors"
            >
              Forensic Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHistory(true)}
              className="hover:text-sky-400 transition-colors"
            >
              Scan Log ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      {showGuide && <EducationalGuide onClose={() => setShowGuide(false)} />}

      {showHistory && (
        <HistoryDrawer
          history={history}
          onSelectResult={(res) => {
            setCurrentResult(res);
            setShowHistory(false);
          }}
          onClearHistory={handleClearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showReportModal && currentResult && (
        <ReportModal
          result={currentResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
