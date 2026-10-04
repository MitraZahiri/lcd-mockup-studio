import test from 'node:test'
import assert from 'node:assert/strict'
import { detectGeometry } from '../src/analysis/geometryDetector.js'
import {
  detectArrowTriangle,
  isLockShape,
  isBellShape,
  isDropletShape,
  detectCheckbox,
} from '../src/analysis/symbolDetector.js'
import { sanitizeRecognizedText } from '../src/analysis/ocr/ocrExtractor.js'
import { validateProject } from '../src/project/projectFormat.js'

function createEmptyMask(width, height) {
  return new Uint8Array(width * height)
}

test('detectGeometry recognizes ascending signal strength bars', () => {
  const width = 80
  const height = 60
  const mask = createEmptyMask(width, height)

  // Draw 4 ascending signal bars aligned on bottom baseline y = 30
  // Bar 1: h = 6 (y = 24..29), x = 10..12
  // Bar 2: h = 10 (y = 20..29), x = 15..17
  // Bar 3: h = 14 (y = 16..29), x = 20..22
  // Bar 4: h = 18 (y = 12..29), x = 25..27
  const bars = [
    { x: 10, y: 24, w: 3, h: 6 },
    { x: 15, y: 20, w: 3, h: 10 },
    { x: 20, y: 16, w: 3, h: 14 },
    { x: 25, y: 12, w: 3, h: 18 },
  ]

  for (const bar of bars) {
    for (let py = bar.y; py < bar.y + bar.h; py++) {
      for (let px = bar.x; px < bar.x + bar.w; px++) {
        mask[py * width + px] = 1
      }
    }
  }

  const { symbols } = detectGeometry(mask, width, height)
  assert.ok(symbols.length >= 4)
  const signalBars = symbols.filter(s => s.name?.includes('Signal Bar'))
  assert.equal(signalBars.length, 4)
  assert.equal(signalBars[0].name, 'Detected Signal Bar 1/4')
  assert.equal(signalBars[3].name, 'Detected Signal Bar 4/4')
})

test('detectGeometry recognizes battery icon with charge level', () => {
  const width = 80
  const height = 40
  const mask = createEmptyMask(width, height)

  // Battery body: x = 10, y = 10, w = 30, h = 16
  const bx = 10, by = 10, bw = 30, bh = 16
  // Terminal nub: x = 40, y = 14, w = 3, h = 8
  const tx = 40, ty = 14, tw = 3, th = 8

  // Draw outer body frame
  for (let x = bx; x < bx + bw; x++) {
    mask[by * width + x] = 1
    mask[(by + bh - 1) * width + x] = 1
  }
  for (let y = by; y < by + bh; y++) {
    mask[y * width + bx] = 1
    mask[y * width + (bx + bw - 1)] = 1
  }

  // Draw terminal nub
  for (let y = ty; y < ty + th; y++) {
    for (let x = tx; x < tx + tw; x++) {
      mask[y * width + x] = 1
    }
  }

  // Draw internal charge fill inside (50% full)
  for (let y = by + 2; y <= by + bh - 3; y++) {
    for (let x = bx + 2; x <= bx + 14; x++) {
      mask[y * width + x] = 1
    }
  }

  const { symbols } = detectGeometry(mask, width, height)
  assert.ok(symbols.length >= 2)

  const frame = symbols.find(s => s.name?.includes('Battery Frame'))
  const terminal = symbols.find(s => s.name?.includes('Battery Terminal'))
  const charge = symbols.find(s => s.name?.includes('Battery Charge'))

  assert.ok(frame)
  assert.ok(terminal)
  assert.ok(charge)
})

test('detectArrowTriangle accurately detects directional orientations', () => {
  const width = 30
  const height = 30

  // 1. Right Arrow ▶ (wedge tapering from left to right)
  const rightMask = createEmptyMask(width, height)
  // At x = 5: y = 5..15 (len 11)
  // At x = 15: y = 10 (len 1)
  for (let x = 5; x <= 15; x++) {
    const halfH = Math.round((15 - x) / 2)
    for (let y = 10 - halfH; y <= 10 + halfH; y++) {
      rightMask[y * width + x] = 1
    }
  }
  const rightDir = detectArrowTriangle(rightMask, width, 5, 5, 11, 11, 0.6)
  assert.equal(rightDir, 'right')

  // 2. Down Arrow ▼ (wedge tapering from top to bottom)
  const downMask = createEmptyMask(width, height)
  for (let y = 5; y <= 15; y++) {
    const halfW = Math.round((15 - y) / 2)
    for (let x = 10 - halfW; x <= 10 + halfW; x++) {
      downMask[y * width + x] = 1
    }
  }
  const downDir = detectArrowTriangle(downMask, width, 5, 5, 11, 11, 0.6)
  assert.equal(downDir, 'down')
})

test('detectCheckbox recognizes checked boxes', () => {
  const width = 40
  const height = 40
  const mask = createEmptyMask(width, height)

  const cx = 10, cy = 10, cw = 16, ch = 16

  // Draw box border
  for (let x = cx; x < cx + cw; x++) {
    mask[cy * width + x] = 1
    mask[(cy + ch - 1) * width + x] = 1
  }
  for (let y = cy; y < cy + ch; y++) {
    mask[y * width + cx] = 1
    mask[y * width + (cx + cw - 1)] = 1
  }

  // Draw internal checkmark diagonal stroke
  for (let d = 3; d <= 9; d++) {
    mask[(cy + d) * width + (cx + d)] = 1
  }

  const result = detectCheckbox(mask, width, cx, cy, cw, ch)
  assert.equal(result, 'checked')
})

test('isLockShape detects lock silhouette with hollow shackle', () => {
  const width = 30
  const height = 30
  const mask = createEmptyMask(width, height)

  const lx = 5, ly = 5, lw = 14, lh = 18
  const shackleH = 7

  // Arch shackle: left stem, right stem, top bar, center hollow
  for (let y = ly; y < ly + shackleH; y++) {
    mask[y * width + (lx + 2)] = 1
    mask[y * width + (lx + lw - 3)] = 1
  }
  for (let x = lx + 2; x <= lx + lw - 3; x++) {
    mask[ly * width + x] = 1
  }

  // Solid rectangular base body
  for (let y = ly + shackleH; y < ly + lh; y++) {
    for (let x = lx; x < lx + lw; x++) {
      mask[y * width + x] = 1
    }
  }

  const isLock = isLockShape(mask, width, lx, ly, lw, lh)
  assert.equal(isLock, true)
})

test('sanitizeRecognizedText converts isolated icon artifacts to clean symbols', () => {
  assert.equal(sanitizeRecognizedText('>'), '▶')
  assert.equal(sanitizeRecognizedText('>>'), '▶')
  assert.equal(sanitizeRecognizedText('<'), '◄')
  assert.equal(sanitizeRecognizedText('^'), '▲')
  assert.equal(sanitizeRecognizedText('[=]'), '🔋')
  assert.equal(sanitizeRecognizedText('||||'), '📶')
  assert.equal(sanitizeRecognizedText('[x]'), '☑')
  assert.equal(sanitizeRecognizedText('[X]'), '☑')
  assert.equal(sanitizeRecognizedText('[ ]'), '☐')
  assert.equal(sanitizeRecognizedText('(o)'), '🔘')
  assert.equal(sanitizeRecognizedText('( )'), '⚪')
})

test('all detected symbol elements validate strictly against project schema', () => {
  const width = 80
  const height = 60
  const mask = createEmptyMask(width, height)

  // Add signal bars
  for (let y = 14; y < 20; y++) {
    for (let x = 10; x <= 12; x++) mask[y * width + x] = 1
  }
  for (let y = 10; y < 20; y++) {
    for (let x = 15; x <= 17; x++) mask[y * width + x] = 1
  }
  for (let y = 6; y < 20; y++) {
    for (let x = 20; x <= 22; x++) mask[y * width + x] = 1
  }

  const { symbols } = detectGeometry(mask, width, height)
  assert.ok(symbols.length >= 3)

  symbols.forEach((el, idx) => {
    el.id = `sym-${idx}`
  })

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Symbol Schema Test',
    display: { width: 128, height: 64, background: '#002200' },
    grid: { enabled: true, snap: false, size: 8 },
    elements: symbols,
  }

  const validated = validateProject(project)
  assert.equal(validated.elements.length, symbols.length)
})
