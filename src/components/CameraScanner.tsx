import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  ScanLine,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { scanVideoFrame, captureFrameAsBase64 } from "../utils/qrScanner";

interface CameraScannerProps {
  onScanComplete: (payload: { qrCodeText?: string; imageBase64?: string }) => void;
  isAnalyzing: boolean;
  onSwitchToUpload: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanComplete,
  isAnalyzing,
  onSwitchToUpload,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedQr, setDetectedQr] = useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  const animationFrameId = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setDetectedQr(null);
    setCapturedSnapshot(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);

        // Check torch support
        const track = stream.getVideoTracks()[0];
        const capabilities = (track.getCapabilities?.() || {}) as any;
        if (capabilities.torch) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraActive(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError(
          "Camera permission was denied. Please allow camera access in your browser address bar to scan medicine packages."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError(
          "No camera hardware was detected on this device. You can upload a photo of the medicine instead."
        );
      } else {
        setCameraError(
          "Unable to initialize live camera. Please use file upload or choose a demo medicine to test."
        );
      }
    }
  }, [cameraFacing, stopCamera]);

  // Scan loop
  useEffect(() => {
    if (!cameraActive || isAnalyzing || detectedQr) return;

    let isScanning = true;

    const scanFrame = () => {
      if (!isScanning) return;

      if (videoRef.current && canvasRef.current) {
        const result = scanVideoFrame(videoRef.current, canvasRef.current);
        if (result && result.data) {
          // Play haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }

          setDetectedQr(result.data);

          // Also capture snapshot for AI packaging inspection
          const snapshot = captureFrameAsBase64(videoRef.current, canvasRef.current, 0.85);
          setCapturedSnapshot(snapshot);

          // Trigger verification
          onScanComplete({
            qrCodeText: result.data,
            imageBase64: snapshot,
          });
          return;
        }
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      isScanning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [cameraActive, isAnalyzing, detectedQr, onScanComplete]);

  // Handle start on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      const next = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: next } as any],
      });
      setTorchOn(next);
    } catch (e) {
      console.warn("Torch toggle error:", e);
    }
  };

  // Flip camera
  const flipCamera = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Manual snapshot capture for packaging/hologram inspection
  const handleSnapPackaging = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const snapshot = captureFrameAsBase64(videoRef.current, canvasRef.current, 0.9);
    setCapturedSnapshot(snapshot);

    // If QR was already found, pass both; otherwise pass image for visual AI analysis
    onScanComplete({
      qrCodeText: detectedQr || undefined,
      imageBase64: snapshot,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Viewfinder Container */}
      <div className="relative w-full aspect-[4/5] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl flex items-center justify-center">
        {/* Hidden processing canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${
            cameraFacing === "user" ? "scale-x-[-1]" : ""
          } ${cameraActive ? "block" : "hidden"}`}
        />

        {/* Camera Error / Permission Fallback */}
        {cameraError && (
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-slate-950/95 z-20">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Camera Unavailable</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-xs">
              {cameraError}
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                onClick={startCamera}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Camera Access
              </button>
              <button
                onClick={onSwitchToUpload}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-sky-400" />
                Upload Medicine Photo Instead
              </button>
            </div>
          </div>
        )}

        {/* Scanning Overlay & Reticle */}
        {cameraActive && !cameraError && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
            {/* Top status banner */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full px-3 py-1 text-slate-300 text-xs shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Scanner</span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      torchOn
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30"
                        : "bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                    title="Toggle Flashlight"
                  >
                    {torchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  onClick={flipCamera}
                  className="w-9 h-9 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800 flex items-center justify-center backdrop-blur-md transition-all"
                  title="Flip Camera"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Central Targeting Reticle */}
            <div className="self-center relative w-60 h-60 flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-sky-400 rounded-tl-xl shadow-[0_0_12px_rgba(56,189,248,0.5)]"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-sky-400 rounded-tr-xl shadow-[0_0_12px_rgba(56,189,248,0.5)]"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-sky-400 rounded-bl-xl shadow-[0_0_12px_rgba(56,189,248,0.5)]"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-sky-400 rounded-br-xl shadow-[0_0_12px_rgba(56,189,248,0.5)]"></div>

              {/* Laser sweep animation */}
              <div className="absolute inset-x-2 top-2 bottom-2 overflow-hidden pointer-events-none">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-[bounce_2.5s_infinite_ease-in-out]"></div>
              </div>

              {/* Aiming crosshair */}
              <div className="w-3 h-3 border border-sky-400/40 rounded-full"></div>
            </div>

            {/* Bottom instruction hint */}
            <div className="text-center pointer-events-auto">
              <div className="inline-block bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-medium">
                Align QR Code, DataMatrix, or Hologram
              </div>
            </div>
          </div>
        )}

        {/* Detection feedback overlay */}
        {detectedQr && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-white font-bold text-base mb-1">QR Code Decoded</h4>
            <p className="text-emerald-300 text-xs font-mono break-all max-w-xs mb-3 line-clamp-2">
              {detectedQr}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Running Gemini AI forensic verification...</span>
            </div>
          </div>
        )}

        {/* Loading Spinner during analysis */}
        {isAnalyzing && !detectedQr && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin mb-4"></div>
            <h4 className="text-white font-semibold text-sm mb-1">Inspecting Packaging</h4>
            <p className="text-slate-400 text-xs max-w-xs">
              Cross-referencing GS1 registry & inspecting optical anti-counterfeit features...
            </p>
          </div>
        )}
      </div>

      {/* Snapshot / Packaging AI trigger button */}
      <div className="w-full mt-4 flex items-center justify-between gap-3">
        <button
          id="btn-snap-packaging"
          onClick={handleSnapPackaging}
          disabled={!cameraActive || isAnalyzing}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Snap for Packaging AI Inspection</span>
        </button>

        <button
          id="btn-switch-to-upload"
          onClick={onSwitchToUpload}
          className="py-3 px-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-colors"
          title="Upload image"
        >
          <ImageIcon className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-3">
        Tip: Hold the smartphone 10–15 cm from the medicine box or foil strip under good light.
      </p>
    </div>
  );
};
