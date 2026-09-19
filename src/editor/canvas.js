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
  const target = event.target.closest(
    '[data-element-id]',
  )

  if (!target) {
    selectElement(null)
    return
  }

  const id = target.dataset.elementId

  const element = editorState.elements.find(
    (item) => item.id === id,
  )

  if (!element) return

  selectElement(id)

  dragState = {
    id,

    startMouseX: event.clientX,
    startMouseY: event.clientY,

    startX: element.x,
    startY: element.y,
  }

  target.setPointerCapture?.(event.pointerId)

  event.preventDefault()
}

function handlePointerMove(event) {
  if (!dragState) return

  const element = editorState.elements.find(
    (item) => item.id === dragState.id,
  )

  if (!element) return

  const zoom = editorState.zoom || 1

  let deltaX =
    (event.clientX - dragState.startMouseX) / zoom

  let deltaY =
    (event.clientY - dragState.startMouseY) / zoom

  let x = dragState.startX + deltaX
  let y = dragState.startY + deltaY

  if (editorState.grid.snap) {
    const size = editorState.grid.size

    x = Math.round(x / size) * size
    y = Math.round(y / size) * size
  }

  x = Math.max(
    0,
    Math.min(
      editorState.display.width - element.width,
      x,
    ),
  )

  y = Math.max(
    0,
    Math.min(
      editorState.display.height - element.height,
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
  if (!canvasElement) return

  canvasElement.style.backgroundColor =
    editorState.display.background

  canvasElement.innerHTML = ''

  for (const element of editorState.elements) {
    const node = renderElement(element)

    canvasElement.appendChild(node)
  }
}

function renderElement(element) {
  const node = document.createElement('div')

  node.className = 'canvas-element'

  node.dataset.elementId = element.id

  node.style.left = `${element.x}px`
  node.style.top = `${element.y}px`

  node.style.width = `${element.width}px`
  node.style.height = `${element.height}px`

  if (element.id === editorState.selectedId) {
    node.classList.add('selected')
  }

  if (element.type === 'text') {
    node.classList.add('text-element')

    node.textContent = element.text

    node.style.color = element.color
    node.style.fontSize = `${element.fontSize}px`
    node.style.fontFamily = element.fontFamily
    node.style.fontWeight = element.fontWeight
  }

  if (element.type === 'rectangle') {
    node.style.background = element.fill

    node.style.border =
      `${element.strokeWidth}px solid ${element.stroke}`
  }

  if (element.type === 'circle') {
    node.style.background = element.fill

    node.style.border =
      `${element.strokeWidth}px solid ${element.stroke}`

    node.style.borderRadius = '50%'
  }

  if (element.type === 'line') {
    node.classList.add('line-element')

    const line = document.createElement('div')

    line.style.height = `${element.strokeWidth}px`
    line.style.background = element.color

    node.appendChild(line)
  }

  return node
}