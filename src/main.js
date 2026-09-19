import './style.css'

import {
  editorState,
  subscribe,
  getSelectedElement,
  selectElement,
  removeElement,
  updateElement,
  updateDisplay,
  setViewScale,
  setGridEnabled,
  setSnapEnabled,
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
// APP
// ======================================================

document.querySelector('#app').innerHTML = `
  <div class="studio">

    <header class="topbar">

      <div class="brand">
        <div class="brand-icon">L</div>

        <div class="brand-copy">
          <strong>LCD Mockup Studio</strong>
          <span>Untitled Project</span>
        </div>
      </div>

      <div class="toolbar">

        <button type="button">
          New
        </button>

        <button type="button">
          Open
        </button>

        <button type="button">
          Save
        </button>

        <div class="separator"></div>

        <button type="button" disabled>
          Undo
        </button>

        <button type="button" disabled>
          Redo
        </button>

        <div class="separator"></div>

        <button
          type="button"
          class="export-button"
        >
          Export
        </button>

      </div>

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


          <button
            class="wide-button danger-button"
            id="delete-element"
            type="button"
          >
            Delete Element
          </button>

        </div>

      </section>

    </aside>


    <!-- ============================================= -->
    <!-- STATUS                                        -->
    <!-- ============================================= -->

    <footer class="statusbar">

      <div class="status-left">

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
  () => {

    if (!editorState.reference.src) {
      return
    }

    /*
     * IMPORTANT:
     *
     * We are NOT pretending that image
     * recognition exists yet.
     *
     * This button is now connected to the
     * correct architecture.
     *
     * The next implementation step will
     * connect an analyzer which returns
     * real element geometry/text data.
     */

    analysisMessage.hidden = false

    analysisMessage.innerHTML = `
      <strong>
        Reference ready.
      </strong>

      <span>
        ${editorState.reference.naturalWidth}
        ×
        ${editorState.reference.naturalHeight}
        px
      </span>

      <p>
        The reference is correctly separated
        from the editable canvas. The image
        analysis engine is the next module to
        connect.
      </p>
    `

  },
)


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

    const element =
      getSelectedElement()

    if (!element) {
      return
    }

    if (
      event.key === 'Delete' ||
      event.key === 'Backspace'
    ) {

      removeElement(
        element.id,
      )

      event.preventDefault()

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