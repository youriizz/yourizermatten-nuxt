<template>
  <main
    class="page page-project"
    :class="{
      'has-dark-bg': hasDarkBg,
      'is-returning': returnPhase !== 'idle'
    }"
  >

    <!-- ── Desktop ── -->
    <template v-if="isDesktop">
      <ProjectVisuals
        v-if="mediaVisuals.length"
        :visuals="mediaVisuals"
        :index="visualIndex"
        :class="{ 'is-content-visible': contentVisible }"
      />

      <!-- Flèches visuels -->
      <button
        class="project-arrow project-arrow--prev is-clickable"
        :class="{ 'is-content-visible': contentVisible }"
        @click="prevVisual"
        @mouseenter="arrowHover = 'prev'"
        @mouseleave="arrowHover = null"
      >
        <img
          :src="assetUrl(arrowHover === 'prev' ? '/svg/arrow-left-grey.svg' : '/svg/arrow-left-white.svg')"
          alt="←" width="38" height="40"
        />
      </button>
      <button
        class="project-arrow project-arrow--next is-clickable"
        :class="{ 'is-content-visible': contentVisible }"
        @click="nextVisual"
        @mouseenter="arrowHover = 'next'"
        @mouseleave="arrowHover = null"
      >
        <img
          :src="assetUrl(arrowHover === 'next' ? '/svg/arrow-right-grey.svg' : '/svg/arrow-right-white.svg')"
          alt="→" width="38" height="40"
        />
      </button>

      <!-- Ticker description — reste visible pendant navigation projet→projet -->
      <ProjectDescriptionTicker
        :text="project.description ?? project.title"
        :ready="tickerReady"
      />

      <!-- Meta bar -->
      <ProjectMetaBar
        :project="project"
        :allProjects="allProjects ?? []"
        :navVisible="navVisible"
        :slideDir="pmbSlideDir"
        :returnBottomPx="returnBottomPx"
        :phase="returnPhase"
        @navigate="handleNavigate"
      />

      <!-- × close -->
      <button
        class="project-close is-clickable"
        :class="{ 'is-content-visible': contentVisible }"
        @click="handleClose"
      >
        <svg width="38" height="40" viewBox="0 0 38 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.5855 4.01586L0.505084 35.0626" stroke="currentColor"/>
          <path d="M36.8534 37.2387L2.52672 6.4644" stroke="currentColor"/>
        </svg>
      </button>
    </template>

    <!-- ── Mobile ── -->
    <template v-else>
      <button class="project-mobile__cross" @click="handleClose">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5453 2.00793L0.505082 17.5313" stroke="currentColor"/>
          <path d="M18.6792 18.6193L1.5159 3.2322" stroke="currentColor"/>
        </svg>
      </button>

      <div class="project-mobile">
        <div class="project-mobile__items">

          <!-- 1. Titre (skew +12.75°) -->
          <div class="pmi pmi--title" :class="{ 'is-visible': mobileStep >= 1 }">
            <span class="pmi__inner">{{ project.title }}</span>
          </div>

          <!-- 2. Description (skew -12.75°) -->
          <div v-if="project.description" class="pmi pmi--desc" :class="{ 'is-visible': mobileStep >= 2 }">
            <span class="pmi__inner type-p1">{{ project.description }}</span>
          </div>

          <!-- 3. Lien (skew +12°) -->
          <div v-if="project.website" class="pmi pmi--link" :class="{ 'is-visible': mobileStep >= 3 }">
            <span class="pmi__inner type-p1">
              <a :href="project.website" target="_blank" rel="noopener">→ Link to the Website</a>
            </span>
          </div>

          <!-- 4. Year + Tags (skew -12.75°) -->
          <div class="pmi pmi--meta" :class="{ 'is-visible': mobileStep >= 4 }">
            <span class="pmi__inner type-p1">{{ [project.year, ...(project.tags ?? [])].join(', ') }}</span>
          </div>

          <!-- 5. Scroll indicator bleu (skew +12.75°) -->
          <div v-if="mediaVisuals.length" class="pmi pmi--scroll" :class="{ 'is-visible': mobileStep >= 5 }">
            <span class="pmi__inner type-p1 pmi-scroll-inner">
              <span class="pmi-scroll-text">Scroll to see the visuals</span>
              <span class="pmi-scroll-arrow">↓</span>
            </span>
          </div>

        </div>

        <div class="project-mobile__visuals">
          <div v-for="(v, i) in mediaVisuals" :key="i" class="project-mobile__visual-frame">
            <video v-if="v.type === 'video'" :src="assetUrl(v.src)" muted playsinline autoplay loop class="pmv-media" />
            <img v-else-if="v.type === 'image'" :src="assetUrl(v.src)" alt="" class="pmv-media" />
          </div>
        </div>

        <div class="project-mobile__back">
          <button class="project-mobile__backtop" @click="scrollToTop">↑ Back to top</button>
        </div>
      </div>
    </template>

  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const isDesktop = useIsDesktop()
const { assetUrl } = useAssetUrl()
const { state: transState, startReturning, reset, updateOriginForSlug } = useProjectTransition()

const slug = computed(() => route.params.slug as string)

const { data: project } = await useAsyncData(`project-${slug.value}`, () =>
  queryContent('projects', slug.value).findOne()
)
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found' })
useHead({ title: project.value.title })

const { data: allProjects } = await useAsyncData('projects', () =>
  queryContent('projects').sort({ year: -1 }).find()
)

const mediaVisuals = computed(() =>
  (project.value?.visuals ?? []).filter((v: any) => v.type === 'video' || v.type === 'image')
)

// Navigation circulaire des visuels
const visualIndex = ref(0)
function prevVisual() {
  const len = mediaVisuals.value.length
  if (len) visualIndex.value = (visualIndex.value - 1 + len) % len
}
function nextVisual() {
  const len = mediaVisuals.value.length
  if (len) visualIndex.value = (visualIndex.value + 1) % len
}

const arrowHover = ref<'prev' | 'next' | null>(null)

// Fond noir (retiré au retour pour révéler l'index)
const hasDarkBg      = ref(true)
const contentVisible = ref(false)
const tickerReady    = ref(false)   // true une fois, jamais remis à false
const navVisible     = ref(false)
const pmbSlideDir    = ref<null | 'left' | 'right'>(null)

// Direction de navigation en attente (avant le changement de slug)
const pendingNavDir = ref<null | 'prev' | 'next'>(null)

const durTransition = 300
const durRise       = 450
const durDeskew     = 250

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

onMounted(() => {
  // body.project-open uniquement sur desktop — sur mobile, fond blanc CSS suffit
  if (isDesktop.value) {
    document.body.classList.add('project-open')
  }

  if (!isDesktop.value) {
    // Mobile : fond blanc direct, pas de transition noire
    hasDarkBg.value = false
    contentVisible.value = true
    tickerReady.value = true
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => { mobileStep.value = i }, i * 100)
    }
  } else {
    requestAnimationFrame(() => {
      contentVisible.value = true
      // Ticker visible rapidement (outline puis texte)
      setTimeout(() => {
        tickerReady.value = true
      }, 50)
      // 5e transition : nav après la transition principale
      setTimeout(() => { navVisible.value = true }, durTransition + 100)
    })
    updateOriginForSlug(slug.value)
  }
})

onUnmounted(() => {
  document.body.classList.remove('project-open')
})

// Navigation projet→projet (même composant réutilisé)
watch(slug, (newSlug) => {
  visualIndex.value = 0

  const dir = pendingNavDir.value
  pendingNavDir.value = null

  // PMB slide selon la direction cliquée
  if (dir === 'prev')      pmbSlideDir.value = 'left'
  else if (dir === 'next') pmbSlideDir.value = 'right'
  else                     pmbSlideDir.value = null

  // Seulement les visuels et les boutons disparaissent — ticker reste visible
  navVisible.value = false
  contentVisible.value = false

  requestAnimationFrame(() => {
    contentVisible.value = true
    setTimeout(() => {
      pmbSlideDir.value = null
      navVisible.value = true
    }, durTransition + 100)
  })

  if (isDesktop.value) updateOriginForSlug(newSlug)
})

// ── Retour vers l'index ──
type ReturnPhase = 'idle' | 'rising' | 'deskewing'
const returnPhase    = ref<ReturnPhase>('idle')
const returnBottomPx = ref(48)

async function handleClose() {
  if (!isDesktop.value) {
    reset()
    router.push('/')
    return
  }

  // ① Fond et contenu disparaissent
  hasDarkBg.value = false
  document.body.classList.remove('project-open')
  contentVisible.value = false
  navVisible.value = false
  startReturning()
  await sleep(durTransition)

  // ② Meta bar monte vers la position de la ligne dans l'index
  const originTop = transState.value.originTop
  const barEl     = document.querySelector('.project-meta-bar') as HTMLElement | null
  const barHeight = barEl?.offsetHeight ?? 44
  const targetBottom = originTop > 0
    ? window.innerHeight - originTop - barHeight
    : window.innerHeight - barHeight

  returnBottomPx.value = 48
  returnPhase.value = 'rising'
  await nextTick()
  returnBottomPx.value = targetBottom
  await sleep(durRise)

  // ③ Dé-skew
  returnPhase.value = 'deskewing'
  await sleep(durDeskew)

  reset()
  router.push('/')
}

// Navigation PMB — mémorise direction + cible
function handleNavigate(targetSlug: string, dir: 'prev' | 'next') {
  pendingNavDir.value = dir
  updateOriginForSlug(targetSlug)
  router.push(`/projects/${targetSlug}`)
}

// Mobile accordion
const mobileStep = ref(0)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
