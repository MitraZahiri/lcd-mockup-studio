import test from 'node:test'
import assert from 'node:assert/strict'
import { LCD_SAMPLES } from '../src/reference/samples.js'
import { HARDWARE_PRESETS, applyHardwarePreset, editorState } from '../src/editor/state.js'

test('LCD_SAMPLES exports valid predefined demonstration displays', () => {
  assert.ok(Array.isArray(LCD_SAMPLES))
  assert.ok(LCD_SAMPLES.length >= 3)

  for (const sample of LCD_SAMPLES) {
    assert.ok(typeof sample.id === 'string' && sample.id.length > 0)
    assert.ok(typeof sample.title === 'string' && sample.title.length > 0)
    assert.ok(typeof sample.subtitle === 'string' && sample.subtitle.length > 0)
    assert.ok(typeof sample.url === 'string' && sample.url.includes('.png'))
  }
})

test('HARDWARE_PRESETS defines valid maker displays and applyHardwarePreset updates state', () => {
  assert.ok(typeof HARDWARE_PRESETS === 'object')
  const keys = Object.keys(HARDWARE_PRESETS)
  assert.ok(keys.length >= 5)

  for (const key of keys) {
    const preset = HARDWARE_PRESETS[key]
    assert.ok(typeof preset.name === 'string')
    assert.ok(Number.isInteger(preset.width) && preset.width > 0)
    assert.ok(Number.isInteger(preset.height) && preset.height > 0)
  }

  applyHardwarePreset('ssd1306-128x64')
  assert.equal(editorState.display.width, 128)
  assert.equal(editorState.display.height, 64)
  assert.equal(editorState.display.background, '#000810')

  applyHardwarePreset('st7920-128x64')
  assert.equal(editorState.display.width, 128)
  assert.equal(editorState.display.height, 64)
  assert.equal(editorState.display.background, '#002277')
})

