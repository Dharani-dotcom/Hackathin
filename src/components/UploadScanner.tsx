import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Camera,
  Sparkles,
  RefreshCw,
  QrCode,
  X
} from "lucide-react";
import { scanImageForQr } from "../utils/qrScanner";

interface UploadScannerProps {
  onVerify: (payload: { qrCodeText?: string; imageBase64?: string }) => void;
  isAnalyzing: boolean;
}

export const UploadScanner: React.FC<UploadScannerProps> = ({
  onVerify,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [detectedQr, setDetectedQr] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageBase64(base64);
      setPreviewUrl(base64);
      setDetectedQr(null);
      setIsScanningImage(true);

      // Create an image object to run jsQR detection
      const img = new Image();
      img.onload = () => {
        const qrResult = scanImageForQr(img);
        if (qrResult && qrResult.data) {
          setDetectedQr(qrResult.data);
        }
        setIsScanningImage(false);
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setImageBase64(null);
    setDetectedQr(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleRunAnalysis = () => {
    if (!imageBase64 && !detectedQr) return;
    onVerify({
      qrCodeText: detectedQr || undefined,
      imageBase64: imageBase64 || undefined,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
            dragActive
              ? "border-sky-400 bg-sky-500/10 scale-[1.01]"
              : "border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900/90"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 shadow-lg shadow-sky-500/10">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-white font-semibold text-sm mb-1">
            Upload Medicine Image or QR Code
          </h3>
          <p className="text-slate-400 text-xs max-w-xs mb-5">
            Drag & drop a photo of the medicine carton, blister foil, or QR code here
          </p>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              Browse Files
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
          {/* Preview image */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Medicine preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 backdrop-blur-sm transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* QR Detection Status Banner */}
          <div className="mb-4">
            {isScanningImage ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
                <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
                <span>Scanning image for QR / DataMatrix code...</span>
              </div>
            ) : detectedQr ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>GS1 Barcode / QR Detected!</span>
                </div>
                <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-950/60 p-2 rounded-lg border border-slate-800 mt-1">
                  {detectedQr}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Multimodal Visual Inspection Ready</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  No standard QR found in photo. Gemini AI will perform visual forensic inspection of the carton print, holograms, typography, and tamper seals.
                </p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isAnalyzing}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              Choose Different
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || isScanningImage}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Verify Authenticity with AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
