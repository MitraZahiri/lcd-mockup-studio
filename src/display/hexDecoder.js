/**
 * LCD Mockup Studio — Hex Code to Image Decoder & Interactive Pixel Editor
 * Full two-way synchronization between screen preview and C/Hex source code.
 * Inspired by KasperCalc Bitmap Editor & hardware maker workflows.
 */

import { updateDisplay, updateReference, addElement, createId, notify } from '../editor/state.js'
import { setBitmapCache } from '../export/pngExport.js'
import { analyzeReferenceImage } from '../analysis/imageAnalyzer.js'
import { createElementFromAnalysis } from '../editor/elements.js'

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

  // Check for format hints
  if (widthMatch && heightMatch && (text.includes('_bits') || text.includes('xbm'))) {
    formatSuggestion = 'xbm'
  } else if (text.toLowerCase().includes('u8g2') || text.toLowerCase().includes('page')) {
    formatSuggestion = 'u8g2'
  } else if (text.toLowerCase().includes('rgb565') || text.toLowerCase().includes('uint16_t')) {
    formatSuggestion = 'rgb565_be'
  }

  // 3. Strip Comments before extracting bytes
  text = text.replace(/\/\*[\s\S]*?\*\//g, ' ')
  text = text.replace(/\/\/[^\n\r]*/g, ' ')
  text = text.replace(/#[^\n\r]*/g, ' ')
  text = text.replace(/^[0-9a-fA-F]{4,8}:\s*/gm, ' ')

  // Strip array size bracket like bitmap[1024] so 1024 isn't parsed as a byte
  text = text.replace(/[a-zA-Z0-9_]+\s*\[\s*\d+\s*\]/g, ' ')

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
    if (pairMatches && pairMatches.length >= 2) {
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
  { name: '132 × 64 (SH1106 GDDRAM)', width: 132, height: 64, bytes1Bit: 1056 },
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
  { name: '10 × 14 (Font char)', width: 10, height: 14, bytes1Bit: 28 },
  { name: '5 × 7 (Font char)', width: 5, height: 7, bytes1Bit: 7 },
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
      : format === 'u8g2' || format === 'vertical_msb'
      ? Math.ceil(preset.height / 8) * preset.width
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

  // Calculated clean dimensions
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
        if (h >= 4 && h <= 1024) {
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
    const pages = Math.ceil(totalBytes / width)
    return Math.max(8, pages * 8)
  }
  const bytesPerRow = Math.ceil(width / 8)
  return Math.max(1, Math.ceil(totalBytes / bytesPerRow))
}

/**
 * Parses hex color `#RRGGBB` into [r, g, b].
 */
export function parseHexColor(hex, fallback = [255, 255, 255]) {
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
 * Decodes encoded byte buffer into a flat 1D Uint8Array pixel map of size (width * height).
 * Pixel values: 1 for active/set, 0 for inactive/clear.
 */
export function decodeBytesToPixels(bytes, width, height, format = 'adafruit') {
  const w = Math.max(1, Math.round(width || 128))
  const h = Math.max(1, Math.round(height || 64))
  const pixels = new Uint8Array(w * h)
  if (!bytes || bytes.length === 0) return pixels

  if (format === 'u8g2' || format === 'c_vertical' || format === 'vertical_lsb') {
    const pages = Math.ceil(h / 8)
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < w; x++) {
        const bi = p * w + x
        if (bi >= bytes.length) continue
        const b = bytes[bi]
        for (let bit = 0; bit < 8; bit++) {
          const y = p * 8 + bit
          if (y < h) {
            pixels[y * w + x] = (b >> bit) & 1
          }
        }
      }
    }
  } else if (format === 'vertical_msb' || format === 'c_vertical_msb') {
    const pages = Math.ceil(h / 8)
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < w; x++) {
        const bi = p * w + x
        if (bi >= bytes.length) continue
        const b = bytes[bi]
        for (let bit = 0; bit < 8; bit++) {
          const y = p * 8 + bit
          if (y < h) {
            pixels[y * w + x] = (b >> (7 - bit)) & 1
          }
        }
      }
    }
  } else if (format === 'xbm' || format === 'horizontal_lsb' || format === 'c_horizontal_lsb') {
    const rb = Math.ceil(w / 8)
    for (let y = 0; y < h; y++) {
      for (let bx = 0; bx < rb; bx++) {
        const bi = y * rb + bx
        if (bi >= bytes.length) break
        const b = bytes[bi]
        for (let bit = 0; bit < 8; bit++) {
          const x = bx * 8 + bit
          if (x < w) {
            pixels[y * w + x] = (b >> bit) & 1
          }
        }
      }
    }
  } else if (format === 'rgb565_be' || format === 'rgb565_le') {
    const isLe = format === 'rgb565_le'
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const bi = (y * w + x) * 2
        if (bi + 1 < bytes.length) {
          const b0 = bytes[bi]
          const b1 = bytes[bi + 1]
          const word = isLe ? ((b1 << 8) | b0) : ((b0 << 8) | b1)
          pixels[y * w + x] = word !== 0 ? 1 : 0
        }
      }
    }
  } else if (format === 'gray8') {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const bi = y * w + x
        if (bi < bytes.length) {
          pixels[y * w + x] = bytes[bi] > 127 ? 1 : 0
        }
      }
    }
  } else {
    // Default: Adafruit GFX Horizontal MSB
    const rb = Math.ceil(w / 8)
    for (let y = 0; y < h; y++) {
      for (let bx = 0; bx < rb; bx++) {
        const bi = y * rb + bx
        if (bi >= bytes.length) break
        const b = bytes[bi]
        for (let bit = 0; bit < 8; bit++) {
          const x = bx * 8 + bit
          if (x < w) {
            pixels[y * w + x] = (b >> (7 - bit)) & 1
          }
        }
      }
    }
  }

  return pixels
}

/**
 * Encodes a flat 1D Uint8Array pixel map of size (width * height) into raw bytes.
 * This ensures exact two-way mathematical synchronization when editing on canvas.
 */
export function encodePixelsToBytes(pixels, width, height, format = 'adafruit') {
  const w = Math.max(1, Math.round(width || 128))
  const h = Math.max(1, Math.round(height || 64))

  if (format === 'u8g2' || format === 'c_vertical' || format === 'vertical_lsb') {
    const pages = Math.ceil(h / 8)
    const bytes = new Uint8Array(pages * w)
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < w; x++) {
        let b = 0
        for (let bit = 0; bit < 8; bit++) {
          const y = p * 8 + bit
          if (y < h && pixels[y * w + x]) {
            b |= (1 << bit)
          }
        }
        bytes[p * w + x] = b
      }
    }
    return bytes
  }

  if (format === 'vertical_msb' || format === 'c_vertical_msb') {
    const pages = Math.ceil(h / 8)
    const bytes = new Uint8Array(pages * w)
    for (let p = 0; p < pages; p++) {
      for (let x = 0; x < w; x++) {
        let b = 0
        for (let bit = 0; bit < 8; bit++) {
          const y = p * 8 + bit
          if (y < h && pixels[y * w + x]) {
            b |= (1 << (7 - bit))
          }
        }
        bytes[p * w + x] = b
      }
    }
    return bytes
  }

  if (format === 'xbm' || format === 'horizontal_lsb' || format === 'c_horizontal_lsb') {
    const rb = Math.ceil(w / 8)
    const bytes = new Uint8Array(rb * h)
    for (let y = 0; y < h; y++) {
      for (let bx = 0; bx < rb; bx++) {
        let b = 0
        for (let bit = 0; bit < 8; bit++) {
          const x = bx * 8 + bit
          if (x < w && pixels[y * w + x]) {
            b |= (1 << bit)
          }
        }
        bytes[y * rb + bx] = b
      }
    }
    return bytes
  }

  if (format === 'rgb565_be' || format === 'rgb565_le') {
    const isLe = format === 'rgb565_le'
    const bytes = new Uint8Array(w * h * 2)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const bi = (y * w + x) * 2
        const on = pixels[y * w + x] === 1
        const word = on ? 0xffff : 0x0000
        const b0 = (word >> 8) & 0xff
        const b1 = word & 0xff
        bytes[bi] = isLe ? b1 : b0
        bytes[bi + 1] = isLe ? b0 : b1
      }
    }
    return bytes
  }

  if (format === 'gray8') {
    const bytes = new Uint8Array(w * h)
    for (let i = 0; i < pixels.length; i++) {
      bytes[i] = pixels[i] ? 255 : 0
    }
    return bytes
  }

  // Default: Adafruit GFX Horizontal MSB
  const rb = Math.ceil(w / 8)
  const bytes = new Uint8Array(rb * h)
  for (let y = 0; y < h; y++) {
    for (let bx = 0; bx < rb; bx++) {
      let b = 0
      for (let bit = 0; bit < 8; bit++) {
        const x = bx * 8 + bit
        if (x < w && pixels[y * w + x]) {
          b |= (1 << (7 - bit))
        }
      }
      bytes[y * rb + bx] = b
    }
  }
  return bytes
}

/**
 * Pixel manipulation transformations.
 */
export function rotatePixels90(pixels, width, height) {
  const newW = height
  const newH = width
  const rotated = new Uint8Array(newW * newH)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      rotated[x * newW + (height - 1 - y)] = pixels[y * width + x]
    }
  }
  return { pixels: rotated, width: newW, height: newH }
}

export function flipPixelsX(pixels, width, height) {
  const flipped = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      flipped[y * width + (width - 1 - x)] = pixels[y * width + x]
    }
  }
  return flipped
}

export function flipPixelsY(pixels, width, height) {
  const flipped = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      flipped[(height - 1 - y) * width + x] = pixels[y * width + x]
    }
  }
  return flipped
}

export function invertPixels(pixels) {
  const inverted = new Uint8Array(pixels.length)
  for (let i = 0; i < pixels.length; i++) {
    inverted[i] = pixels[i] ? 0 : 1
  }
  return inverted
}

export function clearPixels(pixels) {
  const cleared = new Uint8Array(pixels.length)
  cleared.fill(0)
  return cleared
}

export function floodFillPixels(pixels, width, height, startX, startY, fillVal = 1) {
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return
  const target = pixels[startY * width + startX]
  if (target === fillVal) return
  const stack = [startX, startY]
  while (stack.length > 0) {
    const cy = stack.pop()
    const cx = stack.pop()
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue
    const idx = cy * width + cx
    if (pixels[idx] !== target) continue
    pixels[idx] = fillVal
    stack.push(cx + 1, cy, cx - 1, cy, cx, cy + 1, cx, cy - 1)
  }
}

export function drawLinePixels(pixels, width, height, x0, y0, x1, y1, val = 1) {
  let dx = Math.abs(x1 - x0)
  let dy = Math.abs(y1 - y0)
  let sx = x0 < x1 ? 1 : -1
  let sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  while (true) {
    if (x0 >= 0 && x0 < width && y0 >= 0 && y0 < height) {
      pixels[y0 * width + x0] = val
    }
    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
}

export function drawRectPixels(pixels, width, height, x0, y0, x1, y1, val = 1) {
  const lx = Math.min(x0, x1), rx = Math.max(x0, x1)
  const ty = Math.min(y0, y1), by = Math.max(y0, y1)
  for (let x = lx; x <= rx; x++) {
    if (x >= 0 && x < width) {
      if (ty >= 0 && ty < height) pixels[ty * width + x] = val
      if (by >= 0 && by < height) pixels[by * width + x] = val
    }
  }
  for (let y = ty; y <= by; y++) {
    if (y >= 0 && y < height) {
      if (lx >= 0 && lx < width) pixels[y * width + lx] = val
      if (rx >= 0 && rx < width) pixels[y * width + rx] = val
    }
  }
}

/**
 * Formats a byte array into C source code or raw hex, updating existing code in real-time.
 */
export function formatBytesIntoSource(originalText, bytes, width, height, format = 'adafruit', varName = 'bitmap') {
  const bytesPerLine = format === 'adafruit' || format === 'xbm'
    ? Math.max(1, Math.min(16, Math.ceil(width / 8)))
    : format === 'u8g2' || format === 'vertical_msb'
    ? Math.max(1, Math.min(16, width))
    : 16

  const hexLines = []
  for (let i = 0; i < bytes.length; i += bytesPerLine) {
    const slice = Array.from(bytes.slice(i, i + bytesPerLine))
      .map(b => '0x' + b.toString(16).padStart(2, '0').toUpperCase())
    const isLast = (i + bytesPerLine >= bytes.length)
    hexLines.push('  ' + slice.join(', ') + (isLast ? '' : ','))
  }
  const formattedBody = hexLines.join('\n')

  const text = (originalText || '').trim()

  // 1. If text has a C array structure with { ... }
  const braceOpen = text.indexOf('{')
  const braceClose = text.lastIndexOf('}')
  if (braceOpen !== -1 && braceClose > braceOpen) {
    let beforeBrace = text.slice(0, braceOpen + 1)
    let afterBrace = text.slice(braceClose)

    // Update width/height in #define if present
    beforeBrace = beforeBrace.replace(
      /(#define\s+[a-zA-Z0-9_]*width\s+)\d+/gi,
      `$1${width}`
    )
    beforeBrace = beforeBrace.replace(
      /(#define\s+[a-zA-Z0-9_]*height\s+)\d+/gi,
      `$1${height}`
    )

    // Update array size brackets e.g. bmp[1024] -> bmp[bytes.length]
    beforeBrace = beforeBrace.replace(
      /(\[[a-zA-Z0-9_]*)\d+(\]\s*(?:PROGMEM\s*)?=\s*\{)/gi,
      `$1${bytes.length}$2`
    )

    return `${beforeBrace}\n${formattedBody}\n${afterBrace}`
  }

  // 2. If text was a MicroPython bytearray([...])
  const bracketOpen = text.indexOf('[')
  const bracketClose = text.lastIndexOf(']')
  if (text.includes('bytearray(') && bracketOpen !== -1 && bracketClose > bracketOpen) {
    let before = text.slice(0, bracketOpen + 1)
    let after = text.slice(bracketClose)
    before = before.replace(/(WIDTH\s*=\s*)\d+/i, `$1${width}`)
    before = before.replace(/(HEIGHT\s*=\s*)\d+/i, `$1${height}`)
    return `${before}\n${formattedBody}\n${after}`
  }

  // 3. If text was raw space/comma separated hex
  const isRawHex = text.length > 0 && !text.includes(';') && !text.includes('char') && !text.includes('#')
  if (isRawHex) {
    if (text.includes(',')) {
      return Array.from(bytes).map(b => '0x' + b.toString(16).padStart(2, '0').toUpperCase()).join(', ')
    }
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
  }

  // 4. Default: generate clean C header
  const safeName = (varName || 'bitmap').replace(/[^a-zA-Z0-9_]/g, '_')
  if (format === 'xbm') {
    return `#define ${safeName}_width ${width}\n` +
      `#define ${safeName}_height ${height}\n` +
      `static unsigned char ${safeName}_bits[] = {\n` +
      `${formattedBody}\n` +
      `};\n`
  }
  if (format === 'u8g2') {
    return `// U8g2 / SSD1306 Page-Mode Display Buffer: ${width}x${height} px\n` +
      `// Pages: ${Math.ceil(height / 8)}, Total Bytes: ${bytes.length}\n` +
      `const uint8_t ${safeName}[${bytes.length}] PROGMEM = {\n` +
      `${formattedBody}\n` +
      `};\n`
  }

  return `#define ${safeName.toUpperCase()}_WIDTH  ${width}\n` +
    `#define ${safeName.toUpperCase()}_HEIGHT ${height}\n\n` +
    `static const unsigned char PROGMEM ${safeName}_bmp[] = {\n` +
    `${formattedBody}\n` +
    `};\n`
}

/**
 * Decodes a BMP file binary buffer into { width, height, pixels }.
 * Supports 1-bit, 8-bit, 24-bit and 32-bit BMP files.
 */
export function decodeBmpToPixels(arrayBuffer) {
  const view = new DataView(arrayBuffer)
  if (view.getUint16(0, false) !== 0x424D) {
    throw new Error('Not a valid BMP file')
  }
  const bw = view.getInt32(18, true)
  const bh = view.getInt32(22, true)
  const bpp = view.getUint16(28, true)
  const off = view.getUint32(10, true)
  const absH = Math.abs(bh)
  const topDown = bh < 0

  const width = bw
  const height = absH
  const pixels = new Uint8Array(width * height)

  const rowBytes = Math.ceil((width * bpp) / 8)
  const stride = Math.ceil(rowBytes / 4) * 4

  for (let row = 0; row < absH; row++) {
    const y = topDown ? row : (absH - 1 - row)
    for (let x = 0; x < width; x++) {
      let isLit = 0
      if (bpp === 1) {
        const byteVal = view.getUint8(off + row * stride + Math.floor(x / 8))
        isLit = (byteVal >> (7 - (x % 8))) & 1
      } else if (bpp === 8) {
        const val = view.getUint8(off + row * stride + x)
        isLit = val > 127 ? 1 : 0
      } else if (bpp === 24) {
        const base = off + row * stride + x * 3
        const r = view.getUint8(base)
        const g = view.getUint8(base + 1)
        const b = view.getUint8(base + 2)
        isLit = (r + g + b) > 382 ? 1 : 0
      } else if (bpp === 32) {
        const base = off + row * stride + x * 4
        const r = view.getUint8(base)
        const g = view.getUint8(base + 1)
        const b = view.getUint8(base + 2)
        isLit = (r + g + b) > 382 ? 1 : 0
      }
      pixels[y * width + x] = isLit
    }
  }

  return { width, height, pixels }
}

/**
 * Decodes hex bytes into ImageData (legacy helper for compatibility with tests).
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

  if (format === 'rgb565_be' || format === 'rgb565_le') {
    const isLe = format === 'rgb565_le'
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4
        const bi = (y * w + x) * 2
        if (bi + 1 < bytes.length) {
          const b0 = bytes[bi]
          const b1 = bytes[bi + 1]
          const word = isLe ? ((b1 << 8) | b0) : ((b0 << 8) | b1)
          const r = Math.round(((word >> 11) & 0x1f) * 255 / 31)
          const g = Math.round(((word >> 5) & 0x3f) * 255 / 63)
          const b = Math.round((word & 0x1f) * 255 / 31)
          pixelData[idx] = invert ? 255 - r : r
          pixelData[idx + 1] = invert ? 255 - g : g
          pixelData[idx + 2] = invert ? 255 - b : b
          pixelData[idx + 3] = 255
        } else {
          pixelData[idx] = bgR; pixelData[idx + 1] = bgG; pixelData[idx + 2] = bgB; pixelData[idx + 3] = 255
        }
      }
    }
    return { width: w, height: h, data: pixelData }
  }

  const pixels = decodeBytesToPixels(bytes, w, h, format)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4
      const on = pixels[y * w + x] === 1
      const active = invert ? !on : on
      pixelData[idx] = active ? fgR : bgR
      pixelData[idx + 1] = active ? fgG : bgG
      pixelData[idx + 2] = active ? fgB : bgB
      pixelData[idx + 3] = 255
    }
  }

  return { width: w, height: h, data: pixelData }
}

/**
 * Renders decoded hex bytes to a canvas element.
 */
export function renderHexToCanvas(canvas, bytes, width, height, options = {}) {
  if (!canvas) return
  const pixels = decodeBytesToPixels(bytes, width, height, options.format || 'adafruit')
  renderPixelsToCanvas(canvas, pixels, width, height, options)
}

/**
 * Renders pixel buffer directly to canvas with zoom, pixel grid, and cursor hover highlight.
 */
export function renderPixelsToCanvas(canvas, pixels, width, height, options = {}) {
  if (!canvas) return
  const w = width
  const h = height
  const zoom = options.zoom || 1
  const showGrid = Boolean(options.showGrid) && zoom >= 4
  const hoverX = options.hoverX ?? null
  const hoverY = options.hoverY ?? null
  const invert = Boolean(options.invert)
  const fgColor = options.fgColor || '#a8d9a8'
  const bgColor = options.bgColor || '#18211b'

  canvas.width = w * zoom
  canvas.height = h * zoom
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Fill background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw set pixels
  const activeColor = invert ? bgColor : fgColor
  ctx.fillStyle = activeColor

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isBitOn = pixels[y * w + x] === 1
      const isDrawn = invert ? !isBitOn : isBitOn
      if (isDrawn) {
        if (zoom === 1) {
          ctx.fillRect(x, y, 1, 1)
        } else if (showGrid) {
          ctx.fillRect(x * zoom + 1, y * zoom + 1, Math.max(1, zoom - 1), Math.max(1, zoom - 1))
        } else {
          ctx.fillRect(x * zoom, y * zoom, zoom, zoom)
        }
      }
    }
  }

  // Draw pixel grid lines
  if (showGrid) {
    ctx.save()
    ctx.translate(0.5, 0.5)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 0.5
    for (let x = 0; x <= w; x++) {
      ctx.beginPath()
      ctx.moveTo(x * zoom, 0)
      ctx.lineTo(x * zoom, h * zoom)
      ctx.stroke()
    }
    for (let y = 0; y <= h; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * zoom)
      ctx.lineTo(w * zoom, y * zoom)
      ctx.stroke()
    }
    ctx.restore()
  }

  // Draw hover highlight box around hovered pixel
  if (hoverX !== null && hoverY !== null && hoverX >= 0 && hoverX < w && hoverY >= 0 && hoverY < h) {
    ctx.save()
    ctx.translate(0.5, 0.5)
    ctx.strokeStyle = '#00f0ff'
    ctx.lineWidth = Math.max(1, zoom > 6 ? 2 : 1.5)
    ctx.strokeRect(hoverX * zoom, hoverY * zoom, zoom, zoom)
    ctx.restore()
  }
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

  if (format === 'u8g2' || format === 'c_vertical' || format === 'vertical_lsb') {
    const p = Math.floor(y / 8)
    bitIndex = y % 8
    byteIndex = p * width + x
    rawByte = bytes[byteIndex] || 0
    isOn = (rawByte & (1 << bitIndex)) !== 0
  } else if (format === 'vertical_msb' || format === 'c_vertical_msb') {
    const p = Math.floor(y / 8)
    bitIndex = 7 - (y % 8)
    byteIndex = p * width + x
    rawByte = bytes[byteIndex] || 0
    isOn = (rawByte & (1 << (7 - (y % 8)))) !== 0
  } else if (format === 'xbm' || format === 'horizontal_lsb' || format === 'c_horizontal_lsb') {
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
      const totalBytes = 1024
      const b = new Uint8Array(totalBytes)
      const bytesPerRow = 16

      for (let x = 0; x < bytesPerRow; x++) {
        b[0 * bytesPerRow + x] = 0xff
        b[1 * bytesPerRow + x] = 0x80 | 0x01
        b[62 * bytesPerRow + x] = 0x80 | 0x01
        b[63 * bytesPerRow + x] = 0xff
      }
      for (let y = 0; y < 64; y++) {
        b[y * bytesPerRow + 0] |= 0x80
        b[y * bytesPerRow + 15] |= 0x01
      }
      for (let y = 14; y <= 50; y++) {
        b[y * bytesPerRow + 3] |= 0x0f
        b[y * bytesPerRow + 12] |= 0xf0
      }
      for (let x = 4; x <= 11; x++) {
        b[24 * bytesPerRow + x] = 0xff
        b[40 * bytesPerRow + x] = 0xff
      }
      for (let y = 26; y < 39; y++) {
        for (let x = 4; x <= 11; x++) {
          b[y * bytesPerRow + x] = (y % 2 === 0) ? 0xaa : 0x55
        }
      }

      const hexArr = []
      for (let i = 0; i < totalBytes; i += 12) {
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0').toUpperCase())
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
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0').toUpperCase())
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
      const totalBytes = 504
      const b = new Uint8Array(totalBytes)

      for (let p = 0; p < 6; p++) {
        for (let x = 0; x < 84; x++) {
          const idx = p * 84 + x
          if (p === 0) b[idx] = 0x01
          if (p === 5) b[idx] = 0x80
          if (x === 0 || x === 83) b[idx] = 0xff
          if (x > 20 && x < 64 && (p === 2 || p === 3)) {
            b[idx] = (x % 3 === 0) ? 0xaa : 0x55
          }
        }
      }

      const hexArr = []
      for (let i = 0; i < totalBytes; i += 12) {
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0').toUpperCase())
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
        const slice = Array.from(b.slice(i, i + 12)).map(v => '0x' + v.toString(16).padStart(2, '0').toUpperCase())
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
 * Initializes the Hex to Image Decoder & Interactive Pixel Editor.
 */
export function initHexDecoder(state, options = {}) {
  const showToast = options.showToast || (() => {})
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

  const previewWrap = modal.querySelector('#hex-preview-wrap') || modal.querySelector('.hex-preview-container')
  const previewCanvas = modal.querySelector('#hex-decoder-preview')
  const invertCheck = modal.querySelector('#hex-decoder-invert')
  const gridCheck = modal.querySelector('#hex-decoder-grid')
  const themeSelect = modal.querySelector('#hex-decoder-theme')
  const fgColorInput = modal.querySelector('#hex-decoder-fg-color')
  const bgColorInput = modal.querySelector('#hex-decoder-bg-color')
  const zoomBtns = modal.querySelectorAll('.hex-zoom-btn')

  // Tool buttons
  const toolBtns = modal.querySelectorAll('.hex-tool-btn[data-tool]')
  const undoBtn = modal.querySelector('#hex-tool-undo')
  const redoBtn = modal.querySelector('#hex-tool-redo')
  const rot90Btn = modal.querySelector('#hex-tool-rot90')
  const flipXBtn = modal.querySelector('#hex-tool-flipx')
  const flipYBtn = modal.querySelector('#hex-tool-flipy')
  const invertBitsBtn = modal.querySelector('#hex-tool-invert-bits')
  const clearCanvasBtn = modal.querySelector('#hex-tool-clear-canvas')

  // Badges & info displays
  const byteBadge = modal.querySelector('#hex-decoder-byte-count')
  const resBadge = modal.querySelector('#hex-decoder-resolution-badge')
  const statusBadge = modal.querySelector('#hex-decoder-status-badge')
  const hintBanner = modal.querySelector('#hex-decoder-hint')

  const infoSize = modal.querySelector('#hex-info-size')
  const infoXY = modal.querySelector('#hex-info-xy')
  const infoByte = modal.querySelector('#hex-info-byte')
  const infoBit = modal.querySelector('#hex-info-bit')
  const infoIdx = modal.querySelector('#hex-info-idx')
  const infoCount = modal.querySelector('#hex-info-count')

  // Action buttons
  const copyImgBtn = modal.querySelector('#hex-decoder-copy-img')
  const downloadPngBtn = modal.querySelector('#hex-decoder-download-png')
  const insertLayerBtn = modal.querySelector('#hex-decoder-insert-layer')
  const setRefBtn = modal.querySelector('#hex-decoder-set-reference')
  const setProjectBtn = modal.querySelector('#hex-decoder-set-project')

  // Core Editor State
  let currentWidth = 128
  let currentHeight = 64
  let currentZoom = 4
  let currentTool = 'draw' // 'draw' | 'erase' | 'fill' | 'line' | 'rect'
  let pixels = new Uint8Array(currentWidth * currentHeight)
  let currentBytes = new Uint8Array(0)
  let detectedVarName = 'bitmap'

  let isPainting = false
  let activePaintVal = 1
  let isInternalSync = false
  let lineStart = null
  let rectStart = null
  let hoverX = null
  let hoverY = null

  // Undo / Redo history stack (up to 50 snapshots)
  const undoStack = []
  const redoStack = []
  const MAX_UNDO = 50

  function pushUndo() {
    undoStack.push(pixels.slice())
    if (undoStack.length > MAX_UNDO) undoStack.shift()
    redoStack.length = 0
  }

  function undo() {
    if (undoStack.length === 0) return
    redoStack.push(pixels.slice())
    pixels = undoStack.pop()
    syncCanvasToCode()
  }

  function redo() {
    if (redoStack.length === 0) return
    undoStack.push(pixels.slice())
    pixels = redoStack.pop()
    syncCanvasToCode()
  }

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

  function renderPreview(previewBuffer = null) {
    const buf = previewBuffer || pixels
    renderPixelsToCanvas(previewCanvas, buf, currentWidth, currentHeight, {
      zoom: currentZoom,
      showGrid: gridCheck ? gridCheck.checked : true,
      hoverX,
      hoverY,
      invert: invertCheck ? invertCheck.checked : false,
      fgColor: fgColorInput.value,
      bgColor: bgColorInput.value,
    })

    previewCanvas.style.width = `${currentWidth * currentZoom}px`
    previewCanvas.style.height = `${currentHeight * currentZoom}px`

    // Update set pixels count
    let count = 0
    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i] === 1) count++
    }
    const total = currentWidth * currentHeight
    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0
    if (infoCount) infoCount.textContent = `${count.toLocaleString()} / ${total.toLocaleString()} (${pct}%)`
    if (infoSize) infoSize.textContent = `${currentWidth} × ${currentHeight}`
  }

  /**
   * Called when pixels are modified on canvas:
   * Encodes pixels to bytes, updates input textarea in real-time, re-renders canvas.
   */
  function syncCanvasToCode() {
    currentBytes = encodePixelsToBytes(pixels, currentWidth, currentHeight, formatSelect.value)

    isInternalSync = true
    inputArea.value = formatBytesIntoSource(
      inputArea.value,
      currentBytes,
      currentWidth,
      currentHeight,
      formatSelect.value,
      detectedVarName
    )
    isInternalSync = false

    updateBadges()
    renderPreview()
  }

  /**
   * Called when input textarea or dimensions change:
   * Parses code, decodes bytes into pixels, re-renders canvas.
   */
  function decodeAndUpdate() {
    if (isInternalSync) return

    const rawText = inputArea.value || ''
    const parseResult = parseHexInput(rawText)
    currentBytes = parseResult.bytes
    if (parseResult.variableName) detectedVarName = parseResult.variableName

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

    // Decode bytes to internal pixel buffer
    pixels = decodeBytesToPixels(currentBytes, currentWidth, currentHeight, formatSelect.value)

    updateBadges()
    renderPreview()
  }

  function updateBadges() {
    const format = formatSelect.value
    byteBadge.textContent = `${currentBytes.length.toLocaleString()} Bytes (${(currentBytes.length * 8).toLocaleString()} Bits)`
    resBadge.textContent = `${currentWidth} × ${currentHeight} px`

    const isColor = format.startsWith('rgb565')
    const isGray = format === 'gray8'
    const expectedBytes = isColor
      ? currentWidth * currentHeight * 2
      : isGray
      ? currentWidth * currentHeight
      : format === 'u8g2' || format === 'vertical_msb'
      ? Math.ceil(currentHeight / 8) * currentWidth
      : Math.ceil(currentWidth / 8) * currentHeight

    if (currentBytes.length === 0) {
      statusBadge.textContent = 'Empty'
      statusBadge.className = 'badge status-idle'
      hintBanner.textContent = 'Draw directly on the screen above, or paste C/XBM code to start.'
    } else if (currentBytes.length === expectedBytes) {
      statusBadge.textContent = '100% Matched'
      statusBadge.className = 'badge status-match'
      hintBanner.textContent = `Exact byte match: ${currentBytes.length} bytes matches ${currentWidth}×${currentHeight} px (${format}).`
    } else if (currentBytes.length > expectedBytes) {
      const extra = currentBytes.length - expectedBytes
      statusBadge.textContent = `+${extra} Extra Bytes`
      statusBadge.className = 'badge status-warn'
      hintBanner.textContent = `Buffer has ${currentBytes.length} bytes; display uses first ${expectedBytes} bytes (+${extra} unused).`
    } else {
      const missing = expectedBytes - currentBytes.length
      statusBadge.textContent = `-${missing} Bytes Short`
      statusBadge.className = 'badge status-warn'
      hintBanner.textContent = `Buffer has ${currentBytes.length} bytes; ${expectedBytes} bytes needed for full ${currentWidth}×${currentHeight} px.`
    }
  }

  let renderDebounceTimer = null
  function scheduleDecode() {
    if (renderDebounceTimer) clearTimeout(renderDebounceTimer)
    renderDebounceTimer = setTimeout(decodeAndUpdate, 40)
  }

  // Pixel coordinates calculation on canvas
  function getCanvasXY(e) {
    const rect = previewCanvas.getBoundingClientRect()
    const scaleX = currentWidth / rect.width
    const scaleY = currentHeight / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    return [Math.max(0, Math.min(currentWidth - 1, x)), Math.max(0, Math.min(currentHeight - 1, y))]
  }

  function inBounds(x, y) {
    return x >= 0 && x < currentWidth && y >= 0 && y < currentHeight
  }

  function updateHoverInfo(x, y) {
    if (!inBounds(x, y)) {
      if (infoXY) infoXY.textContent = '—'
      if (infoByte) infoByte.textContent = '—'
      if (infoBit) infoBit.textContent = '—'
      if (infoIdx) infoIdx.textContent = '—'
      return
    }

    const pixelInfo = getPixelAt(currentBytes, currentWidth, currentHeight, x, y, {
      format: formatSelect.value,
      invert: invertCheck ? invertCheck.checked : false,
    })

    if (infoXY) infoXY.textContent = `${x}, ${y}`
    if (pixelInfo) {
      if (infoByte) infoByte.textContent = `${pixelInfo.hexByte} (#${pixelInfo.byteIndex})`
      if (infoBit) infoBit.textContent = `Bit ${pixelInfo.bitIndex}`
      if (infoIdx) infoIdx.textContent = `${y * currentWidth + x}`
    }
  }

  // Pointer Interaction on Preview Canvas
  previewCanvas.addEventListener('pointerdown', (e) => {
    previewCanvas.setPointerCapture(e.pointerId)
    isPainting = true
    const [x, y] = getCanvasXY(e)
    if (!inBounds(x, y)) return

    pushUndo()

    const isRightClick = e.button === 2
    const effectiveTool = isRightClick
      ? (currentTool === 'draw' ? 'erase' : 'draw')
      : currentTool

    if (effectiveTool === 'draw') {
      const curVal = pixels[y * currentWidth + x]
      // Click toggles: 1 becomes 0, 0 becomes 1. While dragging, continue painting activePaintVal.
      activePaintVal = curVal === 1 ? 0 : 1
      pixels[y * currentWidth + x] = activePaintVal
      syncCanvasToCode()
    } else if (effectiveTool === 'erase') {
      activePaintVal = 0
      pixels[y * currentWidth + x] = 0
      syncCanvasToCode()
    } else if (effectiveTool === 'fill') {
      const curVal = pixels[y * currentWidth + x]
      floodFillPixels(pixels, currentWidth, currentHeight, x, y, curVal ? 0 : 1)
      syncCanvasToCode()
    } else if (effectiveTool === 'line') {
      lineStart = [x, y]
    } else if (effectiveTool === 'rect') {
      rectStart = [x, y]
    }
  })

  previewCanvas.addEventListener('pointermove', (e) => {
    const [x, y] = getCanvasXY(e)
    hoverX = x
    hoverY = y
    updateHoverInfo(x, y)

    if (!isPainting) {
      renderPreview()
      return
    }

    const isRightClick = (e.buttons & 2) === 2
    const effectiveTool = isRightClick
      ? (currentTool === 'draw' ? 'erase' : 'draw')
      : currentTool

    if (effectiveTool === 'draw') {
      pixels[y * currentWidth + x] = activePaintVal
      syncCanvasToCode()
    } else if (effectiveTool === 'erase') {
      pixels[y * currentWidth + x] = 0
      syncCanvasToCode()
    } else if (effectiveTool === 'line' && lineStart) {
      const tempBuf = pixels.slice()
      drawLinePixels(tempBuf, currentWidth, currentHeight, lineStart[0], lineStart[1], x, y, 1)
      renderPreview(tempBuf)
    } else if (effectiveTool === 'rect' && rectStart) {
      const tempBuf = pixels.slice()
      drawRectPixels(tempBuf, currentWidth, currentHeight, rectStart[0], rectStart[1], x, y, 1)
      renderPreview(tempBuf)
    }
  })

  previewCanvas.addEventListener('pointerup', (e) => {
    const [x, y] = getCanvasXY(e)
    if (currentTool === 'line' && lineStart) {
      drawLinePixels(pixels, currentWidth, currentHeight, lineStart[0], lineStart[1], x, y, 1)
      lineStart = null
      syncCanvasToCode()
    } else if (currentTool === 'rect' && rectStart) {
      drawRectPixels(pixels, currentWidth, currentHeight, rectStart[0], rectStart[1], x, y, 1)
      rectStart = null
      syncCanvasToCode()
    }
    isPainting = false
    renderPreview()
  })

  previewCanvas.addEventListener('pointerleave', () => {
    hoverX = null
    hoverY = null
    if (infoXY) infoXY.textContent = '—'
    if (infoByte) infoByte.textContent = '—'
    if (infoBit) infoBit.textContent = '—'
    if (infoIdx) infoIdx.textContent = '—'
    renderPreview()
  })

  previewCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  // Tool Selector Buttons
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentTool = btn.dataset.tool || 'draw'
    })
  })

  // Undo & Redo Bindings
  undoBtn?.addEventListener('click', undo)
  redoBtn?.addEventListener('click', redo)

  // Rotate 90° Clockwise
  rot90Btn?.addEventListener('click', () => {
    pushUndo()
    const res = rotatePixels90(pixels, currentWidth, currentHeight)
    pixels = res.pixels
    currentWidth = res.width
    currentHeight = res.height
    widthInput.value = currentWidth
    heightInput.value = currentHeight
    syncCanvasToCode()
  })

  // Flip X
  flipXBtn?.addEventListener('click', () => {
    pushUndo()
    pixels = flipPixelsX(pixels, currentWidth, currentHeight)
    syncCanvasToCode()
  })

  // Flip Y
  flipYBtn?.addEventListener('click', () => {
    pushUndo()
    pixels = flipPixelsY(pixels, currentWidth, currentHeight)
    syncCanvasToCode()
  })

  // Invert Bits
  invertBitsBtn?.addEventListener('click', () => {
    pushUndo()
    pixels = invertPixels(pixels)
    syncCanvasToCode()
  })

  // Clear Canvas
  clearCanvasBtn?.addEventListener('click', () => {
    pushUndo()
    pixels = clearPixels(pixels)
    syncCanvasToCode()
  })

  // Drag and drop onto preview canvas wrap
  if (previewWrap) {
    previewWrap.addEventListener('dragover', (e) => {
      e.preventDefault()
      previewWrap.style.outline = '2px dashed #00f0ff'
    })
    previewWrap.addEventListener('dragleave', () => {
      previewWrap.style.outline = ''
    })
    previewWrap.addEventListener('drop', async (e) => {
      e.preventDefault()
      previewWrap.style.outline = ''
      const file = e.dataTransfer?.files?.[0]
      if (!file) return

      const name = file.name.toLowerCase()
      if (name.endsWith('.bmp')) {
        try {
          const buf = await file.arrayBuffer()
          const bmpRes = decodeBmpToPixels(buf)
          pushUndo()
          currentWidth = bmpRes.width
          currentHeight = bmpRes.height
          widthInput.value = currentWidth
          heightInput.value = currentHeight
          pixels = bmpRes.pixels
          syncCanvasToCode()
          showToast(`📁 Loaded BMP: ${bmpRes.width}×${bmpRes.height} px`, 'info')
        } catch (err) {
          showToast('Failed to parse BMP file: ' + err.message, 'error')
        }
      } else {
        const text = await file.text()
        inputArea.value = text
        decodeAndUpdate()
        showToast(`📁 Loaded file: ${file.name}`, 'info')
      }
    })
  }

  // Keyboard Shortcuts (Undo, Redo, Tools)
  window.addEventListener('keydown', (e) => {
    if (modal.hidden) return
    const isEditingText = e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT'

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (!isEditingText) {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !isEditingText) {
      e.preventDefault()
      redo()
    } else if (!isEditingText && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const keyMap = { d: 'draw', e: 'erase', f: 'fill', l: 'line', r: 'rect' }
      const tool = keyMap[e.key.toLowerCase()]
      if (tool) {
        currentTool = tool
        toolBtns.forEach(b => {
          if (b.dataset.tool === tool) b.classList.add('active')
          else b.classList.remove('active')
        })
      }
    }
  })

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
      pushUndo()
      const newW = parseInt(wStr, 10)
      const newH = parseInt(hStr, 10)
      widthInput.value = newW
      heightInput.value = newH
      currentWidth = newW
      currentHeight = newH
      pixels = new Uint8Array(newW * newH)
      syncCanvasToCode()
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
    pushUndo()
    const temp = widthInput.value
    widthInput.value = heightInput.value
    heightInput.value = temp
    currentWidth = parseInt(widthInput.value, 10)
    currentHeight = parseInt(heightInput.value, 10)
    pixels = new Uint8Array(currentWidth * currentHeight)
    syncCanvasToCode()
  })

  // Clear text button
  clearBtn.addEventListener('click', () => {
    pushUndo()
    inputArea.value = ''
    pixels = new Uint8Array(currentWidth * currentHeight)
    decodeAndUpdate()
  })

  // Zoom buttons
  zoomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      zoomBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      currentZoom = parseInt(btn.dataset.zoom, 10) || 4
      renderPreview()
    })
  })

  // Theme selection
  themeSelect.addEventListener('change', () => {
    applyTheme(themeSelect.value)
    renderPreview()
  })

  // Copy Decoded Image to Clipboard
  copyImgBtn.addEventListener('click', async () => {
    if (!previewCanvas) return
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
      copyImgBtn.textContent = '✓ Copied (Fallback)'
      setTimeout(() => { copyImgBtn.textContent = '📋 Copy Image' }, 2000)
    }
  })

  // Download PNG
  downloadPngBtn.addEventListener('click', () => {
    if (!previewCanvas) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `decoded_hex_${currentWidth}x${currentHeight}.png`
    link.href = dataUrl
    link.click()
  })

  // Insert as Canvas Layer
  insertLayerBtn.addEventListener('click', () => {
    if (!previewCanvas) return
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

  // Set as Reference Image
  setRefBtn.addEventListener('click', () => {
    if (!previewCanvas) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    updateReference({
      src: dataUrl,
      fileName: `hex_${currentWidth}x${currentHeight}.png`,
      naturalWidth: currentWidth,
      naturalHeight: currentHeight,
    })
    closeModal()
  })

  // Set as Project Screen
  setProjectBtn.addEventListener('click', async () => {
    if (!previewCanvas) return
    const dataUrl = previewCanvas.toDataURL('image/png')
    setBitmapCache(dataUrl, previewCanvas)

    const origLabel = setProjectBtn.textContent
    setProjectBtn.textContent = '⏳ Creating Mockup...'
    setProjectBtn.disabled = true

    try {
      updateDisplay({
        width: currentWidth,
        height: currentHeight,
        background: bgColorInput.value,
      })

      updateReference({
        src: dataUrl,
        fileName: `hex_${currentWidth}x${currentHeight}.png`,
        naturalWidth: currentWidth,
        naturalHeight: currentHeight,
      })

      let vectorized = false
      try {
        const result = await analyzeReferenceImage({
          detectText: true,
          detectFrames: true,
          detectBadges: true,
          detectCircles: true,
          detectSymbols: true,
        }, dataUrl)

        if (result && result.elements && result.elements.length > 0) {
          state.elements = []
          for (const data of result.elements) {
            createElementFromAnalysis(data, false)
          }
          notify()
          vectorized = true
          showToast(`✨ Created editable mockup with ${result.elements.length} elements! (Original in Reference)`, 'info')
        }
      } catch (err) {
        console.warn('Auto-vectorization skipped:', err)
      }

      if (!vectorized) {
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
        showToast('🖥️ Mockup created with decoded bitmap layer & background reference.', 'info')
      }

      closeModal()
    } finally {
      setProjectBtn.textContent = origLabel
      setProjectBtn.disabled = false
    }
  })

  // Event Listeners for Input and Settings
  inputArea.addEventListener('input', scheduleDecode)
  formatSelect.addEventListener('change', () => {
    // When format changes, re-decode input text with new format
    decodeAndUpdate()
  })
  widthInput.addEventListener('input', scheduleDecode)
  heightInput.addEventListener('input', scheduleDecode)
  invertCheck?.addEventListener('change', () => renderPreview())
  gridCheck?.addEventListener('change', () => renderPreview())
  fgColorInput?.addEventListener('input', () => renderPreview())
  bgColorInput?.addEventListener('input', () => renderPreview())

  function openModal(customText = null) {
    modal.removeAttribute('hidden')
    modal.hidden = false
    modal.classList.add('open')
    modal.style.display = 'flex'
    if (typeof customText === 'string') {
      inputArea.value = customText
    } else if (!inputArea.value.trim()) {
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

  const maximizeBtn = modal.querySelector('#hex-decoder-maximize')
  const modalDialog = modal.querySelector('.modal-dialog')
  maximizeBtn?.addEventListener('click', () => {
    modalDialog?.classList.toggle('fullscreen')
    const isFull = modalDialog?.classList.contains('fullscreen')
    maximizeBtn.textContent = isFull ? '🗗' : '⛶'
    maximizeBtn.title = isFull ? 'Pencereyi Küçült' : 'Tam Ekran Yap'
  })

  openBtn?.addEventListener('click', () => openModal())
  refFromHexBtn?.addEventListener('click', () => openModal())
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

  closeModal()

  return { openModal, closeModal }
}
