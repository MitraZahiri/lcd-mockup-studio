export function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function validateExportSize(width, height) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > 16384 ||
    height > 16384 ||
    width * height > 16 * 1024 * 1024
  ) {
    throw new Error('Use whole-pixel dimensions up to 16,384 per side and 16 megapixels total for SVG export.')
  }
}

export function renderProjectSvg(project) {
  const { width, height, background } = project.display
  validateExportSize(width, height)

  const elementsSvg = []
  const defsSvg = []

  for (const element of project.elements) {
    if (element.type === 'text') {
      const clipId = `clip-${element.id}`
      defsSvg.push(
        `    <clipPath id="${escapeXml(clipId)}">` +
        `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" />` +
        `</clipPath>`
      )

      const text = String(element.text ?? '')
        .replace(/[\t\n\r\f ]+/g, ' ')
        .replace(/^ | $/g, '')

      const safeFont = escapeXml(element.fontFamily || 'monospace')
      const safeColor = escapeXml(element.color || '#a8d9a8')
      const safeWeight = escapeXml(element.fontWeight || '400')
      const fontSize = Number(element.fontSize) || 12
      const centerY = element.y + element.height / 2

      elementsSvg.push(
        `  <g clip-path="url(#${escapeXml(clipId)})">\n` +
        `    <text x="${element.x}" y="${centerY}" dominant-baseline="central" ` +
        `fill="${safeColor}" font-family="${safeFont}" font-size="${fontSize}px" ` +
        `font-weight="${safeWeight}" xml:space="preserve">${escapeXml(text)}</text>\n` +
        `  </g>`
      )
    } else if (element.type === 'rectangle') {
      const strokeWidth = Number(element.strokeWidth) || 0
      const safeStroke = escapeXml(element.stroke || 'transparent')
      const safeFill = escapeXml(element.fill || 'transparent')

      if (strokeWidth > 0 && element.stroke && element.stroke !== 'transparent') {
        const halfStroke = strokeWidth / 2
        const rx = element.x + halfStroke
        const ry = element.y + halfStroke
        const rw = Math.max(0, element.width - strokeWidth)
        const rh = Math.max(0, element.height - strokeWidth)
        elementsSvg.push(
          `  <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" ` +
          `fill="${safeFill}" stroke="${safeStroke}" stroke-width="${strokeWidth}" />`
        )
      } else {
        elementsSvg.push(
          `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" ` +
          `fill="${safeFill}" />`
        )
      }
    } else if (element.type === 'circle') {
      const strokeWidth = Number(element.strokeWidth) || 0
      const safeStroke = escapeXml(element.stroke || 'transparent')
      const safeFill = escapeXml(element.fill || 'transparent')
      const cx = element.x + element.width / 2
      const cy = element.y + element.height / 2
      const rx = Math.max(0, element.width / 2 - strokeWidth / 2)
      const ry = Math.max(0, element.height / 2 - strokeWidth / 2)

      if (strokeWidth > 0 && element.stroke && element.stroke !== 'transparent') {
        elementsSvg.push(
          `  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ` +
          `fill="${safeFill}" stroke="${safeStroke}" stroke-width="${strokeWidth}" />`
        )
      } else {
        elementsSvg.push(
          `  <ellipse cx="${cx}" cy="${cy}" rx="${element.width / 2}" ry="${element.height / 2}" ` +
          `fill="${safeFill}" />`
        )
      }
    } else if (element.type === 'line') {
      const strokeWidth = Number(element.strokeWidth) || 1
      const safeColor = escapeXml(element.color || '#a8d9a8')
      const y = element.y + (element.height - strokeWidth) / 2

      elementsSvg.push(
        `  <rect x="${element.x}" y="${y}" width="${element.width}" height="${strokeWidth}" ` +
        `fill="${safeColor}" />`
      )
    } else {
      throw new Error(`Cannot export element type to SVG: ${element.type}`)
    }
  }

  const defsSection = defsSvg.length > 0 ? `  <defs>\n${defsSvg.join('\n')}\n  </defs>\n` : ''

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
    `width="${width}" height="${height}">\n` +
    defsSection +
    `  <rect width="${width}" height="${height}" fill="${escapeXml(background)}" />\n` +
    elementsSvg.join('\n') +
    `\n</svg>\n`
  )
}

export function createSvgBlob(state) {
  const project = structuredClone({ display: state.display, elements: state.elements })
  const svgString = renderProjectSvg(project)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  return { blob, width: project.display.width, height: project.display.height, svgString }
}

export function initSvgExport(state) {
  const button = document.querySelector('#export-svg')
  const status = document.querySelector('#project-status')
  if (!button) return

  let busy = false
  button.addEventListener('click', () => {
    if (busy) return
    busy = true
    button.disabled = true
    button.textContent = 'Exporting…'
    if (status) status.textContent = 'Preparing SVG…'

    try {
      const { blob, width, height } = createSvgBlob(state)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `lcd-mockup-${width}x${height}.svg`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      if (status) status.textContent = `SVG download started (${width} × ${height} px)`
    } catch (error) {
      if (status) status.textContent = `SVG export failed: ${error.message}`
    } finally {
      busy = false
      button.disabled = false
      button.textContent = 'Export SVG'
    }
  })
}
