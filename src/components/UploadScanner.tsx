import React, { useState, useRef } from "react";
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
          className={`relative w-full aspect-[4/3] rounded border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center bg-white ${
            dragActive
              ? "border-slate-900 bg-slate-50"
              : "border-slate-300 hover:border-slate-500 hover:bg-slate-50/50"
          } shadow-xs`}
        >
          <div className="w-10 h-10 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-mono text-xs font-bold mb-3">
            IMG
          </div>

          <h3 className="font-display text-slate-950 font-bold text-sm mb-1">
            Upload Packaging Image or Barcode
          </h3>
          <p className="text-slate-500 text-xs max-w-xs mb-4 leading-relaxed font-sans">
            Drag and drop high-resolution box, blister pack, or serial label image
          </p>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              Select Image File
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors"
            >
              Take Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-slate-100 border border-slate-200 mb-3 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Medicine packaging preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 px-2 py-1 rounded bg-white/95 hover:bg-white text-slate-700 text-xs font-medium shadow-xs border border-slate-300 transition-colors"
              title="Remove image"
            >
              Remove
            </button>
          </div>

          {/* QR Detection Status */}
          <div className="mb-3">
            {isScanningImage ? (
              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
                Decoding 2D GS1 DataMatrix from image...
              </div>
            ) : detectedQr ? (
              <div className="p-3 rounded bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950">
                <div className="font-bold mb-1 text-emerald-900 font-mono text-[11px]">
                  GS1 BARCODE DECODED
                </div>
                <p className="font-mono text-[11px] text-slate-900 break-all bg-white p-2 rounded border border-emerald-200 mt-1">
                  {detectedQr}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800">
                <div className="font-bold mb-1 text-slate-900 font-mono text-[11px]">
                  FORENSIC PACKAGING INSPECTION READY
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Image will be screened for typography deviations, manufacturer logo discrepancies, and security seal anomalies.
                </p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isAnalyzing}
              className="py-2.5 px-3.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              Change Photo
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="flex-1 py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs shadow-xs transition-colors"
            >
              {isAnalyzing ? "Screening Medicine..." : "Run Verification"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
