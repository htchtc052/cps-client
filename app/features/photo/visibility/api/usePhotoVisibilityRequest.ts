export function usePhotoVisibilityRequest() {
  const client = useSanctumClient()

  function updateVisibility(ids: number[], hidden: boolean): Promise<void> {
    return client('/api/photos/visibility', {
      method: 'PATCH',
      body: { ids, hidden },
    })
  }

  return {
    updateVisibility,
  }
}
