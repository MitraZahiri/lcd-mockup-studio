// Lightweight interactive tools embedded in the static SEO landing pages.
// Each page declares <div data-tool="hex"> or <div data-tool="image"> with
// optional data-width / data-height / data-format defaults.

import './landing.css'
import {
  parseHexInput,
  suggestDimensions,
  calculateHeightFromWidth,
  decodeHexToImageData,
  HEX_SAMPLES,
} from '../display/hexDecoder.js'
import { generateMonochromeBytes, formatCSource } from '../export/cExport.js'
import { processDithering } from '../analysis/dithering.js'
import { initAnalytics, trackPageView, trackEvent } from '../analytics.js'

export const HANDOFF_KEY = 'lcd_hex_handoff'

const TR = document.documentElement.lang === 'tr'

const FG = '#a8d9a8'
const BG = '#18211b'

function $(root, sel) {
  return root.querySelector(sel)
}

function studioUrl(tool) {
  return new URL(`../../?tool=${tool}`, window.location.href).href
}

function initHexTool(root) {
  const input = $(root, '[data-role="input"]')
  const format = $(root, '[data-role="format"]')
  const width = $(root, '[data-role="width"]')
  const height = $(root, '[data-role="height"]')
  const canvas = $(root, '[data-role="preview"]')
  const status = $(root, '[data-role="status"]')
  const invert = $(root, '[data-role="invert"]')

  const defaults = root.dataset
  format.value = defaults.format || 'adafruit'
  width.value = defaults.width || 128
  height.value = defaults.height || 64

  const sample = HEX_SAMPLES.find((s) => s.format === format.value && s.width === Number(width.value)) || HEX_SAMPLES[0]
  input.value = sample.getCode()
  if (!defaults.format) format.value = sample.format

  function render() {
    const parsed = parseHexInput(input.value)
    const w = Math.max(1, Math.min(1024, Number(width.value) || 128))
    const h = Math.max(1, Math.min(1024, Number(height.value) || 64))
    const img = decodeHexToImageData(parsed.bytes, w, h, {
      format: format.value,
      invert: invert.checked,
      fgColor: FG,
      bgColor: BG,
    })
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').putImageData(new ImageData(img.data, w, h), 0, 0)
    const zoom = Math.max(1, Math.floor(Math.min(640 / w, 400 / h)))
    canvas.style.width = `${w * zoom}px`
    canvas.style.height = `${h * zoom}px`
    status.textContent = parsed.totalBytes
      ? `${parsed.totalBytes} ${TR ? 'bayt çözüldü' : 'bytes decoded'} · ${w} × ${h} px`
      : (TR ? 'Önizleme için hex baytları veya C dizisi yapıştırın' : 'Paste hex bytes or a C array to preview')
  }

  function autoDetect() {
    const parsed = parseHexInput(input.value)
    if (parsed.detectedWidth && parsed.detectedHeight) {
      width.value = parsed.detectedWidth
      height.value = parsed.detectedHeight
      if (parsed.formatSuggestion === 'xbm') format.value = 'xbm'
    } else if (parsed.totalBytes) {
      const [best] = suggestDimensions(parsed.totalBytes, format.value)
      width.value = best.width
      height.value = best.height
    }
    render()
  }

  let timer = null
  input.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(autoDetect, 200)
  })
  format.addEventListener('change', render)
  invert.addEventListener('change', render)
  width.addEventListener('input', () => {
    const parsed = parseHexInput(input.value)
    if (parsed.totalBytes && $(root, '[data-role="lock"]').checked) {
      height.value = calculateHeightFromWidth(parsed.totalBytes, Number(width.value) || 1, format.value)
    }
    render()
  })
  height.addEventListener('input', render)
  $(root, '[data-role="detect"]').addEventListener('click', autoDetect)
  $(root, '[data-role="clear"]').addEventListener('click', () => {
    input.value = ''
    render()
    input.focus()
  })

  $(root, '[data-role="download"]').addEventListener('click', () => {
    const a = document.createElement('a')
    a.download = `bitmap_${canvas.width}x${canvas.height}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
    trackEvent('landing_hex_download', { page: location.pathname })
  })

  $(root, '[data-role="open-studio"]').addEventListener('click', () => {
    try {
      sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({
        code: input.value,
        format: format.value,
        width: Number(width.value),
        height: Number(height.value),
      }))
    } catch {
      // Storage unavailable: the studio still opens with its default sample.
    }
    trackEvent('landing_open_studio', { tool: 'hex', page: location.pathname })
    location.href = studioUrl('hex')
  })

  render()
}

function initImageTool(root) {
  const file = $(root, '[data-role="file"]')
  const drop = $(root, '[data-role="drop"]')
  const width = $(root, '[data-role="width"]')
  const height = $(root, '[data-role="height"]')
  const keep = $(root, '[data-role="keep"]')
  const dither = $(root, '[data-role="dither"]')
  const threshold = $(root, '[data-role="threshold"]')
  const invert = $(root, '[data-role="invert"]')
  const format = $(root, '[data-role="format"]')
  const varName = $(root, '[data-role="var"]')
  const canvas = $(root, '[data-role="preview"]')
  const output = $(root, '[data-role="output"]')
  const status = $(root, '[data-role="status"]')

  const defaults = root.dataset
  width.value = defaults.width || 128
  height.value = defaults.height || 64
  format.value = defaults.format || 'adafruit'

  let source = null

  function drawSample() {
    // Built-in demo so the converter shows output before any upload.
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 128
    const ctx = c.getContext('2d')
    const g = ctx.createLinearGradient(0, 0, 256, 0)
    g.addColorStop(0, '#000')
    g.addColorStop(1, '#fff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 128)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(64, 64, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000'
    ctx.font = 'bold 34px monospace'
    ctx.fillText('HELLO', 120, 76)
    return c
  }

  function convert() {
    const img = source || drawSample()
    const w = Math.max(1, Math.min(1024, Number(width.value) || 128))
    const h = Math.max(1, Math.min(1024, Number(height.value) || 64))
    const work = document.createElement('canvas')
    work.width = w
    work.height = h
    const ctx = work.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    const data = ctx.getImageData(0, 0, w, h)

    const dithered = processDithering(data, {
      algorithm: dither.value,
      threshold: Number(threshold.value),
      invert: invert.checked,
      contrast: 0,
    })
    const mono = dithered.createImageData('#ffffff', '#000000')

    const bytes = generateMonochromeBytes(mono, { format: format.value, threshold: 128 })
    output.value = formatCSource({
      bitmapBytes: bytes,
      width: w,
      height: h,
      format: format.value,
      variableName: varName.value || 'bitmap',
      projectName: source ? 'Converted image' : 'Demo image',
    })

    const preview = dithered.createImageData(FG, BG)
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').putImageData(preview, 0, 0)
    const zoom = Math.max(1, Math.floor(Math.min(512 / w, 320 / h)))
    canvas.style.width = `${w * zoom}px`
    canvas.style.height = `${h * zoom}px`
    const demo = TR ? ' · örnek resim (yukarıdan kendi resminizi yükleyin)' : ' · demo image (upload yours above)'
    status.textContent = `${bytes.length} ${TR ? 'bayt' : 'bytes'} · ${w} × ${h} px${source ? '' : demo}`
  }

  function loadFile(f) {
    if (!f || !f.type.startsWith('image/')) return
    const img = new Image()
    img.onload = () => {
      source = img
      if (keep.checked) {
        height.value = Math.max(1, Math.round((Number(width.value) || 128) * img.naturalHeight / img.naturalWidth))
      }
      convert()
      URL.revokeObjectURL(img.src)
      trackEvent('landing_image_convert', { page: location.pathname })
    }
    img.src = URL.createObjectURL(f)
  }

  file.addEventListener('change', () => loadFile(file.files[0]))
  drop.addEventListener('dragover', (e) => {
    e.preventDefault()
    drop.classList.add('is-over')
  })
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'))
  drop.addEventListener('drop', (e) => {
    e.preventDefault()
    drop.classList.remove('is-over')
    loadFile(e.dataTransfer.files[0])
  })
  window.addEventListener('paste', (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'))
    if (item) loadFile(item.getAsFile())
  })

  width.addEventListener('input', () => {
    if (source && keep.checked) {
      height.value = Math.max(1, Math.round((Number(width.value) || 128) * source.naturalHeight / source.naturalWidth))
    }
    convert()
  })
  for (const el of [height, dither, threshold, invert, format, varName]) {
    el.addEventListener('input', convert)
  }

  $(root, '[data-role="copy"]').addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(output.value)
      e.target.textContent = TR ? 'Kopyalandı ✓' : 'Copied ✓'
    } catch {
      output.select()
    }
    setTimeout(() => { e.target.textContent = e.target.dataset.label }, 1500)
    trackEvent('landing_code_copy', { page: location.pathname })
  })
  $(root, '[data-role="download"]').addEventListener('click', () => {
    const ext = format.value === 'micropython' ? 'py' : format.value === 'arduino_sketch' ? 'ino' : 'h'
    const blob = new Blob([output.value], { type: 'text/plain' })
    const a = document.createElement('a')
    a.download = `${varName.value || 'bitmap'}.${ext}`
    a.href = URL.createObjectURL(blob)
    a.click()
    URL.revokeObjectURL(a.href)
  })

  convert()
}

for (const el of document.querySelectorAll('[data-tool="hex"]')) initHexTool(el)
for (const el of document.querySelectorAll('[data-tool="image"]')) initImageTool(el)

initAnalytics()
trackPageView()
