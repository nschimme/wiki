<template>
  <div class="not-found">
    <div class="not-found-inner">
      <div class="not-found-icon">⚔</div>
      <h1 class="not-found-title">Page Not Found</h1>

      <p v-if="pageName" class="not-found-page">
        <em>"{{ pageName }}"</em> does not yet exist in this wiki.
      </p>
      <p v-else class="not-found-page">
        This page does not exist yet.
      </p>

      <div class="not-found-actions">
        <button class="action-btn primary" @click="openSearch">
          Search for "{{ pageName || 'this topic' }}"
        </button>

        <a
          v-if="createUrl"
          :href="createUrl"
          target="_blank"
          rel="noopener"
          class="action-btn secondary"
        >
          Create this page on GitHub
        </a>
        <a
          v-else
          :href="`https://github.com/${editRepo}/new/${editBranch}/docs/pages`"
          target="_blank"
          rel="noopener"
          class="action-btn secondary"
        >
          Create a new page on GitHub
        </a>

        <a href="/" class="action-btn ghost">Return to Home</a>
      </div>

      <p class="not-found-hint">
        MUME Wiki is a community project. If you know about this topic,
        <a :href="createUrl || `https://github.com/${editRepo}`" target="_blank" rel="noopener">
          contribute a page
        </a>!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { inBrowser, useData } from 'vitepress'

const { site } = useData()
const pageName = ref('')
const rawSlug = ref('')

const editRepo = __EDIT_REPO__
const editBranch = __EDIT_BRANCH__

const createUrl = computed(() => {
  if (!rawSlug.value) return null
  const filename = rawSlug.value.replace(/\s+/g, '_') + '.md'
  const stub = [
    '---',
    `title: ${rawSlug.value}`,
    'description: ',
    'tags:',
    '  - ',
    '---',
    '',
    `# ${rawSlug.value}`,
    '',
    '<!-- Add content here -->',
  ].join('\n')
  return `https://github.com/${editRepo}/new/${editBranch}/docs/pages?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(stub)}`
})

function openSearch() {
  if (!inBrowser) return
  // Open VitePress local search modal
  const btn = document.querySelector<HTMLElement>('.VPNavBarSearch button, .search-root button')
  if (btn) {
    btn.click()
    // Pre-fill the search input after the modal opens
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('#localsearch-input, .VPLocalSearchBox input[type="search"]')
      if (input && pageName.value) {
        input.value = pageName.value
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.focus()
      }
    }, 80)
  }
}

onMounted(() => {
  if (!inBrowser) return
  const path = window.location.pathname
  // Strip base prefix, then get last meaningful segment
  const base = (site.value.base ?? '/').replace(/\/$/, '')
  const stripped = base ? path.replace(base, '') : path
  const slug = stripped.split('/').filter(Boolean).pop()?.replace(/\.html$/, '') ?? ''
  rawSlug.value = decodeURIComponent(slug).replace(/[_-]/g, ' ')
  pageName.value = rawSlug.value
    ? rawSlug.value.charAt(0).toUpperCase() + rawSlug.value.slice(1)
    : ''
})
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 3rem 1.5rem;
}

.not-found-inner {
  max-width: 520px;
  text-align: center;
}

.not-found-icon {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.not-found-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
  color: var(--mume-gold, #c9a84c);
  margin: 0 0 0.75rem;
  border: none !important;
}

.not-found-page {
  color: var(--vp-c-text-2, #b0a080);
  font-size: 1.05rem;
  margin: 0 0 2rem;
}

.not-found-page em {
  color: var(--vp-c-text-1, #d4c9b0);
  font-style: normal;
  font-weight: 600;
}

.not-found-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 2rem;
}

.action-btn {
  display: inline-block;
  min-width: 240px;
  padding: 0.55em 1.4em;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: var(--mume-gold, #c9a84c);
  color: #1a1410;
  border-color: var(--mume-gold, #c9a84c);
}
.action-btn.primary:hover {
  background: var(--mume-gold-light, #e0c070);
  border-color: var(--mume-gold-light, #e0c070);
}

.action-btn.secondary {
  background: transparent;
  color: var(--mume-gold, #c9a84c);
  border-color: var(--mume-gold, #c9a84c);
}
.action-btn.secondary:hover {
  background: rgba(201,168,76,0.1);
  text-decoration: none;
}

.action-btn.ghost {
  background: transparent;
  color: var(--vp-c-text-2, #b0a080);
  border-color: var(--mume-border, #3d3020);
}
.action-btn.ghost:hover {
  color: var(--mume-gold, #c9a84c);
  border-color: var(--mume-gold, #c9a84c);
  text-decoration: none;
}

.not-found-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-3, #8a7d65);
  margin: 0;
}

.not-found-hint a {
  color: var(--mume-gold, #c9a84c);
}
</style>
