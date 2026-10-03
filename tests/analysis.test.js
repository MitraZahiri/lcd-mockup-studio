import test from 'node:test'
import assert from 'node:assert/strict'
import {
  detectGeometry,
  lineGeometryToElement,
  rectangleGeometryToElement,
  circleGeometryToElement,
} from '../src/analysis/geometryDetector.js'
import { extractDominantColors } from '../src/analysis/imageProcessing.js'
import { sanitizeRecognizedText } from '../src/analysis/ocr/ocrExtractor.js'
import { validateProject } from '../src/project/projectFormat.js'

function createEmptyMask(width, height) {
  return new Uint8Array(width * height)
}

test('detectGeometry detects standalone horizontal and vertical lines', () => {
  const width = 100
  const height = 100
  const mask = createEmptyMask(width, height)

  // Draw horizontal line: y = 20, x from 10 to 60 (len = 50)
  for (let x = 10; x <= 60; x++) {
    mask[20 * width + x] = 1
  }

  // Draw vertical line: x = 80, y from 10 to 60 (len = 50)
  for (let y = 10; y <= 60; y++) {
    mask[y * width + 80] = 1
  }

  const { lines, rectangles } = detectGeometry(mask, width, height)

  assert.equal(rectangles.length, 0)
  assert.equal(lines.length, 2)

  const hLine = lines.find(l => l.orientation === 'horizontal')
  const vLine = lines.find(l => l.orientation === 'vertical')

  assert.ok(hLine)
  assert.ok(vLine)
  assert.equal(hLine.y, 20)
  assert.equal(vLine.x, 80)
})

test('detectGeometry recognizes rectangular frame and absorbs edge lines', () => {
  const width = 120
  const height = 120
  const mask = createEmptyMask(width, height)

  // Draw a 60x40 box at (20, 20)
  const left = 20
  const right = 80
  const top = 20
  const bot = 60

  // Top & bottom edges
  for (let x = left; x <= right; x++) {
    mask[top * width + x] = 1
    mask[bot * width + x] = 1
  }
  // Left & right edges
  for (let y = top; y <= bot; y++) {
    mask[y * width + left] = 1
    mask[y * width + right] = 1
  }

  const { lines, rectangles } = detectGeometry(mask, width, height)

  assert.equal(rectangles.length, 1)
  assert.equal(rectangles[0].x, left)
  assert.equal(rectangles[0].y, top)
  assert.equal(rectangles[0].width, 61)
  assert.equal(rectangles[0].height, 41)

  // Edge lines should be absorbed into the rectangle
  assert.equal(lines.length, 0)
})

test('detectGeometry suppresses lines that overlap inside text regions', () => {
  const width = 100
  const height = 100
  const mask = createEmptyMask(width, height)

  // Short horizontal stroke at y = 15, x = 12..25 (len = 14)
  for (let x = 12; x <= 25; x++) {
    mask[15 * width + x] = 1
  }

  // Define text region covering x = 10..30, y = 10..22
  const textRegions = [{ x: 10, y: 10, width: 20, height: 12 }]

  const { lines } = detectGeometry(mask, width, height, textRegions)
  assert.equal(lines.length, 0) // Should be suppressed
})

test('geometry elements pass validateProject schema', () => {
  const lineEl = lineGeometryToElement({ x: 10, y: 20, width: 80, height: 2, orientation: 'horizontal' }, '#33ff33')
  const rectEl = rectangleGeometryToElement({ x: 5, y: 5, width: 50, height: 30, strokeWidth: 2 }, '#33ff33')

  lineEl.id = 'line-1'
  rectEl.id = 'rect-1'

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Geometry Test',
    display: { width: 320, height: 240, background: '#002200' },
    grid: { enabled: true, snap: true, size: 8 },
    elements: [lineEl, rectEl],
  }

  const validated = validateProject(project)
  assert.equal(validated.elements.length, 2)
  assert.equal(validated.elements[0].type, 'line')
  assert.equal(validated.elements[1].type, 'rectangle')
})

test('extractDominantColors computes correct background and foreground hex colors', () => {
  const width = 4
  const height = 4
  const data = new Uint8ClampedArray(width * height * 4)
  const mask = new Uint8Array(width * height)

  // Fill background with dark navy (0, 30, 60)
  // Fill 4 foreground pixels with bright cyan (0, 200, 255)
  for (let i = 0; i < 16; i++) {
    if (i < 4) {
      mask[i] = 1
      data[i * 4] = 0
      data[i * 4 + 1] = 200
      data[i * 4 + 2] = 255
      data[i * 4 + 3] = 255
    } else {
      mask[i] = 0
      data[i * 4] = 0
      data[i * 4 + 1] = 30
      data[i * 4 + 2] = 60
      data[i * 4 + 3] = 255
    }
  }

  const colors = extractDominantColors({ data }, mask)
  assert.equal(colors.foreground, '#00c8ff')
  assert.equal(colors.background, '#001e3c')
})

test('detectGeometry detects solid badges and progress bars', () => {
  const width = 100
  const height = 100
  const mask = createEmptyMask(width, height)

  // Draw a 30x10 solid badge at (10, 10)
  for (let y = 10; y < 20; y++) {
    for (let x = 10; x < 40; x++) {
      mask[y * width + x] = 1
    }
  }

  const { rectangles } = detectGeometry(mask, width, height)
  assert.ok(rectangles.length >= 1)
  const badge = rectangles.find(r => r.filled && r.x === 10 && r.y === 10)
  assert.ok(badge)
  assert.equal(badge.width, 30)
  assert.equal(badge.height, 10)
  assert.equal(badge.filled, true)
})

test('detectGeometry detects circular indicator dots', () => {
  const width = 80
  const height = 80
  const mask = createEmptyMask(width, height)

  // Draw a 6x6 circle at (20, 20) with empty corners
  // Corners at (20, 20), (25, 20), (20, 25), (25, 25) are left 0
  for (let y = 20; y <= 25; y++) {
    for (let x = 20; x <= 25; x++) {
      const isCorner =
        (x === 20 && y === 20) ||
        (x === 25 && y === 20) ||
        (x === 20 && y === 25) ||
        (x === 25 && y === 25)
      if (!isCorner) {
        mask[y * width + x] = 1
      }
    }
  }

  const { circles } = detectGeometry(mask, width, height)
  assert.ok(circles.length >= 1)
  const circle = circles[0]
  assert.equal(circle.x, 20)
  assert.equal(circle.y, 20)
  assert.equal(circle.width, 6)
  assert.equal(circle.height, 6)
  assert.equal(circle.fill, 'solid')
})

test('circle and solid badge elements pass validateProject schema', () => {
  const circleEl = circleGeometryToElement({ x: 15, y: 15, width: 10, height: 10, fill: 'solid' }, '#00ff88')
  const badgeEl = rectangleGeometryToElement({ x: 5, y: 5, width: 40, height: 12, filled: true }, '#00ff88')

  circleEl.id = 'circ-1'
  badgeEl.id = 'badge-1'

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Shapes Test',
    display: { width: 128, height: 64, background: '#001100' },
    grid: { enabled: true, snap: false, size: 8 },
    elements: [circleEl, badgeEl],
  }

  const validated = validateProject(project)
  assert.equal(validated.elements.length, 2)
  assert.equal(validated.elements[0].type, 'circle')
  assert.equal(validated.elements[0].fill, '#00ff88')
  assert.equal(validated.elements[1].type, 'rectangle')
  assert.equal(validated.elements[1].fill, '#00ff88')
})

test('sanitizeRecognizedText handles clock, 7-segment substitutions, and telemetry units', () => {
  // Clock with spaces
  assert.equal(sanitizeRecognizedText('12 : 30'), '12:30')
  assert.equal(sanitizeRecognizedText('09 : 45 : 12'), '09:45:12')

  // Spaced decimal
  assert.equal(sanitizeRecognizedText('24 . 5'), '24.5')

  // 7-segment O to 0 in decimal & numbers
  assert.equal(sanitizeRecognizedText('24.O'), '24.0')
  assert.equal(sanitizeRecognizedText('1O0'), '100')

  // 7-segment S to 5 in decimal
  assert.equal(sanitizeRecognizedText('2S.4'), '25.4')

  // Temperature
  assert.equal(sanitizeRecognizedText('23 *C'), '23 °C')
  assert.equal(sanitizeRecognizedText('75 oF'), '75 °F')

  // Units
  assert.equal(sanitizeRecognizedText('100%'), '100%')
  assert.equal(sanitizeRecognizedText('50Hz'), '50 Hz')
  assert.equal(sanitizeRecognizedText('12V'), '12 V')
})

