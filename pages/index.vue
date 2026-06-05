<template>
  <main
    class="page page-index"
    data-page-type="index"
    :class="{ 'is-transitioning': isTransitioning }"
  >
    <ClientOnly><VisualBackground :projects="projects ?? []" /></ClientOnly>
    <ShowcaseProjectList :projects="projects ?? []" />
    <ClientOnly>
      <!-- Transition bar : desktop uniquement — sur mobile on fait un fade CSS simple -->
      <ProjectTransitionBar v-if="isTransitioning && isDesktop" />
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
useHead({ title: 'Youri Zermatten' })

const isDesktop = useIsDesktop()

const { data: projects } = await useAsyncData('projects', () =>
  queryContent('projects').sort({ year: -1 }).find()
)

const { state: transState, reset } = useProjectTransition()
const isTransitioning = computed(() => transState.value.phase === 'entering')

onMounted(() => {
  // Reset si on revient d'une page projet
  if (transState.value.phase === 'returning') {
    setTimeout(() => reset(), 50)
  }
})
</script>
