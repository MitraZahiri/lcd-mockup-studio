/**
 * LCD Mockup Studio — Hex Code to Image Decoder & Previewer
 * Decodes C byte arrays, XBM bitmaps, U8g2 page buffers, MicroPython bytearrays,
 * and raw hex streams into visual pixel bitmaps with real-time hardware simulation.
 */

import { updateDisplay, updateReference, addElement, createId, notify } from '../editor/state.js'
import { setBitmapCache } from '../export/pngExport.js'

/**
 * Parses raw text input containing C arrays, hex dumps, XBM, or raw hex byte streams.
 * Returns parsed byte array, metadata, detected dimensions, and format hints.
 */
export function parseHexInput(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      bytes: new Uint8Array(0),
      totalBytes: 0,
      totalBits: 0,
      detectedWidth: null,
      detectedHeight: null,
      variableName: null,
      formatSuggestion: 'adafruit',
    }
  }

  let text = rawText

  // 1. Detect XBM / C Header Dimensions (#define ..._width 128 / #define ..._height 64)
  let detectedWidth = null
  let detectedHeight = null
  let formatSuggestion = 'adafruit'

  const widthMatch = text.match(/#define\s+(?:[a-zA-Z0-9_]+_)?width\s+(\d+)/i)
  if (widthMatch) {
    detectedWidth = parseInt(widthMatch[1], 10)
  }

  const heightMatch = text.match(/#define\s+(?:[a-zA-Z0-9_]+_)?height\s+(\d+)/i)
  if (heightMatch) {
    detectedHeight = parseInt(heightMatch[1], 10)
  }

  // 2. Detect Variable Name (e.g. const unsigned char epd_bitmap[] ...)
  let variableName = null
  const varMatch = text.match(/(?:unsigned\s+char|uint8_t|char|const\s+char|byte)\s+(?:PROGMEM\s+)?([a-zA-Z0-9_]+)\s*\[/i)
  if (varMatch) {
    variableName = varMatch[1]
  }

  // Check for XBM naming convention
  if (widthMatch && heightMatch && (text.includes('_bits') || text.includes('xbm'))) {
    formatSuggestion = 'xbm'
  } else if (text.toLowerCase().includes('u8g2') || text.toLowerCase().includes('page')) {
    formatSuggestion = 'u8g2'
  } else if (text.toLowerCase().includes('rgb565') || text.toLowerCase().includes('uint16_t')) {
    formatSuggestion = 'rgb565_be'
  }

  // 3. Strip Comments
  // Block comments /* ... */
  text = text.replace(/\/\*[\s\S]*?\*\//g, ' ')
  // Line comments // ...
  text = text.replace(/\/\/[^\n\r]*/g, ' ')
  // Python / shell comments # ... (avoid stripping #define if kept, but comments are stripped)
  text = text.replace(/#[^\n\r]*/g, ' ')

  // Strip hexdump line prefixes like "00000000: " or "0x0000: "
  text = text.replace(/^[0-9a-fA-F]{4,8}:\s*/gm, ' ')

  const byteList = []

  // 4. Try standard 0x.. or \x.. hex tokens first
  const hexMatches = text.match(/0x[0-9a-fA-F]{1,2}|\\x[0-9a-fA-F]{1,2}/gi)
  if (hexMatches && hexMatches.length > 0) {
    for (let i = 0; i < hexMatches.length; i++) {
      const clean = hexMatches[i].replace(/^[0x\\]+/i, '')
      byteList.push(parseInt(clean, 16) & 0xff)
    }
  } else {
    // 5. Try whitespace / comma-separated 2-character hex pairs e.g. "00 FF 1A 2B"
    const pairMatches = text.match(/\b[0-9a-fA-F]{2}\b/g)
    if (pairMatches && pairMatches.length >= 4) {
      for (let i = 0; i < pairMatches.length; i++) {
        byteList.push(parseInt(pairMatches[i], 16) & 0xff)
      }
    } else {
      // 6. Continuous hex string fallback e.g. "00FF1A2B"
      const cleaned = text.replace(/[^0-9a-fA-F]/g, '')
      if (cleaned.length >= 2) {
        for (let i = 0; i < cleaned.length - 1; i += 2) {
          byteList.push(parseInt(cleaned.slice(i, i + 2), 16) & 0xff)
        }
      }
    }
  }

  const bytes = new Uint8Array(byteList)

  return {
    bytes,
    totalBytes: bytes.length,
    totalBits: bytes.length * 8,
    detectedWidth,
    detectedHeight,
    variableName,
    formatSuggestion,
  }
}

/**
 * Standard maker and display resolutions.
 */
export const DISPLAY_PRESETS = [
  { name: '128 × 64 (SSD1306 / ST7920)', width: 128, height: 64, bytes1Bit: 1024 },
  { name: '128 × 32 (SSD1306 0.91")', width: 128, height: 32, bytes1Bit: 512 },
  { name: '84 × 48 (Nokia 5110 PCD8544)', width: 84, height: 48, bytes1Bit: 504 },
  { name: '128 × 128 (ST7735 / Color)', width: 128, height: 128, bytes1Bit: 2048, bytesRgb565: 32768 },
  { name: '240 × 240 (ST7789 IPS)', width: 240, height: 240, bytes1Bit: 7200, bytesRgb565: 115200 },
  { name: '240 × 320 (ILI9341 TFT)', width: 240, height: 320, bytes1Bit: 9600, bytesRgb565: 153600 },
  { name: '96 × 64 (OLED)', width: 96, height: 64, bytes1Bit: 768 },
  { name: '64 × 64 (Matrix Icon)', width: 64, height: 64, bytes1Bit: 512 },
  { name: '64 × 48 (OLED 0.66")', width: 64, height: 48, bytes1Bit: 384 },
  { name: '48 × 48 (Icon)', width: 48, height: 48, bytes1Bit: 288 },
  { name: '32 × 32 (Badge)', width: 32, height: 32, bytes1Bit: 128, bytesRgb565: 2048 },
  { name: '24 × 24 (Glyph)', width: 24, height: 24, bytes1Bit: 72 },
  { name: '16 × 16 (Small Icon)', width: 16, height: 16, bytes1Bit: 32 },
  { name: '256 × 64 (Wide OLED)', width: 256, height: 64, bytes1Bit: 2048 },
]

/**
 * Suggests matching dimensions for a given byte count and format.
 */
export function suggestDimensions(totalBytes, format = 'adafruit') {
  if (!totalBytes || totalBytes <= 0) {
    return [{ width: 128, height: 64, label: '128 × 64 (Default)' }]
  }

  const suggestions = []
  const isColor = format.startsWith('rgb565')
  const isGray = format === 'gray8'

  // Exact matches from common presets
  for (const preset of DISPLAY_PRESETS) {
    const expected = isColor
      ? preset.width * preset.height * 2
      : isGray
      ? preset.width * preset.height
      : Math.ceil(preset.width / 8) * preset.height

    if (expected === totalBytes) {
      suggestions.push({
        width: preset.width,
        height: preset.height,
        label: `${preset.name} (Exact Match)`,
        exact: true,
      })
    }
  }

  // If no exact preset matched, calculate mathematical clean dimensions
  if (suggestions.length === 0) {
    const totalPixels = isColor
      ? Math.floor(totalBytes / 2)
      : isGray
      ? totalBytes
      : totalBytes * 8

    const candidateWidths = [128, 240, 64, 84, 96, 160, 320, 32, 16, 48, 80]
    for (const w of candidateWidths) {
      if (totalPixels % w === 0) {
        const h = totalPixels / w
        if (h >= 8 && h <= 1024) {
          suggestions.push({
            width: w,
            height: h,
            label: `${w} × ${h} px (Calculated)`,
            exact: true,
          })
        }
      }
    }
  }

  // Fallback default
  if (suggestions.length === 0) {
    const fallbackH = calculateHeightFromWidth(totalBytes, 128, format)
    suggestions.push({
      width: 128,
      height: fallbackH,
      label: `128 × ${fallbackH} px (Approximated)`,
      exact: false,
    })
  }

  return suggestions
}

/**
 * Computes height given a byte count, width, and format.
 */
export function calculateHeightFromWidth(totalBytes, width, format = 'adafruit') {
  if (!width || width <= 0 || !totalBytes || totalBytes <= 0) return 64

  if (format.startsWith('rgb565')) {
    return Math.max(1, Math.floor(totalBytes / (width * 2)))
  }
  if (format === 'gray8') {
    return Math.max(1, Math.floor(totalBytes / width))
  }
  if (format === 'u8g2' || format === 'vertical_msb') {
    // Each column is page-divided (8 vertical pixels per byte per page)
    const pages = Math.ceil(totalBytes / width)
    return Math.max(8, pages * 8)
  }
  // Default horizontal 1-bit
  const bytesPerRow = Math.ceil(width / 8)
  return Math.max(1, Math.ceil(totalBytes / bytesPerRow))
}

/**
 * Parses hex color `#RRGGBB` into [r, g, b].
 */
function parseHexColor(hex, fallback = [255, 255, 255]) {
  if (!hex || typeof hex !== 'string') return fallback
  const clean = hex.replace('#', '')
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ]
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ]
  }
  return fallback
}

/**
 * Decodes hex bytes into ImageData (or ImageData-like object with {width, height, data}).
 * Supports:
 * - 'adafruit': Horizontal MSB-first
 * - 'xbm': Horizontal LSB-first
 * - 'u8g2': Vertical 8-px pages LSB-first
 * - 'vertical_msb': Column-major MSB-first
 * - 'rgb565_be': 16-bit RGB565 Big-Endian
 * - 'rgb565_le': 16-bit RGB565 Little-Endian
 * - 'gray8': 8-bit Grayscale
 */
export function decodeHexToImageData(bytes, width, height, options = {}) {
  const w = Math.max(1, Math.round(width || 128))
  const h = Math.max(1, Math.round(height || 64))
  const format = options.format || 'adafruit'
  const invert = Boolean(options.invert)
  const fgColor = options.fgColor || '#a8d9a8'
  const bgColor = options.bgColor || '#18211b'

  const [fgR, fgG, fgB] = parseHexColor(fgColor, [168, 217, 168])
  const [bgR, bgG, bgB] = parseHexColor(bgColor, [24, 33, 27])

  const pixelData = new Uint8ClampedArray(w * h * 4)

  function setPixel(x, y, isOn) {
    if (x < 0 || x >= w || y < 0 || y >= h) return
    const idx = (y * w + x) * 4
    const active = invert ? !isOn : isOn

    pixelData[idx] = active ? fgR : bgR
    pixelData[idx + 1] = active ? fgG : bgG
    pixelData[idx + 2] = active ? fgB : bgB
    pixelData[idx + 3] = 255
  }

  function setPixelRgb(x, y, r, g, b) {
    if (x < 0 || x >= w || y < 0 || y >= h) return
    const idx = (y * w + x) * 4
    pixelData[idx] = invert ? 255 - r : r
    pixelData[idx + 1] = invert ? 255 - g : g
    pixelData[idx + 2] = invert ? 255 - b : b
    pixelData[idx + 3] = 255
  }

  // --- 1. RGB565 Color Formats ---
  if (format === 'rgb565_be' || format === 'rgb565_le') {
    const isLe = format === 'rgb565_le'
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const byteIdx = (y * w + x) * 2
        if (byteIdx + 1 < bytes.length) {
          const b0 = bytes[byteIdx]
          const b1 = bytes[byteIdx + 1]
          const word = isLe ? ((b1 << 8) | b0) : ((b0 << 8) | b1)
          const r5 = (word >> 11) & 0x1f
          const g6 = (word >> 5) & 0x3f
          const b5 = word & 0x1f
          const r = Math.round((r5 * 255) / 31)
          const g = Math.round((g6 * 255) / 63)
          const b = Math.round((b5 * 255) / 31)
          setPixelRgb(x, y, r, g, b)
        } else {
          setPixelRgb(x, y, bgR, bgG, bgB)
        }
      }
    }
  }

  // --- 2. 8-Bit Grayscale Format ---
  else if (format === 'gray8') {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const byteIdx = y * w + x
        if (byteIdx < bytes.length) {
          const val = bytes[byteIdx]
          setPixelRgb(x, y, val, val, val)
        } else {
          setPixelRgb(x, y, 0, 0, 0)
        }
      }
    }
  }

  // --- 3. U8g2 / SSD1306 Page Mode (Vertical 8-px pages, LSB-first) ---
  else if (format === 'u8g2') {
    const pages = Math.ceil(h / 8)
    let byteIdx = 0
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < w; x++) {
        const byteVal = byteIdx < bytes.length ? bytes[byteIdx++] : 0
        for (let bit = 0; bit < 8; bit++) {
          const y = p * 8 + bit
          if (y < h) {
            const on = (byteVal & (1 << bit)) !== 0
            setPixel(x, y, on)
          }
        }
      }
    }
  }

  // --- 4. Vertical MSB-first Mode ---
  else if (format === 'vertical_msb') {
    const pages = Math.ceil(h / 8)
    let byteIdx = 0
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < w; x++) {
        const byteVal = byteIdx < bytes.length ? bytes[byteIdx++] : 0
        for (let bit = 0; bit < 8; bit++) {
          const y = p * 8 + bit
          if (y < h) {
            const on = (byteVal & (1 << (7 - bit))) !== 0
            setPixel(x, y, on)
          }
        }
      }
    }
  }

  // --- 5. XBM Format (Horizontal LSB-first) ---
  else if (format === 'xbm') {
    const bytesPerRow = Math.ceil(w / 8)
    let byteIdx = 0
    for (let y = 0; y < h; y++) {
      for (let b = 0; b < bytesPerRow; b++) {
        const byteVal = byteIdx < bytes.length ? bytes[byteIdx++] : 0
        for (let bit = 0; bit < 8; bit++) {
          const x = b * 8 + bit
          if (x < w) {
            const on = (byteVal & (1 << bit)) !== 0
            setPixel(x, y, on)
          }
        }
      }
    }
  }

  // --- 6. Adafruit_GFX / MicroPython MONO_HLSB (Horizontal MSB-first, Default) ---
  else {
    const bytesPerRow = Math.ceil(w / 8)
    let byteIdx = 0
    for (let y = 0; y < h; y++) {
      for (let b = 0; b < bytesPerRow; b++) {
        const byteVal = byteIdx < bytes.length ? bytes[byteIdx++] : 0
        for (let bit = 0; bit < 8; bit++) {
          const x = b * 8 + bit
          if (x < w) {
            const on = (byteVal & (1 << (7 - bit))) !== 0
            setPixel(x, y, on)
          }
        }
      }
    }
  }

  return { width: w, height: h, data: pixelData }
}

/**
 * Renders decoded hex bytes to a canvas element.
 */
export function renderHexToCanvas(canvas, bytes, width, height, options = {}) {
  if (!canvas) return
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const decoded = decodeHexToImageData(bytes, width, height, options)
  const imgData = ctx.createImageData(width, height)
  imgData.data.set(decoded.data)
  ctx.putImageData(imgData, 0, 0)
}

/**
 * Returns inspectable pixel info at coordinates (x, y).
 */
export function getPixelAt(bytes, width, height, x, y, options = {}) {
  if (x < 0 || x >= width || y < 0 || y >= height || !bytes || bytes.length === 0) {
    return null
  }

  const format = options.format || 'adafruit'
  let byteIndex = 0
  let bitIndex = 0
  let isOn = false
  let rawByte = 0

  if (format === 'u8g2') {
    const p = Math.floor(y / 8)
    bitIndex = y % 8
    byteIndex = p * width + x
    rawByte = bytes[byteIndex] || 0
    isOn = (rawByte & (1 << bitIndex)) !== 0
  } else if (format === 'vertical_msb') {
    const p = Math.floor(y / 8)
    bitIndex = 7 - (y % 8)
    byteIndex = p * width + x
    rawByte = bytes[byteIndex] || 0
    isOn = (rawByte & (1 << (7 - (y % 8)))) !== 0
  } else if (format === 'xbm') {
    const bytesPerRow = Math.ceil(width / 8)
    const b = Math.floor(x / 8)
    bitIndex = x % 8
    byteIndex = y * bytesPerRow + b
    rawByte = bytes[byteIndex] || 0
    isOn = (rawByte & (1 << bitIndex)) !== 0
  } else if (format === 'rgb565_be' || format === 'rgb565_le') {
    byteIndex = (y * width + x) * 2
    rawByte = (bytes[byteIndex] || 0)
    return {
      x,
      y,
      byteIndex,
      bitIndex: 0,
      hexByte: `0x${(bytes[byteIndex] || 0).toString(16).padStart(2, '0')}, 0x${(bytes[byteIndex + 1] || 0).toString(16).padStart(2, '0')}`,
      isOn: true,
      format,
    }
  } else {
    // Adafruit MSB
    const bytesPerRow = Math.ceil(width / 8)
    const b = Math.floor(x / 8)
    bitIndex = 7 - (x % 8)
    byteIndex = y * bytesPerRow + b
    rawByte = bytes[byteIndex] || 0
    isOn = (rawByte & (1 << (7 - (x % 8)))) !== 0
  }

  if (options.invert) {
    isOn = !isOn
  }

  return {
    x,
    y,
    byteIndex,
    bitIndex,
    hexByte: `0x${rawByte.toString(16).padStart(2, '0').toUpperCase()}`,
    isOn,
    format,
  }
}

/**
 * Built-in real-world demonstration hex samples ready to test with 1-click.
 */
export const HEX_SAMPLES = [
  {
    id: 'sample_ssd1306_adafruit',
    name: 'SSD1306 128×64 (Adafruit GFX C Header)',
    format: 'adafruit',
    width: 128,
    height: 64,
    getCode() {
      // 128x64 Adafruit monochrome test header with retro graphic
      const totalBytes = 1024
      const b = new Uint8Array(totalBytes)
      const bytesPerRow = 16

      // Top and bottom border
      for (let x = 0; x < bytesPerRow; x++) {
        b[0 * bytesPerRow + x] = 0xff
        b[1 * bytesPerRow + x] = 0x80 | 0x01
        b[62 * bytesPerRow + x] = 0x80 | 0x01
        b[63 * bytesPerRow + x] = 0xff
      }
      // Left and right edges
      for (let y = 0; y < 64; y++) {
        b[y * bytesPerRow + 0] |= 0x80
        b[y * bytesPerRow + 15] |= 0x01
      }
      // Diagonal radar sweep & center reticle box
      for (let y = 14; y <= 50; y++) {
        b[y * bytesPerRow + 3] |= 0x0f
        b[y * bytesPerRow + 12] |= 0xf0
      }
      // Center banner
      for (let x = 4; x <= 11; x++) {
        b[24 * bytesPerRow + x] = 0xff
        b[40 * bytesPerRow + x] = 0xff
      }
      // Pattern fills
      for (let y = 26; y < 39; y++) {
        for (let x = 4; x <= 11; x++) {
          b[y * bytesPerRow + x] = (y % 2 === 0) ? 0xaa : 0x55
        }
      }

      const hexArr = []
      for (let i = 0; i < totalBytes; i += 12) {
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0'))
        hexArr.push('  ' + slice.join(', ') + (i + 12 < totalBytes ? ',' : ''))
      }

      return `// =============================================================================\n` +
        `// SSD1306 OLED (128x64) Adafruit_GFX Bitmap Header\n` +
        `// Format: Horizontal MSB-first | Size: 128x64 px (1024 bytes)\n` +
        `// =============================================================================\n\n` +
        `#define SSD1306_LOGO_WIDTH  128\n` +
        `#define SSD1306_LOGO_HEIGHT 64\n\n` +
        `static const unsigned char PROGMEM ssd1306_logo_bmp[] = {\n` +
        hexArr.join('\n') + `\n` +
        `};\n`
    },
  },
  {
    id: 'sample_xbm_icon',
    name: 'XBM 64×64 Icon (Standard X BitMap LSB)',
    format: 'xbm',
    width: 64,
    height: 64,
    getCode() {
      const totalBytes = 512
      const b = new Uint8Array(totalBytes)
      const bytesPerRow = 8

      // Draw concentric diamonds and cross
      for (let y = 0; y < 64; y++) {
        const distCenter = Math.abs(y - 32)
        const span = 32 - distCenter
        for (let x = 32 - span; x <= 32 + span; x++) {
          const byteCol = Math.floor(x / 8)
          const bit = x % 8
          if (byteCol >= 0 && byteCol < 8) {
            b[y * bytesPerRow + byteCol] |= (1 << bit)
          }
        }
      }

      const hexArr = []
      for (let i = 0; i < totalBytes; i += 12) {
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0'))
        hexArr.push('  ' + slice.join(', ') + (i + 12 < totalBytes ? ',' : ''))
      }

      return `#define icon_diamond_width 64\n` +
        `#define icon_diamond_height 64\n` +
        `static unsigned char icon_diamond_bits[] = {\n` +
        hexArr.join('\n') + `\n` +
        `};\n`
    },
  },
  {
    id: 'sample_nokia5110',
    name: 'Nokia 5110 PCD8544 84×48 (Vertical Pages)',
    format: 'u8g2',
    width: 84,
    height: 48,
    getCode() {
      const totalBytes = 504 // 84 * (48 / 8) = 504 bytes
      const b = new Uint8Array(totalBytes)

      for (let p = 0; p < 6; p++) {
        for (let x = 0; x < 84; x++) {
          const idx = p * 84 + x
          if (p === 0) b[idx] = 0x01 // top line
          if (p === 5) b[idx] = 0x80 // bottom line
          if (x === 0 || x === 83) b[idx] = 0xff // side borders
          if (x > 20 && x < 64 && (p === 2 || p === 3)) {
            b[idx] = (x % 3 === 0) ? 0xaa : 0x55
          }
        }
      }

      const hexArr = []
      for (let i = 0; i < totalBytes; i += 12) {
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0'))
        hexArr.push('  ' + slice.join(', ') + (i + 12 < totalBytes ? ',' : ''))
      }

      return `// Nokia 5110 (PCD8544) 84x48 Display Buffer\n` +
        `// Vertical 8-px Pages (6 pages x 84 columns = 504 bytes)\n` +
        `const uint8_t nokia_phone_bmp[504] = {\n` +
        hexArr.join('\n') + `\n` +
        `};\n`
    },
  },
  {
    id: 'sample_micropython',
    name: 'MicroPython framebuf 128×32 bytearray',
    format: 'adafruit',
    width: 128,
    height: 32,
    getCode() {
      const totalBytes = 512
      const b = new Uint8Array(totalBytes)
      for (let y = 0; y < 32; y++) {
        for (let bcol = 0; bcol < 16; bcol++) {
          if (y === 0 || y === 31 || bcol === 0 || bcol === 15) {
            b[y * 16 + bcol] = 0xff
          } else if ((y + bcol) % 4 === 0) {
            b[y * 16 + bcol] = 0x33
          }
        }
      }

      const hexArr = []
      for (let i = 0; i < totalBytes; i += 12) {
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0'))
        hexArr.push('  ' + slice.join(', ') + (i + 12 < totalBytes ? ',' : ''))
      }

      return `# MicroPython SSD1306 (128x32) Mono framebuf\n` +
        `import framebuf\n\n` +
        `WIDTH = 128\n` +
        `HEIGHT = 32\n\n` +
        `bmp_buffer = bytearray([\n` +
        hexArr.join('\n') + `\n` +
        `])\n`
    },
  },
  {
    id: 'sample_raw_hex',
    name: 'Raw Hex Byte Stream (00 FF 12 ...)',
    format: 'adafruit',
    width: 32,
    height: 32,
    getCode() {
      const bytes = []
      for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 4; x++) {
          const val = (y < 4 || y > 27 || x === 0 || x === 3) ? 0xff : ((y * 7 + x * 13) & 0xff)
          bytes.push(val.toString(16).padStart(2, '0').toUpperCase())
        }
      }
      return bytes.join(' ')
    },
  },
]

/**
 * Initializes the Hex to Image Decoder UI and interactions.
 */
export function initHexDecoder(state) {
  const openBtn = document.querySelector('#open-hex-decoder')
  const refFromHexBtn = document.querySelector('#reference-from-hex-btn')
  const modal = document.querySelector('#hex-decoder-modal')
  if (!modal) return

  const closeBtn = modal.querySelector('#hex-decoder-close')
  const inputArea = modal.querySelector('#hex-decoder-input')
  const formatSelect = modal.querySelector('#hex-decoder-format')
  const widthInput = modal.querySelector('#hex-decoder-width')
  const heightInput = modal.querySelector('#hex-decoder-height')
  const presetSelect = modal.querySelector('#hex-decoder-presets')
  const autoHeightBtn = modal.querySelector('#hex-decoder-auto-height')
  const swapDimBtn = modal.querySelector('#hex-decoder-swap-dim')
  const samplesSelect = modal.querySelector('#hex-decoder-samples')
  const clearBtn = modal.querySelector('#hex-decoder-clear')

  const previewCanvas = modal.querySelector('#hex-decoder-preview')
  const invertCheck = modal.querySelector('#hex-decoder-invert')
  const gridCheck = modal.querySelector('#hex-decoder-grid')
  const themeSelect = modal.querySelector('#hex-decoder-theme')
  const fgColorInput = modal.querySelector('#hex-decoder-fg-color')
  const bgColorInput = modal.querySelector('#hex-decoder-bg-color')
  const zoomBtns = modal.querySelectorAll('.hex-zoom-btn')

  const byteBadge = modal.querySelector('#hex-decoder-byte-count')
  const resBadge = modal.querySelector('#hex-decoder-resolution-badge')
  const statusBadge = modal.querySelector('#hex-decoder-status-badge')
  const hintBanner = modal.querySelector('#hex-decoder-hint')
  const pixelInfo = modal.querySelector('#hex-decoder-pixel-info')

  const copyImgBtn = modal.querySelector('#hex-decoder-copy-img')
  const downloadPngBtn = modal.querySelector('#hex-decoder-download-png')
  const insertLayerBtn = modal.querySelector('#hex-decoder-insert-layer')
  const setRefBtn = modal.querySelector('#hex-decoder-set-reference')
  const setProjectBtn = modal.querySelector('#hex-decoder-set-project')

  let currentBytes = new Uint8Array(0)
  let currentWidth = 128
  let currentHeight = 64
  let currentZoom = 2
  let renderDebounceTimer = null

  // Color themes
  const THEMES = {
    matrix: { fg: '#a8d9a8', bg: '#18211b' },
    oled_blue: { fg: '#00f0ff', bg: '#050c14' },
    oled_white: { fg: '#ffffff', bg: '#000000' },
    oled_amber: { fg: '#ffb800', bg: '#140d02' },
    nokia: { fg: '#1c3325', bg: '#8ea890' },
    bw: { fg: '#000000', bg: '#ffffff' },
  }

  function applyTheme(themeKey) {
    if (THEMES[themeKey]) {
      fgColorInput.value = THEMES[themeKey].fg
      bgColorInput.value = THEMES[themeKey].bg
    }
  }

  function decodeAndUpdate() {
    const rawText = inputArea.value || ''
    const parseResult = parseHexInput(rawText)
    currentBytes = parseResult.bytes

    // Auto-adopt detected width and height if first time or text changed with explicit defines
    if (parseResult.detectedWidth && parseResult.detectedHeight) {
      currentWidth = parseResult.detectedWidth
      currentHeight = parseResult.detectedHeight
      widthInput.value = currentWidth
      heightInput.value = currentHeight
    } else {
      currentWidth = Math.max(1, parseInt(widthInput.value, 10) || 128)
      currentHeight = Math.max(1, parseInt(heightInput.value, 10) || 64)
    }

    if (parseResult.formatSuggestion && formatSelect.value !== parseResult.formatSuggestion) {
      if (rawText.includes('_bits') || rawText.includes('#define') || rawText.includes('u8g2')) {
        formatSelect.value = parseResult.formatSuggestion
      }
    }

    // Update badges & status
    const format = formatSelect.value
    byteBadge.textContent = `${currentBytes.length.toLocaleString()} Bytes (${(currentBytes.length * 8).toLocaleString()} Bits)`
    resBadge.textContent = `${currentWidth} × ${currentHeight} px`

    const isColor = format.startsWith('rgb565')
    const isGray = format === 'gray8'
    const expectedBytes = isColor
      ? currentWidth * currentHeight * 2
      : isGray
      ? currentWidth * currentHeight
      : Math.ceil(currentWidth / 8) * currentHeight

    if (currentBytes.length === 0) {
      statusBadge.textContent = 'Empty'
      statusBadge.className = 'badge status-idle'
      hintBanner.textContent = 'Paste any C header, XBM, MicroPython array, or raw hex bytes to decode.'
    } else if (currentBytes.length === expectedBytes) {
      statusBadge.textContent = '100% Matched'
      statusBadge.className = 'badge status-match'
      hintBanner.textContent = `Exact byte match: ${currentBytes.length} bytes matches ${currentWidth}×${currentHeight} px (${format}).`
    } else if (currentBytes.length > expectedBytes) {
      const extra = currentBytes.length - expectedBytes
      statusBadge.textContent = `+${extra} Extra Bytes`
      statusBadge.className = 'badge status-warn'
      hintBanner.textContent = `Input has ${currentBytes.length} bytes; display uses first ${expectedBytes} bytes (+${extra} unused).`
    } else {
      const missing = expectedBytes - currentBytes.length
      statusBadge.textContent = `-${missing} Bytes Short`
      statusBadge.className = 'badge status-warn'
      hintBanner.textContent = `Input has ${currentBytes.length} bytes; ${expectedBytes} bytes needed for full ${currentWidth}×${currentHeight} px.`
    }

    // Render Preview
    renderHexToCanvas(previewCanvas, currentBytes, currentWidth, currentHeight, {
      format,
      invert: invertCheck.checked,
      fgColor: fgColorInput.value,
      bgColor: bgColorInput.value,
    })

    // Apply zoom and grid CSS
    previewCanvas.style.width = `${currentWidth * currentZoom}px`
    previewCanvas.style.height = `${currentHeight * currentZoom}px`
    if (gridCheck.checked && currentZoom >= 4) {
      previewCanvas.classList.add('with-pixel-grid')
    } else {
      previewCanvas.classList.remove('with-pixel-grid')
    }
  }

  function scheduleDecode() {
    if (renderDebounceTimer) clearTimeout(renderDebounceTimer)
    renderDebounceTimer = setTimeout(decodeAndUpdate, 40)
  }

  // Sample loading
  function populateSamples() {
    samplesSelect.innerHTML = '<option value="">Load Sample Hex ▾</option>'
    for (const sample of HEX_SAMPLES) {
      const opt = document.createElement('option')
      opt.value = sample.id
      opt.textContent = sample.name
      samplesSelect.appendChild(opt)
    }
  }
  populateSamples()

  samplesSelect.addEventListener('change', () => {
    const selectedId = samplesSelect.value
    if (!selectedId) return
    const sample = HEX_SAMPLES.find(s => s.id === selectedId)
    if (sample) {
      inputArea.value = sample.getCode()
      formatSelect.value = sample.format
      widthInput.value = sample.width
      heightInput.value = sample.height
      currentWidth = sample.width
      currentHeight = sample.height
      decodeAndUpdate()
    }
    samplesSelect.value = ''
  })

  // Presets dropdown
  presetSelect.addEventListener('change', () => {
    const val = presetSelect.value
    if (!val) return
    const [wStr, hStr] = val.split('x')
    if (wStr && hStr) {
      widthInput.value = wStr
      heightInput.value = hStr
      currentWidth = parseInt(wStr, 10)
      currentHeight = parseInt(hStr, 10)
      decodeAndUpdate()
    }
    presetSelect.value = ''
  })

  // Auto-height button
  autoHeightBtn.addEventListener('click', () => {
    const w = parseInt(widthInput.value, 10) || 128
    const calculatedH = calculateHeightFromWidth(currentBytes.length, w, formatSelect.value)
    heightInput.value = calculatedH
    currentHeight = calculatedH
    decodeAndUpdate()
  })

  // Swap W and H button
  swapDimBtn.addEventListener('click', () => {
    const temp = widthInput.value
    widthInput.value = heightInput.value
    heightInput.value = temp
    decodeAndUpdate()
  })

  // Clear button
  clearBtn.addEventListener('click', () => {
    inputArea.value = ''
    decodeAndUpdate()
  })

  // Zoom buttons
  zoomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      zoomBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentZoom = parseInt(btn.dataset.zoom, 10) || 2
      decodeAndUpdate()
    })
  })

  // Theme selection
  themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value)
    decodeAndUpdate()
  })

  // Pixel inspection on canvas hover
  previewCanvas.addEventListener('mousemove', (e) => {
    if (!currentBytes || currentBytes.length === 0) return
    const rect = previewCanvas.getBoundingClientRect()
    const scaleX = currentWidth / rect.width
    const scaleY = currentHeight / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)

    const pixel = getPixelAt(currentBytes, currentWidth, currentHeight, x, y, {
      format: formatSelect.value,
      invert: invertCheck.checked,
    })

    if (pixel) {
      pixelInfo.textContent = `X: ${pixel.x}, Y: ${pixel.y} | Byte #${pixel.byteIndex} (${pixel.hexByte}) | Bit ${pixel.bitIndex} | Pixel: ${pixel.isOn ? 'ON (Active)' : 'OFF'}`
    }
  })

  previewCanvas.addEventListener('mouseleave', () => {
    pixelInfo.textContent = 'Hover over canvas to inspect individual bits and coordinates'
  })

  // Action: Copy Decoded Image to Clipboard
  copyImgBtn.addEventListener('click', async () => {
    if (!previewCanvas || currentBytes.length === 0) return
    try {
      previewCanvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        copyImgBtn.textContent = '✓ Copied PNG!'
        setTimeout(() => { copyImgBtn.textContent = '📋 Copy Image' }, 2000)
      })
    } catch (err) {
      console.warn('Clipboard image write failed:', err)
      copyImgBtn.textContent = '✓ Copied (Fallback)'
      setTimeout(() => { copyImgBtn.textContent = '📋 Copy Image' }, 2000)
    }
  })

  // Action: Download PNG
  downloadPngBtn.addEventListener('click', () => {
    if (!previewCanvas || currentBytes.length === 0) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `decoded_hex_${currentWidth}x${currentHeight}.png`
    link.href = dataUrl
    link.click()
  })

  // Action: Insert as Canvas Layer
  insertLayerBtn.addEventListener('click', () => {
    if (!previewCanvas || currentBytes.length === 0) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    setBitmapCache(dataUrl, previewCanvas)

    const newElement = {
      id: createId(),
      type: 'bitmap',
      name: `Hex Bitmap (${currentWidth}×${currentHeight})`,
      x: 0,
      y: 0,
      width: currentWidth,
      height: currentHeight,
      dataUrl,
    }

    addElement(newElement)
    closeModal()
  })

  // Action: Set as Reference Image
  setRefBtn.addEventListener('click', () => {
    if (!previewCanvas || currentBytes.length === 0) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    updateReference({
      src: dataUrl,
      fileName: `hex_${currentWidth}x${currentHeight}.png`,
      naturalWidth: currentWidth,
      naturalHeight: currentHeight,
    })
    closeModal()
  })

  // Action: Set as Project Screen
  setProjectBtn.addEventListener('click', () => {
    if (!previewCanvas || currentBytes.length === 0) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    setBitmapCache(dataUrl, previewCanvas)

    updateDisplay({
      width: currentWidth,
      height: currentHeight,
      background: bgColorInput.value,
    })

    const newElement = {
      id: createId(),
      type: 'bitmap',
      name: `Decoded Screen (${currentWidth}×${currentHeight})`,
      x: 0,
      y: 0,
      width: currentWidth,
      height: currentHeight,
      dataUrl,
    }

    state.elements = [newElement]
    notify()
    closeModal()
  })

  // Event Listeners
  inputArea.addEventListener('input', scheduleDecode)
  formatSelect.addEventListener('change', decodeAndUpdate)
  widthInput.addEventListener('input', scheduleDecode)
  heightInput.addEventListener('input', scheduleDecode)
  invertCheck.addEventListener('change', decodeAndUpdate)
  gridCheck.addEventListener('change', decodeAndUpdate)
  fgColorInput.addEventListener('input', decodeAndUpdate)
  bgColorInput.addEventListener('input', decodeAndUpdate)

  function openModal() {
    modal.removeAttribute('hidden')
    modal.hidden = false
    modal.classList.add('open')
    modal.style.display = 'flex'
    // If empty on open, load the default SSD1306 sample for immediate visual WOW
    if (!inputArea.value.trim()) {
      const defaultSample = HEX_SAMPLES[0]
      inputArea.value = defaultSample.getCode()
      formatSelect.value = defaultSample.format
      widthInput.value = defaultSample.width
      heightInput.value = defaultSample.height
    }
    decodeAndUpdate()
  }

  function closeModal() {
    modal.setAttribute('hidden', '')
    modal.hidden = true
    modal.classList.remove('open')
    modal.style.display = 'none'
  }

  // Modal open/close bindings
  openBtn?.addEventListener('click', openModal)
  refFromHexBtn?.addEventListener('click', openModal)
  closeBtn?.addEventListener('click', closeModal)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal()
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h' && !e.shiftKey) {
      e.preventDefault()
      if (modal.hidden) openModal()
      else closeModal()
    }
  })

  // Ensure initially hidden
  closeModal()
}
