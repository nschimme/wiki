#!/usr/bin/env node
/**
 * Migration script: _pages/ → docs/pages/  and  assets/img/ → docs/public/img/
 *
 * Transforms:
 *  1. Image paths:  ![](Foo.jpg "Foo.jpg")  →  ![Foo](/img/Foo.jpg)
 *  2. Wikilinks:    [text](Page "wikilink") →  [text](./Page.md)
 *  3. Includes:     {% include X.md %}      →  <!--@include: ../includes/X.md-->
 *  4. Frontmatter:  strip layout:, add description: from first paragraph
 *  5. Bad tags:     remove single-occurrence junk tags (URLs, wikilinks, etc.)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const SRC = path.join(root, '_pages')
const DEST = path.join(root, 'docs', 'pages')
const IMG_SRC = path.join(root, 'assets', 'img')
const IMG_DEST = path.join(root, 'docs', 'public', 'img')

// --- helpers ----------------------------------------------------------------

function copyImages() {
  if (!fs.existsSync(IMG_DEST)) fs.mkdirSync(IMG_DEST, { recursive: true })
  for (const f of fs.readdirSync(IMG_SRC)) {
    fs.copyFileSync(path.join(IMG_SRC, f), path.join(IMG_DEST, f))
  }
  console.log(`Copied images to ${IMG_DEST}`)
}

/** Return first non-empty non-heading paragraph text (for SEO description) */
function extractDescription(body) {
  for (const line of body.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#') || t.startsWith('|') || t.startsWith('!') || t.startsWith('<') || t.startsWith('<!--')) continue
    // Strip markdown bold/italic/links
    const plain = t
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim()
    if (plain.length > 20) return plain.slice(0, 160)
  }
  return ''
}

/** Tag is "clean" if it looks like a real category, not a list item or URL */
function isCleanTag(tag) {
  if (!tag || tag.length > 50) return false
  if (/^[\[*(<"0-9+\-]/.test(tag)) return false
  if (tag.includes('http')) return false
  if (tag.includes('wikilink')) return false
  if (/[?!{}]/.test(tag)) return false
  return true
}

function transformContent(raw) {
  // --- parse frontmatter ---
  let frontmatter = {}
  let body = raw
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (fmMatch) {
    const fmRaw = fmMatch[1]
    body = fmMatch[2]

    // Parse title
    const titleMatch = fmRaw.match(/^title:\s*(.+)$/m)
    if (titleMatch) frontmatter.title = titleMatch[1].trim()

    // Parse tags (multi-line YAML list)
    const tagsMatch = fmRaw.match(/^tags:\s*\n((?:  - .+\n?)+)/m)
    if (tagsMatch) {
      const rawTags = tagsMatch[1]
        .split('\n')
        .map(l => l.replace(/^  - /, '').trim())
        .filter(Boolean)
      frontmatter.tags = rawTags.filter(isCleanTag)
    }
  }

  // --- transform body ---

  // 1. Images: ![](Foo.jpg "Foo.jpg") or ![](Foo.jpg "Title") or ![alt](Foo.jpg)
  body = body.replace(
    /!\[([^\]]*)\]\(([^)\s"]+\.(?:jpg|jpeg|png|gif|svg|webp))(?:\s+"[^"]*")?\)/gi,
    (_, alt, src) => {
      const filename = path.basename(src)
      const displayAlt = alt || filename.replace(/\.[^.]+$/, '')
      return `![${displayAlt}](/img/${filename})`
    }
  )

  // Also handle <img src="..."> HTML
  body = body.replace(
    /<img\s[^>]*src="([^"]+)"[^>]*>/gi,
    (_, src) => {
      const filename = path.basename(src)
      return `![${filename}](/img/${filename})`
    }
  )

  // 2. Wikilinks: [text](Page_Name "wikilink")
  body = body.replace(
    /\[([^\]]+)\]\(([^)]+)\s+"wikilink"\)/g,
    (_, text, target) => {
      // Keep target as-is (underscores preserved for file matching)
      return `[${text}](./${target}.md)`
    }
  )

  // 2b. Convert <spoiler>...</spoiler> to VitePress details containers
  body = body.replace(
    /<spoiler(?:\s[^>]*)?>([\s\S]*?)<\/spoiler>/gi,
    (_, content) => `\n::: details Spoiler\n${content.trim()}\n:::\n`
  )
  // Remove remaining MediaWiki-specific tags that have no Markdown equivalent
  body = body.replace(/<\/?(?:spoiler|noinclude|includeonly|onlyinclude|nowiki|ref|references|gallery)[^>]*>/gi, '')

  // 3. Jekyll includes: {% include Foo.md %} or {% include Foo.html %}
  body = body.replace(
    /\{%\s*include\s+([^\s%]+)\s*%\}/g,
    (_, filename) => `<!--@include: ../includes/${filename}-->`
  )

  // 4. Strip leftover Jekyll liquid tags
  body = body.replace(/\{%[^%]*%\}/g, '')
  body = body.replace(/\{\{[^}]*\}\}/g, '')

  // 5a. Escape <arg> game command syntax (not real HTML) so Vue doesn't choke.
  //     Only preserve the small set of HTML tags that are genuinely useful in
  //     markdown-HTML hybrid content. Everything else (including <title>, <body>,
  //     <object>, and game-syntax placeholders) gets escaped.
  const safeHtmlTags = new Set([
    'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'cite', 'code',
    'col', 'colgroup', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt',
    'em', 'figcaption', 'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hr', 'i', 'img', 'ins', 'kbd', 'li', 'mark', 'ol', 'p', 'pre',
    'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'small', 'span',
    'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot',
    'th', 'thead', 'tr', 'u', 'ul', 'var', 'wbr',
  ])
  body = body.replace(/<([^>]{1,80})>/g, (match, inner) => {
    if (inner.startsWith('!')) return match  // HTML comments / doctype
    const tagName = inner.replace(/^\//, '').split(/[\s/]/)[0].toLowerCase()
    if (safeHtmlTags.has(tagName)) return match
    return `&lt;${inner}&gt;`
  })

  // 5. Remove trailing backslash-bracket artifacts from MediaWiki conversion
  //    Actual bytes: ''\_]\_]  (two apostrophes, backslash-bracket twice)
  body = body.replace(/'*(?:\\\])+/g, '')

  // --- build new frontmatter ---
  const description = extractDescription(body)
  const lines = ['---']
  if (frontmatter.title) lines.push(`title: ${frontmatter.title}`)
  if (description) {
    // Use single-quoted YAML string; escape embedded single quotes as ''
    const safe = description
      .replace(/\\/g, '')      // strip backslashes
      .replace(/'/g, "''")     // escape single quotes for YAML
      .replace(/[\x00-\x1f]/g, '') // strip control chars
    lines.push(`description: '${safe}'`)
  }
  if (frontmatter.tags && frontmatter.tags.length > 0) {
    lines.push('tags:')
    for (const t of frontmatter.tags) lines.push(`  - ${t}`)
  }
  lines.push('---')

  return lines.join('\n') + '\n' + body
}

function migratePages() {
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true })

  const files = fs.readdirSync(SRC).filter(f => f.endsWith('.md'))
  let count = 0
  let errors = 0

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(SRC, file), 'utf8')
      const transformed = transformContent(raw)
      fs.writeFileSync(path.join(DEST, file), transformed)
      count++
    } catch (e) {
      console.error(`Error processing ${file}: ${e.message}`)
      errors++
    }
  }

  console.log(`Migrated ${count} pages (${errors} errors) to ${DEST}`)
}

// --- main -------------------------------------------------------------------
console.log('Starting migration...')
copyImages()
migratePages()
console.log('Done.')
