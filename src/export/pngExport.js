const MAX_PIXELS = 16 * 1024 * 1024

export function validateExportSize(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) ||
      width < 1 || height < 1 || width > 16384 || height > 16384 ||
      width * height > MAX_PIXELS) {
    throw new Error('Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for PNG export.')
  }
}

function font(element) {
  return `${element.fontWeight || 400} ${element.fontSize}px ${element.fontFamily || 'monospace'}`
}

function drawText(context, element) {
  const { x, y, width, height, fontSize } = element
  context.beginPath()
  context.rect(x, y, width, height)
  context.clip()
  context.font = font(element)
  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  context.fillStyle = element.color
  // Match the editor's white-space: nowrap (collapse CSS whitespace).
  const text = String(element.text ?? '').replace(/[\t\n\r\f ]+/g, ' ').replace(/^ | $/g, '')
  const metrics = context.measureText(text || 'M')
  const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8
  const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2
  context.fillText(text, x, y + height / 2 + (ascent - descent) / 2)
}

function drawShape(context, element) {
  const { x, y, width, height, strokeWidth } = element
  if (element.type === 'line') {
    context.fillStyle = element.color
    context.fillRect(x, y + (height - strokeWidth) / 2, width, strokeWidth)
    return
  }
  const ellipse = element.type === 'circle'
  const outline = (left, top, w, h) => {
    if (ellipse) {
      context.ellipse(left + w / 2, top + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2)
    } else context.rect(left, top, w, h)
  }
  if (element.fill !== 'transparent') {
    context.fillStyle = element.fill
    context.beginPath()
    outline(x, y, width, height)
    context.fill()
  }
  // Draw an inside border, matching CSS border-box without clearing lower layers.
  if (strokeWidth > 0) {
    context.fillStyle = element.stroke
    context.beginPath()
    outline(x, y, width, height)
    const innerWidth = width - strokeWidth * 2
    const innerHeight = height - strokeWidth * 2
    if (innerWidth > 0 && innerHeight > 0) {
      // A separate subpath avoids a connecting line between the two ellipses.
      context.moveTo(x + strokeWidth + innerWidth, y + height / 2)
      outline(x + strokeWidth, y + strokeWidth, innerWidth, innerHeight)
    }
    context.fill('evenodd')
  }
}

const bitmapCache = new Map()

export function setBitmapCache(dataUrl, source) {
  if (dataUrl && source) {
    bitmapCache.set(dataUrl, source)
  }
}

function drawBitmap(context, element) {
  if (!element.dataUrl) return
  const cached = bitmapCache.get(element.dataUrl)
  if (cached && context.drawImage) {
    context.drawImage(cached, element.x, element.y, element.width, element.height)
    return
  }
  if (typeof Image !== 'undefined') {
    const img = new Image()
    img.src = element.dataUrl
    if (img.complete && img.naturalWidth > 0 && context.drawImage) {
      context.drawImage(img, element.x, element.y, element.width, element.height)
    }
  }
}

export function renderProjectCanvas(project, canvas) {
  const { width, height, background } = project.display
  validateExportSize(width, height)
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('PNG export is not available in this browser.')
  context.fillStyle = background
  context.fillRect(0, 0, width, height)
  // Array order is the same stacking order used by the editor.
  for (const element of project.elements) {
    context.save()
    try {
      if (element.type === 'text') drawText(context, element)
      else if (['rectangle', 'circle', 'line'].includes(element.type)) drawShape(context, element)
      else if (element.type === 'bitmap') drawBitmap(context, element)
      else throw new Error(`Cannot export element type: ${element.type}`)
    } finally { context.restore() }
  }
  return canvas
}

export async function createPngBlob(state) {
  // Freeze the export before waiting for fonts so edits cannot mix two revisions.
  const project = structuredClone({ display: state.display, elements: state.elements })
  validateExportSize(project.display.width, project.display.height)
  if (document.fonts) {
    await Promise.all(project.elements.filter(element => element.type === 'text')
      .map(element => document.fonts.load(font(element), element.text || 'M')))
  }
  const canvas = renderProjectCanvas(project, document.createElement('canvas'))
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(result => {
      if (result) resolve(result)
      else reject(new Error('The browser could not generate the PNG. Try a smaller display size.'))
    }, 'image/png')
  })
  return { blob, width: canvas.width, height: canvas.height }
}

export function initPngExport(state) {
  const button = document.querySelector('#export-png')
  const status = document.querySelector('#project-status')
  let busy = false
  button.addEventListener('click', async () => {
    if (busy) return
    busy = true
    button.disabled = true
    button.textContent = 'Exporting…'
    status.textContent = 'Preparing PNG…'
    try {
      const { blob, width, height } = await createPngBlob(state)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `lcd-mockup-${width}x${height}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      status.textContent = `PNG download started (${width} × ${height} px)`
    } catch (error) {
      status.textContent = `PNG export failed: ${error.message}`
    } finally {
      busy = false
      button.disabled = false
      button.textContent = 'Export PNG'
    }
  })
}
