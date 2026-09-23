import {
  editorState,
} from '../editor/state.js'


// ======================================================
// LCD IMAGE ANALYZER
// ======================================================
//
// First-stage, browser-local analyzer.
//
// Responsibilities:
// - Load the reference image
// - Convert pixels to grayscale
// - Estimate light/dark polarity
// - Build a binary foreground mask
// - Detect horizontal divider lines
// - Detect connected foreground components
// - Merge nearby components into text-like regions
//
// It deliberately does NOT pretend to perform OCR.
// Text-like regions are returned as editable placeholders.
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

  const canvas =
    document.createElement(
      'canvas',
    )

  canvas.width = width
  canvas.height = height

  const context =
    canvas.getContext(
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

  const mask =
    createBinaryMask(
      grayscale,
      threshold,
      polarity,
    )

  removeIsolatedNoise(
    mask,
    width,
    height,
  )

  const horizontalLines =
    detectHorizontalLines(
      mask,
      width,
      height,
    )

  const lineMask =
    createLineMask(
      width,
      height,
      horizontalLines,
    )

  const components =
    findConnectedComponents(
      mask,
      lineMask,
      width,
      height,
    )

  const usefulComponents =
    filterComponents(
      components,
      width,
      height,
    )

  const textRegions =
    mergeIntoTextRegions(
      usefulComponents,
      width,
      height,
    )

  const elements = [
    ...horizontalLines.map(
      lineToElement,
    ),

    ...textRegions.map(
      regionToElement,
    ),
  ]

  elements.sort(
    (a, b) => {
      if (
        Math.abs(a.y - b.y) >
        3
      ) {
        return a.y - b.y
      }

      return a.x - b.x
    },
  )

  return {
    width,
    height,

    threshold,
    polarity,

    stats: {
      components:
        usefulComponents.length,

      textRegions:
        textRegions.length,

      horizontalLines:
        horizontalLines.length,

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
            'Reference image could not be read by the analyzer.',
          ),
        )
      }

      image.src = src
    },
  )
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
    new Array(256).fill(0)

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
// POLARITY
// ======================================================

function detectPolarity(
  grayscale,
  threshold,
) {
  let dark = 0
  let light = 0

  for (
    let index = 0;
    index < grayscale.length;
    index += 1
  ) {
    if (
      grayscale[index] <=
      threshold
    ) {
      dark += 1
    } else {
      light += 1
    }
  }

  /*
   * LCD screenshots normally have
   * relatively few foreground pixels.
   *
   * Whichever side is less common is
   * considered foreground.
   */

  return dark <= light
    ? 'dark-on-light'
    : 'light-on-dark'
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
// SIMPLE NOISE CLEANUP
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
// HORIZONTAL LINES
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
          ? mask[
              y * width + x
            ] === 1
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
          x - runStart

        if (
          runWidth >=
          minimumRun
        ) {
          candidates.push({
            x: runStart,
            y,
            width:
              runWidth,
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
  const lines = []

  for (
    const candidate
    of candidates
  ) {
    const previous =
      lines[
        lines.length - 1
      ]

    const similarX =
      previous &&
      Math.abs(
        previous.x -
        candidate.x,
      ) <= 3

    const similarWidth =
      previous &&
      Math.abs(
        previous.width -
        candidate.width,
      ) <= 5

    const adjacentY =
      previous &&
      candidate.y <=
        previous.y +
        previous.height +
        1

    if (
      previous &&
      similarX &&
      similarWidth &&
      adjacentY
    ) {
      previous.height =
        candidate.y -
        previous.y +
        1

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

      continue
    }

    lines.push({
      x:
        candidate.x,

      y:
        candidate.y,

      width:
        candidate.width,

      height: 1,
    })
  }

  return lines.filter(
    (line) =>
      line.height <= 5,
  )
}


function createLineMask(
  width,
  height,
  lines,
) {
  const lineMask =
    new Uint8Array(
      width * height,
    )

  for (
    const line
    of lines
  ) {
    const startY =
      Math.max(
        0,
        line.y - 1,
      )

    const endY =
      Math.min(
        height - 1,
        line.y +
        line.height,
      )

    const startX =
      Math.max(
        0,
        line.x,
      )

    const endX =
      Math.min(
        width - 1,
        line.x +
        line.width,
      )

    for (
      let y = startY;
      y <= endY;
      y += 1
    ) {
      for (
        let x = startX;
        x <= endX;
        x += 1
      ) {
        lineMask[
          y * width + x
        ] = 1
      }
    }
  }

  return lineMask
}


// ======================================================
// CONNECTED COMPONENTS
// ======================================================

function findConnectedComponents(
  mask,
  lineMask,
  width,
  height,
) {
  const visited =
    new Uint8Array(
      width * height,
    )

  const components = []

  const directions = [
    [-1, -1],
    [0, -1],
    [1, -1],

    [-1, 0],
    [1, 0],

    [-1, 1],
    [0, 1],
    [1, 1],
  ]

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      const startIndex =
        y * width + x

      if (
        visited[
          startIndex
        ] ||
        mask[
          startIndex
        ] === 0 ||
        lineMask[
          startIndex
        ] === 1
      ) {
        continue
      }

      const stack = [
        [x, y],
      ]

      visited[
        startIndex
      ] = 1

      let minX = x
      let maxX = x

      let minY = y
      let maxY = y

      let pixels = 0

      while (
        stack.length > 0
      ) {
        const [
          currentX,
          currentY,
        ] = stack.pop()

        pixels += 1

        minX =
          Math.min(
            minX,
            currentX,
          )

        maxX =
          Math.max(
            maxX,
            currentX,
          )

        minY =
          Math.min(
            minY,
            currentY,
          )

        maxY =
          Math.max(
            maxY,
            currentY,
          )

        for (
          const [
            offsetX,
            offsetY,
          ]
          of directions
        ) {
          const nextX =
            currentX +
            offsetX

          const nextY =
            currentY +
            offsetY

          if (
            nextX < 0 ||
            nextX >= width ||
            nextY < 0 ||
            nextY >= height
          ) {
            continue
          }

          const nextIndex =
            nextY *
            width +
            nextX

          if (
            visited[
              nextIndex
            ] ||
            mask[
              nextIndex
            ] === 0 ||
            lineMask[
              nextIndex
            ] === 1
          ) {
            continue
          }

          visited[
            nextIndex
          ] = 1

          stack.push([
            nextX,
            nextY,
          ])
        }
      }

      components.push({
        x:
          minX,

        y:
          minY,

        width:
          maxX -
          minX +
          1,

        height:
          maxY -
          minY +
          1,

        pixels,
      })
    }
  }

  return components
}


// ======================================================
// COMPONENT FILTER
// ======================================================

function filterComponents(
  components,
  width,
  height,
) {
  const maximumArea =
    width *
    height *
    0.25

  return components.filter(
    (component) => {
      const area =
        component.width *
        component.height

      if (
        component.pixels < 2
      ) {
        return false
      }

      if (
        area >
        maximumArea
      ) {
        return false
      }

      if (
        component.width >=
          width * 0.8 &&
        component.height >=
          height * 0.8
      ) {
        return false
      }

      return true
    },
  )
}


// ======================================================
// TEXT REGION MERGING
// ======================================================

function mergeIntoTextRegions(
  components,
  width,
  height,
) {
  if (
    components.length === 0
  ) {
    return []
  }

  const sorted =
    [...components]
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
            ) > 4
          ) {
            return (
              centerA -
              centerB
            )
          }

          return a.x - b.x
        },
      )

  const rows = []

  for (
    const component
    of sorted
  ) {
    const centerY =
      component.y +
      component.height / 2

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
            component.height,
          ) *
          0.65,
        )

      if (
        distance <=
          tolerance &&
        distance <
          bestDistance
      ) {
        bestDistance =
          distance

        bestRow = row
      }
    }

    if (!bestRow) {
      rows.push({
        centerY,
        averageHeight:
          component.height,

        components: [
          component,
        ],
      })

      continue
    }

    bestRow.components.push(
      component,
    )

    bestRow.centerY =
      bestRow.components
        .reduce(
          (
            total,
            item,
          ) =>
            total +
            item.y +
            item.height / 2,
          0,
        ) /
      bestRow.components.length

    bestRow.averageHeight =
      bestRow.components
        .reduce(
          (
            total,
            item,
          ) =>
            total +
            item.height,
          0,
        ) /
      bestRow.components.length
  }

  const regions = []

  for (
    const row
    of rows
  ) {
    const rowComponents =
      [...row.components]
        .sort(
          (a, b) =>
            a.x - b.x,
        )

    let current = null

    for (
      const component
      of rowComponents
    ) {
      if (!current) {
        current =
          createRegion(
            component,
          )

        continue
      }

      const currentRight =
        current.x +
        current.width

      const gap =
        component.x -
        currentRight

      const typicalHeight =
        Math.max(
          current.height,
          component.height,
        )

      /*
       * Character spacing can be relatively
       * large in low-resolution LCD fonts.
       */

      const maximumGap =
        Math.max(
          3,
          Math.round(
            typicalHeight *
            0.85,
          ),
        )

      if (
        gap <= maximumGap
      ) {
        expandRegion(
          current,
          component,
        )
      } else {
        regions.push(
          current,
        )

        current =
          createRegion(
            component,
          )
      }
    }

    if (current) {
      regions.push(
        current,
      )
    }
  }

  return regions
    .filter(
      (region) => {
        if (
          region.width < 2 ||
          region.height < 2
        ) {
          return false
        }

        if (
          region.width >
            width * 0.95 &&
          region.height >
            height * 0.5
        ) {
          return false
        }

        return true
      },
    )
    .map(
      (region) => {
        const padding = 1

        const x =
          Math.max(
            0,
            region.x -
            padding,
          )

        const y =
          Math.max(
            0,
            region.y -
            padding,
          )

        const right =
          Math.min(
            width,
            region.x +
            region.width +
            padding,
          )

        const bottom =
          Math.min(
            height,
            region.y +
            region.height +
            padding,
          )

        return {
          x,
          y,

          width:
            right - x,

          height:
            bottom - y,

          componentCount:
            region.componentCount,
        }
      },
    )
}


function createRegion(
  component,
) {
  return {
    x:
      component.x,

    y:
      component.y,

    width:
      component.width,

    height:
      component.height,

    componentCount: 1,
  }
}


function expandRegion(
  region,
  component,
) {
  const right =
    Math.max(
      region.x +
      region.width,

      component.x +
      component.width,
    )

  const bottom =
    Math.max(
      region.y +
      region.height,

      component.y +
      component.height,
    )

  region.x =
    Math.min(
      region.x,
      component.x,
    )

  region.y =
    Math.min(
      region.y,
      component.y,
    )

  region.width =
    right -
    region.x

  region.height =
    bottom -
    region.y

  region.componentCount += 1
}


// ======================================================
// EDITOR ELEMENT CONVERSION
// ======================================================

function lineToElement(
  line,
) {
  return {
    type: 'line',

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


function regionToElement(
  region,
) {
  const fontSize =
    Math.max(
      5,
      Math.round(
        region.height *
        0.9,
      ),
    )

  return {
    type: 'text',

    name:
      'Detected Text',

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

    /*
     * OCR will replace this later.
     */
    text:
      'TEXT',

    fontSize,

    fontFamily:
      'monospace',

    fontWeight: 700,

    color:
      '#a8d9a8',

    source:
      'analysis',
  }
}