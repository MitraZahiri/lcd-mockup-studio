import test from 'node:test'
import assert from 'node:assert/strict'
import { PAGES } from '../scripts/seo-pages.data.js'

test('SEO landing pages have unique slugs and titles', () => {
  const slugs = PAGES.map((p) => p.slug)
  const titles = PAGES.map((p) => p.title)
  assert.equal(new Set(slugs).size, slugs.length)
  assert.equal(new Set(titles).size, titles.length)
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/)
})

test('SEO landing pages are complete', () => {
  for (const p of PAGES) {
    assert.ok(['hex', 'image'].includes(p.tool), `${p.slug} tool`)
    assert.ok(['en', 'tr'].includes(p.lang), `${p.slug} lang`)
    assert.ok(p.description.length >= 80 && p.description.length <= 230, `${p.slug} description length`)
    assert.ok(p.sections.length > 0, `${p.slug} sections`)
    assert.ok(p.faq.length > 0, `${p.slug} faq`)
  }
})

test('hreflang alternates point at existing pages in both directions', () => {
  const bySlug = new Map(PAGES.map((p) => [p.slug, p]))
  for (const p of PAGES) {
    for (const [lang, slug] of Object.entries(p.alternate || {})) {
      const other = bySlug.get(slug)
      assert.ok(other, `${p.slug} → ${slug} exists`)
      assert.equal(other.lang, lang)
      assert.equal(other.alternate?.[p.lang], p.slug, `${slug} links back to ${p.slug}`)
    }
  }
})
