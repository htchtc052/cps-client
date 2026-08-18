import type { AdminPhoto } from '~/entities/admin'

export function useAdminPhotosRequest() {
  const client = useSanctumClient()

  function getAccountPhotos(userId: number): Promise<AdminPhoto[]> {
    return client<AdminPhoto[]>(`/api/admin/users/${userId}/photos`)
  }

  function blockPhoto(photoId: number): Promise<AdminPhoto> {
    return client<AdminPhoto>(`/api/admin/photos/${photoId}/block`, { method: 'POST' })
  }

  function unblockPhoto(photoId: number): Promise<AdminPhoto> {
    return client<AdminPhoto>(`/api/admin/photos/${photoId}/block`, { method: 'DELETE' })
  }

  return { getAccountPhotos, blockPhoto, unblockPhoto }
}
