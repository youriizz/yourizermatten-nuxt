<template>
  <div
    class="project-transition-bar type-p1"
    :class="{ 'is-at-bottom': isAtBottom }"
    :style="{ '--origin-top': `${state.originTop}px` }"
  >
    <!-- Même structure que projects-link/is-active -->
    <span class="projects-link is-active">
      <span class="projects-col projects-year">{{ state.year }}</span>
      <span class="projects-col projects-title">{{ state.title }}</span>
      <span class="projects-preview-slot"></span>
      <span class="projects-col projects-tags">{{ state.tags?.join(', ') }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const { state } = useProjectTransition()
const isAtBottom = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isAtBottom.value = true
    })
  })
})
</script>
