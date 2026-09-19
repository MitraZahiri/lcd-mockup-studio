import './style.css'

import {
  editorState,
  subscribe,
} from './editor/state.js'

import {
  createElement,
} from './editor/elements.js'

import {
  initCanvas,
  renderCanvas,
} from './editor/canvas.js'

document.querySelector('#app').innerHTML = `
  <div class="studio">

    <header class="topbar">
      <div class="brand">
        <div class="brand-icon">L</div>

        <div>
          <strong>LCD Mockup Studio</strong>
          <span>Untitled Project</span>
        </div>
      </div>

      <div class="toolbar">
        <button>New</button>
        <button>Open</button>
        <button>Save</button>

        <div class="separator"></div>

        <button disabled>Undo</button>
        <button disabled>Redo</button>

        <div class="separator"></div>

        <button class="export-btn">Export</button>
      </div>
    </header>


    <aside class="sidebar left-sidebar">

      <section class="panel">
        <div class="panel-title">ELEMENTS</div>

        <div class="element-grid">
          <button class="element-card">
            <span class="element-icon">T</span>
            <span>Text</span>
          </button>

          <button class="element-card">
            <span class="element-icon">□</span>
            <span>Rectangle</span>
          </button>

          <button class="element-card">
            <span class="element-icon">╱</span>
            <span>Line</span>
          </button>

          <button class="element-card">
            <span class="element-icon">◯</span>
            <span>Circle</span>
          </button>

          <button class="element-card">
            <span class="element-icon">▧</span>
            <span>Image</span>
          </button>

          <button class="element-card">
            <span class="element-icon">⌁</span>
            <span>Icon</span>
          </button>
        </div>
      </section>


      <section class="panel layers-panel">
        <div class="panel-header">
          <div class="panel-title">LAYERS</div>
          <button class="small-button">+</button>
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


    <main class="workspace">

      <div class="workspace-header">
        <div>
          <strong>Display</strong>
          <span>800 × 480 px</span>
        </div>

        <div class="workspace-actions">
          <button>Reference Image</button>
          <button>Fit</button>
        </div>
      </div>


      <div class="canvas-area">

        <div class="display-frame">

          <div class="display-canvas">

            <div class="canvas-placeholder">
              <div class="placeholder-title">
                DEVICE READY
              </div>

              <div class="placeholder-subtitle">
                Double-click or add an element to start
              </div>
            </div>

          </div>

          <div class="resolution-label">
            800 × 480
          </div>

        </div>

      </div>

    </main>


    <aside class="sidebar right-sidebar">

      <section class="panel">
        <div class="panel-title">DISPLAY</div>

        <label class="field">
          <span>Preset</span>

          <select>
            <option>Custom Display</option>
            <option>5 inch</option>
            <option>7 inch</option>
            <option>10 inch</option>
            <option>15 inch</option>
            <option>20 inch</option>
          </select>
        </label>


        <div class="field-row">

          <label class="field">
            <span>Width</span>
            <input type="number" value="800">
          </label>

          <label class="field">
            <span>Height</span>
            <input type="number" value="480">
          </label>

        </div>


        <label class="field">
          <span>Orientation</span>

          <select>
            <option>Landscape</option>
            <option>Portrait</option>
          </select>
        </label>


        <label class="field">
          <span>Background</span>

          <div class="color-field">
            <input type="color" value="#18211b">
            <input type="text" value="#18211B">
          </div>
        </label>

      </section>


      <section class="panel">
        <div class="panel-title">REFERENCE IMAGE</div>

        <button class="wide-button">
          Upload Reference
        </button>

        <p class="helper">
          Overlay a screenshot or device image and recreate
          the interface directly on top of it.
        </p>
      </section>

    </aside>


    <footer class="statusbar">

      <div class="status-left">
        <span>800 × 480 px</span>
        <span>Landscape</span>
      </div>

      <div class="status-right">

        <label>
          <input type="checkbox" checked>
          Grid
        </label>

        <label>
          <input type="checkbox" checked>
          Snap
        </label>

        <button>−</button>
        <span>100%</span>
        <button>+</button>

      </div>

    </footer>

  </div>
`
const canvas = document.querySelector('.display-canvas')

initCanvas(canvas)

document
  .querySelectorAll('.element-card')
  .forEach((button) => {
    const label =
      button.querySelector('span:last-child')
        ?.textContent
        ?.trim()
        ?.toLowerCase()

    if (
      ['text', 'rectangle', 'circle', 'line']
        .includes(label)
    ) {
      button.addEventListener('click', () => {
        createElement(label)
      })
    }
  })

subscribe(() => {
  renderCanvas()
})

renderCanvas()