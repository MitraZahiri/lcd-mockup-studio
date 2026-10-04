import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProject, snapshotProject, validateProject } from '../src/project/projectFormat.js'
import { editorState, notify } from '../src/editor/state.js'
import { initProjectControls } from '../src/project/projectControls.js'

function project() {
  return {
    format: 'lcd-mockup-studio', version: 1, name: 'Mitra LCD',
    display: { width: 249, height: 128, background: '#18211b' },
    grid: { enabled: true, snap: false, size: 1 }, reference: null,
    elements: [
      { id: 'text', type: 'text', name: 'OCR text', text: 'Sıcaklık 23°C',
        x: 5, y: 10, width: 120, height: 14, fontFamily: 'monospace',
        fontSize: 12, fontWeight: 700, color: '#a8d9a8', source: 'analysis', confidence: 87 },
      { id: 'rect', type: 'rectangle', name: 'Rectangle', x: 0, y: 40,
        width: 40, height: 20, fill: '#324638', stroke: '#a8d9a8', strokeWidth: 2 },
      { id: 'circle', type: 'circle', name: 'Circle', x: 80, y: 40,
        width: 20, height: 20, fill: 'transparent', stroke: '#a8d9a8', strokeWidth: 1 },
      { id: 'line', type: 'line', name: 'Line', x: 2, y: 90,
        width: 150, height: 3, color: '#a8d9a8', strokeWidth: 1 },
    ],
  }
}

test('JSON round trip preserves text, all element types, order, grid and OCR metadata', () => {
  assert.deepEqual(parseProject(JSON.stringify(project())), project())
})

test('validateProject supports bitmap element with dither settings', () => {
  const p = project()
  p.elements.push({
    id: 'bmp_1',
    type: 'bitmap',
    name: 'Dithered Avatar',
    x: 10,
    y: 10,
    width: 64,
    height: 64,
    dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    ditherMethod: 'atkinson',
    contrast: 20,
    brightness: 0,
    threshold: 128,
    invert: false,
  })
  const roundtripped = parseProject(JSON.stringify(p))
  assert.equal(roundtripped.elements[4].type, 'bitmap')
  assert.equal(roundtripped.elements[4].ditherMethod, 'atkinson')
})

test('current OCR string font weights and display metadata survive save/load', () => {
  const p = project()
  Object.assign(p.elements[0], { fontWeight: '400', textAlign: 'left', opacity: 1, rotation: 0 })
  assert.deepEqual(parseProject(JSON.stringify(p)), p)
})

test('snapshot is independent of subsequent edits and excludes selection and zoom', () => {
  const state = { ...project(), reference: { src: null }, selectedId: 'text', view: { scale: 4 } }
  const snapshot = snapshotProject(state, 'Before')
  state.elements[0].text = 'After'
  assert.equal(snapshot.elements[0].text, 'Sıcaklık 23°C')
  assert.equal(snapshot.view, undefined)
  assert.equal(snapshot.selectedId, undefined)
})

test('rejects corrupt, unsupported and invalid project input', () => {
  assert.throws(() => parseProject('{'))
  for (const change of [
    p => { p.version = 99 },
    p => { p.display.width = 0 },
    p => { p.elements[0].x = Infinity },
    p => { p.elements[1].id = p.elements[0].id },
    p => { p.elements[0].type = 'script' },
    p => { p.elements[0].color = 'url(https://example.com)' },
    p => { p.reference = { src: 'https://example.com/image.png' } },
  ]) {
    const p = project(); change(p)
    assert.throws(() => validateProject(p))
  }
})

test('portable reference is preserved, unknown properties are excluded', () => {
  const p = project()
  p.reference = { src: 'data:image/png;base64,AAAA', fileName: 'reference.png', naturalWidth: 1, naturalHeight: 1 }
  p.elements[0].onclick = 'unexpected'
  const result = validateProject(p)
  assert.deepEqual(result.reference, p.reference)
  assert.equal(result.elements[0].onclick, undefined)
})

test('open is atomic, cancelled replacement preserves edits, new resets and save downloads JSON', async () => {
  const nodes = new Map()
  function node() {
    return { handlers: {}, textContent: '', value: '', disabled: false,
      addEventListener(event, handler) { this.handlers[event] = handler },
      click() {}, remove() {}, }
  }
  let download
  globalThis.document = {
    querySelector(selector) { if (!nodes.has(selector)) nodes.set(selector, node()); return nodes.get(selector) },
    createElement() { download = node(); return download }, body: { appendChild() {} },
  }
  let confirmed = true
  const alerts = []
  const listeners = {}
  globalThis.window = {
    confirm: () => confirmed, alert: message => alerts.push(message), prompt: () => 'Saved LCD',
    addEventListener(event, handler) { listeners[event] = handler },
  }
  globalThis.requestAnimationFrame = callback => callback()
  const oldImage = globalThis.Image
  globalThis.Image = class { set src(value) { queueMicrotask(() => this.onerror()) } }
  let analyzing = false
  initProjectControls({ refreshReference() {}, fitWorkspace() {}, isAnalyzing: () => analyzing })
  const input = nodes.get('#project-file-input')
  async function open(value) {
    input.files = [{ size: 100, text: async () => value }]
    await input.handlers.change()
  }
  editorState.elements = project().elements
  notify()
  const before = JSON.stringify(editorState)
  await open('{broken')
  assert.equal(JSON.stringify(editorState), before)
  assert.equal(alerts.length, 1)
  const damaged = project()
  damaged.reference = { src: 'data:image/png;base64,AAAA', fileName: 'bad.png', naturalWidth: 1, naturalHeight: 1 }
  await open(JSON.stringify(damaged))
  assert.equal(JSON.stringify(editorState), before)
  confirmed = false
  await open(JSON.stringify(project()))
  assert.equal(JSON.stringify(editorState), before)
  confirmed = true
  await open(JSON.stringify(project()))
  assert.equal(editorState.display.width, 249)
  assert.equal(nodes.get('#project-title').textContent, 'Mitra LCD')
  assert.equal(editorState.selectedId, null)
  analyzing = true
  nodes.get('#new-project').handlers.click()
  assert.equal(editorState.display.width, 249)
  analyzing = false
  await nodes.get('#save-project').handlers.click()
  assert.equal(download.download, 'Saved-LCD.lcd.json')
  const savedJson = await (await fetch(download.href)).text()
  assert.deepEqual(parseProject(savedJson), { ...project(), name: 'Saved LCD' })
  editorState.elements[0].text = 'Edited'
  notify()
  assert.match(nodes.get('#project-title').textContent, /\*$/)
  let prevented = false
  listeners.beforeunload({ preventDefault() { prevented = true } })
  assert.equal(prevented, true)
  nodes.get('#new-project').handlers.click()
  assert.equal(editorState.elements.length, 0)
  assert.equal(editorState.reference.src, null)
  assert.equal(editorState.display.width, 800)
  globalThis.Image = oldImage
})
