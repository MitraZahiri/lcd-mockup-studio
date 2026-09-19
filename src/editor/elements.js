import {
  editorState,
  addElement,
} from './state.js'

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `element-${Date.now()}-${Math.random()}`
}

function centerPosition(width, height) {
  return {
    x: Math.round((editorState.display.width - width) / 2),
    y: Math.round((editorState.display.height - height) / 2),
  }
}

export function createElement(type) {
  let element

  if (type === 'text') {
    const position = centerPosition(220, 50)

    element = {
      id: createId(),
      type: 'text',
      name: 'Text',
      x: position.x,
      y: position.y,
      width: 220,
      height: 50,

      text: 'NEW TEXT',

      fontSize: 28,
      fontFamily: 'Courier New',
      fontWeight: 700,

      color: '#a8d9a8',
    }
  }

  if (type === 'rectangle') {
    const position = centerPosition(180, 100)

    element = {
      id: createId(),
      type: 'rectangle',
      name: 'Rectangle',

      x: position.x,
      y: position.y,

      width: 180,
      height: 100,

      fill: '#324638',
      stroke: '#a8d9a8',
      strokeWidth: 2,
    }
  }

  if (type === 'circle') {
    const position = centerPosition(100, 100)

    element = {
      id: createId(),
      type: 'circle',
      name: 'Circle',

      x: position.x,
      y: position.y,

      width: 100,
      height: 100,

      fill: 'transparent',
      stroke: '#a8d9a8',
      strokeWidth: 3,
    }
  }

  if (type === 'line') {
    const position = centerPosition(180, 20)

    element = {
      id: createId(),
      type: 'line',
      name: 'Line',

      x: position.x,
      y: position.y,

      width: 180,
      height: 20,

      color: '#a8d9a8',
      strokeWidth: 3,
    }
  }

  if (!element) {
    return
  }

  addElement(element)
}