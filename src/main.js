import './style.css'
import { initProjectControls } from './project/projectControls.js'
import { initPngExport } from './export/pngExport.js'
import { initSvgExport } from './export/svgExport.js'

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
} from './editor/state.js'

import {
  createElement,
  createElementFromAnalysis,
} from './editor/elements.js'

import {
  initCanvas,
  renderCanvas,
} from './editor/canvas.js'

import {
  loadReferenceImage,
  fitCanvasToReference,
  removeReferenceImage,
} from './reference/referenceImage.js'

import {
  analyzeReferenceImage,
} from './analysis/imageAnalyzer.js'


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


        <button
          class="wide-button primary-button"
          id="upload-reference"
          type="button"
        >
          Upload Reference
        </button>


        <div
          class="reference-info"
          id="reference-info"
          hidden
        >

          <strong
            id="reference-name"
          ></strong>

          <span
            id="reference-size"
          ></span>

        </div>


        <button
          class="wide-button analyze-button"
          id="analyze-reference"
          type="button"
          disabled
        >
          ✦ Analyze Image
        </button>


        <div
          class="analysis-message"
          id="analysis-message"
          hidden
        ></div>


        <div
          class="reference-actions"
          id="reference-actions"
          hidden
        >

          <button
            class="wide-button"
            id="match-reference-size"
            type="button"
          >
            Match Document Size
          </button>

          <button
            class="wide-button danger-button"
            id="remove-reference"
            type="button"
          >
            Remove Reference
          </button>

        </div>

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
  referenceInfo.hidden = referenceActions.hidden = !hasReference
  analyzeReferenceButton.disabled = !hasReference
  referenceName.textContent = ref.fileName || ''
  referenceSize.textContent = hasReference
    ? `${ref.naturalWidth} × ${ref.naturalHeight} px` : ''
  analysisMessage.hidden = true
}

uploadReferenceButton.addEventListener(
  'click',
  () => {
    referenceFileInput.click()
  },
)


referenceFileInput.addEventListener(
  'change',
  async () => {

    const file =
      referenceFileInput.files?.[0]

    if (!file) {
      return
    }

    referenceLoading = true
    try {

      analysisMessage.hidden = true

      const result =
        await loadReferenceImage(file)

      referencePreviewImage.src =
        result.src

      referencePreviewImage.hidden =
        false

      referencePlaceholder.hidden =
        true

      referencePreview.classList.remove(
        'empty',
      )

      referenceInfo.hidden =
        false

      referenceActions.hidden =
        false

      analyzeReferenceButton.disabled =
        false

      referenceName.textContent =
        file.name

      referenceSize.textContent =
        `${result.width} × ${result.height} px`

      /*
       * Reference dimensions become the
       * logical document dimensions.
       *
       * The image itself still remains
       * ONLY in the left sidebar.
       */

      fitCanvasToReference()

      requestAnimationFrame(() => {
        fitCanvasToWorkspace()
      })

    } catch (error) {

      console.error(error)

      window.alert(
        error?.message ||
        'Reference image could not be loaded.',
      )

    } finally {

      referenceFileInput.value = ''
      referenceLoading = false

    }

  },
)


matchReferenceSizeButton.addEventListener(
  'click',
  () => {

    fitCanvasToReference()

    requestAnimationFrame(() => {
      fitCanvasToWorkspace()
    })

  },
)


removeReferenceButton.addEventListener(
  'click',
  () => {

    removeReferenceImage()

    referencePreviewImage.removeAttribute(
      'src',
    )

    referencePreviewImage.hidden =
      true

    referencePlaceholder.hidden =
      false

    referencePreview.classList.add(
      'empty',
    )

    referenceInfo.hidden =
      true

    referenceActions.hidden =
      true

    analyzeReferenceButton.disabled =
      true

    analysisMessage.hidden =
      true

  },
)


// ======================================================
// ANALYSIS
// ======================================================

analyzeReferenceButton.addEventListener(
  'click',
  async () => {

    if (!editorState.reference.src) {
      return
    }

    analysisInProgress = true
    const originalLabel =
      analyzeReferenceButton.textContent

    analyzeReferenceButton.disabled =
      true

    analyzeReferenceButton.textContent =
      'Analyzing...'

    analysisMessage.hidden =
      false

    analysisMessage.innerHTML = `
      <strong>
        Analyzing reference...
      </strong>

      <p>
        Detecting LCD text and interface geometry.
      </p>
    `

    try {

      const result =
        await analyzeReferenceImage()

      /*
       * Remove only elements generated by
       * a previous analysis.
       *
       * Manual elements remain untouched.
       */

      removeAnalysisElements(false)

      for (
        const data
        of result.elements
      ) {

        createElementFromAnalysis(
          data,
          false,
        )

      }

      /*
       * Render once after every detected
       * element has been inserted.
       */

      notify()

      requestAnimationFrame(() => {
        fitCanvasToWorkspace()
      })

      analysisMessage.innerHTML = `
        <strong>
          Analysis complete.
        </strong>

        <span>
          ${result.width}
          ×
          ${result.height}
          px
        </span>

        <p>
          ${result.stats.totalElements}
          editable elements created:
          ${result.stats.textRegions}
          OCR text regions and
          ${result.stats.horizontalLines}
          horizontal lines.
        </p>

        <p>
          Recognized text is editable.
          Select any text element on the mockup
          or in Layers to correct OCR results.
        </p>
      `

    } catch (error) {

      console.error(error)

      analysisMessage.innerHTML = `
        <strong>
          Analysis failed.
        </strong>

        <p>
          ${escapeHtml(
            error?.message ||
            'The reference image could not be analyzed.',
          )}
        </p>
      `

    } finally {

      analyzeReferenceButton.disabled =
        !editorState.reference.src

      analyzeReferenceButton.textContent =
        originalLabel
      analysisInProgress = false

    }

  },
)

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
      event.preventDefault()
      pasteElement()
      return
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
