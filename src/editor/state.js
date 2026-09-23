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


// ======================================================
// SUBSCRIBERS
// ======================================================

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


// ======================================================
// SELECTION
// ======================================================

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


// ======================================================
// ELEMENTS
// ======================================================

export function addElement(
  element,
  shouldNotify = true,
) {
  editorState.elements.push(element)

  editorState.selectedId =
    element.id

  if (shouldNotify) {
    notify()
  }
}


export function addElements(elements) {
  if (!Array.isArray(elements)) {
    return
  }

  editorState.elements.push(
    ...elements,
  )

  if (elements.length > 0) {
    editorState.selectedId =
      elements[
        elements.length - 1
      ].id
  }

  notify()
}


export function removeElement(id) {
  editorState.elements =
    editorState.elements.filter(
      (element) =>
        element.id !== id,
    )

  if (
    editorState.selectedId === id
  ) {
    editorState.selectedId = null
  }

  notify()
}


export function clearElements() {
  editorState.elements = []

  editorState.selectedId = null

  notify()
}


// ======================================================
// ANALYSIS ELEMENTS
// ======================================================

export function removeAnalysisElements(
  shouldNotify = true,
) {
  editorState.elements =
    editorState.elements.filter(
      (element) =>
        element.source !== 'analysis',
    )

  const selectedStillExists =
    editorState.elements.some(
      (element) =>
        element.id ===
        editorState.selectedId,
    )

  if (!selectedStillExists) {
    editorState.selectedId = null
  }

  if (shouldNotify) {
    notify()
  }
}


// ======================================================
// ELEMENT UPDATE
// ======================================================

export function updateElement(
  id,
  changes,
  shouldNotify = true,
) {
  const element =
    editorState.elements.find(
      (item) =>
        item.id === id,
    )

  if (!element) {
    return
  }

  Object.assign(
    element,
    changes,
  )

  if (shouldNotify) {
    notify()
  }
}


// ======================================================
// DISPLAY
// ======================================================

export function updateDisplay(
  changes,
) {
  Object.assign(
    editorState.display,
    changes,
  )

  notify()
}


// ======================================================
// REFERENCE
// ======================================================

export function updateReference(
  changes,
) {
  Object.assign(
    editorState.reference,
    changes,
  )

  notify()
}


// ======================================================
// VIEW
// ======================================================

export function setViewScale(
  scale,
) {
  const numericScale =
    Number(scale)

  if (
    !Number.isFinite(
      numericScale,
    )
  ) {
    return
  }

  editorState.view.scale =
    Math.max(
      0.1,
      Math.min(
        8,
        numericScale,
      ),
    )

  notify()
}


// ======================================================
// GRID
// ======================================================

export function setGridEnabled(
  enabled,
) {
  editorState.grid.enabled =
    Boolean(enabled)

  notify()
}


export function setSnapEnabled(
  enabled,
) {
  editorState.grid.snap =
    Boolean(enabled)

  notify()
}