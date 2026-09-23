import {
  createWorker,
  PSM,
} from 'tesseract.js'

import {
  editorState,
} from '../editor/state.js'


// ======================================================
// LCD IMAGE ANALYZER
// ======================================================
//
// Pipeline:
//
// Reference image
//   -> grayscale
//   -> Otsu threshold
//   -> LCD polarity detection
//   -> horizontal line detection
//   -> OCR preprocessing
//   -> Tesseract OCR
//   -> OCR bounding boxes
//   -> original LCD coordinates
//   -> editable editor elements
//
// OCR is performed on an enlarged copy of the LCD.
// Returned element coordinates always use the original
// logical display resolution.
//
// ======================================================


export async function analyzeReferenceImage() {
  const reference =
    editorState.reference

  if (!reference.src) {
    throw new Error(
      'No reference image is loaded.',
    )
  }

  const image =
    await loadImage(
      reference.src,
    )

  const width =
    image.naturalWidth

  const height =
    image.naturalHeight

  if (
    width < 1 ||
    height < 1
  ) {
    throw new Error(
      'Reference image has invalid dimensions.',
    )
  }

  const sourceCanvas =
    createCanvas(
      width,
      height,
    )

  const context =
    sourceCanvas.getContext(
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

  context.imageSmoothingEnabled =
    false

  context.drawImage(
    image,
    0,
    0,
    width,
    height,
  )

  const imageData =
    context.getImageData(
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

  const horizontalLines =
    detectHorizontalLines(
      binaryMask,
      width,
      height,
    )

  const ocrResult =
    await recognizeLcdText({
      image,
      width,
      height,
      threshold,
      polarity,
    })

  const textElements =
    ocrResult.regions.map(
      ocrRegionToElement,
    )

  const lineElements =
    horizontalLines.map(
      lineToElement,
    )

  const elements = [
    ...textElements,
    ...lineElements,
  ]

  elements.sort(
    sortElements,
  )

  return {
    width,
    height,

    threshold,
    polarity,

    ocrText:
      ocrResult.text,

    stats: {
      components:
        textElements.length,

      textRegions:
        textElements.length,

      detectedRegions:
        textElements.length,

      ocrWords:
        ocrResult.wordCount,

      horizontalLines:
        lineElements.length,

      elements:
        elements.length,
    },

    elements,
  }
}


// ======================================================
// IMAGE LOADING
// ======================================================


function loadImage(src) {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image()

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
    },
  )
}


function createCanvas(
  width,
  height,
) {
  const canvas =
    document.createElement(
      'canvas',
    )

  canvas.width = width
  canvas.height = height

  return canvas
}


// ======================================================
// GRAYSCALE
// ======================================================


function createGrayscale(data) {
  const pixelCount =
    data.length / 4

  const grayscale =
    new Uint8Array(
      pixelCount,
    )

  for (
    let pixel = 0;
    pixel < pixelCount;
    pixel += 1
  ) {
    const index =
      pixel * 4

    const red =
      data[index]

    const green =
      data[index + 1]

    const blue =
      data[index + 2]

    grayscale[pixel] =
      Math.round(
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


function calculateOtsuThreshold(
  grayscale,
) {
  const histogram =
    new Array(256)
      .fill(0)

  for (
    let index = 0;
    index < grayscale.length;
    index += 1
  ) {
    histogram[
      grayscale[index]
    ] += 1
  }

  const total =
    grayscale.length

  let totalIntensity = 0

  for (
    let value = 0;
    value < 256;
    value += 1
  ) {
    totalIntensity +=
      value *
      histogram[value]
  }

  let backgroundWeight = 0
  let backgroundSum = 0

  let bestThreshold = 127
  let bestVariance = -1

  for (
    let threshold = 0;
    threshold < 256;
    threshold += 1
  ) {
    backgroundWeight +=
      histogram[threshold]

    if (
      backgroundWeight === 0
    ) {
      continue
    }

    const foregroundWeight =
      total -
      backgroundWeight

    if (
      foregroundWeight === 0
    ) {
      break
    }

    backgroundSum +=
      threshold *
      histogram[threshold]

    const backgroundMean =
      backgroundSum /
      backgroundWeight

    const foregroundMean =
      (
        totalIntensity -
        backgroundSum
      ) /
      foregroundWeight

    const difference =
      backgroundMean -
      foregroundMean

    const variance =
      backgroundWeight *
      foregroundWeight *
      difference *
      difference

    if (
      variance >
      bestVariance
    ) {
      bestVariance =
        variance

      bestThreshold =
        threshold
    }
  }

  return bestThreshold
}


// ======================================================
// LCD POLARITY
// ======================================================


function detectPolarity(
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
    if (
      grayscale[index] <=
      threshold
    ) {
      darkPixels += 1
    } else {
      lightPixels += 1
    }
  }

  return (
    darkPixels <= lightPixels
      ? 'dark-on-light'
      : 'light-on-dark'
  )
}


// ======================================================
// BINARY MASK
// ======================================================


function createBinaryMask(
  grayscale,
  threshold,
  polarity,
) {
  const mask =
    new Uint8Array(
      grayscale.length,
    )

  const darkForeground =
    polarity ===
    'dark-on-light'

  for (
    let index = 0;
    index < grayscale.length;
    index += 1
  ) {
    const value =
      grayscale[index]

    const foreground =
      darkForeground
        ? value <= threshold
        : value > threshold

    mask[index] =
      foreground
        ? 1
        : 0
  }

  return mask
}


// ======================================================
// NOISE CLEANUP
// ======================================================


function removeIsolatedNoise(
  mask,
  width,
  height,
) {
  const copy =
    mask.slice()

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

      if (
        copy[index] === 0
      ) {
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
            (
              y + offsetY
            ) *
            width +
            (
              x + offsetX
            )

          neighbours +=
            copy[
              neighbourIndex
            ]
        }
      }

      if (
        neighbours === 0
      ) {
        mask[index] = 0
      }
    }
  }
}


// ======================================================
// HORIZONTAL LINE DETECTION
// ======================================================


function detectHorizontalLines(
  mask,
  width,
  height,
) {
  const candidates = []

  const minimumRun =
    Math.max(
      12,
      Math.round(
        width * 0.22,
      ),
    )

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    let runStart = -1

    for (
      let x = 0;
      x <= width;
      x += 1
    ) {
      const foreground =
        x < width
          ? (
              mask[
                y * width + x
              ] === 1
            )
          : false

      if (
        foreground &&
        runStart === -1
      ) {
        runStart = x
      }

      if (
        !foreground &&
        runStart !== -1
      ) {
        const runWidth =
          x -
          runStart

        if (
          runWidth >=
          minimumRun
        ) {
          candidates.push({
            x: runStart,
            y,
            width:
              runWidth,
            height: 1,
          })
        }

        runStart = -1
      }
    }
  }

  return mergeLineCandidates(
    candidates,
  )
}


function mergeLineCandidates(
  candidates,
) {
  if (
    candidates.length === 0
  ) {
    return []
  }

  const lines = []

  for (
    const candidate
    of candidates
  ) {
    const previous =
      lines[
        lines.length - 1
      ]

    if (!previous) {
      lines.push({
        ...candidate,
      })

      continue
    }

    const closeVertically =
      candidate.y <=
      previous.y +
      previous.height +
      1

    const similarStart =
      Math.abs(
        candidate.x -
        previous.x,
      ) <= 3

    const similarWidth =
      Math.abs(
        candidate.width -
        previous.width,
      ) <= 5

    if (
      closeVertically &&
      similarStart &&
      similarWidth
    ) {
      const bottom =
        Math.max(
          previous.y +
          previous.height,

          candidate.y +
          candidate.height,
        )

      previous.x =
        Math.min(
          previous.x,
          candidate.x,
        )

      previous.width =
        Math.max(
          previous.width,
          candidate.width,
        )

      previous.height =
        bottom -
        previous.y

      continue
    }

    lines.push({
      ...candidate,
    })
  }

  return lines.filter(
    (line) =>
      line.height <= 5,
  )
}


// ======================================================
// OCR
// ======================================================


async function recognizeLcdText({
  image,
  width,
  height,
  threshold,
  polarity,
}) {
  const scale =
    chooseOcrScale(
      width,
      height,
    )

  const ocrCanvas =
    createOcrCanvas({
      image,
      width,
      height,
      scale,
      threshold,
      polarity,
    })

  let worker = null

  try {
    worker =
      await createWorker(
        'eng',
        1,
        {
          logger: (message) => {
            if (
              message?.status
            ) {
              console.debug(
                '[LCD OCR]',
                message.status,
                message.progress ?? '',
              )
            }
          },
        },
      )

    await worker.setParameters({
      tessedit_pageseg_mode:
        PSM.SPARSE_TEXT,

      preserve_interword_spaces:
        '1',

      user_defined_dpi:
        '300',
    })

    const result =
      await worker.recognize(
        ocrCanvas,
        {},
        {
          text: true,
          blocks: true,
        },
      )

    const text =
      cleanOcrText(
        result.data?.text ?? '',
      )

    console.log(
      '[LCD OCR TEXT]',
      text,
    )

    const words =
      extractWordsFromBlocks(
        result.data?.blocks ?? [],
        scale,
        width,
        height,
      )

    console.log(
      '[LCD OCR WORDS]',
      words,
    )

    const regions =
      mergeWordsIntoTextRegions(
        words,
        width,
        height,
      )

    return {
      text,
      words,
      regions,

      wordCount:
        words.length,
    }
  } catch (error) {
    console.error(
      'LCD OCR failed:',
      error,
    )

    throw new Error(
      'OCR could not analyze the LCD text. Check the browser console for details.',
    )
  } finally {
    if (worker) {
      await worker.terminate()
    }
  }
}


// ======================================================
// OCR SCALE
// ======================================================


function chooseOcrScale(
  width,
  height,
) {
  const longestSide =
    Math.max(
      width,
      height,
    )

  if (
    longestSide <= 320
  ) {
    return 6
  }

  if (
    longestSide <= 640
  ) {
    return 4
  }

  if (
    longestSide <= 1200
  ) {
    return 2
  }

  return 1
}


// ======================================================
// OCR PREPROCESSING
// ======================================================


function createOcrCanvas({
  image,
  width,
  height,
  scale,
  threshold,
  polarity,
}) {
  const canvas =
    createCanvas(
      width * scale,
      height * scale,
    )

  const context =
    canvas.getContext(
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
   * Pixel LCD screenshots should not be blurred
   * while being enlarged.
   */
  context.imageSmoothingEnabled =
    false

  context.drawImage(
    image,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  const imageData =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    )

  const data =
    imageData.data

  const darkForeground =
    polarity ===
    'dark-on-light'

  /*
   * Tesseract works more consistently when
   * foreground text is black and background
   * is white.
   */
  for (
    let index = 0;
    index < data.length;
    index += 4
  ) {
    const gray =
      Math.round(
        data[index] * 0.299 +
        data[index + 1] * 0.587 +
        data[index + 2] * 0.114,
      )

    const foreground =
      darkForeground
        ? gray <= threshold
        : gray > threshold

    const output =
      foreground
        ? 0
        : 255

    data[index] =
      output

    data[index + 1] =
      output

    data[index + 2] =
      output

    data[index + 3] =
      255
  }

  context.putImageData(
    imageData,
    0,
    0,
  )

  return canvas
}


// ======================================================
// OCR TSV PARSER
// ======================================================


function extractWordsFromBlocks(
  blocks,
  scale,
  originalWidth,
  originalHeight,
) {
  const words = []

  for (
    const block
    of blocks
  ) {
    const paragraphs =
      block?.paragraphs ?? []

    for (
      const paragraph
      of paragraphs
    ) {
      const lines =
        paragraph?.lines ?? []

      for (
        const line
        of lines
      ) {
        const lineWords =
          line?.words ?? []

        for (
          const word
          of lineWords
        ) {
          const text =
            sanitizeRecognizedText(
              word?.text ?? '',
            )

          if (!text) {
            continue
          }

          const confidence =
            Number(
              word?.confidence ?? 0,
            )

          /*
           * Pixel LCD characters often receive
           * lower confidence than normal fonts.
           */
          if (
            !Number.isFinite(
              confidence,
            ) ||
            confidence < 15
          ) {
            continue
          }

          const bbox =
            word?.bbox

          if (!bbox) {
            continue
          }

          const rawX0 =
            Number(
              bbox.x0,
            )

          const rawY0 =
            Number(
              bbox.y0,
            )

          const rawX1 =
            Number(
              bbox.x1,
            )

          const rawY1 =
            Number(
              bbox.y1,
            )

          if (
            ![
              rawX0,
              rawY0,
              rawX1,
              rawY1,
            ].every(
              Number.isFinite,
            )
          ) {
            continue
          }

          const x =
            clamp(
              Math.round(
                rawX0 /
                scale,
              ),
              0,
              originalWidth - 1,
            )

          const y =
            clamp(
              Math.round(
                rawY0 /
                scale,
              ),
              0,
              originalHeight - 1,
            )

          const width =
            Math.max(
              1,

              Math.round(
                (
                  rawX1 -
                  rawX0
                ) /
                scale,
              ),
            )

          const height =
            Math.max(
              1,

              Math.round(
                (
                  rawY1 -
                  rawY0
                ) /
                scale,
              ),
            )

          words.push({
            text,

            confidence,

            x,
            y,

            width:
              Math.min(
                width,
                originalWidth - x,
              ),

            height:
              Math.min(
                height,
                originalHeight - y,
              ),
          })
        }
      }
    }
  }

  return words
}

// ======================================================
// OCR TEXT CLEANUP
// ======================================================


function cleanOcrText(
  value,
) {
  return String(value)
    .replace(
      /\r/g,
      '',
    )
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


function sanitizeRecognizedText(
  value,
) {
  return String(value)
    .replace(
      /\s+/g,
      ' ',
    )
    .trim()
}


// ======================================================
// MERGE OCR WORDS INTO EDITABLE TEXT REGIONS
// ======================================================


function mergeWordsIntoTextRegions(
  words,
  displayWidth,
  displayHeight,
) {
  if (
    words.length === 0
  ) {
    return []
  }

  const sorted =
    [...words]
      .sort(
        (a, b) => {
          const centerA =
            a.y +
            a.height / 2

          const centerB =
            b.y +
            b.height / 2

          if (
            Math.abs(
              centerA -
              centerB,
            ) > 3
          ) {
            return (
              centerA -
              centerB
            )
          }

          return (
            a.x -
            b.x
          )
        },
      )

  const rows = []

  for (
    const word
    of sorted
  ) {
    const centerY =
      word.y +
      word.height / 2

    let bestRow = null
    let bestDistance =
      Infinity

    for (
      const row
      of rows
    ) {
      const distance =
        Math.abs(
          row.centerY -
          centerY,
        )

      const tolerance =
        Math.max(
          3,

          Math.min(
            row.averageHeight,
            word.height,
          ) *
          0.7,
        )

      if (
        distance <=
          tolerance &&
        distance <
          bestDistance
      ) {
        bestRow = row

        bestDistance =
          distance
      }
    }

    if (!bestRow) {
      rows.push({
        centerY,

        averageHeight:
          word.height,

        words: [
          word,
        ],
      })

      continue
    }

    bestRow.words.push(
      word,
    )

    bestRow.centerY =
      bestRow.words
        .reduce(
          (
            total,
            item,
          ) => {
            return (
              total +
              item.y +
              item.height / 2
            )
          },
          0,
        ) /
      bestRow.words.length

    bestRow.averageHeight =
      bestRow.words
        .reduce(
          (
            total,
            item,
          ) => {
            return (
              total +
              item.height
            )
          },
          0,
        ) /
      bestRow.words.length
  }

  const regions = []

  for (
    const row
    of rows
  ) {
    const rowWords =
      [...row.words]
        .sort(
          (a, b) =>
            a.x -
            b.x,
        )

    let current = null

    for (
      const word
      of rowWords
    ) {
      if (!current) {
        current =
          createTextRegion(
            word,
          )

        continue
      }

      const currentRight =
        current.x +
        current.width

      const gap =
        word.x -
        currentRight

      const maximumGap =
        Math.max(
          3,

          Math.round(
            Math.max(
              current.height,
              word.height,
            ) *
            1.25,
          ),
        )

      if (
        gap <=
        maximumGap
      ) {
        mergeWordIntoRegion(
          current,
          word,
        )
      } else {
        regions.push(
          current,
        )

        current =
          createTextRegion(
            word,
          )
      }
    }

    if (current) {
      regions.push(
        current,
      )
    }
  }

  return regions.map(
    (region) => {
      const x =
        clamp(
          region.x,
          0,
          displayWidth - 1,
        )

      const y =
        clamp(
          region.y,
          0,
          displayHeight - 1,
        )

      return {
        ...region,

        x,
        y,

        width:
          Math.max(
            1,

            Math.min(
              region.width,
              displayWidth - x,
            ),
          ),

        height:
          Math.max(
            1,

            Math.min(
              region.height,
              displayHeight - y,
            ),
          ),
      }
    },
  )
}


function createTextRegion(
  word,
) {
  return {
    x:
      word.x,

    y:
      word.y,

    width:
      word.width,

    height:
      word.height,

    text:
      word.text,

    confidence:
      word.confidence,

    wordCount: 1,
  }
}


function mergeWordIntoRegion(
  region,
  word,
) {
  const right =
    Math.max(
      region.x +
      region.width,

      word.x +
      word.width,
    )

  const bottom =
    Math.max(
      region.y +
      region.height,

      word.y +
      word.height,
    )

  const top =
    Math.min(
      region.y,
      word.y,
    )

  region.text =
    `${region.text} ${word.text}`

  region.confidence =
    (
      region.confidence *
      region.wordCount +
      word.confidence
    ) /
    (
      region.wordCount + 1
    )

  region.y =
    top

  region.width =
    right -
    region.x

  region.height =
    bottom -
    top

  region.wordCount += 1
}


// ======================================================
// EDITOR ELEMENT CONVERSION
// ======================================================


function ocrRegionToElement(
  region,
) {
  const fontSize =
    Math.max(
      5,

      Math.round(
        region.height *
        1.05,
      ),
    )

  return {
    type:
      'text',

    name:
      'OCR Text',

    x:
      region.x,

    y:
      region.y,

    width:
      Math.max(
        8,
        region.width,
      ),

    height:
      Math.max(
        6,
        region.height,
      ),

    text:
      region.text,

    fontSize,

    fontFamily:
      'monospace',

    fontWeight:
      700,

    color:
      '#a8d9a8',

    confidence:
      Math.round(
        region.confidence,
      ),

    source:
      'analysis',
  }
}


function lineToElement(
  line,
) {
  return {
    type:
      'line',

    name:
      'Detected Line',

    x:
      line.x,

    y:
      line.y,

    width:
      Math.max(
        1,
        line.width,
      ),

    height:
      Math.max(
        3,
        line.height + 2,
      ),

    color:
      '#a8d9a8',

    strokeWidth:
      Math.max(
        1,
        line.height,
      ),

    source:
      'analysis',
  }
}


// ======================================================
// SORTING
// ======================================================


function sortElements(
  a,
  b,
) {
  if (
    Math.abs(
      a.y -
      b.y,
    ) > 3
  ) {
    return (
      a.y -
      b.y
    )
  }

  return (
    a.x -
    b.x
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