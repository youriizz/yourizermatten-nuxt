<template>
  <div class="description-ticker" :class="{ 'is-ready': ready }">
    <div class="description-ticker__track" ref="trackRef">
      <span ref="textRef" class="description-ticker__text">{{ text }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <span class="description-ticker__text" aria-hidden="true">{{ text }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  ready: boolean   // contrôlé par le parent — true une fois, jamais reset
}>()

const trackRef = ref<HTMLElement | null>(null)
const textRef  = ref<HTMLElement | null>(null)
let   entryAnim: Animation | null = null

function getSpeed(): number {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--ticker-speed')
  ) || 80
}

async function startTicker() {
  if (!trackRef.value || !textRef.value) return
  await nextTick()

  const track      = trackRef.value
  const containerW = (track.parentElement as HTMLElement)?.offsetWidth ?? 0
  const textW      = textRef.value.offsetWidth
  if (!textW || !containerW) return

  const speed    = getSpeed()
  const enterMs  = (containerW + textW) / speed * 1000   // durée phase entrée (ms)
  const loopSecs = (textW / speed).toFixed(2) + 's'      // durée boucle CSS

  console.log('[Ticker] startTicker', {
    containerW, textW,
    enterMs: Math.round(enterMs) + 'ms',
    loopSecs,
  })

  // Annule toute animation précédente
  if (entryAnim) { entryAnim.cancel(); entryAnim = null }

  // ① Parking : piste hors-écran droite → barre complètement vide
  track.style.animation  = 'none'
  track.style.transform  = `translateX(${containerW}px)`
  void track.offsetWidth // reflow — le browser traite l'état avant d'animer

  // ② Phase entrée (WAAPI) : texte entre par la droite, premier passage complet
  //    containerW → -textW : texte traverse tout l'écran et sort à gauche
  entryAnim = track.animate(
    [
      { transform: `translateX(${containerW}px)` },
      { transform: `translateX(${-textW}px)` },
    ],
    { duration: enterMs, easing: 'linear', fill: 'forwards' }
  )

  entryAnim.addEventListener('finish', () => {
    if (!trackRef.value) return
    console.log('[Ticker] entrée terminée → boucle seamless')

    // Commit l'état final (inline transform), puis cancel la WAAPI
    try { entryAnim?.commitStyles() } catch (_) {}
    entryAnim?.cancel()
    entryAnim = null

    const track = trackRef.value
    // ③ Boucle seamless RTL
    //    translateX(-textW) ≡ translateX(0) visuellement (2 copies identiques)
    //    on retire le transform inline → l'animation CSS repart depuis from{0}
    void track.offsetWidth                              // reflow avec la position committée
    track.style.transform = ''
    track.style.animation = `ticker-rtl ${loopSecs} linear infinite`
  })
}

onMounted(() => nextTick(startTicker))

// Redémarre à chaque changement de texte (navigation projet→projet)
watch(() => props.text, startTicker)
</script>
