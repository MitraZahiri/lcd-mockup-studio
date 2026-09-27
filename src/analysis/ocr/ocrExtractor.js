// ======================================================
// LCD OCR EXTRACTOR
// ======================================================
//
// Converts Tesseract block output into clean OCR
// word candidates using the original LCD coordinates.
//
// Responsibilities:
// - Traverse Tesseract blocks / paragraphs / lines / words
// - Clean recognized text
// - Filter unusable OCR candidates
// - Convert scaled + padded OCR coordinates back to
//   original display coordinates
// - Preserve confidence, preprocessing variant and pass
//
// Fusion / winner selection does NOT belong here.
// Tesseract worker execution does NOT belong here.
// ======================================================

const MINIMUM_WORD_CONFIDENCE = 15

// ======================================================
// WORD EXTRACTION
// ======================================================

export function extractWordsFromBlocks(
  blocks,
  {
    scale,
    padding,
    originalWidth,
    originalHeight,
    variant,
    pass,
  },
) {
  if (
    !Array.isArray(blocks) ||
    blocks.length === 0
  ) {
    return []
  }

  if (
    !Number.isFinite(scale) ||
    scale <= 0
  ) {
    throw new Error(
      'OCR extraction requires a valid scale.',
    )
  }

  if (
    !Number.isFinite(originalWidth) ||
    !Number.isFinite(originalHeight) ||
    originalWidth < 1 ||
    originalHeight < 1
  ) {
    throw new Error(
      'OCR extraction requires valid original image dimensions.',
    )
  }

  const safePadding =
    Number.isFinite(padding)
      ? Math.max(0, padding)
      : 0

  const scaledPadding =
    safePadding * scale

  const words = []

  for (const block of blocks) {
    const paragraphs =
      block?.paragraphs ?? []

    for (const paragraph of paragraphs) {
      const lines =
        paragraph?.lines ?? []

      for (const line of lines) {
        const lineWords =
          line?.words ?? []

        for (const word of lineWords) {
          const candidate =
            createWordCandidate({
              word,
              scale,
              scaledPadding,
              originalWidth,
              originalHeight,
              variant,
              pass,
            })

          if (candidate) {
            words.push(candidate)
          }
        }
      }
    }
  }

  return words
}

// ======================================================
// CANDIDATE CREATION
// ======================================================

function createWordCandidate({
  word,
  scale,
  scaledPadding,
  originalWidth,
  originalHeight,
  variant,
  pass,
}) {
  const text =
    sanitizeRecognizedText(
      word?.text ?? '',
    )

  if (!text) {
    return null
  }

  const confidence =
    Number(
      word?.confidence ?? 0,
    )

  if (
    !Number.isFinite(confidence) ||
    confidence <
      MINIMUM_WORD_CONFIDENCE
  ) {
    return null
  }

  const bbox = word?.bbox

  if (!isValidBoundingBox(bbox)) {
    return null
  }

  const logicalBox =
    mapBoundingBoxToOriginal({
      bbox,
      scale,
      scaledPadding,
      originalWidth,
      originalHeight,
    })

  if (!logicalBox) {
    return null
  }

  if (
    isImplausiblyLargeCandidate(
      logicalBox,
      originalWidth,
      originalHeight,
    )
  ) {
    return null
  }

  return {
    text,
    confidence,

    x: logicalBox.x,
    y: logicalBox.y,

    width:
      logicalBox.width,

    height:
      logicalBox.height,

    variant:
      String(
        variant ?? 'unknown',
      ),

    pass:
      String(
        pass ?? 'unknown',
      ),
  }
}

// ======================================================
// BOUNDING BOX VALIDATION
// ======================================================

function isValidBoundingBox(bbox) {
  if (!bbox) {
    return false
  }

  const values = [
    Number(bbox.x0),
    Number(bbox.y0),
    Number(bbox.x1),
    Number(bbox.y1),
  ]

  if (
    !values.every(
      Number.isFinite,
    )
  ) {
    return false
  }

  const [
    x0,
    y0,
    x1,
    y1,
  ] = values

  return (
    x1 > x0 &&
    y1 > y0
  )
}

// ======================================================
// COORDINATE MAPPING
// ======================================================

function mapBoundingBoxToOriginal({
  bbox,
  scale,
  scaledPadding,
  originalWidth,
  originalHeight,
}) {
  const rawX0 =
    Number(bbox.x0)

  const rawY0 =
    Number(bbox.y0)

  const rawX1 =
    Number(bbox.x1)

  const rawY1 =
    Number(bbox.y1)

  /*
   * Tesseract sees:
   *
   *   padded + upscaled OCR canvas
   *
   * The editor needs:
   *
   *   original LCD pixel coordinates
   *
   * Therefore:
   *
   *   original =
   *   (ocrCoordinate - scaledPadding) / scale
   */

  const logicalX0 =
    (
      rawX0 -
      scaledPadding
    ) /
    scale

  const logicalY0 =
    (
      rawY0 -
      scaledPadding
    ) /
    scale

  const logicalX1 =
    (
      rawX1 -
      scaledPadding
    ) /
    scale

  const logicalY1 =
    (
      rawY1 -
      scaledPadding
    ) /
    scale

  /*
   * Completely outside the original LCD area.
   * This can happen because OCR also sees padding.
   */

  if (
    logicalX1 <= 0 ||
    logicalY1 <= 0 ||
    logicalX0 >= originalWidth ||
    logicalY0 >= originalHeight
  ) {
    return null
  }

  const clippedX0 = clamp(
    logicalX0,
    0,
    originalWidth,
  )

  const clippedY0 = clamp(
    logicalY0,
    0,
    originalHeight,
  )

  const clippedX1 = clamp(
    logicalX1,
    0,
    originalWidth,
  )

  const clippedY1 = clamp(
    logicalY1,
    0,
    originalHeight,
  )

  const x = clamp(
    Math.floor(clippedX0),
    0,
    originalWidth - 1,
  )

  const y = clamp(
    Math.floor(clippedY0),
    0,
    originalHeight - 1,
  )

  const right = clamp(
    Math.ceil(clippedX1),
    x + 1,
    originalWidth,
  )

  const bottom = clamp(
    Math.ceil(clippedY1),
    y + 1,
    originalHeight,
  )

  return {
    x,
    y,

    width: Math.max(
      1,
      right - x,
    ),

    height: Math.max(
      1,
      bottom - y,
    ),
  }
}

// ======================================================
// CANDIDATE FILTERING
// ======================================================

function isImplausiblyLargeCandidate(
  candidate,
  originalWidth,
  originalHeight,
) {
  const widthRatio =
    candidate.width /
    originalWidth

  const heightRatio =
    candidate.height /
    originalHeight

  /*
   * A single Tesseract "word" covering almost the
   * complete display and more than half its height
   * is normally a segmentation failure rather than
   * a useful LCD text token.
   */

  return (
    widthRatio > 0.98 &&
    heightRatio > 0.5
  )
}

// ======================================================
// TEXT CLEANUP
// ======================================================

export function sanitizeRecognizedText(
  value,
) {
  return String(
    value ?? '',
  )
    .normalize('NFKC')
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
}

export function cleanOcrText(
  value,
) {
  return String(
    value ?? '',
  )
    .replace(/\r/g, '')
    .replace(
      /[ \t]+\n/g,
      '\n',
    )
    .replace(
      /\n{3,}/g,
      '\n\n',
    )
    .trim()
}

// ======================================================
// SORTING
// ======================================================

export function sortOcrWords(
  first,
  second,
) {
  const firstCenterY =
    first.y +
    first.height / 2

  const secondCenterY =
    second.y +
    second.height / 2

  if (
    Math.abs(
      firstCenterY -
      secondCenterY,
    ) > 3
  ) {
    return (
      firstCenterY -
      secondCenterY
    )
  }

  return (
    first.x -
    second.x
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