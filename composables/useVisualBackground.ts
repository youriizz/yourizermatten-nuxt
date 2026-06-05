export function useVisualBackground() {
  const rowHoveredSlug = useState<string | null>('vbRowHovered', () => null)
  const frameHoveredSlug = useState<string | null>('vbFrameHovered', () => null)
  const activeSlug = computed(() => rowHoveredSlug.value ?? frameHoveredSlug.value)
  return { rowHoveredSlug, frameHoveredSlug, activeSlug }
}
