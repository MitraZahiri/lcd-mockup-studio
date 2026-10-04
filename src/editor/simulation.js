/**
 * Interactive Live Simulation Mode for LCD Mockup Studio
 * Simulates real-time embedded hardware behavior:
 * - Ticking real-time clock & blinking colons
 * - Dynamic sensor telemetry jitter (temperature, voltage, humidity)
 * - Animated battery & progress bar sweeps
 * Non-destructive: original element states are preserved and restored upon stopping.
 */

let simulationTimer = null;
let originalElementsBackup = null;
let tickCount = 0;

/**
 * Checks whether live simulation is currently active
 * @returns {boolean}
 */
export function isSimulating() {
  return simulationTimer !== null;
}

/**
 * Extracts a numeric value from telemetry string
 * @param {string} text
 * @returns {{ prefix: string, num: number, decimals: number, suffix: string } | null}
 */
function parseTelemetryValue(text) {
  const match = text.match(/^([^0-9.-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const numStr = match[2];
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
  return {
    prefix: match[1],
    num: parseFloat(numStr),
    decimals,
    suffix: match[3]
  };
}

/**
 * Starts interactive hardware simulation
 * @param {object} state - Studio editor state
 * @param {function} onTick - Callback executed after every simulation frame
 * @returns {boolean} Whether simulation started
 */
export function startSimulation(state, onTick) {
  if (isSimulating()) return false;
  if (!state || !Array.isArray(state.elements)) return false;

  // Create deep snapshot of elements before simulation starts
  originalElementsBackup = JSON.parse(JSON.stringify(state.elements));
  tickCount = 0;

  simulationTimer = setInterval(() => {
    tickCount++;
    simulateTick(state);
    if (typeof onTick === 'function') {
      onTick();
    }
  }, 500); // 500ms allows realistic clock colon blinking and smooth sensor updates

  return true;
}

/**
 * Executes a single simulation step on state elements
 * @param {object} state
 */
export function simulateTick(state) {
  if (!state || !Array.isArray(state.elements)) return;

  const colonVisible = tickCount % 2 === 0;

  for (let i = 0; i < state.elements.length; i++) {
    const el = state.elements[i];
    const orig = originalElementsBackup && originalElementsBackup[i];

    if (el.type === 'text') {
      const origText = (orig && orig.text) || el.text || '';

      // 1. Clock time simulation (HH:MM or HH:MM:SS)
      const clockMatch = origText.match(/^(\d{1,2})(:)(\d{2})(:?\d{0,2})(.*)$/);
      if (clockMatch) {
        const hh = clockMatch[1];
        const sep = colonVisible ? ':' : ' ';
        const mm = clockMatch[2] === ':' ? clockMatch[3] : clockMatch[3];
        const ss = clockMatch[4] ? (colonVisible ? clockMatch[4] : clockMatch[4].replace(':', ' ')) : '';
        const tail = clockMatch[5] || '';
        el.text = `${hh}${sep}${mm}${ss}${tail}`;
        continue;
      }

      // 2. Battery percentage or progress percentage (e.g. "85%", "100%")
      if (/^\d{1,3}\s*%$/.test(origText.trim())) {
        const baseVal = parseInt(origText, 10);
        // Subtle drift around baseVal
        const drift = Math.sin(tickCount * 0.15) * 5;
        const currentPercent = Math.max(5, Math.min(100, Math.round(baseVal + drift)));
        el.text = `${currentPercent}%`;
        continue;
      }

      // 3. Sensor / telemetry telemetry with units (e.g. 24.5 °C, 1013 hPa, 12.4 V, 55 %RH)
      const telemetry = parseTelemetryValue(origText);
      if (telemetry && (
        telemetry.suffix.includes('°') ||
        telemetry.suffix.toLowerCase().includes('c') ||
        telemetry.suffix.toLowerCase().includes('v') ||
        telemetry.suffix.toLowerCase().includes('hpa') ||
        telemetry.suffix.toLowerCase().includes('rpm') ||
        telemetry.suffix.toLowerCase().includes('bar')
      )) {
        // Natural sensor fluctuation (sine wave + minor jitter)
        const wave = Math.sin((tickCount + i * 3) * 0.25) * 0.4;
        const newVal = (telemetry.num + wave).toFixed(telemetry.decimals);
        el.text = `${telemetry.prefix}${newVal}${telemetry.suffix}`;
        continue;
      }
    }

    // 4. Progress bar fill simulation
    // If element is a filled rectangle inside a frame or identified as progress fill
    if (el.type === 'rect' && el.fill && orig) {
      if (orig.width > 10 && orig.width < (state.display?.width || 128)) {
        // Subtle progress pulse or oscillation
        const baseWidth = orig.width;
        const delta = Math.round(Math.sin((tickCount + i) * 0.2) * 6);
        el.width = Math.max(2, baseWidth + delta);
      }
    }
  }
}

/**
 * Stops live simulation and restores exact original project state
 * @param {object} state - Studio editor state
 * @param {function} onStop - Callback executed after restoring original elements
 * @returns {boolean} Whether simulation was active and stopped
 */
export function stopSimulation(state, onStop) {
  if (!isSimulating()) return false;

  clearInterval(simulationTimer);
  simulationTimer = null;

  // Restore pristine elements
  if (state && originalElementsBackup) {
    state.elements = JSON.parse(JSON.stringify(originalElementsBackup));
    originalElementsBackup = null;
  }

  if (typeof onStop === 'function') {
    onStop();
  }

  return true;
}
