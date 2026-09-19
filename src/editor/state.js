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

const listeners = new Set()

export function subscribe(listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export function notify() {
  listeners.forEach((listener) => {
    listener(editorState)
  })
}

export function getSelectedElement() {
  return (
    editorState.elements.find(
      (element) =>
        element.id === editorState.selectedId,
    ) || null
  )
}

export function selectElement(id) {
  editorState.selectedId = id
  notify()
}

export function addElement(element) {
  editorState.elements.push(element)
  editorState.selectedId = element.id
  notify()
}

export function removeElement(id) {
  editorState.elements =
    editorState.elements.filter(
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

export function updateElement(
  id,
  changes,
  shouldNotify = true,
) {
  const element =
    editorState.elements.find(
      (item) => item.id === id,
    )

  if (!element) return

  Object.assign(element, changes)

  if (shouldNotify) {
    notify()
  }
}

export function updateDisplay(changes) {
  Object.assign(
    editorState.display,
    changes,
  )

  notify()
}

export function updateReference(changes) {
  Object.assign(
    editorState.reference,
    changes,
  )

  notify()
}

export function setViewScale(scale) {
  editorState.view.scale =
    Math.max(0.1, Math.min(8, scale))

  notify()
}

export function setGridEnabled(enabled) {
  editorState.grid.enabled = enabled
  notify()
}

export function setSnapEnabled(enabled) {
  editorState.grid.snap = enabled
  notify()
}