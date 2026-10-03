// ======================================================
// LCD IMAGE PROCESSING
// ======================================================
//
// Low-level, OCR-independent image processing.
//
// Responsibilities:
// - Canvas creation
// - Image loading
// - RGBA -> grayscale conversion
// - Otsu threshold calculation
// - LCD foreground polarity detection
// - Binary mask creation
// - Isolated pixel noise cleanup
//
// OCR logic does NOT belong in this module.
// ======================================================

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      resolve(image)
    }

    image.onerror = () => {
      reject(
        new Error(
          'Reference image could not be read.',
        ),
      )
    }

    image.src = src
  })
}

export function createCanvas(width, height) {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  return canvas
}

// ======================================================
// GRAYSCALE
// ======================================================

export function createGrayscale(data) {
  const pixelCount = data.length / 4
  const grayscale = new Uint8Array(pixelCount)

  for (
    let pixel = 0;
    pixel < pixelCount;
    pixel += 1
  ) {
    const index = pixel * 4

    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]

    grayscale[pixel] = Math.round(
      red * 0.299 +
      green * 0.587 +
      blue * 0.114,
    )
  }

  return grayscale
}

// ======================================================
// OTSU THRESHOLD
// ======================================================

export function calculateOtsuThreshold(grayscale) {
  if (!grayscale || grayscale.length === 0) {
    return 127
  }

  const histogram = new Uint32Array(256)

  for (
    let index = 0;
    index < grayscale.length;
    index += 1
  ) {
    histogram[grayscale[index]] += 1
  }

  const total = grayscale.length

  let totalIntensity = 0

  for (
    let value = 0;
    value < 256;
    value += 1
  ) {
    totalIntensity += value * histogram[value]
  }

  let backgroundWeight = 0
  let backgroundIntensity = 0

  let bestThreshold = 127
  let bestVariance = -1

  for (
    let threshold = 0;
    threshold < 256;
    threshold += 1
  ) {
    backgroundWeight += histogram[threshold]

    if (backgroundWeight === 0) {
      continue
    }

    const foregroundWeight =
      total - backgroundWeight

    if (foregroundWeight === 0) {
      break
    }

    backgroundIntensity +=
      threshold * histogram[threshold]

    const backgroundMean =
      backgroundIntensity / backgroundWeight

    const foregroundMean =
      (
        totalIntensity -
        backgroundIntensity
      ) /
      foregroundWeight

    const difference =
      backgroundMean - foregroundMean

    const betweenClassVariance =
      backgroundWeight *
      foregroundWeight *
      difference *
      difference

    if (
      betweenClassVariance >
      bestVariance
    ) {
      bestVariance =
        betweenClassVariance

      bestThreshold =
        threshold
    }
  }

  return bestThreshold
}

// ======================================================
// POLARITY
// ======================================================

export function detectPolarity(
  grayscale,
  threshold,
) {
  let darkPixels = 0
  let lightPixels = 0

  for (
    let index = 0;
    index < grayscale.length;
    index += 1
  ) {
    if (grayscale[index] <= threshold) {
      darkPixels += 1
    } else {
      lightPixels += 1
    }
  }

  /*
   * LCD screenshots usually contain a large background
   * area and a smaller foreground area.
   *
   * The minority side of the threshold is therefore
   * treated as foreground.
   */

  return darkPixels <= lightPixels
    ? 'dark-on-light'
    : 'light-on-dark'
}

// ======================================================
// BINARY MASK
// ======================================================

export function createBinaryMask(
  grayscale,
  threshold,
  polarity,
) {
  const mask = new Uint8Array(
    grayscale.length,
  )

  const darkForeground =
    polarity === 'dark-on-light'

  for (
    let index = 0;
    index < grayscale.length;
    index += 1
  ) {
    const value = grayscale[index]

    const foreground = darkForeground
      ? value <= threshold
      : value > threshold

    mask[index] = foreground ? 1 : 0
  }

  return mask
}

// ======================================================
// NOISE CLEANUP
// ======================================================

export function removeIsolatedNoise(
  mask,
  width,
  height,
) {
  if (
    !mask ||
    width < 3 ||
    height < 3
  ) {
    return mask
  }

  const source = mask.slice()

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
      const index = y * width + x

      if (source[index] === 0) {
        continue
      }

      let neighbours = 0

      for (
        let offsetY = -1;
        offsetY <= 1;
        offsetY += 1
      ) {
        for (
          let offsetX = -1;
          offsetX <= 1;
          offsetX += 1
        ) {
          if (
            offsetX === 0 &&
            offsetY === 0
          ) {
            continue
          }

          const neighbourIndex =
            (y + offsetY) * width +
            (x + offsetX)

          neighbours +=
            source[neighbourIndex]
        }
      }

      if (neighbours === 0) {
        mask[index] = 0
      }
    }
  }

  return mask
}

// ======================================================
// SOURCE IMAGE ANALYSIS
// ======================================================

export function prepareSourceImage(image) {
  const width = image.naturalWidth
  const height = image.naturalHeight

  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new Error(
      'Reference image has invalid dimensions.',
    )
  }

  const canvas = createCanvas(
    width,
    height,
  )

  const context = canvas.getContext(
    '2d',
    {
      willReadFrequently: true,
    },
  )

  if (!context) {
    throw new Error(
      'Canvas image analysis is not available.',
    )
  }

  context.imageSmoothingEnabled = false

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  )

  const imageData = context.getImageData(
    0,
    0,
    width,
    height,
  )

  const grayscale =
    createGrayscale(
      imageData.data,
    )

  const threshold =
    calculateOtsuThreshold(
      grayscale,
    )

  const polarity =
    detectPolarity(
      grayscale,
      threshold,
    )

  const binaryMask =
    createBinaryMask(
      grayscale,
      threshold,
      polarity,
    )

  removeIsolatedNoise(
    binaryMask,
    width,
    height,
  )

  return {
    width,
    height,
    canvas,
    imageData,
    grayscale,
    threshold,
    polarity,
    binaryMask,
  }
}

// ======================================================
// PALETTE EXTRACTION
// ======================================================

export function extractDominantColors(imageData, binaryMask) {
  if (!imageData || !binaryMask) {
    return {
      foreground: '#a8d9a8',
      background: '#1d2720',
    }
  }

  const { data } = imageData
  let fgR = 0, fgG = 0, fgB = 0, fgCount = 0
  let bgR = 0, bgG = 0, bgB = 0, bgCount = 0

  const totalPixels = binaryMask.length
  const step = Math.max(1, Math.floor(totalPixels / 25000))

  for (let i = 0; i < totalPixels; i += step) {
    const idx = i * 4
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]

    if (binaryMask[i] === 1) {
      fgR += r
      fgG += g
      fgB += b
      fgCount++
    } else {
      bgR += r
      bgG += g
      bgB += b
      bgCount++
    }
  }

  function toHex(r, g, b) {
    const clampVal = (v) => Math.max(0, Math.min(255, Math.round(v)))
    const hex = (v) => clampVal(v).toString(16).padStart(2, '0')
    return `#${hex(r)}${hex(g)}${hex(b)}`
  }

  const foreground = fgCount > 0 ? toHex(fgR / fgCount, fgG / fgCount, fgB / fgCount) : '#a8d9a8'
  const background = bgCount > 0 ? toHex(bgR / bgCount, bgG / bgCount, bgB / bgCount) : '#1d2720'

  return {
    foreground,
    background,
  }
}