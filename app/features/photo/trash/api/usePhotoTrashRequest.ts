import type { AccountPhoto } from '~/entities/photo'

export function usePhotoTrashRequest() {
  const client = useSanctumClient()

  function trashPhotos(ids: number[]): Promise<void> {
    return client('/api/photos/trash', {
      method: 'POST',
      body: { ids },
    })
  }

  function getTrashedPhotos(): Promise<AccountPhoto[]> {
    return client<AccountPhoto[]>('/api/photos/trash')
  }

  function restorePhoto(id: number): Promise<void> {
    return client(`/api/photos/${id}/restore`, { method: 'POST' })
  }

  function emptyTrash(): Promise<void> {
    return client('/api/photos/trash', { method: 'DELETE' })
  }

  return {
    trashPhotos,
    getTrashedPhotos,
    restorePhoto,
    emptyTrash,
  }
}
