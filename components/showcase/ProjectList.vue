<template>
  <section id="projects-index" class="projects-index type-p1" data-showcase-view="index">
    <div class="projects-index__inner">
      <ul class="projects-list">
        <li
          v-for="project in projects"
          :key="project.slug"
          class="projects-item"
          :data-slug="project.slug"
          :class="{ 'is-active': activeSlug === project.slug }"
          @mouseenter="rowHoveredSlug = project.slug"
          @mouseleave="rowHoveredSlug = null"
          @click="onItemClick(project, $event)"
        >
          <span class="projects-link is-clickable">
            <span class="projects-col projects-year">{{ project.year }}</span>
            <span class="projects-col projects-title">{{ project.title }}</span>
            <span class="projects-preview-slot" aria-hidden="true"></span>
            <span class="projects-col projects-tags">{{ project.tags?.join(', ') }}</span>
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ projects: any[] }>()

const { rowHoveredSlug, activeSlug } = useVisualBackground()
const { startEntering, storeRowPosition } = useProjectTransition()
const isDesktop = useIsDesktop()
const router = useRouter()

function onItemClick(project: any, event: MouseEvent) {
  const li = event.currentTarget as HTMLElement
  const rect = li.getBoundingClientRect()
  startEntering(project, rect.top)
  // Desktop : attendre l'animation de la barre noire (350ms)
  // Mobile : juste laisser le fade CSS (200ms)
  setTimeout(() => {
    router.push(`/projects/${project.slug}`)
  }, isDesktop.value ? 350 : 200)
}

onMounted(() => {
  // Stocker la position de chaque ligne pour l'animation de retour
  nextTick(() => {
    document.querySelectorAll<HTMLElement>('.projects-item[data-slug]').forEach(el => {
      const slug = el.dataset.slug
      if (slug) storeRowPosition(slug, el.getBoundingClientRect().top)
    })
  })
})
</script>
