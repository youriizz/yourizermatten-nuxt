export function useIsDesktop() {
  const isDesktop = ref(true)

  onMounted(() => {
    const update = () => { isDesktop.value = window.innerWidth > 768 }
    update()
    window.addEventListener('resize', update)
    onUnmounted(() => window.removeEventListener('resize', update))
  })

  return isDesktop
}
