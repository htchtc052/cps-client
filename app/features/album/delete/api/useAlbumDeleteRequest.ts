export function useAlbumDeleteRequest() {
  const client = useSanctumClient()

  function deleteAlbum(id: number): Promise<void> {
    return client(`/api/albums/${id}`, { method: 'DELETE' })
  }

  return {
    deleteAlbum,
  }
}
