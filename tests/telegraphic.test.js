import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateTelegraphicBinary,
  generateTelegraphicVectorLines,
  sampleLocalDarkness
} from '../src/analysis/telegraphic.js';
import { processDithering } from '../src/analysis/dithering.js';
import { validateProject } from '../src/project/projectFormat.js';

test('sampleLocalDarkness correctly normalizes darkness from 0 (white) to 1 (black)', () => {
  const width = 4;
  const height = 4;
  // All black (0)
  const allBlack = new Float32Array(16).fill(0);
  assert.equal(sampleLocalDarkness(allBlack, width, height, 1, 1), 1.0);

  // All white (255)
  const allWhite = new Float32Array(16).fill(255);
  assert.equal(sampleLocalDarkness(allWhite, width, height, 1, 1), 0.0);

  // Mid gray (127.5)
  const midGray = new Float32Array(16).fill(127.5);
  const midD = sampleLocalDarkness(midGray, width, height, 2, 2);
  assert.ok(Math.abs(midD - 0.5) < 0.05);
});

test('generateTelegraphicBinary modulates scanline thickness between dark and light regions', () => {
  const width = 16;
  const height = 16;
  // Left half is black (0), right half is pure white (255)
  const gray = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      gray[y * width + x] = x < 8 ? 0 : 255;
    }
  }

  const binary = generateTelegraphicBinary(gray, width, height, {
    lineSpacing: 4,
    minThickness: 0,
    maxThickness: 4,
    angle: 'horizontal'
  });

  assert.equal(binary.length, width * height);

  // Count ink pixels on dark left half vs light right half
  let darkInkCount = 0;
  let lightInkCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isInk = binary[y * width + x] === 1;
      if (x < 6) {
        if (isInk) darkInkCount++;
      } else if (x > 10) {
        if (isInk) lightInkCount++;
      }
    }
  }

  // Dark half must have substantially more ink (thick lines / solid fill) than light half
  assert.ok(darkInkCount > 10, 'Dark region should have prominent ink lines');
  assert.equal(lightInkCount, 0, 'Pure white with minThickness 0 should have zero ink lines');
});

test('generateTelegraphicBinary supports diagonal, vertical, and crosshatch scanlines', () => {
  const width = 16;
  const height = 16;
  const gray = new Float32Array(width * height).fill(50); // Deep dark gray

  const diag = generateTelegraphicBinary(gray, width, height, { angle: 'diagonal', lineSpacing: 4 });
  assert.equal(diag.length, 256);
  assert.ok(Array.from(diag).some(x => x === 1));

  const vert = generateTelegraphicBinary(gray, width, height, { angle: 'vertical', lineSpacing: 4 });
  assert.equal(vert.length, 256);
  assert.ok(Array.from(vert).some(x => x === 1));

  const cross = generateTelegraphicBinary(gray, width, height, { angle: 'crosshatch', lineSpacing: 4 });
  assert.equal(cross.length, 256);
  assert.ok(Array.from(cross).some(x => x === 1));
});

test('generateTelegraphicBinary supports pulse / morse modulation', () => {
  const width = 32;
  const height = 8;
  const gray = new Float32Array(width * height).fill(120); // Mid gray

  const continuous = generateTelegraphicBinary(gray, width, height, {
    lineSpacing: 4,
    modulation: 'continuous'
  });
  const pulsed = generateTelegraphicBinary(gray, width, height, {
    lineSpacing: 4,
    modulation: 'pulse',
    pulseFrequency: 0.5
  });

  const contInk = Array.from(continuous).filter(x => x === 1).length;
  const pulsedInk = Array.from(pulsed).filter(x => x === 1).length;

  // Pulse modulation introduces telegraphic breaks, reducing total ink compared to solid line
  assert.ok(pulsedInk < contInk, `Pulsed ink (${pulsedInk}) should be less than continuous (${contInk})`);
});

test('generateTelegraphicVectorLines produces valid line elements satisfying validateProject', () => {
  const width = 64;
  const height = 32;
  // Create a portrait-like circle in center
  const gray = new Float32Array(width * height).fill(250); // White background
  for (let y = 8; y < 24; y++) {
    for (let x = 16; x < 48; x++) {
      const dist = Math.hypot(x - 32, y - 16);
      if (dist < 10) {
        gray[y * width + x] = 20; // Dark subject
      }
    }
  }

  const lines = generateTelegraphicVectorLines(gray, width, height, {
    lineSpacing: 4,
    minThickness: 1,
    maxThickness: 4,
    color: '#a8d9a8'
  });

  assert.ok(lines.length > 0, 'Must generate vector lines for dark subject');

  // Verify each line structure
  for (const line of lines) {
    assert.equal(line.type, 'line');
    assert.ok(line.id.startsWith('line_tele_'));
    assert.ok(line.width >= 1);
    assert.ok(line.height >= 1);
    assert.ok(line.strokeWidth >= 1);
    assert.equal(line.color, '#a8d9a8');
    assert.ok(line.x >= 0 && line.x < width);
    assert.ok(line.y >= 0 && line.y < height);
  }

  // Schema verification
  const project = {
    format: 'lcd-mockup-studio',
    version: 1,
    name: 'Telegraphic Test',
    display: { width, height, background: '#18211b' },
    grid: { enabled: true, snap: false, size: 8 },
    elements: lines
  };

  const validated = validateProject(project);
  assert.equal(validated.elements.length, lines.length);
  assert.equal(validated.elements[0].type, 'line');
});

test('processDithering with telegraphic algorithm integrates cleanly', () => {
  const width = 20;
  const height = 20;
  const data = new Uint8ClampedArray(width * height * 4);

  // Gradient
  for (let i = 0; i < width * height; i++) {
    const val = (i % width) * 12;
    data[i * 4] = val;
    data[i * 4 + 1] = val;
    data[i * 4 + 2] = val;
    data[i * 4 + 3] = 255;
  }

  const fakeImageData = { width, height, data };

  const result = processDithering(fakeImageData, {
    algorithm: 'telegraphic',
    lineSpacing: 3,
    minThickness: 0.5,
    maxThickness: 3.2
  });

  assert.equal(result.width, 20);
  assert.equal(result.height, 20);
  assert.equal(result.binary.length, 400);

  // Each element in binary is 0 or 1
  for (const b of result.binary) {
    assert.ok(b === 0 || b === 1);
  }

  // Can generate image data
  const imgData = result.createImageData('#ffffff', '#000000');
  assert.equal(imgData.width, 20);
  assert.equal(imgData.height, 20);
  assert.equal(imgData.data.length, 400 * 4);
});
