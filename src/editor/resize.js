export function calculateResize(handle, startBox, delta, options = {}) {
  const {
    snap = false,
    snapSize = 10,
    displayWidth = 16384,
    displayHeight = 16384,
    minWidth = 4,
    minHeight = 4,
  } = options

  let dx = delta.x
  let dy = delta.y

  if (snap && snapSize > 0) {
    dx = Math.round(dx / snapSize) * snapSize
    dy = Math.round(dy / snapSize) * snapSize
  } else {
    dx = Math.round(dx)
    dy = Math.round(dy)
  }

  let { x, y, width, height } = startBox
  const right = startBox.x + startBox.width
  const bottom = startBox.y + startBox.height

  // Horizontal resize
  if (handle.includes('e')) {
    const rawWidth = startBox.width + dx
    width = Math.max(minWidth, Math.min(displayWidth - x, rawWidth))
  } else if (handle.includes('w')) {
    let newX = startBox.x + dx
    newX = Math.max(0, Math.min(right - minWidth, newX))
    width = right - newX
    x = newX
  }

  // Vertical resize
  if (handle.includes('s')) {
    const rawHeight = startBox.height + dy
    height = Math.max(minHeight, Math.min(displayHeight - y, rawHeight))
  } else if (handle.includes('n')) {
    let newY = startBox.y + dy
    newY = Math.max(0, Math.min(bottom - minHeight, newY))
    height = bottom - newY
    y = newY
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  }
}
