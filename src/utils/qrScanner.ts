import jsQR from "jsqr";

/**
 * Scan an HTMLImageElement or Canvas for QR code using jsQR
 */
export function scanImageForQr(image: HTMLImageElement): {
  data: string;
  location?: any;
} | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  // Draw image to canvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  if (code) {
    return { data: code.data, location: code.location };
  }

  // Second pass with inverted colors for dark packaging
  const codeInverted = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "onlyInvert",
  });

  if (codeInverted) {
    return { data: codeInverted.data, location: codeInverted.location };
  }

  return null;
}

/**
 * Scan raw video frame from HTMLVideoElement
 */
export function scanVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): { data: string; location?: any } | null {
  if (video.readyState !== video.HAVE_ENOUGH_DATA) return null;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  if (code) {
    return { data: code.data, location: code.location };
  }

  return null;
}

/**
 * Capture current video frame as base64 JPEG
 */
export function captureFrameAsBase64(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  quality = 0.85
): string {
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Generates a clean DataMatrix-style SVG barcode representation
 * for sample display and visual scanning
 */
export function createSampleQrSvg(text: string, size = 180): string {
  // Simple deterministic pseudo-random matrix based on payload hash
  // to render realistic 2D DataMatrix visual patterns for demo
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  const cells = 14;
  const cellSize = size / cells;
  let rects = "";

  // Draw standard L-finder pattern (solid bottom and left borders)
  for (let c = 0; c < cells; c++) {
    rects += `<rect x="${c * cellSize}" y="${(cells - 1) * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
    rects += `<rect x="0" y="${c * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
    // Timing pattern (alternating top and right borders)
    if (c % 2 === 0) {
      rects += `<rect x="${c * cellSize}" y="0" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      rects += `<rect x="${(cells - 1) * cellSize}" y="${c * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
    }
  }

  // Internal data cells
  let currentSeed = Math.abs(hash);
  for (let r = 1; r < cells - 1; r++) {
    for (let c = 1; c < cells - 1; c++) {
      currentSeed = (currentSeed * 16807) % 2147483647;
      if (currentSeed % 2 === 0) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#ffffff" rx="8" />
    <g transform="translate(10, 10) scale(${ (size - 20) / size })">
      ${rects}
    </g>
  </svg>`;
}
