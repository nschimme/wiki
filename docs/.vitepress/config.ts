import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

let pagesMeta = { terms: {}, paths: [] }
try {
  pagesMeta = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'pages-meta.json'), 'utf-8'))
} catch (e) {}
const sortedTerms = Object.keys(pagesMeta.terms || {}).sort((a, b) => b.length - a.length)
const validPaths = new Set(pagesMeta.paths || [])

const editRepo = process.env.EDIT_REPO || 'MUME/wiki'
const editBranch = process.env.EDIT_BRANCH || 'main'

export default defineConfig({
  vite: {
    define: {
      __EDIT_REPO__: JSON.stringify(editRepo),
      __EDIT_BRANCH__: JSON.stringify(editBranch),
    },
    plugins: [
      {
        name: 'public-image-shim',
        enforce: 'pre',
        resolveId(id: string) {
          if (/\.(png|jpe?g|gif|svg|webp|ico|avif)(\?.*)?$/.test(id)) {
            return `\0img:${id}`
          }
        },
        load(id: string) {
          if (id.startsWith('\0img:')) {
            const imgPath = id.slice(5) // keep leading /
            const base = (process.env.VITEPRESS_BASE ?? '/').replace(/\/$/, '')
            return `export default ${JSON.stringify(base + imgPath)}`
          }
        },
      },
    ],
  },

  title: 'MUME Wiki',
  description: 'A community wiki and guide to surviving in Multi-Users in Middle-earth.',
  base: process.env.VITEPRESS_BASE ?? '/',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/img/Main_Gandalf.png' }],
    ['meta', { name: 'theme-color', content: '#1a1410' }],
  ],

  themeConfig: {
    logo: '/img/Main_Gandalf.png',
    siteTitle: 'MUME Wiki',

    nav: [
      { text: 'Classes', link: '/classes' },
      { text: 'Races', link: '/races' },
      { text: 'Guides', link: '/guides' },
      { text: 'Lore', link: '/lore' },
      { text: 'Equipment', link: '/equipment' },
      { text: 'Community', link: '/community' },
      { text: 'Tags', link: '/tags' },
      {
        text: 'MUME',
        items: [
          { text: 'Homepage', link: 'https://mume.org/' },
          { text: 'Forum', link: 'https://mume.org/forum' },
          { text: 'MMapper', link: 'https://github.com/MUME/MMapper' },
        ],
      },
    ],

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
      },
    },

    editLink: {
      pattern: `https://github.com/${editRepo}/edit/${editBranch}/docs/:path`,
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: `https://github.com/${editRepo}` },
    ],

    footer: {
      message: 'MUME Wiki — community documentation for Multi-Users in Middle-earth',
      copyright: 'Content © respective contributors',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },

  markdown: {
    config(md) {
      // 1. Core auto-linking for text
      md.core.ruler.after('inline', 'auto-link', (state) => {
        const currentUrl = state.env.relativePath
          ? '/' + state.env.relativePath.replace(/\.md$/, '').replace(/\\/g, '/')
          : '';
        const usedTerms = new Set();

        // Pre-scan for existing links to avoid double-linking
        for (const token of state.tokens) {
          if (token.type !== 'inline') continue;
          for (const child of token.children || []) {
            if (child.type === 'link_open') {
              const href = child.attrs?.find(a => a[0] === 'href')?.[1];
              if (href && !href.startsWith('http') && !href.startsWith('#')) {
                let absoluteHref;
                if (href.startsWith('/')) {
                  absoluteHref = href.replace(/\.md$/, '');
                } else {
                  const dir = path.dirname(state.env.relativePath || '');
                  absoluteHref = '/' + path.join(dir, href).replace(/\.md$/, '').replace(/\\/g, '/');
                  if (absoluteHref === '/.') absoluteHref = '/';
                }
                for (const [term, url] of Object.entries(pagesMeta.terms || {})) {
                  if (url === absoluteHref || url === absoluteHref.replace('/pages/', '/')) {
                    usedTerms.add(term);
                  }
                }
              }
            }
          }
        }

        for (const token of state.tokens) {
          if (token.type !== 'inline') continue;

          let children = token.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.type !== 'text') continue;

            let isInLink = false;
            for (let j = i - 1; j >= 0; j--) {
              if (children[j].type === 'link_open') { isInLink = true; break; }
              if (children[j].type === 'link_close') break;
            }
            if (isInLink) continue;

            const text = child.content;
            let bestMatch = null;
            let bestIndex = -1;

            for (const term of sortedTerms) {
              if (usedTerms.has(term)) continue;
              const targetUrl = pagesMeta.terms[term];
              if (targetUrl === currentUrl || targetUrl === currentUrl.replace('/pages/', '/')) continue;

              const index = text.toLowerCase().indexOf(term);
              if (index !== -1) {
                const before = index > 0 ? text[index - 1] : ' ';
                const after = index + term.length < text.length ? text[index + term.length] : ' ';
                if (/\w/.test(before) || /\w/.test(after)) continue;

                if (bestMatch === null || term.length > bestMatch.length) {
                  bestMatch = term;
                  bestIndex = index;
                }
              }
            }

            if (bestMatch) {
              usedTerms.add(bestMatch);
              const targetUrl = pagesMeta.terms[bestMatch];
              const beforeText = text.slice(0, bestIndex);
              const matchText = text.slice(bestIndex, bestIndex + bestMatch.length);
              const afterText = text.slice(bestIndex + bestMatch.length);
              const newTokens = [];
              if (beforeText) {
                const t = new state.Token('text', '', 0);
                t.content = beforeText;
                t.level = child.level;
                newTokens.push(t);
              }
              const linkOpen = new state.Token('link_open', 'a', 1);
              linkOpen.attrs = [['href', targetUrl]];
              newTokens.push(linkOpen);
              const tMatch = new state.Token('text', '', 0);
              tMatch.content = matchText;
              tMatch.level = child.level + 1;
              newTokens.push(tMatch);
              newTokens.push(new state.Token('link_close', 'a', -1));
              if (afterText) {
                const tAfter = new state.Token('text', '', 0);
                tAfter.content = afterText;
                tAfter.level = child.level;
                newTokens.push(tAfter);
              }
              children.splice(i, 1, ...newTokens);
              i += newTokens.length - 1;
            }
          }
        }
      });

      // 2. Scrub dead links from existing markdown links
      md.core.ruler.after('auto-link', 'scrub-dead', (state) => {
        const filePath = state.env.path;
        if (!filePath) return;
        const fileDir = path.dirname(filePath);

        for (const token of state.tokens) {
          if (token.type !== 'inline') continue;
          let children = token.children;
          // Iterate backwards to safely remove tokens
          for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].type === 'link_open') {
              const hrefAttr = children[i].attrs?.find(a => a[0] === 'href');
              if (hrefAttr) {
                const href = hrefAttr[1];
                if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) continue;

                const targetPathOnly = href.split('#')[0];
                if (!targetPathOnly) continue;

                // Resolve absolute path from site root
                let absoluteFromRoot;
                if (targetPathOnly.startsWith('/')) {
                  absoluteFromRoot = targetPathOnly.replace(/\.md$/, '');
                } else {
                  // Resolve relative to current file
                  const relToDocs = path.relative(path.resolve('docs'), path.resolve(fileDir, targetPathOnly));
                  absoluteFromRoot = '/' + relToDocs.replace(/\.md$/, '').replace(/\\/g, '/');
                  if (absoluteFromRoot === '/.') absoluteFromRoot = '/';
                }

                if (!validPaths.has(absoluteFromRoot) && !validPaths.has(absoluteFromRoot.replace('/pages/', '/'))) {
                  // Dead link! Convert to text.
                  // Find link_close
                  let closeIdx = -1;
                  for (let j = i + 1; j < children.length; j++) {
                    if (children[j].type === 'link_close') { closeIdx = j; break; }
                  }
                  if (closeIdx !== -1) {
                    children.splice(closeIdx, 1);
                    children.splice(i, 1);
                  }
                }
              }
            }
          }
        }
      });
    }
  },

  ignoreDeadLinks: false,
})
