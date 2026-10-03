// ======================================================
// LCD GEOMETRY DETECTOR
// ======================================================
//
// Detects horizontal lines, vertical lines, and rectangular
// frames from a binary mask, with text overlap suppression.
// ======================================================

export function detectGeometry(mask, width, height, textRegions = []) {
  if (!mask || width < 1 || height < 1) {
    return { lines: [], rectangles: [] }
  }

  const hLines = detectRawHorizontalLines(mask, width, height)
  const vLines = detectRawVerticalLines(mask, width, height)

  const { rectangles, remainingHLines, remainingVLines } = findRectanglesFromLines(
    hLines,
    vLines,
    width,
    height,
  )

  const combinedLines = [...remainingHLines, ...remainingVLines]
  const filteredLines = filterLinesOverlappingText(combinedLines, textRegions)
  const filteredRectangles = filterRectanglesOverlappingText(rectangles, textRegions)

  return {
    lines: filteredLines,
    rectangles: filteredRectangles,
  }
}

// ------------------------------------------------------
// HORIZONTAL LINES
// ------------------------------------------------------

function detectRawHorizontalLines(mask, width, height) {
  const minRun = Math.max(12, Math.round(width * 0.12))
  const candidates = []

  for (let y = 0; y < height; y++) {
    let runStart = -1
    for (let x = 0; x <= width; x++) {
      const isFg = x < width ? mask[y * width + x] === 1 : false
      if (isFg && runStart === -1) {
        runStart = x
      }
      if (!isFg && runStart !== -1) {
        const runW = x - runStart
        if (runW >= minRun) {
          candidates.push({ x: runStart, y, width: runW, height: 1, orientation: 'horizontal' })
        }
        runStart = -1
      }
    }
  }

  return mergeHorizontalCandidates(candidates)
}

function mergeHorizontalCandidates(candidates) {
  if (candidates.length === 0) return []

  const sorted = [...candidates].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x)
  const lines = []

  for (const candidate of sorted) {
    const prev = lines[lines.length - 1]
    if (!prev) {
      lines.push({ ...candidate })
      continue
    }

    const prevBottom = prev.y + prev.height
    const vDist = candidate.y - prevBottom
    const closeVert = vDist <= 1
    const similarStart = Math.abs(candidate.x - prev.x) <= 4
    const similarWidth = Math.abs(candidate.width - prev.width) <= 6

    if (closeVert && similarStart && similarWidth) {
      const left = Math.min(prev.x, candidate.x)
      const top = Math.min(prev.y, candidate.y)
      const right = Math.max(prev.x + prev.width, candidate.x + candidate.width)
      const bottom = Math.max(prevBottom, candidate.y + candidate.height)
      prev.x = left
      prev.y = top
      prev.width = right - left
      prev.height = bottom - top
    } else {
      lines.push({ ...candidate })
    }
  }

  return lines.filter(l => l.height <= 8)
}

// ------------------------------------------------------
// VERTICAL LINES
// ------------------------------------------------------

function detectRawVerticalLines(mask, width, height) {
  const minRun = Math.max(12, Math.round(height * 0.12))
  const candidates = []

  for (let x = 0; x < width; x++) {
    let runStart = -1
    for (let y = 0; y <= height; y++) {
      const isFg = y < height ? mask[y * width + x] === 1 : false
      if (isFg && runStart === -1) {
        runStart = y
      }
      if (!isFg && runStart !== -1) {
        const runH = y - runStart
        if (runH >= minRun) {
          candidates.push({ x, y: runStart, width: 1, height: runH, orientation: 'vertical' })
        }
        runStart = -1
      }
    }
  }

  return mergeVerticalCandidates(candidates)
}

function mergeVerticalCandidates(candidates) {
  if (candidates.length === 0) return []

  const sorted = [...candidates].sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y)
  const lines = []

  for (const candidate of sorted) {
    const prev = lines[lines.length - 1]
    if (!prev) {
      lines.push({ ...candidate })
      continue
    }

    const prevRight = prev.x + prev.width
    const hDist = candidate.x - prevRight
    const closeHoriz = hDist <= 1
    const similarStart = Math.abs(candidate.y - prev.y) <= 4
    const similarHeight = Math.abs(candidate.height - prev.height) <= 6

    if (closeHoriz && similarStart && similarHeight) {
      const left = Math.min(prev.x, candidate.x)
      const top = Math.min(prev.y, candidate.y)
      const right = Math.max(prevRight, candidate.x + candidate.width)
      const bottom = Math.max(prev.y + prev.height, candidate.y + candidate.height)
      prev.x = left
      prev.y = top
      prev.width = right - left
      prev.height = bottom - top
    } else {
      lines.push({ ...candidate })
    }
  }

  return lines.filter(l => l.width <= 8)
}

// ------------------------------------------------------
// RECTANGLE DETECTION FROM INTERSECTING LINES
// ------------------------------------------------------

function findRectanglesFromLines(hLines, vLines, canvasWidth, canvasHeight) {
  const rectangles = []
  const usedHLines = new Set()
  const usedVLines = new Set()

  const tol = 6 // pixel alignment tolerance

  for (let topIdx = 0; topIdx < hLines.length; topIdx++) {
    const top = hLines[topIdx]
    if (usedHLines.has(topIdx)) continue

    for (let botIdx = 0; botIdx < hLines.length; botIdx++) {
      if (topIdx === botIdx || usedHLines.has(botIdx)) continue
      const bot = hLines[botIdx]
      if (bot.y <= top.y + 10) continue // Must have minimum height

      const sameX = Math.abs(top.x - bot.x) <= tol
      const sameW = Math.abs(top.width - bot.width) <= tol
      if (!sameX || !sameW) continue

      // Look for matching left and right vertical lines
      const expectedLeft = Math.min(top.x, bot.x)
      const expectedRight = Math.max(top.x + top.width, bot.x + bot.width)
      const expectedTop = top.y
      const expectedBot = bot.y + bot.height

      let leftVIdx = -1
      let rightVIdx = -1

      for (let vIdx = 0; vIdx < vLines.length; vIdx++) {
        if (usedVLines.has(vIdx)) continue
        const v = vLines[vIdx]

        const matchesLeftX = Math.abs(v.x - expectedLeft) <= tol
        const matchesRightX = Math.abs((v.x + v.width) - expectedRight) <= tol
        const matchesY = Math.abs(v.y - expectedTop) <= tol && Math.abs((v.y + v.height) - expectedBot) <= tol

        if (matchesLeftX && matchesY) leftVIdx = vIdx
        if (matchesRightX && matchesY) rightVIdx = vIdx
      }

      if (leftVIdx !== -1 && rightVIdx !== -1) {
        // We found a complete rectangular frame!
        usedHLines.add(topIdx)
        usedHLines.add(botIdx)
        usedVLines.add(leftVIdx)
        usedVLines.add(rightVIdx)

        const rectX = Math.min(expectedLeft, vLines[leftVIdx].x)
        const rectY = Math.min(expectedTop, vLines[leftVIdx].y)
        const rectW = Math.max(expectedRight, vLines[rightVIdx].x + vLines[rightVIdx].width) - rectX
        const rectH = Math.max(expectedBot, vLines[leftVIdx].y + vLines[leftVIdx].height) - rectY
        const strokeW = Math.max(1, Math.round((top.height + bot.height + vLines[leftVIdx].width + vLines[rightVIdx].width) / 4))

        rectangles.push({
          x: Math.max(0, rectX),
          y: Math.max(0, rectY),
          width: Math.min(canvasWidth - rectX, rectW),
          height: Math.min(canvasHeight - rectY, rectH),
          strokeWidth: Math.min(8, strokeW),
        })
        break
      }
    }
  }

  const remainingHLines = hLines.filter((_, idx) => !usedHLines.has(idx))
  const remainingVLines = vLines.filter((_, idx) => !usedVLines.has(idx))

  return {
    rectangles,
    remainingHLines,
    remainingVLines,
  }
}

// ------------------------------------------------------
// TEXT OVERLAP FILTERING
// ------------------------------------------------------

function filterLinesOverlappingText(lines, textRegions) {
  if (!textRegions || textRegions.length === 0) return lines

  return lines.filter(line => {
    for (const text of textRegions) {
      const pad = 2
      const textLeft = (text.x || 0) - pad
      const textRight = textLeft + (text.width || 0) + pad * 2
      const textTop = (text.y || 0) - pad
      const textBottom = textTop + (text.height || 0) + pad * 2

      const lineRight = line.x + line.width
      const lineBottom = line.y + line.height

      // If line is largely contained within a text region and shorter than half the display width
      const overlapsHoriz = line.x >= textLeft && lineRight <= textRight
      const overlapsVert = line.y >= textTop && lineBottom <= textBottom

      if (overlapsHoriz && overlapsVert && (line.width < 100 || line.height < 100)) {
        return false // Ignore character stroke or small underline inside text
      }
    }
    return true
  })
}

function filterRectanglesOverlappingText(rectangles, textRegions) {
  // Keep rectangles that are valid frames (typically larger than individual character glyphs)
  return rectangles.filter(r => r.width >= 16 && r.height >= 12)
}

// ------------------------------------------------------
// ELEMENT BUILDERS
// ------------------------------------------------------

export function lineGeometryToElement(line, color = '#a8d9a8') {
  const isHoriz = line.orientation === 'horizontal' || line.width >= line.height
  const strokeWidth = Math.max(1, isHoriz ? line.height : line.width)

  return {
    type: 'line',
    name: isHoriz ? 'Detected Horizontal Line' : 'Detected Vertical Line',
    x: line.x,
    y: line.y,
    width: Math.max(1, line.width),
    height: Math.max(isHoriz ? 3 : 1, line.height),
    color,
    strokeWidth,
    source: 'analysis',
  }
}

export function rectangleGeometryToElement(rect, strokeColor = '#a8d9a8') {
  return {
    type: 'rectangle',
    name: 'Detected Frame',
    x: rect.x,
    y: rect.y,
    width: Math.max(1, rect.width),
    height: Math.max(1, rect.height),
    fill: 'transparent',
    stroke: strokeColor,
    strokeWidth: Math.max(1, rect.strokeWidth || 1),
    source: 'analysis',
  }
}
