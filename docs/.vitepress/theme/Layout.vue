<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import NotFound from './NotFound.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

onMounted(() => {
  const hamburger = document.querySelector('.VPNavBarHamburger')
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      setTimeout(() => {
        const nav = document.querySelector('.VPNav')
        if (nav && hamburger) {
          const isExpanded = hamburger.getAttribute('aria-expanded') === 'true'
          if (isExpanded) {
            nav.classList.add('open')
          } else {
            nav.classList.remove('open')
          }
        }
      }, 50)
    })
  }
})
</script>

<template>
  <Layout>
    <template #doc-before>
      <StubNotice />
      <div v-if="frontmatter.hero && frontmatter.hero.image" class="hero-image-fix">
        <!-- Injected to ensure local images are used -->
      </div>
    </template>
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>
