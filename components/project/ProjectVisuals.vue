<template>
  <div class="project-visuals">
    <Transition name="pv-fade">
      <video
        v-if="current?.type === 'video'"
        :key="currentSrc"
        class="pv-media"
        :src="currentSrc"
        muted
        playsinline
        autoplay
        loop
      />
      <img
        v-else-if="current?.type === 'image'"
        :key="current.src"
        class="pv-media"
        :src="assetUrl(current.src)"
        alt=""
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  visuals: Array<{ type: string; src?: string; srcMobile?: string }>
  index: number
}>()

const { assetUrl } = useAssetUrl()
const isMobile = ref(false)

onMounted(() => {
  const mq = window.matchMedia('(max-width: 768px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', e => { isMobile.value = e.matches })
})

const current = computed(() => {
  const v = props.visuals.filter(v => v.type === 'video' || v.type === 'image')
  return v[props.index]
})

const currentSrc = computed(() => {
  const raw = (isMobile.value && current.value?.srcMobile) ? current.value.srcMobile : current.value?.src
  return assetUrl(raw)
})
</script>
