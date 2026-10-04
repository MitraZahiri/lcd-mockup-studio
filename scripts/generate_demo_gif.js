import fs from 'node:fs'
import path from 'node:path'
import { GifWriter } from 'omggif'

// Dimensions
const WIDTH = 680
const HEIGHT = 380

// Curated 32-color palette for sleek dark studio + retro LCD + neon accents
// Must be RGB integers: 0xRRGGBB
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
  0x1e271f, // 18: LCD bezel frame
  0xc4cec0, // 19: LCD display background (classic greenish grey)
  0x232c24, // 20: LCD active pixel (dark monochrome green/black)
  0xa8b8a4, // 21: LCD ghost / grid pixel
  0x111d28, // 22: Blue LCD background
  0x9cdcfe, // 23: Blue LCD active pixel
  0x0a0e14, // 24: Deep editor canvas
  0x162218, // 25: Subtle canvas grid line
  0x3b82f6, // 26: Selection blue
  0x10b981, // 27: Emerald badge
  0x059669, // 28: Dark emerald
  0xffffff, // 29: Pure white
  0x000000, // 30: Pure black
  0x38bdf8, // 31: Laser scanline cyan
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
  '.': [0x00,0x60,0x60,0x00,0x00],
  ':': [0x00,0x36,0x36,0x00,0x00],
  ',': [0x00,0x50,0x30,0x00,0x00],
  ';': [0x00,0x56,0x36,0x00,0x00],
  '-': [0x08,0x08,0x08,0x08,0x08],
  '_': [0x80,0x80,0x80,0x80,0x80],
  '/': [0x20,0x10,0x08,0x04,0x02],
  '+': [0x08,0x08,0x3e,0x08,0x08],
  '=': [0x14,0x14,0x14,0x14,0x14],
  '%': [0x23,0x13,0x08,0x64,0x62],
  '[': [0x00,0x7f,0x41,0x41,0x00],
  ']': [0x00,0x41,0x41,0x7f,0x00],
  '(': [0x00,0x1c,0x22,0x41,0x00],
  ')': [0x00,0x41,0x22,0x1c,0x00],
  '{': [0x00,0x08,0x36,0x41,0x00],
  '}': [0x00,0x41,0x36,0x08,0x00],
  '<': [0x00,0x08,0x14,0x22,0x41],
  '>': [0x00,0x41,0x22,0x14,0x08],
  '!': [0x00,0x00,0x5f,0x00,0x00],
  '?': [0x02,0x01,0x51,0x09,0x06],
  '"': [0x00,0x07,0x00,0x07,0x00],
  "'": [0x00,0x05,0x03,0x00,0x00],
  '#': [0x14,0x7f,0x14,0x7f,0x14],
  '*': [0x14,0x08,0x3e,0x08,0x14],
  'v': [0x0e,0x1c,0x38,0x1c,0x0e], // used for arrow down
  '^': [0x04,0x02,0x01,0x02,0x04],
}

class FrameBuffer {
  constructor(w, h, bg = 0) {
    this.w = w
    this.h = h
    this.pixels = new Uint8Array(w * h).fill(bg)
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
    const border = isPrimary ? 10 : 3
    const textColor = isPrimary ? 29 : 6
    this.fillRect(x, y, w, h, bg)
    this.strokeRect(x, y, w, h, border)
    const textW = text.length * 6
    const tx = x + Math.floor((w - textW) / 2)
    const ty = y + Math.floor((h - 7) / 2)
    this.drawText(text, tx, ty, textColor)
  }

  drawCursor(x, y) {
    // Arrow cursor
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
        if (v === 1) this.set(x + c, y + r, 30) // black outline
        else if (v === 7) this.set(x + c, y + r, 7) // white fill
      }
    }
  }
}

// Master renderer that renders a studio scene
function renderStudioScene({
  cursor = null,
  dropdownOpen = false,
  sampleLoaded = false,
  scanning = false,
  scanY = 0,
  elementsLoaded = false,
  selectedElement = false,
  exportModalOpen = false,
}) {
  const fb = new FrameBuffer(WIDTH, HEIGHT, 0) // Dark background

  // 1. TOP NAVIGATION BAR (height: 38px)
  fb.fillRect(0, 0, WIDTH, 38, 1)
  fb.hLine(0, 38, WIDTH, 2)

  // Logo square & title
  fb.fillRect(10, 8, 22, 22, 8)
  fb.strokeRect(10, 8, 22, 22, 10)
  fb.drawText('L', 18, 15, 29, 1)

  fb.drawText('LCD Mockup Studio', 38, 12, 7, 1)
  fb.drawText('v2.4  HMI & Embedded', 38, 23, 5, 1)

  // Quick Action Buttons in Top Bar
  const navBtns = ['New', 'Open', 'Save', 'Undo', 'Redo']
  let nx = 210
  for (const b of navBtns) {
    fb.drawButton(nx, 9, 38, 20, b, false, false)
    nx += 42
  }

  // Export Buttons (Right side)
  fb.drawButton(WIDTH - 215, 9, 64, 20, 'Export PNG', false, false)
  fb.drawButton(WIDTH - 147, 9, 64, 20, 'Export SVG', false, false)
  fb.drawButton(WIDTH - 79, 9, 70, 20, 'Export C', true, false)

  // 2. LEFT SIDEBAR (width: 175px)
  const SIDEBAR_W = 175
  fb.fillRect(0, 39, SIDEBAR_W, HEIGHT - 39, 1)
  fb.vLine(SIDEBAR_W, 39, HEIGHT - 39, 2)

  // Reference header
  fb.drawText('REFERENCE DISPLAY', 10, 48, 10, 1)
  fb.drawText('Original HMI / LCD Photo', 10, 58, 5, 1)

  // Reference screen box (128x64 display box on left)
  const refBoxX = 14
  const refBoxY = 72
  const refBoxW = 148
  const refBoxH = 78

  fb.fillRect(refBoxX, refBoxY, refBoxW, refBoxH, 18)
  fb.strokeRect(refBoxX, refBoxY, refBoxW, refBoxH, 3)

  if (sampleLoaded || scanning || elementsLoaded || selectedElement || exportModalOpen) {
    // Show green LCD screen inside reference box
    fb.fillRect(refBoxX + 6, refBoxY + 6, refBoxW - 12, refBoxH - 12, 19)
    // Draw LCD pixels
    fb.drawText('SYS CONTROLLER v2', refBoxX + 10, refBoxY + 10, 20, 1)
    fb.drawText('AUTO CYCLE READY', refBoxX + 10, refBoxY + 22, 20, 1)
    fb.hLine(refBoxX + 10, refBoxY + 33, refBoxW - 20, 20)
    fb.drawText('CH: 1  2  3  4  5', refBoxX + 10, refBoxY + 38, 20, 1)
    fb.drawText('23.5 C  12:30', refBoxX + 10, refBoxY + 52, 20, 1)

    // If scanning, show laser sweep line across reference
    if (scanning) {
      const sy = refBoxY + 6 + Math.floor(scanY * (refBoxH - 12))
      fb.hLine(refBoxX + 6, sy, refBoxW - 12, 31)
      fb.hLine(refBoxX + 6, sy - 1, refBoxW - 12, 10)
      // Bounding box previews
      fb.strokeRect(refBoxX + 8, refBoxY + 8, 100, 11, 31)
      fb.strokeRect(refBoxX + 8, refBoxY + 20, 105, 11, 10)
    }
  } else {
    // Empty state
    fb.drawText('[ No Image ]', refBoxX + 38, refBoxY + 32, 4, 1)
    fb.drawText('Upload or Try Sample', refBoxX + 14, refBoxY + 44, 5, 1)
  }

  // Upload & Sample Buttons
  fb.drawButton(12, 158, 70, 22, 'Upload', false, false)
  fb.drawButton(86, 158, 76, 22, 'Sample v', true, dropdownOpen)

  // Dropdown popup if open
  if (dropdownOpen) {
    const ddx = 86
    const ddy = 182
    const ddw = 85
    fb.fillRect(ddx, ddy, ddw, 56, 1)
    fb.strokeRect(ddx, ddy, ddw, 56, 10)
    fb.fillRect(ddx + 2, ddy + 2, ddw - 4, 16, 8)
    fb.drawText('Industrial HMI', ddx + 6, ddy + 6, 29, 1)
    fb.drawText('3D Printer', ddx + 6, ddy + 22, 6, 1)
    fb.drawText('IoT Weather', ddx + 6, ddy + 38, 6, 1)
  }

  // Analyze Image Button
  const isAnalyzeActive = sampleLoaded || scanning
  fb.drawButton(12, 188, 150, 26, scanning ? 'Analyzing OCR...' : '+ Analyze Image', isAnalyzeActive, scanning)

  // Stencils & Tools section
  fb.hLine(12, 224, 150, 2)
  fb.drawText('LCD STENCILS', 12, 232, 5, 1)
  fb.drawButton(12, 244, 70, 20, '[#] Battery', false, false)
  fb.drawButton(86, 244, 76, 20, '[=] Progress', false, false)
  fb.drawButton(12, 268, 70, 20, '[*] Badge', false, false)
  fb.drawButton(86, 268, 76, 20, '[%] Gauge', false, false)

  fb.drawText('LAYERS (4 Elements)', 12, 302, 5, 1)
  fb.fillRect(12, 314, 150, 56, 24)
  fb.strokeRect(12, 314, 150, 56, 2)
  if (elementsLoaded || selectedElement || exportModalOpen) {
    fb.drawText('T: "SYS CONTROLLER"', 16, 318, 6, 1)
    if (selectedElement) {
      fb.fillRect(14, 328, 146, 12, 8)
      fb.drawText('> T: "AUTO CYCLE"', 16, 330, 29, 1)
    } else {
      fb.drawText('T: "AUTO CYCLE"', 16, 330, 6, 1)
    }
    fb.drawText('L: Divider Line', 16, 342, 6, 1)
    fb.drawText('T: "23.5 C  12:30"', 16, 354, 6, 1)
  } else {
    fb.drawText('No layers yet', 40, 336, 4, 1)
  }

  // 3. RIGHT SIDEBAR (Inspector, width: 155px)
  const RIGHT_W = 155
  const rightX = WIDTH - RIGHT_W
  fb.fillRect(rightX, 39, RIGHT_W, HEIGHT - 39, 1)
  fb.vLine(rightX, 39, HEIGHT - 39, 2)

  fb.drawText('DISPLAY CONFIG', rightX + 12, 48, 10, 1)
  fb.drawText('Resolution: 128 x 64', rightX + 12, 60, 6, 1)
  fb.drawText('Preset: Retro Green LCD', rightX + 12, 72, 5, 1)
  fb.drawText('Grid Snapping: 1px [ON]', rightX + 12, 84, 5, 1)

  fb.hLine(rightX + 12, 100, RIGHT_W - 24, 2)
  fb.drawText('PROPERTIES', rightX + 12, 108, 10, 1)

  if (selectedElement || exportModalOpen) {
    fb.drawText('Type: Text (OCR)', rightX + 12, 122, 6, 1)
    fb.drawText('Text: "AUTO CYCLE READY"', rightX + 12, 134, 10, 1)
    fb.drawText('Font: 5x7 Matrix', rightX + 12, 146, 6, 1)
    fb.drawText('X: 6    Y: 17', rightX + 12, 158, 6, 1)
    fb.drawText('W: 104  H: 8', rightX + 12, 170, 6, 1)
    fb.drawButton(rightX + 12, 186, 130, 22, 'Duplicate', false, false)
    fb.drawButton(rightX + 12, 212, 130, 22, 'Align Center', false, false)
  } else {
    fb.drawText('Select an element', rightX + 12, 130, 4, 1)
    fb.drawText('to edit properties', rightX + 12, 142, 4, 1)
  }

  // 4. MAIN CANVAS (Center viewport)
  const canvasX = SIDEBAR_W + 1
  const canvasY = 39
  const canvasW = rightX - canvasX
  const canvasH = HEIGHT - canvasY

  // Grid background
  fb.fillRect(canvasX, canvasY, canvasW, canvasH, 24)
  for (let gx = canvasX + 8; gx < canvasX + canvasW; gx += 16) {
    fb.vLine(gx, canvasY, canvasH, 25)
  }
  for (let gy = canvasY + 8; gy < canvasY + canvasH; gy += 16) {
    fb.hLine(canvasX, gy, canvasW, 25)
  }

  // Center canvas badge
  fb.drawText('EDITABLE MOCKUP  128 x 64 px  (Scale: 250%)', canvasX + 24, canvasY + 10, 5, 1)

  // LCD Bezel & Display in center canvas
  const lcdW = 280
  const lcdH = 160
  const lcdX = canvasX + Math.floor((canvasW - lcdW) / 2)
  const lcdY = canvasY + Math.floor((canvasH - lcdH) / 2) - 10

  // Heavy industrial bezel
  fb.fillRect(lcdX, lcdY, lcdW, lcdH, 18)
  fb.strokeRect(lcdX, lcdY, lcdW, lcdH, 2)
  fb.strokeRect(lcdX + 2, lcdY + 2, lcdW - 4, lcdH - 4, 30)

  // Screw heads on bezel corners
  const screws = [
    [lcdX + 6, lcdY + 6],
    [lcdX + lcdW - 10, lcdY + 6],
    [lcdX + 6, lcdY + lcdH - 10],
    [lcdX + lcdW - 10, lcdY + lcdH - 10],
  ]
  for (const [sx, sy] of screws) {
    fb.fillRect(sx, sy, 4, 4, 3)
    fb.set(sx + 1, sy + 1, 6)
  }

  // Active LCD glass area
  const glassX = lcdX + 16
  const glassY = lcdY + 16
  const glassW = lcdW - 32
  const glassH = lcdH - 32

  fb.fillRect(glassX, glassY, glassW, glassH, 19) // classic green-grey
  fb.strokeRect(glassX, glassY, glassW, glassH, 20)

  if (elementsLoaded || selectedElement || exportModalOpen) {
    // Scale 2x for high clarity on canvas
    fb.drawText('SYS CONTROLLER v2', glassX + 10, glassY + 12, 20, 2)
    fb.drawText('AUTO CYCLE READY', glassX + 10, glassY + 36, 20, 2)
    fb.hLine(glassX + 10, glassY + 58, glassW - 20, 20)
    fb.hLine(glassX + 10, glassY + 59, glassW - 20, 20)
    fb.drawText('CH: 1  2  3  4  5  6', glassX + 10, glassY + 68, 20, 2)
    fb.hLine(glassX + 10, glassY + 90, glassW - 20, 20)
    fb.drawText('23.5 C        12:30', glassX + 10, glassY + 100, 20, 2)

    // If selected, draw vector selection bounding box + resize handles
    if (selectedElement || exportModalOpen) {
      const selX = glassX + 8
      const selY = glassY + 33
      const selW = 208
      const selH = 20
      fb.strokeRect(selX, selY, selW, selH, 11)
      // 8 Handles
      const handles = [
        [selX - 2, selY - 2],
        [selX + selW / 2 - 2, selY - 2],
        [selX + selW - 2, selY - 2],
        [selX - 2, selY + selH / 2 - 2],
        [selX + selW - 2, selY + selH / 2 - 2],
        [selX - 2, selY + selH - 2],
        [selX + selW / 2 - 2, selY + selH - 2],
        [selX + selW - 2, selY + selH - 2],
      ]
      for (const [hx, hy] of handles) {
        fb.fillRect(hx, hy, 5, 5, 11)
        fb.strokeRect(hx, hy, 5, 5, 30)
      }
    }
  } else {
    // Blank canvas watermark
    fb.drawText('Editable LCD Screen Area', glassX + 44, glassY + 54, 21, 1)
    fb.drawText('Load screenshot or sample to vectorize', glassX + 14, glassY + 68, 21, 1)
  }

  // 5. C CODE EXPORT MODAL (When active)
  if (exportModalOpen) {
    const modalW = 420
    const modalH = 220
    const modalX = Math.floor((WIDTH - modalW) / 2)
    const modalY = Math.floor((HEIGHT - modalH) / 2)

    // Modal shadow & frame
    fb.fillRect(modalX - 4, modalY - 4, modalW + 8, modalH + 8, 30)
    fb.fillRect(modalX, modalY, modalW, modalH, 1)
    fb.strokeRect(modalX, modalY, modalW, modalH, 10)

    // Modal Header
    fb.fillRect(modalX, modalY, modalW, 28, 2)
    fb.drawText('C / C++ Header Export (U8g2 / Adafruit_GFX)', modalX + 12, modalY + 9, 29, 1)
    fb.drawText('[X]', modalX + modalW - 26, modalY + 9, 5, 1)

    // Code area
    const codeX = modalX + 12
    const codeY = modalY + 36
    const codeW = modalW - 24
    const codeH = 138

    fb.fillRect(codeX, codeY, codeW, codeH, 24)
    fb.strokeRect(codeX, codeY, codeW, codeH, 3)

    fb.drawText('// Generated by LCD Mockup Studio (128x64 Monochrome)', codeX + 8, codeY + 8, 5, 1)
    fb.drawText('#include <Arduino.h>', codeX + 8, codeY + 22, 13, 1)
    fb.drawText('#include <U8g2lib.h>', codeX + 8, codeY + 34, 13, 1)
    fb.drawText('static const uint8_t lcd_bitmap[] PROGMEM = {', codeX + 8, codeY + 50, 7, 1)
    fb.drawText('  0x3E, 0x51, 0x49, 0x45, 0x3E, 0x00, 0x7E, 0x11,', codeX + 8, codeY + 64, 10, 1)
    fb.drawText('  0x7F, 0x49, 0x49, 0x49, 0x36, 0x3E, 0x41, 0x41,', codeX + 8, codeY + 76, 10, 1)
    fb.drawText('  0x23, 0x13, 0x08, 0x64, 0x62, 0x1F, 0x20, 0x40', codeX + 8, codeY + 88, 10, 1)
    fb.drawText('};', codeX + 8, codeY + 102, 7, 1)

    // Modal action bar
    fb.fillRect(modalX + 12, modalY + modalH - 36, modalW - 24, 26, 8)
    fb.drawText('[ OK ] Copied to Clipboard!', modalX + 130, modalY + modalH - 28, 29, 1)
  }

  // Draw cursor if position given
  if (cursor) {
    fb.drawCursor(cursor.x, cursor.y)
  }

  return fb.pixels
}

// Generate the complete animation sequence
console.log('Generating high-fidelity animated demo GIF...')

const frames = []

// Phase 1: Idle Studio, cursor moves to "Sample" (frames 0..6)
for (let i = 0; i <= 6; i++) {
  const t = i / 6
  const cx = Math.round(280 - t * 160)
  const cy = Math.round(100 + t * 70)
  frames.push({
    pixels: renderStudioScene({ cursor: { x: cx, y: cy }, dropdownOpen: false }),
    delay: 15,
  })
}

// Phase 2: Click Sample -> Dropdown Opens (frames 7..10)
for (let i = 0; i <= 3; i++) {
  const t = i / 3
  const cx = Math.round(120 + t * 10)
  const cy = Math.round(170 + t * 20)
  frames.push({
    pixels: renderStudioScene({ cursor: { x: cx, y: cy }, dropdownOpen: true }),
    delay: 20,
  })
}

// Phase 3: Sample Selected & Loaded into Reference (frames 11..16)
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(130 - t * 45)
  const cy = Math.round(190 + t * 12)
  frames.push({
    pixels: renderStudioScene({ cursor: { x: cx, y: cy }, sampleLoaded: true }),
    delay: 18,
  })
}

// Phase 4: Click "+ Analyze Image" -> OCR Laser Scan (frames 17..28)
for (let i = 0; i <= 10; i++) {
  const scanProgress = i / 10
  frames.push({
    pixels: renderStudioScene({
      cursor: { x: 85, y: 202 },
      sampleLoaded: true,
      scanning: true,
      scanY: scanProgress,
    }),
    delay: 12,
  })
}

// Phase 5: Elements Populated on Canvas (frames 29..34)
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(85 + t * 250)
  const cy = Math.round(202 - t * 40)
  frames.push({
    pixels: renderStudioScene({
      cursor: { x: cx, y: cy },
      sampleLoaded: true,
      elementsLoaded: true,
    }),
    delay: 16,
  })
}

// Phase 6: Element Selected & Inspector Active (frames 35..40)
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(335 + t * 260)
  const cy = Math.round(162 - t * 140)
  frames.push({
    pixels: renderStudioScene({
      cursor: { x: cx, y: cy },
      sampleLoaded: true,
      elementsLoaded: true,
      selectedElement: true,
    }),
    delay: 22,
  })
}

// Phase 7: Click "Export C" -> Modal Opens with Arduino Code (frames 41..48)
for (let i = 0; i <= 6; i++) {
  frames.push({
    pixels: renderStudioScene({
      cursor: { x: WIDTH - 45, y: 20 },
      sampleLoaded: true,
      elementsLoaded: true,
      selectedElement: true,
      exportModalOpen: true,
    }),
    delay: 35, // pause so user can read C code
  })
}

// Ensure output directory exists
const docsDir = path.resolve('docs', 'assets')
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

// Write animated GIF
const outGifPath = path.join(docsDir, 'demo.gif')
const buffer = Buffer.alloc(WIDTH * HEIGHT * (frames.length + 10))
const gif = new GifWriter(buffer, WIDTH, HEIGHT, {
  loop: 0, // Infinite loop
  palette: PALETTE,
})

for (const frame of frames) {
  gif.addFrame(0, 0, WIDTH, HEIGHT, frame.pixels, {
    delay: frame.delay, // in 1/100s
    palette: PALETTE,
  })
}

const finalSize = gif.end()
fs.writeFileSync(outGifPath, buffer.subarray(0, finalSize))

console.log(`Animated GIF generated successfully at: ${outGifPath}`)
console.log(`Dimensions: ${WIDTH}x${HEIGHT}, Frames: ${frames.length}, Size: ${(finalSize / 1024).toFixed(1)} KB`)
