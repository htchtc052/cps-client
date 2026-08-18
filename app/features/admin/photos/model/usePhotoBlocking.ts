import type { Ref } from 'vue'
import type { AdminPhoto } from '~/entities/admin'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAdminPhotosRequest } from '../api/useAdminPhotosRequest'

export function usePhotoBlocking(photos: Ref<AdminPhoto[]>) {
  const toast = useToast()
  const { blockPhoto, unblockPhoto } = useAdminPhotosRequest()
  const blockOperation = useApiOperation(blockPhoto)
  const unblockOperation = useApiOperation(unblockPhoto)

  async function toggleBlocking(photo: AdminPhoto): Promise<void> {
    const operation = photo.blockedAt === null ? blockOperation : unblockOperation
    const response = await operation.execute(photo.id)

    if (response.status !== ApiResultStatus.Success) return

    photos.value = photos.value.map(row => row.id === photo.id ? response.data : row)

    toast.add({
      title: response.data.blockedAt === null ? 'Photo unblocked.' : 'Photo blocked.',
      color: 'success',
    })
  }

  return {
    toggleBlocking,
    isBlocking: computed(() => blockOperation.isLoading.value || unblockOperation.isLoading.value),
  }
}
