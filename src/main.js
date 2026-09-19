import './style.css'

import {
  editorState,
  subscribe,
  updateReference,
} from './editor/state.js'

import {
  createElement,
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


// ======================================================
// APP UI
// ======================================================

document.querySelector('#app').innerHTML = `
  <div class="studio">

    <!-- TOP BAR -->
    <header class="topbar">

      <div class="brand">
        <div class="brand-icon">L</div>

        <div>
          <strong>LCD Mockup Studio</strong>
          <span>Untitled Project</span>
        </div>
      </div>

      <div class="toolbar">
        <button type="button">New</button>
        <button type="button">Open</button>
        <button type="button">Save</button>

        <div class="separator"></div>

        <button type="button" disabled>Undo</button>
        <button type="button" disabled>Redo</button>

        <div class="separator"></div>

        <button
          class="export-btn"
          type="button"
        >
          Export
        </button>
      </div>

    </header>


    <!-- LEFT SIDEBAR -->
    <aside class="sidebar left-sidebar">

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
            <span class="element-icon">T</span>
            <span>Text</span>
          </button>

          <button
            class="element-card"
            data-element-type="rectangle"
            type="button"
          >
            <span class="element-icon">□</span>
            <span>Rectangle</span>
          </button>

          <button
            class="element-card"
            data-element-type="line"
            type="button"
          >
            <span class="element-icon">╱</span>
            <span>Line</span>
          </button>

          <button
            class="element-card"
            data-element-type="circle"
            type="button"
          >
            <span class="element-icon">◯</span>
            <span>Circle</span>
          </button>

          <button
            class="element-card"
            data-element-type="image"
            type="button"
            disabled
            title="Coming soon"
          >
            <span class="element-icon">▧</span>
            <span>Image</span>
          </button>

          <button
            class="element-card"
            data-element-type="icon"
            type="button"
            disabled
            title="Coming soon"
          >
            <span class="element-icon">⌁</span>
            <span>Icon</span>
          </button>

        </div>

      </section>


      <!-- LAYERS -->
      <section class="panel layers-panel">

        <div class="panel-header">

          <div class="panel-title">
            LAYERS
          </div>

          <button
            class="small-button"
            type="button"
          >
            +
          </button>

        </div>

        <div class="layer active">
          <span class="visibility">◉</span>
          <span>Display</span>
        </div>

        <div class="empty-layers">
          Add an element to begin designing.
        </div>

      </section>

    </aside>


    <!-- WORKSPACE -->
    <main class="workspace">

      <div class="workspace-header">

        <div>
          <strong>Display</strong>

          <span id="workspace-resolution">
            ${editorState.display.width} ×
            ${editorState.display.height} px
          </span>
        </div>

        <div class="workspace-actions">

          <button
            id="workspace-reference-button"
            type="button"
          >
            Reference Image
          </button>

          <button
            id="workspace-fit-button"
            type="button"
          >
            Fit
          </button>

        </div>

      </div>


      <div class="canvas-area">

        <div class="display-frame">

          <div class="display-canvas"></div>

          <div
            class="resolution-label"
            id="canvas-resolution"
          >
            ${editorState.display.width} ×
            ${editorState.display.height}
          </div>

        </div>

      </div>

    </main>


    <!-- RIGHT SIDEBAR -->
    <aside class="sidebar right-sidebar">

      <!-- DISPLAY -->
      <section class="panel">

        <div class="panel-title">
          DISPLAY
        </div>

        <label class="field">

          <span>Preset</span>

          <select id="display-preset">
            <option value="custom">
              Custom Display
            </option>

            <option value="5">
              5 inch
            </option>

            <option value="7">
              7 inch
            </option>

            <option value="10">
              10 inch
            </option>

            <option value="15">
              15 inch
            </option>

            <option value="20">
              20 inch
            </option>
          </select>

        </label>


        <div class="field-row">

          <label class="field">

            <span>Width</span>

            <input
              id="display-width"
              type="number"
              min="1"
              value="${editorState.display.width}"
            >

          </label>


          <label class="field">

            <span>Height</span>

            <input
              id="display-height"
              type="number"
              min="1"
              value="${editorState.display.height}"
            >

          </label>

        </div>


        <label class="field">

          <span>Orientation</span>

          <select id="display-orientation">
            <option value="landscape">
              Landscape
            </option>

            <option value="portrait">
              Portrait
            </option>
          </select>

        </label>


        <label class="field">

          <span>Background</span>

          <div class="color-field">

            <input
              id="display-background"
              type="color"
              value="${editorState.display.background}"
            >

            <input
              id="display-background-text"
              type="text"
              value="${editorState.display.background.toUpperCase()}"
              readonly
            >

          </div>

        </label>

      </section>


      <!-- REFERENCE IMAGE -->
      <section class="panel">

        <div class="panel-title">
          REFERENCE IMAGE
        </div>


        <button
          class="wide-button"
          id="upload-reference"
          type="button"
        >
          Upload Reference
        </button>


        <input
          id="reference-file-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
        >


        <div
          class="reference-controls"
          id="reference-controls"
          hidden
        >

          <div class="reference-info">

            <strong id="reference-name"></strong>

            <span id="reference-size"></span>

          </div>


          <label class="field">

            <span>
              Opacity

              <strong id="reference-opacity-value">
                45%
              </strong>
            </span>

            <input
              id="reference-opacity"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value="0.45"
            >

          </label>


          <label class="reference-toggle">

            <input
              id="reference-visible"
              type="checkbox"
              checked
            >

            Show reference

          </label>


          <button
            class="wide-button"
            id="fit-reference"
            type="button"
          >
            Fit Canvas to Image
          </button>


          <!-- IMAGE ANALYSIS -->
          <div class="analysis-section">

            <div class="analysis-header">

              <strong>
                IMAGE ANALYSIS
              </strong>

              <span class="beta-badge">
                BETA
              </span>

            </div>


            <p class="helper">
              Detect text, lines and interface
              regions and convert them into
              editable elements.
            </p>


            <button
              class="wide-button analyze-button"
              id="analyze-reference"
              type="button"
            >
              ✦ Analyze Image
            </button>


            <div
              class="analysis-result"
              id="analysis-result"
              hidden
            ></div>

          </div>


          <button
            class="wide-button danger-button"
            id="remove-reference"
            type="button"
          >
            Remove Reference
          </button>

        </div>


        <p class="helper">
          Upload an LCD, HMI or device screenshot
          and recreate the interface directly on
          top of it.
        </p>

      </section>

    </aside>


    <!-- STATUS BAR -->
    <footer class="statusbar">

      <div class="status-left">

        <span id="status-resolution">
          ${editorState.display.width} ×
          ${editorState.display.height} px
        </span>

        <span id="status-orientation">
          Landscape
        </span>

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


        <button
          id="zoom-out"
          type="button"
        >
          −
        </button>

        <span id="zoom-value">
          100%
        </span>

        <button
          id="zoom-in"
          type="button"
        >
          +
        </button>

      </div>

    </footer>

  </div>
`


// ======================================================
// DOM REFERENCES
// ======================================================

const canvas =
  document.querySelector('.display-canvas')

const canvasArea =
  document.querySelector('.canvas-area')

const uploadReferenceButton =
  document.querySelector('#upload-reference')

const workspaceReferenceButton =
  document.querySelector('#workspace-reference-button')

const referenceFileInput =
  document.querySelector('#reference-file-input')

const referenceControls =
  document.querySelector('#reference-controls')

const referenceName =
  document.querySelector('#reference-name')

const referenceSize =
  document.querySelector('#reference-size')

const referenceOpacity =
  document.querySelector('#reference-opacity')

const referenceOpacityValue =
  document.querySelector('#reference-opacity-value')

const referenceVisible =
  document.querySelector('#reference-visible')

const fitReferenceButton =
  document.querySelector('#fit-reference')

const workspaceFitButton =
  document.querySelector('#workspace-fit-button')

const removeReferenceButton =
  document.querySelector('#remove-reference')

const analyzeReferenceButton =
  document.querySelector('#analyze-reference')

const analysisResult =
  document.querySelector('#analysis-result')

const displayWidthInput =
  document.querySelector('#display-width')

const displayHeightInput =
  document.querySelector('#display-height')

const workspaceResolution =
  document.querySelector('#workspace-resolution')

const canvasResolution =
  document.querySelector('#canvas-resolution')

const statusResolution =
  document.querySelector('#status-resolution')

const statusOrientation =
  document.querySelector('#status-orientation')

const zoomValue =
  document.querySelector('#zoom-value')

const zoomInButton =
  document.querySelector('#zoom-in')

const zoomOutButton =
  document.querySelector('#zoom-out')


// ======================================================
// SAFE VIEW STATE
// ======================================================

// state.js içinde view henüz yoksa uygulama
// çökmek yerine burada oluşturuyoruz.

if (!editorState.view) {
  editorState.view = {
    fit: true,
    scale: 1,
  }
}

if (
  !Number.isFinite(editorState.view.scale) ||
  editorState.view.scale <= 0
) {
  editorState.view.scale = 1
}


// ======================================================
// CANVAS
// ======================================================

initCanvas(canvas)


// ======================================================
// ELEMENT BUTTONS
// ======================================================

document
  .querySelectorAll(
    '.element-card[data-element-type]',
  )
  .forEach((button) => {

    button.addEventListener(
      'click',
      () => {

        if (button.disabled) {
          return
        }

        const type =
          button.dataset.elementType

        if (
          [
            'text',
            'rectangle',
            'circle',
            'line',
          ].includes(type)
        ) {
          createElement(type)
        }

      },
    )

  })


// ======================================================
// REFERENCE PICKER
// ======================================================

function openReferencePicker() {
  referenceFileInput.click()
}


uploadReferenceButton.addEventListener(
  'click',
  openReferencePicker,
)


workspaceReferenceButton.addEventListener(
  'click',
  openReferencePicker,
)


// ======================================================
// LOAD REFERENCE IMAGE
// ======================================================

referenceFileInput.addEventListener(
  'change',
  async () => {

    const file =
      referenceFileInput.files?.[0]

    if (!file) {
      return
    }

    try {

      const result =
        await loadReferenceImage(file)

      referenceControls.hidden = false

      referenceName.textContent =
        file.name

      referenceSize.textContent =
        `${result.width} × ${result.height} px`

      referenceOpacity.value =
        String(
          editorState.reference.opacity,
        )

      referenceOpacityValue.textContent =
        `${Math.round(
          editorState.reference.opacity * 100,
        )}%`

      referenceVisible.checked =
        editorState.reference.visible


      // Önce eski analysis sonucunu temizle.
      analysisResult.hidden = true
      analysisResult.innerHTML = ''


      const shouldFit =
        window.confirm(
          `Image detected: ${result.width} × ${result.height} px.\n\nFit the display canvas to this image?`,
        )


      if (shouldFit) {

        // Gerçek document resolution'ı
        // screenshot resolution'ına dönüşür.
        fitCanvasToReference()

      }


      // Document çözünürlüğü ne olursa olsun
      // ekranda rahat çalışılabilecek boyuta getir.
      requestAnimationFrame(() => {
        fitCanvasToWorkspace()
      })

    } catch (error) {

      console.error(error)

      window.alert(
        error?.message ??
        'Reference image could not be loaded.',
      )

    } finally {

      // Aynı dosyanın tekrar seçilebilmesi için.
      referenceFileInput.value = ''

    }

  },
)


// ======================================================
// REFERENCE OPACITY
// ======================================================

referenceOpacity.addEventListener(
  'input',
  () => {

    const opacity =
      Number(referenceOpacity.value)

    updateReference({
      opacity,
    })

    referenceOpacityValue.textContent =
      `${Math.round(opacity * 100)}%`

  },
)


// ======================================================
// REFERENCE VISIBILITY
// ======================================================

referenceVisible.addEventListener(
  'change',
  () => {

    updateReference({
      visible:
        referenceVisible.checked,
    })

  },
)


// ======================================================
// FIT DOCUMENT TO REFERENCE RESOLUTION
// ======================================================

fitReferenceButton.addEventListener(
  'click',
  () => {

    if (!editorState.reference.src) {
      return
    }

    fitCanvasToReference()

    requestAnimationFrame(() => {
      fitCanvasToWorkspace()
    })

  },
)


// ======================================================
// FIT VIEW TO WORKSPACE
// ======================================================

workspaceFitButton.addEventListener(
  'click',
  () => {
    fitCanvasToWorkspace()
  },
)


// ======================================================
// REMOVE REFERENCE
// ======================================================

removeReferenceButton.addEventListener(
  'click',
  () => {

    removeReferenceImage()

    referenceControls.hidden = true

    referenceName.textContent = ''
    referenceSize.textContent = ''

    analysisResult.hidden = true
    analysisResult.innerHTML = ''

  },
)


// ======================================================
// IMAGE ANALYSIS
// ======================================================

analyzeReferenceButton.addEventListener(
  'click',
  () => {

    if (!editorState.reference.src) {

      window.alert(
        'Upload a reference image first.',
      )

      return
    }


    analyzeReferenceButton.disabled = true

    analyzeReferenceButton.textContent =
      'Analyzing…'


    analysisResult.hidden = false

    analysisResult.innerHTML = `
      <div class="analysis-loading">

        <strong>
          Reference ready for analysis
        </strong>

        <span>
          ${editorState.reference.naturalWidth}
          ×
          ${editorState.reference.naturalHeight}
          px
        </span>

        <small>
          Image loaded successfully.
          Automatic text and geometry detection
          is the next analysis-engine step.
        </small>

      </div>
    `


    // Henüz gerçek OCR / detection motoru
    // bağlanmadığı için sahte sonuç üretmiyoruz.
    window.setTimeout(() => {

      analyzeReferenceButton.disabled = false

      analyzeReferenceButton.textContent =
        '✦ Analyze Image'

    }, 400)

  },
)


// ======================================================
// FIT / ZOOM
// ======================================================

function fitCanvasToWorkspace() {

  if (!canvasArea) {
    return
  }

  const documentWidth =
    Number(editorState.display.width)

  const documentHeight =
    Number(editorState.display.height)


  if (
    documentWidth <= 0 ||
    documentHeight <= 0
  ) {
    return
  }


  const availableWidth =
    Math.max(
      100,
      canvasArea.clientWidth - 120,
    )

  const availableHeight =
    Math.max(
      100,
      canvasArea.clientHeight - 120,
    )


  const scaleX =
    availableWidth / documentWidth

  const scaleY =
    availableHeight / documentHeight


  let scale =
    Math.min(scaleX, scaleY)


  // Örneğin 249×128 LCD ekranlar
  // editörde büyütülebilsin.
  scale =
    Math.min(scale, 4)


  // Büyük resolution'larda tamamen
  // kaybolmasını önle.
  scale =
    Math.max(scale, 0.1)


  editorState.view.scale =
    scale

  editorState.view.fit =
    true

  editorState.zoom =
    scale


  renderCanvas()

  updateZoomLabel()

}


// ======================================================
// MANUAL ZOOM
// ======================================================

function setZoom(scale) {

  const nextScale =
    Math.min(
      4,
      Math.max(
        0.1,
        scale,
      ),
    )

  editorState.view.scale =
    nextScale

  editorState.view.fit =
    false

  editorState.zoom =
    nextScale

  renderCanvas()

  updateZoomLabel()

}


zoomInButton.addEventListener(
  'click',
  () => {

    setZoom(
      editorState.view.scale + 0.25,
    )

  },
)


zoomOutButton.addEventListener(
  'click',
  () => {

    setZoom(
      editorState.view.scale - 0.25,
    )

  },
)


// ======================================================
// ZOOM LABEL
// ======================================================

function updateZoomLabel() {

  zoomValue.textContent =
    `${Math.round(
      editorState.view.scale * 100,
    )}%`

}


// ======================================================
// UI SYNC
// ======================================================

function updateInterface() {

  const width =
    editorState.display.width

  const height =
    editorState.display.height


  displayWidthInput.value =
    width

  displayHeightInput.value =
    height


  workspaceResolution.textContent =
    `${width} × ${height} px`

  canvasResolution.textContent =
    `${width} × ${height}`

  statusResolution.textContent =
    `${width} × ${height} px`


  statusOrientation.textContent =
    width >= height
      ? 'Landscape'
      : 'Portrait'


  updateZoomLabel()

}


// ======================================================
// WINDOW RESIZE
// ======================================================

let resizeTimer = null

window.addEventListener(
  'resize',
  () => {

    if (!editorState.view.fit) {
      return
    }

    window.clearTimeout(resizeTimer)

    resizeTimer =
      window.setTimeout(
        () => {
          fitCanvasToWorkspace()
        },
        100,
      )

  },
)


// ======================================================
// STATE SUBSCRIPTION
// ======================================================

subscribe(() => {

  renderCanvas()

  updateInterface()

})


// ======================================================
// INITIAL RENDER
// ======================================================

renderCanvas()

updateInterface()