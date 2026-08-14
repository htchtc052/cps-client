import type { Ref } from 'vue'
import type { AccountPhoto } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePhotoVisibilityRequest } from '../api/usePhotoVisibilityRequest'

export function usePhotoVisibility(photos: Ref<AccountPhoto[]>, clearSelection: () => void) {
  const toast = useToast()
  const { updateVisibility } = usePhotoVisibilityRequest()
  const { execute, isLoading } = useApiOperation(updateVisibility)

  async function setVisibility(ids: number[], hidden: boolean): Promise<void> {
    const response = await execute(ids, hidden)

    if (response.status !== ApiResultStatus.Success) return

    const updatedIds = new Set(ids)
    photos.value = photos.value.map(photo =>
      updatedIds.has(photo.id) ? { ...photo, isHidden: hidden } : photo,
    )
    clearSelection()

    const subject = `${ids.length} ${ids.length === 1 ? 'photo' : 'photos'}`

    toast.add({
      title: hidden
        ? `Removed ${subject} from public profile.`
        : `Added ${subject} to public profile.`,
      color: 'success',
    })
  }

  return {
    setVisibility,
    isUpdating: isLoading,
  }
}
