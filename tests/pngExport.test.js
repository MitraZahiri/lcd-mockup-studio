import test from 'node:test'
import assert from 'node:assert/strict'
import { createPngBlob, renderProjectCanvas, validateExportSize } from '../src/export/pngExport.js'

function fakeCanvas() {
  const calls = []
  const context = { measureText: () => ({ fontBoundingBoxAscent: 9, fontBoundingBoxDescent: 3 }) }
  for (const method of ['save', 'restore', 'beginPath', 'rect', 'ellipse', 'moveTo', 'clip', 'fill', 'fillRect', 'fillText']) {
    context[method] = (...args) => calls.push([method, ...args])
  }
  return { calls, context, getContext: () => context,
    toBlob(callback, type) { callback(new Blob(['png'], { type })) } }
}

const project = () => ({
  display: { width: 249, height: 128, background: '#18211b' },
  view: { scale: 4 }, grid: { enabled: true, size: 10 },
  selectedId: 'text', reference: { src: 'do-not-render' },
  elements: [
    { id: 'text', type: 'text', text: '  LCD\n  23°C ', x: 5, y: 10, width: 60, height: 14,
      fontFamily: 'monospace', fontSize: 12, fontWeight: '400', color: '#a8d9a8' },
    { type: 'rectangle', x: 5, y: 40, width: 50, height: 30,
      fill: 'transparent', stroke: '#a8d9a8', strokeWidth: 2 },
    { type: 'circle', x: 70, y: 40, width: 30, height: 20,
      fill: '#324638', stroke: '#a8d9a8', strokeWidth: 1 },
    { type: 'line', x: 0, y: 90, width: 200, height: 10, color: '#a8d9a8', strokeWidth: 2 },
  ],
})

test('uses logical dimensions, layer order and text clipping without editor overlays', () => {
  const canvas = fakeCanvas()
  const state = project()
  const before = structuredClone(state)
  renderProjectCanvas(state, canvas)
  assert.equal(canvas.width, 249)
  assert.equal(canvas.height, 128)
  assert.deepEqual(canvas.calls[0], ['fillRect', 0, 0, 249, 128])
  const textIndex = canvas.calls.findIndex(call => call[0] === 'fillText')
  assert.deepEqual(canvas.calls[textIndex], ['fillText', 'LCD 23°C', 5, 20])
  assert.ok(canvas.calls.slice(0, textIndex).some(call => call[0] === 'clip'))
  assert.ok(canvas.calls.slice(textIndex).some(call => call[0] === 'ellipse'))
  assert.ok(canvas.calls.some(call => JSON.stringify(call) === JSON.stringify(['fillRect', 0, 94, 200, 2])))
  assert.equal(canvas.calls.filter(call => call[0] === 'save').length, 4)
  assert.deepEqual(state, before)
})

test('rejects invalid or excessive dimensions before allocating a bitmap', () => {
  for (const dimensions of [[0, 100], [1.5, 100], [Infinity, 10], [16385, 1], [8192, 8192]]) {
    assert.throws(() => validateExportSize(...dimensions))
  }
  assert.doesNotThrow(() => validateExportSize(800, 480))
})

test('font loading uses a snapshot and blob failures reject cleanly', async () => {
  const state = project()
  const canvas = fakeCanvas()
  globalThis.document = {
    fonts: { async load() { state.elements[0].text = 'Later edit'; state.display.width = 800 } },
    createElement: () => canvas,
  }
  const result = await createPngBlob(state)
  assert.equal(result.width, 249)
  assert.equal(result.blob.type, 'image/png')
  assert.equal(canvas.calls.find(call => call[0] === 'fillText')[1], 'LCD 23°C')
  canvas.toBlob = callback => callback(null)
  await assert.rejects(createPngBlob(state), /could not generate/)
})
