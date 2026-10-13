/**
 * LCD Mockup Studio — Private Owner Analytics Module
 * 
 * Supports Google Analytics 4 (GA4) and GoatCounter.
 * All visitor data & metrics are strictly private to the owner's dashboard:
 * - Google Analytics: https://analytics.google.com (requires owner Google account login)
 * - GoatCounter: https://[code].goatcounter.com (dashboard password-protected in settings)
 */

let activeConfig = {
  gaMeasurementId: '',
  goatCounterCode: '',
  debug: false,
}

let initialized = false
let queuedEvents = []

/**
 * Validates Google Analytics Measurement ID (format: G-XXXXXXXXXX)
 */
export function isValidGaId(id) {
  return typeof id === 'string' && /^G-[A-Z0-9]+$/i.test(id.trim())
}

/**
 * Validates GoatCounter username/code (alphanumeric, hyphens, or full domain)
 */
export function isValidGoatCounterCode(code) {
  if (typeof code !== 'string') return false
  const trimmed = code.trim()
  return trimmed.length > 0 && /^[a-z0-9_\-\.]+$/i.test(trimmed)
}

/**
 * Initialize Analytics with optional config overrides.
 * Checks window.LCD_ANALYTICS_CONFIG or passed arguments.
 */
export function initAnalytics(config = {}) {
  const windowConfig = (typeof window !== 'undefined' && window.LCD_ANALYTICS_CONFIG) || {}
  
  activeConfig = {
    gaMeasurementId: (config.gaMeasurementId || windowConfig.gaMeasurementId || '').trim(),
    goatCounterCode: (config.goatCounterCode || windowConfig.goatCounterCode || '').trim(),
    debug: Boolean(config.debug !== undefined ? config.debug : windowConfig.debug),
  }

  if (activeConfig.debug) {
    console.log('[Analytics] Initializing with config:', activeConfig)
  }

  // 1. Initialize Google Analytics 4 if measurement ID is valid
  if (isValidGaId(activeConfig.gaMeasurementId)) {
    loadGoogleAnalytics(activeConfig.gaMeasurementId)
  } else if (activeConfig.debug && activeConfig.gaMeasurementId) {
    console.warn('[Analytics] Invalid GA Measurement ID format:', activeConfig.gaMeasurementId)
  }

  // 2. Initialize GoatCounter if code is valid
  if (isValidGoatCounterCode(activeConfig.goatCounterCode)) {
    loadGoatCounter(activeConfig.goatCounterCode)
  }

  initialized = true

  // Flush queued events
  if (queuedEvents.length > 0) {
    const queue = [...queuedEvents]
    queuedEvents = []
    queue.forEach(item => {
      if (item.type === 'pageview') {
        trackPageView(item.path, item.title)
      } else if (item.type === 'event') {
        trackEvent(item.name, item.params)
      }
    })
  }

  return activeConfig
}

/**
 * Inject Google Analytics 4 gtag.js script
 */
function loadGoogleAnalytics(measurementId) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return
  if (document.querySelector && document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) return

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: false, // We control page_view manually
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  if (document.head && typeof document.head.appendChild === 'function') {
    document.head.appendChild(script)
  }

  if (activeConfig.debug) {
    console.log(`[Analytics] Google Analytics 4 (${measurementId}) script injected`)
  }
}

/**
 * Inject GoatCounter count.js script
 */
function loadGoatCounter(code) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') return
  if (document.querySelector && document.querySelector('script[src*="goatcounter.com/count.js"], script[src*="gc.zgo.at/count.js"]')) return

  const script = document.createElement('script')
  script.async = true
  script.src = '//gc.zgo.at/count.js'
  
  const endpoint = code.includes('.')
    ? `https://${code}/count`
    : `https://${code}.goatcounter.com/count`

  script.setAttribute('data-goatcounter', endpoint)
  script.setAttribute('data-goatcounter-settings', '{"no_onload": true}')
  if (document.head && typeof document.head.appendChild === 'function') {
    document.head.appendChild(script)
  }

  if (activeConfig.debug) {
    console.log(`[Analytics] GoatCounter (${code}) script injected pointing to ${endpoint}`)
  }
}

/**
 * Track a page view
 */
export function trackPageView(path = '', title = '') {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/')
  const currentTitle = title || (typeof document !== 'undefined' ? document.title : 'LCD Mockup Studio')

  if (!initialized && typeof window !== 'undefined') {
    queuedEvents.push({ type: 'pageview', path: currentPath, title: currentTitle })
    return
  }

  if (activeConfig.debug) {
    console.log(`[Analytics] 📄 PageView: ${currentPath} — "${currentTitle}"`)
  }

  // GA4
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_title: currentTitle,
    })
  }

  // GoatCounter
  if (typeof window !== 'undefined' && window.goatcounter && typeof window.goatcounter.count === 'function') {
    window.goatcounter.count({
      path: currentPath,
      title: currentTitle,
      event: false,
    })
  }
}

/**
 * Track a custom interaction event
 * e.g. trackEvent('c_code_export', { format: 'adafruit', category: 'c' })
 */
export function trackEvent(name, params = {}) {
  if (!name || typeof name !== 'string') return

  if (!initialized && typeof window !== 'undefined') {
    queuedEvents.push({ type: 'event', name, params })
    return
  }

  if (activeConfig.debug) {
    console.log(`[Analytics] ⚡ Event: "${name}"`, params)
  }

  // GA4
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }

  // GoatCounter custom event support
  if (typeof window !== 'undefined' && window.goatcounter && typeof window.goatcounter.count === 'function') {
    const paramStr = Object.keys(params).length > 0 ? ` (${JSON.stringify(params)})` : ''
    window.goatcounter.count({
      path: `event/${name}`,
      title: `${name}${paramStr}`,
      event: true,
    })
  }
}

/**
 * Returns current configuration
 */
export function getAnalyticsConfig() {
  return { ...activeConfig }
}
