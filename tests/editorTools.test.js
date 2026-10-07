import test from 'node:test'
import assert from 'node:assert/strict'
import {
  editorState,
  clearElements,
  addElement,
  duplicateElement,
  copyElement,
  pasteElement,
  alignElement,
  distributeElements,
  reorderElement,
  applyLcdPreset,
  setOverlayEnabled,
  setOverlayOpacity,
  LCD_PRESETS,
} from '../src/editor/state.js'
import {
  createElement,
  createBitmapElementFromData,
} from '../src/editor/elements.js'

function setupTestState() {
  clearElements()
  editorState.display.width = 300
  editorState.display.height = 200
  editorState.display.background = '#18211b'

  const el1 = {
    id: 'el-1',
    type: 'text',
    name: 'Text 1',
    x: 10,
    y: 20,
    width: 100,
    height: 30,
    text: 'HELLO',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 700,
    color: '#a8d9a8',
  }

  const el2 = {
    id: 'el-2',
    type: 'rectangle',
    name: 'Rect 2',
    x: 50,
    y: 60,
    width: 80,
    height: 40,
    fill: '#324638',
    stroke: '#a8d9a8',
    strokeWidth: 2,
  }

  addElement(el1, false)
  addElement(el2, false)
}

test('duplicateElement creates a new element with offset, unique id and selects it', () => {
  setupTestState()
  const duplicate = duplicateElement('el-1')

  assert.ok(duplicate)
  assert.notEqual(duplicate.id, 'el-1')
  assert.equal(duplicate.type, 'text')
  assert.equal(duplicate.text, 'HELLO')
  assert.equal(duplicate.x, 18) // 10 + 8 offset
  assert.equal(duplicate.y, 28) // 20 + 8 offset
  assert.equal(duplicate.name, 'Text 1 (Copy)')
  assert.equal(editorState.selectedId, duplicate.id)
  assert.equal(editorState.elements.length, 3)
})

test('copyElement and pasteElement replicates copied element and cascades', () => {
  setupTestState()
  const copied = copyElement('el-2')
  assert.ok(copied)
  assert.equal(copied.id, 'el-2')

  const pasted1 = pasteElement()
  assert.ok(pasted1)
  assert.notEqual(pasted1.id, 'el-2')
  assert.equal(pasted1.x, 58) // 50 + 8
  assert.equal(pasted1.y, 68) // 60 + 8

  const pasted2 = pasteElement()
  assert.ok(pasted2)
  assert.notEqual(pasted2.id, pasted1.id)
  assert.equal(pasted2.x, 66) // 58 + 8
  assert.equal(pasted2.y, 76) // 68 + 8
})

test('alignElement correctly aligns element to canvas boundaries and center', () => {
  setupTestState()
  // Display is 300x200, el-1 is 100x30
  alignElement('el-1', 'left')
  assert.equal(editorState.elements[0].x, 0)

  alignElement('el-1', 'center')
  assert.equal(editorState.elements[0].x, 100) // (300 - 100) / 2 = 100

  alignElement('el-1', 'right')
  assert.equal(editorState.elements[0].x, 200) // 300 - 100 = 200

  alignElement('el-1', 'top')
  assert.equal(editorState.elements[0].y, 0)

  alignElement('el-1', 'middle')
  assert.equal(editorState.elements[0].y, 85) // (200 - 30) / 2 = 85

  alignElement('el-1', 'bottom')
  assert.equal(editorState.elements[0].y, 170) // 200 - 30 = 170
})

test('reorderElement shifts layer order up, down, front and back', () => {
  setupTestState()
  // Initial order: [el-1, el-2]
  assert.equal(editorState.elements[0].id, 'el-1')
  assert.equal(editorState.elements[1].id, 'el-2')

  // Move el-1 up
  reorderElement('el-1', 'up')
  assert.equal(editorState.elements[0].id, 'el-2')
  assert.equal(editorState.elements[1].id, 'el-1')

  // Move el-1 down
  reorderElement('el-1', 'down')
  assert.equal(editorState.elements[0].id, 'el-1')
  assert.equal(editorState.elements[1].id, 'el-2')

  // Add 3rd element
  addElement({ id: 'el-3', type: 'line', name: 'Line', x: 0, y: 0, width: 50, height: 2, color: '#fff', strokeWidth: 1 }, false)
  // Current order: [el-1, el-2, el-3]
  reorderElement('el-1', 'front')
  assert.equal(editorState.elements[2].id, 'el-1')

  reorderElement('el-1', 'back')
  assert.equal(editorState.elements[0].id, 'el-1')
})

test('applyLcdPreset sets background to recognized theme', () => {
  setupTestState()
  applyLcdPreset('stn-blue')
  assert.equal(editorState.display.background, LCD_PRESETS['stn-blue'].background)

  applyLcdPreset('nokia')
  assert.equal(editorState.display.background, LCD_PRESETS['nokia'].background)
})

test('setOverlayEnabled and setOverlayOpacity controls comparison ghost overlay', () => {
  setOverlayEnabled(true)
  assert.equal(editorState.overlay.enabled, true)

  setOverlayOpacity(0.75)
  assert.equal(editorState.overlay.opacity, 0.75)

  // Clamp within 0..1
  setOverlayOpacity(1.5)
  assert.equal(editorState.overlay.opacity, 1)
  setOverlayOpacity(-0.5)
  assert.equal(editorState.overlay.opacity, 0)
})

test('distributeElements evenly spaces elements along horizontal and vertical axes', () => {
  setupTestState()
  // Add 3rd element so we have 3
  addElement({
    id: 'el-3',
    type: 'circle',
    name: 'Dot',
    x: 200,
    y: 120,
    width: 20,
    height: 20,
    fill: '#fff',
    stroke: '#fff',
    strokeWidth: 1,
  }, false)

  // Initial X positions: el-1 (x: 10, w: 100), el-2 (x: 50, w: 80), el-3 (x: 200, w: 20)
  // Sort order by x: el-1 (10), el-2 (50), el-3 (200)
  // minX = 10, maxRight = 220, totalSpan = 210
  // totalWidth = 100 + 80 + 20 = 200
  // space = 10, gaps = 2 => gap = 5
  // Expected X: el-1 = 10, el-2 = 10 + 100 + 5 = 115, el-3 = 115 + 80 + 5 = 200
  distributeElements('horizontal')

  const el1 = editorState.elements.find(e => e.id === 'el-1')
  const el2 = editorState.elements.find(e => e.id === 'el-2')
  const el3 = editorState.elements.find(e => e.id === 'el-3')

  assert.equal(el1.x, 10)
  assert.equal(el2.x, 115)
  assert.equal(el3.x, 200)
})

test('createBitmapElementFromData creates and adaptively scales custom image logo layer', () => {
  setupTestState()
  const el = createBitmapElementFromData({
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    name: 'CompanyLogo',
    naturalWidth: 400,
    naturalHeight: 300,
  })

  assert.equal(el.type, 'bitmap')
  assert.equal(el.name, 'CompanyLogo')
  // Display is 300x200, max width 150, max height 100.
  // 400x300 scaled down with ratio: max(150/400, 100/300) = 0.3333 => w: 133, h: 100
  assert.ok(el.width <= 150)
  assert.ok(el.height <= 100)
  assert.ok(editorState.elements.some(e => e.id === el.id))
})

test('createElement supports icon symbol element', () => {
  setupTestState()
  createElement('icon')
  const icon = editorState.elements[editorState.elements.length - 1]
  assert.equal(icon.type, 'text')
  assert.equal(icon.name, 'Symbol Icon')
  assert.equal(icon.text, '⚡')
})

