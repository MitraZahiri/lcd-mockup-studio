import { createCanvas } from '../imageProcessing.js'

// ======================================================
// LCD OCR PREPROCESSOR
// ======================================================
//
// Responsibilities:
// - Choose OCR upscale factor
// - Choose OCR padding
// - Build preprocessing variants
// - Correct threshold direction for LCD polarity
// - Convert source image to black-on-white OCR input
// - Recover thin / broken LCD character strokes
//
// Tesseract execution does NOT belong here.
// OCR fusion does NOT belong here.
// ======================================================

// ======================================================
// SCALE
// ======================================================

export function chooseOcrScale(
  width,
  height,
) {
  const longestSide = Math.max(
    width,
    height,
  )

  if (longestSide <= 320) {
    return 6
  }

  if (longestSide <= 640) {
    return 4
  }

  if (longestSide <= 1200) {
    return 2
  }

  return 1
}

// ======================================================
// PADDING
// ======================================================

export function chooseOcrPadding(
  width,
  height,
) {
  const shortestSide = Math.min(
    width,
    height,
  )

  return Math.max(
    8,
    Math.min(
      24,
      Math.round(
        shortestSide * 0.12,
      ),
    ),
  )
}

// ======================================================
// VARIANTS
// ======================================================

export function createOcrVariants({
  image,
  width,
  height,
  scale,
  padding,
  threshold,
  polarity,
}) {
  const thresholdStep =
    chooseThresholdStep(
      threshold,
    )

  const thinThreshold =
    getAdjustedThreshold({
      threshold,
      polarity,
      amount: thresholdStep,
      mode: 'thin',
    })

  const thickThreshold =
    getAdjustedThreshold({
      threshold,
      polarity,
      amount: thresholdStep,
      mode: 'thick',
    })

  return [
    {
      name: 'normal',

      canvas: createOcrCanvas({
        image,
        width,
        height,
        scale,
        padding,
        threshold,
        polarity,
        morphology: 'none',
      }),
    },

    {
      name: 'thin',

      canvas: createOcrCanvas({
        image,
        width,
        height,
        scale,
        padding,
        threshold: thinThreshold,
        polarity,
        morphology: 'none',
      }),
    },

    {
      name: 'thick',

      canvas: createOcrCanvas({
        image,
        width,
        height,
        scale,
        padding,
        threshold: thickThreshold,
        polarity,
        morphology: 'none',
      }),
    },

    {
      name: 'recovery',

      canvas: createOcrCanvas({
        image,
        width,
        height,
        scale,
        padding,
        threshold,
        polarity,
        morphology: 'dilate',
      }),
    },
  ]
}

// ======================================================
// THRESHOLD VARIANTS
// ======================================================

function chooseThresholdStep(
  threshold,
) {
  const distanceFromEdge = Math.min(
    threshold,
    255 - threshold,
  )

  return Math.max(
    8,
    Math.min(
      18,
      Math.round(
        distanceFromEdge * 0.14,
      ),
    ),
  )
}

function getAdjustedThreshold({
  threshold,
  polarity,
  amount,
  mode,
}) {
  const darkForeground =
    polarity === 'dark-on-light'

  let adjustment = 0

  /*
   * dark-on-light:
   *
   *   lower threshold -> fewer foreground pixels -> thin
   *   higher threshold -> more foreground pixels -> thick
   *
   * light-on-dark is the opposite.
   */

  if (mode === 'thin') {
    adjustment = darkForeground
      ? -amount
      : amount
  }

  if (mode === 'thick') {
    adjustment = darkForeground
      ? amount
      : -amount
  }

  return clamp(
    threshold + adjustment,
    1,
    254,
  )
}

// ======================================================
// OCR CANVAS
// ======================================================

function createOcrCanvas({
  image,
  width,
  height,
  scale,
  padding,
  threshold,
  polarity,
  morphology = 'none',
}) {
  const scaledPadding =
    padding * scale

  const scaledWidth =
    width * scale

  const scaledHeight =
    height * scale

  const canvas = createCanvas(
    scaledWidth +
      scaledPadding * 2,

    scaledHeight +
      scaledPadding * 2,
  )

  const context = canvas.getContext(
    '2d',
    {
      willReadFrequently: true,
    },
  )

  if (!context) {
    throw new Error(
      'OCR preprocessing canvas is not available.',
    )
  }

  /*
   * Tesseract receives a conventional
   * black-foreground / white-background image,
   * regardless of the original LCD polarity.
   */

  context.fillStyle = '#ffffff'

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  )

  context.imageSmoothingEnabled = false

  context.drawImage(
    image,
    scaledPadding,
    scaledPadding,
    scaledWidth,
    scaledHeight,
  )

  const imageData = context.getImageData(
    scaledPadding,
    scaledPadding,
    scaledWidth,
    scaledHeight,
  )

  const data = imageData.data

  const darkForeground =
    polarity === 'dark-on-light'

  const mask = new Uint8Array(
    scaledWidth * scaledHeight,
  )

  // ----------------------------------------------
  // Threshold source pixels
  // ----------------------------------------------

  for (
    let pixel = 0;
    pixel < mask.length;
    pixel += 1
  ) {
    const index = pixel * 4

    const gray = Math.round(
      data[index] * 0.299 +
      data[index + 1] * 0.587 +
      data[index + 2] * 0.114,
    )

    const foreground = darkForeground
      ? gray <= threshold
      : gray > threshold

    mask[pixel] =
      foreground ? 1 : 0
  }

  // ----------------------------------------------
  // Optional character-stroke recovery
  // ----------------------------------------------

  const processedMask =
    morphology === 'dilate'
      ? dilateBinaryMask(
          mask,
          scaledWidth,
          scaledHeight,
        )
      : mask

  // ----------------------------------------------
  // Binary mask -> black/white image
  // ----------------------------------------------

  for (
    let pixel = 0;
    pixel < processedMask.length;
    pixel += 1
  ) {
    const index = pixel * 4

    const output =
      processedMask[pixel] === 1
        ? 0
        : 255

    data[index] = output
    data[index + 1] = output
    data[index + 2] = output
    data[index + 3] = 255
  }

  context.putImageData(
    imageData,
    scaledPadding,
    scaledPadding,
  )

  return canvas
}

// ======================================================
// MORPHOLOGY
// ======================================================

function dilateBinaryMask(
  mask,
  width,
  height,
) {
  const result = mask.slice()

  /*
   * Conservative cross-shaped dilation.
   *
   * Only direct horizontal/vertical neighbours
   * are expanded.
   *
   * This is intentionally weaker than a full
   * 3x3 dilation because tiny LCD characters
   * can otherwise merge into neighbouring glyphs.
   */

  for (
    let y = 1;
    y < height - 1;
    y += 1
  ) {
    for (
      let x = 1;
      x < width - 1;
      x += 1
    ) {
      const index =
        y * width + x

      if (mask[index] === 1) {
        continue
      }

      const left =
        mask[index - 1]

      const right =
        mask[index + 1]

      const top =
        mask[index - width]

      const bottom =
        mask[index + width]

      if (
        left === 1 ||
        right === 1 ||
        top === 1 ||
        bottom === 1
      ) {
        result[index] = 1
      }
    }
  }

  return result
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