export function useAlbumAddPhotosRequest() {
  const client = useSanctumClient()

  function addPhotos(albumId: number, ids: number[]): Promise<void> {
    return client(`/api/albums/${albumId}/photos`, {
      method: 'POST',
      body: { ids },
    })
  }

  return {
    addPhotos,
  }
}
