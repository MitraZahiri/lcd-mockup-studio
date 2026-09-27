import { editorState, subscribe, notify } from '../editor/state.js'
import { MAX_PROJECT_BYTES, parseProject, snapshotProject, validateProject } from './projectFormat.js'

const emptyReference = () => ({ src: null, fileName: null, naturalWidth: 0, naturalHeight: 0 })

function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('The reference image could not be saved.'))
    reader.readAsDataURL(blob)
  })
}

function verifyReference(reference) {
  if (!reference) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      if (image.naturalWidth !== reference.naturalWidth ||
          image.naturalHeight !== reference.naturalHeight) {
        reject(new Error('Reference image dimensions do not match the project.'))
      } else resolve()
    }
    image.onerror = () => reject(new Error('The embedded reference image is damaged.'))
    image.src = reference.src
  })
}

export function initProjectControls({ refreshReference, fitWorkspace, isAnalyzing }) {
  const newButton = document.querySelector('#new-project')
  const openButton = document.querySelector('#open-project')
  const saveButton = document.querySelector('#save-project')
  const input = document.querySelector('#project-file-input')
  const title = document.querySelector('#project-title')
  const status = document.querySelector('#project-status')
  let name = 'Untitled Project'
  let busy = false
  const fingerprint = () => JSON.stringify(snapshotProject(editorState, name))
  let saved = fingerprint()
  const dirty = () => fingerprint() !== saved
  const updateTitle = () => { title.textContent = `${name}${dirty() ? ' *' : ''}` }
  subscribe(updateTitle)

  function setBusy(value) {
    busy = value
    newButton.disabled = openButton.disabled = saveButton.disabled = value
  }

  function canReplace() {
    if (isAnalyzing()) {
      window.alert('Wait for image analysis or reference loading to finish.')
      return false
    }
    return true
  }

  function confirmReplace() {
    return !dirty() || window.confirm('Replace the current project? Unsaved changes will be lost.')
  }

  function replace(project) {
    const previousSource = editorState.reference.src
    Object.assign(editorState, {
      display: project.display, elements: project.elements, grid: project.grid,
      reference: project.reference ?? emptyReference(), selectedId: null, view: { scale: 1 },
    })
    name = project.name || 'Untitled Project'
    saved = fingerprint()
    if (previousSource?.startsWith('blob:')) URL.revokeObjectURL(previousSource)
    refreshReference()
    notify()
    requestAnimationFrame(fitWorkspace)
  }

  newButton.addEventListener('click', () => {
    if (busy || !canReplace() || !confirmReplace()) return
    replace({ name: 'Untitled Project', display: { width: 800, height: 480, background: '#18211b' },
      elements: [], reference: null, grid: { enabled: true, snap: true, size: 10 } })
    status.textContent = 'New project'
  })

  openButton.addEventListener('click', () => {
    if (!busy && canReplace()) input.click()
  })

  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    input.value = ''
    if (!file || busy || !canReplace()) return
    setBusy(true)
    status.textContent = 'Opening project…'
    try {
      if (file.size > MAX_PROJECT_BYTES) throw new Error('Project exceeds the 32 MB limit.')
      const project = parseProject(await file.text())
      await verifyReference(project.reference)
      // Re-check after asynchronous reads: the user may have edited or started OCR.
      if (!canReplace() || !confirmReplace()) { status.textContent = 'Open cancelled'; return }
      replace(project)
      status.textContent = 'Project opened'
    } catch (error) {
      status.textContent = 'Could not open project'
      window.alert(error.message)
    } finally { setBusy(false) }
  })

  async function save() {
    if (busy || !canReplace()) return
    const enteredName = window.prompt('Project name', name)
    if (enteredName === null) return
    const nextName = enteredName.trim() || 'Untitled Project'
    if (nextName.length > 200) { window.alert('Use a project name of at most 200 characters.'); return }
    const snapshot = snapshotProject(editorState, nextName)
    const savedFingerprint = JSON.stringify(snapshot)
    setBusy(true)
    status.textContent = 'Preparing download…'
    try {
      if (snapshot.reference?.src.startsWith('blob:')) {
        const response = await fetch(snapshot.reference.src)
        if (!response.ok) throw new Error('The reference image could not be read.')
        snapshot.reference.src = await readDataUrl(await response.blob())
      }
      const blob = new Blob([JSON.stringify(validateProject(snapshot), null, 2)], { type: 'application/json' })
      if (blob.size > MAX_PROJECT_BYTES) throw new Error('Project exceeds the 32 MB limit.')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${nextName.replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^\.+/, '') || 'project'}.lcd.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      name = nextName
      saved = savedFingerprint
      updateTitle()
      status.textContent = 'Project download started'
    } catch (error) {
      status.textContent = 'Could not save project'
      window.alert(error.message)
    } finally { setBusy(false) }
  }

  saveButton.addEventListener('click', save)
  window.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      save()
    }
  })
  window.addEventListener('beforeunload', event => {
    if (!dirty()) return
    event.preventDefault()
    event.returnValue = ''
  })
  updateTitle()
}
