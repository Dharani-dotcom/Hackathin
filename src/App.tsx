import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { UploadScanner } from "./components/UploadScanner";
import { SampleMedicines } from "./components/SampleMedicines";
import { MethodologyShowcase } from "./components/MethodologyShowcase";
import { ManualLookup } from "./components/ManualLookup";
import { MedicineDatabaseViewer } from "./components/MedicineDatabaseViewer";
import { VerificationReport } from "./components/VerificationReport";
import { EducationalGuide } from "./components/EducationalGuide";
import { ReportModal } from "./components/ReportModal";
import { VerificationResult, SampleMedicine, ManualEntryData } from "./types";
import { MedicineRecord, logVerificationToFirestore } from "./lib/medicineDb";

export default function App() {
  const [activeTab, setActiveTab] = useState<"upload" | "methodology" | "samples" | "database" | "manual">("upload");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [samples, setSamples] = useState<SampleMedicine[]>([]);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        // Persist verification record to Firestore
        logVerificationToFirestore(data.result).catch((err) => {
          console.warn("Firestore background logging notice:", err);
        });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* App Header */}
      <Header
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
          <div className="mb-6 p-4 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3 shadow-xs">
            <span className="font-mono font-bold text-rose-700 uppercase">[ALERT]</span>
            <div className="flex-1">
              <strong className="block text-sm font-semibold text-rose-900 mb-0.5 font-display">
                Verification Issue
              </strong>
              <p className="leading-relaxed text-rose-800">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-800 hover:text-rose-950 text-xs font-semibold px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 transition-colors"
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
                <div className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono mb-2.5 border border-slate-200 uppercase">
                  GS1 2D DataMatrix & Forensic Packaging Inspector
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mb-2">
                  Pharmaceutical Authenticity Screening
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-sans">
                  Upload packaging images for forensic inspection, scan DataMatrix barcodes, or verify batch codes against international regulatory databases.
                </p>
              </div>
            )}

            {/* Tab Views */}
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

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Compliant with WHO Guidelines & GS1 Global Healthcare Serialization Standards
          </span>
          <div className="flex items-center gap-3 text-slate-600">
            <button
              onClick={() => setShowGuide(true)}
              className="hover:text-slate-950 transition-colors font-medium"
            >
              Forensic Guidelines
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showGuide && <EducationalGuide onClose={() => setShowGuide(false)} />}

      {showReportModal && currentResult && (
        <ReportModal
          result={currentResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
