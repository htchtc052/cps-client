import type { AccountPhoto } from '~/entities/photo'

export function usePhotoSharingRequest() {
  const client = useSanctumClient()

  function enableSharing(photoId: number): Promise<AccountPhoto> {
    return client<AccountPhoto>(`/api/photos/${photoId}/share`, { method: 'POST' })
  }

  function disableSharing(photoId: number): Promise<void> {
    return client(`/api/photos/${photoId}/share`, { method: 'DELETE' })
  }

  function getSharedPhotos(): Promise<AccountPhoto[]> {
    return client<AccountPhoto[]>('/api/photos/shared')
  }

  return {
    enableSharing,
    disableSharing,
    getSharedPhotos,
  }
}
