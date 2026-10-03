import test from 'node:test'
import assert from 'node:assert/strict'
import {
  sanitizeFontFamilyName,
  isValidFontFile,
  loadFontFromFile,
} from '../src/editor/customFonts.js'

test('sanitizeFontFamilyName cleans font filenames properly', () => {
  assert.equal(sanitizeFontFamilyName('PixelOperator8.ttf'), 'PixelOperator8')
  assert.equal(sanitizeFontFamilyName('VT-323_Matrix.woff2'), 'VT-323_Matrix')
  assert.equal(sanitizeFontFamilyName('My Cool Font (v1.2).otf'), 'My Cool Font v12')
  assert.equal(sanitizeFontFamilyName(''), 'CustomFont')
  assert.equal(sanitizeFontFamilyName(null), 'CustomFont')
})

test('isValidFontFile accepts ttf, otf, woff and woff2 and rejects others', () => {
  assert.equal(isValidFontFile({ name: 'font.ttf' }), true)
  assert.equal(isValidFontFile({ name: 'font.OTF' }), true)
  assert.equal(isValidFontFile({ name: 'font.woff' }), true)
  assert.equal(isValidFontFile({ name: 'font.woff2' }), true)

  assert.equal(isValidFontFile({ name: 'font.png' }), false)
  assert.equal(isValidFontFile({ name: 'font.exe' }), false)
  assert.equal(isValidFontFile(null), false)
  assert.equal(isValidFontFile({}), false)
})

test('loadFontFromFile rejects invalid font file extensions cleanly', async () => {
  await assert.rejects(
    () => loadFontFromFile({ name: 'script.js' }),
    { message: /Unsupported font format/ }
  )
})
