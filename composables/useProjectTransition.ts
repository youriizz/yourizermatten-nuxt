interface TransitionState {
  phase: 'idle' | 'entering' | 'returning'
  slug: string | null
  year: string | number | null
  title: string | null
  tags: string[] | null
  originTop: number
}

function defaultState(): TransitionState {
  return { phase: 'idle', slug: null, year: null, title: null, tags: null, originTop: 0 }
}

export function useProjectTransition() {
  const state = useState<TransitionState>('projectTransition', defaultState)

  // Positions Y de chaque ligne dans l'index (persiste entre navigations SPA)
  const rowPositions = useState<Record<string, number>>('rowPositions', () => ({}))

  function startEntering(project: any, rowTop: number) {
    state.value = {
      phase: 'entering',
      slug: project.slug,
      year: project.year,
      title: project.title,
      tags: project.tags ?? [],
      originTop: rowTop,
    }
  }

  /** Stocker la position Y d'une ligne depuis le composant index */
  function storeRowPosition(slug: string, top: number) {
    rowPositions.value[slug] = top
  }

  /** Mettre à jour originTop pour un projet donné (navigation projet→projet) */
  function updateOriginForSlug(slug: string) {
    // toujours mettre à jour — fallback 0 si pas encore stocké
    state.value.originTop = rowPositions.value[slug] ?? 0
  }

  function startReturning() {
    state.value.phase = 'returning'
  }

  function reset() {
    state.value = defaultState()
  }

  return { state, rowPositions, startEntering, storeRowPosition, updateOriginForSlug, startReturning, reset }
}
