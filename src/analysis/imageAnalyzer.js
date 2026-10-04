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
  circleGeometryToElement,
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
// - Run OCR pipeline with 7-segment normalization
// - Detect geometry: horizontal lines, vertical lines, frames,
//   solid badges, indicator dots/circles, and battery icons
// - Automatically invert text colors inside dark solid badges
// - Intelligently match authentic LCD typography & font weights
// - Suggest standard LCD hardware resolutions
// - Return analysis statistics and LCD palette
// ======================================================

const STANDARD_RESOLUTIONS = [
  { width: 128, height: 64, name: '128 × 64 (OLED / Graphic LCD)' },
  { width: 128, height: 32, name: '128 × 32 (Narrow OLED)' },
  { width: 84, height: 48, name: '84 × 48 (Nokia 5110)' },
  { width: 160, height: 128, name: '160 × 128 (ST7735 Color TFT)' },
  { width: 240, height: 128, name: '240 × 128 (Graphic LCD)' },
  { width: 240, height: 64, name: '240 × 64 (Wide LCD)' },
  { width: 256, height: 64, name: '256 × 64 (SSD1322 OLED)' },
  { width: 320, height: 240, name: '320 × 240 (QVGA TFT)' },
  { width: 160, height: 80, name: '160 × 80 (Mini TFT)' },
]

// ======================================================
// MAIN ANALYSIS
// ======================================================

export async function analyzeReferenceImage(options = {}) {
  const reference = editorState.reference
  if (!reference?.src) {
    throw new Error('Upload a reference image before analyzing.')
  }

  const image = await loadImage(reference.src)
  const source = prepareSourceImage(image)
  const { width, height, threshold, polarity, binaryMask, imageData } = source
  const palette = extractDominantColors(imageData, binaryMask)

  const ocr = await recognizeLcdText({
    image,
    width,
    height,
    threshold,
    polarity,
  })

  const geometry = detectGeometry(
    binaryMask,
    width,
    height,
    ocr.regions,
    options,
  )

  const textElements = options.detectText !== false
    ? ocr.regions.map((region) => ocrRegionToElement(region, palette.foreground))
    : []

  const lineElements = options.detectFrames !== false
    ? geometry.lines.map((line) => lineGeometryToElement(line, palette.foreground))
    : []

  const rectElements = geometry.rectangles
    .filter((rect) => {
      if (rect.filled && options.detectBadges === false) return false
      if (!rect.filled && options.detectFrames === false) return false
      return true
    })
    .map((rect) => rectangleGeometryToElement(rect, palette.foreground))

  const circleElements = options.detectCircles !== false
    ? (geometry.circles || []).map((circle) => circleGeometryToElement(circle, palette.foreground))
    : []

  const symbolElements = options.detectSymbols !== false
    ? (geometry.symbols || []).map((sym) => {
        if (sym.type === 'text' || sym.type === 'line') {
          return { ...sym, color: sym.color || palette.foreground }
        }
        return {
          ...sym,
          stroke: sym.stroke || palette.foreground,
          fill: sym.fill === 'transparent' ? 'transparent' : (sym.fill || palette.foreground),
        }
      })
    : []

  // Inverted text badge contrast handling:
  // If a text element is placed inside a solid rectangle, set text color to display background
  for (const text of textElements) {
    for (const rect of rectElements) {
      if (rect.fill !== 'transparent') {
        const pad = 2
        const insideX = text.x >= rect.x - pad && (text.x + text.width) <= (rect.x + rect.width + pad)
        const insideY = text.y >= rect.y - pad && (text.y + text.height) <= (rect.y + rect.height + pad)
        if (insideX && insideY) {
          text.color = palette.background || '#1d2720'
          text.inverted = true
          rect.name = 'Detected Inverted Badge'
        }
      }
    }
  }

  const elements = [
    ...rectElements,
    ...circleElements,
    ...symbolElements,
    ...lineElements,
    ...textElements,
  ]

  elements.sort(sortElements)
  const suggestedResolution = findSuggestedResolution(width, height)

  return {
    width,
    height,
    threshold,
    polarity,
    palette,
    suggestedResolution,
    elements,
    text: ocr.text,
    stats: {
      textRegions: textElements.length,
      lines: lineElements.length,
      rectangles: rectElements.length,
      hollowFrames: geometry.stats?.hollowFrames ?? 0,
      solidBadges: geometry.stats?.solidBadges ?? 0,
      circles: circleElements.length,
      symbols: symbolElements.length,
      totalElements: elements.length,
      ocrCandidates: ocr.candidates.length,
      ocrClusters: ocr.clusters.length,
      ocrWords: ocr.words.length,
      ocrScale: ocr.scale,
      ocrPadding: ocr.padding,
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

  const fontSize =
    clamp(
      Math.round(
        height * 1.05,
      ),
      6,
      96,
    )

  // Authentic LCD typography heuristics
  const isNumericTelemetry = /^[0-9.:\-\s%+°CFAVWmkuhzRPMpsiBAR/]+$/i.test(text)
  const isDigitalClock = /^\d{1,2}:\d{2}(?::\d{2})?$/.test(text)
  const isShortLabel = /^[A-Z0-9_\-\s]{2,16}$/.test(text)

  let fontFamily = 'monospace'
  let fontWeight = 400

  if (isDigitalClock || isNumericTelemetry) {
    fontFamily = 'Share Tech Mono'
    fontWeight = 700
  } else if (isShortLabel) {
    fontFamily = 'Share Tech Mono'
    fontWeight = 700
  } else if (height >= 16) {
    fontWeight = 700
  }

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

    fontFamily,

    fontWeight,

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
// RESOLUTION MATCHER
// ======================================================

function findSuggestedResolution(imgWidth, imgHeight) {
  const imgAspect = imgWidth / imgHeight
  let bestMatch = null
  let bestScore = Infinity

  for (const res of STANDARD_RESOLUTIONS) {
    for (const scale of [1, 2, 3, 4, 0.5]) {
      const targetW = res.width * scale
      const targetH = res.height * scale
      const diffW = Math.abs(imgWidth - targetW) / targetW
      const diffH = Math.abs(imgHeight - targetH) / targetH
      const score = diffW + diffH
      if (score < 0.15 && score < bestScore) {
        bestScore = score
        bestMatch = res
      }
    }

    const resAspect = res.width / res.height
    const aspectDiff = Math.abs(imgAspect - resAspect) / resAspect
    if (aspectDiff < 0.05 && 0.25 < bestScore) {
      bestScore = 0.25
      bestMatch = res
    }
  }

  return bestMatch
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
  // If one element is a background container of the other, container goes first
  if (isContainerOf(first, second)) return -1
  if (isContainerOf(second, first)) return 1

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

function isContainerOf(container, target) {
  if (container?.type === 'text') return false
  const cX = Number(container?.x) || 0
  const cY = Number(container?.y) || 0
  const cW = Number(container?.width) || 0
  const cH = Number(container?.height) || 0

  const tX = Number(target?.x) || 0
  const tY = Number(target?.y) || 0
  const tW = Number(target?.width) || 0
  const tH = Number(target?.height) || 0

  const pad = 2
  return (
    tX >= cX - pad &&
    (tX + tW) <= (cX + cW + pad) &&
    tY >= cY - pad &&
    (tY + tH) <= (cY + cH + pad)
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