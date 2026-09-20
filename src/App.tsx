import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CameraScanner } from "./components/CameraScanner";
import { UploadScanner } from "./components/UploadScanner";
import { SampleMedicines } from "./components/SampleMedicines";
import { MethodologyShowcase } from "./components/MethodologyShowcase";
import { ManualLookup } from "./components/ManualLookup";
import { MedicineDatabaseViewer } from "./components/MedicineDatabaseViewer";
import { VerificationReport } from "./components/VerificationReport";
import { EducationalGuide } from "./components/EducationalGuide";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { ReportModal } from "./components/ReportModal";
import { VerificationResult, SampleMedicine, ManualEntryData } from "./types";
import { MedicineRecord, logVerificationToFirestore } from "./lib/medicineDb";
import { Sparkles, AlertCircle } from "lucide-react";

const STORAGE_KEY = "med_verification_history_v1";

export default function App() {
  const [activeTab, setActiveTab] = useState<"scan" | "upload" | "methodology" | "samples" | "database" | "manual">("scan");
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
      const filtered = prev.filter((item) => item.id !== result.id);
      const updated = [result, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save history to localStorage:", e);
      }
      return updated;
    });

    // Also persist log to Firestore
    logVerificationToFirestore(result).catch((err) => {
      console.warn("Firestore background logging notice:", err);
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

  const handleSelectMvpTier = (riskTier: "LOW" | "MEDIUM" | "HIGH") => {
    const target = samples.find((s) => {
      if (riskTier === "LOW") return s.expectedStatus === "AUTHENTIC" || s.riskLevel === "LOW";
      if (riskTier === "HIGH") return s.expectedStatus === "SUSPECTED_COUNTERFEIT" || s.riskLevel === "HIGH";
      return s.expectedStatus === "SUSPICIOUS" || s.riskLevel === "MEDIUM";
    });
    if (target) {
      handleSelectSample(target);
    }
  };

  const handleSelectFromDb = (med: MedicineRecord, useCounterfeitBatch?: boolean) => {
    // If testing counterfeit scenario, pick from knownCounterfeitBatches; otherwise pick from validBatches
    const batch = useCounterfeitBatch
      ? med.knownCounterfeitBatches?.[0] || "FAKE-LOT-999"
      : med.validBatches?.[0] || "LOT-2025-A1";

    const qrPayload = useCounterfeitBatch
      ? med.sampleQrPayload
      : `01${med.gtin.padStart(14, "0")}1727123110${batch}21SN${Math.floor(100000 + Math.random() * 900000)}`;

    handleVerify({
      qrCodeText: qrPayload,
      manualData: {
        medicineName: med.medicineName,
        manufacturer: med.manufacturer,
        gtin: med.gtin,
        batchNumber: batch,
        expiryDate: "2027-12-31",
      },
    });
  };

  const handleResetVerification = () => {
    setCurrentResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Clean White Human-Made App Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setShowHistory(true)}
        onOpenGuide={() => setShowGuide(true)}
        onSelectTab={(tab) => {
          setActiveTab(tab as any);
          setCurrentResult(null);
        }}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block text-sm font-semibold text-rose-900 mb-0.5">
                Verification Issue
              </strong>
              <p className="leading-relaxed text-rose-700">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 text-xs font-semibold px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic View: If result is active, show the Forensic Verification Certificate Report */}
        {currentResult ? (
          <VerificationReport
            result={currentResult}
            onReset={handleResetVerification}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-start">
            {/* Context Subheading */}
            {activeTab !== "database" && activeTab !== "methodology" && (
              <div className="text-center mb-6 max-w-xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono mb-2.5 border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>GS1 2D DataMatrix & Forensic Packaging Inspector</span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mb-2">
                  Pharmaceutical Authenticity Screening
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Scan pharmaceutical barcodes, examine package typography & tamper seals, or enter batch codes for instant verification against international safety registries.
                </p>
              </div>
            )}

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

            {activeTab === "methodology" && (
              <MethodologyShowcase
                onSelectMvpTier={handleSelectMvpTier}
              />
            )}

            {activeTab === "manual" && (
              <ManualLookup
                onVerify={(manualData) => handleVerify({ manualData })}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === "database" && (
              <div className="w-full">
                <MedicineDatabaseViewer
                  onSelectSample={handleSelectFromDb}
                />
              </div>
            )}

            {activeTab === "samples" && (
              <SampleMedicines
                samples={samples}
                onSelectSample={handleSelectSample}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        )}
      </main>

      {/* Clean White Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            PharmaShield • Compliant with WHO Guidelines & GS1 Global Healthcare Standards
          </span>
          <div className="flex items-center gap-3 text-slate-600">
            <button
              onClick={() => setShowGuide(true)}
              className="hover:text-sky-600 transition-colors font-medium"
            >
              Forensic Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHistory(true)}
              className="hover:text-sky-600 transition-colors font-medium"
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
