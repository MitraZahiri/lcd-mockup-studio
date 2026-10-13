import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isValidGaId,
  isValidGoatCounterCode,
  initAnalytics,
  trackPageView,
  trackEvent,
  getAnalyticsConfig,
} from '../src/analytics.js'

test('isValidGaId correctly identifies valid and invalid Google Analytics IDs', () => {
  assert.equal(isValidGaId('G-ABC123XYZ'), true)
  assert.equal(isValidGaId('G-999999999'), true)
  assert.equal(isValidGaId('g-lowercase1'), true)
  assert.equal(isValidGaId('UA-12345-6'), false)
  assert.equal(isValidGaId(''), false)
  assert.equal(isValidGaId(null), false)
  assert.equal(isValidGaId(undefined), false)
  assert.equal(isValidGaId('12345'), false)
})

test('isValidGoatCounterCode validates usernames and custom domains', () => {
  assert.equal(isValidGoatCounterCode('mitrazahiri'), true)
  assert.equal(isValidGoatCounterCode('my-stats-app'), true)
  assert.equal(isValidGoatCounterCode('stats.example.com'), true)
  assert.equal(isValidGoatCounterCode(''), false)
  assert.equal(isValidGoatCounterCode('   '), false)
  assert.equal(isValidGoatCounterCode(null), false)
})

test('initAnalytics stores configuration safely without DOM errors', () => {
  const cfg = initAnalytics({
    gaMeasurementId: 'G-TESTID1234',
    goatCounterCode: 'mitra-test',
    debug: false,
  })

  assert.equal(cfg.gaMeasurementId, 'G-TESTID1234')
  assert.equal(cfg.goatCounterCode, 'mitra-test')
  assert.equal(cfg.debug, false)

  const active = getAnalyticsConfig()
  assert.equal(active.gaMeasurementId, 'G-TESTID1234')
})

test('trackPageView and trackEvent call window.gtag and window.goatcounter when mocked', () => {
  const gaCalls = []
  const goatCalls = []

  // Mock global window object
  globalThis.window = {
    location: { pathname: '/lcd-mockup-studio/', hash: '#p=123' },
    gtag: (command, name, params) => {
      gaCalls.push({ command, name, params })
    },
    goatcounter: {
      count: (data) => {
        goatCalls.push(data)
      },
    },
  }
  const createdScripts = []
  globalThis.document = {
    title: 'Test Title',
    head: {
      appendChild: (el) => {
        createdScripts.push(el)
      },
    },
    querySelector: () => null,
    createElement: (tag) => {
      const attrs = {}
      return {
        tag,
        attributes: attrs,
        setAttribute: (k, v) => {
          attrs[k] = v
        },
      }
    },
  }

  initAnalytics({
    gaMeasurementId: 'G-MOCK123',
    goatCounterCode: 'mock-user',
    debug: true,
  })

  // loadGoogleAnalytics pushes 'js' and 'config'
  assert.equal(gaCalls[0].command, 'js')
  assert.equal(gaCalls[1].command, 'config')
  assert.equal(gaCalls[1].name, 'G-MOCK123')

  trackPageView('/custom-route', 'Custom Page')
  // GA receives event page_view as 3rd call
  const pageViewCall = gaCalls.find(c => c.name === 'page_view')
  assert.ok(pageViewCall)
  assert.equal(pageViewCall.command, 'event')
  assert.equal(pageViewCall.params.page_path, '/custom-route')
  assert.equal(pageViewCall.params.page_title, 'Custom Page')

  assert.equal(goatCalls.length, 1)
  assert.equal(goatCalls[0].path, '/custom-route')
  assert.equal(goatCalls[0].event, false)

  trackEvent('c_export', { format: 'adafruit' })
  const eventCall = gaCalls.find(c => c.name === 'c_export')
  assert.ok(eventCall)
  assert.equal(eventCall.command, 'event')
  assert.equal(eventCall.params.format, 'adafruit')

  assert.equal(goatCalls.length, 2)
  assert.equal(goatCalls[1].path, 'event/c_export')
  assert.equal(goatCalls[1].event, true)

  // Cleanup globals
  delete globalThis.window
  delete globalThis.document
})
