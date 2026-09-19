import {
  editorState,
  selectElement,
  updateElement,
} from './state.js'

let canvasElement = null
let dragState = null

export function initCanvas(canvas) {
  canvasElement = canvas

  canvasElement.addEventListener(
    'pointerdown',
    handlePointerDown,
  )

  window.addEventListener(
    'pointermove',
    handlePointerMove,
  )

  window.addEventListener(
    'pointerup',
    handlePointerUp,
  )
}

function handlePointerDown(event) {
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
  dragState = null
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

  return node
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