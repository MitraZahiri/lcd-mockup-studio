# 📺 LCD Mockup Studio
### Turn photos of real LCD / OLED / HMI screens into editable vector mockups & microcontroller C code.

[![Deploy to GitHub Pages](https://github.com/MitraZahiri/lcd-mockup-studio/actions/workflows/deploy.yml/badge.svg)](https://github.com/MitraZahiri/lcd-mockup-studio/actions/workflows/deploy.yml)
[![Live Studio](https://img.shields.io/badge/🚀%20Live%20Studio-Online-4ade80?style=for-the-badge&logo=googlechrome&logoColor=white)](https://mitrazahiri.github.io/lcd-mockup-studio/)
[![Tests](https://img.shields.io/badge/Tests-78%2F78%20Passing-38bdf8?style=for-the-badge&logo=node.js&logoColor=white)](https://github.com/MitraZahiri/lcd-mockup-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-facc15?style=for-the-badge)](LICENSE)

**[👉 Launch Studio in Browser (No Install Needed)](https://mitrazahiri.github.io/lcd-mockup-studio/)**  
*100% Client-Side · Zero Server Uploads · Runs Entirely in Your Browser*

<br />

<div align="center">

<img src="docs/assets/demo.gif" alt="LCD Mockup Studio Interactive Workflow" width="700" style="max-width: 100%; border-radius: 8px; border: 1px solid #30363d; box-shadow: 0 8px 24px rgba(0,0,0,0.45);" />



<img src="docs/assets/telegraph_demo.gif" alt="1-Bit Retro Telegraph & Wirephoto Scanline Engraving Workflow" width="700" style="max-width: 100%; border-radius: 8px; border: 1px solid #30363d; box-shadow: 0 8px 24px rgba(0,0,0,0.45);" />



</div>

---

## 📟 Live LCD Screen & Telegraphic Wirephoto Representation

```text
┌────────────────────────────────────────────────────────────────────────┐
│  SYSTEM CONTROLLER v2.4                                 CONNECT ᛒ     │
│  AUTOMATIC CYCLE READY                                   ▂ ▄ ▆ █ 📶    │
│  ────────────────────────────────────────────────────────────────────  │
│    CH-1   CH-2   CH-3   CH-4   CH-5   CH-6              [■■■■□] 🔋   │
│  23.5°C                                                  12:30         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  TELEGRAPHIC WIREPHOTO FACSIMILE TRANSMISSION (BELINOGRAPH SCAN)       │
│  MODE: 1-BIT SCANLINE ENGRAVING · DENSITY: 3px · CONTRAST: BOOST       │
│  ════════════════════════════════════════════════════════════════════  │
│  ────────────────────────────────────────────────────────────────────  │
│  ───  ──── ── ─── ── ── ─── ─── ── ────── ── ── ── ─── ─── ── ─── ───  │
│  ─ ─ ── ─── ─── ── ─── ── ──── ── ── ─── ─── ── ─── ── ── ─── ── ─ ─   │
│  ── ── ─── ─── ─── ──── ────── ────── ──── ─── ─── ── ── ─── ── ── ──  │
│  ────────────────────────────────────────────────────────────────────  │
│  100% PURE 1-BIT MONOCHROME · NO GRAYSCALE · READY FOR U8G2 / SSD1306  │
└────────────────────────────────────────────────────────────────────────┘
```

Recreating physical LCD and HMI screens for documentation, reverse engineering, and embedded firmware traditionally required measuring pixels by hand and redrawing every box and glyph.

**LCD Mockup Studio automates the tedious work:** Drop a photo or paste a screenshot, let the vision engine extract geometry and text into layered vectors, or engrave portraits using the historical telegraphic wirephoto facsimile engine, and immediately export production-ready C byte arrays for your microcontroller firmware.

---

## ⚡ Key Capabilities

* 🚀 **Zero Install Live Web App**: Built with Vite, Canvas, Web Workers, and WebAssembly OCR. Nothing is sent to any server.
* 📡 **1-Bit Retro Wirephoto & Telegraphic Scanline Engraving Engine**:
  * Transform real photographic portraits, faces, and technical schematics into authentic 20th-century **Belinograph facsimile & wirephoto scanline engravings**.
  * **Dynamic Thickness Modulation**: Modulates scanline stroke weight and thickness in real-time based on local image luminance and darkness gradients.
  * **4 Distinct Historical Scan Patterns**:
    * **Horizontal (0°)**: Classic 1920s newspaper wirephoto and CRT television raster scanlines.
    * **Diagonal (45°)**: Vintage banknote, currency, and copperplate etching cross-hatch engraving.
    * **Crosshatch Grid**: Interlocking orthogonal lines for deep shadows and dramatic shading.
    * **Morse / Pulse Raster**: Dashes and dots simulating telegraphic radio-photo bursts.
  * **Interactive Laser Sweep**: Visualizes real-time scanline engraving progression with animated laser sweeps.
  * **Embedded-Ready**: Generates ultra-crisp 1-bit bitmaps ready for Adafruit_GFX, U8g2, and MicroPython on SSD1306 OLEDs and e-Paper displays.
* 🖼️ **1-Bit Retro Photo & Portrait Dither Engine**:
  * Convert any real photograph, portrait, selfie, logo, or artwork into ultra-detailed 1-bit monochrome pixel art without OCR hallucinations or broken rectangular artifacts.
  * **Legendary Dithering Algorithms**:
    * **Atkinson Dither**: Developed by Bill Atkinson for the original 1984 Apple Macintosh & GameBoy Camera — preserves high contrast and clean whites, ideal for human faces and avatars.
    * **Floyd-Steinberg Dither**: Smooth photographic error-diffusion for natural gradients and skin tones.
    * **Bayer 4×4 & 8×8 Ordered Matrix**: Vintage CRT / newspaper halftone cross-hatch shading.
    * **Ink Stamp Stencil**: High-contrast graphic contour styling.
  * Real-time sliders for **Contrast**, **Brightness**, **Threshold**, and **Polarity Inversion** (Dark OLED vs. Light e-Paper).
  * Direct 1-click full screen conversion or insert as an **Avatar Layer** alongside vector text and stencils.
* 🔗 **1-Click Viral URL Sharing (Zero-Backend Permalinks)**:
  * Lossless `CompressionStream('deflate-raw')` compression packs complete projects directly into URL hashes. Share mockups with a single link without needing servers or databases.
* 🔘 **Hardware Realistic Breakout PCB Simulator**:
  * Simulates physical breakout boards for **SSD1306 OLED**, **Nokia 5110 (PCD8544)**, and **HD44780 Character LCDs** with realistic gold-plated header pins (GND, VCC, SCL, SDA), corner mounting screws, and subtle glass glare reflections.
* ▶ **Live Interactive Simulation Mode**:
  * Real-time hardware preview with ticking clocks (blinking `:` colons), fluctuating temperature/voltage telemetry jitter, and animated battery / progress bar sweeps. Non-destructive: original values restore seamlessly on stop.
* 📋 **Global Clipboard Paste (`Ctrl + V`)**: Copy any screenshot with Snipping Tool or browser and press `Ctrl + V` to load instantly.
* 🧪 **1-Click Interactive Gallery**: Test right away with built-in realistic LCD samples (Industrial HMI, 3D Printer Marlin, IoT OLED Weather Station).
* 🔍 **Intelligent Computer Vision Pipeline**:
  * **Text & Segment OCR**: Recognizes dot-matrix and 7-segment digits, clock times, telemetry units (`°C`, `%`, `hPa`, `RPM`, `V`, `A`), and labels.
  * **Geometry & Shapes**: Automatically extracts border frames, dividing lines, circular indicators, and solid badges.
  * **Dedicated LCD Symbols**: Detects ascending Wi-Fi/cellular signal bars, battery meters with internal charge level, directional arrows, locks, and checkboxes.
  * **Color Palette Auto-Adoption**: Automatically samples display background and foreground pixel colors from the photo.
* 💻 **Microcontroller & Embedded Firmware Export**:
  * Live 1-bit monochrome hardware preview with real-time luminance threshold and inversion toggles.
  * **Adafruit_GFX & U8g2 Headers**: Generates clean `.h` header arrays for horizontal MSB-first, vertical page-packed LSB-first, and XBM formats.
  * **⚡ Complete Arduino Sketch (`.ino`)**: Ready-to-flash complete sketch with I2C initialization and `u8g2.drawXBMP()`.
  * **🐍 MicroPython Script (`.py`)**: Generates `framebuf.FrameBuffer(bitmap, ...)` bytearrays ready for ESP32 and Raspberry Pi Pico.
* 🎛️ **Target Hardware Display Presets**:
  * 1-Click dimensions and color mapping for **SSD1306** (128×64 & 128×32 OLED), **ST7920** (128×64 Graphic LCD), **PCD8544** (Nokia 5110), **HD44780** (16×2 Character LCD), and **ST7789** (240×240 IPS).
* 📐 **Vector & Document Export**:
  * **SVG Vector Export**: Scalable vector graphics with precise clip paths for manuals, datasheets, and schematics.
  * **Native PNG Export**: Pixel-for-pixel hardware resolution preservation.
  * **Project Files (`.lcd.json`)**: Save full project state with layers, grid, and reference images.
* ⌨️ **Pro Studio Productivity**:
  * Global clipboard paste (`Ctrl + V`), element nudging via Arrow keys, duplicate (`Ctrl + D`), undo/redo, and interactive keyboard shortcut guide (`?`).

---

## 🔄 The Pipeline

```text
       [ Reference Photo / Clipboard ]
                      │
       ┌──────────────┴──────────────┐
       ▼                             ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│  Computer Vision (OCR)   │  │  1-Bit Photo & Wirephoto     │
│  • Auto Palette Extract  │  │  • Atkinson / Floyd-St.      │
│  • Connected Components  │  │  • Belinograph Scanlines     │
│  • Shape/Symbol Detect   │  │  • Diagonal & Morse Pulses   │
│  • Tesseract.js Text     │  │  • Local Contrast Boost      │
└──────────────┬───────────┘  └──────────────┬───────────────┘
               │                             │
               └──────────────┬──────────────┘
                              │
                              ▼
                 [ Interactive Vector Canvas ]
                              │
                ┌─────────────┼──────────────┐
                ▼             ▼              ▼
           [ C Header ]    [ SVG ]        [ PNG ]
           (U8g2/Adafruit) (Vector)       (1:1 Pixel)
```

---

## 💻 Microcontroller C Code Generation

Exporting mockups directly into embedded C headers eliminates manual bitmap conversions:

```c
// Example generated U8g2 monochrome bitmap array (128x64)
#include <U8g2lib.h>

const uint8_t lcd_display_bitmap[] PROGMEM = {
  0x00, 0x1f, 0x00, 0x00, 0x00, 0x3e, 0x00, 0x00,
  0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x7c, 0x18,
  // ... packed 1-bit monochrome pages
};

void drawScreen(U8G2 &u8g2) {
  u8g2.drawXBMP(0, 0, 128, 64, lcd_display_bitmap);
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl / Cmd + V` | **Paste image from clipboard as reference** |
| `Delete` / `Backspace` | Delete selected element |
| `Ctrl / Cmd + Z` | Undo last change |
| `Ctrl / Cmd + Shift + Z` / `Ctrl + Y` | Redo change |
| `Ctrl / Cmd + D` | Duplicate element |
| `Ctrl / Cmd + C` | Copy element |
| `Arrow Keys` | Nudge element by 1 px (`Shift + Arrow` for 5 px) |
| `]` / `PageUp` | Bring layer forward (`Shift + ]` to Front) |
| `[` / `PageDown` | Send layer backward (`Shift + [` to Back) |
| `Ctrl / Cmd + S` | Save project (`.lcd.json`) |

---

## 🛠️ Run Locally

```bash
# Clone the repository
git clone https://github.com/MitraZahiri/lcd-mockup-studio.git
cd lcd-mockup-studio

# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run test suite (78 unit tests)
npm test

# Build production bundle
npm run build
```

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are warmly welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

---

## 👤 Author

**Mitra Zahiri**  
*Software Engineer · Interactive & Connected Products*  
* [GitHub Profile](https://github.com/MitraZahiri)
* [LinkedIn](https://www.linkedin.com/in/mitra-zahiri)
* [Behance](https://www.behance.net/mitrazahiri98)

---

## 📜 License

[MIT](LICENSE) © 2026 Mitra Zahiri
