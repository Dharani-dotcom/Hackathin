import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ScanLine
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
          "Camera permission was denied. Please allow camera access in your browser to scan medicine packages."
        );
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError(
          "No camera hardware detected on this device. You can upload a photo of the medicine packaging instead."
        );
      } else {
        setCameraError(
          "Unable to start camera stream. Please use image upload or select a test scenario."
        );
      }
    }
  }, [cameraFacing, stopCamera]);

  useEffect(() => {
    if (!cameraActive || isAnalyzing || detectedQr) return;

    let isScanning = true;

    const scanFrame = () => {
      if (!isScanning) return;

      if (videoRef.current && canvasRef.current) {
        const result = scanVideoFrame(videoRef.current, canvasRef.current);
        if (result && result.data) {
          if (navigator.vibrate) {
            navigator.vibrate([80, 40, 80]);
          }

          setDetectedQr(result.data);
          const snapshot = captureFrameAsBase64(videoRef.current, canvasRef.current, 0.85);

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

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

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

  const flipCamera = () => {
    setCameraFacing((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleSnapPackaging = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const snapshot = captureFrameAsBase64(videoRef.current, canvasRef.current, 0.9);
    onScanComplete({
      qrCodeText: detectedQr || undefined,
      imageBase64: snapshot,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Scanner Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-sky-600" />
              Live Barcode & Packaging Scanner
            </h3>
            <p className="text-xs text-slate-500">
              GS1 DataMatrix & 2D QR Code Detection
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  torchOn ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="Toggle Torch"
              >
                {torchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={flipCamera}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="Switch Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Container */}
        <div className="relative w-full aspect-[4/4.5] bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          <canvas ref={canvasRef} className="hidden" />

          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${
              cameraFacing === "user" ? "scale-x-[-1]" : ""
            } ${cameraActive ? "block" : "hidden"}`}
          />

          {/* Error Message */}
          {cameraError && (
            <div className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center bg-slate-900/95 z-20">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">Camera Notice</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4 max-w-xs">
                {cameraError}
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button
                  onClick={startCamera}
                  className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Camera
                </button>
                <button
                  onClick={onSwitchToUpload}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  Upload Photo Instead
                </button>
              </div>
            </div>
          )}

          {/* Reticle */}
          {cameraActive && !cameraError && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
              <div className="self-center relative w-56 h-56 flex items-center justify-center mt-6">
                <div className="absolute top-0 left-0 w-7 h-7 border-t-3 border-l-3 border-sky-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-7 h-7 border-t-3 border-r-3 border-sky-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-3 border-l-3 border-sky-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-3 border-r-3 border-sky-400 rounded-br-lg"></div>

                <div className="w-full h-0.5 bg-sky-400/80 shadow-xs animate-[bounce_2.5s_infinite_ease-in-out]"></div>
              </div>

              <div className="text-center pb-2">
                <span className="inline-block bg-slate-950/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-slate-200 font-medium">
                  Center medicine 2D barcode or packaging
                </span>
              </div>
            </div>
          )}

          {/* Loading */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-5 text-center">
              <div className="w-10 h-10 rounded-full border-3 border-sky-500/30 border-t-sky-400 animate-spin mb-3"></div>
              <h4 className="text-white font-semibold text-xs mb-1">Authenticating Medication</h4>
              <p className="text-slate-400 text-[11px] max-w-xs">
                Verifying GS1 barcode & forensic parameters against Firestore registry...
              </p>
            </div>
          )}

          {/* Decoded */}
          {detectedQr && (
            <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-5 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
              <h4 className="text-white font-bold text-sm mb-1">GS1 Code Decoded</h4>
              <p className="text-emerald-300 text-xs font-mono break-all max-w-xs mb-2">
                {detectedQr}
              </p>
              <span className="text-[11px] text-slate-300">Processing verification analysis...</span>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-3 flex items-center gap-2">
          <button
            id="btn-snap-packaging"
            onClick={handleSnapPackaging}
            disabled={!cameraActive || isAnalyzing}
            className="flex-1 py-2.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Packaging Photo</span>
          </button>
          <button
            onClick={onSwitchToUpload}
            className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1 transition-colors"
            title="Upload from gallery"
          >
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center mt-3">
        Hold device 10–15 cm from medication carton or blister foil.
      </p>
    </div>
  );
};
