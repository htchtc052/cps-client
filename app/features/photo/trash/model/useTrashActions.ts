import { ref, type Ref } from 'vue'
import type { Photo } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePhotoTrashRequest } from '../api/usePhotoTrashRequest'

export function useTrashActions(photos: Ref<Photo[]>) {
  const toast = useToast()
  const { restorePhoto, emptyTrash } = usePhotoTrashRequest()
  const restoreOperation = useApiOperation(restorePhoto)
  const emptyOperation = useApiOperation(emptyTrash)
  const restoringId = ref<number | null>(null)

  function isRestoring(photoId: number): boolean {
    return restoreOperation.isLoading.value && restoringId.value === photoId
  }

  async function restore(photoId: number): Promise<void> {
    if (restoreOperation.isLoading.value) return

    restoringId.value = photoId
    const response = await restoreOperation.execute(photoId)

    if (response.status !== ApiResultStatus.Success) return

    photos.value = photos.value.filter(photo => photo.id !== photoId)

    toast.add({ title: 'Photo restored.', color: 'success' })
  }

  async function empty(): Promise<void> {
    const response = await emptyOperation.execute()

    if (response.status !== ApiResultStatus.Success) return

    photos.value = []

    toast.add({ title: 'Trash emptied.', color: 'success' })
  }

  return {
    restore,
    empty,
    isRestoring,
    isEmptying: emptyOperation.isLoading,
  }
}
