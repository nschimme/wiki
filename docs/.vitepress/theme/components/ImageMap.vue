<template>
  <div class="image-map-container">
    <img src="/img/Middle-earth.png" alt="Map of Middle-earth" />
    <svg
      viewBox="0 0 800 560"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <template v-for="(area, index) in areas" :key="index">
        <a
          :xlink:href="area.href"
          :href="area.href"
          :title="area.title"
          class="map-area-link"
        >
          <circle v-if="area.type === 'circle'" :cx="area.cx" :cy="area.cy" :r="area.r" />
          <rect v-else-if="area.type === 'rect'" :x="area.x" :y="area.y" :width="area.width" :height="area.height" />
          <polygon v-else-if="area.type === 'poly'" :points="area.points" />
        </a>
      </template>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  areas: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.image-map-container {
  position: relative;
  width: 100%;
  margin: 1.5rem 0;
  border: 1px solid var(--mume-border);
  border-radius: 8px;
  overflow: hidden;
  line-height: 0;
}
.image-map-container img {
  display: block;
  width: 100%;
  height: auto;
  border: none;
  margin: 0;
}
.image-map-container svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.map-area-link {
  pointer-events: all;
  cursor: pointer;
  outline: none;
}

.map-area-link circle,
.map-area-link rect,
.map-area-link polygon {
  fill: transparent;
  stroke: transparent;
  transition: all 0.2s;
}

.map-area-link:hover circle,
.map-area-link:hover rect,
.map-area-link:hover polygon,
.map-area-link:focus circle,
.map-area-link:focus rect,
.map-area-link:focus polygon {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2px;
  fill: rgba(201, 168, 76, 0.15);
}
</style>
