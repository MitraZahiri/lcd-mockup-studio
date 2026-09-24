# LCD Mockup Studio

A browser-based editor for recreating LCD, HMI, embedded display, and device screen interfaces from reference images.

LCD Mockup Studio allows users to upload a screenshot of a device display, analyze its visual structure, reconstruct detected content as editable elements, and continue designing directly in the browser.

The project is designed to remain generic and device-independent. It is not tied to a specific LCD manufacturer, product, resolution, or interface.

---

## Project Status

🚧 **Active Development**

The core editor and the first working image-analysis/OCR pipeline are now functional.

Current milestone:

**Reference Image → Image Analysis → OCR → Editable Mockup**

---

## What Works Today

### Reference Images

- Upload PNG, JPEG, and WebP reference images
- Display the original screenshot in a dedicated reference panel
- Automatically detect the reference resolution
- Match the editable document size to the uploaded image
- Keep the original reference separate from the editable canvas
- Remove or replace the reference image

### Editable Mockup Canvas

- Independent editable display canvas
- Logical LCD resolution preserved
- Automatic fit-to-workspace
- Zoom controls
- Grid display
- Snap controls
- Landscape and portrait document support
- Custom display background color

Small displays such as `249 × 128` can be enlarged in the editor while preserving their original logical resolution.

### Editable Elements

The editor currently supports:

- Text
- Rectangle
- Line
- Circle

Elements can be:

- Selected
- Moved
- Edited
- Resized through properties
- Deleted
- Managed through the Layers panel

### Keyboard Controls

- `Delete` / `Backspace` — delete selected element
- `Arrow Keys` — move selected element by 1 pixel
- `Shift + Arrow Keys` — move selected element by 5 pixels

---

## Reference Image Analysis

LCD Mockup Studio includes a local image-analysis pipeline designed specifically for device screenshots.

The current pipeline performs:

```text
Reference Image
      ↓
Grayscale Conversion
      ↓
Otsu Threshold Detection
      ↓
LCD Polarity Detection
      ↓
Binary Image Generation
      ↓
Noise Cleanup
      ↓
Horizontal Line Detection
      ↓
OCR Preprocessing
      ↓
Tesseract OCR
      ↓
Text Bounding Boxes
      ↓
Original LCD Coordinate Mapping
      ↓
Editable Editor Elements
```

The analysis result is not treated as a final design.

Instead, it creates an **editable starting point** that the user can manually correct and refine.

---

## OCR

OCR is powered by **Tesseract.js** and runs directly in the browser.

The OCR pipeline has been adapted for small LCD and embedded-display screenshots.

Current OCR features include:

- Automatic OCR scaling for small displays
- Pixel-preserving image enlargement
- Black-on-white OCR normalization
- LCD foreground/background polarity handling
- OCR whitespace padding
- Improved recognition near display edges
- OCR word bounding boxes
- Conversion from OCR coordinates back to original LCD coordinates
- Editable text generation
- OCR confidence information

OCR results remain fully editable because recognition of small pixel and dot-matrix fonts will not always be perfect.

For example, a detected label can be selected after analysis and corrected manually without modifying the original reference image.

---

## OCR Coordinate System

OCR may analyze an enlarged version of the reference image to improve recognition.

For example:

```text
Original LCD
249 × 128
```

may internally be enlarged for OCR processing.

However, generated editor elements are mapped back to:

```text
249 × 128
```

This means OCR processing resolution and document resolution remain independent.

The editor always works with the original logical LCD coordinate system.

---

## OCR Edge Padding

Small device screenshots often contain text extremely close to the edge of the display.

OCR engines can have difficulty detecting characters touching image boundaries.

LCD Mockup Studio therefore adds temporary whitespace around the OCR image before recognition.

```text
        OCR Padding
┌───────────────────────────────┐
│                               │
│   ┌───────────────────────┐   │
│   │                       │   │
│   │      LCD IMAGE        │   │
│   │                       │   │
│   └───────────────────────┘   │
│                               │
└───────────────────────────────┘
```

The padding exists only during OCR processing.

It is removed mathematically when OCR bounding boxes are converted back into LCD coordinates.

---

## Horizontal Line Detection

The analysis engine also detects long horizontal interface lines independently from OCR.

Detected lines are converted into editable line elements.

This allows interface separators and similar LCD geometry to be reconstructed separately from text.

---

## Editor Layout

The application uses a three-panel workflow:

```text
┌──────────────────┬──────────────────────────────┬──────────────────┐
│ REFERENCE        │ EDITABLE MOCKUP             │ PROPERTIES       │
│                  │                              │                  │
│ Original image   │ Reconstructed interface      │ Selected element │
│                  │                              │ settings         │
│ Analyze Image    │ Editable elements            │                  │
│                  │                              │                  │
│ ELEMENTS         │                              │ Display settings │
│ LAYERS           │                              │                  │
└──────────────────┴──────────────────────────────┴──────────────────┘
```

The reference image always stays separate from the reconstructed mockup.

This prevents the original screenshot from becoming part of the editable design.

---

## Design Philosophy

LCD Mockup Studio is intended to be:

**Simple**

The editor should be easier to use than a general-purpose design application.

**Precise**

Device interfaces often require pixel-level positioning.

**Generic**

The application should work with many types of:

- LCD displays
- HMI screens
- Embedded displays
- Industrial interfaces
- Control panels
- Device screens
- Custom display resolutions

**Editable**

Image analysis should produce normal editor elements rather than a flattened screenshot.

**Browser Based**

The core workflow should work directly in a modern browser.

---

## Technologies

Current project stack:

- JavaScript
- HTML
- CSS
- Vite
- Canvas API
- Tesseract.js
- Git
- GitHub

Image analysis and OCR currently run locally in the browser.

---

## Development Progress

### Foundation

- [x] Create Vite project
- [x] Configure Git repository
- [x] Create GitHub repository
- [x] Build initial application layout

### Editor

- [x] Three-panel workspace
- [x] Editable canvas
- [x] Display resolution controls
- [x] Display background control
- [x] Canvas zoom
- [x] Fit canvas to workspace
- [x] Grid
- [x] Snap
- [x] Layers panel
- [x] Element selection
- [x] Element movement
- [x] Properties panel
- [x] Keyboard movement
- [x] Element deletion

### Elements

- [x] Text
- [x] Rectangle
- [x] Line
- [x] Circle

### Reference Workflow

- [x] Reference image upload
- [x] Reference preview
- [x] Reference resolution detection
- [x] Match document to reference resolution
- [x] Keep reference separate from editable canvas
- [x] Remove reference image

### Image Analysis

- [x] Grayscale conversion
- [x] Otsu threshold calculation
- [x] LCD polarity detection
- [x] Binary mask generation
- [x] Noise cleanup
- [x] Horizontal line detection
- [x] Analysis element generation

### OCR

- [x] Integrate Tesseract.js
- [x] OCR preprocessing
- [x] Automatic OCR scaling
- [x] Pixel-preserving scaling
- [x] OCR text recognition
- [x] OCR bounding-box extraction
- [x] OCR-to-LCD coordinate conversion
- [x] OCR text converted to editable elements
- [x] OCR edge-padding support
- [x] Improved edge text detection
- [x] Preserve logical display resolution

---

## Roadmap

### v0.1 — Core Editor

The first release focuses on building a reliable editing foundation.

Planned features include:

- [ ] Improved text editing
- [ ] More font controls
- [ ] Font categories
- [ ] Custom font upload
- [ ] `.ttf` support
- [ ] `.otf` support
- [ ] `.woff` / `.woff2` support
- [ ] Better resizing controls
- [ ] Copy
- [ ] Paste
- [ ] Duplicate
- [ ] Undo
- [ ] Redo
- [ ] Project save/load
- [ ] PNG export
- [ ] JPG export
- [ ] SVG export
- [ ] Project JSON export

### v0.2 — Advanced Elements & Analysis

Planned improvements:

- [ ] Icon elements
- [ ] Button elements
- [ ] Status-bar elements
- [ ] SVG support
- [ ] Alignment tools
- [ ] Improved snapping
- [ ] Improved OCR accuracy
- [ ] Multi-pass OCR
- [ ] Better symbol recognition
- [ ] Better dot-matrix recognition
- [ ] Improved geometry detection
- [ ] Additional interface-region detection
- [ ] Reference/mockup comparison overlay
- [ ] Generic display templates

---

## Font System Vision

The planned font system will organize fonts into categories such as:

```text
System
Pixel
Monospace
Dot Matrix
Seven Segment
Custom Font
```

Custom fonts are planned to be loaded directly in the browser using the FontFace API.

This is especially important for embedded displays where typography may be very different from normal web fonts.

---

## Analysis Goals

Future versions of the analyzer should be capable of detecting more than text.

The long-term goal is to identify interface structures such as:

```text
Text
Lines
Rectangles
Icons
Buttons
Status areas
Numeric displays
Indicators
Simple UI regions
```

Each detected object should become an independent editable element.

---

## Important Principle

LCD Mockup Studio is **not a firmware simulator**.

It is also not intended to reproduce the complexity of applications such as Photoshop or Figma.

The goal is a focused tool for quickly recreating and editing embedded-device interfaces.

A user should eventually be able to:

```text
Upload Screenshot
      ↓
Analyze Image
      ↓
Receive Editable Draft
      ↓
Correct OCR
      ↓
Move / Resize / Restyle Elements
      ↓
Add Missing Elements
      ↓
Export Final Mockup
```

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

---

## Current Milestone

The project has reached its first important functional milestone:

> A device screenshot can be uploaded, analyzed locally, recognized with OCR, and reconstructed as editable elements on an independent mockup canvas.

The next development phase will focus on improving OCR accuracy and expanding the editor from a functional prototype into a more complete LCD/HMI design tool.