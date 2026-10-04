/**
 * Zero-Backend Project URL Permalinks
 * Encodes and decodes complete project states into compact, URL-safe hashes.
 */

export async function encodeProjectToUrl(project) {
  if (!project || !project.display) return ''

  const compact = {
    d: {
      w: project.display.width,
      h: project.display.height,
      b: project.display.background,
    },
    e: (project.elements || []).map((el) => {
      const item = {
        i: el.id,
        t: el.type,
        x: el.x,
        y: el.y,
        w: el.width,
        h: el.height,
      }
      if (el.text !== undefined) item.c = el.text
      else if (el.content !== undefined) item.c = el.content
      if (el.fontFamily) item.f = el.fontFamily
      if (el.fontSize) item.s = el.fontSize
      if (el.color) item.cl = el.color
      if (el.stroke) item.st = el.stroke
      if (el.strokeWidth) item.sw = el.strokeWidth
      if (el.fill) item.fl = el.fill
      if (el.radius !== undefined) item.r = el.radius
      if (el.x1 !== undefined) item.x1 = el.x1
      if (el.y1 !== undefined) item.y1 = el.y1
      if (el.x2 !== undefined) item.x2 = el.x2
      if (el.y2 !== undefined) item.y2 = el.y2
      if (el.symbolSubtype) item.sub = el.symbolSubtype
      if (el.value !== undefined) item.val = el.value
      if (el.max !== undefined) item.max = el.max
      return item
    }),
  }

  const jsonStr = JSON.stringify(compact)
  const stream = new Blob([jsonStr]).stream().pipeThrough(new CompressionStream('deflate-raw'))
  const compressed = await new Response(stream).arrayBuffer()
  const bytes = new Uint8Array(compressed)

  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  // URL-safe Base64 without padding
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function decodeProjectFromUrl(hashStr) {
  if (!hashStr) return null

  let clean = hashStr.replace(/^#p=/, '').replace(/^#/, '').trim()
  if (!clean) return null

  // Restore standard Base64
  clean = clean.replace(/-/g, '+').replace(/_/g, '/')
  while (clean.length % 4 !== 0) {
    clean += '='
  }

  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  const decompressed = await new Response(stream).text()
  const obj = JSON.parse(decompressed)

  return {
    display: {
      width: obj.d?.w || 128,
      height: obj.d?.h || 64,
      background: obj.d?.b || '#18211b',
    },
    elements: (obj.e || []).map((el, idx) => ({
      id: el.i || `el_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      type: el.t || 'text',
      x: el.x || 0,
      y: el.y || 0,
      width: el.w || 10,
      height: el.h || 10,
      ...(el.c !== undefined ? { content: el.c, text: el.c } : {}),
      ...(el.f ? { fontFamily: el.f } : {}),
      ...(el.s ? { fontSize: el.s } : {}),
      ...(el.cl ? { color: el.cl } : {}),
      ...(el.st ? { stroke: el.st } : {}),
      ...(el.sw ? { strokeWidth: el.sw } : {}),
      ...(el.fl ? { fill: el.fl } : {}),
      ...(el.r !== undefined ? { radius: el.r } : {}),
      ...(el.x1 !== undefined ? { x1: el.x1 } : {}),
      ...(el.y1 !== undefined ? { y1: el.y1 } : {}),
      ...(el.x2 !== undefined ? { x2: el.x2 } : {}),
      ...(el.y2 !== undefined ? { y2: el.y2 } : {}),
      ...(el.sub ? { symbolSubtype: el.sub } : {}),
      ...(el.val !== undefined ? { value: el.val } : {}),
      ...(el.max !== undefined ? { max: el.max } : {}),
    })),
  }
}
