import {
  editorState,
  updateReference,
  updateDisplay,
} from '../editor/state.js'

let currentObjectUrl = null

export function loadReferenceImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'))
      return
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file.'))
      return
    }

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl)
    }

    currentObjectUrl = URL.createObjectURL(file)

    const image = new Image()

    image.onload = () => {
      updateReference({
        src: currentObjectUrl,
        fileName: file.name,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        visible: true,
      })

      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }

    image.onerror = () => {
      reject(new Error('Image could not be loaded.'))
    }

    image.src = currentObjectUrl
  })
}

export function fitCanvasToReference() {
  const reference = editorState.reference

  if (!reference.src) return

  updateDisplay({
    width: reference.naturalWidth,
    height: reference.naturalHeight,
  })
}

export function removeReferenceImage() {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl)
    currentObjectUrl = null
  }

  updateReference({
    src: null,
    fileName: null,
    naturalWidth: 0,
    naturalHeight: 0,
  })
}