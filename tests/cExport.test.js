import test from 'node:test'
import assert from 'node:assert/strict'
import {
  generateMonochromeBytes,
  formatCSource,
  formatJsonOutput,
  formatHexOutput,
  formatBase64,
} from '../src/export/cExport.js'

function createTestImageData(width, height, fillFn) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const val = fillFn(x, y) ? 255 : 0
      data[idx] = val
      data[idx + 1] = val
      data[idx + 2] = val
      data[idx + 3] = 255
    }
  }
  return { width, height, data }
}

test('generateMonochromeBytes adafruit format packs 8 horizontal pixels MSB-first', () => {
  // 8x2 image: top row has leftmost 4 pixels ON (11110000 = 0xF0)
  // bottom row has all 8 pixels ON (11111111 = 0xFF)
  const img = createTestImageData(8, 2, (x, y) => {
    if (y === 0) return x < 4
    if (y === 1) return true
    return false
  })

  const bytes = generateMonochromeBytes(img, { threshold: 128, invert: false, format: 'adafruit' })
  assert.equal(bytes.length, 2)
  assert.equal(bytes[0], 0xf0)
  assert.equal(bytes[1], 0xff)
})

test('generateMonochromeBytes u8g2 format packs 8 vertical pixels per page LSB-first', () => {
  // 2x8 image (1 page high, 2 columns):
  // Col 0: top 2 pixels ON (bits 0 and 1 = 0x03)
  // Col 1: all 8 pixels ON (0xFF)
  const img = createTestImageData(2, 8, (x, y) => {
    if (x === 0) return y < 2
    if (x === 1) return true
    return false
  })

  const bytes = generateMonochromeBytes(img, { threshold: 128, invert: false, format: 'u8g2' })
  assert.equal(bytes.length, 2)
  assert.equal(bytes[0], 0x03)
  assert.equal(bytes[1], 0xff)
})

test('generateMonochromeBytes xbm format packs 8 horizontal pixels LSB-first', () => {
  // 8x1 image: leftmost 2 pixels ON (bits 0 and 1 = 0x03)
  const img = createTestImageData(8, 1, (x) => x < 2)

  const bytes = generateMonochromeBytes(img, { threshold: 128, invert: false, format: 'xbm' })
  assert.equal(bytes.length, 1)
  assert.equal(bytes[0], 0x03)
})

test('generateMonochromeBytes invert flag flips pixel polarity', () => {
  const img = createTestImageData(8, 1, () => true)

  const normalBytes = generateMonochromeBytes(img, { invert: false, format: 'adafruit' })
  const invertedBytes = generateMonochromeBytes(img, { invert: true, format: 'adafruit' })

  assert.equal(normalBytes[0], 0xff)
  assert.equal(invertedBytes[0], 0x00)
})

test('formatCSource produces valid C header with defines, PROGMEM and hex bytes', () => {
  const bytes = new Uint8Array([0x12, 0x34, 0xab, 0xcd])
  const code = formatCSource({
    bitmapBytes: bytes,
    width: 128,
    height: 64,
    format: 'adafruit',
    variableName: 'my_screen_bmp',
    projectName: 'Demo',
  })

  assert.ok(code.includes('#ifndef MY_SCREEN_BMP_H'))
  assert.ok(code.includes('#define MY_SCREEN_BMP_WIDTH  128'))
  assert.ok(code.includes('#define MY_SCREEN_BMP_HEIGHT 64'))
  assert.ok(code.includes('static const uint8_t PROGMEM my_screen_bmp[]'))
  assert.ok(code.includes('0x12, 0x34, 0xab, 0xcd'))
  assert.ok(code.includes('display.drawBitmap'))
})

test('formatCSource handles XBM format structure correctly', () => {
  const bytes = new Uint8Array([0x55, 0xaa])
  const code = formatCSource({
    bitmapBytes: bytes,
    width: 16,
    height: 1,
    format: 'xbm',
    variableName: 'screen_icon',
  })

  assert.ok(code.includes('#define SCREEN_ICON_WIDTH 16'))
  assert.ok(code.includes('static const unsigned char screen_icon[] = {'))
  assert.ok(code.includes('0x55, 0xaa'))
})

test('formatCSource handles MicroPython framebuf export correctly', () => {
  const bytes = new Uint8Array([0x12, 0x34])
  const code = formatCSource({
    bitmapBytes: bytes,
    width: 128,
    height: 64,
    format: 'micropython',
    variableName: 'lcd_buffer',
  })

  assert.ok(code.includes('import framebuf'))
  assert.ok(code.includes('LCD_BUFFER_WIDTH = 128'))
  assert.ok(code.includes('lcd_buffer = bytearray(['))
  assert.ok(code.includes('0x12, 0x34'))
  assert.ok(code.includes('framebuf.FrameBuffer(lcd_buffer, LCD_BUFFER_WIDTH, LCD_BUFFER_HEIGHT, framebuf.MONO_HLSB)'))
})

test('formatCSource handles complete Arduino sketch export correctly', () => {
  const bytes = new Uint8Array([0xff, 0x00])
  const code = formatCSource({
    bitmapBytes: bytes,
    width: 128,
    height: 64,
    format: 'arduino_sketch',
    variableName: 'oled_screen',
  })

  assert.ok(code.includes('#include <Arduino.h>'))
  assert.ok(code.includes('#include <U8g2lib.h>'))
  assert.ok(code.includes('U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2'))
  assert.ok(code.includes('static const unsigned char PROGMEM oled_screen[] = {'))
  assert.ok(code.includes('u8g2.drawXBMP(0, 0, OLED_SCREEN_WIDTH, OLED_SCREEN_HEIGHT, oled_screen);'))
  assert.ok(code.includes('void setup()'))
  assert.ok(code.includes('void loop()'))
})

test('formatJsonOutput generates valid JSON for project and elements', () => {
  const fakeState = {
    display: { width: 128, height: 64, background: '#18211b' },
    grid: { enabled: true, snap: true, size: 8 },
    reference: { src: null },
    elements: [
      { id: 'el-1', type: 'text', name: 'Header', text: 'HELLO', x: 0, y: 0, width: 50, height: 12, fontWeight: 700 },
      { id: 'el-2', type: 'rectangle', name: 'Frame', x: 0, y: 0, width: 128, height: 64, stroke: '#a8d9a8' },
    ],
  }

  const projectJson = formatJsonOutput(fakeState, 'json_project', true)
  assert.ok(projectJson.includes('"format": "lcd-mockup-studio"'))
  assert.ok(projectJson.includes('"width": 128'))
  assert.ok(projectJson.includes('HELLO'))

  const parsed = JSON.parse(projectJson)
  assert.equal(parsed.elements.length, 2)
  assert.equal(parsed.display.width, 128)

  const elementsJson = formatJsonOutput(fakeState, 'json_elements', true)
  const parsedElems = JSON.parse(elementsJson)
  assert.equal(parsedElems.length, 2)
  assert.equal(parsedElems[0].id, 'el-1')
})

test('formatHexOutput produces correct array, space-separated, dump and raw formats', () => {
  const bytes = new Uint8Array([0x00, 0x1f, 0xff, 0xa5, 0x5a, 0x01, 0x02, 0x03])

  // C Array
  const cArr = formatHexOutput(bytes, 'hex_array')
  assert.ok(cArr.includes('const uint8_t hex_bytes[8] = {'))
  assert.ok(cArr.includes('0x00, 0x1f, 0xff, 0xa5, 0x5a, 0x01, 0x02, 0x03'))

  // Space-separated
  const space = formatHexOutput(bytes, 'hex_space')
  assert.equal(space, '00 1F FF A5 5A 01 02 03')

  // Raw
  const raw = formatHexOutput(bytes, 'hex_raw')
  assert.equal(raw, '001FFFA55A010203')

  // Hex dump
  const dump = formatHexOutput(bytes, 'hex_dump')
  assert.ok(dump.includes('00000000:'))
  assert.ok(dump.includes('00 1f ff a5'))
})

test('formatBase64 extracts raw base64 and formats html img snippet', () => {
  const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=='

  const full = formatBase64(dataUrl, 'base64_dataurl')
  assert.equal(full, dataUrl)

  const raw = formatBase64(dataUrl, 'base64_raw')
  assert.equal(raw, 'iVBORw0KGgoAAAANSUhEUg==')

  const html = formatBase64(dataUrl, 'base64_html', 128, 64)
  assert.ok(html.includes('<img src="data:image/png;base64,'))
  assert.ok(html.includes('width="128"'))
  assert.ok(html.includes('height="64"'))
})


