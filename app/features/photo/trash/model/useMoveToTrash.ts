import type { Ref } from 'vue'
import type { Photo } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePhotoTrashRequest } from '../api/usePhotoTrashRequest'

export function useMoveToTrash(photos: Ref<Photo[]>, clearSelection: () => void) {
  const toast = useToast()
  const { trashPhotos } = usePhotoTrashRequest()
  const { execute, isLoading } = useApiOperation(trashPhotos)

  async function moveToTrash(ids: number[]): Promise<void> {
    const response = await execute(ids)

    if (response.status !== ApiResultStatus.Success) return

    const trashedIds = new Set(ids)
    photos.value = photos.value.filter(photo => !trashedIds.has(photo.id))
    clearSelection()

    toast.add({
      title: `Moved ${ids.length} ${ids.length === 1 ? 'photo' : 'photos'} to trash.`,
      color: 'success',
    })
  }

  return {
    moveToTrash,
    isMoving: isLoading,
  }
}
