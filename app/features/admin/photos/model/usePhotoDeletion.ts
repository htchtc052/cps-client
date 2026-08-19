import type { Ref } from 'vue'
import type { AdminPhoto } from '~/entities/admin'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAdminPhotosRequest } from '../api/useAdminPhotosRequest'

export function usePhotoDeletion(photos: Ref<AdminPhoto[]>) {
  const toast = useToast()
  const { deletePhoto } = useAdminPhotosRequest()
  const deleteOperation = useApiOperation(deletePhoto)

  async function remove(photo: AdminPhoto): Promise<void> {
    const response = await deleteOperation.execute(photo.id)

    if (response.status !== ApiResultStatus.Success) return

    photos.value = photos.value.filter(row => row.id !== photo.id)

    toast.add({ title: 'Photo deleted for every owner.', color: 'success' })
  }

  return { remove, isDeleting: deleteOperation.isLoading }
}
