/**
 * Device Shell & Breakout PCB Simulator
 * Renders authentic physical module breakout boards, pin headers, and bezels.
 */

export function getDeviceModuleType(width, height) {
  if (width === 84 && height === 48) return 'nokia'
  if (width === 160 && height === 32) return 'charlcd'
  if (width === 128 && (height === 64 || height === 32)) return 'oled'
  return 'industrial'
}

/**
 * Attaches or updates the physical hardware module DOM frame around .display-frame
 */
export function updateHardwareShellDOM(frameElement, { width, height, enabled }) {
  if (!frameElement) return

  let shellWrapper = frameElement.querySelector('.hardware-pcb-shell')

  if (!enabled) {
    if (shellWrapper) shellWrapper.remove()
    frameElement.classList.remove('has-hardware-shell')
    return
  }

  frameElement.classList.add('has-hardware-shell')
  const type = getDeviceModuleType(width, height)

  if (!shellWrapper) {
    shellWrapper = document.createElement('div')
    shellWrapper.className = 'hardware-pcb-shell'
    frameElement.prepend(shellWrapper)
  }

  shellWrapper.dataset.deviceType = type

  // Pins configuration
  let pinLabels = ['GND', 'VCC', 'SCL', 'SDA']
  let moduleTitle = '0.96" I2C OLED (SSD1306)'

  if (type === 'nokia') {
    pinLabels = ['RST', 'CE', 'DC', 'DIN', 'CLK', 'VCC', 'BL', 'GND']
    moduleTitle = '84×48 Graphic LCD (PCD8544)'
  } else if (type === 'charlcd') {
    pinLabels = ['VSS', 'VDD', 'V0', 'RS', 'RW', 'E', 'D4', 'D5', 'D6', 'D7', 'A', 'K']
    moduleTitle = '16×2 Character LCD (HD44780)'
  } else if (type === 'industrial') {
    pinLabels = ['VSS', 'VDD', 'V0', 'RS', 'R/W', 'E', 'DB0..7', 'PSB', 'RST']
    moduleTitle = `${width}×${height} Industrial HMI Controller`
  }

  shellWrapper.innerHTML = `
    <div class="pcb-header-pins">
      ${pinLabels.map(p => `
        <div class="pcb-pin" title="${p}">
          <span class="pin-ring"></span>
          <span class="pin-label">${p}</span>
        </div>
      `).join('')}
    </div>
    <div class="pcb-screws">
      <span class="pcb-screw top-left"></span>
      <span class="pcb-screw top-right"></span>
      <span class="pcb-screw bottom-left"></span>
      <span class="pcb-screw bottom-right"></span>
    </div>
    <div class="pcb-silkscreen-label">${moduleTitle}</div>
    <div class="glass-reflection-glare"></div>
  `
}

/**
 * Draws the hardware module PCB & bezel onto a 2D canvas for high-res PNG export
 */
export function drawHardwareShellToCanvas(ctx, { x, y, width, height, scale = 1 }) {
  const pcbPad = 32 * scale
  const pinAreaH = 34 * scale

  const pcbX = x - pcbPad
  const pcbY = y - pcbPad - pinAreaH
  const pcbW = width + pcbPad * 2
  const pcbH = height + pcbPad * 2 + pinAreaH

  ctx.save()

  // 1. PCB Substrate (Matte dark blue/black PCB)
  ctx.fillStyle = '#0f1722'
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2 * scale
  ctx.beginPath()
  ctx.roundRect(pcbX, pcbY, pcbW, pcbH, 8 * scale)
  ctx.fill()
  ctx.stroke()

  // 2. Corner mounting holes
  const screwR = 4 * scale
  const screwOffsets = [
    [pcbX + 12 * scale, pcbY + 12 * scale],
    [pcbX + pcbW - 12 * scale, pcbY + 12 * scale],
    [pcbX + 12 * scale, pcbY + pcbH - 12 * scale],
    [pcbX + pcbW - 12 * scale, pcbY + pcbH - 12 * scale],
  ]

  for (const [sx, sy] of screwOffsets) {
    // Copper pad ring
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 1.5 * scale
    ctx.beginPath()
    ctx.arc(sx, sy, screwR + 2 * scale, 0, Math.PI * 2)
    ctx.stroke()

    // Drill hole
    ctx.fillStyle = '#05070a'
    ctx.beginPath()
    ctx.arc(sx, sy, screwR, 0, Math.PI * 2)
    ctx.fill()
  }

  // 3. Header Pins
  const pins = ['GND', 'VCC', 'SCL', 'SDA']
  const pinSpacing = 16 * scale
  const startPinX = pcbX + (pcbW - (pins.length - 1) * pinSpacing) / 2
  const pinY = pcbY + 16 * scale

  ctx.font = `bold ${8 * scale}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  pins.forEach((label, idx) => {
    const px = startPinX + idx * pinSpacing

    // Golden solder ring
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 1.5 * scale
    ctx.fillStyle = '#0b0f17'
    ctx.beginPath()
    ctx.arc(px, pinY, 3.5 * scale, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Square pin center
    ctx.fillStyle = '#fef08a'
    ctx.fillRect(px - 1 * scale, pinY - 1 * scale, 2 * scale, 2 * scale)

    // Silkscreen text
    ctx.fillStyle = '#94a3b8'
    ctx.fillText(label, px, pinY + 6 * scale)
  })

  // 4. Metallic display bezel frame
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 3 * scale
  ctx.strokeRect(x - 2 * scale, y - 2 * scale, width + 4 * scale, height + 4 * scale)

  ctx.restore()
}
