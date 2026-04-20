import { defineConfig } from 'vitepress'

export default defineConfig({
  markdown: {
    config(md) {
      // Render absolute-path images as plain HTML <img> so VitePress doesn't try
      // to resolve /img/*.jpg as ES module imports (fails for missing public assets).
      const defaultRule = md.renderer.rules.image
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const src = token.attrGet('src') ?? ''
        if (src.startsWith('/')) {
          const alt = token.content.replace(/"/g, '&quot;')
          return `<img src="${src}" alt="${alt}" loading="lazy">`
        }
        if (defaultRule) return defaultRule(tokens, idx, options, env, self)
        return self.renderToken(tokens, idx, options)
      }
    },
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
      pattern: 'https://github.com/MUME/wiki/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MUME/wiki' },
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

  sitemap: {
    hostname: 'https://wiki.mume.org',
  },

  // Suppress deadlink warnings for the many cross-page wikilinks
  ignoreDeadLinks: true,
})
