import test from 'node:test'
import assert from 'node:assert/strict'
import { LCD_SAMPLES } from '../src/reference/samples.js'

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
