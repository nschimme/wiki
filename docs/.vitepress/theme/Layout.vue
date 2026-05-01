<script setup>
import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <StubNotice />
    </template>
    <template #not-found>
      <NotFound />
    </template>
  </Layout>
</template>
