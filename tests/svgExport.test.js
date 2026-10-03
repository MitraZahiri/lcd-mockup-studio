import test from 'node:test'
import assert from 'node:assert/strict'
import { renderProjectSvg, escapeXml, validateExportSize } from '../src/export/svgExport.js'

function sampleProject() {
  return {
    display: { width: 249, height: 128, background: '#18211b' },
    elements: [
      {
        id: 'title',
        type: 'text',
        name: 'Title',
        text: 'STATUS: OK & READY',
        x: 10,
        y: 15,
        width: 150,
        height: 18,
        fontSize: 12,
        fontFamily: 'monospace',
        fontWeight: 700,
        color: '#a8d9a8',
      },
      {
        id: 'box',
        type: 'rectangle',
        name: 'Frame',
        x: 5,
        y: 40,
        width: 80,
        height: 30,
        fill: '#324638',
        stroke: '#a8d9a8',
        strokeWidth: 2,
      },
      {
        id: 'dot',
        type: 'circle',
        name: 'LED',
        x: 100,
        y: 45,
        width: 20,
        height: 20,
        fill: '#a8d9a8',
        stroke: '#ffffff',
        strokeWidth: 1,
      },
      {
        id: 'divider',
        type: 'line',
        name: 'Line',
        x: 0,
        y: 90,
        width: 249,
        height: 2,
        strokeWidth: 2,
        color: '#a8d9a8',
      },
    ],
  }
}

test('renderProjectSvg generates valid SVG containing root attributes and background', () => {
  const svg = renderProjectSvg(sampleProject())
  assert.match(svg, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
  assert.match(svg, /viewBox="0 0 249 128"/)
  assert.match(svg, /width="249" height="128"/)
  assert.match(svg, /<rect width="249" height="128" fill="#18211b"/)
})

test('renderProjectSvg escapes XML characters in text and attributes', () => {
  const svg = renderProjectSvg(sampleProject())
  assert.match(svg, /STATUS: OK &amp; READY/)
  assert.doesNotMatch(svg, /STATUS: OK & READY/)
  assert.equal(escapeXml('<foo & "bar">'), '&lt;foo &amp; &quot;bar&quot;&gt;')
})

test('renderProjectSvg renders rectangle, circle, line and text clip paths', () => {
  const svg = renderProjectSvg(sampleProject())
  assert.match(svg, /<clipPath id="clip-title">/)
  assert.match(svg, /<rect x="6" y="41" width="78" height="28" fill="#324638" stroke="#a8d9a8" stroke-width="2"/)
  assert.match(svg, /<ellipse cx="110" cy="55" rx="9\.5" ry="9\.5" fill="#a8d9a8" stroke="#ffffff" stroke-width="1"/)
  assert.match(svg, /<rect x="0" y="90" width="249" height="2" fill="#a8d9a8"/)
})

test('renderProjectSvg rejects invalid or out-of-range dimensions', () => {
  assert.throws(() => validateExportSize(0, 100))
  assert.throws(() => validateExportSize(-5, 100))
  assert.throws(() => validateExportSize(20000, 100))
  assert.throws(() => validateExportSize(1.5, 100))
})
