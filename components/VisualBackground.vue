<template>
  <div
    class="visual-background"
    :class="{ 'is-active': activeSlug != null }"
  >
    <Transition :css="!isInstant" name="vb-fade">
      <video
        v-if="current?.type === 'video'"
        :key="current.src"
        class="vb-media"
        :src="current.src"
        muted
        playsinline
        autoplay
        loop
        @mouseenter="onFrameEnter"
        @mouseleave="onFrameLeave"
        @click="onMediaClick"
      />
      <img
        v-else-if="current?.type === 'image'"
        :key="current.src"
        class="vb-media"
        :src="current.src"
        alt=""
        @mouseenter="onFrameEnter"
        @mouseleave="onFrameLeave"
        @click="onMediaClick"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Asset {
  slug: string
  type: 'image' | 'video'
  src: string
}

const props = defineProps<{ projects: any[] }>()
const { rowHoveredSlug, frameHoveredSlug, activeSlug } = useVisualBackground()
const { startEntering, rowPositions } = useProjectTransition()
const router = useRouter()

const isInstant = ref(false)
const currentIndex = ref(0)
const shuffledFullPool = ref<Asset[]>([])
let timer: ReturnType<typeof setInterval> | null = null

const pool = computed<Asset[]>(() => {
  const result: Asset[] = []
  for (const p of props.projects) {
    if (p.background?.desktop) result.push({ slug: p.slug, type: 'image', src: p.background.desktop })
    for (const v of (p.visuals ?? [])) {
      if ((v.type === 'video' || v.type === 'image') && v.src) {
        result.push({ slug: p.slug, type: v.type as 'image' | 'video', src: v.src })
      }
    }
  }
  return result
})

const currentPool = computed<Asset[]>(() => {
  if (!rowHoveredSlug.value) return shuffledFullPool.value
  const filtered = pool.value.filter(a => a.slug === rowHoveredSlug.value)
  return filtered.length ? filtered : shuffledFullPool.value
})

const current = computed<Asset | undefined>(() => {
  const p = currentPool.value
  if (!p.length) return undefined
  return p[currentIndex.value % p.length]
})

function shuffle(arr: Asset[]): Asset[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function advance() {
  const p = currentPool.value
  if (p.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % p.length
}

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(advance, 3000)
}

watch(rowHoveredSlug, (newVal) => {
  if (!newVal) shuffledFullPool.value = shuffle(pool.value)
  isInstant.value = true
  currentIndex.value = 0
  startTimer()
  nextTick(() => { isInstant.value = false })
})

function onFrameEnter() {
  if (current.value) frameHoveredSlug.value = current.value.slug
}

function onFrameLeave() {
  frameHoveredSlug.value = null
}

function onMediaClick() {
  if (!current.value?.slug) return
  const slug = current.value.slug
  const project = props.projects.find(p => p.slug === slug)
  if (!project) return
  // Déclenche la même transition qu'un clic sur la ligne de la liste
  const rowTop = rowPositions.value[slug] ?? 0
  startEntering(project, rowTop)
  setTimeout(() => {
    router.push(`/projects/${slug}`)
  }, 350)
}

onMounted(() => {
  shuffledFullPool.value = shuffle(pool.value)
  if (shuffledFullPool.value.length > 0) {
    currentIndex.value = Math.floor(Math.random() * shuffledFullPool.value.length)
  }
  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
