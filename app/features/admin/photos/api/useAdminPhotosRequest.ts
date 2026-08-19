import type { AdminPhoto } from '~/entities/admin'

export function useAdminPhotosRequest() {
  const client = useSanctumClient()

  function getAccountPhotos(userId: number): Promise<AdminPhoto[]> {
    return client<AdminPhoto[]>(`/api/admin/users/${userId}/photos`)
  }

  function deletePhoto(photoId: number): Promise<void> {
    return client(`/api/admin/photos/${photoId}`, { method: 'DELETE' })
  }

  return { getAccountPhotos, deletePhoto }
}
