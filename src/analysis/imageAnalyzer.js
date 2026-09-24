import { editorState } from '../editor/state.js'

import {
  loadImage,
  prepareSourceImage,
} from './imageProcessing.js'

import {
  detectHorizontalLines,
  lineToElement,
} from './lineDetector.js'

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
// - Prepare source image data
// - Detect simple graphical lines
// - Run OCR pipeline
// - Convert OCR regions into editor elements
// - Return analysis statistics
//
// Detailed OCR/image-processing logic belongs in the
// dedicated modules under src/analysis/.
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
  // Basic image processing
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
  } = source

  // ----------------------------------------------------
  // Detect graphical horizontal lines
  // ----------------------------------------------------

  const detectedLines =
    detectHorizontalLines(
      binaryMask,
      width,
      height,
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
  // Convert analysis results to editor elements
  // ----------------------------------------------------

  const textElements =
    ocr.regions.map(
      ocrRegionToElement,
    )

  const lineElements =
    detectedLines.map(
      lineToElement,
    )

  const elements = [
    ...textElements,
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

    elements,

    text:
      ocr.text,

    stats: {
      textRegions:
        textElements.length,

      horizontalLines:
        lineElements.length,

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

function ocrRegionToElement(region) {
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

    color:
      '#a8d9a8',

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