export const MAX_PROJECT_BYTES = 32 * 1024 * 1024

function check(condition, message) {
  if (!condition) throw new Error(message)
}

function number(value, label, min = 0, max = 16384) {
  check(Number.isFinite(value) && value >= min && value <= max,
    `Invalid ${label}.`)
  return value
}

function text(value, label, max = 10000) {
  check(typeof value === 'string' && value.length <= max, `Invalid ${label}.`)
  return value
}

function color(value, transparent = false) {
  check(typeof value === 'string' && (/^#[0-9a-f]{6}$/i.test(value) ||
    (transparent && value === 'transparent')), 'Invalid project color.')
  return value
}

export function validateProject(project) {
  check(project?.format === 'lcd-mockup-studio' && project.version === 1,
    'This is not a supported LCD Mockup Studio project (version 1).')
  const display = {
    width: number(project.display?.width, 'display width', 1),
    height: number(project.display?.height, 'display height', 1),
    background: color(project.display?.background),
  }
  const grid = project.grid
  check(typeof grid?.enabled === 'boolean' && typeof grid?.snap === 'boolean',
    'Invalid project grid.')
  check(Array.isArray(project.elements) && project.elements.length <= 10000,
    'The project must contain at most 10,000 elements.')
  const ids = new Set()
  const elements = project.elements.map(item => {
    check(item && ['text', 'rectangle', 'circle', 'line', 'bitmap'].includes(item.type),
      'Unsupported element type.')
    const id = text(item.id, 'element ID', 200)
    check(id.length > 0 && !ids.has(id), 'Missing or duplicate element ID.')
    ids.add(id)
    const element = {
      id, type: item.type, name: text(item.name ?? item.type, 'element name'),
      x: number(item.x, 'element X', -1000000, 1000000),
      y: number(item.y, 'element Y', -1000000, 1000000),
      width: number(item.width, 'element width', 1, 1000000),
      height: number(item.height, 'element height', 1, 1000000),
    }
    if (item.source === 'analysis') element.source = 'analysis'
    for (const key of ['confidence', 'fusionScore', 'support', 'sourceSupport']) {
      if (Number.isFinite(item[key])) element[key] = item[key]
    }
    if (item.opacity !== undefined) element.opacity = number(item.opacity, 'opacity', 0, 1)
    if (item.rotation !== undefined) element.rotation = number(item.rotation, 'rotation', -360, 360)
    if (item.type === 'text') {
      number(Number(item.fontWeight), 'font weight', 1, 1000)
      check(typeof item.fontWeight === 'number' || typeof item.fontWeight === 'string', 'Invalid font weight.')
      if (item.textAlign !== undefined) {
        check(['left', 'center', 'right'].includes(item.textAlign), 'Invalid text alignment.')
        element.textAlign = item.textAlign
      }
      Object.assign(element, {
        text: text(item.text, 'element text'),
        fontFamily: text(item.fontFamily, 'font family', 200),
        fontSize: number(item.fontSize, 'font size', 1),
        fontWeight: item.fontWeight,
        color: color(item.color),
      })
    } else if (item.type === 'bitmap') {
      element.dataUrl = text(item.dataUrl, 'bitmap data URL', 15000000)
      if (item.ditherMethod) element.ditherMethod = text(item.ditherMethod, 'dither method', 50)
      if (item.contrast !== undefined) element.contrast = number(item.contrast, 'contrast', -100, 100)
      if (item.brightness !== undefined) element.brightness = number(item.brightness, 'brightness', -100, 100)
      if (item.threshold !== undefined) element.threshold = number(item.threshold, 'threshold', 0, 255)
      if (item.invert !== undefined) element.invert = Boolean(item.invert)
    } else {
      element.strokeWidth = number(item.strokeWidth, 'stroke width', 1)
      if (item.type === 'line') element.color = color(item.color)
      else {
        element.fill = color(item.fill, true)
        element.stroke = color(item.stroke)
      }
    }
    return element
  })
  let reference = null
  if (project.reference != null) {
    const ref = project.reference
    check(typeof ref.src === 'string' &&
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(ref.src),
    'The reference must be an embedded PNG, JPEG or WebP image.')
    reference = {
      src: ref.src,
      fileName: text(ref.fileName, 'reference filename', 1000),
      naturalWidth: number(ref.naturalWidth, 'reference width', 1),
      naturalHeight: number(ref.naturalHeight, 'reference height', 1),
    }
  }
  return {
    format: 'lcd-mockup-studio', version: 1,
    name: text(project.name, 'project name', 200), display, elements, reference,
    grid: { enabled: grid.enabled, snap: grid.snap,
      size: number(grid.size, 'grid size', 1, 1024) },
  }
}

export function parseProject(json) {
  check(new Blob([json]).size <= MAX_PROJECT_BYTES, 'Project exceeds the 32 MB limit.')
  let project
  try { project = JSON.parse(json) }
  catch { throw new Error('The project file contains invalid JSON.') }
  return validateProject(project)
}

export function snapshotProject(state, name) {
  return structuredClone({
    format: 'lcd-mockup-studio', version: 1, name,
    display: state.display, elements: state.elements, grid: state.grid,
    reference: state.reference.src ? state.reference : null,
  })
}
