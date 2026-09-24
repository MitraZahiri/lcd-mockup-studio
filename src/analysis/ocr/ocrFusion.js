import { sortOcrWords } from './ocrExtractor.js'

// ======================================================
// LCD OCR FUSION
// ======================================================
//
// Combines OCR candidates produced by multiple
// preprocessing variants and segmentation modes.
//
// Responsibilities:
// - Group candidates representing the same physical token
// - Compare alternative OCR readings
// - Reward agreement between independent OCR passes
// - Preserve useful LCD punctuation such as ° : %
// - Penalize weak one-character artefacts
// - Select one winner per physical token
//
// This module does NOT:
// - Run Tesseract
// - Preprocess images
// - Create editor elements
// ======================================================

const TEXT_SIMILARITY_THRESHOLD = 0.76
const STRONG_TEXT_SIMILARITY = 0.88

// ======================================================
// PUBLIC API
// ======================================================

export function fuseOcrCandidates(candidates) {
  if (
    !Array.isArray(candidates) ||
    candidates.length === 0
  ) {
    return {
      clusters: [],
      words: [],
    }
  }

  const usableCandidates =
    candidates.filter(
      isUsableCandidate,
    )

  const clusters =
    clusterOcrCandidates(
      usableCandidates,
    )

  const winners = clusters
    .map(chooseClusterWinner)
    .filter(Boolean)

  const cleanedWinners =
    suppressWinnerDuplicates(
      winners,
    )

  cleanedWinners.sort(
    sortOcrWords,
  )

  return {
    clusters,
    words: cleanedWinners,
  }
}

// ======================================================
// BASIC VALIDATION
// ======================================================

function isUsableCandidate(candidate) {
  if (!candidate) {
    return false
  }

  const text =
    normalizeVisibleText(
      candidate.text,
    )

  if (!text) {
    return false
  }

  if (
    !Number.isFinite(
      candidate.x,
    ) ||
    !Number.isFinite(
      candidate.y,
    ) ||
    !Number.isFinite(
      candidate.width,
    ) ||
    !Number.isFinite(
      candidate.height,
    )
  ) {
    return false
  }

  if (
    candidate.width <= 0 ||
    candidate.height <= 0
  ) {
    return false
  }

  return true
}

// ======================================================
// PHYSICAL TOKEN CLUSTERING
// ======================================================

function clusterOcrCandidates(candidates) {
  /*
   * Strong candidates enter first.
   *
   * This makes the initial cluster geometry more stable
   * than allowing low-confidence OCR fragments to define
   * the cluster first.
   */

  const ordered =
    [...candidates].sort(
      (first, second) => {
        const scoreDifference =
          scoreBaseCandidate(second) -
          scoreBaseCandidate(first)

        if (
          Math.abs(
            scoreDifference,
          ) > 0.001
        ) {
          return scoreDifference
        }

        return sortOcrWords(
          first,
          second,
        )
      },
    )

  const clusters = []

  for (const candidate of ordered) {
    let bestCluster = null
    let bestMatchScore = -Infinity

    for (const cluster of clusters) {
      const match =
        compareCandidateToCluster(
          candidate,
          cluster,
        )

      if (!match.matches) {
        continue
      }

      if (
        match.score >
        bestMatchScore
      ) {
        bestMatchScore =
          match.score

        bestCluster = cluster
      }
    }

    if (!bestCluster) {
      clusters.push(
        createCluster(
          candidate,
        ),
      )

      continue
    }

    addCandidateToCluster(
      bestCluster,
      candidate,
    )
  }

  return clusters.sort(
    (first, second) =>
      sortOcrWords(
        first,
        second,
      ),
  )
}

function createCluster(candidate) {
  return {
    x: candidate.x,
    y: candidate.y,
    width: candidate.width,
    height: candidate.height,

    candidates: [
      candidate,
    ],
  }
}

function addCandidateToCluster(
  cluster,
  candidate,
) {
  cluster.candidates.push(
    candidate,
  )

  /*
   * Do NOT continuously expand cluster geometry using
   * the union of every candidate.
   *
   * That was one of the problems in the previous
   * fusion implementation: one oversized OCR result
   * could gradually make a cluster absorb neighbours.
   *
   * Instead use the median-ish representative geometry
   * of all candidates.
   */

  const boxes =
    cluster.candidates

  cluster.x =
    median(
      boxes.map(
        (item) => item.x,
      ),
    )

  cluster.y =
    median(
      boxes.map(
        (item) => item.y,
      ),
    )

  cluster.width =
    median(
      boxes.map(
        (item) => item.width,
      ),
    )

  cluster.height =
    median(
      boxes.map(
        (item) => item.height,
      ),
    )
}

function compareCandidateToCluster(
  candidate,
  cluster,
) {
  let bestScore = -Infinity

  /*
   * Compare against both representative geometry
   * and actual members.
   */

  const references = [
    {
      x: cluster.x,
      y: cluster.y,
      width: cluster.width,
      height: cluster.height,
    },

    ...cluster.candidates,
  ]

  for (const reference of references) {
    const geometry =
      compareGeometry(
        candidate,
        reference,
      )

    if (!geometry.sameToken) {
      continue
    }

    bestScore = Math.max(
      bestScore,
      geometry.score,
    )
  }

  return {
    matches:
      Number.isFinite(
        bestScore,
      ),

    score: bestScore,
  }
}

// ======================================================
// GEOMETRY
// ======================================================

function compareGeometry(
  first,
  second,
) {
  const intersectionArea =
    calculateIntersectionArea(
      first,
      second,
    )

  if (intersectionArea <= 0) {
    return {
      sameToken: false,
      score: 0,
    }
  }

  const firstArea =
    first.width *
    first.height

  const secondArea =
    second.width *
    second.height

  const smallerArea =
    Math.max(
      1,
      Math.min(
        firstArea,
        secondArea,
      ),
    )

  const unionArea =
    Math.max(
      1,
      firstArea +
      secondArea -
      intersectionArea,
    )

  const coverage =
    intersectionArea /
    smallerArea

  const iou =
    intersectionArea /
    unionArea

  const firstCenterX =
    getCenterX(first)

  const firstCenterY =
    getCenterY(first)

  const secondCenterX =
    getCenterX(second)

  const secondCenterY =
    getCenterY(second)

  const centerXDistance =
    Math.abs(
      firstCenterX -
      secondCenterX,
    )

  const centerYDistance =
    Math.abs(
      firstCenterY -
      secondCenterY,
    )

  const minimumWidth =
    Math.max(
      1,
      Math.min(
        first.width,
        second.width,
      ),
    )

  const maximumWidth =
    Math.max(
      first.width,
      second.width,
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

  const widthRatio =
    minimumWidth /
    Math.max(
      1,
      maximumWidth,
    )

  const heightRatio =
    minimumHeight /
    Math.max(
      1,
      maximumHeight,
    )

  const verticallyAligned =
    centerYDistance <=
    Math.max(
      2,
      maximumHeight * 0.38,
    )

  const horizontallyAligned =
    centerXDistance <=
    Math.max(
      3,
      minimumWidth * 0.45,
    )

  /*
   * Same-token matching is intentionally strict.
   *
   * Adjacent LCD words often have similar height and
   * only a few pixels between them. Requiring strong
   * overlap prevents e.g. "Connect" and a neighbouring
   * fragment from becoming one physical token.
   */

  const sameToken =
    verticallyAligned &&
    heightRatio >= 0.55 &&
    (
      iou >= 0.5 ||
      (
        coverage >= 0.84 &&
        horizontallyAligned &&
        widthRatio >= 0.34
      )
    )

  const score =
    iou * 6 +
    coverage * 3 +
    heightRatio +
    widthRatio * 0.5 -
    (
      centerYDistance /
      Math.max(
        1,
        maximumHeight,
      )
    )

  return {
    sameToken,
    score,
    iou,
    coverage,
  }
}

// ======================================================
// WINNER SELECTION
// ======================================================

function chooseClusterWinner(cluster) {
  if (
    !cluster ||
    cluster.candidates.length === 0
  ) {
    return null
  }

  /*
   * First group textual alternatives inside the
   * physical token cluster.
   *
   * Example:
   *
   * normal  -> Connect
   * thin    -> Connect
   * thick   -> Connect
   * block   -> Connect
   *
   * becomes one text family with strong support.
   */

  const textFamilies =
    createTextFamilies(
      cluster.candidates,
    )

  if (
    textFamilies.length === 0
  ) {
    return null
  }

  let bestFamily = null
  let bestFamilyScore = -Infinity

  for (const family of textFamilies) {
    const score =
      scoreTextFamily(
        family,
      )

    if (
      score >
      bestFamilyScore
    ) {
      bestFamilyScore =
        score

      bestFamily = family
    }
  }

  if (!bestFamily) {
    return null
  }

  const winner =
    chooseBestFamilyCandidate(
      bestFamily,
    )

  if (!winner) {
    return null
  }

  return {
    ...winner,

    support:
      bestFamily.candidates.length,

    sourceSupport:
      countIndependentSources(
        bestFamily.candidates,
      ),

    fusionScore:
      roundScore(
        bestFamilyScore,
      ),
  }
}

// ======================================================
// TEXT FAMILIES
// ======================================================

function createTextFamilies(candidates) {
  const ordered =
    [...candidates].sort(
      (first, second) =>
        scoreBaseCandidate(second) -
        scoreBaseCandidate(first),
    )

  const families = []

  for (const candidate of ordered) {
    const normalized =
      normalizeComparisonText(
        candidate.text,
      )

    if (!normalized) {
      continue
    }

    let bestFamily = null
    let bestSimilarity = 0

    for (const family of families) {
      const similarity =
        calculateTextSimilarity(
          normalized,
          family.normalized,
        )

      if (
        similarity >=
          TEXT_SIMILARITY_THRESHOLD &&
        similarity >
          bestSimilarity
      ) {
        bestFamily =
          family

        bestSimilarity =
          similarity
      }
    }

    if (!bestFamily) {
      families.push({
        normalized,
        candidates: [
          candidate,
        ],
      })

      continue
    }

    bestFamily.candidates.push(
      candidate,
    )

    /*
     * Representative text should come from the
     * strongest candidate in the family.
     */

    const strongest =
      chooseStrongestCandidate(
        bestFamily.candidates,
      )

    bestFamily.normalized =
      normalizeComparisonText(
        strongest.text,
      )
  }

  return families
}

// ======================================================
// FAMILY SCORING
// ======================================================

function scoreTextFamily(family) {
  const candidates =
    family.candidates

  if (
    candidates.length === 0
  ) {
    return -Infinity
  }

  const strongest =
    chooseStrongestCandidate(
      candidates,
    )

  let score =
    scoreBaseCandidate(
      strongest,
    )

  const independentSources =
    countIndependentSources(
      candidates,
    )

  const variants =
    new Set(
      candidates.map(
        (candidate) =>
          candidate.variant,
      ),
    )

  const passes =
    new Set(
      candidates.map(
        (candidate) =>
          candidate.pass,
      ),
    )

  /*
   * Agreement is more useful than raw confidence.
   *
   * A reading seen by normal + thin + thick is much
   * more trustworthy than a high-confidence reading
   * produced by only one threshold.
   */

  score +=
    Math.min(
      24,
      independentSources * 5,
    )

  score +=
    Math.min(
      12,
      variants.size * 3,
    )

  score +=
    Math.min(
      4,
      passes.size * 2,
    )

  /*
   * Exact text repetitions receive another small bonus.
   */

  score +=
    calculateExactAgreementBonus(
      candidates,
    )

  /*
   * Preserve symbol-bearing LCD tokens.
   *
   * This is generic — no "23°C" or other test-specific
   * text is encoded here.
   */

  if (
    containsUsefulSymbol(
      strongest.text,
    )
  ) {
    score += 4
  }

  /*
   * Weak isolated fragments need consensus.
   *
   * This directly targets OCR artefacts such as:
   *
   * I
   * t
   * =
   *
   * without forbidding legitimate one-character LCD
   * labels when several OCR passes agree on them.
   */

  if (
    isWeakShortCandidate(
      strongest,
    )
  ) {
    if (independentSources <= 1) {
      score -= 24
    } else if (
      independentSources === 2
    ) {
      score -= 10
    }
  }

  return score
}

function calculateExactAgreementBonus(
  candidates,
) {
  const counts = new Map()

  for (const candidate of candidates) {
    const normalized =
      normalizeComparisonText(
        candidate.text,
      )

    counts.set(
      normalized,
      (
        counts.get(
          normalized,
        ) ?? 0
      ) + 1,
    )
  }

  let maximumCount = 0

  for (const count of counts.values()) {
    maximumCount =
      Math.max(
        maximumCount,
        count,
      )
  }

  return Math.min(
    12,
    Math.max(
      0,
      maximumCount - 1,
    ) * 3,
  )
}

// ======================================================
// BEST CANDIDATE INSIDE FAMILY
// ======================================================

function chooseBestFamilyCandidate(
  family,
) {
  let best = null
  let bestScore = -Infinity

  for (
    const candidate
    of family.candidates
  ) {
    let score =
      scoreBaseCandidate(
        candidate,
      )

    /*
     * Prefer candidates agreeing most closely with
     * the other readings in the same family.
     */

    for (
      const other
      of family.candidates
    ) {
      if (
        other === candidate
      ) {
        continue
      }

      const similarity =
        calculateTextSimilarity(
          normalizeComparisonText(
            candidate.text,
          ),

          normalizeComparisonText(
            other.text,
          ),
        )

      if (
        similarity >=
        STRONG_TEXT_SIMILARITY
      ) {
        score += 2
      }
    }

    if (
      score >
      bestScore
    ) {
      bestScore = score
      best = candidate
    }
  }

  return best
}

function chooseStrongestCandidate(
  candidates,
) {
  let strongest =
    candidates[0]

  let strongestScore =
    scoreBaseCandidate(
      strongest,
    )

  for (
    let index = 1;
    index < candidates.length;
    index += 1
  ) {
    const candidate =
      candidates[index]

    const score =
      scoreBaseCandidate(
        candidate,
      )

    if (
      score >
      strongestScore
    ) {
      strongest =
        candidate

      strongestScore =
        score
    }
  }

  return strongest
}

// ======================================================
// BASE CANDIDATE SCORING
// ======================================================

function scoreBaseCandidate(candidate) {
  const text =
    normalizeVisibleText(
      candidate.text,
    )

  if (!text) {
    return -Infinity
  }

  let score =
    Number(
      candidate.confidence,
    ) || 0

  const lettersAndNumbers =
    (
      text.match(
        /[\p{L}\p{N}]/gu,
      ) ?? []
    ).length

  const usefulSymbols =
    (
      text.match(
        /[.:,;%°/+\-]/gu,
      ) ?? []
    ).length

  const suspiciousSymbols =
    (
      text.match(
        /[^\p{L}\p{N}\s.,:;%°/+\-()[\]]/gu,
      ) ?? []
    ).length

  score +=
    Math.min(
      8,
      lettersAndNumbers * 0.8,
    )

  score +=
    Math.min(
      8,
      usefulSymbols * 2,
    )

  score -=
    suspiciousSymbols * 5

  if (
    text.length === 1 &&
    lettersAndNumbers === 1
  ) {
    score -= 8
  }

  if (
    lettersAndNumbers === 0 &&
    usefulSymbols === 0
  ) {
    score -= 16
  }

  if (
    candidate.variant ===
    'normal'
  ) {
    score += 3
  }

  if (
    candidate.variant ===
    'thin'
  ) {
    score += 1
  }

  if (
    candidate.variant ===
    'recovery'
  ) {
    score -= 2
  }

  if (
    candidate.pass ===
    'sparse'
  ) {
    score += 2
  }

  return score
}

// ======================================================
// WEAK FRAGMENT DETECTION
// ======================================================

function isWeakShortCandidate(
  candidate,
) {
  const text =
    normalizeVisibleText(
      candidate.text,
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
// FINAL WINNER DEDUPLICATION
// ======================================================

function suppressWinnerDuplicates(
  winners,
) {
  const ordered =
    [...winners].sort(
      (first, second) =>
        (
          second.fusionScore ??
          0
        ) -
        (
          first.fusionScore ??
          0
        ),
    )

  const accepted = []

  for (const candidate of ordered) {
    let duplicate = false

    for (const existing of accepted) {
      const geometry =
        compareGeometry(
          candidate,
          existing,
        )

      if (!geometry.sameToken) {
        continue
      }

      const similarity =
        calculateTextSimilarity(
          normalizeComparisonText(
            candidate.text,
          ),

          normalizeComparisonText(
            existing.text,
          ),
        )

      if (
        similarity >= 0.7
      ) {
        duplicate = true
        break
      }

      /*
       * Very strong geometric overlap means these
       * winners still represent the same physical LCD
       * location even if Tesseract read them differently.
       *
       * Keep only the higher-scoring winner.
       */

      if (
        geometry.iou >= 0.68 ||
        geometry.coverage >= 0.92
      ) {
        duplicate = true
        break
      }
    }

    if (!duplicate) {
      accepted.push(
        candidate,
      )
    }
  }

  return accepted
}

// ======================================================
// SOURCE CONSENSUS
// ======================================================

function countIndependentSources(
  candidates,
) {
  const sources =
    new Set()

  for (const candidate of candidates) {
    sources.add(
      `${candidate.variant}:${candidate.pass}`,
    )
  }

  return sources.size
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

function containsUsefulSymbol(value) {
  return /[.:,;%°/+\-]/u.test(
    String(
      value ?? '',
    ),
  )
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
      const substitution =
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
            substitution,
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
// GEOMETRY HELPERS
// ======================================================

function calculateIntersectionArea(
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

  return width * height
}

function getCenterX(box) {
  return (
    box.x +
    box.width / 2
  )
}

function getCenterY(box) {
  return (
    box.y +
    box.height / 2
  )
}

// ======================================================
// GENERAL HELPERS
// ======================================================

function median(values) {
  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return 0
  }

  const sorted =
    [...values].sort(
      (first, second) =>
        first - second,
    )

  const middle =
    Math.floor(
      sorted.length / 2,
    )

  if (
    sorted.length % 2 === 1
  ) {
    return sorted[middle]
  }

  return (
    sorted[middle - 1] +
    sorted[middle]
  ) / 2
}

function roundScore(value) {
  return (
    Math.round(
      value * 10,
    ) / 10
  )
}