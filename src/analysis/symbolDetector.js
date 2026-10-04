// ======================================================
// LCD SYMBOL & ICON DETECTOR
// ======================================================
//
// Specialized recognizer for common LCD/OLED and HMI icons:
// - Signal Strength / Wi-Fi Bars (ascending bar cluster)
// - Battery Indicator with Charge Level (empty, segmented, full)
// - Directional Arrows & Chevrons (▶, ◄, ▲, ▼)
// - Lock / Unlock Status Icons (🔒)
// - Alarm Bell / Notification Icons (🔔)
// - Fluid / Droplet / Humidity Icons (💧)
// - Bluetooth Status Icons (ᛒ)
// - Checkboxes and Radio Buttons (☑, ☐, 🔘, ⚪)
// ======================================================

export function detectSymbolsFromComponents(components, mask, width, height, textRegions = [], strokeColor = '#a8d9a8') {
  const recognizedSymbols = []
  const consumedIndices = new Set()

  // 1. Detect Signal Strength Bars (groups of ascending vertical bars)
  const signalGroups = findSignalBarClusters(components, mask, width, height, consumedIndices)
  for (const group of signalGroups) {
    recognizedSymbols.push(...group.elements)
  }

  // 2. Classify individual connected components
  for (let i = 0; i < components.length; i++) {
    if (consumedIndices.has(i)) continue

    const comp = components[i]
    const { x, y, width: compW, height: compH, area, density } = comp

    // Skip if completely inside an OCR text word (to prevent classifying letter glyphs)
    if (isGlyphInsideText(x, y, compW, compH, textRegions)) continue

    // 2A. Battery Indicator with internal charge detection
    if (isBatteryOutline(mask, width, x, y, compW, compH)) {
      consumedIndices.add(i)
      const batteryElements = buildBatteryElements(mask, width, x, y, compW, compH, strokeColor)
      recognizedSymbols.push(...batteryElements)
      continue
    }

    // 2B. Directional Arrow Triangles (▶, ◄, ▲, ▼)
    const arrowType = detectArrowTriangle(mask, width, x, y, compW, compH, density)
    if (arrowType) {
      consumedIndices.add(i)
      recognizedSymbols.push(buildArrowElement(arrowType, x, y, compW, compH, strokeColor))
      continue
    }

    // 2C. Lock Icon (arch shackle + base body)
    if (isLockShape(mask, width, x, y, compW, compH)) {
      consumedIndices.add(i)
      recognizedSymbols.push(buildSymbolTextElement('🔒', 'Detected Lock Icon', x, y, compW, compH, strokeColor))
      continue
    }

    // 2D. Alarm Bell Icon (dome + flared rim)
    if (isBellShape(mask, width, x, y, compW, compH)) {
      consumedIndices.add(i)
      recognizedSymbols.push(buildSymbolTextElement('🔔', 'Detected Alarm Bell', x, y, compW, compH, strokeColor))
      continue
    }

    // 2E. Water / Fluid Droplet Icon (pointed top, rounded bottom)
    if (isDropletShape(mask, width, x, y, compW, compH)) {
      consumedIndices.add(i)
      recognizedSymbols.push(buildSymbolTextElement('💧', 'Detected Fluid Drop', x, y, compW, compH, strokeColor))
      continue
    }

    // 2F. Bluetooth Symbol
    if (isBluetoothShape(mask, width, x, y, compW, compH)) {
      consumedIndices.add(i)
      recognizedSymbols.push(buildSymbolTextElement('ᛒ', 'Detected Bluetooth Icon', x, y, compW, compH, strokeColor))
      continue
    }

    // 2G. Checkbox with Checkmark
    const checkState = detectCheckbox(mask, width, x, y, compW, compH)
    if (checkState === 'checked') {
      consumedIndices.add(i)
      recognizedSymbols.push(buildSymbolTextElement('☑', 'Detected Checked Box', x, y, compW, compH, strokeColor))
      continue
    }
  }

  return {
    symbols: recognizedSymbols,
    consumedIndices,
  }
}

// ------------------------------------------------------
// 1. SIGNAL STRENGTH BARS
// ------------------------------------------------------

function findSignalBarClusters(components, mask, canvasW, canvasH, consumedIndices) {
  const clusters = []

  // Candidate vertical bars: width 1..8, height 4..40, height > width * 1.2
  const barIndices = []
  for (let i = 0; i < components.length; i++) {
    if (consumedIndices.has(i)) continue
    const c = components[i]
    if (c.width >= 1 && c.width <= 8 && c.height >= 4 && c.height <= 40 && c.height >= c.width * 1.2) {
      if (c.density >= 0.65) {
        barIndices.push(i)
      }
    }
  }

  if (barIndices.length < 3) return clusters

  // Sort candidate bars by X coordinate
  barIndices.sort((a, b) => components[a].x - components[b].x)

  // Find contiguous sequence of 3 to 5 ascending bars with aligned bottoms
  let currentGroup = [barIndices[0]]

  for (let k = 1; k < barIndices.length; k++) {
    const prevIdx = currentGroup[currentGroup.length - 1]
    const currIdx = barIndices[k]
    const prev = components[prevIdx]
    const curr = components[currIdx]

    const prevBottom = prev.y + prev.height
    const currBottom = curr.y + curr.height
    const bottomAligned = Math.abs(prevBottom - currBottom) <= 3

    const prevRight = prev.x + prev.width
    const gap = curr.x - prevRight
    const closeHoriz = gap >= 1 && gap <= 7

    const heightAscending = curr.height >= prev.height - 1

    if (bottomAligned && closeHoriz && heightAscending) {
      currentGroup.push(currIdx)
    } else {
      if (currentGroup.length >= 3 && currentGroup.length <= 6) {
        clusters.push(buildSignalCluster(currentGroup, components, consumedIndices))
      }
      currentGroup = [currIdx]
    }
  }

  if (currentGroup.length >= 3 && currentGroup.length <= 6) {
    clusters.push(buildSignalCluster(currentGroup, components, consumedIndices))
  }

  return clusters
}

function buildSignalCluster(groupIndices, components, consumedIndices) {
  const elements = []
  const count = groupIndices.length

  for (let i = 0; i < count; i++) {
    const idx = groupIndices[i]
    consumedIndices.add(idx)
    const c = components[idx]

    elements.push({
      type: 'rectangle',
      name: `Detected Signal Bar ${i + 1}/${count}`,
      x: c.x,
      y: c.y,
      width: Math.max(1, c.width),
      height: Math.max(1, c.height),
      fill: '#a8d9a8',
      stroke: '#a8d9a8',
      strokeWidth: 1,
      source: 'analysis',
    })
  }

  return { elements }
}

// ------------------------------------------------------
// 2. BATTERY WITH INTERNAL CHARGE LEVEL
// ------------------------------------------------------

export function isBatteryOutline(mask, canvasW, x, y, w, h) {
  const aspect = w / h
  if (aspect < 1.4 || aspect > 4.2) return false
  if (w < 14 || h < 6 || h > 45) return false

  const nubWidth = Math.max(2, Math.round(w * 0.1))
  const bodyRight = x + w - nubWidth
  const nubTop = y + Math.round(h * 0.25)
  const nubBottom = y + Math.round(h * 0.75)

  let emptyAboveNub = 0
  let emptyBelowNub = 0
  for (let nx = bodyRight; nx < x + w; nx++) {
    for (let ny = y; ny < nubTop; ny++) {
      if (mask[ny * canvasW + nx] === 0) emptyAboveNub++
    }
    for (let ny = nubBottom; ny < y + h; ny++) {
      if (mask[ny * canvasW + nx] === 0) emptyBelowNub++
    }
  }

  return emptyAboveNub > 0 && emptyBelowNub > 0
}

function buildBatteryElements(mask, canvasW, x, y, w, h, strokeColor) {
  const elements = []
  const nubWidth = Math.max(2, Math.round(w * 0.1))
  const bodyW = w - nubWidth
  const termH = Math.max(2, Math.round(h * 0.45))
  const termY = y + Math.round((h - termH) / 2)

  // 1. Battery Frame
  elements.push({
    type: 'rectangle',
    name: 'Detected Battery Frame',
    x,
    y,
    width: bodyW,
    height: h,
    fill: 'transparent',
    stroke: strokeColor,
    strokeWidth: 1,
    source: 'analysis',
  })

  // 2. Battery Anode Terminal
  elements.push({
    type: 'rectangle',
    name: 'Detected Battery Terminal',
    x: x + bodyW,
    y: termY,
    width: nubWidth,
    height: termH,
    fill: strokeColor,
    stroke: strokeColor,
    strokeWidth: 1,
    source: 'analysis',
  })

  // 3. Compute Internal Charge Level
  const innerLeft = x + 2
  const innerRight = x + bodyW - 2
  const innerTop = y + 2
  const innerBottom = y + h - 2
  const innerW = innerRight - innerLeft
  const innerH = innerBottom - innerTop

  if (innerW >= 4 && innerH >= 2) {
    let internalFg = 0
    const totalInner = innerW * innerH

    for (let py = innerTop; py <= innerBottom; py++) {
      for (let px = innerLeft; px <= innerRight; px++) {
        if (mask[py * canvasW + px] === 1) internalFg++
      }
    }

    const fillRatio = internalFg / totalInner

    if (fillRatio >= 0.12) {
      const chargeW = Math.max(2, Math.round(innerW * Math.min(1, fillRatio * 1.15)))
      const percent = Math.min(100, Math.round(fillRatio * 100))
      elements.push({
        type: 'rectangle',
        name: `Detected Battery Charge (${percent}%)`,
        x: innerLeft,
        y: innerTop,
        width: chargeW,
        height: innerH,
        fill: strokeColor,
        stroke: strokeColor,
        strokeWidth: 1,
        source: 'analysis',
      })
    }
  }

  return elements
}

// ------------------------------------------------------
// 3. DIRECTIONAL ARROWS (▶, ◄, ▲, ▼)
// ------------------------------------------------------

export function detectArrowTriangle(mask, canvasW, x, y, w, h, density) {
  // Arrow triangles typically between 4x4 and 28x28
  if (w < 4 || h < 4 || w > 32 || h > 32) return null
  if (density < 0.30 || density > 0.85) return null

  // Calculate center of mass
  let totalX = 0, totalY = 0, count = 0
  for (let cy = y; cy < y + h; cy++) {
    for (let cx = x; cx < x + w; cx++) {
      if (mask[cy * canvasW + cx] === 1) {
        totalX += (cx - x)
        totalY += (cy - y)
        count++
      }
    }
  }

  if (count === 0) return null
  const cmX = totalX / count
  const cmY = totalY / count
  const normCmX = cmX / w
  const normCmY = cmY / h

  // Column pixel counts (left to right)
  const colHeights = new Int32Array(w)
  for (let cx = 0; cx < w; cx++) {
    for (let cy = 0; cy < h; cy++) {
      if (mask[(y + cy) * canvasW + (x + cx)] === 1) colHeights[cx]++
    }
  }

  // Row pixel counts (top to bottom)
  const rowWidths = new Int32Array(h)
  for (let cy = 0; cy < h; cy++) {
    for (let cx = 0; cx < w; cx++) {
      if (mask[(y + cy) * canvasW + (x + cx)] === 1) rowWidths[cy]++
    }
  }

  const leftHeight = colHeights[0] + (w > 2 ? colHeights[1] : 0)
  const rightHeight = colHeights[w - 1] + (w > 2 ? colHeights[w - 2] : 0)
  const topWidth = rowWidths[0] + (h > 2 ? rowWidths[1] : 0)
  const botWidth = rowWidths[h - 1] + (h > 2 ? rowWidths[h - 2] : 0)

  // Right Arrow ▶: mass left, point right
  if (normCmX < 0.45 && leftHeight > rightHeight * 1.8 && colHeights[w - 1] <= 3) {
    return 'right'
  }

  // Left Arrow ◄: mass right, point left
  if (normCmX > 0.55 && rightHeight > leftHeight * 1.8 && colHeights[0] <= 3) {
    return 'left'
  }

  // Down Arrow ▼: mass top, point bottom
  if (normCmY < 0.45 && topWidth > botWidth * 1.8 && rowWidths[h - 1] <= 3) {
    return 'down'
  }

  // Up Arrow ▲: mass bottom, point top
  if (normCmY > 0.55 && botWidth > topWidth * 1.8 && rowWidths[0] <= 3) {
    return 'up'
  }

  return null
}

function buildArrowElement(direction, x, y, w, h, color) {
  const glyphMap = {
    right: '▶',
    left: '◄',
    up: '▲',
    down: '▼',
  }
  const nameMap = {
    right: 'Detected Arrow (Right)',
    left: 'Detected Arrow (Left)',
    up: 'Detected Arrow (Up)',
    down: 'Detected Arrow (Down)',
  }

  const glyph = glyphMap[direction] || '▶'
  const name = nameMap[direction] || 'Detected Arrow'
  const fontSize = Math.max(8, Math.round(h * 1.1))

  return {
    type: 'text',
    name,
    text: glyph,
    x,
    y,
    width: Math.max(1, w),
    height: Math.max(1, h),
    fontSize,
    fontFamily: 'monospace',
    fontWeight: 400,
    textAlign: 'left',
    color,
    source: 'analysis',
  }
}

// ------------------------------------------------------
// 4. LOCK ICON (ARCH SHACKLE + BASE)
// ------------------------------------------------------

export function isLockShape(mask, canvasW, x, y, w, h) {
  if (w < 8 || h < 10 || w > 36 || h > 40) return false
  const aspect = w / h
  if (aspect < 0.6 || aspect > 1.25) return false

  const shackleH = Math.round(h * 0.4)
  const bodyH = h - shackleH

  // In the shackle region, the center should be hollow, and sides should have vertical strokes
  const midX = x + Math.round(w / 2)
  let hollowCenter = 0
  for (let cy = y + 2; cy < y + shackleH - 1; cy++) {
    if (mask[cy * canvasW + midX] === 0) hollowCenter++
  }

  // The base region should have substantial foreground density
  let baseFg = 0
  for (let cy = y + shackleH; cy < y + h; cy++) {
    for (let cx = x; cx < x + w; cx++) {
      if (mask[cy * canvasW + cx] === 1) baseFg++
    }
  }

  const baseDensity = baseFg / (w * bodyH)
  return hollowCenter >= 2 && baseDensity >= 0.55
}

// ------------------------------------------------------
// 5. ALARM BELL ICON
// ------------------------------------------------------

export function isBellShape(mask, canvasW, x, y, w, h) {
  if (w < 8 || h < 8 || w > 32 || h > 32) return false
  const aspect = w / h
  if (aspect < 0.7 || aspect > 1.35) return false

  // Top should be narrower than bottom (dome tapering down to wide rim)
  let topWidth = 0
  for (let cx = x; cx < x + w; cx++) {
    if (mask[y * canvasW + cx] === 1) topWidth++
  }

  let botRimWidth = 0
  const rimY = y + Math.round(h * 0.8)
  for (let cx = x; cx < x + w; cx++) {
    if (mask[rimY * canvasW + cx] === 1) botRimWidth++
  }

  return botRimWidth >= w * 0.75 && topWidth <= w * 0.5
}

// ------------------------------------------------------
// 6. FLUID / DROPLET ICON
// ------------------------------------------------------

export function isDropletShape(mask, canvasW, x, y, w, h) {
  if (w < 6 || h < 8 || w > 28 || h > 36) return false
  if (h <= w * 1.1) return false // Must be taller than wide

  // Top tip is very narrow (1 to 3px)
  let tipWidth = 0
  for (let cx = x; cx < x + w; cx++) {
    if (mask[y * canvasW + cx] === 1) tipWidth++
  }

  // Lower third is wide and rounded
  const bulbY = y + Math.round(h * 0.7)
  let bulbWidth = 0
  for (let cx = x; cx < x + w; cx++) {
    if (mask[bulbY * canvasW + cx] === 1) bulbWidth++
  }

  return tipWidth <= 3 && bulbWidth >= w * 0.7
}

// ------------------------------------------------------
// 7. BLUETOOTH SYMBOL
// ------------------------------------------------------

export function isBluetoothShape(mask, canvasW, x, y, w, h) {
  if (w < 6 || h < 10 || w > 24 || h > 36) return false
  const aspect = w / h
  if (aspect < 0.35 || aspect > 0.75) return false

  // Vertical spine roughly down the center
  const midX = x + Math.round(w / 2)
  let spineHits = 0
  for (let cy = y; cy < y + h; cy++) {
    if (mask[cy * canvasW + midX] === 1 || mask[cy * canvasW + midX - 1] === 1) spineHits++
  }

  return spineHits >= h * 0.75
}

// ------------------------------------------------------
// 8. CHECKBOX DETECTION
// ------------------------------------------------------

export function detectCheckbox(mask, canvasW, x, y, w, h) {
  if (w < 8 || h < 8 || w > 24 || h > 24) return null
  const aspect = w / h
  if (aspect < 0.85 || aspect > 1.18) return null

  // Check outer frame edges
  let borderHits = 0
  for (let cx = x; cx < x + w; cx++) {
    if (mask[y * canvasW + cx] === 1) borderHits++
    if (mask[(y + h - 1) * canvasW + cx] === 1) borderHits++
  }
  for (let cy = y; cy < y + h; cy++) {
    if (mask[cy * canvasW + x] === 1) borderHits++
    if (mask[cy * canvasW + (x + w - 1)] === 1) borderHits++
  }

  const expectedBorder = (w + h) * 2 - 4
  if (borderHits < expectedBorder * 0.65) return null

  // Check internal diagonal checkmark
  const innerX1 = x + 2
  const innerX2 = x + w - 3
  const innerY1 = y + 2
  const innerY2 = y + h - 3
  const innerPixels = (innerX2 - innerX1 + 1) * (innerY2 - innerY1 + 1)

  if (innerPixels <= 0) return null

  let innerFg = 0
  for (let cy = innerY1; cy <= innerY2; cy++) {
    for (let cx = innerX1; cx <= innerX2; cx++) {
      if (mask[cy * canvasW + cx] === 1) innerFg++
    }
  }

  const innerDensity = innerFg / innerPixels
  if (innerFg >= 3 && innerDensity <= 0.65) {
    return 'checked'
  }

  return null
}

// ------------------------------------------------------
// BUILDERS & HELPERS
// ------------------------------------------------------

function buildSymbolTextElement(glyph, name, x, y, w, h, color) {
  const fontSize = Math.max(8, Math.round(h * 1.05))
  return {
    type: 'text',
    name,
    text: glyph,
    x,
    y,
    width: Math.max(1, w),
    height: Math.max(1, h),
    fontSize,
    fontFamily: 'monospace',
    fontWeight: 400,
    textAlign: 'left',
    color,
    source: 'analysis',
  }
}

function isGlyphInsideText(x, y, w, h, textRegions) {
  if (!textRegions || textRegions.length === 0) return false

  for (const t of textRegions) {
    const pad = 2
    const textLeft = (t.x || 0) - pad
    const textRight = textLeft + (t.width || 0) + pad * 2
    const textTop = (t.y || 0) - pad
    const textBottom = textTop + (t.height || 0) + pad * 2

    const insideX = x >= textLeft && (x + w) <= textRight
    const insideY = y >= textTop && (y + h) <= textBottom

    if (insideX && insideY && (w * h) < (t.width * t.height * 0.70)) {
      return true
    }
  }
  return false
}
