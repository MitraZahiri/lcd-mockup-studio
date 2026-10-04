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

  overlay: {
    enabled: false,
    opacity: 0.4,
  },
}

const MAX_HISTORY = 100

const undoStack = []
const redoStack = []
let historyRestoring = false

export function safeClone(value) {
  try {
    return structuredClone(value)
  } catch {
    return JSON.parse(JSON.stringify(value, (key, val) => {
      if (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) return undefined
      if (typeof HTMLCanvasElement !== 'undefined' && val instanceof HTMLCanvasElement) return undefined
      if (typeof OffscreenCanvas !== 'undefined' && val instanceof OffscreenCanvas) return undefined
      return val
    }))
  }
}

function clone(value) {
  return safeClone(value)
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

// ELEMENT GENERATION & ID
export function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `element-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// DUPLICATE & CLIPBOARD
let clipboard = null

export function getClipboard() {
  return clipboard
}

export function duplicateElement(id = editorState.selectedId) {
  const element = editorState.elements.find((item) => item.id === id)
  if (!element) return null

  const clone = safeClone(element)
  clone.id = createId()
  const offset = 8

  clone.x = Math.max(0, Math.min(editorState.display.width - clone.width, clone.x + offset))
  clone.y = Math.max(0, Math.min(editorState.display.height - clone.height, clone.y + offset))

  if (clone.name) {
    clone.name = clone.name.includes('(Copy)') ? clone.name : `${clone.name} (Copy)`
  }

  editorState.elements.push(clone)
  editorState.selectedId = clone.id
  notify()
  return clone
}

export function copyElement(id = editorState.selectedId) {
  const element = editorState.elements.find((item) => item.id === id)
  if (!element) return null
  clipboard = safeClone(element)
  return clipboard
}

export function pasteElement() {
  if (!clipboard) return null
  const clone = safeClone(clipboard)
  clone.id = createId()
  const offset = 8

  clone.x = Math.max(0, Math.min(editorState.display.width - clone.width, clone.x + offset))
  clone.y = Math.max(0, Math.min(editorState.display.height - clone.height, clone.y + offset))

  // Offset clipboard so successive pastes cascade nicely across canvas
  clipboard.x = clone.x
  clipboard.y = clone.y

  if (clone.name) {
    clone.name = clone.name.includes('(Copy)') ? clone.name : `${clone.name} (Copy)`
  }

  editorState.elements.push(clone)
  editorState.selectedId = clone.id
  notify()
  return clone
}

// ALIGNMENT
export function alignElement(id = editorState.selectedId, alignment) {
  const element = editorState.elements.find((item) => item.id === id)
  if (!element) return

  const { width: dispWidth, height: dispHeight } = editorState.display

  switch (alignment) {
    case 'left':
      element.x = 0
      break
    case 'center':
      element.x = Math.max(0, Math.round((dispWidth - element.width) / 2))
      break
    case 'right':
      element.x = Math.max(0, dispWidth - element.width)
      break
    case 'top':
      element.y = 0
      break
    case 'middle':
      element.y = Math.max(0, Math.round((dispHeight - element.height) / 2))
      break
    case 'bottom':
      element.y = Math.max(0, dispHeight - element.height)
      break
    default:
      return
  }

  notify()
}

// DISTRIBUTION
export function distributeElements(axis = 'horizontal') {
  if (editorState.elements.length < 3) return

  const elements = [...editorState.elements]

  if (axis === 'horizontal') {
    elements.sort((a, b) => a.x - b.x)
    const first = elements[0]
    const last = elements[elements.length - 1]
    const minX = first.x
    const maxRight = last.x + last.width
    const totalSpan = maxRight - minX
    const totalElementWidth = elements.reduce((sum, el) => sum + el.width, 0)
    const availableSpace = totalSpan - totalElementWidth
    const gap = availableSpace / (elements.length - 1)

    let currentX = minX
    for (const el of elements) {
      el.x = Math.round(currentX)
      currentX += el.width + gap
    }
  } else if (axis === 'vertical') {
    elements.sort((a, b) => a.y - b.y)
    const first = elements[0]
    const last = elements[elements.length - 1]
    const minY = first.y
    const maxBottom = last.y + last.height
    const totalSpan = maxBottom - minY
    const totalElementHeight = elements.reduce((sum, el) => sum + el.height, 0)
    const availableSpace = totalSpan - totalElementHeight
    const gap = availableSpace / (elements.length - 1)

    let currentY = minY
    for (const el of elements) {
      el.y = Math.round(currentY)
      currentY += el.height + gap
    }
  }

  notify()
}

// LAYER REORDERING (Z-INDEX)
export function reorderElement(id = editorState.selectedId, direction) {
  const index = editorState.elements.findIndex((item) => item.id === id)
  if (index === -1) return

  const elements = editorState.elements
  const element = elements[index]

  if (direction === 'up' && index < elements.length - 1) {
    elements[index] = elements[index + 1]
    elements[index + 1] = element
  } else if (direction === 'down' && index > 0) {
    elements[index] = elements[index - 1]
    elements[index - 1] = element
  } else if (direction === 'front') {
    elements.splice(index, 1)
    elements.push(element)
  } else if (direction === 'back') {
    elements.splice(index, 1)
    elements.unshift(element)
  } else {
    return
  }

  notify()
}

// OVERLAY (REFERENCE COMPARISON)
export function setOverlayEnabled(enabled) {
  editorState.overlay.enabled = Boolean(enabled)
  notify()
}

export function setOverlayOpacity(opacity) {
  const val = Number(opacity)
  if (Number.isFinite(val)) {
    editorState.overlay.opacity = Math.max(0, Math.min(1, val))
    notify()
  }
}

// LCD COLOR PRESETS
export const LCD_PRESETS = {
  'emerald': { name: 'Dark Emerald', background: '#18211b', color: '#a8d9a8', fill: '#324638' },
  'nokia': { name: 'Nokia 5110 Matrix', background: '#c4d5b6', color: '#222b1d', fill: '#8fa77e' },
  'stn-blue': { name: 'Blue STN LCD', background: '#002277', color: '#ffffff', fill: '#0033aa' },
  'amber': { name: 'Industrial Amber', background: '#141006', color: '#ffaa00', fill: '#3a2705' },
  'oled-cyan': { name: 'OLED Cyan', background: '#000810', color: '#00e5ff', fill: '#002b3d' },
  'gray-lcd': { name: 'Classic Gray LCD', background: '#9aa89a', color: '#1a201c', fill: '#738273' },
}

export function applyLcdPreset(presetKey) {
  const preset = LCD_PRESETS[presetKey]
  if (!preset) return

  editorState.display.background = preset.background
  notify()
}

// HARDWARE DISPLAY PRESETS
export const HARDWARE_PRESETS = {
  'ssd1306-128x64': {
    name: 'SSD1306 128×64 (0.96" OLED)',
    width: 128,
    height: 64,
    colorPreset: 'oled-cyan',
  },
  'ssd1306-128x32': {
    name: 'SSD1306 128×32 (0.91" OLED)',
    width: 128,
    height: 32,
    colorPreset: 'oled-cyan',
  },
  'st7920-128x64': {
    name: 'ST7920 128×64 (Graphic LCD)',
    width: 128,
    height: 64,
    colorPreset: 'stn-blue',
  },
  'nokia-84x48': {
    name: 'PCD8544 84×48 (Nokia 5110)',
    width: 84,
    height: 48,
    colorPreset: 'nokia',
  },
  'hd44780-16x2': {
    name: 'HD44780 16×2 (Character LCD)',
    width: 160,
    height: 32,
    colorPreset: 'stn-blue',
  },
  'st7789-240x240': {
    name: 'ST7789 240×240 (Square IPS)',
    width: 240,
    height: 240,
    colorPreset: 'emerald',
  },
}

export function applyHardwarePreset(presetKey) {
  const preset = HARDWARE_PRESETS[presetKey]
  if (!preset) return

  editorState.display.width = preset.width
  editorState.display.height = preset.height
  if (preset.colorPreset && LCD_PRESETS[preset.colorPreset]) {
    editorState.display.background = LCD_PRESETS[preset.colorPreset].background
  }
  recordHistory()
  notify()
}

// Initialize history with the initial editor state.
resetHistory()