import { detectSymbolsFromComponents } from './symbolDetector.js'

// ======================================================
// LCD GEOMETRY & SHAPE DETECTOR
// ======================================================
//
// Advanced shape analysis for LCD screens:
// - Standalone horizontal & vertical divider lines
// - Hollow rectangular frames
// - Solid filled badges, headers, and progress bars
// - Circular indicator dots & dial rings
// - LCD symbols & icons (Signal bars, Battery with charge, Arrows, Locks, Bells, Drops, Bluetooth)
// - Text overlap suppression to prevent character stroke noise
// ======================================================

export function detectGeometry(mask, width, height, textRegions = [], options = {}) {
  if (!mask || width < 1 || height < 1) {
    return { lines: [], rectangles: [], circles: [], symbols: [], stats: { lines: 0, rectangles: 0, circles: 0, symbols: 0 } }
  }

  // 1. Detect raw horizontal and vertical lines
  const hLines = detectRawHorizontalLines(mask, width, height)
  const vLines = detectRawVerticalLines(mask, width, height)

  // 2. Find hollow frames formed by intersecting lines
  const { rectangles: hollowRectangles, remainingHLines, remainingVLines } = findRectanglesFromLines(
    hLines,
    vLines,
    width,
    height,
  )

  const combinedLines = [...remainingHLines, ...remainingVLines]
  const filteredLines = filterLinesOverlappingText(combinedLines, textRegions)
  const filteredHollowRectangles = filterRectanglesOverlappingText(hollowRectangles, textRegions)

  // 3. Connected Component Analysis for symbols, solid badges, and circles
  const { solidRectangles, circles, symbols } = detectConnectedShapes(
    mask,
    width,
    height,
    textRegions,
    filteredHollowRectangles,
    options,
  )

  const allRectangles = [...filteredHollowRectangles, ...solidRectangles]

  return {
    lines: filteredLines,
    rectangles: allRectangles,
    circles,
    symbols,
    stats: {
      lines: filteredLines.length,
      rectangles: allRectangles.length,
      hollowFrames: filteredHollowRectangles.length,
      solidBadges: solidRectangles.length,
      circles: circles.length,
      symbols: symbols.length,
    },
  }
}

// ------------------------------------------------------
// HORIZONTAL LINES
// ------------------------------------------------------

function detectRawHorizontalLines(mask, width, height) {
  const minRun = Math.max(8, Math.round(width * 0.08))
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
  const minRun = Math.max(8, Math.round(height * 0.08))
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
        // Complete hollow rectangular frame found
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
          filled: false,
          name: 'Detected Frame',
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
// CONNECTED COMPONENT & SHAPE ANALYSIS
// ------------------------------------------------------

function findAllComponents(mask, width, height) {
  const visited = new Uint8Array(width * height)
  const components = []

  const dx = [-1, 0, 1, -1, 1, -1, 0, 1]
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1]
  const queue = new Int32Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const startIdx = y * width + x
      if (mask[startIdx] !== 1 || visited[startIdx] === 1) continue

      visited[startIdx] = 1
      let head = 0
      let tail = 0
      queue[tail++] = startIdx

      let minX = x, maxX = x, minY = y, maxY = y
      let area = 0

      while (head < tail) {
        const curr = queue[head++]
        const cy = Math.floor(curr / width)
        const cx = curr % width
        area++

        if (cx < minX) minX = cx
        if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy
        if (cy > maxY) maxY = cy

        for (let d = 0; d < 8; d++) {
          const nx = cx + dx[d]
          const ny = cy + dy[d]
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const nidx = ny * width + nx
            if (mask[nidx] === 1 && visited[nidx] === 0) {
              visited[nidx] = 1
              queue[tail++] = nidx
            }
          }
        }
      }

      const compW = maxX - minX + 1
      const compH = maxY - minY + 1
      const totalPixels = compW * compH
      const density = area / totalPixels

      components.push({
        x: minX,
        y: minY,
        width: compW,
        height: compH,
        area,
        density,
      })
    }
  }

  return components
}

function detectConnectedShapes(mask, width, height, textRegions, existingFrames, options = {}) {
  const components = findAllComponents(mask, width, height)
  const solidRectangles = []
  const circles = []

  // 1. Detect specialized LCD symbols & icons first
  const strokeColor = options.color || '#a8d9a8'
  const { symbols, consumedIndices } = detectSymbolsFromComponents(
    components,
    mask,
    width,
    height,
    textRegions,
    strokeColor,
  )

  // 2. Classify remaining unconsumed components
  for (let i = 0; i < components.length; i++) {
    if (consumedIndices.has(i)) continue

    const comp = components[i]
    const { x: minX, y: minY, width: compW, height: compH, area, density } = comp

    // Ignore noise or tiny blobs
    if (compW < 4 && compH < 4) continue

    // Ignore existing hollow frames
    if (isDuplicateOfFrame(minX, minY, compW, compH, existingFrames)) continue

    // Check text overlap: if blob is inside text region and small, it's a character glyph
    if (isGlyphInsideText(minX, minY, compW, compH, textRegions)) continue

    // Check for Circle / Indicator Dot (aspect 0.72-1.38, circularity match)
    const aspect = compW / compH
    const isSquareish = aspect >= 0.72 && aspect <= 1.38
    if (isSquareish && compW >= 4 && compH >= 4 && compW <= Math.min(width, height) * 0.4) {
      const cornerEmptyCount = countEmptyCorners(mask, width, minX, minY, compW, compH)
      // Circles have empty outer corners
      if (cornerEmptyCount >= 3) {
        if (density >= 0.52) {
          circles.push({
            x: minX,
            y: minY,
            width: compW,
            height: compH,
            fill: 'solid',
            strokeWidth: 1,
            name: 'Detected Indicator Dot',
          })
          continue
        } else if (density >= 0.20 && density < 0.52) {
          circles.push({
            x: minX,
            y: minY,
            width: compW,
            height: compH,
            fill: 'transparent',
            strokeWidth: 1,
            name: 'Detected Ring Gauge',
          })
          continue
        }
      }
    }

    // Check for Solid Rectangles (Badges, Headers, Progress Bars)
    if (compW >= 8 && compH >= 4 && density >= 0.78) {
      const isProgressBar = compW / compH >= 3.2
      const isHeaderBar = compW >= width * 0.6 && compH >= 8 && compH <= 24
      let name = 'Detected Solid Badge'
      if (isProgressBar) name = 'Detected Progress Bar'
      if (isHeaderBar) name = 'Detected Header Bar'

      solidRectangles.push({
        x: minX,
        y: minY,
        width: compW,
        height: compH,
        filled: true,
        strokeWidth: 1,
        name,
      })
    }
  }

  return { solidRectangles, circles, symbols }
}

function countEmptyCorners(mask, width, x, y, w, h) {
  let empty = 0
  const checkCorner = (px, py) => {
    if (px < 0 || py < 0) return 1
    return mask[py * width + px] === 0 ? 1 : 0
  }
  empty += checkCorner(x, y)
  empty += checkCorner(x + w - 1, y)
  empty += checkCorner(x, y + h - 1)
  empty += checkCorner(x + w - 1, y + h - 1)
  return empty
}

function isDuplicateOfFrame(x, y, w, h, frames) {
  for (const f of frames) {
    if (Math.abs(f.x - x) <= 4 && Math.abs(f.y - y) <= 4 &&
        Math.abs(f.width - w) <= 6 && Math.abs(f.height - h) <= 6) {
      return true
    }
  }
  return false
}

function isGlyphInsideText(x, y, w, h, textRegions) {
  if (!textRegions || textRegions.length === 0) return false

  for (const t of textRegions) {
    const pad = 3
    const textLeft = (t.x || 0) - pad
    const textRight = textLeft + (t.width || 0) + pad * 2
    const textTop = (t.y || 0) - pad
    const textBottom = textTop + (t.height || 0) + pad * 2

    const insideX = x >= textLeft && (x + w) <= textRight
    const insideY = y >= textTop && (y + h) <= textBottom

    if (insideX && insideY && (w * h) < (t.width * t.height * 0.75)) {
      return true
    }
  }
  return false
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

      const overlapsHoriz = line.x >= textLeft && lineRight <= textRight
      const overlapsVert = line.y >= textTop && lineBottom <= textBottom

      if (overlapsHoriz && overlapsVert && (line.width < 100 || line.height < 100)) {
        return false
      }
    }
    return true
  })
}

function filterRectanglesOverlappingText(rectangles, textRegions) {
  return rectangles.filter(r => r.width >= 14 && r.height >= 10)
}

// ------------------------------------------------------
// ELEMENT BUILDERS
// ------------------------------------------------------

export function lineGeometryToElement(line, color = '#a8d9a8') {
  const isHoriz = line.orientation === 'horizontal' || line.width >= line.height
  const strokeWidth = Math.max(1, isHoriz ? line.height : line.width)

  return {
    type: 'line',
    name: line.name || (isHoriz ? 'Detected Horizontal Line' : 'Detected Vertical Line'),
    x: Math.max(0, Math.round(line.x)),
    y: Math.max(0, Math.round(line.y)),
    width: Math.max(1, Math.round(line.width)),
    height: Math.max(isHoriz ? 3 : 1, Math.round(line.height)),
    color,
    strokeWidth,
    source: 'analysis',
  }
}

export function rectangleGeometryToElement(rect, strokeColor = '#a8d9a8') {
  const isFilled = Boolean(rect.filled)
  return {
    type: 'rectangle',
    name: rect.name || (isFilled ? 'Detected Solid Badge' : 'Detected Frame'),
    x: Math.max(0, Math.round(rect.x)),
    y: Math.max(0, Math.round(rect.y)),
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height)),
    fill: isFilled ? strokeColor : 'transparent',
    stroke: strokeColor,
    strokeWidth: Math.max(1, Math.round(rect.strokeWidth || 1)),
    source: 'analysis',
  }
}

export function circleGeometryToElement(circle, strokeColor = '#a8d9a8') {
  const isFilled = circle.fill !== 'transparent'
  return {
    type: 'circle',
    name: circle.name || (isFilled ? 'Detected Indicator Dot' : 'Detected Ring Gauge'),
    x: Math.max(0, Math.round(circle.x)),
    y: Math.max(0, Math.round(circle.y)),
    width: Math.max(2, Math.round(circle.width)),
    height: Math.max(2, Math.round(circle.height)),
    fill: isFilled ? strokeColor : 'transparent',
    stroke: strokeColor,
    strokeWidth: Math.max(1, Math.round(circle.strokeWidth || 1)),
    source: 'analysis',
  }
}
