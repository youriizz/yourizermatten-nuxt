<template>
  <div
    class="project-meta-bar type-p1"
    :class="returnClass"
    :style="returnStyle"
  >
    <div
      class="projects-link is-active pmb-inner"
      :class="{
        'nav-is-visible': navVisible,
        'slide-from-left':  slideDir === 'left',
        'slide-from-right': slideDir === 'right',
      }"
    >

      <!-- Prev project -->
      <button
        class="pmb-nav-btn pmb-nav-btn--prev"
        @click.stop="$emit('navigate', prevProject.slug, 'prev')"
      >
      
        <span class="pmb-nav-label">{{ prevProject.title }}</span>
        <svg class="pmb-arrow" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.11628 19.7071L34.2744 19.7071M10.5556 31.5522L3.11628 19.7071L10.5556 10.6436" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>

      <!-- Contenu centre (year · title · tags) -->
      <span class="pmb-center">
        <span class="pmb-col pmb-year">{{ project.year }}</span>
        <span class="pmb-col pmb-title">{{ project.title }}</span>
        <span class="pmb-col pmb-tags">{{ project.tags?.join(', ') }}</span>
      </span>

      <!-- Next project -->
      <button
        class="pmb-nav-btn pmb-nav-btn--next"
        @click.stop="$emit('navigate', nextProject.slug, 'next')"
      >
        <span class="pmb-nav-label">{{ nextProject.title }}</span>
        <svg class="pmb-arrow" width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.2744 19.5393L3.11629 19.5393M27.1678 10.4646L34.2744 19.5393L26.2661 30.5856" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  project: any
  allProjects: any[]
  navVisible: boolean
  slideDir: null | 'left' | 'right'
  returnBottomPx: number
  phase: 'idle' | 'rising' | 'deskewing'
}>()

defineEmits<{
  navigate: [slug: string, dir: 'prev' | 'next']
}>()

// Navigation circulaire
const currentIndex = computed(() =>
  props.allProjects.findIndex(p => p.slug === props.project.slug)
)
const prevProject = computed(() => {
  const len = props.allProjects.length
  if (!len) return { slug: '', title: '' }
  return props.allProjects[(currentIndex.value - 1 + len) % len]
})
const nextProject = computed(() => {
  const len = props.allProjects.length
  if (!len) return { slug: '', title: '' }
  return props.allProjects[(currentIndex.value + 1) % len]
})

// Log des largeurs réelles PMB vs projects-link (avant 5e transition)
watch(() => props.navVisible, (val) => {
  if (val) return // uniquement AVANT l'apparition des nav buttons
  nextTick(() => {
    const inner   = document.querySelector('.pmb-inner') as HTMLElement | null
    const center  = document.querySelector('.pmb-center') as HTMLElement | null
    const year    = document.querySelector('.pmb-year') as HTMLElement | null
    const title   = document.querySelector('.pmb-title') as HTMLElement | null
    const tags    = document.querySelector('.pmb-tags') as HTMLElement | null
    const plYear  = document.querySelector('.projects-year') as HTMLElement | null
    const plTitle = document.querySelector('.projects-title') as HTMLElement | null
    const plTags  = document.querySelector('.projects-tags') as HTMLElement | null

    console.log('[PMB] widths avant 5e transition', {
      innerW:  inner?.offsetWidth,
      centerW: center?.offsetWidth,
      pmbYear:  year?.offsetWidth,
      pmbTitle: title?.offsetWidth,
      pmbTags:  tags?.offsetWidth,
      plYear:   plYear?.offsetWidth  ?? 'index non visible',
      plTitle:  plTitle?.offsetWidth ?? 'index non visible',
      plTags:   plTags?.offsetWidth  ?? 'index non visible',
      pmbCenterGap: center ? getComputedStyle(center).gap : '?',
    })
  })
})

const returnClass = computed(() => ({
  'is-rising':    props.phase === 'rising',
  'is-deskewing': props.phase === 'deskewing',
}))

const returnStyle = computed(() => {
  if (props.phase === 'idle') return {}
  return { bottom: `${props.returnBottomPx}px` }
})
</script>
