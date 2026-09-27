// ======================================================
// LCD LINE DETECTOR
// ======================================================
//
// Detects simple horizontal lines from a binary mask.
//
// Responsibilities:
// - Scan binary image rows
// - Find long horizontal foreground runs
// - Merge neighbouring line candidates
// - Filter text-like / oversized regions
//
// OCR logic does NOT belong in this module.
// ======================================================

export function detectHorizontalLines(
  mask,
  width,
  height,
) {
  if (
    !mask ||
    width < 1 ||
    height < 1
  ) {
    return []
  }

  const candidates = []

  const minimumRun = Math.max(
    12,
    Math.round(width * 0.22),
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
          ? mask[y * width + x] === 1
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
          runWidth >= minimumRun
        ) {
          candidates.push({
            x: runStart,
            y,
            width: runWidth,
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

// ======================================================
// CANDIDATE MERGING
// ======================================================

function mergeLineCandidates(
  candidates,
) {
  if (
    candidates.length === 0
  ) {
    return []
  }

  const sorted = [...candidates].sort(
    (first, second) => {
      if (first.y !== second.y) {
        return first.y - second.y
      }

      return first.x - second.x
    },
  )

  const lines = []

  for (const candidate of sorted) {
    const previous =
      lines[lines.length - 1]

    if (!previous) {
      lines.push({
        ...candidate,
      })

      continue
    }

    if (
      canMergeLines(
        previous,
        candidate,
      )
    ) {
      mergeLine(
        previous,
        candidate,
      )

      continue
    }

    lines.push({
      ...candidate,
    })
  }

  return lines.filter(
    isUsefulHorizontalLine,
  )
}

// ======================================================
// MERGE RULES
// ======================================================

function canMergeLines(
  first,
  second,
) {
  const firstBottom =
    first.y + first.height

  const verticalDistance =
    second.y - firstBottom

  const closeVertically =
    verticalDistance <= 1

  const similarStart =
    Math.abs(
      second.x - first.x,
    ) <= 3

  const similarWidth =
    Math.abs(
      second.width -
      first.width,
    ) <= 5

  return (
    closeVertically &&
    similarStart &&
    similarWidth
  )
}

function mergeLine(
  target,
  source,
) {
  const left = Math.min(
    target.x,
    source.x,
  )

  const top = Math.min(
    target.y,
    source.y,
  )

  const right = Math.max(
    target.x + target.width,
    source.x + source.width,
  )

  const bottom = Math.max(
    target.y + target.height,
    source.y + source.height,
  )

  target.x = left
  target.y = top

  target.width =
    right - left

  target.height =
    bottom - top
}

// ======================================================
// FILTERING
// ======================================================

function isUsefulHorizontalLine(
  line,
) {
  if (!line) {
    return false
  }

  if (
    line.width < 1 ||
    line.height < 1
  ) {
    return false
  }

  /*
   * A genuine LCD separator is normally thin.
   * Taller regions are more likely to be text,
   * icons or filled shapes.
   */

  if (line.height > 5) {
    return false
  }

  return true
}

// ======================================================
// EDITOR ELEMENT CONVERSION
// ======================================================

export function lineToElement(line) {
  return {
    type: 'line',
    name: 'Detected Line',

    x: line.x,
    y: line.y,

    width: Math.max(
      1,
      line.width,
    ),

    height: Math.max(
      3,
      line.height + 2,
    ),

    color: '#a8d9a8',

    strokeWidth: Math.max(
      1,
      line.height,
    ),

    source: 'analysis',
  }
}