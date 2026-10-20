// Generates the static SEO landing pages into tools/<slug>/index.html and
// rewrites public/sitemap.xml. Runs automatically before `vite` and `vite build`.
//
//   node scripts/generate_seo_pages.js

import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGES, SITE_URL } from './seo-pages.data.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TOOLS_DIR = join(ROOT, 'tools')
const TODAY = new Date().toISOString().slice(0, 10)

const UI = {
  en: {
    home: 'Studio',
    tools: 'Tools',
    toolsTitle: 'Free Online Bitmap, Hex & OLED Tools',
    openStudio: 'Open the full LCD Mockup Studio',
    openStudioText: 'Design complete LCD/OLED screens with text, icons and gauges, edit pixels, simulate the display and export C, SVG or PNG.',
    launch: 'Launch Studio →',
    related: 'Related tools',
    faq: 'Frequently asked questions',
    footer: 'Free, open-source and 100% client-side. Your images and code never leave your browser.',
    hex: {
      input: 'Hex bytes / C array',
      format: 'Byte format',
      width: 'Width',
      height: 'Height',
      lock: 'Auto height',
      invert: 'Invert',
      detect: 'Auto-detect size',
      clear: 'Clear',
      download: '⬇ Download PNG',
      open: 'Open in full editor →',
    },
    image: {
      drop: '📁 Click, drop or paste (Ctrl+V) an image',
      width: 'Width',
      height: 'Height',
      keep: 'Keep aspect',
      dither: 'Dithering',
      threshold: 'Threshold',
      invert: 'Invert',
      format: 'Output',
      var: 'Variable name',
      copy: '📋 Copy code',
      download: '⬇ Download file',
    },
  },
  tr: {
    home: 'Stüdyo',
    tools: 'Araçlar',
    toolsTitle: 'Ücretsiz Online Bitmap, Hex ve OLED Araçları',
    openStudio: 'Tam LCD Mockup Studio\'yu açın',
    openStudioText: 'Yazı, ikon ve göstergelerle eksiksiz LCD/OLED ekranlar tasarlayın, pikselleri düzenleyin, ekranı simüle edin ve C, SVG veya PNG olarak dışa aktarın.',
    launch: 'Stüdyoyu Aç →',
    related: 'İlgili araçlar',
    faq: 'Sıkça sorulan sorular',
    footer: 'Ücretsiz, açık kaynak ve tamamen tarayıcıda çalışır. Resimleriniz ve kodunuz cihazınızdan çıkmaz.',
    hex: {
      input: 'Hex baytları / C dizisi',
      format: 'Bayt formatı',
      width: 'Genişlik',
      height: 'Yükseklik',
      lock: 'Otomatik yükseklik',
      invert: 'Ters çevir',
      detect: 'Boyutu algıla',
      clear: 'Temizle',
      download: '⬇ PNG indir',
      open: 'Tam editörde aç →',
    },
    image: {
      drop: '📁 Resim seçin, sürükleyin veya yapıştırın (Ctrl+V)',
      width: 'Genişlik',
      height: 'Yükseklik',
      keep: 'Oranı koru',
      dither: 'Dithering',
      threshold: 'Eşik',
      invert: 'Ters çevir',
      format: 'Çıktı',
      var: 'Değişken adı',
      copy: '📋 Kodu kopyala',
      download: '⬇ Dosyayı indir',
    },
  },
}

const HEX_FORMATS = [
  ['adafruit', 'Adafruit GFX (horizontal, MSB first)'],
  ['xbm', 'XBM / U8g2 (horizontal, LSB first)'],
  ['u8g2', 'Vertical pages (SSD1306, LSB = top)'],
  ['vertical_msb', 'Vertical, MSB first'],
  ['rgb565_be', 'RGB565 color (big-endian)'],
  ['rgb565_le', 'RGB565 color (little-endian)'],
  ['gray8', 'Grayscale (1 byte per pixel)'],
]

const IMAGE_FORMATS = [
  ['adafruit', 'Adafruit GFX drawBitmap (.h)'],
  ['xbm', 'U8g2 drawXBMP / XBM (.h)'],
  ['u8g2', 'Vertical pages / SSD1306 RAM (.h)'],
  ['micropython', 'MicroPython framebuf (.py)'],
  ['arduino_sketch', 'Complete Arduino sketch (.ino)'],
]

const DITHERS = [
  ['threshold', 'Threshold (logos, text)'],
  ['atkinson', 'Atkinson (photos)'],
  ['floyd-steinberg', 'Floyd–Steinberg'],
  ['bayer4', 'Bayer 4×4'],
  ['bayer8', 'Bayer 8×8'],
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const stripTags = (s) => s.replace(/<[^>]+>/g, '')
const pageUrl = (slug) => `${SITE_URL}tools/${slug}/`
const options = (list) => list.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')

function hexToolHtml(page, t) {
  return `<div class="tool" data-tool="hex"${page.format ? ` data-format="${page.format}"` : ''}${page.width ? ` data-width="${page.width}"` : ''}${page.height ? ` data-height="${page.height}"` : ''}>
  <div class="tool-grid">
    <div>
      <label for="hex-input">${t.input}</label>
      <textarea id="hex-input" data-role="input" spellcheck="false" aria-label="${t.input}"></textarea>
    </div>
    <div>
      <div class="preview-box"><canvas data-role="preview" aria-label="Decoded bitmap preview"></canvas></div>
      <div class="status" data-role="status" aria-live="polite"></div>
    </div>
  </div>
  <div class="controls">
    <label>${t.format}<select data-role="format">${options(HEX_FORMATS)}</select></label>
    <label>${t.width}<input type="number" data-role="width" min="1" max="1024"></label>
    <label>${t.height}<input type="number" data-role="height" min="1" max="1024"></label>
    <label class="inline"><input type="checkbox" data-role="lock" checked> ${t.lock}</label>
    <label class="inline"><input type="checkbox" data-role="invert"> ${t.invert}</label>
  </div>
  <div class="controls">
    <button type="button" class="btn" data-role="detect">${t.detect}</button>
    <button type="button" class="btn" data-role="clear">${t.clear}</button>
    <button type="button" class="btn" data-role="download">${t.download}</button>
    <button type="button" class="btn btn-primary" data-role="open-studio">${t.open}</button>
  </div>
</div>`
}

function imageToolHtml(page, t) {
  return `<div class="tool" data-tool="image"${page.format ? ` data-format="${page.format}"` : ''}${page.width ? ` data-width="${page.width}"` : ''}${page.height ? ` data-height="${page.height}"` : ''}>
  <label class="drop" data-role="drop">${t.drop}<input type="file" accept="image/*" data-role="file"></label>
  <div class="controls">
    <label>${t.width}<input type="number" data-role="width" min="1" max="1024"></label>
    <label>${t.height}<input type="number" data-role="height" min="1" max="1024"></label>
    <label class="inline"><input type="checkbox" data-role="keep" checked> ${t.keep}</label>
    <label>${t.dither}<select data-role="dither">${options(DITHERS)}</select></label>
    <label>${t.threshold}<input type="range" data-role="threshold" min="1" max="254" value="128"></label>
    <label class="inline"><input type="checkbox" data-role="invert"> ${t.invert}</label>
    <label>${t.format}<select data-role="format">${options(IMAGE_FORMATS)}</select></label>
    <label>${t.var}<input type="text" data-role="var" value="bitmap" size="12"></label>
  </div>
  <div class="tool-grid">
    <div>
      <div class="preview-box"><canvas data-role="preview" aria-label="1-bit preview"></canvas></div>
      <div class="status" data-role="status" aria-live="polite"></div>
    </div>
    <div>
      <textarea data-role="output" readonly spellcheck="false" aria-label="Generated code"></textarea>
      <div class="controls">
        <button type="button" class="btn btn-primary" data-role="copy" data-label="${t.copy}">${t.copy}</button>
        <button type="button" class="btn" data-role="download">${t.download}</button>
      </div>
    </div>
  </div>
</div>`
}

function jsonLd(page, t) {
  const url = pageUrl(page.slug)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: page.h1,
        url,
        description: page.description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (web browser)',
        browserRequirements: 'Requires JavaScript',
        inLanguage: page.lang,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        author: { '@type': 'Person', name: 'Mitra Zahiri', url: 'https://github.com/MitraZahiri' },
        isPartOf: { '@id': `${SITE_URL}#webapp` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'LCD Mockup Studio', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: t.tools, item: `${SITE_URL}tools/` },
          { '@type': 'ListItem', position: 3, name: page.h1, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

function layout({ lang, title, description, canonical, alternates = [], body, ld, t }) {
  const hreflang = alternates
    .map(([l, href]) => `    <link rel="alternate" hreflang="${l}" href="${href}" />`)
    .join('\n')
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="Mitra Zahiri" />
    <link rel="canonical" href="${canonical}" />
${hreflang}
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg" />
    <meta name="theme-color" content="#161b22" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="LCD Mockup Studio" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${SITE_URL}og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${SITE_URL}og-image.png" />
    <script>
      window.LCD_ANALYTICS_CONFIG = { gaMeasurementId: '', goatCounterCode: '', debug: false };
    </script>
    <script type="application/ld+json">${JSON.stringify(ld)}</script>
  </head>
  <body>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="../../">LCD Mockup <span>Studio</span></a>
        <nav aria-label="Main">
          <a href="../hex-to-image/">Hex → Image</a>
          <a href="../image-to-c-array/">Image → C Array</a>
          <a href="../ssd1306-bitmap-converter/">SSD1306</a>
          <a href="../">${t.tools}</a>
          <a href="../../">${t.home}</a>
        </nav>
      </div>
    </header>
    <main class="wrap">
${body}
    </main>
    <footer class="site-footer">
      <div class="wrap">
        <p>${t.footer}</p>
        <p><a href="../../">LCD Mockup Studio</a> · <a href="https://github.com/MitraZahiri/lcd-mockup-studio">GitHub</a> · <a href="https://buymeacoffee.com/mitra.zahiri">Buy me a coffee</a></p>
      </div>
    </footer>
    <script type="module" src="../../src/seo/landing.js"></script>
  </body>
</html>
`
}

function renderPage(page) {
  const t = UI[page.lang]
  const tool = page.tool === 'hex' ? hexToolHtml(page, t.hex) : imageToolHtml(page, t.image)
  const related = PAGES.filter((p) => p.slug !== page.slug && p.lang === page.lang)
  const relatedOther = PAGES.filter((p) => p.lang !== page.lang && page.alternate?.[p.lang] === p.slug)

  const sections = page.sections.map((s) => `      <section>\n        <h2>${s.h2}</h2>\n        ${s.html}\n      </section>`).join('\n')
  const faq = page.faq
    .map((f) => `        <details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join('\n')

  const body = `      <p class="breadcrumb"><a href="../../">LCD Mockup Studio</a> › <a href="../">${t.tools}</a> › ${esc(page.h1)}</p>
      <h1>${esc(page.h1)}</h1>
      <p class="lead">${page.lead}</p>
${tool}
${sections}
      <section class="faq">
        <h2>${t.faq}</h2>
${faq}
      </section>
      <section class="cta">
        <h2>${t.openStudio}</h2>
        <p>${t.openStudioText}</p>
        <p><a class="btn btn-primary" href="../../">${t.launch}</a></p>
      </section>
      <section>
        <h2>${t.related}</h2>
        <ul class="related">
${[...related, ...relatedOther].map((p) => `          <li><a href="../${p.slug}/">${esc(p.navLabel)}</a></li>`).join('\n')}
        </ul>
      </section>`

  const alternates = []
  if (page.alternate) {
    alternates.push([page.lang, pageUrl(page.slug)])
    for (const [l, slug] of Object.entries(page.alternate)) alternates.push([l, pageUrl(slug)])
    if (page.lang === 'en') alternates.push(['x-default', pageUrl(page.slug)])
    else alternates.push(['x-default', pageUrl(page.alternate.en)])
  }

  return layout({
    lang: page.lang,
    title: page.title,
    description: page.description,
    canonical: pageUrl(page.slug),
    alternates,
    body,
    ld: jsonLd(page, t),
    t,
  })
}

function renderHub() {
  const t = UI.en
  const card = (p) => `          <li><a href="${p.slug}/"><strong>${esc(p.h1)}</strong><br><span style="color:var(--muted)">${esc(stripTags(p.lead)).slice(0, 120)}…</span></a></li>`
  const body = `      <p class="breadcrumb"><a href="../">LCD Mockup Studio</a> › ${t.tools}</p>
      <h1>${t.toolsTitle}</h1>
      <p class="lead">Convert images to C arrays, decode hex bytes back to images and create bitmaps for Arduino, ESP32, SSD1306 OLED, Nokia 5110 and TFT displays. Every tool is free and runs in your browser.</p>
      <section>
        <h2>Decode hex &amp; C arrays</h2>
        <ul class="related">
${PAGES.filter((p) => p.lang === 'en' && p.tool === 'hex').map(card).join('\n')}
        </ul>
      </section>
      <section>
        <h2>Convert images to code</h2>
        <ul class="related">
${PAGES.filter((p) => p.lang === 'en' && p.tool === 'image').map(card).join('\n')}
        </ul>
      </section>
      <section>
        <h2>Türkçe araçlar</h2>
        <ul class="related">
${PAGES.filter((p) => p.lang === 'tr').map(card).join('\n')}
        </ul>
      </section>`
  // The hub lives one level higher than the tool pages, so fix relative links.
  return layout({
    lang: 'en',
    title: 'Free Online Bitmap, Hex to Image & OLED Tools — LCD Mockup Studio',
    description: 'Free browser tools for embedded developers: hex to image, C array to image, image to C array, SSD1306, U8g2 XBM, Nokia 5110, RGB565 and MicroPython bitmap converters.',
    canonical: `${SITE_URL}tools/`,
    body,
    ld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'LCD Mockup Studio Tools',
      url: `${SITE_URL}tools/`,
      hasPart: PAGES.map((p) => ({ '@type': 'WebPage', name: p.h1, url: pageUrl(p.slug) })),
    },
    t,
  })
    .replace(/href="\.\.\/\.\.\/"/g, 'href="../"')
    .replace(/href="\.\.\/\.\.\/favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/href="\.\.\/([a-z0-9-]+)\/"/g, 'href="$1/"')
    .replace('href="../">Tools', 'href="./">Tools')
    .replace('src="../../src/seo/landing.js"', 'src="../src/seo/landing.js"')
}

function renderSitemap() {
  const urls = [
    { loc: SITE_URL, priority: '1.0' },
    { loc: `${SITE_URL}tools/`, priority: '0.9' },
    ...PAGES.map((p) => ({ loc: pageUrl(p.slug), priority: p.lang === 'en' ? '0.8' : '0.7' })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

rmSync(TOOLS_DIR, { recursive: true, force: true })
for (const page of PAGES) write(join(TOOLS_DIR, page.slug, 'index.html'), renderPage(page))
write(join(TOOLS_DIR, 'index.html'), renderHub())
write(join(ROOT, 'public', 'sitemap.xml'), renderSitemap())

console.log(`Generated ${PAGES.length} landing pages + hub and sitemap.xml`)
