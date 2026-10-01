export const editorState = {
  display: {
    width: 800,
    height: 480,
    background: '#18211b',
  },

  reference: {
    src: null,
    fileName: null,
    naturalWidth: 0,
    naturalHeight: 0,
  },

  elements: [],
  selectedId: null,

  view: {
    scale: 1,
  },

  grid: {
    enabled: true,
    snap: true,
    size: 10,
  },
}

const MAX_HISTORY = 100

const undoStack = []
const redoStack = []
let historyRestoring = false

function clone(value) {
  return structuredClone(value)
}

function createHistorySnapshot() {
  return clone({
    display: editorState.display,
    elements: editorState.elements,
    grid: editorState.grid,
  })
}

function snapshotsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function recordHistory() {
  if (historyRestoring) return

  const snapshot = createHistorySnapshot()
  const previous = undoStack[undoStack.length - 1]

  if (previous && snapshotsEqual(previous, snapshot)) return

  undoStack.push(snapshot)

  if (undoStack.length > MAX_HISTORY) {
    undoStack.shift()
  }

  redoStack.length = 0
}

export function canUndo() {
  return undoStack.length > 1
}

export function canRedo() {
  return redoStack.length > 0
}

function restoreHistorySnapshot(snapshot) {
  historyRestoring = true

  editorState.display = clone(snapshot.display)
  editorState.elements = clone(snapshot.elements)
  editorState.grid = clone(snapshot.grid)

  editorState.selectedId = null

  historyRestoring = false
  notify()
}

export function undo() {
  if (!canUndo()) return false

  const current = undoStack.pop()
  redoStack.push(current)

  const previous = undoStack[undoStack.length - 1]

  restoreHistorySnapshot(previous)

  return true
}

export function redo() {
  if (!canRedo()) return false

  const snapshot = redoStack.pop()

  undoStack.push(snapshot)
  restoreHistorySnapshot(snapshot)

  return true
}

export function resetHistory() {
  undoStack.length = 0
  redoStack.length = 0

  undoStack.push(createHistorySnapshot())

  notify()
}

// SUBSCRIBERS
const listeners = new Set()

export function subscribe(listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function notify() {
  recordHistory()

  listeners.forEach((listener) => {
    listener(editorState)
  })
}

// SELECTION
export function getSelectedElement() {
  return (
    editorState.elements.find(
      (element) => element.id === editorState.selectedId,
    ) || null
  )
}

export function selectElement(id) {
  editorState.selectedId = id
  notify()
}

// ELEMENTS
export function addElement(element, shouldNotify = true) {
  editorState.elements.push(element)
  editorState.selectedId = element.id

  if (shouldNotify) notify()
}

export function addElements(elements) {
  if (!Array.isArray(elements)) return

  editorState.elements.push(...elements)

  if (elements.length > 0) {
    editorState.selectedId = elements[elements.length - 1].id
  }

  notify()
}

export function removeElement(id) {
  editorState.elements = editorState.elements.filter(
    (element) => element.id !== id,
  )

  if (editorState.selectedId === id) {
    editorState.selectedId = null
  }

  notify()
}

export function clearElements() {
  editorState.elements = []
  editorState.selectedId = null
  notify()
}

// ANALYSIS
export function removeAnalysisElements(shouldNotify = true) {
  editorState.elements = editorState.elements.filter(
    (element) => element.source !== 'analysis',
  )

  const selectedStillExists = editorState.elements.some(
    (element) => element.id === editorState.selectedId,
  )

  if (!selectedStillExists) {
    editorState.selectedId = null
  }

  if (shouldNotify) notify()
}

// ELEMENT UPDATE
export function updateElement(id, changes, shouldNotify = true) {
  const element = editorState.elements.find((item) => item.id === id)

  if (!element) return

  Object.assign(element, changes)

  if (shouldNotify) notify()
}

// DISPLAY
export function updateDisplay(changes) {
  Object.assign(editorState.display, changes)
  notify()
}

// REFERENCE
export function updateReference(changes) {
  Object.assign(editorState.reference, changes)
  notify()
}

// VIEW
export function setViewScale(scale) {
  const numericScale = Number(scale)

  if (!Number.isFinite(numericScale)) return

  editorState.view.scale = Math.max(
    0.1,
    Math.min(8, numericScale),
  )

  notify()
}

// GRID
export function setGridEnabled(enabled) {
  editorState.grid.enabled = Boolean(enabled)
  notify()
}

export function setSnapEnabled(enabled) {
  editorState.grid.snap = Boolean(enabled)
  notify()
}

// Initialize history with the initial editor state.
resetHistory()