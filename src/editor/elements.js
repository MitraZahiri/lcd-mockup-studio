import { editorState, addElement, createId } from './state.js'

function getAdaptiveSize(preferredWidth, preferredHeight) {
  const width = Math.min(preferredWidth, Math.max(20, editorState.display.width * 0.5))
  const height = Math.min(preferredHeight, Math.max(10, editorState.display.height * 0.25))
  return { width: Math.round(width), height: Math.round(height) }
}

function getCenterPosition(width, height) {
  return {
    x: Math.max(0, Math.round((editorState.display.width - width) / 2)),
    y: Math.max(0, Math.round((editorState.display.height - height) / 2)),
  }
}

export function createElement(type) {
  let element = null

  if (type === 'text') {
    const size = getAdaptiveSize(220, 50)
    const position = getCenterPosition(size.width, size.height)
    const fontSize = Math.max(8, Math.min(28, Math.round(editorState.display.height * 0.08)))
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
  } else if (type === 'rectangle') {
    const size = getAdaptiveSize(180, 100)
    const position = getCenterPosition(size.width, size.height)
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
  } else if (type === 'circle') {
    const preferred = Math.min(100, editorState.display.width * 0.25, editorState.display.height * 0.4)
    const diameter = Math.max(20, Math.round(preferred))
    const position = getCenterPosition(diameter, diameter)
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
  } else if (type === 'line') {
    const size = getAdaptiveSize(180, 12)
    const position = getCenterPosition(size.width, size.height)
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
  } else if (type === 'icon') {
    const size = Math.max(16, Math.min(32, Math.round(editorState.display.height * 0.2)))
    const position = getCenterPosition(size, size)
    element = {
      id: createId(),
      type: 'text',
      name: 'Symbol Icon',
      x: position.x,
      y: position.y,
      width: size,
      height: size,
      text: '⚡',
      fontSize: Math.max(12, Math.round(size * 0.75)),
      fontFamily: 'Courier New',
      fontWeight: 700,
      color: '#a8d9a8',
    }
  }

  if (element) {
    addElement(element)
  }
}

export function createBitmapElementFromData(options = {}) {
  const { dataUrl, name = 'Logo', naturalWidth = 64, naturalHeight = 64, x, y } = options
  const dispW = editorState.display.width || 128
  const dispH = editorState.display.height || 64

  // Adaptive scale to fit comfortably within display (max 50% width and height)
  let targetW = naturalWidth
  let targetH = naturalHeight
  const maxW = Math.max(16, Math.round(dispW * 0.5))
  const maxH = Math.max(16, Math.round(dispH * 0.5))

  if (targetW > maxW || targetH > maxH) {
    const ratio = Math.min(maxW / targetW, maxH / targetH)
    targetW = Math.max(8, Math.round(targetW * ratio))
    targetH = Math.max(8, Math.round(targetH * ratio))
  }

  const posX = x !== undefined ? x : Math.max(0, Math.round((dispW - targetW) / 2))
  const posY = y !== undefined ? y : Math.max(0, Math.round((dispH - targetH) / 2))

  const element = {
    id: createId(),
    type: 'bitmap',
    name: name || 'Logo',
    x: posX,
    y: posY,
    width: targetW,
    height: targetH,
    dataUrl,
    opacity: 1,
  }

  addElement(element)
  return element
}

export function createElementFromAnalysis(data, shouldNotify = true) {
  const element = {
    ...data,
    id: createId(),
    type: data.type,
    name: data.name || data.type || 'Element',
    x: Math.round(data.x || 0),
    y: Math.round(data.y || 0),
    width: Math.max(1, Math.round(data.width || 20)),
    height: Math.max(1, Math.round(data.height || 10)),
  }

  addElement(element, shouldNotify)
  return element
}