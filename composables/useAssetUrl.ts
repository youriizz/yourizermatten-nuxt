export function useAssetUrl() {
  const { app } = useRuntimeConfig()

  function assetUrl(path: string | undefined | null): string {
    if (!path) return ''
    const base = (app.baseURL ?? '/').replace(/\/$/, '')
    return base + (path.startsWith('/') ? path : '/' + path)
  }

  return { assetUrl }
}
