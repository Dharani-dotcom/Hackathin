import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileCheck2,
  Camera,
  Sparkles,
  RefreshCw,
  X,
  Image as ImageIcon
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
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageBase64(base64);
      setPreviewUrl(base64);
      setDetectedQr(null);
      setIsScanningImage(true);

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
          className={`relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center bg-white ${
            dragActive
              ? "border-sky-500 bg-sky-50/50"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/70"
          } shadow-sm`}
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-3 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-slate-900 font-semibold text-sm mb-1">
            Upload Packaging Photo or Barcode
          </h3>
          <p className="text-slate-500 text-xs max-w-xs mb-4">
            Drag & drop packaging photo or choose from smartphone photo library
          </p>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              Browse Photo
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              Take Snapshot
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Medicine packaging preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center border border-slate-200 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* QR Detection Status */}
          <div className="mb-3">
            {isScanningImage ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <RefreshCw className="w-4 h-4 text-sky-600 animate-spin" />
                <span>Decoding 2D GS1 DataMatrix / QR from photo...</span>
              </div>
            ) : detectedQr ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-800">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>GS1 Barcode Detected</span>
                </div>
                <p className="font-mono text-[11px] text-slate-800 break-all bg-white p-2 rounded border border-emerald-100 mt-1">
                  {detectedQr}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-950">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-sky-800">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Packaging Forensic Analysis Ready</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  No standard QR found. Image will be inspected for font consistency, manufacturer logos, and hologram security features.
                </p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isAnalyzing}
              className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              Change Photo
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || isScanningImage}
              className="flex-1 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Authenticity</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
