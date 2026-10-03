const ALLOWED_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2']

export function sanitizeFontFamilyName(filename) {
  if (!filename || typeof filename !== 'string') return 'CustomFont'
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  const cleaned = nameWithoutExt
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
  return cleaned || 'CustomFont'
}

export function isValidFontFile(file) {
  if (!file || !file.name) return false
  const lower = file.name.toLowerCase()
  return ALLOWED_EXTENSIONS.some(ext => lower.endsWith(ext))
}

export async function loadFontFromFile(file) {
  if (!isValidFontFile(file)) {
    throw new Error('Unsupported font format. Please upload .ttf, .otf, .woff, or .woff2 files.')
  }

  const familyName = sanitizeFontFamilyName(file.name)
  const arrayBuffer = await file.arrayBuffer()

  if (typeof FontFace === 'undefined') {
    throw new Error('FontFace API is not supported in this environment.')
  }

  const fontFace = new FontFace(familyName, arrayBuffer)
  await fontFace.load()
  if (document?.fonts) {
    document.fonts.add(fontFace)
  }

  return familyName
}
