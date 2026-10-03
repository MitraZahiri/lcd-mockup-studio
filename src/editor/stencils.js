import { createId, editorState, addElements } from './state.js'

function getCenter(width, height) {
  const dispW = editorState.display.width || 320
  const dispH = editorState.display.height || 240
  return {
    x: Math.max(0, Math.round((dispW - width) / 2)),
    y: Math.max(0, Math.round((dispH - height) / 2)),
  }
}

export function generateBatteryStencil(options = {}) {
  const width = Math.max(40, options.width || 60)
  const height = Math.max(20, options.height || 28)
  const center = getCenter(width, height)
  const x = options.x !== undefined ? options.x : center.x
  const y = options.y !== undefined ? options.y : center.y
  const strokeColor = options.stroke || '#a8d9a8'
  const fillColor = options.fill || '#a8d9a8'
  const level = options.level !== undefined ? options.level : 3 // 0 to 3 bars

  const bodyW = width - 6
  const elements = []

  // Battery Main Outer Frame
  elements.push({
    id: createId(),
    type: 'rectangle',
    name: 'Battery Frame',
    x,
    y,
    width: bodyW,
    height,
    fill: 'transparent',
    stroke: strokeColor,
    strokeWidth: 2,
  })

  // Anode Terminal
  const termH = Math.round(height * 0.45)
  elements.push({
    id: createId(),
    type: 'rectangle',
    name: 'Battery Anode',
    x: x + bodyW,
    y: y + Math.round((height - termH) / 2),
    width: 6,
    height: termH,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: 1,
  })

  // Charge Bars (3 segments)
  const innerPad = 4
  const availW = bodyW - (innerPad * 2) - 4
  const barW = Math.max(2, Math.floor(availW / 3))
  const barH = height - (innerPad * 2)

  for (let i = 0; i < Math.min(3, Math.max(0, level)); i++) {
    elements.push({
      id: createId(),
      type: 'rectangle',
      name: `Battery Bar ${i + 1}`,
      x: x + innerPad + (i * (barW + 2)),
      y: y + innerPad,
      width: barW,
      height: barH,
      fill: fillColor,
      stroke: fillColor,
      strokeWidth: 1,
    })
  }

  return elements
}

export function generateProgressBarStencil(options = {}) {
  const width = Math.max(80, options.width || 180)
  const height = Math.max(16, options.height || 26)
  const percent = Math.min(100, Math.max(0, options.percent !== undefined ? options.percent : 65))
  const center = getCenter(width, height)
  const x = options.x !== undefined ? options.x : center.x
  const y = options.y !== undefined ? options.y : center.y
  const strokeColor = options.stroke || '#a8d9a8'
  const fillColor = options.fill || '#a8d9a8'

  const elements = []

  // Outer frame
  elements.push({
    id: createId(),
    type: 'rectangle',
    name: 'Progress Frame',
    x,
    y,
    width,
    height,
    fill: 'transparent',
    stroke: strokeColor,
    strokeWidth: 2,
  })

  // Inner fill bar
  const pad = 3
  const fillTotalW = width - (pad * 2)
  const fillCurrentW = Math.max(1, Math.round(fillTotalW * (percent / 100)))
  elements.push({
    id: createId(),
    type: 'rectangle',
    name: 'Progress Fill',
    x: x + pad,
    y: y + pad,
    width: fillCurrentW,
    height: height - (pad * 2),
    fill: fillColor,
    stroke: fillColor,
    strokeWidth: 1,
  })

  // Percentage Text label
  elements.push({
    id: createId(),
    type: 'text',
    name: 'Progress Label',
    x: x + width + 8,
    y: y + Math.round((height - 18) / 2),
    width: 48,
    height: 18,
    text: `${percent}%`,
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: 700,
    color: strokeColor,
  })

  return elements
}

export function generateStatusBadgeStencil(options = {}) {
  const width = Math.max(60, options.width || 100)
  const height = Math.max(20, options.height || 32)
  const label = options.label || 'READY'
  const center = getCenter(width, height)
  const x = options.x !== undefined ? options.x : center.x
  const y = options.y !== undefined ? options.y : center.y
  const strokeColor = options.stroke || '#a8d9a8'
  const bgFill = options.fill || '#25382b'

  const elements = []

  // Badge Container Box
  elements.push({
    id: createId(),
    type: 'rectangle',
    name: 'Badge Box',
    x,
    y,
    width,
    height,
    fill: bgFill,
    stroke: strokeColor,
    strokeWidth: 2,
  })

  // Badge Text
  elements.push({
    id: createId(),
    type: 'text',
    name: 'Badge Text',
    x: x + 4,
    y: y + Math.round((height - 18) / 2),
    width: width - 8,
    height: 18,
    text: label,
    fontSize: 14,
    fontFamily: 'Courier New',
    fontWeight: 700,
    color: strokeColor,
  })

  return elements
}

export function generateNumericGaugeStencil(options = {}) {
  const width = Math.max(100, options.width || 140)
  const height = Math.max(50, options.height || 64)
  const label = options.label || 'TEMP'
  const value = options.value || '24.5'
  const unit = options.unit || '°C'
  const center = getCenter(width, height)
  const x = options.x !== undefined ? options.x : center.x
  const y = options.y !== undefined ? options.y : center.y
  const strokeColor = options.stroke || '#a8d9a8'

  const elements = []

  // Gauge Card Box
  elements.push({
    id: createId(),
    type: 'rectangle',
    name: `${label} Card`,
    x,
    y,
    width,
    height,
    fill: 'transparent',
    stroke: strokeColor,
    strokeWidth: 1,
  })

  // Label Header
  elements.push({
    id: createId(),
    type: 'text',
    name: `${label} Header`,
    x: x + 6,
    y: y + 4,
    width: width - 12,
    height: 16,
    text: label,
    fontSize: 10,
    fontFamily: 'Courier New',
    fontWeight: 600,
    color: strokeColor,
  })

  // Value Display Readout
  elements.push({
    id: createId(),
    type: 'text',
    name: `${label} Value`,
    x: x + 6,
    y: y + 24,
    width: width - 42,
    height: 32,
    text: value,
    fontSize: 22,
    fontFamily: 'Courier New',
    fontWeight: 700,
    color: strokeColor,
  })

  // Unit
  elements.push({
    id: createId(),
    type: 'text',
    name: `${label} Unit`,
    x: x + width - 36,
    y: y + 32,
    width: 30,
    height: 20,
    text: unit,
    fontSize: 12,
    fontFamily: 'Courier New',
    fontWeight: 600,
    color: strokeColor,
  })

  return elements
}

export function insertStencil(type, options = {}) {
  let elements = []
  if (type === 'battery') elements = generateBatteryStencil(options)
  else if (type === 'progress') elements = generateProgressBarStencil(options)
  else if (type === 'badge') elements = generateStatusBadgeStencil(options)
  else if (type === 'gauge') elements = generateNumericGaugeStencil(options)

  if (elements.length > 0) {
    addElements(elements)
  }
  return elements
}
