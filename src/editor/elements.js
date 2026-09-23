import {
  editorState,
  addElement,
} from './state.js'

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `element-${Date.now()}-${Math.random()}`
}

function getAdaptiveSize(
  preferredWidth,
  preferredHeight,
) {
  const width = Math.min(
    preferredWidth,
    Math.max(
      20,
      editorState.display.width * 0.5,
    ),
  )

  const height = Math.min(
    preferredHeight,
    Math.max(
      10,
      editorState.display.height * 0.25,
    ),
  )

  return {
    width: Math.round(width),
    height: Math.round(height),
  }
}

function getCenterPosition(width, height) {
  return {
    x: Math.max(
      0,
      Math.round(
        (editorState.display.width - width) / 2,
      ),
    ),

    y: Math.max(
      0,
      Math.round(
        (editorState.display.height - height) / 2,
      ),
    ),
  }
}

export function createElement(type) {
  let element = null

  if (type === 'text') {
    const size =
      getAdaptiveSize(220, 50)

    const position =
      getCenterPosition(
        size.width,
        size.height,
      )

    const fontSize = Math.max(
      8,
      Math.min(
        28,
        Math.round(
          editorState.display.height * 0.08,
        ),
      ),
    )

    element = {
      id: createId(),
      type: 'text',
      name: 'Text',

      x: position.x,
      y: position.y,

      width: size.width,
      height: size.height,

      text: 'NEW TEXT',

      fontSize,
      fontFamily: 'Courier New',
      fontWeight: 700,

      color: '#a8d9a8',
    }
  }

  if (type === 'rectangle') {
    const size =
      getAdaptiveSize(180, 100)

    const position =
      getCenterPosition(
        size.width,
        size.height,
      )

    element = {
      id: createId(),
      type: 'rectangle',
      name: 'Rectangle',

      x: position.x,
      y: position.y,

      width: size.width,
      height: size.height,

      fill: '#324638',
      stroke: '#a8d9a8',
      strokeWidth: 2,
    }
  }

  if (type === 'circle') {
    const preferred = Math.min(
      100,
      editorState.display.width * 0.25,
      editorState.display.height * 0.4,
    )

    const diameter =
      Math.max(
        20,
        Math.round(preferred),
      )

    const position =
      getCenterPosition(
        diameter,
        diameter,
      )

    element = {
      id: createId(),
      type: 'circle',
      name: 'Circle',

      x: position.x,
      y: position.y,

      width: diameter,
      height: diameter,

      fill: 'transparent',
      stroke: '#a8d9a8',
      strokeWidth: 2,
    }
  }

  if (type === 'line') {
    const size =
      getAdaptiveSize(180, 12)

    const position =
      getCenterPosition(
        size.width,
        size.height,
      )

    element = {
      id: createId(),
      type: 'line',
      name: 'Line',

      x: position.x,
      y: position.y,

      width: size.width,
      height: size.height,

      color: '#a8d9a8',
      strokeWidth: 2,
    }
  }

  if (!element) {
    return
  }

  addElement(element)
}

export function createElementFromAnalysis(data) {
  const element = {
    id: createId(),

    type: data.type,
    name:
      data.name ||
      data.type ||
      'Element',

    x: Math.round(data.x || 0),
    y: Math.round(data.y || 0),

    width: Math.max(
      1,
      Math.round(data.width || 20),
    ),

    height: Math.max(
      1,
      Math.round(data.height || 10),
    ),

    ...data,
  }

  element.id = createId()

  addElement(element)

  return element
}