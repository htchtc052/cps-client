export function useAlbumMembershipRequest() {
  const client = useSanctumClient()

  function removePhotos(albumId: number, ids: number[]): Promise<void> {
    return client(`/api/albums/${albumId}/photos`, {
      method: 'DELETE',
      body: { ids },
    })
  }

  return {
    removePhotos,
  }
}
