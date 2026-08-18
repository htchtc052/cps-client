import type { AdminPhoto } from '~/entities/admin'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAdminPhotosRequest } from '../api/useAdminPhotosRequest'

export function useAdminPhotos() {
  const { getAccountPhotos } = useAdminPhotosRequest()
  const operation = useApiOperation(getAccountPhotos)
  const photos = ref<AdminPhoto[]>([])

  async function loadFor(userId: number): Promise<void> {
    photos.value = []

    const response = await operation.execute(userId)

    if (response.status === ApiResultStatus.Success) photos.value = response.data
  }

  return {
    photos,
    loadFor,
    isLoading: operation.isLoading,
  }
}
