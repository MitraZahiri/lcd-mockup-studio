/**
 * 1-Bit High-Fidelity Dithering & Retro Pixel Art Engine
 * Turns any photo, portrait, logo, or artwork into crisp, high-detail
 * 1-bit monochrome graphics for microcontrollers, OLEDs, and e-Paper displays.
 *
 * Supported Algorithms:
 * 1. Floyd-Steinberg: Smooth, photorealistic error-diffusion.
 * 2. Atkinson: Classic Apple Macintosh (1984) & GameBoy Camera high-contrast dither.
 * 3. Bayer 4x4 & 8x8: Ordered matrix dither (vintage CRT / newspaper halftone).
 * 4. Stencil / Ink Stamp: High-contrast adaptive thresholding.
 */

// Bayer 4x4 matrix
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

// Bayer 8x8 matrix
const BAYER_8X8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

/**
 * Applies contrast and brightness adjustments to an 8-bit value
 * @param {number} val (0-255)
 * @param {number} contrast (-100 to 100)
 * @param {number} brightness (-100 to 100)
 * @returns {number} (0-255)
 */
export function adjustPixel(val, contrast = 0, brightness = 0) {
  // Brightness: -100..100 maps to -128..128
  let v = val + brightness * 1.28;

  // Contrast: factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  if (contrast !== 0) {
    const clampedContrast = Math.max(-100, Math.min(100, contrast));
    const factor = (259 * (clampedContrast + 255)) / (255 * (259 - clampedContrast));
    v = factor * (v - 128) + 128;
  }

  return Math.max(0, Math.min(255, v));
}

/**
 * Converts ImageData to a floating-point grayscale buffer with tone adjustment
 * @param {ImageData} imageData
 * @param {object} options
 * @returns {Float32Array}
 */
export function createAdjustedGrayscale(imageData, { contrast = 0, brightness = 0 } = {}) {
  const { width, height, data } = imageData;
  const buffer = new Float32Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3] / 255;

    // Perceptual luminance (Rec. 601)
    let lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // Blend with white if transparent
    lum = lum * a + 255 * (1 - a);

    buffer[i] = adjustPixel(lum, contrast, brightness);
  }

  return buffer;
}

/**
 * Floyd-Steinberg error-diffusion dithering
 * Distributes error to 4 neighbors: (x+1, y)=7/16, (x-1, y+1)=3/16, (x, y+1)=5/16, (x+1, y+1)=1/16
 */
export function ditherFloydSteinberg(grayscale, width, height, { threshold = 128, invert = false } = {}) {
  const f32 = new Float32Array(grayscale);
  const binary = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldVal = f32[idx];
      const isWhite = oldVal >= threshold;
      const newVal = isWhite ? 255 : 0;
      const err = oldVal - newVal;

      binary[idx] = invert ? (isWhite ? 0 : 1) : (isWhite ? 1 : 0);

      // Distribute error
      if (x + 1 < width) {
        f32[idx + 1] += err * (7 / 16);
      }
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          f32[idx + width - 1] += err * (3 / 16);
        }
        f32[idx + width] += err * (5 / 16);
        if (x + 1 < width) {
          f32[idx + width + 1] += err * (1 / 16);
        }
      }
    }
  }

  return binary;
}

/**
 * Atkinson dithering (Original Apple Macintosh 1984 & GameBoy Camera)
 * Distributes 3/4 of error across 6 neighbors: 1/8 each, preserving high contrast & clean whites.
 */
export function ditherAtkinson(grayscale, width, height, { threshold = 128, invert = false } = {}) {
  const f32 = new Float32Array(grayscale);
  const binary = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldVal = f32[idx];
      const isWhite = oldVal >= threshold;
      const newVal = isWhite ? 255 : 0;
      const err = oldVal - newVal;
      const e8 = err / 8; // 12.5% to each of 6 neighbors (total 75% error diffused)

      binary[idx] = invert ? (isWhite ? 0 : 1) : (isWhite ? 1 : 0);

      if (x + 1 < width) f32[idx + 1] += e8;
      if (x + 2 < width) f32[idx + 2] += e8;
      if (y + 1 < height) {
        if (x - 1 >= 0) f32[idx + width - 1] += e8;
        f32[idx + width] += e8;
        if (x + 1 < width) f32[idx + width + 1] += e8;
      }
      if (y + 2 < height) {
        f32[idx + width * 2] += e8;
      }
    }
  }

  return binary;
}

/**
 * Bayer ordered matrix dithering (4x4 or 8x8)
 * Produces authentic retro CRT / newspaper halftone cross-hatch shading.
 */
export function ditherBayer(grayscale, width, height, { threshold = 128, matrixSize = 4, invert = false } = {}) {
  const binary = new Uint8Array(width * height);
  const matrix = matrixSize === 8 ? BAYER_8X8 : BAYER_4X4;
  const n = matrixSize;
  const nSq = n * n;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const lum = grayscale[idx];
      // Bayer threshold modulation: maps (0..nSq-1) to (-64..64)
      const mVal = matrix[y % n][x % n];
      const bayerOffset = ((mVal + 0.5) / nSq - 0.5) * 128;
      const isWhite = (lum + bayerOffset) >= threshold;

      binary[idx] = invert ? (isWhite ? 0 : 1) : (isWhite ? 1 : 0);
    }
  }

  return binary;
}

/**
 * High-contrast ink stamp / stencil threshold
 */
export function ditherThreshold(grayscale, width, height, { threshold = 128, invert = false } = {}) {
  const binary = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const isWhite = grayscale[i] >= threshold;
    binary[i] = invert ? (isWhite ? 0 : 1) : (isWhite ? 1 : 0);
  }

  return binary;
}

/**
 * Generates an RGBA ImageData or Canvas from 1-bit binary output
 */
export function binaryToImageData(binary, width, height, { fgColor = '#ffffff', bgColor = '#000000' } = {}) {
  // Parse hex colors
  const parseHex = (hex) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const fg = parseHex(fgColor);
  const bg = parseHex(bgColor);

  const imgData = new ImageData(width, height);
  const data = imgData.data;

  for (let i = 0; i < binary.length; i++) {
    const isPixelActive = binary[i] === 1;
    const color = isPixelActive ? fg : bg;
    const idx = i * 4;
    data[idx] = color[0];
    data[idx + 1] = color[1];
    data[idx + 2] = color[2];
    data[idx + 3] = 255;
  }

  return imgData;
}

/**
 * Main entrance: processes an ImageData buffer using the selected dithering method
 */
export function processDithering(imageData, options = {}) {
  const {
    algorithm = 'atkinson',
    contrast = 20,
    brightness = 0,
    threshold = 128,
    invert = false,
    fgColor = '#a8d9a8',
    bgColor = '#18211b'
  } = options;

  const { width, height } = imageData;
  const grayscale = createAdjustedGrayscale(imageData, { contrast, brightness });

  let binary;
  if (algorithm === 'floyd-steinberg') {
    binary = ditherFloydSteinberg(grayscale, width, height, { threshold, invert });
  } else if (algorithm === 'bayer4') {
    binary = ditherBayer(grayscale, width, height, { threshold, matrixSize: 4, invert });
  } else if (algorithm === 'bayer8') {
    binary = ditherBayer(grayscale, width, height, { threshold, matrixSize: 8, invert });
  } else if (algorithm === 'threshold') {
    binary = ditherThreshold(grayscale, width, height, { threshold, invert });
  } else {
    // Default: Atkinson (superb for portraits & faces)
    binary = ditherAtkinson(grayscale, width, height, { threshold, invert });
  }

  return {
    width,
    height,
    binary,
    createImageData: (fg = fgColor, bg = bgColor) => binaryToImageData(binary, width, height, { fgColor: fg, bgColor: bg })
  };
}
