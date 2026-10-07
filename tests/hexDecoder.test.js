import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseHexInput,
  suggestDimensions,
  calculateHeightFromWidth,
  decodeHexToImageData,
  getPixelAt,
  HEX_SAMPLES,
} from '../src/display/hexDecoder.js'
import {
  generateMonochromeBytes,
  formatCSource,
} from '../src/export/cExport.js'

test('parseHexInput handles C arrays with 0x prefixes and comments', () => {
  const code = `
    // Adafruit OLED bitmap
    #define LOGO_WIDTH 16
    #define LOGO_HEIGHT 8
    /* 16 bytes test */
    static const unsigned char PROGMEM my_logo[] = {
      0x00, 0xFF, 0xAA, 0x55, 0x12, 0x34, 0x56, 0x78,
      0x9A, 0xBC, 0xDE, 0xF0, 0x01, 0x02, 0x04, 0x08
    };
  `
  const result = parseHexInput(code)
  assert.equal(result.totalBytes, 16)
  assert.equal(result.totalBits, 128)
  assert.equal(result.detectedWidth, 16)
  assert.equal(result.detectedHeight, 8)
  assert.equal(result.variableName, 'my_logo')
  assert.equal(result.bytes[0], 0x00)
  assert.equal(result.bytes[1], 0xff)
  assert.equal(result.bytes[2], 0xaa)
  assert.equal(result.bytes[15], 0x08)
})

test('parseHexInput handles XBM header format and suggests xbm format', () => {
  const xbmCode = `
    #define icon_sample_width 32
    #define icon_sample_height 16
    static unsigned char icon_sample_bits[] = {
      0x01, 0x02, 0x04, 0x08
    };
  `
  const result = parseHexInput(xbmCode)
  assert.equal(result.detectedWidth, 32)
  assert.equal(result.detectedHeight, 16)
  assert.equal(result.formatSuggestion, 'xbm')
  assert.equal(result.totalBytes, 4)
  assert.equal(result.bytes[0], 0x01)
  assert.equal(result.bytes[3], 0x08)
})

test('parseHexInput handles space-separated hex pairs and continuous hex strings', () => {
  const spaceHex = 'A1 B2 C3 D4 E5 F6 07 18'
  const res1 = parseHexInput(spaceHex)
  assert.equal(res1.totalBytes, 8)
  assert.equal(res1.bytes[0], 0xa1)
  assert.equal(res1.bytes[7], 0x18)

  const continuousHex = 'deadbeefcafe'
  const res2 = parseHexInput(continuousHex)
  assert.equal(res2.totalBytes, 6)
  assert.equal(res2.bytes[0], 0xde)
  assert.equal(res2.bytes[1], 0xad)
  assert.equal(res2.bytes[2], 0xbe)
  assert.equal(res2.bytes[3], 0xef)
})

test('parseHexInput handles escaped hex and hexdump prefixes', () => {
  const hexdump = `
    00000000: 01 02 03 04
    00000004: 05 06 07 08
  `
  const result = parseHexInput(hexdump)
  assert.equal(result.totalBytes, 8)
  assert.equal(result.bytes[0], 1)
  assert.equal(result.bytes[7], 8)
})

test('suggestDimensions finds exact matching LCD resolutions', () => {
  // 1024 bytes -> 128x64 SSD1306 OLED
  const suggestions1024 = suggestDimensions(1024, 'adafruit')
  const ssd1306 = suggestions1024.find(s => s.width === 128 && s.height === 64)
  assert.ok(ssd1306, 'Should suggest 128x64 for 1024 bytes')
  assert.equal(ssd1306.exact, true)

  // 504 bytes -> 84x48 Nokia 5110
  const suggestions504 = suggestDimensions(504, 'adafruit')
  const nokia = suggestions504.find(s => s.width === 84 && s.height === 48)
  assert.ok(nokia, 'Should suggest 84x48 for 504 bytes')

  // 512 bytes -> 128x32 SSD1306
  const suggestions512 = suggestDimensions(512, 'adafruit')
  const oled128x32 = suggestions512.find(s => s.width === 128 && s.height === 32)
  assert.ok(oled128x32, 'Should suggest 128x32 for 512 bytes')
})

test('calculateHeightFromWidth correctly computes height for various formats', () => {
  // 1-bit monochrome 1024 bytes with width 128 (16 bytes per row) -> 64 rows
  assert.equal(calculateHeightFromWidth(1024, 128, 'adafruit'), 64)

  // U8g2 vertical page mode 1024 bytes with width 128 -> 8 pages * 8 = 64 rows
  assert.equal(calculateHeightFromWidth(1024, 128, 'u8g2'), 64)

  // RGB565 2048 bytes with width 32 (32 * 2 = 64 bytes/row) -> 32 rows
  assert.equal(calculateHeightFromWidth(2048, 32, 'rgb565_be'), 32)

  // Gray8 512 bytes with width 64 -> 8 rows
  assert.equal(calculateHeightFromWidth(512, 64, 'gray8'), 8)
})

test('decodeHexToImageData decodes Adafruit MSB-first bytes into correct pixels', () => {
  // 8x2 image:
  // Row 0: 0xF0 (11110000) -> pixels 0..3 ON, 4..7 OFF
  // Row 1: 0x0F (00001111) -> pixels 0..3 OFF, 4..7 ON
  const bytes = new Uint8Array([0xf0, 0x0f])
  const result = decodeHexToImageData(bytes, 8, 2, {
    format: 'adafruit',
    fgColor: '#ffffff',
    bgColor: '#000000',
    invert: false,
  })

  assert.equal(result.width, 8)
  assert.equal(result.height, 2)

  function isPixelOn(x, y) {
    const idx = (y * 8 + x) * 4
    return result.data[idx] === 255 // white
  }

  // Row 0
  assert.equal(isPixelOn(0, 0), true)
  assert.equal(isPixelOn(1, 0), true)
  assert.equal(isPixelOn(2, 0), true)
  assert.equal(isPixelOn(3, 0), true)
  assert.equal(isPixelOn(4, 0), false)
  assert.equal(isPixelOn(7, 0), false)

  // Row 1
  assert.equal(isPixelOn(0, 1), false)
  assert.equal(isPixelOn(3, 1), false)
  assert.equal(isPixelOn(4, 1), true)
  assert.equal(isPixelOn(7, 1), true)
})

test('decodeHexToImageData decodes XBM LSB-first bytes into correct pixels', () => {
  // 8x1 image: 0x03 (00000011 in binary, bit 0 and bit 1 ON)
  // In LSB-first: bit 0 = pixel 0, bit 1 = pixel 1, bit 2..7 = pixel 2..7
  const bytes = new Uint8Array([0x03])
  const result = decodeHexToImageData(bytes, 8, 1, {
    format: 'xbm',
    fgColor: '#ffffff',
    bgColor: '#000000',
  })

  function isPixelOn(x) {
    const idx = x * 4
    return result.data[idx] === 255
  }

  assert.equal(isPixelOn(0), true)
  assert.equal(isPixelOn(1), true)
  assert.equal(isPixelOn(2), false)
  assert.equal(isPixelOn(7), false)
})

test('decodeHexToImageData decodes U8g2 vertical page mode bytes into correct pixels', () => {
  // 2x8 image (1 page high, 2 columns):
  // Col 0: 0x03 (bits 0 and 1 = 1) -> y=0 and y=1 ON, y=2..7 OFF
  // Col 1: 0x80 (bit 7 = 1) -> y=0..6 OFF, y=7 ON
  const bytes = new Uint8Array([0x03, 0x80])
  const result = decodeHexToImageData(bytes, 2, 8, {
    format: 'u8g2',
    fgColor: '#ffffff',
    bgColor: '#000000',
  })

  function isPixelOn(x, y) {
    const idx = (y * 2 + x) * 4
    return result.data[idx] === 255
  }

  // Col 0
  assert.equal(isPixelOn(0, 0), true)
  assert.equal(isPixelOn(0, 1), true)
  assert.equal(isPixelOn(0, 2), false)
  assert.equal(isPixelOn(0, 7), false)

  // Col 1
  assert.equal(isPixelOn(1, 0), false)
  assert.equal(isPixelOn(1, 6), false)
  assert.equal(isPixelOn(1, 7), true)
})

test('decodeHexToImageData supports invert flag', () => {
  const bytes = new Uint8Array([0xff])
  const regular = decodeHexToImageData(bytes, 8, 1, { format: 'adafruit', invert: false, fgColor: '#ffffff', bgColor: '#000000' })
  const inverted = decodeHexToImageData(bytes, 8, 1, { format: 'adafruit', invert: true, fgColor: '#ffffff', bgColor: '#000000' })

  // When not inverted, 0xFF means all ON (255)
  assert.equal(regular.data[0], 255)
  // When inverted, 0xFF means all OFF (0)
  assert.equal(inverted.data[0], 0)
})

test('decodeHexToImageData supports RGB565 color format', () => {
  // 1x1 image: Pure Red in RGB565 is 0xF800 (11111 000000 00000)
  // BE: 0xF8, 0x00
  const bytes = new Uint8Array([0xf8, 0x00])
  const result = decodeHexToImageData(bytes, 1, 1, { format: 'rgb565_be' })

  assert.equal(result.data[0], 255) // R
  assert.equal(result.data[1], 0)   // G
  assert.equal(result.data[2], 0)   // B
})

test('Round-trip: C export generated bytes decoded by hexDecoder perfectly match original', () => {
  // Create a 16x8 test pattern
  const width = 16
  const height = 8
  const origData = new Uint8ClampedArray(width * height * 4)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const on = (x + y) % 3 === 0
      const val = on ? 255 : 0
      origData[idx] = val
      origData[idx + 1] = val
      origData[idx + 2] = val
      origData[idx + 3] = 255
    }
  }

  // 1. Export to C Header
  const cBytes = generateMonochromeBytes({ width, height, data: origData }, { format: 'adafruit' })
  const cSource = formatCSource({ bitmapBytes: cBytes, width, height, format: 'adafruit' })

  // 2. Parse C Header back with parseHexInput
  const parsed = parseHexInput(cSource)
  assert.equal(parsed.totalBytes, cBytes.length)

  // 3. Decode back to image data
  const decoded = decodeHexToImageData(parsed.bytes, width, height, {
    format: 'adafruit',
    fgColor: '#ffffff',
    bgColor: '#000000',
  })

  // 4. Verify every single pixel matches!
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const origOn = origData[idx] > 128
      const decodedOn = decoded.data[idx] > 128
      assert.equal(decodedOn, origOn, `Pixel at (${x}, ${y}) should match original!`)
    }
  }
})

test('getPixelAt accurately inspects bit and byte coordinates', () => {
  const bytes = new Uint8Array([0x80, 0x01])
  const p0 = getPixelAt(bytes, 16, 1, 0, 0, { format: 'adafruit' })
  assert.equal(p0.byteIndex, 0)
  assert.equal(p0.bitIndex, 7)
  assert.equal(p0.isOn, true)
  assert.equal(p0.hexByte, '0x80')

  const p1 = getPixelAt(bytes, 16, 1, 1, 0, { format: 'adafruit' })
  assert.equal(p1.byteIndex, 0)
  assert.equal(p1.bitIndex, 6)
  assert.equal(p1.isOn, false)

  const p15 = getPixelAt(bytes, 16, 1, 15, 0, { format: 'adafruit' })
  assert.equal(p15.byteIndex, 1)
  assert.equal(p15.bitIndex, 0)
  assert.equal(p15.isOn, true)
})

test('HEX_SAMPLES provides valid built-in demonstration hex codes', () => {
  assert.ok(HEX_SAMPLES.length >= 4)
  for (const sample of HEX_SAMPLES) {
    const code = sample.getCode()
    assert.ok(code.length > 20, `${sample.name} should return code`)
    const parsed = parseHexInput(code)
    assert.ok(parsed.totalBytes > 0, `${sample.name} should parse valid bytes`)
  }
})
