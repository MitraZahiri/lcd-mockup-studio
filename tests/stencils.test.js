import test from 'node:test'
import assert from 'node:assert/strict'
import {
  generateBatteryStencil,
  generateProgressBarStencil,
  generateStatusBadgeStencil,
  generateNumericGaugeStencil,
  insertStencil,
} from '../src/editor/stencils.js'
import { validateProject } from '../src/project/projectFormat.js'
import { editorState, clearElements } from '../src/editor/state.js'

test('generateBatteryStencil produces valid project elements', () => {
  const elements = generateBatteryStencil({ x: 10, y: 10, width: 60, height: 28, level: 3 })
  assert.equal(elements.length, 5) // frame + anode + 3 bars

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Test Project',
    display: editorState.display,
    grid: { enabled: true, snap: true, size: 8 },
    elements,
  }
  const validated = validateProject(project)
  assert.equal(validated.elements.length, 5)
})

test('generateProgressBarStencil produces frame, fill bar and label', () => {
  const elements = generateProgressBarStencil({ x: 20, y: 30, width: 150, height: 20, percent: 50 })
  assert.equal(elements.length, 3)

  const frame = elements.find(e => e.name === 'Progress Frame')
  const fill = elements.find(e => e.name === 'Progress Fill')
  const label = elements.find(e => e.name === 'Progress Label')

  assert.ok(frame && fill && label)
  assert.equal(label.text, '50%')

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Test Project',
    display: editorState.display,
    grid: { enabled: true, snap: true, size: 8 },
    elements,
  }
  const validated = validateProject(project)
  assert.equal(validated.elements.length, 3)
})

test('generateStatusBadgeStencil produces box and centered label', () => {
  const elements = generateStatusBadgeStencil({ x: 40, y: 50, label: 'SYSTEM_OK' })
  assert.equal(elements.length, 2)
  assert.equal(elements[1].text, 'SYSTEM_OK')

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Test Project',
    display: editorState.display,
    grid: { enabled: true, snap: true, size: 8 },
    elements,
  }
  const validated = validateProject(project)
  assert.equal(validated.elements.length, 2)
})

test('generateNumericGaugeStencil produces card, header, value and unit', () => {
  const elements = generateNumericGaugeStencil({
    x: 0,
    y: 0,
    label: 'PRESSURE',
    value: '101.3',
    unit: 'kPa',
  })
  assert.equal(elements.length, 4)

  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Test Project',
    display: editorState.display,
    grid: { enabled: true, snap: true, size: 8 },
    elements,
  }
  const validated = validateProject(project)
  assert.equal(validated.elements.length, 4)
})

test('insertStencil adds elements to state in one atomic batch', () => {
  clearElements()
  const initialCount = editorState.elements.length
  assert.equal(initialCount, 0)

  const elements = insertStencil('battery')
  assert.ok(elements.length >= 2)
  assert.equal(editorState.elements.length, elements.length)
  assert.equal(editorState.selectedId, elements[elements.length - 1].id)
})
