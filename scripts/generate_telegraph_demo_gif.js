import fs from 'node:fs'
import path from 'node:path'
import { GifWriter } from 'omggif'

// Dimensions
const WIDTH = 680
const HEIGHT = 380

// Curated 32-color palette for sleek dark studio + retro LCD + neon accents
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
  0x121714, // 18: LCD bezel frame (dark retro)
  0x1a261c, // 19: LCD background (dark matrix green)
  0xa8d9a8, // 20: LCD active phosphor green ink
  0x2e4232, // 21: LCD ghost / grid line
  0x111d28, // 22: Blue LCD background
  0x9cdcfe, // 23: Blue LCD active pixel
  0x090d12, // 24: Deep editor canvas
  0x121a22, // 25: Canvas grid lines
  0x3b82f6, // 26: Selection blue
  0x10b981, // 27: Emerald badge
  0x059669, // 28: Dark emerald
  0xffffff, // 29: Pure white
  0x000000, // 30: Pure black
  0x38bdf8, // 31: Laser scanline cyan
]

// 5x7 ASCII bitmap font dictionary
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
  '(': [0x00,0x1c,0x22,0x41,0x00],
  ')': [0x00,0x41,0x22,0x1c,0x00],
  '=': [0x14,0x14,0x14,0x14,0x14],
  '#': [0x14,0x7f,0x14,0x7f,0x14],
  '_': [0x80,0x80,0x80,0x80,0x80],
  '%': [0x23,0x13,0x08,0x64,0x62],
  '>': [0x00,0x41,0x22,0x14,0x08],
  '<': [0x08,0x14,0x22,0x41,0x00],
  'x': [0x44,0x28,0x10,0x28,0x44],
  '*': [0x14,0x08,0x3e,0x08,0x14],
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

// Draw a realistic face profile in wirephoto scanlines
function drawTelegraphFace(cv, ox, oy, scaleProgress = 1.0) {
  // Center of face portrait inside LCD screen
  const cx = ox + 115
  const cy = oy + 105

  // 48 horizontal scanlines spaced by 4px
  for (let lineIdx = 0; lineIdx < 46; lineIdx++) {
    const ly = oy + 16 + lineIdx * 4
    if (scaleProgress < 1.0 && ly > oy + 16 + scaleProgress * 184) continue

    const relY = lineIdx - 22 // -22 to +23

    // Scanline x-range
    for (let lx = cx - 90; lx <= cx + 90; lx++) {
      const relX = lx - cx

      // Compute anatomical darkness at (relX, relY)
      let darkness = 0

      // Head silhouette oval
      const headDist = (relX * relX) / (65 * 65) + (relY * relY) / (20 * 20)
      const isHead = headDist < 1.0

      // Hair (top, forehead, and long sides)
      const isHairTop = relY < -8 && (relX * relX) / (68 * 68) + (relY * relY) / (21 * 21) < 1.05
      const isHairSides = Math.abs(relX) > 34 && relY > -12 && relY < 18
      const isHair = isHairTop || isHairSides

      // Face features
      const isEyebrows = (relY === -6 || relY === -5) && (Math.abs(relX) > 10 && Math.abs(relX) < 28)
      const isEyes = (relY === -3 || relY === -2) && (Math.abs(relX) > 14 && Math.abs(relX) < 26)
      const isNoseBridge = Math.abs(relX) <= 4 && relY >= -2 && relY <= 5
      const isNostrils = relY === 5 && Math.abs(relX) <= 8
      const isLips = (relY >= 9 && relY <= 12) && Math.abs(relX) <= 16
      const isJawlineShadow = relY > 16 && (relX * relX) / (45 * 45) + (relY * relY) / (22 * 22) > 0.8 && headDist < 1.0
      const isNeck = relY > 18 && Math.abs(relX) < 22
      const isShoulders = relY > 21 && Math.abs(relX) < 85

      if (isHair) darkness = 0.95
      else if (isEyebrows || isEyes) darkness = 0.9
      else if (isLips) darkness = 0.85
      else if (isNostrils) darkness = 0.8
      else if (isNoseBridge) darkness = 0.45
      else if (isJawlineShadow) darkness = 0.7
      else if (isShoulders) darkness = 0.8
      else if (isNeck) darkness = 0.5
      else if (isHead) darkness = 0.18 // subtle cheek skin tone
      else darkness = 0

      // Modulate scanline stroke thickness based on darkness
      if (darkness > 0.05) {
        let thickness = 1
        if (darkness > 0.75) thickness = 3.5
        else if (darkness > 0.45) thickness = 2.5
        else if (darkness > 0.25) thickness = 1.5

        const half = Math.floor(thickness / 2)
        for (let th = -half; th <= half; th++) {
          cv.set(lx, ly + th, 20) // LCD phosphor active pixel
        }
      }
    }
  }
}

function renderStudioTelegraphScene({
  cursor = { x: 300, y: 200 },
  activeTab = 'dither', // 'lcd' | 'dither'
  tabHovered = false,
  heroBtnHovered = false,
  heroBtnPressed = false,
  scanning = false,
  scanProgress = 0,
  engravingDone = false,
  showToast = false,
  exportModalOpen = false,
}) {
  const cv = new Canvas(WIDTH, HEIGHT)

  // 1. Studio background
  cv.fill(0) // #0d1117

  // 2. Top bar (h = 36)
  cv.fillRect(0, 0, WIDTH, 36, 1)
  cv.hLine(0, 36, WIDTH, 3)

  // Brand icon + text
  cv.fillRect(10, 8, 20, 20, 10) // bright green icon
  cv.drawText('L', 17, 13, 0, 2)
  cv.drawText('LCD Mockup Studio', 38, 12, 7)
  cv.drawText('v2.5 Wirephoto', 158, 13, 5)

  // Top action buttons
  cv.drawButton(240, 8, 44, 20, 'New')
  cv.drawButton(290, 8, 48, 20, 'Open')
  cv.drawButton(344, 8, 48, 20, 'Save')

  // Top right actions: Export SVG & Export C
  cv.drawButton(WIDTH - 150, 8, 64, 20, 'SVG', false)
  const isExportCHover = cursor.x >= WIDTH - 80 && cursor.x <= WIDTH - 10 && cursor.y >= 8 && cursor.y <= 28
  cv.drawButton(WIDTH - 80, 8, 70, 20, 'Export C', true, isExportCHover)

  // 3. Left Sidebar (w = 190) - Expanded for spacious studio
  const SIDEBAR_W = 186
  cv.fillRect(0, 37, SIDEBAR_W, HEIGHT - 37, 1)
  cv.vLine(SIDEBAR_W, 37, HEIGHT - 37, 3)

  // Reference title
  cv.drawText('REFERENCE PHOTO', 12, 46, 5)
  cv.fillRect(SIDEBAR_W - 46, 44, 34, 12, 2)
  cv.drawText('SOURCE', SIDEBAR_W - 43, 47, 10)

  // Reference image preview box (portrait thumbnail)
  const PREV_X = 12
  const PREV_Y = 62
  const PREV_W = SIDEBAR_W - 24
  const PREV_H = 70
  cv.fillRect(PREV_X, PREV_Y, PREV_W, PREV_H, 24)
  cv.strokeRect(PREV_X, PREV_Y, PREV_W, PREV_H, 3)

  // Draw portrait avatar thumbnail
  cv.fillRect(PREV_X + 54, PREV_Y + 10, 54, 52, 2)
  // Head oval
  cv.fillRect(PREV_X + 66, PREV_Y + 14, 30, 32, 6)
  // Hair
  cv.fillRect(PREV_X + 62, PREV_Y + 12, 38, 14, 4)
  // Eyes
  cv.fillRect(PREV_X + 72, PREV_Y + 28, 4, 3, 30)
  cv.fillRect(PREV_X + 86, PREV_Y + 28, 4, 3, 30)
  // Lips
  cv.fillRect(PREV_X + 76, PREV_Y + 38, 10, 2, 16)
  // Shoulders
  cv.fillRect(PREV_X + 58, PREV_Y + 46, 46, 16, 4)

  // Photo meta info & remove button
  cv.drawText('portrait.jpg (531x669)', PREV_X, PREV_Y + PREV_H + 4, 5)
  cv.fillRect(PREV_X + PREV_W - 32, PREV_Y + PREV_H + 3, 32, 11, 2)
  cv.drawText('x Remove', PREV_X + PREV_W - 30, PREV_Y + PREV_H + 5, 16)

  // Mode Tabs: [ LCD Screen ]  [ Telegraph & Photo ]
  const TAB_Y = 154
  const TAB_W = Math.floor((SIDEBAR_W - 28) / 2)
  const isLcdTab = activeTab === 'lcd'
  const isDitherTab = activeTab === 'dither'

  // Tab 1: LCD Screen
  cv.fillRect(12, TAB_Y, TAB_W, 20, isLcdTab ? 8 : 2)
  cv.strokeRect(12, TAB_Y, TAB_W, 20, isLcdTab ? 10 : 3)
  cv.drawText('LCD Screen', 18, TAB_Y + 6, isLcdTab ? 29 : 5)

  // Tab 2: Telegraph & Photo
  cv.fillRect(12 + TAB_W + 4, TAB_Y, TAB_W, 20, isDitherTab ? (heroBtnHovered ? 9 : 8) : (tabHovered ? 3 : 2))
  cv.strokeRect(12 + TAB_W + 4, TAB_Y, TAB_W, 20, isDitherTab ? 10 : 3)
  cv.drawText('Telegraph', 16 + TAB_W + 8, TAB_Y + 6, isDitherTab ? 29 : 6)

  if (isDitherTab) {
    // Clean unified settings card (no nested borders!)
    const CARD_Y = 180
    const CARD_H = 138
    cv.fillRect(12, CARD_Y, SIDEBAR_W - 24, CARD_H, 24)
    cv.strokeRect(12, CARD_Y, SIDEBAR_W - 24, CARD_H, 3)

    // Option 1: Style
    cv.drawText('Engraving Style:', 18, CARD_Y + 8, 5)
    cv.fillRect(18, CARD_Y + 19, SIDEBAR_W - 36, 16, 1)
    cv.strokeRect(18, CARD_Y + 19, SIDEBAR_W - 36, 16, 3)
    cv.drawText('Wirephoto Facsimile', 24, CARD_Y + 23, 7)

    // Option 2: Line spacing
    cv.drawText('Scanline Spacing:', 18, CARD_Y + 39, 5)
    cv.fillRect(18, CARD_Y + 50, SIDEBAR_W - 36, 16, 1)
    cv.strokeRect(18, CARD_Y + 50, SIDEBAR_W - 36, 16, 3)
    cv.drawText('4px (Classic Fax)', 24, CARD_Y + 54, 6)

    // Option 3: Angle
    cv.drawText('Scanline Angle:', 18, CARD_Y + 70, 5)
    cv.fillRect(18, CARD_Y + 81, SIDEBAR_W - 36, 16, 1)
    cv.strokeRect(18, CARD_Y + 81, SIDEBAR_W - 36, 16, 3)
    cv.drawText('Horizontal (0 deg)', 24, CARD_Y + 85, 6)

    // Contrast slider
    cv.drawText('Contrast:', 18, CARD_Y + 102, 5)
    cv.drawText('+25%', SIDEBAR_W - 48, CARD_Y + 102, 13)
    // Slider track
    cv.fillRect(18, CARD_Y + 114, SIDEBAR_W - 36, 4, 3)
    // Slider active fill + knob
    cv.fillRect(18, CARD_Y + 114, Math.floor((SIDEBAR_W - 36) * 0.65), 4, 13)
    cv.fillRect(18 + Math.floor((SIDEBAR_W - 36) * 0.65) - 3, CARD_Y + 111, 7, 10, 7)

    // Collapsible details link
    cv.drawText('> Advanced Settings', 18, CARD_Y + 125, 5)

    // Single Prominent Hero Button: 📡 Generate Telegraph Engraving
    const BTN_Y = 325
    const BTN_H = 26
    const btnBg = heroBtnPressed ? 10 : (heroBtnHovered ? 9 : 8)
    cv.fillRect(12, BTN_Y, SIDEBAR_W - 24, BTN_H, btnBg)
    cv.strokeRect(12, BTN_Y, SIDEBAR_W - 24, BTN_H, 10)
    cv.drawText('Engrave Wirephoto', 22, BTN_Y + 9, 29)
  }

  // 4. Center Workspace Canvas
  const WS_X = SIDEBAR_W + 1
  const WS_W = WIDTH - SIDEBAR_W - 130
  const WS_H = HEIGHT - 37
  cv.fillRect(WS_X, 37, WS_W, WS_H, 24)

  // Workspace subheader
  cv.drawText('Editable Mockup  531 x 669 px', WS_X + 16, 48, 6)
  cv.fillRect(WS_X + WS_W - 100, 44, 42, 14, 2)
  cv.drawText('Shell', WS_X + WS_W - 92, 47, 5)
  cv.fillRect(WS_X + WS_W - 54, 44, 44, 14, 2)
  cv.drawText('Fit', WS_X + WS_W - 44, 47, 5)

  // Canvas grid
  for (let gy = 66; gy < HEIGHT; gy += 16) {
    cv.hLine(WS_X, gy, WS_W, 25)
  }
  for (let gx = WS_X; gx < WS_X + WS_W; gx += 16) {
    cv.vLine(gx, 66, WS_H - 29, 25)
  }

  // 5. Retro LCD Device Display Screen (Center)
  const LCD_X = WS_X + Math.floor((WS_W - 250) / 2)
  const LCD_Y = 70
  const LCD_W = 246
  const LCD_H = 220

  // Outer bezel frame with rounded effect
  cv.fillRect(LCD_X - 6, LCD_Y - 6, LCD_W + 12, LCD_H + 12, 18)
  cv.strokeRect(LCD_X - 6, LCD_Y - 6, LCD_W + 12, LCD_H + 12, 3)

  // LCD display matrix background
  cv.fillRect(LCD_X, LCD_Y, LCD_W, LCD_H, 19) // dark phosphorescent LCD green

  // Ghost grid lines on LCD
  for (let y = LCD_Y; y < LCD_Y + LCD_H; y += 4) {
    cv.hLine(LCD_X, y, LCD_W, 21)
  }

  // Draw Telegraphic Scanline Face Portrait on the LCD screen!
  if (scanning || engravingDone) {
    const progress = scanning ? scanProgress : 1.0
    drawTelegraphFace(cv, LCD_X, LCD_Y, progress)

    // Laser scanline beam
    if (scanning && scanProgress < 1.0) {
      const beamY = LCD_Y + 16 + Math.floor(scanProgress * 184)
      cv.fillRect(LCD_X, beamY - 1, LCD_W, 3, 31) // bright laser cyan line
      cv.hLine(LCD_X, beamY, LCD_W, 29) // laser core white
    }
  }

  // 6. Right Sidebar - Inspector & Layers
  const RIGHT_X = WIDTH - 128
  cv.fillRect(RIGHT_X, 37, 128, HEIGHT - 37, 1)
  cv.vLine(RIGHT_X, 37, HEIGHT - 37, 3)

  cv.drawText('PROPERTIES', RIGHT_X + 12, 46, 5)
  cv.drawText('DISPLAY: 531x669', RIGHT_X + 12, 64, 6)
  cv.drawText('BG: #18211b', RIGHT_X + 12, 78, 5)
  cv.drawText('FG: #a8d9a8', RIGHT_X + 12, 92, 5)

  cv.hLine(RIGHT_X + 10, 110, 108, 3)
  cv.drawText('LAYERS', RIGHT_X + 12, 122, 5)

  if (engravingDone || scanning) {
    cv.fillRect(RIGHT_X + 8, 136, 112, 22, 2)
    cv.strokeRect(RIGHT_X + 8, 136, 112, 22, 10)
    cv.drawText('Wirephoto Engraving', RIGHT_X + 14, 142, 10)
    cv.drawText('Bitmap 1-bit', RIGHT_X + 14, 150, 5)
  }

  // 7. Toast Notification (when finished)
  if (showToast) {
    const TOAST_W = 280
    const TOAST_H = 24
    const TOAST_X = WS_X + Math.floor((WS_W - TOAST_W) / 2)
    const TOAST_Y = HEIGHT - 46
    cv.fillRect(TOAST_X, TOAST_Y, TOAST_W, TOAST_H, 1)
    cv.strokeRect(TOAST_X, TOAST_Y, TOAST_W, TOAST_H, 10)
    cv.drawText('Wirephoto ready! C code exported.', TOAST_X + 10, TOAST_Y + 8, 10)
  }

  // 8. C Code Export Modal (when open)
  if (exportModalOpen) {
    const MOD_W = 460
    const MOD_H = 260
    const MOD_X = Math.floor((WIDTH - MOD_W) / 2)
    const MOD_Y = Math.floor((HEIGHT - MOD_H) / 2)

    // Backdrop shadow
    cv.fillRect(MOD_X - 4, MOD_Y - 4, MOD_W + 8, MOD_H + 8, 30)

    // Modal body
    cv.fillRect(MOD_X, MOD_Y, MOD_W, MOD_H, 1)
    cv.strokeRect(MOD_X, MOD_Y, MOD_W, MOD_H, 10)

    // Header
    cv.fillRect(MOD_X, MOD_Y, MOD_W, 30, 2)
    cv.drawText('Microcontroller C Code Export (1-Bit Bitmap)', MOD_X + 14, MOD_Y + 11, 7)
    cv.drawText('x', MOD_X + MOD_W - 20, MOD_Y + 11, 5)

    // Code area
    const CODE_X = MOD_X + 14
    const CODE_Y = MOD_Y + 40
    const CODE_W = MOD_W - 28
    const CODE_H = 175
    cv.fillRect(CODE_X, CODE_Y, CODE_W, CODE_H, 0)
    cv.strokeRect(CODE_X, CODE_Y, CODE_W, CODE_H, 3)

    // Syntax highlighted C code
    cv.drawText('// Wirephoto Scanline Engraving (128x64 / SSD1306)', CODE_X + 8, CODE_Y + 10, 5)
    cv.drawText('#include <Arduino.h>', CODE_X + 8, CODE_Y + 22, 13)
    cv.drawText('#include <U8g2lib.h>', CODE_X + 8, CODE_Y + 34, 13)
    cv.drawText('const unsigned char wirephoto_bits[] PROGMEM = {', CODE_X + 8, CODE_Y + 50, 7)
    cv.drawText('  0xAA, 0x55, 0xFF, 0x00, 0x7E, 0x3C, 0x18, 0x3C,', CODE_X + 8, CODE_Y + 64, 10)
    cv.drawText('  0x7E, 0xFF, 0xAA, 0x55, 0xE7, 0xDB, 0xBD, 0x7E,', CODE_X + 8, CODE_Y + 76, 10)
    cv.drawText('  0x3C, 0x18, 0x00, 0xFF, 0x55, 0xAA, 0x7E, 0x3C,', CODE_X + 8, CODE_Y + 88, 10)
    cv.drawText('  0x18, 0x3C, 0x7E, 0xFF, 0xAA, 0x55, 0x3C, 0x18', CODE_X + 8, CODE_Y + 100, 10)
    cv.drawText('};', CODE_X + 8, CODE_Y + 114, 7)
    cv.drawText('// In loop(): u8g2.drawXBMP(0, 0, 128, 64, wirephoto_bits);', CODE_X + 8, CODE_Y + 130, 5)

    // Download button
    cv.drawButton(MOD_X + MOD_W - 130, MOD_Y + MOD_H - 35, 116, 24, 'Download .h', true)
  }

  // Draw cursor
  cv.drawCursor(cursor.x, cursor.y)

  return cv.pixels
}

console.log('Generating high-fidelity Telegraphic Wirephoto animated GIF...')

const frames = []

// Phase 1: Reference Photo Loaded -> Cursor moves to [Telgraf & Foto] tab (frames 0..6)
for (let i = 0; i <= 6; i++) {
  const t = i / 6
  const cx = Math.round(280 - t * 150)
  const cy = Math.round(200 - t * 40)
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: cx, y: cy },
      activeTab: 'dither',
      tabHovered: i >= 5,
    }),
    delay: 15,
  })
}

// Phase 2: Click on [Telgraf & Foto] Tab & Explore Settings (frames 7..11)
for (let i = 0; i <= 4; i++) {
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: 130, y: 164 },
      activeTab: 'dither',
      tabHovered: true,
    }),
    delay: 20,
  })
}

// Phase 3: Move cursor down to Hero Action Button (frames 12..17)
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(130 - t * 35)
  const cy = Math.round(164 + t * 174)
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: cx, y: cy },
      activeTab: 'dither',
      heroBtnHovered: i >= 4,
    }),
    delay: 16,
  })
}

// Phase 4: Press Button (frame 18)
frames.push({
  pixels: renderStudioTelegraphScene({
    cursor: { x: 95, y: 338 },
    activeTab: 'dither',
    heroBtnPressed: true,
  }),
  delay: 25,
})

// Phase 5: Laser Scanline Engraving Sweep (frames 19..32)
for (let i = 0; i <= 12; i++) {
  const progress = i / 12
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: 95, y: 338 },
      activeTab: 'dither',
      scanning: true,
      scanProgress: progress,
    }),
    delay: 12,
  })
}

// Phase 6: Completed Engraving & Toast Notification (frames 33..38)
for (let i = 0; i <= 5; i++) {
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: 95, y: 338 },
      activeTab: 'dither',
      engravingDone: true,
      showToast: true,
    }),
    delay: 22,
  })
}

// Phase 7: Move cursor to "Export C" button (frames 39..44)
for (let i = 0; i <= 5; i++) {
  const t = i / 5
  const cx = Math.round(95 + t * (WIDTH - 140))
  const cy = Math.round(338 - t * 320)
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: cx, y: cy },
      activeTab: 'dither',
      engravingDone: true,
      showToast: true,
    }),
    delay: 15,
  })
}

// Phase 8: Click Export C -> Code Modal Opens (frames 45..54)
for (let i = 0; i <= 8; i++) {
  frames.push({
    pixels: renderStudioTelegraphScene({
      cursor: { x: WIDTH - 45, y: 18 },
      activeTab: 'dither',
      engravingDone: true,
      exportModalOpen: true,
    }),
    delay: 35, // pause so user can inspect Arduino / U8g2 C code
  })
}

// Ensure output directory exists
const docsDir = path.resolve('docs', 'assets')
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

// Write animated GIF
const outGifPath = path.join(docsDir, 'telegraph_demo.gif')
const buffer = Buffer.alloc(WIDTH * HEIGHT * (frames.length + 10))
const gif = new GifWriter(buffer, WIDTH, HEIGHT, {
  loop: 0,
  palette: PALETTE,
})

for (const frame of frames) {
  gif.addFrame(0, 0, WIDTH, HEIGHT, frame.pixels, {
    delay: frame.delay,
    palette: PALETTE,
  })
}

const finalSize = gif.end()
fs.writeFileSync(outGifPath, buffer.subarray(0, finalSize))

console.log(`Animated GIF generated successfully at: ${outGifPath}`)
console.log(`Dimensions: ${WIDTH}x${HEIGHT}, Frames: ${frames.length}, Size: ${(finalSize / 1024).toFixed(1)} KB`)
