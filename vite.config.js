import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { PAGES } from './scripts/seo-pages.data.js'

// Each SEO landing page under tools/ is its own HTML entry point.
const landingInputs = Object.fromEntries(
  PAGES.map((p) => [`tools/${p.slug}`, resolve(import.meta.dirname, `tools/${p.slug}/index.html`)])
)

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        tools: resolve(import.meta.dirname, 'tools/index.html'),
        ...landingInputs,
      },
    },
  },
})
