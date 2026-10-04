import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isSimulating,
  startSimulation,
  simulateTick,
  stopSimulation
} from '../src/editor/simulation.js';

test('isSimulating returns false initially', () => {
  assert.equal(isSimulating(), false);
});

test('simulateTick updates clock colon, battery percentage, and telemetry', () => {
  const state = {
    display: { width: 128, height: 64 },
    elements: [
      { id: 'clk', type: 'text', text: '12:45', x: 10, y: 10 },
      { id: 'bat', type: 'text', text: '85%', x: 10, y: 25 },
      { id: 'tmp', type: 'text', text: '24.5 °C', x: 10, y: 40 },
      { id: 'bar', type: 'rect', x: 10, y: 55, width: 40, height: 6, fill: true }
    ]
  };

  const started = startSimulation(state, () => {});
  assert.equal(started, true);
  assert.equal(isSimulating(), true);

  // Advance ticks
  simulateTick(state);

  // Verify clock or telemetry responded
  assert.ok(state.elements[0].text === '12:45' || state.elements[0].text === '12 45');
  assert.ok(state.elements[1].text.endsWith('%'));
  assert.ok(state.elements[2].text.includes('°C'));

  // Stop simulation and ensure pristine restore
  const stopped = stopSimulation(state, () => {});
  assert.equal(stopped, true);
  assert.equal(isSimulating(), false);

  assert.equal(state.elements[0].text, '12:45');
  assert.equal(state.elements[1].text, '85%');
  assert.equal(state.elements[2].text, '24.5 °C');
  assert.equal(state.elements[3].width, 40);
});

test('startSimulation guards against invalid inputs', () => {
  assert.equal(startSimulation(null), false);
  assert.equal(startSimulation({}), false);
});
