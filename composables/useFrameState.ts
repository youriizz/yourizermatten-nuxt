export type TopLeftMode = 'default' | 'contact' | 'hidden'

interface FrameState {
  topLeftMode: TopLeftMode
  showBottomRight: boolean
}

export function useFrameState() {
  const route = useRoute()

  const state = computed<FrameState>(() => {
    if (route.path === '/contact') return { topLeftMode: 'contact', showBottomRight: true }
    if (route.path.startsWith('/projects/')) return { topLeftMode: 'hidden', showBottomRight: false }
    return { topLeftMode: 'default', showBottomRight: false }
  })

  return { state }
}
