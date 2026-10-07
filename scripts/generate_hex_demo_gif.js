import fs from 'node:fs'
import path from 'node:path'
import { GifWriter } from 'omggif'

// Dimensions matching standard studio demo animations
const WIDTH = 680
const HEIGHT = 380

// Curated 32-color palette for dark studio + OLED Cyan + Matrix accents
const PALETTE = [
  0x0d1117, // 0: Main background (GitHub dark)
  0x161b22, // 1: Panel surface
  0x21262d, // 2: Border / container
  0x30363d, // 3: Active border / subtle line
  0x484f58, // 4: Muted element
  0x8b949e, // 5: Secondary text
  0xc9d1d9, // 6: Primary text
  0xf0f6fc, // 7: Bright white text
  0x238636, // 8: Primary green button
  0x2ea043, // 9: Green button hover
  0x3fb950, // 10: Neon green accent / success
  0x56d364, // 11: Bright green selection handles
  0x1f6feb, // 12: Blue button
  0x58a6ff, // 13: Cyan / blue highlight
  0xa5d6ff, // 14: Soft cyan
  0xda3633, // 15: Red / danger
  0xf85149, // 16: Bright red
  0xd29922, // 17: Yellow / warning
  0x050c14, // 18: Deep OLED background
  0x00f0ff, // 19: OLED Cyan active pixel (glow)
  0x00a8b3, // 20: OLED Cyan medium / secondary
  0x0a1e2e, // 21: OLED grid / inactive pixel
  0x1f2937, // 22: Code box background
  0xff7b72, // 23: Code keyword (coral/red)
  0x79c0ff, // 24: Code number / hex (light blue)
  0x8957e5, // 25: Purple badge
  0x38bdf8, // 26: Sky blue accent
  0x10b981, // 27: Emerald badge
  0x059669, // 28: Dark emerald
  0xffffff, // 29: Pure white
  0x000000, // 30: Pure black
  0xffb800, // 31: Gold / Amber
]

// 5x7 font dictionary
const FONT = {
  ' ': [0,0,0,0,0],
  '0': [0x3e,0x51,0x49,0x45,0x3e],
  '1': [0x00,0x42,0x7f,0x40,0x00],
  '2': [0x42,0x61,0x51,0x49,0x46],
  '3': [0x21,0x41,0x45,0x4b,0x31],
  '4': [0x18,0x14,0x12,0x7f,0x10],
  '5': [0x27,0x45,0x45,0x45,0x39],
  '6': [0x3c,0x4a,0x49,0x49,0x30],
  '7': [0x01,0x71,0x09,0x05,0x03],
  '8': [0x36,0x49,0x49,0x49,0x36],
  '9': [0x06,0x49,0x49,0x29,0x1e],
  'A': [0x7e,0x11,0x11,0x11,0x7e],
  'B': [0x7f,0x49,0x49,0x49,0x36],
  'C': [0x3e,0x41,0x41,0x41,0x22],
  'D': [0x7f,0x41,0x41,0x22,0x1c],
  'E': [0x7f,0x49,0x49,0x49,0x41],
  'F': [0x7f,0x09,0x09,0x09,0x01],
  'G': [0x3e,0x41,0x49,0x49,0x7a],
  'H': [0x7f,0x08,0x08,0x08,0x7f],
  'I': [0x00,0x41,0x7f,0x41,0x00],
  'J': [0x20,0x40,0x41,0x3f,0x01],
  'K': [0x7f,0x08,0x14,0x22,0x41],
  'L': [0x7f,0x40,0x40,0x40,0x40],
  'M': [0x7f,0x02,0x0c,0x02,0x7f],
  'N': [0x7f,0x04,0x08,0x10,0x7f],
  'O': [0x3e,0x41,0x41,0x41,0x3e],
  'P': [0x7f,0x09,0x09,0x09,0x06],
  'Q': [0x3e,0x41,0x51,0x21,0x5e],
  'R': [0x7f,0x09,0x19,0x29,0x46],
  'S': [0x46,0x49,0x49,0x49,0x31],
  'T': [0x01,0x01,0x7f,0x01,0x01],
  'U': [0x3f,0x40,0x40,0x40,0x3f],
  'V': [0x1f,0x20,0x40,0x20,0x1f],
  'W': [0x7f,0x20,0x18,0x20,0x7f],
  'X': [0x63,0x14,0x08,0x14,0x63],
  'Y': [0x07,0x08,0x70,0x08,0x07],
  'Z': [0x61,0x51,0x49,0x45,0x43],
  'a': [0x20,0x54,0x54,0x54,0x78],
  'b': [0x7f,0x48,0x44,0x44,0x38],
  'c': [0x38,0x44,0x44,0x44,0x20],
  'd': [0x38,0x44,0x44,0x48,0x7f],
  'e': [0x38,0x54,0x54,0x54,0x18],
  'f': [0x08,0x7e,0x09,0x01,0x02],
  'g': [0x0c,0x52,0x52,0x52,0x3e],
  'h': [0x7f,0x08,0x04,0x04,0x78],
  'i': [0x00,0x44,0x7d,0x40,0x00],
  'j': [0x20,0x40,0x44,0x3d,0x00],
  'k': [0x7f,0x10,0x28,0x44,0x00],
  'l': [0x00,0x41,0x7f,0x40,0x00],
  'm': [0x7c,0x04,0x18,0x04,0x78],
  'n': [0x7c,0x08,0x04,0x04,0x78],
  'o': [0x38,0x44,0x44,0x44,0x38],
  'p': [0x7c,0x14,0x14,0x14,0x08],
  'q': [0x08,0x14,0x14,0x18,0x7c],
  'r': [0x7c,0x08,0x04,0x04,0x08],
  's': [0x48,0x54,0x54,0x54,0x20],
  't': [0x04,0x3f,0x44,0x40,0x20],
  'u': [0x3c,0x40,0x40,0x20,0x7c],
  'v': [0x1c,0x20,0x40,0x20,0x1c],
  'w': [0x3c,0x40,0x30,0x40,0x3c],
  'x': [0x44,0x28,0x10,0x28,0x44],
  'y': [0x0c,0x50,0x50,0x50,0x3c],
  'z': [0x44,0x64,0x54,0x4c,0x44],
  ':': [0x00,0x36,0x36,0x00,0x00],
  '.': [0x00,0x60,0x60,0x00,0x00],
  ',': [0x00,0x80,0x60,0x00,0x00],
  '-': [0x08,0x08,0x08,0x08,0x08],
  '+': [0x08,0x08,0x3e,0x08,0x08],
  '/': [0x20,0x10,0x08,0x04,0x02],
  '[': [0x00,0x7f,0x41,0x41,0x00],
  ']': [0x00,0x41,0x41,0x7f,0x00],
  '{': [0x00,0x08,0x36,0x41,0x00],
  '}': [0x00,0x41,0x36,0x08,0x00],
  ';': [0x00,0x80,0x60,0x00,0x00],
  '(': [0x00,0x1c,0x22,0x41,0x00],
  ')': [0x00,0x41,0x22,0x1c,0x00],
  '=': [0x14,0x14,0x14,0x14,0x14],
  '#': [0x14,0x7f,0x14,0x7f,0x14],
  '_': [0x80,0x80,0x80,0x80,0x80],
  '%': [0x23,0x13,0x08,0x64,0x62],
  '>': [0x00,0x41,0x22,0x14,0x08],
  '<': [0x08,0x14,0x22,0x41,0x00],
  '*': [0x14,0x08,0x3e,0x08,0x14],
  '|': [0x00,0x00,0x7f,0x00,0x00],
}

class Canvas {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.pixels = new Uint8Array(w * h)
  }

  fill(color) {
    this.pixels.fill(color)
  }

  set(x, y, color) {
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) {
      this.pixels[y * this.w + x] = color
    }
  }

  fillRect(x, y, w, h, color) {
    const x0 = Math.max(0, x)
    const y0 = Math.max(0, y)
    const x1 = Math.min(this.w, x + w)
    const y1 = Math.min(this.h, y + h)
    for (let py = y0; py < y1; py++) {
      const row = py * this.w
      for (let px = x0; px < x1; px++) {
        this.pixels[row + px] = color
      }
    }
  }

  strokeRect(x, y, w, h, color) {
    this.hLine(x, y, w, color)
    this.hLine(x, y + h - 1, w, color)
    this.vLine(x, y, h, color)
    this.vLine(x + w - 1, y, h, color)
  }

  hLine(x, y, len, color) {
    if (y < 0 || y >= this.h) return
    const x0 = Math.max(0, x)
    const x1 = Math.min(this.w, x + len)
    const row = y * this.w
    for (let px = x0; px < x1; px++) {
      this.pixels[row + px] = color
    }
  }

  vLine(x, y, len, color) {
    if (x < 0 || x >= this.w) return
    const y0 = Math.max(0, y)
    const y1 = Math.min(this.h, y + len)
    for (let py = y0; py < y1; py++) {
      this.pixels[py * this.w + x] = color
    }
  }

  drawText(text, x, y, color, scale = 1) {
    let curX = x
    const str = String(text)
    for (let i = 0; i < str.length; i++) {
      const ch = str[i]
      const glyph = FONT[ch] || FONT[ch.toUpperCase()] || FONT[' ']
      for (let c = 0; c < 5; c++) {
        const bits = glyph[c]
        for (let r = 0; r < 7; r++) {
          if ((bits >> r) & 1) {
            for (let sy = 0; sy < scale; sy++) {
              for (let sx = 0; sx < scale; sx++) {
                this.set(curX + c * scale + sx, y + r * scale + sy, color)
              }
            }
          }
        }
      }
      curX += (5 + 1) * scale
    }
  }

  drawButton(x, y, w, h, text, isPrimary = false, isHovered = false) {
    const bg = isPrimary ? (isHovered ? 9 : 8) : (isHovered ? 3 : 2)
    const border = isPrimary ? 10 : (isHovered ? 5 : 3)
    const textColor = isPrimary ? 29 : (isHovered ? 7 : 6)
    this.fillRect(x, y, w, h, bg)
    this.strokeRect(x, y, w, h, border)
    const textW = text.length * 6
    const tx = x + Math.floor((w - textW) / 2)
    const ty = y + Math.floor((h - 7) / 2)
    this.drawText(text, tx, ty, textColor)
  }

  drawCursor(x, y) {
    const shape = [
      [1,0,0,0,0,0,0],
      [1,1,0,0,0,0,0],
      [1,7,1,0,0,0,0],
      [1,7,7,1,0,0,0],
      [1,7,7,7,1,0,0],
      [1,7,7,7,7,1,0],
      [1,7,7,1,1,1,1],
      [1,7,1,1,0,0,0],
      [1,1,0,1,1,0,0],
      [1,0,0,0,1,1,0],
    ]
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        const v = shape[r][c]
        if (v === 1) this.set(x + c, y + r, 30)
        else if (v === 7) this.set(x + c, y + r, 7)
      }
    }
  }
}

// Draw the LCD screen bitmap pattern (OLED Cyan or matrix green)
function drawOledDisplayScreen(cv, ox, oy, w, h, activePixelColor = 19) {
  // Screen background
  cv.fillRect(ox, oy, w, h, 18) // deep OLED dark
  cv.strokeRect(ox, oy, w, h, 3) // subtle border

  // Dot matrix background grid
  for (let gy = oy + 2; gy < oy + h - 2; gy += 4) {
    for (let gx = ox + 2; gx < ox + w - 2; gx += 4) {
      cv.set(gx, gy, 21) // faint grid dot
    }
  }

  // Draw Header Line inside OLED
  cv.drawText('SYSTEM READY', ox + 8, oy + 8, activePixelColor)
  cv.drawText('12:30', ox + w - 38, oy + 8, activePixelColor)
  cv.hLine(ox + 8, oy + 19, w - 16, activePixelColor)

  // Draw Battery Icon & percentage
  // Battery body
  cv.strokeRect(ox + w - 58, oy + 26, 24, 11, activePixelColor)
  cv.fillRect(ox + w - 34, oy + 29, 2, 5, activePixelColor) // terminal tip
  // 4 charge bars filled
  cv.fillRect(ox + w - 55, oy + 28, 4, 7, activePixelColor)
  cv.fillRect(ox + w - 49, oy + 28, 4, 7, activePixelColor)
  cv.fillRect(ox + w - 43, oy + 28, 4, 7, activePixelColor)
  cv.drawText('82%', ox + w - 28, oy + 28, activePixelColor)

  // Draw Telemetry Speed & Temp
  cv.drawText('SPEED:', ox + 8, oy + 28, activePixelColor)
  cv.drawText('48.2 km/h', ox + 48, oy + 28, 29) // bright white/cyan

  cv.drawText('TEMP:  23.5 C', ox + 8, oy + 42, activePixelColor)
  cv.drawText('CONNECT: OK', ox + 8, oy + 54, activePixelColor)

  // Cellular signal indicator (ascending bars)
  for (let b = 0; b < 4; b++) {
    const barH = 3 + b * 2
    cv.fillRect(ox + w - 58 + b * 4, oy + 58 - barH, 2, barH, activePixelColor)
  }
}

// Render complete studio scene with state options
function renderHexDemoScene(opts = {}) {
  const cv = new Canvas(WIDTH, HEIGHT)
  cv.fill(0) // #0d1117 background

  // 1. TOPBAR
  cv.fillRect(0, 0, WIDTH, 36, 1) // topbar surface
  cv.hLine(0, 36, WIDTH, 2) // separator line

  // Brand icon & title
  cv.fillRect(10, 6, 24, 24, 8)
  cv.drawText('L', 18, 12, 7)
  cv.drawText('LCD Mockup Studio', 42, 10, 7)
  cv.drawText('Untitled Project', 42, 21, 5)

  // Topbar actions: Export PNG, Export SVG, Export Code
  const btnY = 6
  const isPngHover = opts.hoverTopBtn === 'png'
  const isCodeHover = opts.hoverTopBtn === 'code'

  cv.drawButton(WIDTH - 245, btnY, 72, 24, 'Export PNG', false, isPngHover)
  cv.drawButton(WIDTH - 168, btnY, 72, 24, 'Export SVG', false, false)
  cv.drawButton(WIDTH - 90, btnY, 80, 24, 'Export Code', true, isCodeHover)

  // 2. LEFT SIDEBAR
  const sbW = 168
  cv.fillRect(0, 37, sbW, HEIGHT - 37, 1)
  cv.vLine(sbW, 37, HEIGHT - 37, 2)

  // Panel title
  cv.drawText('REFERENCE', 12, 48, 7)
  cv.drawText('SOURCE IMAGE / HEX', 12, 59, 5)

  // Reference preview box
  cv.fillRect(12, 72, sbW - 24, 84, 0)
  cv.strokeRect(12, 72, sbW - 24, 84, 2)

  if (opts.hasVectorMockup) {
    // Show thumbnail of created mockup
    drawOledDisplayScreen(cv, 18, 78, sbW - 36, 72, 10)
  } else {
    cv.drawText('No image', 52, 102, 5)
    cv.drawText('Paste or Hex', 44, 114, 4)
  }

  // Upload row: Upload, Try Sample, From Hex
  cv.drawButton(12, 164, 44, 22, 'Upload', false, false)
  cv.drawButton(59, 164, 44, 22, 'Sample', false, false)
  const isFromHexHover = opts.hoverFromHex
  cv.drawButton(106, 164, 50, 22, 'From Hex', false, isFromHexHover)

  // Mode tabs
  cv.fillRect(12, 194, sbW - 24, 20, 2)
  cv.drawText('LCD Screen', 20, 200, 10)
  cv.drawText('Photo', 106, 200, 5)

  // Analyze button
  cv.drawButton(12, 222, sbW - 24, 24, 'Analyze Screen', false, false)

  // 3. MAIN WORKSPACE CANVAS
  const wsX = sbW + 1
  const wsY = 37
  const wsW = WIDTH - wsX
  const wsH = HEIGHT - wsY

  // Canvas background grid pattern
  cv.fillRect(wsX, wsY, wsW, wsH, 0)
  for (let py = wsY + 16; py < HEIGHT; py += 32) {
    for (let px = wsX + 16; px < WIDTH; px += 32) {
      cv.set(px, py, 3) // grid point
    }
  }

  // Centered Screen on Canvas
  const scrW = 280
  const scrH = 140
  const scrX = wsX + Math.floor((wsW - scrW) / 2)
  const scrY = wsY + Math.floor((wsH - scrH) / 2) - 10

  // Device bezel
  cv.fillRect(scrX - 10, scrY - 10, scrW + 20, scrH + 20, 2)
  cv.strokeRect(scrX - 10, scrY - 10, scrW + 20, scrH + 20, 3)

  if (opts.hasVectorMockup) {
    // Render the live vectorized elements on canvas!
    drawOledDisplayScreen(cv, scrX, scrY, scrW, scrH, 19)

    // Highlight selected vector text element with green bounding box & resize dots
    cv.strokeRect(scrX + 6, scrY + 24, 110, 15, 11)
    // 4 corner handles
    cv.fillRect(scrX + 4, scrY + 22, 5, 5, 11)
    cv.fillRect(scrX + 113, scrY + 22, 5, 5, 11)
    cv.fillRect(scrX + 4, scrY + 36, 5, 5, 11)
    cv.fillRect(scrX + 113, scrY + 36, 5, 5, 11)

    // Element badge
    cv.fillRect(scrX + 6, scrY + 6, 80, 14, 2)
    cv.drawText('Text: SPEED', scrX + 10, scrY + 10, 11)
  } else {
    // Empty canvas waiting for import
    cv.fillRect(scrX, scrY, scrW, scrH, 1)
    cv.drawText('128 x 64 Display Canvas', scrX + 70, scrY + 58, 5)
    cv.drawText('Ready for Hex / Image Import', scrX + 54, scrY + 72, 4)
  }

  // 4. HEX DECODER MODAL (When active)
  if (opts.showHexModal) {
    // Dim backdrop overlay
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if ((x + y) % 2 === 0) cv.set(x, y, 30)
      }
    }

    const mW = 540
    const mH = 300
    const mX = Math.floor((WIDTH - mW) / 2)
    const mY = Math.floor((HEIGHT - mH) / 2)

    // Modal card
    cv.fillRect(mX, mY, mW, mH, 1)
    cv.strokeRect(mX, mY, mW, mH, 3)

    // Modal Header
    cv.fillRect(mX, mY, mW, 32, 2)
    cv.hLine(mX, mY + 32, mW, 3)
    cv.drawText('Hex to Image Decoder', mX + 14, mY + 10, 7)

    // Header Badges
    cv.fillRect(mX + 160, mY + 8, 70, 16, 27) // Emerald badge: 1024 Bytes
    cv.drawText('1024 Bytes', mX + 165, mY + 12, 29)

    cv.fillRect(mX + 236, mY + 8, 80, 16, 25) // Purple badge: 128x64 OLED
    cv.drawText('128x64 OLED', mX + 242, mY + 12, 29)

    // Close button
    cv.drawText('X', mX + mW - 22, mY + 10, 5)

    // Modal Controls Sub-bar
    cv.fillRect(mX + 12, mY + 40, mW - 24, 22, 0)
    cv.drawText('Sample: SSD1306 OLED (128x64)', mX + 18, mY + 46, 6)
    cv.drawText('Format: Adafruit MSB', mX + 260, mY + 46, 13)
    cv.drawText('Theme: OLED Cyan', mX + 410, mY + 46, 19)

    // Modal Body Left: Code Input Box
    const boxW = 240
    const boxH = 175
    const boxX = mX + 12
    const boxY = mY + 68

    cv.fillRect(boxX, boxY, boxW, boxH, 22) // dark code background
    cv.strokeRect(boxX, boxY, boxW, boxH, 3)

    // Render formatted C hex bytes
    cv.drawText('// SSD1306 OLED C Array', boxX + 8, boxY + 8, 5)
    cv.drawText('static const uint8_t logo[] = {', boxX + 8, boxY + 20, 23)
    cv.drawText('  0x00, 0xFF, 0xAA, 0x55, 0xC3,', boxX + 8, boxY + 34, 24)
    cv.drawText('  0x18, 0x3C, 0x7E, 0xE7, 0xDB,', boxX + 8, boxY + 46, 24)
    cv.drawText('  0xBD, 0x7E, 0x3C, 0x18, 0x00,', boxX + 8, boxY + 58, 24)
    cv.drawText('  0x3C, 0x42, 0x81, 0x81, 0x42,', boxX + 8, boxY + 70, 24)
    cv.drawText('  0x3C, 0x18, 0x24, 0x42, 0x81,', boxX + 8, boxY + 82, 24)
    cv.drawText('  0x81, 0x42, 0x24, 0x18, 0x00,', boxX + 8, boxY + 94, 24)
    cv.drawText('  0xFF, 0xAA, 0x55, 0xC3, 0x18', boxX + 8, boxY + 106, 24)
    cv.drawText('};', boxX + 8, boxY + 120, 23)

    // Code stats line
    cv.drawText('8192 Pixels / 1-bit Monochrome', boxX + 8, boxY + 155, 10)

    // Modal Body Right: Decoded Screen Preview
    const prvW = 260
    const prvH = 145
    const prvX = mX + 268
    const prvY = mY + 68

    drawOledDisplayScreen(cv, prvX, prvY, prvW, prvH, 19)

    // Live Hover / Bit inspector badge
    cv.fillRect(prvX, prvY + prvH + 6, prvW, 20, 0)
    cv.strokeRect(prvX, prvY + prvH + 6, prvW, 20, 3)
    cv.drawText('Inspector: X:42 Y:18 | Bit:1 | 0xAA', prvX + 8, prvY + prvH + 11, 13)

    // Bottom Action Buttons
    const actY = mY + mH - 36
    const isPngHover = opts.hoverDownloadPng
    const isMockupHover = opts.hoverCreateMockup

    cv.drawButton(mX + 12, actY, 110, 26, 'Copy Image', false, false)
    cv.drawButton(mX + 130, actY, 130, 26, 'Download PNG', false, isPngHover)
    cv.drawButton(mX + 268, actY, 260, 26, 'Create Mockup From This', true, isMockupHover)

    // Download PNG notification popup (if triggered)
    if (opts.showDownloadBadge) {
      cv.fillRect(mX + 100, actY - 28, 340, 22, 8)
      cv.strokeRect(mX + 100, actY - 28, 340, 22, 10)
      cv.drawText('Saved: oled_128x64.png (1:1 Pixel Hardware PNG)', mX + 110, actY - 22, 29)
    }
  }

  // 5. EXPORT CODE MODAL (When active)
  if (opts.showCodeModal) {
    // Dim backdrop overlay
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if ((x + y) % 2 === 0) cv.set(x, y, 30)
      }
    }

    const mW = 520
    const mH = 290
    const mX = Math.floor((WIDTH - mW) / 2)
    const mY = Math.floor((HEIGHT - mH) / 2)

    cv.fillRect(mX, mY, mW, mH, 1)
    cv.strokeRect(mX, mY, mW, mH, 3)

    // Header
    cv.fillRect(mX, mY, mW, 32, 2)
    cv.hLine(mX, mY + 32, mW, 3)
    cv.drawText('Code Export (Multi-Format)', mX + 14, mY + 10, 7)
    cv.drawText('X', mX + mW - 22, mY + 10, 5)

    // Code Category Tabs: C / C++, JSON, Hex, MicroPython, Base64
    const tabY = mY + 38
    const isHexTab = opts.codeTab === 'hex'

    cv.drawButton(mX + 12, tabY, 80, 22, 'C / C++', !isHexTab, false)
    cv.drawButton(mX + 96, tabY, 80, 22, 'JSON Code', false, false)
    cv.drawButton(mX + 180, tabY, 80, 22, 'Hex Code', isHexTab, false)
    cv.drawButton(mX + 264, tabY, 92, 22, 'MicroPython', false, false)
    cv.drawButton(mX + 360, tabY, 92, 22, 'Base64 URI', false, false)

    // Code Output Area
    const outX = mX + 12
    const outY = tabY + 28
    const outW = mW - 24
    const outH = 145

    cv.fillRect(outX, outY, outW, outH, 22)
    cv.strokeRect(outX, outY, outW, outH, 3)

    if (isHexTab) {
      cv.drawText('// Format: C Hex Array (Adafruit MSB - 1024 Bytes)', outX + 10, outY + 10, 5)
      cv.drawText('const uint8_t PROGMEM display_hex[] = {', outX + 10, outY + 24, 23)
      cv.drawText('  0x00, 0xFF, 0xAA, 0x55, 0xC3, 0x18, 0x3C, 0x7E,', outX + 10, outY + 38, 24)
      cv.drawText('  0xE7, 0xDB, 0xBD, 0x7E, 0x3C, 0x18, 0x00, 0x3C,', outX + 10, outY + 50, 24)
      cv.drawText('  0x42, 0x81, 0x81, 0x42, 0x3C, 0x18, 0x24, 0x42,', outX + 10, outY + 62, 24)
      cv.drawText('  0x81, 0x81, 0x42, 0x24, 0x18, 0x00, 0xFF, 0xAA', outX + 10, outY + 74, 24)
      cv.drawText('};', outX + 10, outY + 90, 23)
      cv.drawText('Ready for U8g2 / Adafruit_GFX / SSD1306', outX + 10, outY + 115, 10)
    } else {
      cv.drawText('#include <Adafruit_GFX.h>', outX + 10, outY + 10, 23)
      cv.drawText('#define DISPLAY_WIDTH 128', outX + 10, outY + 24, 24)
      cv.drawText('#define DISPLAY_HEIGHT 64', outX + 10, outY + 36, 24)
      cv.drawText('const unsigned char bitmap[] PROGMEM = { ... };', outX + 10, outY + 52, 6)
    }

    // Modal Actions
    const mActY = mY + mH - 34
    cv.drawButton(mX + 12, mActY, 140, 24, 'Copy Hex Code', true, opts.hoverCopyHex)
    cv.drawButton(mX + 160, mActY, 140, 24, 'Download .hex', false, false)
    cv.drawButton(mX + mW - 92, mActY, 80, 24, 'Close', false, false)
  }

  // 6. TOAST NOTIFICATION (if active)
  if (opts.toastText) {
    const tW = opts.toastText.length * 6 + 24
    const tH = 26
    const tX = WIDTH - tW - 14
    const tY = 44
    cv.fillRect(tX, tY, tW, tH, 8) // green toast
    cv.strokeRect(tX, tY, tW, tH, 10)
    cv.drawText(opts.toastText, tX + 10, tY + 8, 29)
  }

  // 7. MOUSE CURSOR
  if (opts.cursor) {
    cv.drawCursor(opts.cursor.x, opts.cursor.y)
  }

  return cv.pixels
}

console.log('Generating high-fidelity Hex & Multi-Code animated GIF...')

const frames = []

// ====================================================================
// Phase 1: Studio Idle & Move Cursor to "From Hex" (frames 0..6)
// ====================================================================
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(280 - t * 150)
  const cy = Math.round(180 - t * 10)
  frames.push({
    pixels: renderHexDemoScene({
      cursor: { x: cx, y: cy },
      hoverFromHex: i === 5,
    }),
    delay: 15,
  })
}

// Click "From Hex" button (frame 6)
frames.push({
  pixels: renderHexDemoScene({
    cursor: { x: 130, y: 174 },
    hoverFromHex: true,
  }),
  delay: 25,
})

// ====================================================================
// Phase 2: Hex to Image Decoder Modal Opens (frames 7..16)
// C Array hex code is decoded in real-time into the OLED screen
// ====================================================================
for (let i = 0; i <= 8; i++) {
  frames.push({
    pixels: renderHexDemoScene({
      showHexModal: true,
      cursor: { x: 260 + i * 10, y: 140 + i * 5 },
    }),
    delay: 18,
  })
}

// ====================================================================
// Phase 3: Move cursor to "Download PNG" & Click (frames 17..24)
// User downloads crisp 1:1 hardware PNG directly from decoded hex
// ====================================================================
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(340 - t * 150)
  const cy = Math.round(180 + t * 140)
  frames.push({
    pixels: renderHexDemoScene({
      showHexModal: true,
      cursor: { x: cx, y: cy },
      hoverDownloadPng: i >= 4,
    }),
    delay: 15,
  })
}

// Click Download PNG -> Green download confirmation badge appears!
for (let i = 0; i <= 5; i++) {
  frames.push({
    pixels: renderHexDemoScene({
      showHexModal: true,
      cursor: { x: 190, y: 320 },
      hoverDownloadPng: true,
      showDownloadBadge: true,
    }),
    delay: 20,
  })
}

// ====================================================================
// Phase 4: Move cursor to "Create Mockup From This" & Click (frames 25..32)
// Vectorizes the hex bitmap into editable studio elements
// ====================================================================
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(190 + t * 200)
  const cy = Math.round(320)
  frames.push({
    pixels: renderHexDemoScene({
      showHexModal: true,
      cursor: { x: cx, y: cy },
      hoverCreateMockup: i >= 4,
    }),
    delay: 15,
  })
}

// Click Create Mockup!
frames.push({
  pixels: renderHexDemoScene({
    showHexModal: true,
    cursor: { x: 390, y: 320 },
    hoverCreateMockup: true,
  }),
  delay: 25,
})

// ====================================================================
// Phase 5: Modal closes -> Editable Vector Mockup on Canvas (frames 33..40)
// Green toast shows vectorization success!
// ====================================================================
for (let i = 0; i <= 6; i++) {
  frames.push({
    pixels: renderHexDemoScene({
      hasVectorMockup: true,
      toastText: 'Vectorized into editable layers!',
      cursor: { x: 390 - i * 15, y: 320 - i * 20 },
    }),
    delay: 22,
  })
}

// ====================================================================
// Phase 6: Move cursor to "Export Code" in topbar & Click (frames 41..48)
// ====================================================================
for (let i = 0; i <= 6; i++) {
  const t = i / 6
  const cx = Math.round(300 + t * (WIDTH - 350))
  const cy = Math.round(200 - t * 180)
  frames.push({
    pixels: renderHexDemoScene({
      hasVectorMockup: true,
      cursor: { x: cx, y: cy },
      hoverTopBtn: i >= 5 ? 'code' : null,
    }),
    delay: 15,
  })
}

// Click Export Code
frames.push({
  pixels: renderHexDemoScene({
    hasVectorMockup: true,
    cursor: { x: WIDTH - 50, y: 18 },
    hoverTopBtn: 'code',
  }),
  delay: 25,
})

// ====================================================================
// Phase 7: Multi-Format Code Export Modal Opens (frames 49..58)
// Shows tabs, switches to Hex Code tab, and copies hex!
// ====================================================================
for (let i = 0; i <= 5; i++) {
  frames.push({
    pixels: renderHexDemoScene({
      hasVectorMockup: true,
      showCodeModal: true,
      codeTab: 'hex',
      cursor: { x: 220 + i * 5, y: 100 + i * 10 },
    }),
    delay: 18,
  })
}

// Move to "Copy Hex Code" button & Click
for (let i = 0; i <= 4; i++) {
  frames.push({
    pixels: renderHexDemoScene({
      hasVectorMockup: true,
      showCodeModal: true,
      codeTab: 'hex',
      hoverCopyHex: i >= 3,
      cursor: { x: 140, y: 220 + i * 8 },
    }),
    delay: 15,
  })
}

// Final hold frame with Toast "Copied Hex Code to Clipboard!"
for (let i = 0; i <= 6; i++) {
  frames.push({
    pixels: renderHexDemoScene({
      hasVectorMockup: true,
      showCodeModal: true,
      codeTab: 'hex',
      toastText: 'Copied Hex Code to Clipboard!',
      cursor: { x: 140, y: 255 },
    }),
    delay: 30, // pause for viewer to read
  })
}

// Ensure docs/assets directory exists
const docsDir = path.resolve('docs', 'assets')
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

// Write animated GIF
const outGifPath = path.join(docsDir, 'hex_demo.gif')
const buffer = Buffer.alloc(WIDTH * HEIGHT * (frames.length + 10))
const gif = new GifWriter(buffer, WIDTH, HEIGHT, {
  loop: 0,
  palette: PALETTE,
})

for (const frame of frames) {
  gif.addFrame(0, 0, WIDTH, HEIGHT, frame.pixels, { delay: frame.delay })
}

const finalBuffer = buffer.subarray(0, gif.end())
fs.writeFileSync(outGifPath, finalBuffer)

console.log(`Animated GIF generated successfully at: ${outGifPath}`)
console.log(`Dimensions: ${WIDTH}x${HEIGHT}, Frames: ${frames.length}, Size: ${(finalBuffer.length / 1024).toFixed(1)} KB`)
