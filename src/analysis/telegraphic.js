/**
 * Telegraphic / Wirephoto (Belinograph / Telephotography) Scanline Engraving Engine
 *
 * Emulates the iconic mid-century wirephoto and facsimile telegraph receivers:
 * - A scanning beam sweeps horizontally line-by-line across the image.
 * - Optical sensor / telegraph current modulates line thickness and continuity:
 *   - Dark regions (hair, pupils, deep shadows, text, clothing) create bold,
 *     thick, heavy ink lines that merge into solid silhouettes.
 *   - Midtone regions (skin contours, cheek shadows, nose bridges) form crisp,
 *     parallel engraved scanlines.
 *   - Highlight regions (light reflections, forehead, white background) thin out
 *     into delicate hairlines or break cleanly into airy gaps.
 * - Supports continuous thickness modulation, telegraphic Morse/pulse dashing,
 *   diagonal engraving (45°), and dual-angle crosshatching.
 * - Generates both 1-bit binary raster buffers (for microcontrollers & OLEDs)
 *   and editable vector line elements (type: 'line') for the canvas editor & SVG.
 */

import { adjustPixel, createAdjustedGrayscale } from './dithering.js'

/**
 * Samples average darkness in a small rectangular window around (x, y)
 * @param {Float32Array} grayscale - 0 (black) to 255 (white)
 * @param {number} width
 * @param {number} height
 * @param {number} cx
 * @param {number} cy
 * @param {number} radiusX
 * @param {number} radiusY
 * @returns {number} Normalized darkness 0.0 (pure white) to 1.0 (pure black)
 */
export function sampleLocalDarkness(grayscale, width, height, cx, cy, radiusX = 1, radiusY = 1) {
  let sum = 0
  let count = 0

  const x0 = Math.max(0, Math.floor(cx - radiusX))
  const x1 = Math.min(width - 1, Math.ceil(cx + radiusX))
  const y0 = Math.max(0, Math.floor(cy - radiusY))
  const y1 = Math.min(height - 1, Math.ceil(cy + radiusY))

  for (let py = y0; py <= y1; py++) {
    const rowOffset = py * width
    for (let px = x0; px <= x1; px++) {
      sum += grayscale[rowOffset + px]
      count++
    }
  }

  if (count === 0) return 0
  const avgLum = sum / count
  // Invert: 0 (black) -> darkness 1.0; 255 (white) -> darkness 0.0
  return Math.max(0, Math.min(1, 1 - avgLum / 255))
}

/**
 * Generates a 1-bit binary buffer using modulated telegraphic scanlines
 *
 * @param {Float32Array|ImageData} source - Grayscale float buffer or ImageData
 * @param {number} width
 * @param {number} height
 * @param {object} options
 * @returns {Uint8Array} Binary array (1 = ink/foreground, 0 = background)
 */
export function generateTelegraphicBinary(source, width, height, options = {}) {
  const {
    lineSpacing = 4,        // Distance between scanlines in pixels (2 - 8)
    minThickness = 0.4,     // Minimum stroke width in px (0 allows complete breaks in highlights)
    maxThickness = 4.2,     // Maximum stroke width in px (values >= lineSpacing merge dark areas)
    gamma = 1.2,            // Contrast exponent for tone curve
    angle = 'horizontal',   // 'horizontal' (0°), 'diagonal' (45°), 'vertical' (90°), or 'crosshatch'
    modulation = 'continuous', // 'continuous' or 'pulse' (Morse-like wirephoto pulses)
    pulseFrequency = 0.35,  // Frequency of telegraphic pulses in pulse mode
    contrast = 20,
    brightness = 0,
    invert = false
  } = options

  // Prepare grayscale buffer
  let grayscale
  if (source instanceof Float32Array) {
    grayscale = source
  } else if (source?.data) {
    grayscale = createAdjustedGrayscale(source, { contrast, brightness })
  } else {
    throw new Error('Invalid source for telegraphic scan: expected Float32Array or ImageData.')
  }

  const binary = new Uint8Array(width * height)
  const spacing = Math.max(1, Number(lineSpacing) || 4)
  const effectiveMaxT = Math.max(0.5, Number(maxThickness) || spacing)
  const effectiveMinT = Math.max(0, Number(minThickness) || 0)

  // Precompute row/line centers for horizontal scanning
  const sampleRadiusY = Math.max(1, Math.floor(spacing / 2))

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let isInk = false

      if (angle === 'diagonal') {
        // 45 degree engraving scanline: coordinate u along diagonal
        const u = (x + y) / Math.SQRT2
        const k = Math.round(u / spacing)
        const dist = Math.abs(u - k * spacing)

        // Sample darkness at (x, y)
        let darkness = sampleLocalDarkness(grayscale, width, height, x, y, 1, 1)
        if (invert) darkness = 1 - darkness
        darkness = Math.pow(darkness, gamma)

        const thickness = effectiveMinT + (effectiveMaxT - effectiveMinT) * darkness
        if (thickness >= 0.3 && dist <= thickness / 2) {
          isInk = true
        }
      } else if (angle === 'crosshatch') {
        // Dual-pass wirephoto: horizontal + vertical crosshatch
        const ky = Math.round((y - spacing / 2) / spacing)
        const cy = ky * spacing + spacing / 2
        const distY = Math.abs(y - cy)

        const kx = Math.round((x - spacing / 2) / spacing)
        const cx = kx * spacing + spacing / 2
        const distX = Math.abs(x - cx)

        let darkness = sampleLocalDarkness(grayscale, width, height, x, y, 1, 1)
        if (invert) darkness = 1 - darkness
        darkness = Math.pow(darkness, gamma)

        const thickness = effectiveMinT + (effectiveMaxT - effectiveMinT) * darkness
        if (thickness >= 0.3 && (distY <= thickness / 2 || (darkness > 0.45 && distX <= thickness / 2))) {
          isInk = true
        }
      } else if (angle === 'vertical') {
        // Vertical scanlines
        const kx = Math.round((x - spacing / 2) / spacing)
        const cx = kx * spacing + spacing / 2
        const dist = Math.abs(x - cx)

        let darkness = sampleLocalDarkness(grayscale, width, height, cx, y, 1, sampleRadiusY)
        if (invert) darkness = 1 - darkness
        darkness = Math.pow(darkness, gamma)

        const thickness = effectiveMinT + (effectiveMaxT - effectiveMinT) * darkness
        if (thickness >= 0.3 && dist <= thickness / 2) {
          isInk = true
        }
      } else {
        // Classic horizontal wirephoto scanlines (0°)
        const ky = Math.round((y - spacing / 2) / spacing)
        const cy = ky * spacing + spacing / 2
        const dist = Math.abs(y - cy)

        // Sample darkness along the scanline row center
        let darkness = sampleLocalDarkness(grayscale, width, height, x, cy, 1, sampleRadiusY)
        if (invert) darkness = 1 - darkness
        darkness = Math.pow(darkness, gamma)

        let thickness = effectiveMinT + (effectiveMaxT - effectiveMinT) * darkness

        // Optional telegraphic pulse / Morse dash modulation
        if (modulation === 'pulse' && darkness < 0.85) {
          const pulse = Math.sin(x * pulseFrequency)
          // Threshold pulse based on darkness: lighter areas need higher pulse to trigger
          const pulseGate = 1 - darkness * 1.5
          if (pulse < pulseGate) {
            thickness = 0 // Break line
          }
        }

        if (thickness >= 0.3 && dist <= thickness / 2) {
          isInk = true
        }
      }

      const idx = y * width + x
      binary[idx] = isInk ? 1 : 0
    }
  }

  return binary
}

/**
 * Extracts clean vector line elements from image data for the canvas editor
 *
 * Generates an array of `{ id, type: 'line', name, x, y, width, height, strokeWidth, color }`
 * elements that satisfy `validateProject`.
 *
 * @param {Float32Array|ImageData} source
 * @param {number} width
 * @param {number} height
 * @param {object} options
 * @returns {Array<object>} Vector line elements
 */
export function generateTelegraphicVectorLines(source, width, height, options = {}) {
  const {
    lineSpacing = 4,
    minThickness = 1,
    maxThickness = 5,
    gamma = 1.2,
    contrast = 20,
    brightness = 0,
    invert = false,
    color = '#a8d9a8',
    minSegmentLength = 2
  } = options

  let grayscale
  if (source instanceof Float32Array) {
    grayscale = source
  } else if (source?.data) {
    grayscale = createAdjustedGrayscale(source, { contrast, brightness })
  } else {
    throw new Error('Invalid source for vector lines: expected Float32Array or ImageData.')
  }

  const spacing = Math.max(2, Number(lineSpacing) || 4)
  const effectiveMaxT = Math.max(1, Number(maxThickness) || spacing)
  const effectiveMinT = Math.max(0, Number(minThickness) || 0)
  const sampleRadiusY = Math.max(1, Math.floor(spacing / 2))

  const elements = []
  let lineCount = 0

  // Scan horizontal rows
  for (let cy = Math.floor(spacing / 2); cy < height; cy += spacing) {
    let currentSegment = null

    for (let x = 0; x < width; x++) {
      let darkness = sampleLocalDarkness(grayscale, width, height, x, cy, 1, sampleRadiusY)
      if (invert) darkness = 1 - darkness
      darkness = Math.pow(darkness, gamma)

      const thickness = effectiveMinT + (effectiveMaxT - effectiveMinT) * darkness

      // Line exists if thickness >= 0.75 px and darkness > 0.08
      const hasLine = thickness >= 0.75 && darkness > 0.08

      if (hasLine) {
        const roundedT = Math.max(1, Math.min(8, Math.round(thickness)))

        if (!currentSegment) {
          currentSegment = {
            startX: x,
            strokeWidth: roundedT,
            thicknessSum: thickness,
            samples: 1
          }
        } else {
          // If thickness changed dramatically by more than 1.5px, break segment to keep crisp strokes
          if (Math.abs(roundedT - currentSegment.strokeWidth) > 1 && currentSegment.samples >= 4) {
            // Commit previous segment
            const segW = x - currentSegment.startX
            if (segW >= minSegmentLength) {
              lineCount++
              elements.push({
                id: `line_tele_${cy}_${currentSegment.startX}_${lineCount}`,
                type: 'line',
                name: `Wirephoto Line ${lineCount}`,
                x: currentSegment.startX,
                y: Math.max(0, Math.min(height - currentSegment.strokeWidth, cy - Math.floor(currentSegment.strokeWidth / 2))),
                width: segW,
                height: currentSegment.strokeWidth,
                strokeWidth: currentSegment.strokeWidth,
                color
              })
            }
            currentSegment = {
              startX: x,
              strokeWidth: roundedT,
              thicknessSum: thickness,
              samples: 1
            }
          } else {
            currentSegment.thicknessSum += thickness
            currentSegment.samples++
            // Keep running average
            currentSegment.strokeWidth = Math.max(1, Math.min(8, Math.round(currentSegment.thicknessSum / currentSegment.samples)))
          }
        }
      } else {
        if (currentSegment) {
          const segW = x - currentSegment.startX
          if (segW >= minSegmentLength) {
            lineCount++
            elements.push({
              id: `line_tele_${cy}_${currentSegment.startX}_${lineCount}`,
              type: 'line',
              name: `Wirephoto Line ${lineCount}`,
              x: currentSegment.startX,
              y: Math.max(0, Math.min(height - currentSegment.strokeWidth, cy - Math.floor(currentSegment.strokeWidth / 2))),
              width: segW,
              height: currentSegment.strokeWidth,
              strokeWidth: currentSegment.strokeWidth,
              color
            })
          }
          currentSegment = null
        }
      }
    }

    // End of row
    if (currentSegment) {
      const segW = width - currentSegment.startX
      if (segW >= minSegmentLength) {
        lineCount++
        elements.push({
          id: `line_tele_${cy}_${currentSegment.startX}_${lineCount}`,
          type: 'line',
          name: `Wirephoto Line ${lineCount}`,
          x: currentSegment.startX,
          y: Math.max(0, Math.min(height - currentSegment.strokeWidth, cy - Math.floor(currentSegment.strokeWidth / 2))),
          width: segW,
          height: currentSegment.strokeWidth,
          strokeWidth: currentSegment.strokeWidth,
          color
        })
      }
    }
  }

  return elements
}
