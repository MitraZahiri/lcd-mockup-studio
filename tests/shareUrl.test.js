import test from 'node:test'
import assert from 'node:assert/strict'
import { encodeProjectToUrl, decodeProjectFromUrl } from '../src/project/shareUrl.js'

test('encodeProjectToUrl and decodeProjectFromUrl performs lossless compression round-trip', async () => {
  const original = {
    display: {
      width: 128,
      height: 64,
      background: '#000810',
    },
    elements: [
      {
        id: 'title_1',
        type: 'text',
        x: 10,
        y: 8,
        width: 90,
        height: 12,
        content: 'SYS READY',
        fontSize: 12,
        color: '#00e5ff',
      },
      {
        id: 'rect_1',
        type: 'rectangle',
        x: 0,
        y: 0,
        width: 128,
        height: 64,
        stroke: '#00e5ff',
        strokeWidth: 1,
      },
      {
        id: 'bat_1',
        type: 'symbol',
        symbolSubtype: 'battery',
        x: 104,
        y: 6,
        width: 18,
        height: 9,
        value: 80,
        max: 100,
      },
    ],
  }

  const encoded = await encodeProjectToUrl(original)
  assert.ok(typeof encoded === 'string')
  assert.ok(encoded.length > 10)
  // Ensure it's URL safe (no +, no /, no =)
  assert.ok(!encoded.includes('+'))
  assert.ok(!encoded.includes('/'))
  assert.ok(!encoded.includes('='))

  const decoded = await decodeProjectFromUrl(encoded)
  assert.equal(decoded.display.width, 128)
  assert.equal(decoded.display.height, 64)
  assert.equal(decoded.display.background, '#000810')
  assert.equal(decoded.elements.length, 3)

  assert.equal(decoded.elements[0].content, 'SYS READY')
  assert.equal(decoded.elements[0].fontSize, 12)
  assert.equal(decoded.elements[1].type, 'rectangle')
  assert.equal(decoded.elements[2].symbolSubtype, 'battery')
  assert.equal(decoded.elements[2].value, 80)
})

test('decodeProjectFromUrl handles #p= prefix and empty inputs gracefully', async () => {
  assert.equal(await decodeProjectFromUrl(''), null)
  assert.equal(await decodeProjectFromUrl(null), null)

  const original = {
    display: { width: 84, height: 48, background: '#c4d5b6' },
    elements: [{ id: 't', type: 'text', x: 2, y: 4, width: 40, height: 10, content: 'NOKIA' }],
  }

  const hash = await encodeProjectToUrl(original)
  const decoded = await decodeProjectFromUrl('#p=' + hash)
  assert.equal(decoded.display.width, 84)
  assert.equal(decoded.elements[0].content, 'NOKIA')
})
