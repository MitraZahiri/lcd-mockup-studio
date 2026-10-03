import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateResize } from '../src/editor/resize.js'

test('calculateResize handles right (e) and bottom (s) enlargement', () => {
  const start = { x: 50, y: 50, width: 100, height: 60 }
  const result = calculateResize('se', start, { x: 20, y: 15 }, {
    displayWidth: 300,
    displayHeight: 200,
  })

  assert.deepEqual(result, {
    x: 50,
    y: 50,
    width: 120,
    height: 75,
  })
})

test('calculateResize handles left (w) and top (n) movement without moving opposite edge', () => {
  const start = { x: 50, y: 50, width: 100, height: 60 }
  const result = calculateResize('nw', start, { x: 10, y: 10 }, {
    displayWidth: 300,
    displayHeight: 200,
  })

  // Moving nw by +10 shrinks box from top-left: x becomes 60, width 90; y becomes 60, height 50
  assert.deepEqual(result, {
    x: 60,
    y: 60,
    width: 90,
    height: 50,
  })
})

test('calculateResize respects minimum width and height', () => {
  const start = { x: 50, y: 50, width: 20, height: 20 }
  const result = calculateResize('se', start, { x: -30, y: -30 }, {
    minWidth: 5,
    minHeight: 5,
    displayWidth: 300,
    displayHeight: 200,
  })

  assert.equal(result.width, 5)
  assert.equal(result.height, 5)
})

test('calculateResize clamps to display boundaries', () => {
  const start = { x: 250, y: 150, width: 40, height: 40 }
  const result = calculateResize('se', start, { x: 50, y: 50 }, {
    displayWidth: 280,
    displayHeight: 180,
  })

  assert.equal(result.width, 30) // 280 - 250 = 30
  assert.equal(result.height, 30) // 180 - 150 = 30
})

test('calculateResize applies grid snapping when enabled', () => {
  const start = { x: 50, y: 50, width: 100, height: 60 }
  const result = calculateResize('e', start, { x: 13, y: 0 }, {
    snap: true,
    snapSize: 10,
    displayWidth: 300,
    displayHeight: 200,
  })

  // 13 snaps to 10
  assert.equal(result.width, 110)
})
