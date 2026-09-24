import { sortOcrWords } from './ocrExtractor.js'

// ======================================================
// LCD OCR REGIONS
// ======================================================
//
// Converts fused OCR word candidates into editable
// text regions.
//
// Responsibilities:
// - Group words into physical text rows
// - Suppress remaining duplicate words
// - Decide whether neighbouring words belong together
// - Merge words into editable text regions
// - Build readable debug OCR text
//
// Tesseract execution does NOT belong here.
// OCR candidate fusion does NOT belong here.
// ======================================================

// ======================================================
// PUBLIC API
// ======================================================

export function mergeWordsIntoTextRegions(words) {
  if (
    !Array.isArray(words) ||
    words.length === 0
  ) {
    return []
  }

  const usableWords = words
    .filter(isUsableWord)
    .sort(sortOcrWords)

  if (usableWords.length === 0) {
    return []
  }

  const rows =
    groupWordsIntoRows(
      usableWords,
    )

  const regions = []

  for (const row of rows) {
    const rowWords =
      suppressRowDuplicates(
        row.words,
      )

    if (rowWords.length === 0) {
      continue
    }

    rowWords.sort(
      (first, second) =>
        first.x - second.x,
    )

    let currentRegion = null

    for (const word of rowWords) {
      if (!currentRegion) {
        currentRegion =
          createTextRegion(word)

        continue
      }

      const maximumGap =
        calculateMaximumWordGap(
          currentRegion,
          word,
        )

      const currentRight =
        currentRegion.x +
        currentRegion.width

      const gap =
        word.x -
        currentRight

      const verticallyCompatible =
        areVerticallyCompatible(
          currentRegion,
          word,
        )

      /*
       * Negative gap means OCR boxes overlap.
       * A small positive gap means normal word spacing.
       *
       * Large gaps should remain separate editable
       * elements. This is especially important for
       * status rows such as:
       *
       *   23°C                    12:30
       */

      if (
        verticallyCompatible &&
        gap <= maximumGap
      ) {
        mergeWordIntoRegion(
          currentRegion,
          word,
        )

        continue
      }

      regions.push(
        finalizeTextRegion(
          currentRegion,
        ),
      )

      currentRegion =
        createTextRegion(word)
    }

    if (currentRegion) {
      regions.push(
        finalizeTextRegion(
          currentRegion,
        ),
      )
    }
  }

  return regions
    .filter(isUsefulRegion)
    .sort(sortRegions)
}

// ======================================================
// WORD VALIDATION
// ======================================================

function isUsableWord(word) {
  if (!word) {
    return false
  }

  const text =
    normalizeVisibleText(
      word.text,
    )

  if (!text) {
    return false
  }

  const x =
    Number(word.x)

  const y =
    Number(word.y)

  const width =
    Number(word.width)

  const height =
    Number(word.height)

  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height)
  ) {
    return false
  }

  if (
    width <= 0 ||
    height <= 0
  ) {
    return false
  }

  return true
}

// ======================================================
// ROW GROUPING
// ======================================================

function groupWordsIntoRows(words) {
  const rows = []

  for (const word of words) {
    const wordCenterY =
      getCenterY(word)

    let bestRow = null
    let bestDistance = Infinity

    for (const row of rows) {
      const distance =
        Math.abs(
          wordCenterY -
          row.centerY,
        )

      const tolerance =
        Math.max(
          2,
          Math.min(
            word.height,
            row.averageHeight,
          ) * 0.65,
        )

      if (
        distance <= tolerance &&
        distance < bestDistance
      ) {
        bestDistance = distance
        bestRow = row
      }
    }

    if (!bestRow) {
      rows.push({
        centerY: wordCenterY,
        averageHeight:
          word.height,

        words: [
          word,
        ],
      })

      continue
    }

    bestRow.words.push(word)

    recalculateRowGeometry(
      bestRow,
    )
  }

  rows.sort(
    (first, second) =>
      first.centerY -
      second.centerY,
  )

  return rows
}

function recalculateRowGeometry(row) {
  if (
    !row ||
    row.words.length === 0
  ) {
    return
  }

  let centerTotal = 0
  let heightTotal = 0

  for (const word of row.words) {
    centerTotal +=
      getCenterY(word)

    heightTotal +=
      word.height
  }

  row.centerY =
    centerTotal /
    row.words.length

  row.averageHeight =
    heightTotal /
    row.words.length
}

// ======================================================
// ROW DUPLICATE SUPPRESSION
// ======================================================

function suppressRowDuplicates(words) {
  if (words.length <= 1) {
    return [...words]
  }

  /*
   * Stronger fused candidates enter first.
   * Lower-scoring duplicates at the same physical
   * location are discarded.
   */

  const ordered =
    [...words].sort(
      (first, second) => {
        const scoreDifference =
          getWordScore(second) -
          getWordScore(first)

        if (
          Math.abs(
            scoreDifference,
          ) > 0.001
        ) {
          return scoreDifference
        }

        return (
          second.width -
          first.width
        )
      },
    )

  const accepted = []

  for (const candidate of ordered) {
    let duplicate = false

    for (const existing of accepted) {
      if (
        isDuplicateRowWord(
          candidate,
          existing,
        )
      ) {
        duplicate = true
        break
      }
    }

    if (!duplicate) {
      accepted.push(candidate)
    }
  }

  return accepted.sort(
    (first, second) =>
      first.x - second.x,
  )
}

function isDuplicateRowWord(
  first,
  second,
) {
  const intersection =
    calculateIntersection(
      first,
      second,
    )

  if (
    intersection.area <= 0
  ) {
    return false
  }

  const firstArea =
    Math.max(
      1,
      first.width *
        first.height,
    )

  const secondArea =
    Math.max(
      1,
      second.width *
        second.height,
    )

  const smallerArea =
    Math.min(
      firstArea,
      secondArea,
    )

  const coverage =
    intersection.area /
    smallerArea

  const union =
    firstArea +
    secondArea -
    intersection.area

  const iou =
    intersection.area /
    Math.max(
      1,
      union,
    )

  const heightRatio =
    Math.min(
      first.height,
      second.height,
    ) /
    Math.max(
      1,
      Math.max(
        first.height,
        second.height,
      ),
    )

  const centerDistance =
    Math.abs(
      getCenterY(first) -
      getCenterY(second),
    )

  const verticallyAligned =
    centerDistance <=
    Math.max(
      2,
      Math.max(
        first.height,
        second.height,
      ) * 0.35,
    )

  if (
    !verticallyAligned ||
    heightRatio < 0.55
  ) {
    return false
  }

  const firstText =
    normalizeComparisonText(
      first.text,
    )

  const secondText =
    normalizeComparisonText(
      second.text,
    )

  const similarity =
    calculateTextSimilarity(
      firstText,
      secondText,
    )

  /*
   * Same or very similar text occupying the same
   * physical location is definitely a duplicate.
   */

  if (
    similarity >= 0.72 &&
    (
      iou >= 0.42 ||
      coverage >= 0.78
    )
  ) {
    return true
  }

  /*
   * A tiny weak OCR fragment fully inside a much
   * stronger word is usually segmentation noise.
   *
   * Example:
   *
   *   SATIS
   *      IS
   *
   * or:
   *
   *   23°C
   *      I
   */

  const firstWeak =
    isWeakFragment(first)

  const secondWeak =
    isWeakFragment(second)

  if (
    coverage >= 0.88
  ) {
    if (
      firstWeak &&
      getWordScore(first) <
        getWordScore(second)
    ) {
      return true
    }

    if (
      secondWeak &&
      getWordScore(second) <
        getWordScore(first)
    ) {
      return true
    }
  }

  return false
}

// ======================================================
// REGION CREATION
// ======================================================

function createTextRegion(word) {
  return {
    text:
      normalizeVisibleText(
        word.text,
      ),

    x: word.x,
    y: word.y,

    width:
      word.width,

    height:
      word.height,

    confidence:
      Number(
        word.confidence,
      ) || 0,

    fusionScore:
      Number(
        word.fusionScore,
      ) || 0,

    support:
      Number(
        word.support,
      ) || 1,

    sourceSupport:
      Number(
        word.sourceSupport,
      ) || 1,

    wordCount: 1,

    words: [
      word,
    ],
  }
}

// ======================================================
// REGION MERGING
// ======================================================

function mergeWordIntoRegion(
  region,
  word,
) {
  const oldRight =
    region.x +
    region.width

  const oldBottom =
    region.y +
    region.height

  const wordRight =
    word.x +
    word.width

  const wordBottom =
    word.y +
    word.height

  const gap =
    word.x -
    oldRight

  const separator =
    chooseWordSeparator(
      region,
      word,
      gap,
    )

  region.text =
    `${region.text}${separator}${normalizeVisibleText(word.text)}`

  const left =
    Math.min(
      region.x,
      word.x,
    )

  const top =
    Math.min(
      region.y,
      word.y,
    )

  const right =
    Math.max(
      oldRight,
      wordRight,
    )

  const bottom =
    Math.max(
      oldBottom,
      wordBottom,
    )

  region.x = left
  region.y = top

  region.width =
    right - left

  region.height =
    bottom - top

  const previousCount =
    region.wordCount

  region.wordCount += 1

  region.confidence =
    (
      region.confidence *
        previousCount +
      (
        Number(
          word.confidence,
        ) || 0
      )
    ) /
    region.wordCount

  region.fusionScore =
    Math.max(
      region.fusionScore,
      Number(
        word.fusionScore,
      ) || 0,
    )

  region.support =
    Math.max(
      region.support,
      Number(
        word.support,
      ) || 1,
    )

  region.sourceSupport =
    Math.max(
      region.sourceSupport,
      Number(
        word.sourceSupport,
      ) || 1,
    )

  region.words.push(word)
}

function chooseWordSeparator(
  region,
  word,
  gap,
) {
  const previousText =
    region.text

  const nextText =
    normalizeVisibleText(
      word.text,
    )

  if (
    !previousText ||
    !nextText
  ) {
    return ''
  }

  /*
   * Overlapping boxes are usually pieces of the same
   * visual token. Avoid introducing a synthetic space.
   */

  if (gap <= 0) {
    return ''
  }

  /*
   * Punctuation should normally attach to the previous
   * token rather than becoming:
   *
   *   23 ° C
   *   12 : 30
   */

  if (
    /^[.,:;%°)\]]/u.test(
      nextText,
    )
  ) {
    return ''
  }

  /*
   * Opening punctuation should attach to what follows.
   */

  if (
    /[(\[]$/u.test(
      previousText,
    )
  ) {
    return ''
  }

  return ' '
}

// ======================================================
// WORD GAP
// ======================================================

function calculateMaximumWordGap(
  region,
  word,
) {
  const referenceHeight =
    Math.max(
      1,
      Math.min(
        region.height,
        word.height,
      ),
    )

  /*
   * Keep this conservative.
   *
   * We want:
   *
   *   SATIS OTOMATI HAZIR
   *
   * to become one editable text region when words are
   * naturally close, while:
   *
   *   23°C                 12:30
   *
   * should remain two separate regions.
   */

  return Math.max(
    2,
    Math.min(
      10,
      referenceHeight * 0.9,
    ),
  )
}

// ======================================================
// VERTICAL COMPATIBILITY
// ======================================================

function areVerticallyCompatible(
  first,
  second,
) {
  const centerDifference =
    Math.abs(
      getCenterY(first) -
      getCenterY(second),
    )

  const minimumHeight =
    Math.max(
      1,
      Math.min(
        first.height,
        second.height,
      ),
    )

  const maximumHeight =
    Math.max(
      first.height,
      second.height,
    )

  const heightRatio =
    minimumHeight /
    Math.max(
      1,
      maximumHeight,
    )

  return (
    heightRatio >= 0.5 &&
    centerDifference <=
      Math.max(
        2,
        maximumHeight * 0.5,
      )
  )
}

// ======================================================
// FINAL REGION CLEANUP
// ======================================================

function finalizeTextRegion(region) {
  const text =
    normalizeRegionText(
      region.text,
    )

  return {
    text,

    x:
      roundCoordinate(
        region.x,
      ),

    y:
      roundCoordinate(
        region.y,
      ),

    width:
      Math.max(
        1,
        roundCoordinate(
          region.width,
        ),
      ),

    height:
      Math.max(
        1,
        roundCoordinate(
          region.height,
        ),
      ),

    confidence:
      roundScore(
        region.confidence,
      ),

    fusionScore:
      roundScore(
        region.fusionScore,
      ),

    support:
      region.support,

    sourceSupport:
      region.sourceSupport,

    wordCount:
      region.wordCount,
  }
}

function isUsefulRegion(region) {
  if (!region) {
    return false
  }

  if (
    !region.text ||
    region.width <= 0 ||
    region.height <= 0
  ) {
    return false
  }

  /*
   * Reject regions containing no useful visible
   * alphanumeric or LCD punctuation.
   */

  return /[\p{L}\p{N}.:,;%°/+\-]/u.test(
    region.text,
  )
}

// ======================================================
// DEBUG / FINAL OCR TEXT
// ======================================================

export function buildOcrText(
  regions,
) {
  if (
    !Array.isArray(regions) ||
    regions.length === 0
  ) {
    return ''
  }

  const sorted =
    [...regions]
      .filter(isUsefulRegion)
      .sort(sortRegions)

  if (sorted.length === 0) {
    return ''
  }

  const rows = []

  for (const region of sorted) {
    const centerY =
      getCenterY(region)

    let bestRow = null
    let bestDistance = Infinity

    for (const row of rows) {
      const distance =
        Math.abs(
          centerY -
          row.centerY,
        )

      const tolerance =
        Math.max(
          2,
          Math.min(
            region.height,
            row.averageHeight,
          ) * 0.65,
        )

      if (
        distance <= tolerance &&
        distance < bestDistance
      ) {
        bestRow = row
        bestDistance = distance
      }
    }

    if (!bestRow) {
      rows.push({
        centerY,
        averageHeight:
          region.height,

        regions: [
          region,
        ],
      })

      continue
    }

    bestRow.regions.push(
      region,
    )

    let centerTotal = 0
    let heightTotal = 0

    for (
      const rowRegion
      of bestRow.regions
    ) {
      centerTotal +=
        getCenterY(
          rowRegion,
        )

      heightTotal +=
        rowRegion.height
    }

    bestRow.centerY =
      centerTotal /
      bestRow.regions.length

    bestRow.averageHeight =
      heightTotal /
      bestRow.regions.length
  }

  rows.sort(
    (first, second) =>
      first.centerY -
      second.centerY,
  )

  return rows
    .map((row) => {
      row.regions.sort(
        (first, second) =>
          first.x -
          second.x,
      )

      return row.regions
        .map(
          (region) =>
            region.text,
        )
        .join(' ')
        .trim()
    })
    .filter(Boolean)
    .join('\n')
}

// ======================================================
// WEAK FRAGMENT DETECTION
// ======================================================

function isWeakFragment(word) {
  const text =
    normalizeVisibleText(
      word.text,
    )

  if (!text) {
    return true
  }

  const alphanumericCount =
    (
      text.match(
        /[\p{L}\p{N}]/gu,
      ) ?? []
    ).length

  const usefulSymbolCount =
    (
      text.match(
        /[.:,;%°/+\-]/gu,
      ) ?? []
    ).length

  if (
    text.length === 1 &&
    alphanumericCount === 1 &&
    usefulSymbolCount === 0
  ) {
    return true
  }

  if (
    text.length <= 2 &&
    alphanumericCount === 0
  ) {
    return true
  }

  return false
}

// ======================================================
// WORD SCORE
// ======================================================

function getWordScore(word) {
  if (
    Number.isFinite(
      word.fusionScore,
    )
  ) {
    return word.fusionScore
  }

  if (
    Number.isFinite(
      word.confidence,
    )
  ) {
    return word.confidence
  }

  return 0
}

// ======================================================
// TEXT SIMILARITY
// ======================================================

function calculateTextSimilarity(
  first,
  second,
) {
  if (first === second) {
    return 1
  }

  if (!first || !second) {
    return 0
  }

  const distance =
    levenshteinDistance(
      first,
      second,
    )

  const longest =
    Math.max(
      first.length,
      second.length,
    )

  if (longest === 0) {
    return 1
  }

  return Math.max(
    0,
    1 -
      distance /
        longest,
  )
}

function levenshteinDistance(
  first,
  second,
) {
  const columns =
    second.length + 1

  let previous =
    new Array(columns)

  let current =
    new Array(columns)

  for (
    let column = 0;
    column < columns;
    column += 1
  ) {
    previous[column] =
      column
  }

  for (
    let row = 1;
    row <= first.length;
    row += 1
  ) {
    current[0] = row

    for (
      let column = 1;
      column <= second.length;
      column += 1
    ) {
      const substitutionCost =
        first[row - 1] ===
        second[column - 1]
          ? 0
          : 1

      current[column] =
        Math.min(
          current[
            column - 1
          ] + 1,

          previous[column] + 1,

          previous[
            column - 1
          ] +
            substitutionCost,
        )
    }

    const temporary =
      previous

    previous = current
    current = temporary
  }

  return previous[
    second.length
  ]
}

// ======================================================
// GEOMETRY
// ======================================================

function calculateIntersection(
  first,
  second,
) {
  const left =
    Math.max(
      first.x,
      second.x,
    )

  const top =
    Math.max(
      first.y,
      second.y,
    )

  const right =
    Math.min(
      first.x +
        first.width,

      second.x +
        second.width,
    )

  const bottom =
    Math.min(
      first.y +
        first.height,

      second.y +
        second.height,
    )

  const width =
    Math.max(
      0,
      right - left,
    )

  const height =
    Math.max(
      0,
      bottom - top,
    )

  return {
    width,
    height,
    area:
      width * height,
  }
}

function getCenterY(box) {
  return (
    box.y +
    box.height / 2
  )
}

// ======================================================
// TEXT NORMALIZATION
// ======================================================

function normalizeVisibleText(value) {
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

function normalizeComparisonText(value) {
  return normalizeVisibleText(
    value,
  )
    .replace(
      /\s+/g,
      '',
    )
    .toLocaleLowerCase()
}

function normalizeRegionText(value) {
  return normalizeVisibleText(
    value,
  )
    /*
     * Remove spaces before punctuation.
     */
    .replace(
      /\s+([.,:;%°)\]])/gu,
      '$1',
    )
    /*
     * Remove spaces immediately after opening
     * punctuation.
     */
    .replace(
      /([(\[])\s+/gu,
      '$1',
    )
}

// ======================================================
// SORTING
// ======================================================

function sortRegions(
  first,
  second,
) {
  const firstCenterY =
    getCenterY(first)

  const secondCenterY =
    getCenterY(second)

  const tolerance =
    Math.max(
      2,
      Math.min(
        first.height,
        second.height,
      ) * 0.5,
    )

  if (
    Math.abs(
      firstCenterY -
      secondCenterY,
    ) > tolerance
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
// GENERAL HELPERS
// ======================================================

function roundCoordinate(value) {
  return Math.round(
    Number(value) || 0,
  )
}

function roundScore(value) {
  return (
    Math.round(
      (
        Number(value) || 0
      ) * 10,
    ) / 10
  )
}