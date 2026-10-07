import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseHexInput,
  suggestDimensions,
  calculateHeightFromWidth,
  decodeHexToImageData,
  decodeBytesToPixels,
  encodePixelsToBytes,
  rotatePixels90,
  flipPixelsX,
  flipPixelsY,
  invertPixels,
  clearPixels,
  floodFillPixels,
  drawLinePixels,
  drawRectPixels,
  formatBytesIntoSource,
  decodeBmpToPixels,
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

test('encodePixelsToBytes and decodeBytesToPixels round-trip for adafruit format', () => {
  const w = 16, h = 8
  const pixels = new Uint8Array(w * h)
  // Draw an X pattern
  for (let i = 0; i < 8; i++) {
    pixels[i * w + i] = 1
    pixels[i * w + (15 - i)] = 1
  }

  const encodedBytes = encodePixelsToBytes(pixels, w, h, 'adafruit')
  assert.equal(encodedBytes.length, 16) // (16 / 8) * 8 = 16 bytes

  const decodedPixels = decodeBytesToPixels(encodedBytes, w, h, 'adafruit')
  assert.deepEqual(decodedPixels, pixels)
})

test('encodePixelsToBytes and decodeBytesToPixels round-trip for xbm format', () => {
  const w = 16, h = 8
  const pixels = new Uint8Array(w * h)
  pixels[0] = 1
  pixels[1] = 1
  pixels[7] = 1
  pixels[8] = 1
  pixels[15] = 1

  const encodedBytes = encodePixelsToBytes(pixels, w, h, 'xbm')
  const decodedPixels = decodeBytesToPixels(encodedBytes, w, h, 'xbm')
  assert.deepEqual(decodedPixels, pixels)
})

test('encodePixelsToBytes and decodeBytesToPixels round-trip for u8g2 page format', () => {
  const w = 12, h = 16 // 2 pages of 12 columns
  const pixels = new Uint8Array(w * h)
  pixels[0 * w + 0] = 1 // page 0, col 0, bit 0
  pixels[7 * w + 0] = 1 // page 0, col 0, bit 7
  pixels[8 * w + 5] = 1 // page 1, col 5, bit 0
  pixels[15 * w + 11] = 1 // page 1, col 11, bit 7

  const encodedBytes = encodePixelsToBytes(pixels, w, h, 'u8g2')
  assert.equal(encodedBytes.length, 24) // 2 pages * 12 cols = 24 bytes

  const decodedPixels = decodeBytesToPixels(encodedBytes, w, h, 'u8g2')
  assert.deepEqual(decodedPixels, pixels)
})

test('pixel transformation functions rotate90, flipX, flipY, invert, clear', () => {
  const w = 4, h = 2
  // Row 0: 1 0 0 0
  // Row 1: 0 0 1 0
  const orig = new Uint8Array([
    1, 0, 0, 0,
    0, 0, 1, 0
  ])

  // Flip X:
  // Row 0: 0 0 0 1
  // Row 1: 0 1 0 0
  const fx = flipPixelsX(orig, w, h)
  assert.deepEqual(fx, new Uint8Array([
    0, 0, 0, 1,
    0, 1, 0, 0
  ]))

  // Flip Y:
  // Row 0: 0 0 1 0
  // Row 1: 1 0 0 0
  const fy = flipPixelsY(orig, w, h)
  assert.deepEqual(fy, new Uint8Array([
    0, 0, 1, 0,
    1, 0, 0, 0
  ]))

  // Invert:
  const inv = invertPixels(orig)
  assert.deepEqual(inv, new Uint8Array([
    0, 1, 1, 1,
    1, 1, 0, 1
  ]))

  // Clear:
  const clr = clearPixels(orig)
  assert.equal(clr.every(v => v === 0), true)

  // Rotate 90° Clockwise: 4x2 becomes 2x4
  // (0,0)->(1,0), (3,0)->(1,3), (2,1)->(0,2)
  const rot = rotatePixels90(orig, w, h)
  assert.equal(rot.width, 2)
  assert.equal(rot.height, 4)
  assert.equal(rot.pixels[0 * 2 + 1], 1) // row 0, col 1
  assert.equal(rot.pixels[2 * 2 + 0], 1) // row 2, col 0
})

test('floodFillPixels fills connected region properly', () => {
  const w = 4, h = 4
  const pixels = new Uint8Array(16)
  // Fill all from center
  floodFillPixels(pixels, w, h, 1, 1, 1)
  assert.equal(pixels.every(v => v === 1), true)

  // With a barrier line
  const boxed = new Uint8Array(16)
  // Column 2 is barrier
  boxed[0 * 4 + 2] = 1
  boxed[1 * 4 + 2] = 1
  boxed[2 * 4 + 2] = 1
  boxed[3 * 4 + 2] = 1

  floodFillPixels(boxed, w, h, 0, 0, 1)
  // Left side is 1
  assert.equal(boxed[0 * 4 + 0], 1)
  assert.equal(boxed[1 * 4 + 1], 1)
  // Right side untouched (remains 0)
  assert.equal(boxed[0 * 4 + 3], 0)
  assert.equal(boxed[1 * 4 + 3], 0)
})

test('drawLinePixels and drawRectPixels render correct geometric shapes', () => {
  const w = 8, h = 8
  const lineBuf = new Uint8Array(64)
  drawLinePixels(lineBuf, w, h, 0, 0, 7, 7, 1)
  assert.equal(lineBuf[0], 1)
  assert.equal(lineBuf[7 * 8 + 7], 1)
  assert.equal(lineBuf[3 * 8 + 3], 1)

  const rectBuf = new Uint8Array(64)
  drawRectPixels(rectBuf, w, h, 1, 1, 4, 4, 1)
  // Corners
  assert.equal(rectBuf[1 * 8 + 1], 1)
  assert.equal(rectBuf[1 * 8 + 4], 1)
  assert.equal(rectBuf[4 * 8 + 1], 1)
  assert.equal(rectBuf[4 * 8 + 4], 1)
  // Interior remains 0
  assert.equal(rectBuf[2 * 8 + 2], 0)
})

test('formatBytesIntoSource updates C array in place preserving defines and variable names', () => {
  const origSource = `
#define MY_ICON_WIDTH 16
#define MY_ICON_HEIGHT 8
static const unsigned char PROGMEM my_icon[] = {
  0x00, 0x00
};
  `
  const newBytes = new Uint8Array([0xff, 0x81, 0xbd, 0xa5])
  const updated = formatBytesIntoSource(origSource, newBytes, 16, 8, 'adafruit', 'my_icon')

  assert.ok(updated.includes('MY_ICON_WIDTH 16'))
  assert.ok(updated.includes('0xFF, 0x81'))
  assert.ok(updated.includes('0xBD, 0xA5'))
})

test('decodeBmpToPixels parses valid 1-bit monochrome BMP binary data', () => {
  // Construct a minimal 8x2 1-bit BMP
  // Row stride = ceil(8*1 / 32) * 4 = 4 bytes
  const rowStride = 4
  const dataSize = rowStride * 2
  const fileSize = 14 + 40 + 8 + dataSize
  const buffer = new ArrayBuffer(fileSize)
  const v = new DataView(buffer)

  // Header
  v.setUint16(0, 0x424D, false) // 'BM'
  v.setUint32(2, fileSize, true)
  v.setUint32(10, 62, true) // offset to data

  // DIB Header
  v.setUint32(14, 40, true) // header size
  v.setInt32(18, 8, true)   // width
  v.setInt32(22, 2, true)   // height (bottom-up)
  v.setUint16(26, 1, true)  // planes
  v.setUint16(28, 1, true)  // 1 bpp
  v.setUint32(34, dataSize, true)

  // Color table (0: black, 1: white)
  v.setUint32(54, 0x00000000, true)
  v.setUint32(58, 0x00ffffff, true)

  // Pixel data: bottom row (y=1) first, then top row (y=0)
  // Row 1 (stored first): 0x0F (00001111)
  v.setUint8(62, 0x0f)
  // Row 0 (stored second): 0xF0 (11110000)
  v.setUint8(62 + rowStride, 0xf0)

  const bmp = decodeBmpToPixels(buffer)
  assert.equal(bmp.width, 8)
  assert.equal(bmp.height, 2)
  // Top row (y=0) was 0xF0: pixels 0..3 ON, 4..7 OFF
  assert.equal(bmp.pixels[0 * 8 + 0], 1)
  assert.equal(bmp.pixels[0 * 8 + 3], 1)
  assert.equal(bmp.pixels[0 * 8 + 4], 0)
  // Bottom row (y=1) was 0x0F: pixels 0..3 OFF, 4..7 ON
  assert.equal(bmp.pixels[1 * 8 + 0], 0)
  assert.equal(bmp.pixels[1 * 8 + 4], 1)
  assert.equal(bmp.pixels[1 * 8 + 7], 1)
})

