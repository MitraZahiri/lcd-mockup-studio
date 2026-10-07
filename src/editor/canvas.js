import {
  editorState,
  selectElement,
  updateElement,
  notify,
} from './state.js'
import { calculateResize } from './resize.js'

let canvasElement = null
let dragState = null
let resizeState = null

export function initCanvas(canvas) {
  canvasElement = canvas

  canvasElement.addEventListener(
    'pointerdown',
    handlePointerDown,
  )

  canvasElement.addEventListener(
    'dblclick',
    handleDoubleClick,
  )

  window.addEventListener(
    'pointermove',
    handlePointerMove,
  )

  window.addEventListener(
    'pointerup',
    handlePointerUp,
  )

  window.addEventListener(
    'pointercancel',
    handlePointerUp,
  )

  window.addEventListener(
    'blur',
    handlePointerUp,
  )

  canvasElement.addEventListener('pointerleave', () => {
    const coordsElem = document.querySelector('#status-coords')
    if (coordsElem && !dragState && !resizeState) {
      coordsElem.textContent = ''
    }
  })
}

function handlePointerDown(event) {
  const handleTarget = event.target.closest('.resize-handle')
  if (handleTarget) {
    const handle = handleTarget.dataset.handle
    const id = handleTarget.dataset.elementId
    const element = editorState.elements.find((item) => item.id === id)
    if (!element) return

    resizeState = {
      id,
      handle,
      startMouseX: event.clientX,
      startMouseY: event.clientY,
      startBox: {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      },
    }
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const target =
    event.target.closest(
      '[data-element-id]',
    )

  if (!target) {
    selectElement(null)
    return
  }

  const id =
    target.dataset.elementId

  const element =
    editorState.elements.find(
      (item) => item.id === id,
    )

  if (!element) {
    return
  }

  selectElement(id)

  dragState = {
    id,

    startMouseX:
      event.clientX,

    startMouseY:
      event.clientY,

    startX:
      element.x,

    startY:
      element.y,
  }

  event.preventDefault()
}

function handlePointerMove(event) {
  const coordsElem = document.querySelector('#status-coords')
  if (coordsElem && canvasElement) {
    const rect = canvasElement.getBoundingClientRect()
    const scale = editorState.view.scale || 1
    const px = Math.floor((event.clientX - rect.left) / scale)
    const py = Math.floor((event.clientY - rect.top) / scale)
    if (px >= 0 && px < editorState.display.width && py >= 0 && py < editorState.display.height) {
      coordsElem.textContent = `X: ${px}  Y: ${py}`
    } else if (!dragState && !resizeState) {
      coordsElem.textContent = ''
    }
  }

  if (resizeState) {
    const element = editorState.elements.find(
      (item) => item.id === resizeState.id,
    )
    if (!element) return

    const scale = editorState.view.scale || 1
    const deltaX = (event.clientX - resizeState.startMouseX) / scale
    const deltaY = (event.clientY - resizeState.startMouseY) / scale

    const newBox = calculateResize(
      resizeState.handle,
      resizeState.startBox,
      { x: deltaX, y: deltaY },
      {
        snap: editorState.grid.snap,
        snapSize: editorState.grid.size,
        displayWidth: editorState.display.width,
        displayHeight: editorState.display.height,
        minWidth: element.type === 'circle' ? 10 : 4,
        minHeight: element.type === 'circle' ? 10 : (element.type === 'line' ? 1 : 4),
      },
    )

    updateElement(element.id, newBox, false)
    renderCanvas()
    return
  }

  if (!dragState) {
    return
  }

  const element =
    editorState.elements.find(
      (item) =>
        item.id === dragState.id,
    )

  if (!element) {
    return
  }

  const scale =
    editorState.view.scale || 1

  const deltaX =
    (event.clientX -
      dragState.startMouseX) /
    scale

  const deltaY =
    (event.clientY -
      dragState.startMouseY) /
    scale

  let x =
    dragState.startX + deltaX

  let y =
    dragState.startY + deltaY

  if (editorState.grid.snap) {
    const size =
      editorState.grid.size

    x =
      Math.round(x / size) *
      size

    y =
      Math.round(y / size) *
      size
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
      x: Math.round(x),
      y: Math.round(y),
    },
    false,
  )

  renderCanvas()
}

function handlePointerUp() {
  if (resizeState) {
    resizeState = null
    notify()
    return
  }

  if (!dragState) {
    return
  }

  dragState = null
  notify()
}

function handleDoubleClick(event) {
  const target = event.target.closest('[data-element-id]')
  if (!target) return

  const id = target.dataset.elementId
  const element = editorState.elements.find((item) => item.id === id)
  if (!element || element.type !== 'text') return

  const existingInput = target.querySelector('.inline-text-editor')
  if (existingInput) return

  const input = document.createElement('input')
  input.type = 'text'
  input.className = 'inline-text-editor'
  input.value = element.text || ''
  input.style.position = 'absolute'
  input.style.left = '0'
  input.style.top = '0'
  input.style.width = '100%'
  input.style.height = '100%'
  input.style.fontSize = `${element.fontSize}px`
  input.style.fontFamily = element.fontFamily || 'monospace'
  input.style.fontWeight = String(element.fontWeight || '400')
  input.style.color = element.color
  input.style.background = 'rgba(0, 0, 0, 0.85)'
  input.style.border = '1px solid #8be28b'
  input.style.outline = 'none'
  input.style.padding = '0 4px'
  input.style.zIndex = '500'

  function commitText() {
    if (input.parentNode) {
      const newText = input.value
      input.remove()
      updateElement(element.id, { text: newText })
    }
  }

  input.addEventListener('blur', commitText)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      commitText()
    } else if (e.key === 'Escape') {
      input.remove()
    }
    e.stopPropagation()
  })

  target.appendChild(input)
  input.focus()
  input.select()
}

export function renderCanvas() {
  if (!canvasElement) {
    return
  }

  const {
    width,
    height,
    background,
  } = editorState.display

  const scale =
    editorState.view.scale || 1

  canvasElement.style.width =
    `${width}px`

  canvasElement.style.height =
    `${height}px`

  canvasElement.style.backgroundColor =
    background

  canvasElement.style.transform =
    `scale(${scale})`

  canvasElement.style.transformOrigin =
    'center center'

  canvasElement.classList.toggle(
    'grid-enabled',
    editorState.grid.enabled,
  )

  canvasElement.style.setProperty(
    '--grid-size',
    `${editorState.grid.size}px`,
  )

  canvasElement.innerHTML = ''

  /*
   * IMPORTANT
   *
   * Reference image is deliberately NOT
   * rendered inside this canvas.
   *
   * This canvas contains only editable
   * mockup elements.
   */

  for (
    const element
    of editorState.elements
  ) {
    canvasElement.appendChild(
      renderElement(element),
    )
  }

  if (editorState.overlay?.enabled && editorState.reference?.src) {
    const overlay = document.createElement('img')
    overlay.className = 'canvas-reference-overlay'
    overlay.src = editorState.reference.src
    overlay.alt = 'Reference Overlay'
    overlay.style.position = 'absolute'
    overlay.style.left = '0'
    overlay.style.top = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.objectFit = 'fill'
    overlay.style.opacity = String(editorState.overlay.opacity ?? 0.4)
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = '100'
    canvasElement.appendChild(overlay)
  }
}

function renderElement(element) {
  const node =
    document.createElement('div')

  node.className =
    'canvas-element'

  node.dataset.elementId =
    element.id

  node.style.left =
    `${element.x}px`

  node.style.top =
    `${element.y}px`

  node.style.width =
    `${element.width}px`

  node.style.height =
    `${element.height}px`

  if (
    element.id ===
    editorState.selectedId
  ) {
    node.classList.add('selected')
    appendResizeHandles(node, element)
  }

  if (element.type === 'text') {
    renderTextElement(
      node,
      element,
    )
  }

  if (
    element.type ===
    'rectangle'
  ) {
    renderRectangleElement(
      node,
      element,
    )
  }

  if (element.type === 'circle') {
    renderCircleElement(
      node,
      element,
    )
  }

  if (element.type === 'line') {
    renderLineElement(
      node,
      element,
    )
  }

  if (element.type === 'bitmap') {
    renderBitmapElement(
      node,
      element,
    )
  }

  return node
}

function renderBitmapElement(node, element) {
  node.classList.add('element-bitmap')
  let img = node.querySelector('img')
  if (!img) {
    img = document.createElement('img')
    img.className = 'canvas-bitmap-img'
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'fill'
    img.style.imageRendering = 'pixelated'
    img.style.pointerEvents = 'none'
    img.style.userSelect = 'none'
    img.draggable = false
    node.appendChild(img)
  }
  img.src = element.dataUrl || ''
  img.style.opacity = element.opacity !== undefined ? String(element.opacity) : '1'
}

function renderTextElement(
  node,
  element,
) {
  node.classList.add(
    'text-element',
  )

  node.textContent =
    element.text

  node.style.color =
    element.color

  node.style.fontSize =
    `${element.fontSize}px`

  node.style.fontFamily =
    element.fontFamily

  node.style.fontWeight =
    element.fontWeight

  node.style.lineHeight = '1'
}

function renderRectangleElement(
  node,
  element,
) {
  node.classList.add(
    'rectangle-element',
  )

  node.style.background =
    element.fill

  node.style.border =
    `${element.strokeWidth}px solid ${element.stroke}`

  node.style.boxSizing =
    'border-box'
}

function renderCircleElement(
  node,
  element,
) {
  node.classList.add(
    'circle-element',
  )

  node.style.background =
    element.fill

  node.style.border =
    `${element.strokeWidth}px solid ${element.stroke}`

  node.style.borderRadius =
    '50%'

  node.style.boxSizing =
    'border-box'
}

function renderLineElement(
  node,
  element,
) {
  node.classList.add(
    'line-element',
  )

  const line =
    document.createElement('div')

  line.style.width = '100%'

  line.style.height =
    `${element.strokeWidth}px`

  line.style.background =
    element.color

  line.style.pointerEvents =
    'none'

  node.appendChild(line)
}

function appendResizeHandles(node, element) {
  const handles = element.type === 'line'
    ? ['w', 'e']
    : ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

  for (const pos of handles) {
    const handle = document.createElement('div')
    handle.className = `resize-handle handle-${pos}`
    handle.dataset.handle = pos
    handle.dataset.elementId = element.id
    node.appendChild(handle)
  }
}