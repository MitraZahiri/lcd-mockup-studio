import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  adjustPixel,
  createAdjustedGrayscale,
  ditherFloydSteinberg,
  ditherAtkinson,
  ditherBayer,
  ditherThreshold,
  processDithering
} from '../src/analysis/dithering.js';

test('adjustPixel adjusts brightness and contrast correctly', () => {
  // Neutral: 128 with 0 contrast and 0 brightness stays 128
  assert.equal(Math.round(adjustPixel(128, 0, 0)), 128);

  // Brightness increase
  assert.ok(adjustPixel(100, 0, 20) > 100);

  // Clamping at 0 and 255
  assert.equal(adjustPixel(250, 0, 50), 255);
  assert.equal(adjustPixel(10, 0, -50), 0);

  // Contrast increases spread away from 128
  const lowContrast = adjustPixel(160, 50, 0);
  assert.ok(lowContrast > 160);
});

test('createAdjustedGrayscale converts RGBA buffer accurately', () => {
  const width = 2;
  const height = 2;
  // 4 white pixels
  const data = new Uint8ClampedArray([
    255, 255, 255, 255,
    0, 0, 0, 255,
    128, 128, 128, 255,
    255, 0, 0, 255 // Pure red (luminance ~ 76)
  ]);
  const fakeImageData = { width, height, data };

  const gray = createAdjustedGrayscale(fakeImageData, { contrast: 0, brightness: 0 });
  assert.equal(gray.length, 4);
  assert.equal(Math.round(gray[0]), 255); // White
  assert.equal(Math.round(gray[1]), 0);   // Black
  assert.equal(Math.round(gray[2]), 128); // Mid gray
  assert.ok(gray[3] >= 70 && gray[3] <= 80); // Red luminance
});

test('ditherFloydSteinberg generates valid 1-bit binary output', () => {
  const width = 4;
  const height = 4;
  // Gradient from black to white
  const gray = new Float32Array([
    10, 40, 80, 120,
    140, 160, 180, 200,
    210, 220, 230, 240,
    245, 250, 252, 255
  ]);

  const binary = ditherFloydSteinberg(gray, width, height, { threshold: 128, invert: false });
  assert.equal(binary.length, 16);
  // All values must be 0 or 1
  for (const b of binary) {
    assert.ok(b === 0 || b === 1);
  }
  // Darkest corner should be 0, brightest corner should be 1
  assert.equal(binary[0], 0);
  assert.equal(binary[15], 1);
});

test('ditherAtkinson generates high contrast dithered matrix', () => {
  const width = 4;
  const height = 4;
  const gray = new Float32Array([
    20, 50, 90, 130,
    150, 170, 190, 210,
    215, 225, 235, 245,
    248, 251, 253, 255
  ]);

  const binary = ditherAtkinson(gray, width, height, { threshold: 128, invert: false });
  assert.equal(binary.length, 16);
  for (const b of binary) {
    assert.ok(b === 0 || b === 1);
  }
});

test('ditherBayer applies ordered matrix pattern', () => {
  const width = 4;
  const height = 4;
  const uniformGray = new Float32Array(16).fill(128);

  const bayer = ditherBayer(uniformGray, width, height, { threshold: 128, matrixSize: 4 });
  assert.equal(bayer.length, 16);
  // Mid gray should produce a balanced checkerboard-like pattern of 0s and 1s
  const ones = Array.from(bayer).filter(x => x === 1).length;
  assert.ok(ones >= 6 && ones <= 10);
});

test('ditherThreshold cleanly cuts at threshold', () => {
  const gray = new Float32Array([50, 127, 128, 200]);
  const bin = ditherThreshold(gray, 2, 2, { threshold: 128 });
  assert.deepEqual(Array.from(bin), [0, 0, 1, 1]);

  const inverted = ditherThreshold(gray, 2, 2, { threshold: 128, invert: true });
  assert.deepEqual(Array.from(inverted), [1, 1, 0, 0]);
});

test('processDithering returns complete structure and respects algorithm selection', () => {
  const width = 8;
  const height = 8;
  const data = new Uint8ClampedArray(width * height * 4).fill(160);
  const fakeImageData = { width, height, data };

  const res = processDithering(fakeImageData, {
    algorithm: 'atkinson',
    contrast: 20,
    brightness: -10,
    threshold: 128
  });

  assert.equal(res.width, 8);
  assert.equal(res.height, 8);
  assert.equal(res.binary.length, 64);
});
