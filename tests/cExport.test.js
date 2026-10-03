import test from 'node:test'
import assert from 'node:assert/strict'
import {
  generateMonochromeBytes,
  formatCSource,
} from '../src/export/cExport.js'

function createTestImageData(width, height, fillFn) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const val = fillFn(x, y) ? 255 : 0
      data[idx] = val
      data[idx + 1] = val
      data[idx + 2] = val
      data[idx + 3] = 255
    }
  }
  return { width, height, data }
}

test('generateMonochromeBytes adafruit format packs 8 horizontal pixels MSB-first', () => {
  // 8x2 image: top row has leftmost 4 pixels ON (11110000 = 0xF0)
  // bottom row has all 8 pixels ON (11111111 = 0xFF)
  const img = createTestImageData(8, 2, (x, y) => {
    if (y === 0) return x < 4
    if (y === 1) return true
    return false
  })

  const bytes = generateMonochromeBytes(img, { threshold: 128, invert: false, format: 'adafruit' })
  assert.equal(bytes.length, 2)
  assert.equal(bytes[0], 0xf0)
  assert.equal(bytes[1], 0xff)
})

test('generateMonochromeBytes u8g2 format packs 8 vertical pixels per page LSB-first', () => {
  // 2x8 image (1 page high, 2 columns):
  // Col 0: top 2 pixels ON (bits 0 and 1 = 0x03)
  // Col 1: all 8 pixels ON (0xFF)
  const img = createTestImageData(2, 8, (x, y) => {
    if (x === 0) return y < 2
    if (x === 1) return true
    return false
  })

  const bytes = generateMonochromeBytes(img, { threshold: 128, invert: false, format: 'u8g2' })
  assert.equal(bytes.length, 2)
  assert.equal(bytes[0], 0x03)
  assert.equal(bytes[1], 0xff)
})

test('generateMonochromeBytes xbm format packs 8 horizontal pixels LSB-first', () => {
  // 8x1 image: leftmost 2 pixels ON (bits 0 and 1 = 0x03)
  const img = createTestImageData(8, 1, (x) => x < 2)

  const bytes = generateMonochromeBytes(img, { threshold: 128, invert: false, format: 'xbm' })
  assert.equal(bytes.length, 1)
  assert.equal(bytes[0], 0x03)
})

test('generateMonochromeBytes invert flag flips pixel polarity', () => {
  const img = createTestImageData(8, 1, () => true)

  const normalBytes = generateMonochromeBytes(img, { invert: false, format: 'adafruit' })
  const invertedBytes = generateMonochromeBytes(img, { invert: true, format: 'adafruit' })

  assert.equal(normalBytes[0], 0xff)
  assert.equal(invertedBytes[0], 0x00)
})

test('formatCSource produces valid C header with defines, PROGMEM and hex bytes', () => {
  const bytes = new Uint8Array([0x12, 0x34, 0xab, 0xcd])
  const code = formatCSource({
    bitmapBytes: bytes,
    width: 128,
    height: 64,
    format: 'adafruit',
    variableName: 'my_screen_bmp',
    projectName: 'Demo',
  })

  assert.ok(code.includes('#ifndef MY_SCREEN_BMP_H'))
  assert.ok(code.includes('#define MY_SCREEN_BMP_WIDTH  128'))
  assert.ok(code.includes('#define MY_SCREEN_BMP_HEIGHT 64'))
  assert.ok(code.includes('static const uint8_t PROGMEM my_screen_bmp[]'))
  assert.ok(code.includes('0x12, 0x34, 0xab, 0xcd'))
  assert.ok(code.includes('display.drawBitmap'))
})

test('formatCSource handles XBM format structure correctly', () => {
  const bytes = new Uint8Array([0x55, 0xaa])
  const code = formatCSource({
    bitmapBytes: bytes,
    width: 16,
    height: 1,
    format: 'xbm',
    variableName: 'screen_icon',
  })

  assert.ok(code.includes('#define SCREEN_ICON_WIDTH 16'))
  assert.ok(code.includes('static const unsigned char screen_icon[] = {'))
  assert.ok(code.includes('0x55, 0xaa'))
})
