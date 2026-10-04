# 📺 LCD Mockup Studio

### Turn photos of real LCD / HMI displays into editable vector mockups & Arduino C headers.

[![Deploy to GitHub Pages](https://github.com/MitraZahiri/lcd-mockup-studio/actions/workflows/deploy.yml/badge.svg)](https://github.com/MitraZahiri/lcd-mockup-studio/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/🚀%20Try%20Live%20Demo-Online-brightgreen?style=for-the-badge)](https://mitrazahiri.github.io/lcd-mockup-studio/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://github.com/MitraZahiri/lcd-mockup-studio)

> 🚀 **[Click here to open the Live Studio in your browser!](https://mitrazahiri.github.io/lcd-mockup-studio/)** (100% Client-Side, Zero Install, Zero Tracking)

**Upload / Paste → Analyze → Edit → Export (C / SVG / PNG)**

LCD Mockup Studio is a browser-based tool for turning screenshots or photos of embedded displays into clean, editable mockups and ready-to-flash C arrays for microcontroller projects.

---

## ✨ Highlights

* 🚀 **Zero Install Live Web App**: Runs entirely in the browser with Web Workers & WebAssembly OCR.
* 📋 **Global Clipboard Paste (Ctrl+V)**: Take any screenshot with Snipping Tool and press `Ctrl+V` to load instantly.
* 🧪 **1-Click Sample Gallery**: Test immediately with built-in realistic LCD samples (Vending Machine, 3D Printer Marlin, IoT Weather Station).
* 🔍 **Smart Geometry & Symbol Detection**: Recognizes frames, progress bars, indicator dots, signal strength bars, and battery levels.
* 💻 **Microcontroller C Header Export**: Generates packed 1-bit monochrome byte arrays for **U8g2**, **Adafruit_GFX**, and **XBM**.
* 📐 **Vector SVG & PNG Export**: Crisp, pixel-perfect exports for documentation, spec sheets, and manuals.
* 🎨 **Classic LCD Themes**: Flipper Zero, GameBoy, Nokia 5110, OLED, and Industrial Green-Black palettes.

---SVG export
* 💻 Embedded C Bitmap Header Export (.h / XBM) with live 1-bit hardware preview for Arduino, ESP32, U8g2 & Adafruit_GFX

---

# 🚀 The idea

Working with embedded displays often means dealing with screenshots, photographs, old documentation, prototypes or hardware that isn't easily available anymore.

Recreating those interfaces manually can be surprisingly tedious.

LCD Mockup Studio is an attempt to make that process much faster.

### Instead of this:

```text
Screenshot
   ↓
Look at it
   ↓
Manually measure everything
   ↓
Draw every line
   ↓
Type every label
   ↓
Adjust positions
   ↓
Export
```

### You get:

```text
Screenshot
   ↓
Upload
   ↓
Analyze
   ↓
Edit
   ↓
Export
```

The goal isn't to replace a full design application.

The goal is to make **LCD / HMI recreation ridiculously convenient.**

---

# 🧪 Example workflow

Imagine you have an old embedded display:

```text
┌───────────────────────────────┐
│       TEMPERATURE             │
│                               │
│          23.5 °C              │
│                               │
│  ───────────────────────────  │
│                               │
│       STATUS: READY           │
└───────────────────────────────┘
```

Upload the image.

The application can analyze the reference and detect useful information such as:

* text
* lines
* display dimensions
* visual structure

You can then refine the generated elements manually.

Finally:

```text
LCD Mockup Studio
       │
       ▼
    PNG Export
       │
       ▼
   Native Resolution
```

So if the original display is **249 × 128**, the exported image can remain **249 × 128**.

---

# 🧠 A small but important detail

OCR sometimes works better when the image is temporarily enlarged during analysis.

That does **not** mean the final display resolution changes.

For example:

```text
Original display
249 × 128
     │
     ├── Editor resolution → 249 × 128
     │
     └── OCR working image → temporarily enlarged
                              │
                              ▼
                           OCR result
```

The logical display size remains the original size.

This is especially useful for small LCDs where text can be only a few pixels high.

---

# 🖥️ Editor

The editor is intentionally simple.

```text
┌─────────────────────────────────────────────────────┐
│ LCD Mockup Studio                                   │
├─────────────────────────────────────────────────────┤
│ New  Open  Save   Undo  Redo          Export PNG    │
├──────────────┬───────────────────────┬──────────────┤
│              │                       │              │
│  Reference   │                       │  Properties  │
│              │      LCD Canvas       │              │
│  Analysis    │                       │              │
│              │                       │              │
│  Elements    │                       │  Layers      │
│              │                       │              │
└──────────────┴───────────────────────┴──────────────┘
```

The interface is designed around the display itself rather than around a large collection of design tools.

---

# ⌨️ Keyboard shortcuts

| Shortcut                      | Action                                |
| ----------------------------- | ------------------------------------- |
| `Delete` / `Backspace`        | Delete selected element               |
| `Ctrl/Cmd + Z`                | Undo last change                      |
| `Ctrl/Cmd + Shift + Z` / `Ctrl + Y` | Redo change                     |
| `Ctrl/Cmd + D`                | Duplicate selected element            |
| `Ctrl/Cmd + C`                | Copy selected element                 |
| `Ctrl/Cmd + V`                | Paste element from clipboard          |
| `Arrow Keys`                  | Move selected element by 1 px         |
| `Shift + Arrow`               | Move selected element by 5 px         |
| `]` / `PageUp`                | Move layer up (`Shift + ]` to Front)  |
| `[` / `PageDown`              | Move layer down (`Shift + [` to Back) |
| `Ctrl/Cmd + S`                | Save project                          |

---

# 💾 Projects

Projects can be saved as:

```text
.lcd.json
```

A project can contain the display configuration, elements and reference information needed to continue editing later.

That means the workflow doesn't have to end with a PNG.

```text
Reference
    ↓
Project
    ↓
Edit tomorrow
    ↓
Export later
```

---

# 🖨️ Export

PNG export is designed to preserve the actual display resolution.

For example:

```text
Display: 249 × 128

Export:
┌─────────────────┐
│    249 × 128    │
└─────────────────┘
```

The export system also validates very large dimensions to avoid unreasonable browser memory usage.

---

# 🛠️ Built with

* **JavaScript**
* **Vite**
* **Tesseract.js**
* HTML / CSS
* Canvas-based rendering
* Browser APIs

Everything currently runs locally in the browser.

No backend is required for the core workflow.

---

# 🔬 How the analysis works

The analysis pipeline is intentionally modular.

```text
Reference Image
      │
      ▼
Image Analysis
      │
      ├── Display information
      ├── Polarity / visual analysis
      └── Geometry detection
      │
      ▼
OCR
      │
      ▼
Detected Elements
      │
      ▼
Editor State
      │
      ▼
Manual Refinement
```

The long-term goal is to make the analysis increasingly useful without taking control away from the user.

The computer should do the boring parts.

**The human should remain in control of the final mockup.**

---

# 🗺️ Roadmap

The core workflow is already working:

```text
Reference Image
      ↓
Image Analysis
      ↓
OCR
      ↓
Editable Mockup
      ↓
Project Save / Open
      ↓
PNG Export
```

But the project is **not finished**.

And that's intentional.

The next phase is about turning the prototype into a genuinely pleasant tool to use.

### Next up

* [x] Undo / Redo
* [x] Copy / Paste
* [x] Duplicate elements
* [x] Alignment tools
* [x] Layer Z-Index reordering
* [x] SVG export
* [x] Reference vs. mockup comparison overlay
* [x] Classic LCD color presets & fonts
* [x] Better resize handles
* [x] Improved text editing
* [x] Distribution tools
* [x] Custom font loading (.ttf, .otf, .woff, .woff2)
* [x] Buttons, indicators and compound UI stencils
* [x] Embedded C array / bitmap header export (Adafruit_GFX, U8g2, XBM)
* [x] Improved OCR for LCD segment fonts & text artifact cleanup
* [x] More geometry detection (vertical lines & rectangular frames)
* [x] Automatic LCD theme & palette extraction from photo
* [ ] Symbol / icon recognition

---

# 🎯 Long-term vision

LCD Mockup Studio is **not trying to become Photoshop.**

It's also not trying to become Figma.

The interesting space is much narrower:

> **Tools for recreating embedded displays and HMI interfaces.**

Think:

* industrial LCDs
* embedded HMIs
* instrument panels
* small monochrome displays
* legacy equipment
* prototype interfaces
* electronics documentation
* hardware reverse engineering
* UI recreation

A future version could eventually understand much more than text and geometry.

For example:

```text
┌──────────────────────────────┐
│ POWER       ████████  82%    │
│                              │
│ TEMP          23.5 °C        │
│                              │
│ ┌────────┐     ┌────────┐    │
│ │ START  │     │ STOP   │    │
│ └────────┘     └────────┘    │
│                              │
│ STATUS: READY                │
└──────────────────────────────┘
```

And turn that into a structured, editable representation.

That's where this project gets interesting.

---

# 🧩 Project structure

The codebase is organized around the major parts of the editor:

```text
src/
├── analysis/
├── editor/
├── export/
├── project/
├── reference/
└── ...
```

The goal is to keep analysis, editing, exporting and project management reasonably separated so the application can grow without turning into one giant file.

---

# 🏃 Run locally

Clone the repository:

```bash
git clone https://github.com/MitraZahiri/lcd-mockup-studio.git
cd lcd-mockup-studio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

---

# 🧭 Development philosophy

A few principles guide the project:

### 1. Keep the workflow small

Upload → Analyze → Edit → Export.

No unnecessary complexity.

### 2. Preserve the original display

If the source is 249 × 128, the mockup should know that it is 249 × 128.

### 3. Automate the boring work

OCR and image analysis should save time, not create another problem.

### 4. Keep the result editable

Automatic detection is only the beginning.

The user should always be able to correct it.

### 5. Optimize for embedded displays

This project has a specific problem to solve.

That specificity is a feature.

---

# 📌 Project status

**Current status: Active prototype / early development**

The first complete workflow is in place:

**Reference → Analyze → Edit → Save → Export**

The project is now moving from:

> 🧪 *“Can this work?”*

toward:

> 🛠️ *“Can someone actually enjoy using this?”*

---

# 💡 Why this exists

Sometimes a tiny LCD screen is harder to recreate than a huge modern UI.

A few pixels matter.

A one-pixel alignment matters.

A strange bitmap-looking font matters.

And when the original hardware isn't sitting on your desk, even figuring out where to start can be annoying.

LCD Mockup Studio exists to make that process a little less painful.

---

## ❤️ If you're interested

This project is still evolving.

Ideas, experiments, bug reports and contributions are welcome.

If you're interested in:

* embedded systems
* LCD / HMI interfaces
* OCR
* computer vision
* UI tooling
* electronics
* reverse engineering
* browser-based creative tools

...there's probably something interesting to build here.

---

## 📜 License

License information will be added once the project's licensing decision is finalized.

---

<p align="center">

**LCD Mockup Studio**

*From pixels to editable interfaces.*

📺 → 🔍 → ✏️ → 🖨️

</p>
