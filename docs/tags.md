---
title: Page Tag Index
description: Browse all MUME Wiki pages organized by category tag.
layout: page
---

<script setup>
import { data as tagsData } from './tags.data.ts'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const sortedTags = Object.keys(tagsData).sort((a, b) => a.localeCompare(b))

function tagsForLetter(letter) {
  return sortedTags.filter(t => t[0].toUpperCase() === letter)
}

function hasLetter(letter) {
  return sortedTags.some(t => t[0].toUpperCase() === letter)
}
</script>

# Page Tag Index

<div class="az-nav">
  <template v-for="letter in alphabet" :key="letter">
    <a v-if="hasLetter(letter)" :href="`#${letter}`">{{ letter }}</a>
    <span v-else>{{ letter }}</span>
  </template>
</div>

<div class="tag-index">
  <template v-for="letter in alphabet" :key="letter">
    <div v-if="hasLetter(letter)" class="tag-group">
      <h2 :id="letter" class="tag-letter">{{ letter }}</h2>
      <template v-for="tag in tagsForLetter(letter)" :key="tag">
        <div class="tag-name">{{ tag }}</div>
        <ul class="tag-pages">
          <li v-for="page in tagsData[tag]" :key="page.url">
            <a :href="page.url">{{ page.title }}</a>
          </li>
        </ul>
      </template>
    </div>
  </template>
</div>
