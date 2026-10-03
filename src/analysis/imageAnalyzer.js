import { editorState } from '../editor/state.js'

import {
  loadImage,
  prepareSourceImage,
  extractDominantColors,
} from './imageProcessing.js'

import {
  detectGeometry,
  lineGeometryToElement,
  rectangleGeometryToElement,
} from './geometryDetector.js'

import {
  recognizeLcdText,
} from './ocr/ocrEngine.js'

// ======================================================
// LCD IMAGE ANALYZER
// ======================================================
//
// High-level analysis pipeline.
//
// Responsibilities:
// - Read the current reference image
// - Prepare source image data and extract true color palette
// - Run OCR pipeline
// - Detect geometry: horizontal lines, vertical lines, frames
// - Convert OCR regions & geometry into editor elements
// - Return analysis statistics and LCD palette
// ======================================================

// ======================================================
// MAIN ANALYSIS
// ======================================================

export async function analyzeReferenceImage() {
  const reference =
    editorState.reference

  if (!reference?.src) {
    throw new Error(
      'Upload a reference image before analyzing.',
    )
  }

  // ----------------------------------------------------
  // Load reference image
  // ----------------------------------------------------

  const image =
    await loadImage(
      reference.src,
    )

  // ----------------------------------------------------
  // Basic image processing & palette extraction
  // ----------------------------------------------------

  const source =
    prepareSourceImage(
      image,
    )

  const {
    width,
    height,
    threshold,
    polarity,
    binaryMask,
    imageData,
  } = source

  const palette = extractDominantColors(
    imageData,
    binaryMask,
  )

  // ----------------------------------------------------
  // OCR
  // ----------------------------------------------------

  const ocr =
    await recognizeLcdText({
      image,
      width,
      height,
      threshold,
      polarity,
    })

  // ----------------------------------------------------
  // Detect graphical geometry (H-lines, V-lines, frames)
  // Suppresses false-positive lines inside text regions
  // ----------------------------------------------------

  const geometry =
    detectGeometry(
      binaryMask,
      width,
      height,
      ocr.regions,
    )

  // ----------------------------------------------------
  // Convert analysis results to editor elements
  // ----------------------------------------------------

  const textElements =
    ocr.regions.map(
      (region) => ocrRegionToElement(region, palette.foreground),
    )

  const lineElements =
    geometry.lines.map(
      (line) => lineGeometryToElement(line, palette.foreground),
    )

  const rectElements =
    geometry.rectangles.map(
      (rect) => rectangleGeometryToElement(rect, palette.foreground),
    )

  const elements = [
    ...textElements,
    ...rectElements,
    ...lineElements,
  ]

  elements.sort(
    sortElements,
  )

  // ----------------------------------------------------
  // Result
  // ----------------------------------------------------

  return {
    width,
    height,

    threshold,
    polarity,
    palette,

    elements,

    text:
      ocr.text,

    stats: {
      textRegions:
        textElements.length,

      lines:
        lineElements.length,

      rectangles:
        rectElements.length,

      totalElements:
        elements.length,

      ocrCandidates:
        ocr.candidates.length,

      ocrClusters:
        ocr.clusters.length,

      ocrWords:
        ocr.words.length,

      ocrScale:
        ocr.scale,

      ocrPadding:
        ocr.padding,
    },
  }
}

// ======================================================
// OCR REGION -> EDITOR ELEMENT
// ======================================================

function ocrRegionToElement(region, color = '#a8d9a8') {
  const text =
    String(
      region?.text ?? '',
    ).trim()

  const x =
    Math.max(
      0,
      Math.round(
        Number(region?.x) || 0,
      ),
    )

  const y =
    Math.max(
      0,
      Math.round(
        Number(region?.y) || 0,
      ),
    )

  const width =
    Math.max(
      1,
      Math.round(
        Number(region?.width) || 1,
      ),
    )

  const height =
    Math.max(
      1,
      Math.round(
        Number(region?.height) || 1,
      ),
    )

  /*
   * OCR bounding-box height is a useful starting point
   * for LCD font size.
   *
   * We keep it conservative because the editor can
   * always enlarge the text later.
   */

  const fontSize =
    clamp(
      Math.round(
        height * 1.05,
      ),
      6,
      96,
    )

  return {
    type: 'text',

    name:
      createTextElementName(
        text,
      ),

    text,

    x,
    y,

    width,
    height,

    fontSize,

    fontFamily:
      'monospace',

    fontWeight:
      '400',

    textAlign:
      'left',

    color,

    opacity: 1,

    rotation: 0,

    source:
      'analysis',

    confidence:
      Number(
        region?.confidence,
      ) || 0,

    fusionScore:
      Number(
        region?.fusionScore,
      ) || 0,

    support:
      Number(
        region?.support,
      ) || 1,

    sourceSupport:
      Number(
        region?.sourceSupport,
      ) || 1,
  }
}

// ======================================================
// ELEMENT NAME
// ======================================================

function createTextElementName(text) {
  const normalized =
    String(
      text ?? '',
    )
      .replace(
        /\s+/g,
        ' ',
      )
      .trim()

  if (!normalized) {
    return 'Detected Text'
  }

  const maximumLength = 28

  if (
    normalized.length <=
    maximumLength
  ) {
    return normalized
  }

  return (
    `${normalized.slice(
      0,
      maximumLength - 1,
    )}…`
  )
}

// ======================================================
// ELEMENT SORTING
// ======================================================

function sortElements(
  first,
  second,
) {
  const firstY =
    Number(first?.y) || 0

  const secondY =
    Number(second?.y) || 0

  const firstHeight =
    Number(first?.height) || 0

  const secondHeight =
    Number(second?.height) || 0

  const firstCenterY =
    firstY +
    firstHeight / 2

  const secondCenterY =
    secondY +
    secondHeight / 2

  const rowTolerance =
    Math.max(
      2,
      Math.min(
        Math.max(
          1,
          firstHeight,
        ),

        Math.max(
          1,
          secondHeight,
        ),
      ) * 0.5,
    )

  if (
    Math.abs(
      firstCenterY -
      secondCenterY,
    ) >
    rowTolerance
  ) {
    return (
      firstCenterY -
      secondCenterY
    )
  }

  const firstX =
    Number(first?.x) || 0

  const secondX =
    Number(second?.x) || 0

  return (
    firstX -
    secondX
  )
}

// ======================================================
// HELPERS
// ======================================================

function clamp(
  value,
  minimum,
  maximum,
) {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  )
}