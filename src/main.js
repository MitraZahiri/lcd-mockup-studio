import './style.css'
import { initProjectControls } from './project/projectControls.js'
import { initPngExport, setBitmapCache } from './export/pngExport.js'
import { initSvgExport } from './export/svgExport.js'
import { initCExport } from './export/cExport.js'

import {
  editorState,
  subscribe,
  getSelectedElement,
  selectElement,
  removeElement,
  removeAnalysisElements,
  updateElement,
  updateDisplay,
  notify,
  setViewScale,
  setGridEnabled,
  setSnapEnabled,
  canUndo,
  canRedo,
  undo,
  redo,
  duplicateElement,
  copyElement,
  pasteElement,
  alignElement,
  distributeElements,
  reorderElement,
  getClipboard,
  setOverlayEnabled,
  setOverlayOpacity,
  applyLcdPreset,
  LCD_PRESETS,
  HARDWARE_PRESETS,
  applyHardwarePreset,
} from './editor/state.js'

import {
  createElement,
  createElementFromAnalysis,
} from './editor/elements.js'

import {
  initCanvas,
  renderCanvas,
} from './editor/canvas.js'

import { loadFontFromFile } from './editor/customFonts.js'
import { insertStencil } from './editor/stencils.js'

import {
  loadReferenceImage,
  loadReferenceFromUrl,
  fitCanvasToReference,
  removeReferenceImage,
} from './reference/referenceImage.js'

import { LCD_SAMPLES } from './reference/samples.js'

import {
  analyzeReferenceImage,
} from './analysis/imageAnalyzer.js'

import { encodeProjectToUrl, decodeProjectFromUrl } from './project/shareUrl.js'
import { updateHardwareShellDOM } from './editor/deviceShell.js'
import { startSimulation, stopSimulation, isSimulating } from './editor/simulation.js'
import { processDithering, generateTelegraphicVectorLines } from './analysis/dithering.js'
import { loadImage } from './analysis/imageProcessing.js'


// ======================================================
// APP
// ======================================================

document.querySelector('#app').innerHTML = `
  <div class="studio">

    <header class="topbar">

      <div class="brand">
        <div class="brand-icon">L</div>

        <div class="brand-copy">
          <strong>LCD Mockup Studio</strong>
          <span id="project-title">Untitled Project</span>
        </div>
      </div>

      <div class="toolbar">

        <button type="button" id="new-project">
          New
        </button>

        <button type="button" id="open-project">
          Open
        </button>

        <button type="button" id="save-project">
          Save
        </button>

        <div class="separator"></div>

        <button type="button" id="undo-button" disabled title="Undo (Ctrl+Z)">
          Undo
        </button>

        <button type="button" id="redo-button" disabled title="Redo (Ctrl+Shift+Z)">
          Redo
        </button>

        <div class="separator"></div>

        <button type="button" id="duplicate-button" disabled title="Duplicate Element (Ctrl+D)">
          Duplicate
        </button>

        <button type="button" id="copy-button" disabled title="Copy Element (Ctrl+C)">
          Copy
        </button>

        <button type="button" id="paste-button" disabled title="Paste Element (Ctrl+V)">
          Paste
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="export-button"
          id="export-png"
        >
          Export PNG
        </button>

        <button
          type="button"
          class="export-button export-svg-button"
          id="export-svg"
        >
          Export SVG
        </button>

        <button
          type="button"
          class="export-button export-c-button"
          id="export-c"
          title="Export as C Header / Embedded Monochrome Bitmap (Adafruit GFX / U8g2 / XBM)"
        >
          Export C Code
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="share-button"
          id="share-project"
          title="Share Project URL (Creates zero-backend permanent link and copies to clipboard)"
        >
          🔗 Share
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="shortcuts-button"
          id="shortcuts-button"
          title="Keyboard Shortcuts (?)"
        >
          ⌨️ Shortcuts
        </button>

      </div>

      <input id="project-file-input" type="file" accept=".json,.lcd.json,application/json" hidden>
    </header>


    <!-- ============================================= -->
    <!-- LEFT SIDEBAR                                  -->
    <!-- ============================================= -->

    <aside class="sidebar left-sidebar">

      <section class="panel reference-panel">

        <div class="panel-header">

          <div>
            <div class="panel-title">
              REFERENCE
            </div>

            <div class="panel-subtitle">
              Original screenshot
            </div>
          </div>

          <span class="beta-badge">
            SOURCE
          </span>

        </div>


        <div
          class="reference-preview empty"
          id="reference-preview"
        >

          <img
            id="reference-preview-image"
            alt="Reference"
            hidden
          >

          <div
            class="reference-placeholder"
            id="reference-placeholder"
          >
            <strong>No reference image</strong>

            <span>
              Upload an LCD, HMI or device
              screenshot.
            </span>
          </div>

        </div>


        <input
          id="reference-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
        >


        <div class="reference-upload-row">
          <button
            class="wide-button primary-button"
            id="upload-reference"
            type="button"
          >
            Upload
          </button>
          <div class="sample-dropdown-container">
            <button
              class="wide-button secondary-button"
              id="try-sample-btn"
              type="button"
              title="Try built-in LCD sample images"
            >
              Try Sample ▾
            </button>
            <div class="sample-dropdown-menu" id="sample-dropdown-menu" hidden></div>
          </div>
        </div>


        <div
          class="reference-info"
          id="reference-info"
          hidden
        >
          <div class="reference-info-meta">
            <strong id="reference-name">Image</strong>
            <span id="reference-size"></span>
          </div>
          <button
            class="reference-remove-btn"
            id="remove-reference"
            type="button"
            title="Remove reference image"
          >
            ✕ Remove
          </button>
        </div>

        <div class="analysis-mode-tabs">
          <button type="button" class="analysis-mode-tab active" id="tab-mode-lcd" data-mode="lcd" title="Extract text & UI from physical LCD displays">
            📟 LCD Screen
          </button>
          <button type="button" class="analysis-mode-tab" id="tab-mode-dither" data-mode="dither" title="High-fidelity retro telegraph and 1-bit scanline engraving">
            📡 Telegraph &amp; Photo
          </button>
        </div>

        <div class="mode-container-lcd" id="mode-container-lcd">
          <details
            class="analysis-options"
            id="analysis-options-details"
            style="margin: 8px 0; font-size: 11px;"
          >
            <summary style="cursor: pointer; color: #a8d9a8; font-weight: bold; margin-bottom: 6px;">
              ⚙ Analysis Settings
            </summary>
            <div style="display: flex; flex-direction: column; gap: 5px; padding: 6px 8px; background: rgba(0,0,0,0.25); border-radius: 4px; border: 1px solid #334438;">
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-text" checked> Text (OCR &amp; 7-Segment)
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-frames" checked> Frames &amp; Lines
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-badges" checked> Badges &amp; Bars
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-circles" checked> Circles &amp; Dots
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-detect-symbols" checked> Symbols &amp; Icons
              </label>
              <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                <input type="checkbox" id="opt-auto-theme" checked> Auto-Adopt Display Palette
              </label>
            </div>
          </details>

          <button
            class="wide-button analyze-button"
            id="analyze-reference"
            type="button"
            disabled
          >
            ✦ Analyze LCD Screen
          </button>

          <button
            class="wide-button secondary-button"
            id="match-reference-size"
            type="button"
            title="Match canvas dimensions to reference image"
            style="margin-top: 6px; font-size: 11px; padding: 7px 10px;"
          >
            📐 Match Screen Size
          </button>
        </div>

        <div class="mode-container-dither" id="mode-container-dither" hidden>
          <div class="dither-settings-box">
            <div class="dither-field">
              <label for="dither-algo-select">Engraving &amp; Dither Style:</label>
              <select id="dither-algo-select" class="sidebar-select">
                <option value="telegraphic" selected>📡 Telegraph Engraving (Wirephoto) ★</option>
                <option value="atkinson">🕹️ 1-Bit Dither (Macintosh 1984)</option>
                <option value="floyd-steinberg">Floyd-Steinberg (Smooth Shading)</option>
                <option value="bayer4">📰 Halftone Matrix (Bayer 4×4)</option>
                <option value="bayer8">Bayer 8×8 (Fine Pixel Matrix)</option>
                <option value="threshold">🖋️ Comic Ink / Stencil</option>
              </select>
            </div>

            <!-- Primary Telegraph Settings (shown when telegraphic is active) -->
            <div id="telegraphic-options-box" class="telegraphic-options-box">
              <div class="dither-field">
                <label for="telegraphic-spacing">Scanline Spacing (Density):</label>
                <select id="telegraphic-spacing" class="sidebar-select">
                  <option value="2">2 px (Ultra High Detail)</option>
                  <option value="3">3 px (Fine &amp; Crisp Engraving)</option>
                  <option value="4" selected>4 px (Classic Telegraph Facsimile - Recommended)</option>
                  <option value="6">6 px (Retro Wide Scanlines)</option>
                </select>
              </div>

              <div class="dither-field">
                <label for="telegraphic-angle">Scanline Angle:</label>
                <select id="telegraphic-angle" class="sidebar-select">
                  <option value="horizontal" selected>Horizontal (0° Classic Wirephoto)</option>
                  <option value="diagonal">Diagonal (45° Currency Engraving)</option>
                  <option value="crosshatch">Crosshatch (Dual-Axis Shading)</option>
                  <option value="vertical">Vertical (90° Raster)</option>
                </select>
              </div>
            </div>

            <!-- Contrast slider (key control) -->
            <div class="dither-slider-group">
              <div class="slider-row">
                <label for="dither-contrast">Contrast</label>
                <span id="dither-contrast-val">+25%</span>
              </div>
              <input type="range" id="dither-contrast" min="-100" max="100" value="25" step="5">
            </div>

            <!-- Clean Collapsible for Advanced / Secondary Settings -->
            <details class="dither-advanced-details" style="font-size: 11px; margin-top: 4px;">
              <summary style="cursor: pointer; color: #8b949e; font-size: 10px; font-weight: 600; padding: 4px 0;">
                ⚙ Advanced Settings (Scaling, Threshold, Brightness)
              </summary>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
                <div class="dither-field">
                  <label for="dither-target-select">Target Display Size:</label>
                  <select id="dither-target-select" class="sidebar-select">
                    <option value="fit" selected>Fit to Current Screen</option>
                    <option value="proportional">Preserve Photo Aspect Ratio</option>
                    <option value="avatar">👤 Insert as Corner Avatar</option>
                    <option value="ssd1306">128 × 64 (OLED / SSD1306)</option>
                    <option value="badge">250 × 122 (e-Paper Badge)</option>
                    <option value="nokia">84 × 48 (Nokia 5110)</option>
                    <option value="smartwatch">128 × 128 (Smartwatch)</option>
                  </select>
                </div>

                <div class="dither-field" id="modulation-field">
                  <label for="telegraphic-modulation">Modulation:</label>
                  <select id="telegraphic-modulation" class="sidebar-select">
                    <option value="continuous" selected>Continuous Stroke Weight</option>
                    <option value="pulse">Morse / Telegraph Pulsed Raster</option>
                  </select>
                </div>

                <div class="dither-slider-group" id="max-thickness-group">
                  <div class="slider-row">
                    <label for="telegraphic-max-thickness">Max Stroke Thickness</label>
                    <span id="telegraphic-max-thickness-val">4.5 px</span>
                  </div>
                  <input type="range" id="telegraphic-max-thickness" min="2" max="10" value="4.5" step="0.5">
                </div>

                <div class="dither-slider-group">
                  <div class="slider-row">
                    <label for="dither-brightness">Brightness</label>
                    <span id="dither-brightness-val">0%</span>
                  </div>
                  <input type="range" id="dither-brightness" min="-100" max="100" value="0" step="5">
                </div>

                <div class="dither-slider-group" id="threshold-slider-group">
                  <div class="slider-row">
                    <label for="dither-threshold">Threshold</label>
                    <span id="dither-threshold-val">128</span>
                  </div>
                  <input type="range" id="dither-threshold" min="30" max="225" value="128" step="1">
                </div>

                <div class="dither-checkbox-row">
                  <label>
                    <input type="checkbox" id="dither-invert"> Invert Colors (Negative)
                  </label>
                </div>
              </div>
            </details>
          </div>

          <!-- Hero Action Button - Standalone & Spacious -->
          <button
            class="wide-button dither-action-btn"
            id="apply-dither-button"
            type="button"
            disabled
          >
            📡 Generate Telegraph Engraving
          </button>
        </div>

        <div
          class="analysis-message"
          id="analysis-message"
          hidden
        ></div>

        <div
          class="reference-actions"
          id="reference-actions"
          hidden
          style="display: none;"
        ></div>

      </section>


      <section class="panel">

        <div class="panel-title">
          ELEMENTS
        </div>

        <div class="element-grid">

          <button
            class="element-card"
            data-element-type="text"
            type="button"
          >
            <span class="element-icon">
              T
            </span>

            <span>
              Text
            </span>
          </button>


          <button
            class="element-card"
            data-element-type="rectangle"
            type="button"
          >
            <span class="element-icon">
              □
            </span>

            <span>
              Rectangle
            </span>
          </button>


          <button
            class="element-card"
            data-element-type="line"
            type="button"
          >
            <span class="element-icon">
              ─
            </span>

            <span>
              Line
            </span>
          </button>


          <button
            class="element-card"
            data-element-type="circle"
            type="button"
          >
            <span class="element-icon">
              ○
            </span>

            <span>
              Circle
            </span>
          </button>

        </div>

        <div class="panel-subtitle" style="margin-top: 14px; margin-bottom: 8px; font-size: 11px; font-weight: 700; color: #8fa394; text-transform: uppercase; letter-spacing: 0.5px;">
          LCD Stencils
        </div>

        <div class="element-grid stencil-grid">
          <button class="element-card" data-stencil-type="battery" type="button" title="Insert Battery Indicator (Frame + Terminal + Bars)">
            <span class="element-icon">🔋</span>
            <span>Battery</span>
          </button>
          <button class="element-card" data-stencil-type="progress" type="button" title="Insert Progress Bar with Frame & Fill">
            <span class="element-icon">📊</span>
            <span>Progress</span>
          </button>
          <button class="element-card" data-stencil-type="badge" type="button" title="Insert Status Badge / Button">
            <span class="element-icon">🏷️</span>
            <span>Badge</span>
          </button>
          <button class="element-card" data-stencil-type="gauge" type="button" title="Insert Numeric Gauge Box Readout">
            <span class="element-icon">🔢</span>
            <span>Gauge</span>
          </button>
        </div>

      </section>


      <section class="panel layers-panel">

        <div class="panel-header">

          <div class="panel-title">
            LAYERS
          </div>

          <div class="layer-actions">
            <button type="button" class="layer-action-btn" id="layer-to-front" disabled title="Bring to Front">⇈</button>
            <button type="button" class="layer-action-btn" id="layer-move-up" disabled title="Move Up (PageUp / ])">▲</button>
            <button type="button" class="layer-action-btn" id="layer-move-down" disabled title="Move Down (PageDown / [)">▼</button>
            <button type="button" class="layer-action-btn" id="layer-to-back" disabled title="Send to Back">⇊</button>
          </div>

          <span
            class="layer-count"
            id="layer-count"
          >
            0
          </span>

        </div>

        <div
          class="layers-list"
          id="layers-list"
        ></div>

      </section>

    </aside>


    <!-- ============================================= -->
    <!-- WORKSPACE                                     -->
    <!-- ============================================= -->

    <main class="workspace">

      <div class="workspace-header">

        <div>

          <strong>
            Editable Mockup
          </strong>

          <span
            id="workspace-resolution"
          ></span>

        </div>


        <div class="workspace-actions">

          <div class="overlay-controls" id="overlay-controls" title="Reference Ghost Overlay (compare with original photo)" hidden>
            <label>
              <input type="checkbox" id="overlay-toggle">
              Overlay
            </label>
            <input type="range" id="overlay-opacity" min="0.05" max="1" step="0.05" value="0.4" title="Overlay Opacity">
          </div>

          <button
            id="toggle-hardware-shell"
            type="button"
            class="workspace-toggle-btn"
            title="Toggle Realistic Physical Hardware Breakout PCB & Pins"
          >
            🔘 Hardware Shell
          </button>

          <button
            id="toggle-simulation"
            type="button"
            class="workspace-toggle-btn simulation-btn"
            title="Live Hardware Simulation (Animate clock, battery & telemetry)"
          >
            ▶ Live Preview
          </button>

          <div class="separator"></div>

          <button
            id="fit-workspace"
            type="button"
          >
            Fit
          </button>

          <button
            id="zoom-out"
            type="button"
          >
            −
          </button>

          <span
            class="zoom-label"
            id="zoom-label"
          >
            100%
          </span>

          <button
            id="zoom-in"
            type="button"
          >
            +
          </button>

        </div>

      </div>


      <div
        class="canvas-area"
        id="canvas-area"
      >

        <div class="display-frame">

          <div
            class="display-canvas"
          ></div>

        </div>

        <div class="canvas-quickstart" id="canvas-quickstart">
          <div class="quickstart-card">
            <div class="quickstart-title">
              <span class="quickstart-tag">⚡ 1-CLICK QUICKSTART</span>
              <h2>Start with a Real Embedded Display</h2>
              <p>Select a pre-built embedded screen or drop any photo / screenshot:</p>
            </div>
            <div class="quickstart-grid">
              <button class="quickstart-card-btn" type="button" data-sample-id="controller">
                <span class="qs-icon">🎛️</span>
                <div class="qs-text">
                  <strong>Industrial HMI</strong>
                  <span>128 × 64 STN Graphic LCD</span>
                </div>
              </button>
              <button class="quickstart-card-btn" type="button" data-sample-id="marlin-3d">
                <span class="qs-icon">🖨️</span>
                <div class="qs-text">
                  <strong>3D Printer Marlin</strong>
                  <span>128 × 64 Blue Graphic LCD</span>
                </div>
              </button>
              <button class="quickstart-card-btn" type="button" data-sample-id="iot-weather">
                <span class="qs-icon">📟</span>
                <div class="qs-text">
                  <strong>IoT Weather Station</strong>
                  <span>128 × 64 ESP32 OLED</span>
                </div>
              </button>
            </div>
            <div class="quickstart-hints">
              <span>📋 Press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste screenshot</span>
              <span>•</span>
              <span>📁 Drag & drop PNG / JPG anywhere</span>
            </div>
          </div>
        </div>

      </div>


      <div class="workspace-hint">
        Reference stays on the left.
        This canvas contains only editable elements.
      </div>

    </main>


    <!-- ============================================= -->
    <!-- RIGHT SIDEBAR                                 -->
    <!-- ============================================= -->

    <aside class="sidebar right-sidebar">

      <section class="panel">

        <div class="panel-title">
          DISPLAY
        </div>


        <div class="field-row">

          <label class="field">

            <span>
              Width
            </span>

            <input
              id="display-width"
              type="number"
              min="1"
            >

          </label>


          <label class="field">

            <span>
              Height
            </span>

            <input
              id="display-height"
              type="number"
              min="1"
            >

          </label>

        </div>


        <label class="field">

          <span>
            Background
          </span>

          <div class="color-field">

            <input
              id="display-background"
              type="color"
            >

            <input
              id="display-background-text"
              type="text"
              readonly
            >

          </div>

        </label>
 
        <label class="field preset-field">
          <span>
            Target Hardware Display
          </span>
          <select id="hardware-preset-select">
            <option value="">Custom Dimensions</option>
            <option value="ssd1306-128x64">SSD1306 128 × 64 (0.96" OLED)</option>
            <option value="ssd1306-128x32">SSD1306 128 × 32 (0.91" OLED)</option>
            <option value="st7920-128x64">ST7920 128 × 64 (Graphic LCD)</option>
            <option value="nokia-84x48">PCD8544 84 × 48 (Nokia 5110)</option>
            <option value="hd44780-16x2">HD44780 16 × 2 (Character LCD)</option>
            <option value="st7789-240x240">ST7789 240 × 240 (Square IPS)</option>
          </select>
        </label>

        <label class="field preset-field">
          <span>
            LCD Palette Preset
          </span>
          <select id="lcd-preset-select">
            <option value="">Custom / Manual</option>
            <option value="emerald">Dark Emerald (Default)</option>
            <option value="nokia">Nokia 5110 Matrix</option>
            <option value="stn-blue">Blue STN LCD</option>
            <option value="amber">Industrial Amber</option>
            <option value="oled-cyan">OLED Cyan</option>
            <option value="gray-lcd">Classic Gray LCD</option>
          </select>
        </label>


        <div class="document-summary">

          <span>
            Orientation
          </span>

          <strong
            id="display-orientation"
          ></strong>

        </div>

      </section>


      <section class="panel properties-panel">

        <div class="panel-title">
          PROPERTIES
        </div>


        <div
          class="properties-empty"
          id="properties-empty"
        >
          <strong>
            Nothing selected
          </strong>

          <span>
            Select an element on the mockup
            or in Layers.
          </span>
        </div>


        <div
          id="properties-content"
          hidden
        >

          <div class="selected-type">

            <span>
              Selected
            </span>

            <strong
              id="property-type"
            ></strong>

          </div>


          <label
            class="field"
            id="property-text-field"
          >

            <span>
              Text
            </span>

            <input
              id="property-text"
              type="text"
            >

          </label>


          <div class="field-row">

            <label class="field">

              <span>
                X
              </span>

              <input
                id="property-x"
                type="number"
              >

            </label>


            <label class="field">

              <span>
                Y
              </span>

              <input
                id="property-y"
                type="number"
              >

            </label>

          </div>


          <div class="field-row">

            <label class="field">

              <span>
                Width
              </span>

              <input
                id="property-width"
                type="number"
                min="1"
              >

            </label>


            <label class="field">

              <span>
                Height
              </span>

              <input
                id="property-height"
                type="number"
                min="1"
              >

            </label>

          </div>


          <div
            id="text-properties"
          >

            <label class="field">

              <span>
                Font
              </span>

              <select
                id="property-font-family"
              >
                <option value="VT323">
                  VT323 (Dot Matrix)
                </option>

                <option value="Share Tech Mono">
                  Share Tech Mono
                </option>

                <option value="Courier New">
                  Courier New
                </option>

                <option value="monospace">
                  Monospace
                </option>

                <option value="Lucida Console">
                  Lucida Console
                </option>

                <option value="Consolas">
                  Consolas
                </option>

                <option value="Trebuchet MS">
                  Trebuchet MS
                </option>

                <option value="Arial">
                  Arial
                </option>

                <option value="Verdana">
                  Verdana
                </option>
              </select>

              <div class="field-row" style="margin-top: 5px;">
                <input type="file" id="font-file-input" accept=".ttf,.otf,.woff,.woff2" hidden>
                <button type="button" class="wide-button" id="load-custom-font-btn" style="padding: 4px 8px; font-size: 11px;">
                  ⭳ Load Custom Font (.ttf / .woff)
                </button>
              </div>

            </label>


            <div class="field-row">

              <label class="field">

                <span>
                  Font Size
                </span>

                <input
                  id="property-font-size"
                  type="number"
                  min="1"
                >

              </label>


              <label class="field">

                <span>
                  Weight
                </span>

                <select
                  id="property-font-weight"
                >
                  <option value="400">
                    Regular
                  </option>

                  <option value="600">
                    Semi Bold
                  </option>

                  <option value="700">
                    Bold
                  </option>
                </select>

              </label>

            </div>


            <label class="field">

              <span>
                Text Color
              </span>

              <input
                id="property-text-color"
                type="color"
              >

            </label>

          </div>


          <div
            id="shape-properties"
          >

            <label
              class="field"
              id="property-fill-field"
            >

              <span>
                Fill
              </span>

              <input
                id="property-fill"
                type="color"
              >

            </label>


            <label class="field">

              <span>
                Stroke / Line Color
              </span>

              <input
                id="property-stroke"
                type="color"
              >

            </label>


            <label class="field">

              <span>
                Stroke Width
              </span>

              <input
                id="property-stroke-width"
                type="number"
                min="1"
                max="50"
              >

            </label>

          </div>


          <div class="field">
            <span>Alignment & Distribution</span>
            <div class="alignment-grid">
              <button type="button" class="icon-button" id="align-left" title="Align Left">⇤</button>
              <button type="button" class="icon-button" id="align-center-h" title="Center Horizontally">⇹</button>
              <button type="button" class="icon-button" id="align-right" title="Align Right">⇥</button>
              <button type="button" class="icon-button" id="align-top" title="Align Top">⤒</button>
              <button type="button" class="icon-button" id="align-center-v" title="Center Vertically">⇕</button>
              <button type="button" class="icon-button" id="align-bottom" title="Align Bottom">⤓</button>
            </div>
            <div class="field-row" style="margin-top: 6px;">
              <button type="button" class="icon-button" id="distribute-h" title="Distribute Horizontally (≥3 elements)" style="padding: 5px; font-size: 11px;">⇶ Distribute H</button>
              <button type="button" class="icon-button" id="distribute-v" title="Distribute Vertically (≥3 elements)" style="padding: 5px; font-size: 11px;">⇵ Distribute V</button>
            </div>
          </div>

          <div class="field-row" style="margin-top: 10px;">
            <button
              class="wide-button"
              id="duplicate-element"
              type="button"
            >
              Duplicate
            </button>
            <button
              class="wide-button danger-button"
              id="delete-element"
              type="button"
            >
              Delete
            </button>
          </div>

        </div>

      </section>

    </aside>


    <!-- ============================================= -->
    <!-- STATUS                                        -->
    <!-- ============================================= -->

    <footer class="statusbar">

      <div class="status-left">
        <span id="project-status" role="status" aria-live="polite"></span>

        <span
          id="status-resolution"
        ></span>

        <span
          id="status-orientation"
        ></span>

        <span
          id="status-coords"
          style="font-family: monospace; font-size: 11px; margin-left: 12px; color: #8fa394;"
        ></span>

      </div>


      <div class="status-right">

        <label>
          <input
            id="grid-toggle"
            type="checkbox"
            checked
          >

          Grid
        </label>


        <label>
          <input
            id="snap-toggle"
            type="checkbox"
            checked
          >

          Snap
        </label>

      </div>

    </footer>

    <div id="c-export-modal" class="modal-backdrop" hidden style="display: none;">
      <div class="modal-dialog">
        <div class="modal-header">
          <div class="modal-title">
            <span>Embedded C Bitmap Export</span>
            <span id="c-export-resolution" class="badge">128 × 64 px</span>
          </div>
          <button type="button" class="icon-button modal-close" id="c-export-close" title="Close (Esc)">✕</button>
        </div>
        <div class="modal-body">
          <div class="c-export-preview-column">
            <span class="column-title">1-Bit Monochrome Hardware Preview</span>
            <div class="preview-container">
              <canvas id="c-export-preview" class="c-preview-canvas"></canvas>
            </div>
            <div class="c-export-options">
              <label class="field">
                <span>Target Hardware Format</span>
                <select id="c-export-format">
                  <option value="adafruit">Adafruit_GFX (Horizontal MSB-first .h)</option>
                  <option value="u8g2">U8g2 / SSD1306 (Vertical 8-px Pages .h)</option>
                  <option value="xbm">XBM (Standard X BitMap / LSB-first .h)</option>
                  <option value="arduino_sketch">Complete Arduino Sketch (.ino)</option>
                  <option value="micropython">MicroPython framebuf (ESP32/Pico .py)</option>
                </select>
              </label>
              <div class="field-row">
                <label class="field" style="flex: 1;">
                  <span>Luminance Threshold: <strong id="c-export-threshold-val">128</strong></span>
                  <input type="range" id="c-export-threshold" min="1" max="254" value="128">
                </label>
                <label class="checkbox-label" style="margin-top: 18px; margin-left: 10px; white-space: nowrap;">
                  <input type="checkbox" id="c-export-invert">
                  Invert
                </label>
              </div>
            </div>
          </div>
          <div class="c-export-code-column">
            <span class="column-title">Generated C Header / Array</span>
            <textarea id="c-export-code" class="c-code-area" readonly spellcheck="false"></textarea>
            <div class="modal-actions">
              <button type="button" class="wide-button" id="c-export-copy">📋 Copy C Code</button>
              <button type="button" class="wide-button primary-button" id="c-export-download">⭳ Download .h File</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KEYBOARD SHORTCUTS MODAL -->
    <div id="shortcuts-modal" class="modal-backdrop" hidden style="display: none;">
      <div class="modal-dialog" style="max-width: 580px;">
        <div class="modal-header">
          <div class="modal-title">
            <span>⌨️ Keyboard Shortcuts</span>
          </div>
          <button type="button" class="icon-button modal-close" id="shortcuts-close" title="Close (Esc)">✕</button>
        </div>
        <div class="modal-body" style="flex-direction: column;">
          <div class="shortcuts-grid">
            <div class="shortcut-group">
              <div class="shortcut-group-title">Clipboard & History</div>
              <div class="shortcut-row">
                <span>Paste Image / Element</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>V</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Copy Selected Element</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>C</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Duplicate Element</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>D</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Undo Action</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Z</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Redo Action</span>
                <div class="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>Y</kbd></div>
              </div>
            </div>
            <div class="shortcut-group">
              <div class="shortcut-group-title">Canvas & Selection</div>
              <div class="shortcut-row">
                <span>Nudge Element (1px)</span>
                <div class="shortcut-keys"><kbd>Arrow Keys</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Fast Nudge (5px)</span>
                <div class="shortcut-keys"><kbd>Shift</kbd> + <kbd>Arrow</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Layer Up / Down</span>
                <div class="shortcut-keys"><kbd>]</kbd> / <kbd>[</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Delete Element</span>
                <div class="shortcut-keys"><kbd>Del</kbd> / <kbd>Backspace</kbd></div>
              </div>
              <div class="shortcut-row">
                <span>Open Shortcuts</span>
                <div class="shortcut-keys"><kbd>?</kbd></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FLOATING TOAST CONTAINER -->
    <div id="toast-container" class="toast-container"></div>

  </div>
`


// ======================================================
// DOM
// ======================================================

const canvas =
  document.querySelector(
    '.display-canvas',
  )

const canvasArea =
  document.querySelector(
    '#canvas-area',
  )

const referenceFileInput =
  document.querySelector(
    '#reference-file-input',
  )

const uploadReferenceButton =
  document.querySelector(
    '#upload-reference',
  )

const referencePreview =
  document.querySelector(
    '#reference-preview',
  )

const referencePreviewImage =
  document.querySelector(
    '#reference-preview-image',
  )

const referencePlaceholder =
  document.querySelector(
    '#reference-placeholder',
  )

const referenceInfo =
  document.querySelector(
    '#reference-info',
  )

const referenceName =
  document.querySelector(
    '#reference-name',
  )

const referenceSize =
  document.querySelector(
    '#reference-size',
  )

const analyzeReferenceButton =
  document.querySelector(
    '#analyze-reference',
  )

const analysisMessage =
  document.querySelector(
    '#analysis-message',
  )

const referenceActions =
  document.querySelector(
    '#reference-actions',
  )

const matchReferenceSizeButton =
  document.querySelector(
    '#match-reference-size',
  )

const removeReferenceButton =
  document.querySelector(
    '#remove-reference',
  )

const fitWorkspaceButton =
  document.querySelector(
    '#fit-workspace',
  )

const zoomOutButton =
  document.querySelector(
    '#zoom-out',
  )

const zoomInButton =
  document.querySelector(
    '#zoom-in',
  )

const zoomLabel =
  document.querySelector(
    '#zoom-label',
  )

const workspaceResolution =
  document.querySelector(
    '#workspace-resolution',
  )

const displayWidthInput =
  document.querySelector(
    '#display-width',
  )

const displayHeightInput =
  document.querySelector(
    '#display-height',
  )

const displayBackgroundInput =
  document.querySelector(
    '#display-background',
  )

const displayBackgroundText =
  document.querySelector(
    '#display-background-text',
  )

const displayOrientation =
  document.querySelector(
    '#display-orientation',
  )

const statusResolution =
  document.querySelector(
    '#status-resolution',
  )

const statusOrientation =
  document.querySelector(
    '#status-orientation',
  )

const layersList =
  document.querySelector(
    '#layers-list',
  )

const layerCount =
  document.querySelector(
    '#layer-count',
  )

const propertiesEmpty =
  document.querySelector(
    '#properties-empty',
  )

const propertiesContent =
  document.querySelector(
    '#properties-content',
  )

const propertyType =
  document.querySelector(
    '#property-type',
  )

const propertyTextField =
  document.querySelector(
    '#property-text-field',
  )

const propertyText =
  document.querySelector(
    '#property-text',
  )

const propertyX =
  document.querySelector(
    '#property-x',
  )

const propertyY =
  document.querySelector(
    '#property-y',
  )

const propertyWidth =
  document.querySelector(
    '#property-width',
  )

const propertyHeight =
  document.querySelector(
    '#property-height',
  )

const textProperties =
  document.querySelector(
    '#text-properties',
  )

const propertyFontFamily =
  document.querySelector(
    '#property-font-family',
  )

const fontFileInput =
  document.querySelector(
    '#font-file-input',
  )

const loadCustomFontBtn =
  document.querySelector(
    '#load-custom-font-btn',
  )

const propertyFontSize =
  document.querySelector(
    '#property-font-size',
  )

const propertyFontWeight =
  document.querySelector(
    '#property-font-weight',
  )

const propertyTextColor =
  document.querySelector(
    '#property-text-color',
  )

const shapeProperties =
  document.querySelector(
    '#shape-properties',
  )

const propertyFillField =
  document.querySelector(
    '#property-fill-field',
  )

const propertyFill =
  document.querySelector(
    '#property-fill',
  )

const propertyStroke =
  document.querySelector(
    '#property-stroke',
  )

const propertyStrokeWidth =
  document.querySelector(
    '#property-stroke-width',
  )

const deleteElementButton =
  document.querySelector(
    '#delete-element',
  )

const gridToggle =
  document.querySelector(
    '#grid-toggle',
  )

const snapToggle =
  document.querySelector(
    '#snap-toggle',
  )
const undoButton = document.querySelector('#undo-button')
const redoButton = document.querySelector('#redo-button')

const duplicateButton = document.querySelector('#duplicate-button')
const copyButton = document.querySelector('#copy-button')
const pasteButton = document.querySelector('#paste-button')
const duplicateElementBtn = document.querySelector('#duplicate-element')

const overlayControls = document.querySelector('#overlay-controls')
const overlayToggle = document.querySelector('#overlay-toggle')
const overlayOpacity = document.querySelector('#overlay-opacity')

const lcdPresetSelect = document.querySelector('#lcd-preset-select')

const layerToFrontBtn = document.querySelector('#layer-to-front')
const layerMoveUpBtn = document.querySelector('#layer-move-up')
const layerMoveDownBtn = document.querySelector('#layer-move-down')
const layerToBackBtn = document.querySelector('#layer-to-back')

const alignLeftBtn = document.querySelector('#align-left')
const alignCenterHBtn = document.querySelector('#align-center-h')
const alignRightBtn = document.querySelector('#align-right')
const alignTopBtn = document.querySelector('#align-top')
const alignCenterVBtn = document.querySelector('#align-center-v')
const alignBottomBtn = document.querySelector('#align-bottom')

const distributeHBtn = document.querySelector('#distribute-h')
const distributeVBtn = document.querySelector('#distribute-v')

function updateActionButtons() {
  const hasSelection = Boolean(editorState.selectedId)
  const hasClipboard = Boolean(getClipboard())
  const hasEnoughForDistribution = editorState.elements.length >= 3

  if (duplicateButton) duplicateButton.disabled = !hasSelection
  if (duplicateElementBtn) duplicateElementBtn.disabled = !hasSelection
  if (copyButton) copyButton.disabled = !hasSelection
  if (pasteButton) pasteButton.disabled = !hasClipboard

  if (layerToFrontBtn) layerToFrontBtn.disabled = !hasSelection
  if (layerMoveUpBtn) layerMoveUpBtn.disabled = !hasSelection
  if (layerMoveDownBtn) layerMoveDownBtn.disabled = !hasSelection
  if (layerToBackBtn) layerToBackBtn.disabled = !hasSelection

  if (alignLeftBtn) alignLeftBtn.disabled = !hasSelection
  if (alignCenterHBtn) alignCenterHBtn.disabled = !hasSelection
  if (alignRightBtn) alignRightBtn.disabled = !hasSelection
  if (alignTopBtn) alignTopBtn.disabled = !hasSelection
  if (alignCenterVBtn) alignCenterVBtn.disabled = !hasSelection
  if (alignBottomBtn) alignBottomBtn.disabled = !hasSelection

  if (distributeHBtn) distributeHBtn.disabled = !hasEnoughForDistribution
  if (distributeVBtn) distributeVBtn.disabled = !hasEnoughForDistribution

  if (overlayControls) {
    const hasReference = Boolean(editorState.reference.src)
    overlayControls.hidden = !hasReference
  }
}

function updateHistoryButtons() {
  undoButton.disabled = !canUndo()
  redoButton.disabled = !canRedo()
}

undoButton.addEventListener('click', () => {
  undo()
})

redoButton.addEventListener('click', () => {
  redo()
})

function handleDuplicate() {
  const selected = getSelectedElement()
  if (selected) {
    duplicateElement(selected.id)
  }
}

if (duplicateButton) duplicateButton.addEventListener('click', handleDuplicate)
if (duplicateElementBtn) duplicateElementBtn.addEventListener('click', handleDuplicate)

if (copyButton) {
  copyButton.addEventListener('click', () => {
    const selected = getSelectedElement()
    if (selected) {
      copyElement(selected.id)
      updateActionButtons()
    }
  })
}

if (pasteButton) {
  pasteButton.addEventListener('click', () => {
    pasteElement()
  })
}

if (overlayToggle) {
  overlayToggle.addEventListener('change', () => {
    setOverlayEnabled(overlayToggle.checked)
  })
}

if (overlayOpacity) {
  overlayOpacity.addEventListener('input', () => {
    setOverlayOpacity(overlayOpacity.value)
  })
}

if (lcdPresetSelect) {
  lcdPresetSelect.addEventListener('change', () => {
    if (lcdPresetSelect.value) {
      applyLcdPreset(lcdPresetSelect.value)
    }
  })
}

if (layerToFrontBtn) layerToFrontBtn.addEventListener('click', () => reorderElement(undefined, 'front'))
if (layerMoveUpBtn) layerMoveUpBtn.addEventListener('click', () => reorderElement(undefined, 'up'))
if (layerMoveDownBtn) layerMoveDownBtn.addEventListener('click', () => reorderElement(undefined, 'down'))
if (layerToBackBtn) layerToBackBtn.addEventListener('click', () => reorderElement(undefined, 'back'))

if (alignLeftBtn) alignLeftBtn.addEventListener('click', () => alignElement(undefined, 'left'))
if (alignCenterHBtn) alignCenterHBtn.addEventListener('click', () => alignElement(undefined, 'center'))
if (alignRightBtn) alignRightBtn.addEventListener('click', () => alignElement(undefined, 'right'))
if (alignTopBtn) alignTopBtn.addEventListener('click', () => alignElement(undefined, 'top'))
if (alignCenterVBtn) alignCenterVBtn.addEventListener('click', () => alignElement(undefined, 'middle'))
if (alignBottomBtn) alignBottomBtn.addEventListener('click', () => alignElement(undefined, 'bottom'))

if (distributeHBtn) distributeHBtn.addEventListener('click', () => distributeElements('horizontal'))
if (distributeVBtn) distributeVBtn.addEventListener('click', () => distributeElements('vertical'))

subscribe(updateHistoryButtons)
subscribe(updateActionButtons)
updateHistoryButtons()
updateActionButtons()

// ======================================================
// CANVAS
// ======================================================

initCanvas(canvas)


// ======================================================
// ELEMENT BUTTONS
// ======================================================

document
  .querySelectorAll(
    '[data-element-type]',
  )
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {
        createElement(
          button.dataset.elementType,
        )
      },
    )

  })

document
  .querySelectorAll(
    '[data-stencil-type]',
  )
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {
        insertStencil(
          button.dataset.stencilType,
        )
      },
    )

  })


// ======================================================
// REFERENCE
// ======================================================

let referenceLoading = false
let analysisInProgress = false

function refreshReferenceInterface() {
  const ref = editorState.reference
  const hasReference = Boolean(ref.src)
  if (hasReference) referencePreviewImage.src = ref.src
  else referencePreviewImage.removeAttribute('src')
  referencePreviewImage.hidden = !hasReference
  referencePlaceholder.hidden = hasReference
  referencePreview.classList.toggle('empty', !hasReference)
  if (referenceInfo) {
    referenceInfo.hidden = !hasReference
    if (hasReference) {
      const nameEl = document.querySelector('#reference-name')
      const sizeEl = document.querySelector('#reference-size')
      if (nameEl && editorState.reference.name) nameEl.textContent = editorState.reference.name
      if (sizeEl && editorState.reference.width) sizeEl.textContent = `${editorState.reference.width} × ${editorState.reference.height} px`
    }
  }
  if (referenceActions) referenceActions.hidden = true
  if (analyzeReferenceButton) analyzeReferenceButton.disabled = !hasReference
  const applyDitherButton = document.querySelector('#apply-dither-button')
  if (applyDitherButton) applyDitherButton.disabled = !hasReference
  if (analysisMessage) analysisMessage.hidden = true
}

async function applyReference(loadPromise) {
  referenceLoading = true
  try {
    if (analysisMessage) analysisMessage.hidden = true
    const result = await loadPromise
    referencePreviewImage.src = result.src
    referencePreviewImage.hidden = false
    referencePlaceholder.hidden = true
    referencePreview.classList.remove('empty')
    if (referenceInfo) {
      referenceInfo.hidden = false
      const nameEl = document.querySelector('#reference-name')
      const sizeEl = document.querySelector('#reference-size')
      if (nameEl) nameEl.textContent = result.name || 'Image'
      if (sizeEl) sizeEl.textContent = `${result.width} × ${result.height} px`
    }
    if (referenceActions) referenceActions.hidden = true
    if (analyzeReferenceButton) analyzeReferenceButton.disabled = false
    const applyDitherButton = document.querySelector('#apply-dither-button')
    if (applyDitherButton) applyDitherButton.disabled = false

    fitCanvasToReference()
    requestAnimationFrame(() => fitCanvasToWorkspace())
    return result
  } catch (error) {
    console.error(error)
    window.alert(error?.message || 'Reference image could not be loaded.')
    return null
  } finally {
    referenceLoading = false
  }
}

uploadReferenceButton.addEventListener('click', () => {
  referenceFileInput.click()
})

referenceFileInput.addEventListener('change', async () => {
  const file = referenceFileInput.files?.[0]
  if (!file) return
  await applyReference(loadReferenceImage(file))
  referenceFileInput.value = ''
})

window.addEventListener('paste', async (event) => {
  const target = event.target
  if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
    return
  }
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        event.preventDefault()
        await applyReference(loadReferenceImage(file))
        break
      }
    }
  }
})

const trySampleBtn = document.querySelector('#try-sample-btn')
const sampleDropdownMenu = document.querySelector('#sample-dropdown-menu')

if (trySampleBtn && sampleDropdownMenu) {
  sampleDropdownMenu.innerHTML = LCD_SAMPLES.map(
    (sample) => `
      <button class="sample-dropdown-item" type="button" data-sample-id="${sample.id}">
        <strong>${sample.title}</strong>
        <span>${sample.subtitle}</span>
      </button>
    `,
  ).join('')

  trySampleBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    sampleDropdownMenu.hidden = !sampleDropdownMenu.hidden
  })

  document.addEventListener('click', () => {
    sampleDropdownMenu.hidden = true
  })

  sampleDropdownMenu.addEventListener('click', async (e) => {
    const item = e.target.closest('.sample-dropdown-item')
    if (!item) return
    const sampleId = item.dataset.sampleId
    const sample = LCD_SAMPLES.find((s) => s.id === sampleId)
    if (!sample) return

    sampleDropdownMenu.hidden = true
    const result = await applyReference(loadReferenceFromUrl(sample.url, sample.title))
    if (result) {
      analyzeReferenceButton.click()
    }
  })
}

matchReferenceSizeButton.addEventListener('click', () => {
  fitCanvasToReference()
  requestAnimationFrame(() => fitCanvasToWorkspace())
})

removeReferenceButton.addEventListener('click', () => {
  removeReferenceImage()
  referencePreviewImage.removeAttribute('src')
  referencePreviewImage.hidden = true
  referencePlaceholder.hidden = false
  referencePreview.classList.add('empty')
  if (referenceInfo) referenceInfo.hidden = true
  referenceActions.hidden = true
  analyzeReferenceButton.disabled = true
  if (analysisMessage) analysisMessage.hidden = true
})

// ======================================================
// ANALYSIS
// ======================================================

analyzeReferenceButton.addEventListener('click', async () => {
  if (!editorState.reference.src) return

  analysisInProgress = true
  const originalLabel = analyzeReferenceButton.textContent
  analyzeReferenceButton.disabled = true
  analyzeReferenceButton.textContent = 'Analyzing...'

  analysisMessage.hidden = false
  analysisMessage.className = 'analysis-message'
  analysisMessage.textContent = 'Analyzing image...'

  try {
    const optDetectText = document.querySelector('#opt-detect-text')?.checked ?? true
    const optDetectFrames = document.querySelector('#opt-detect-frames')?.checked ?? true
    const optDetectBadges = document.querySelector('#opt-detect-badges')?.checked ?? true
    const optDetectCircles = document.querySelector('#opt-detect-circles')?.checked ?? true
    const optDetectSymbols = document.querySelector('#opt-detect-symbols')?.checked ?? true
    const optAutoTheme = document.querySelector('#opt-auto-theme')?.checked ?? true

    const result = await analyzeReferenceImage({
      detectText: optDetectText,
      detectFrames: optDetectFrames,
      detectBadges: optDetectBadges,
      detectCircles: optDetectCircles,
      detectSymbols: optDetectSymbols,
    })

    removeAnalysisElements(false)

    if (optAutoTheme && result.palette?.background) {
      updateDisplay({ background: result.palette.background })
    }

    for (const data of result.elements) {
      createElementFromAnalysis(data, false)
    }

    notify()
    requestAnimationFrame(() => fitCanvasToWorkspace())

    analysisMessage.hidden = false
    analysisMessage.textContent = `✓ ${result.elements.length} elements detected`
    showToast(`✓ ${result.elements.length} LCD elements vectorized!`, 'info')
    setTimeout(() => {
      if (!analysisInProgress) analysisMessage.hidden = true
    }, 2500)
  } catch (error) {
    console.error(error)
    analysisMessage.className = 'analysis-message error'
    analysisMessage.textContent = error?.message || 'Analysis failed.'
    showToast(error?.message || 'Analysis failed', 'warn')
  } finally {
    analyzeReferenceButton.disabled = !editorState.reference.src
    analyzeReferenceButton.textContent = originalLabel
    analysisInProgress = false
  }
})

const analyzeTelegraphicButton = document.querySelector('#analyze-telegraphic')
analyzeTelegraphicButton?.addEventListener('click', async () => {
  if (!editorState.reference.src) return

  const originalLabel = analyzeTelegraphicButton.textContent
  analyzeTelegraphicButton.disabled = true
  analyzeTelegraphicButton.textContent = 'Scanning...'
  showToast('📡 Scanning telegraph / wirephoto scanlines...', 'info')

  try {
    const img = await loadImage(editorState.reference.src)
    let targetW = editorState.display.width
    let targetH = editorState.display.height

    // If canvas is still at a small default e.g. 128x64 but image has rich portrait dimensions, adapt smoothly
    if (editorState.display.width <= 128 && img.naturalWidth > 128) {
      const aspect = img.naturalWidth / (img.naturalHeight || 1)
      if (aspect >= 1) {
        targetW = Math.min(img.naturalWidth, 256)
        targetH = Math.max(32, Math.round(targetW / aspect))
      } else {
        targetH = Math.min(img.naturalHeight, 256)
        targetW = Math.max(32, Math.round(targetH * aspect))
      }
      updateDisplay({ width: targetW, height: targetH })
    }

    const offscreen = document.createElement('canvas')
    offscreen.width = targetW
    offscreen.height = targetH
    const ctx = offscreen.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, targetW, targetH)
    const imgData = ctx.getImageData(0, 0, targetW, targetH)

    const bgHex = editorState.display.background || '#18211b'
    const isDarkBg = bgHex === '#000000' || bgHex === '#18211b' || bgHex.startsWith('#0') || bgHex.startsWith('#1')
    const fgHex = isDarkBg ? '#a8d9a8' : '#18211b'

    const ditherResult = processDithering(imgData, {
      algorithm: 'telegraphic',
      lineSpacing: 4,
      minThickness: 0.4,
      maxThickness: 4.5,
      contrast: 25,
      brightness: 0,
      invert: false,
      fgColor: fgHex,
      bgColor: bgHex
    })

    const ditheredData = ditherResult.createImageData(fgHex, bgHex)
    ctx.putImageData(ditheredData, 0, 0)
    const dataUrl = offscreen.toDataURL('image/png')
    setBitmapCache(dataUrl, offscreen)

    const newElement = {
      id: `bmp_tele_${Date.now()}`,
      type: 'bitmap',
      name: 'Telegraph / Wirephoto Engraving',
      x: 0,
      y: 0,
      width: targetW,
      height: targetH,
      dataUrl,
      ditherMethod: 'telegraphic',
      contrast: 25,
      brightness: 0,
      threshold: 128,
      invert: false
    }

    editorState.elements = [newElement]
    editorState.selectedId = newElement.id
    notify()
    requestAnimationFrame(() => fitCanvasToWorkspace())
    showToast('📡 Telegraph / wirephoto engraving generated! C code and SVG updated.', 'info')
  } catch (err) {
    console.error('Telegraphic scan error:', err)
    showToast('Scan error: ' + err.message, 'error')
  } finally {
    analyzeTelegraphicButton.disabled = !editorState.reference.src
    analyzeTelegraphicButton.textContent = originalLabel
  }
})

// ======================================================
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
//=====================================================

// ======================================================
// DISPLAY
// ======================================================

displayWidthInput.addEventListener(
  'change',
  () => {

    const width =
      Math.max(
        1,
        Number(
          displayWidthInput.value,
        ) || 1,
      )

    updateDisplay({
      width,
    })

    fitCanvasToWorkspace()

  },
)


displayHeightInput.addEventListener(
  'change',
  () => {

    const height =
      Math.max(
        1,
        Number(
          displayHeightInput.value,
        ) || 1,
      )

    updateDisplay({
      height,
    })

    fitCanvasToWorkspace()

  },
)


displayBackgroundInput.addEventListener(
  'input',
  () => {

    updateDisplay({
      background:
        displayBackgroundInput.value,
    })

  },
)


// ======================================================
// ZOOM
// ======================================================

function fitCanvasToWorkspace() {
  const padding = 100

  const availableWidth =
    Math.max(
      100,
      canvasArea.clientWidth -
      padding,
    )

  const availableHeight =
    Math.max(
      100,
      canvasArea.clientHeight -
      padding,
    )

  const width =
    editorState.display.width

  const height =
    editorState.display.height

  if (
    width <= 0 ||
    height <= 0
  ) {
    return
  }

  const scaleX =
    availableWidth / width

  const scaleY =
    availableHeight / height

  let scale =
    Math.min(
      scaleX,
      scaleY,
    )

  /*
   * Small LCDs such as 249 × 128
   * can be enlarged for editing.
   */

  scale =
    Math.min(
      4,
      Math.max(
        0.1,
        scale,
      ),
    )

  setViewScale(scale)
}


fitWorkspaceButton.addEventListener(
  'click',
  fitCanvasToWorkspace,
)


zoomOutButton.addEventListener(
  'click',
  () => {

    const current =
      editorState.view.scale

    setViewScale(
      current - 0.25,
    )

  },
)


zoomInButton.addEventListener(
  'click',
  () => {

    const current =
      editorState.view.scale

    setViewScale(
      current + 0.25,
    )

  },
)


// ======================================================
// GRID / SNAP
// ======================================================

gridToggle.addEventListener(
  'change',
  () => {

    setGridEnabled(
      gridToggle.checked,
    )

  },
)


snapToggle.addEventListener(
  'change',
  () => {

    setSnapEnabled(
      snapToggle.checked,
    )

  },
)


// ======================================================
// LAYERS
// ======================================================

function renderLayers() {
  layersList.innerHTML = ''

  layerCount.textContent =
    String(
      editorState.elements.length,
    )

  if (
    editorState.elements.length === 0
  ) {
    const empty =
      document.createElement('div')

    empty.className =
      'layers-empty'

    empty.textContent =
      'No editable elements yet.'

    layersList.appendChild(empty)

    return
  }

  /*
   * Render topmost layer first.
   */

  const elements =
    [...editorState.elements]
      .reverse()

  elements.forEach(
    (element) => {

      const button =
        document.createElement(
          'button',
        )

      button.type = 'button'

      button.className =
        'layer-item'

      if (
        element.id ===
        editorState.selectedId
      ) {
        button.classList.add(
          'active',
        )
      }

      const icon =
        document.createElement(
          'span',
        )

      icon.className =
        'layer-icon'

      icon.textContent =
        getLayerIcon(
          element.type,
        )

      const name =
        document.createElement(
          'span',
        )

      name.className =
        'layer-name'

      name.textContent =
        element.type === 'text'
          ? element.text
          : element.name

      button.append(
        icon,
        name,
      )

      button.addEventListener(
        'click',
        () => {
          selectElement(
            element.id,
          )
        },
      )

      layersList.appendChild(
        button,
      )

    },
  )
}


function getLayerIcon(type) {
  if (type === 'text') {
    return 'T'
  }

  if (type === 'rectangle') {
    return '□'
  }

  if (type === 'circle') {
    return '○'
  }

  if (type === 'line') {
    return '─'
  }

  return '•'
}


// ======================================================
// PROPERTIES
// ======================================================

function renderProperties() {
  const element =
    getSelectedElement()

  if (!element) {

    propertiesEmpty.hidden =
      false

    propertiesContent.hidden =
      true

    return
  }

  propertiesEmpty.hidden =
    true

  propertiesContent.hidden =
    false

  propertyType.textContent =
    element.type

  propertyX.value =
    element.x

  propertyY.value =
    element.y

  propertyWidth.value =
    element.width

  propertyHeight.value =
    element.height

  const isText =
    element.type === 'text'

  const isShape =
    [
      'rectangle',
      'circle',
      'line',
    ].includes(
      element.type,
    )

  propertyTextField.hidden =
    !isText

  textProperties.hidden =
    !isText

  shapeProperties.hidden =
    !isShape

  if (isText) {

    propertyText.value =
      element.text

    if (element.fontFamily) {
      const exists = Array.from(propertyFontFamily.options).some(
        (opt) => opt.value === element.fontFamily,
      )
      if (!exists) {
        const option = document.createElement('option')
        option.value = element.fontFamily
        option.textContent = `${element.fontFamily} (Custom)`
        propertyFontFamily.appendChild(option)
      }
    }

    propertyFontFamily.value =
      element.fontFamily

    propertyFontSize.value =
      element.fontSize

    propertyFontWeight.value =
      String(
        element.fontWeight,
      )

    propertyTextColor.value =
      element.color

  }

  if (isShape) {

    const isLine =
      element.type === 'line'

    propertyFillField.hidden =
      isLine

    if (!isLine) {
      propertyFill.value =
        normalizeColor(
          element.fill,
          '#324638',
        )
    }

    propertyStroke.value =
      normalizeColor(
        isLine
          ? element.color
          : element.stroke,
        '#a8d9a8',
      )

    propertyStrokeWidth.value =
      element.strokeWidth || 1

  }
}


function normalizeColor(
  value,
  fallback,
) {
  if (
    typeof value === 'string' &&
    /^#[0-9a-f]{6}$/i.test(value)
  ) {
    return value
  }

  return fallback
}


function updateSelectedElement(
  changes,
) {
  const element =
    getSelectedElement()

  if (!element) {
    return
  }

  updateElement(
    element.id,
    changes,
  )
}


propertyText.addEventListener(
  'input',
  () => {

    updateSelectedElement({
      text:
        propertyText.value,
    })

  },
)


propertyX.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      x:
        Number(
          propertyX.value,
        ) || 0,
    })

  },
)


propertyY.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      y:
        Number(
          propertyY.value,
        ) || 0,
    })

  },
)


propertyWidth.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      width:
        Math.max(
          1,
          Number(
            propertyWidth.value,
          ) || 1,
        ),
    })

  },
)


propertyHeight.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      height:
        Math.max(
          1,
          Number(
            propertyHeight.value,
          ) || 1,
        ),
    })

  },
)


propertyFontFamily.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      fontFamily:
        propertyFontFamily.value,
    })

  },
)

if (loadCustomFontBtn && fontFileInput) {
  loadCustomFontBtn.addEventListener('click', () => {
    fontFileInput.click()
  })

  fontFileInput.addEventListener('change', async () => {
    const file = fontFileInput.files?.[0]
    if (!file) return
    const statusElem = document.querySelector('#project-status')
    try {
      if (statusElem) statusElem.textContent = `Loading font ${file.name}…`
      const familyName = await loadFontFromFile(file)
      const exists = Array.from(propertyFontFamily.options).some(
        (opt) => opt.value === familyName,
      )
      if (!exists) {
        const option = document.createElement('option')
        option.value = familyName
        option.textContent = `${familyName} (Custom)`
        propertyFontFamily.appendChild(option)
      }
      propertyFontFamily.value = familyName
      updateSelectedElement({
        fontFamily: familyName,
      })
      if (statusElem) statusElem.textContent = `Loaded font: ${familyName}`
    } catch (err) {
      if (statusElem) statusElem.textContent = `Font error: ${err.message}`
    } finally {
      fontFileInput.value = ''
    }
  })
}


propertyFontSize.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      fontSize:
        Math.max(
          1,
          Number(
            propertyFontSize.value,
          ) || 1,
        ),
    })

  },
)


propertyFontWeight.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      fontWeight:
        Number(
          propertyFontWeight.value,
        ),
    })

  },
)


propertyTextColor.addEventListener(
  'input',
  () => {

    updateSelectedElement({
      color:
        propertyTextColor.value,
    })

  },
)


propertyFill.addEventListener(
  'input',
  () => {

    updateSelectedElement({
      fill:
        propertyFill.value,
    })

  },
)


propertyStroke.addEventListener(
  'input',
  () => {

    const element =
      getSelectedElement()

    if (!element) {
      return
    }

    if (
      element.type === 'line'
    ) {

      updateSelectedElement({
        color:
          propertyStroke.value,
      })

      return
    }

    updateSelectedElement({
      stroke:
        propertyStroke.value,
    })

  },
)


propertyStrokeWidth.addEventListener(
  'change',
  () => {

    updateSelectedElement({
      strokeWidth:
        Math.max(
          1,
          Number(
            propertyStrokeWidth.value,
          ) || 1,
        ),
    })

  },
)


deleteElementButton.addEventListener(
  'click',
  () => {

    const element =
      getSelectedElement()

    if (!element) {
      return
    }

    removeElement(
      element.id,
    )

  },
)


// ======================================================
// KEYBOARD
// ======================================================

window.addEventListener(
  'keydown',
  (event) => {

    const target =
      event.target

    const isTyping =
      target instanceof
        HTMLInputElement ||
      target instanceof
        HTMLTextAreaElement ||
      target instanceof
        HTMLSelectElement

    if (isTyping) {
      return
    }

    // Global shortcuts
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault()
      if (event.shiftKey) {
        redo()
      } else {
        undo()
      }
      return
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
      event.preventDefault()
      redo()
      return
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
      if (getClipboard()) {
        event.preventDefault()
        pasteElement()
        showToast('Pasted element from clipboard', 'info')
        return
      }
      // If no internal element is in clipboard, do not preventDefault!
      // This allows the native 'paste' event to handle clipboard images smoothly!
    }

    if (event.key === '?' && !isTyping) {
      event.preventDefault()
      openShortcutsModal()
      return
    }

    if (event.key === 'Escape') {
      closeShortcutsModal()
    }

    const element = getSelectedElement()
    if (!element) {
      return
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      removeElement(element.id)
      event.preventDefault()
      return
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') {
      event.preventDefault()
      duplicateElement(element.id)
      return
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      copyElement(element.id)
      updateActionButtons()
      return
    }

    if (event.key === 'PageUp' || event.key === ']') {
      event.preventDefault()
      reorderElement(element.id, event.shiftKey ? 'front' : 'up')
      return
    }

    if (event.key === 'PageDown' || event.key === '[') {
      event.preventDefault()
      reorderElement(element.id, event.shiftKey ? 'back' : 'down')
      return
    }

    const amount =
      event.shiftKey
        ? 5
        : 1

    let x =
      element.x

    let y =
      element.y

    if (
      event.key === 'ArrowLeft'
    ) {
      x -= amount
    } else if (
      event.key === 'ArrowRight'
    ) {
      x += amount
    } else if (
      event.key === 'ArrowUp'
    ) {
      y -= amount
    } else if (
      event.key === 'ArrowDown'
    ) {
      y += amount
    } else {
      return
    }

    x = Math.max(
      0,
      Math.min(
        editorState.display.width -
          element.width,
        x,
      ),
    )

    y = Math.max(
      0,
      Math.min(
        editorState.display.height -
          element.height,
        y,
      ),
    )

    updateElement(
      element.id,
      {
        x,
        y,
      },
    )

    event.preventDefault()

  },
)


// ======================================================
// UI
// ======================================================

function updateInterface() {
  const width =
    editorState.display.width

  const height =
    editorState.display.height

  const orientation =
    width >= height
      ? 'Landscape'
      : 'Portrait'

  displayWidthInput.value =
    width

  displayHeightInput.value =
    height

  displayBackgroundInput.value =
    editorState.display.background

  displayBackgroundText.value =
    editorState.display.background
      .toUpperCase()

  displayOrientation.textContent =
    orientation

  workspaceResolution.textContent =
    `${width} × ${height} px`

  statusResolution.textContent =
    `${width} × ${height} px`

  statusOrientation.textContent =
    orientation

  zoomLabel.textContent =
    `${Math.round(
      editorState.view.scale * 100,
    )}%`

  gridToggle.checked =
    editorState.grid.enabled

  snapToggle.checked =
    editorState.grid.snap

  if (overlayToggle) {
    overlayToggle.checked = Boolean(editorState.overlay?.enabled)
  }

  if (overlayOpacity) {
    overlayOpacity.value = String(editorState.overlay?.opacity ?? 0.4)
  }

  updateActionButtons()

  const quickstartContainer = document.querySelector('#canvas-quickstart')
  if (quickstartContainer) {
    const hasContent = editorState.elements.length > 0 || Boolean(editorState.reference.src)
    quickstartContainer.hidden = hasContent
  }

  const hardwarePresetSelect = document.querySelector('#hardware-preset-select')
  if (hardwarePresetSelect) {
    const matchingKey = Object.keys(HARDWARE_PRESETS).find(
      (k) => HARDWARE_PRESETS[k].width === width && HARDWARE_PRESETS[k].height === height
    )
    hardwarePresetSelect.value = matchingKey || ''
  }

  const displayFrame = document.querySelector('.display-frame')
  if (displayFrame && editorState.hardwareShellEnabled) {
    updateHardwareShellDOM(displayFrame, {
      width,
      height,
      enabled: true
    })
  }

  renderLayers()

  renderProperties()
}


// ======================================================
// SUBSCRIBE
// ======================================================

subscribe(() => {
  renderCanvas()
  updateInterface()
})


// ======================================================
// RESIZE
// ======================================================

let resizeTimer = null

window.addEventListener(
  'resize',
  () => {

    clearTimeout(
      resizeTimer,
    )

    resizeTimer =
      setTimeout(
        fitCanvasToWorkspace,
        100,
      )

  },
)


// ======================================================
// INITIAL
// ======================================================

renderCanvas()

updateInterface()

requestAnimationFrame(() => {
  fitCanvasToWorkspace()
})


initProjectControls({
  refreshReference: refreshReferenceInterface,
  fitWorkspace: fitCanvasToWorkspace,
  isAnalyzing: () => analysisInProgress || referenceLoading,
})

initPngExport(editorState)
initSvgExport(editorState)
initCExport(editorState)

// ======================================================
// PRO FEATURES: TOASTS, PRESETS, QUICKSTART & SHORTCUTS
// ======================================================

export function showToast(message, type = 'info') {
  const container = document.querySelector('#toast-container')
  if (!container) return

  const item = document.createElement('div')
  item.className = `toast-item toast-${type}`
  const icon = type === 'warn' ? '⚠️' : (type === 'error' ? '❌' : '✅')
  item.innerHTML = `<span>${icon}</span> <span>${message}</span>`
  container.appendChild(item)

  setTimeout(() => {
    item.classList.add('toast-out')
    setTimeout(() => item.remove(), 250)
  }, 2500)
}

function initHardwarePresets() {
  const select = document.querySelector('#hardware-preset-select')
  if (!select) return

  select.addEventListener('change', () => {
    const val = select.value
    if (val && HARDWARE_PRESETS[val]) {
      applyHardwarePreset(val)
      const p = HARDWARE_PRESETS[val]
      showToast(`Target display set to ${p.name}`, 'info')
    }
  })
}

const shortcutsModal = document.querySelector('#shortcuts-modal')

export function openShortcutsModal() {
  if (!shortcutsModal) return
  shortcutsModal.removeAttribute('hidden')
  shortcutsModal.hidden = false
  shortcutsModal.classList.add('open')
  shortcutsModal.style.display = 'flex'
}

export function closeShortcutsModal() {
  if (!shortcutsModal) return
  shortcutsModal.setAttribute('hidden', '')
  shortcutsModal.hidden = true
  shortcutsModal.classList.remove('open')
  shortcutsModal.style.display = 'none'
}

function initShortcutsModal() {
  const btn = document.querySelector('#shortcuts-button')
  const close = document.querySelector('#shortcuts-close')

  btn?.addEventListener('click', openShortcutsModal)
  close?.addEventListener('click', closeShortcutsModal)
  shortcutsModal?.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) closeShortcutsModal()
  })
}

function initQuickstart() {
  const quickstart = document.querySelector('#canvas-quickstart')
  if (!quickstart) return

  quickstart.querySelectorAll('.quickstart-card-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const sampleId = btn.dataset.sampleId
      const sample = LCD_SAMPLES.find((s) => s.id === sampleId)
      if (sample) {
        showToast(`Loading ${sample.title}...`, 'info')
        const result = await applyReference(loadReferenceFromUrl(sample.url, sample.title))
        if (result) {
          analyzeReferenceButton.click()
        }
      }
    })
  })
}

initHardwarePresets()
initShortcutsModal()
initQuickstart()

function initShareUrl() {
  const shareBtn = document.querySelector('#share-project')
  shareBtn?.addEventListener('click', async () => {
    try {
      const hash = await encodeProjectToUrl(editorState)
      if (!hash) {
        showToast('Empty project cannot be shared', 'warn')
        return
      }
      window.location.hash = `p=${hash}`
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href)
        showToast('🔗 Share URL copied to clipboard! (Lossless permalink)', 'info')
      } else {
        showToast('URL updated in address bar!', 'info')
      }
    } catch (e) {
      console.error(e)
      showToast('Failed to create share link', 'error')
    }
  })

  // Auto-load project if URL hash is present
  if (window.location.hash && window.location.hash.startsWith('#p=')) {
    decodeProjectFromUrl(window.location.hash).then((project) => {
      if (project && project.display && Array.isArray(project.elements)) {
        Object.assign(editorState, {
          display: project.display,
          elements: project.elements,
          selectedId: null
        })
        notify()
        fitCanvasToWorkspace()
        showToast('✨ Loaded shared mockup from URL!', 'info')
      }
    }).catch((err) => {
      console.warn('Could not load project from URL:', err)
    })
  }
}

function initSimulationControls() {
  const simBtn = document.querySelector('#toggle-simulation')
  if (!simBtn) return

  simBtn.addEventListener('click', () => {
    if (isSimulating()) {
      stopSimulation(editorState, () => {
        renderCanvas()
        simBtn.innerHTML = '▶ Live Preview'
        simBtn.classList.remove('active')
        document.querySelector('.workspace')?.classList.remove('simulating')
        showToast('Simulation stopped — original state restored', 'info')
      })
    } else {
      if (!editorState.elements || editorState.elements.length === 0) {
        showToast('Add or load some elements first to simulate', 'warn')
        return
      }
      const started = startSimulation(editorState, () => {
        renderCanvas()
      })
      if (started) {
        simBtn.innerHTML = '⏸ Stop Sim'
        simBtn.classList.add('active')
        document.querySelector('.workspace')?.classList.add('simulating')
        showToast('▶ Live simulation running (clock & telemetry active)', 'info')
      }
    }
  })
}

function initHardwareShellControls() {
  const shellBtn = document.querySelector('#toggle-hardware-shell')
  const displayFrame = document.querySelector('.display-frame')
  if (!shellBtn || !displayFrame) return

  shellBtn.addEventListener('click', () => {
    editorState.hardwareShellEnabled = !editorState.hardwareShellEnabled
    updateHardwareShellDOM(displayFrame, {
      width: editorState.display.width,
      height: editorState.display.height,
      enabled: editorState.hardwareShellEnabled
    })
    shellBtn.classList.toggle('active', Boolean(editorState.hardwareShellEnabled))
    showToast(
      editorState.hardwareShellEnabled
        ? '🔘 Breakout PCB & bezel frame enabled'
        : 'Display shell hidden',
      'info'
    )
  })
}

initShareUrl()
initSimulationControls()
initHardwareShellControls()

function initDitheringStudio() {
  const tabLcd = document.querySelector('#tab-mode-lcd')
  const tabDither = document.querySelector('#tab-mode-dither')
  const containerLcd = document.querySelector('#mode-container-lcd')
  const containerDither = document.querySelector('#mode-container-dither')

  tabLcd?.addEventListener('click', () => {
    tabLcd.classList.add('active')
    tabDither?.classList.remove('active')
    if (containerLcd) containerLcd.hidden = false
    if (containerDither) containerDither.hidden = true
  })

  tabDither?.addEventListener('click', () => {
    tabDither.classList.add('active')
    tabLcd?.classList.remove('active')
    if (containerDither) containerDither.hidden = false
    if (containerLcd) containerLcd.hidden = true
  })

  // Slider readouts
  const contrastInput = document.querySelector('#dither-contrast')
  const contrastVal = document.querySelector('#dither-contrast-val')
  contrastInput?.addEventListener('input', () => {
    const v = parseInt(contrastInput.value, 10)
    if (contrastVal) contrastVal.textContent = (v > 0 ? '+' : '') + v + '%'
  })

  const brightnessInput = document.querySelector('#dither-brightness')
  const brightnessVal = document.querySelector('#dither-brightness-val')
  brightnessInput?.addEventListener('input', () => {
    const v = parseInt(brightnessInput.value, 10)
    if (brightnessVal) brightnessVal.textContent = (v > 0 ? '+' : '') + v + '%'
  })

  const thresholdInput = document.querySelector('#dither-threshold')
  const thresholdVal = document.querySelector('#dither-threshold-val')
  thresholdInput?.addEventListener('input', () => {
    if (thresholdVal) thresholdVal.textContent = thresholdInput.value
  })

  // Telegraphic max thickness readout
  const teleThicknessInput = document.querySelector('#telegraphic-max-thickness')
  const teleThicknessVal = document.querySelector('#telegraphic-max-thickness-val')
  teleThicknessInput?.addEventListener('input', () => {
    if (teleThicknessVal) teleThicknessVal.textContent = teleThicknessInput.value + ' px'
  })

  // Dynamic show/hide of telegraphic options
  const algoSelect = document.querySelector('#dither-algo-select')
  const teleOptionsBox = document.querySelector('#telegraphic-options-box')
  const applyDitherBtn = document.querySelector('#apply-dither-button')

  function updateAlgoUi() {
    const isTele = algoSelect?.value === 'telegraphic'
    if (teleOptionsBox) teleOptionsBox.hidden = !isTele
    const modField = document.querySelector('#modulation-field')
    const maxTGroup = document.querySelector('#max-thickness-group')
    const threshGroup = document.querySelector('#threshold-slider-group')
    if (modField) modField.hidden = !isTele
    if (maxTGroup) maxTGroup.hidden = !isTele
    if (threshGroup) threshGroup.hidden = isTele
    if (applyDitherBtn) {
      applyDitherBtn.textContent = isTele
        ? '📡 Generate Telegraph Engraving'
        : '✨ Generate 1-Bit Dither'
    }
  }

  algoSelect?.addEventListener('change', updateAlgoUi)
  updateAlgoUi()

  async function executeDither() {
    if (!editorState.reference.src) {
      showToast('Please upload an image or portrait first', 'warn')
      return
    }

    const applyBtn = document.querySelector('#apply-dither-button')
    if (applyBtn) applyBtn.disabled = true

    try {
      const isTele = algoSelect?.value === 'telegraphic'
      showToast(
        isTele
          ? '📡 Generating authentic retro telegraph / wirephoto scanline engraving...'
          : 'Converting to high-detail 1-bit dither art...',
        'info'
      )

      const img = await loadImage(editorState.reference.src)
      const targetSelect = document.querySelector('#dither-target-select')?.value || 'fit'
      const isAvatarOnly = targetSelect === 'avatar'
      const algo = document.querySelector('#dither-algo-select')?.value || 'telegraphic'
      const contrast = parseInt(document.querySelector('#dither-contrast')?.value || '25', 10)
      const brightness = parseInt(document.querySelector('#dither-brightness')?.value || '0', 10)
      const threshold = parseInt(document.querySelector('#dither-threshold')?.value || '128', 10)
      const invert = Boolean(document.querySelector('#dither-invert')?.checked)

      // Telegraphic specific parameters
      const lineSpacing = parseInt(document.querySelector('#telegraphic-spacing')?.value || '4', 10)
      const angle = document.querySelector('#telegraphic-angle')?.value || 'horizontal'
      const modulation = document.querySelector('#telegraphic-modulation')?.value || 'continuous'
      const maxThickness = parseFloat(document.querySelector('#telegraphic-max-thickness')?.value || '4.5')

      let targetW = editorState.display.width
      let targetH = editorState.display.height

      if (!isAvatarOnly) {
        if (targetSelect === 'ssd1306') {
          targetW = 128
          targetH = 64
        } else if (targetSelect === 'badge') {
          targetW = 250
          targetH = 122
        } else if (targetSelect === 'nokia') {
          targetW = 84
          targetH = 48
        } else if (targetSelect === 'smartwatch') {
          targetW = 128
          targetH = 128
        } else if (targetSelect === 'proportional') {
          const aspect = img.naturalWidth / (img.naturalHeight || 1)
          if (aspect >= 1) {
            targetW = Math.min(img.naturalWidth, 256)
            targetH = Math.max(16, Math.round(targetW / aspect))
          } else {
            targetH = Math.min(img.naturalHeight, 256)
            targetW = Math.max(16, Math.round(targetH * aspect))
          }
        }
      } else {
        const avatarSize = Math.min(80, Math.max(32, Math.round(editorState.display.height * 0.75)))
        targetW = avatarSize
        targetH = avatarSize
      }

      const offscreen = document.createElement('canvas')
      offscreen.width = targetW
      offscreen.height = targetH
      const ctx = offscreen.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, targetW, targetH)
      const imgData = ctx.getImageData(0, 0, targetW, targetH)

      const bgHex = editorState.display.background || '#18211b'
      const isDarkBg = bgHex === '#000000' || bgHex === '#18211b' || bgHex.startsWith('#0') || bgHex.startsWith('#1')
      const fgHex = isDarkBg ? '#a8d9a8' : '#18211b'

      const ditherResult = processDithering(imgData, {
        algorithm: algo,
        lineSpacing,
        angle,
        modulation,
        maxThickness,
        contrast,
        brightness,
        threshold,
        invert,
        fgColor: fgHex,
        bgColor: bgHex
      })

      const ditheredData = ditherResult.createImageData(fgHex, bgHex)
      ctx.putImageData(ditheredData, 0, 0)
      const dataUrl = offscreen.toDataURL('image/png')
      setBitmapCache(dataUrl, offscreen)

      const elementTitle = isAvatarOnly
        ? 'Dithered Avatar'
        : (isTele ? 'Telegraph / Wirephoto Engraving' : '1-Bit Dither Portrait')

      const newElement = {
        id: `bmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: 'bitmap',
        name: elementTitle,
        x: isAvatarOnly ? 10 : 0,
        y: isAvatarOnly ? 10 : 0,
        width: targetW,
        height: targetH,
        dataUrl,
        ditherMethod: algo,
        contrast,
        brightness,
        threshold,
        invert
      }

      if (isAvatarOnly) {
        editorState.elements.push(newElement)
        editorState.selectedId = newElement.id
        notify()
        showToast('✨ Dithered Avatar inserted into canvas!', 'info')
      } else {
        updateDisplay({ width: targetW, height: targetH })
        editorState.elements = [newElement]
        editorState.selectedId = newElement.id
        notify()
        requestAnimationFrame(() => fitCanvasToWorkspace())
        showToast(
          isTele
            ? '📡 Telegraph / wirephoto engraving generated! Microcontroller C code ready.'
            : '✨ 1-Bit Dither Portrait generated! Click "Export C Code" for microcontroller code.',
          'info'
        )
      }
    } catch (err) {
      console.error('Dithering error:', err)
      showToast('Dithering failed: ' + err.message, 'error')
    } finally {
      if (applyBtn) applyBtn.disabled = !editorState.reference.src
    }
  }

  document.querySelector('#apply-dither-button')?.addEventListener('click', executeDither)
}

initDitheringStudio()


