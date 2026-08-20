import type { FormError } from '@nuxt/ui'
import type { Ref } from 'vue'
import type { AccountPhoto } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePhotoDetailsRequest } from '../api/usePhotoDetailsRequest'
import type { PhotoDetailsDto } from '../contract/photo-details.contract'

export function usePhotoDetails(photos: Ref<AccountPhoto[]>) {
  const toast = useToast()
  const { updateDetails } = usePhotoDetailsRequest()
  const { execute, isLoading } = useApiOperation(
    ({ photoId, data }: { photoId: number, data: PhotoDetailsDto }) => updateDetails(photoId, data),
  )

  async function save(photoId: number, data: PhotoDetailsDto): Promise<FormError[] | undefined> {
    const result = await execute({ photoId, data })

    if (result.status === ApiResultStatus.Validation) return result.errors
    if (result.status !== ApiResultStatus.Success) return

    photos.value = photos.value.map(photo => photo.id === photoId ? result.data : photo)

    toast.add({ title: 'Photo details saved.', color: 'success' })
  }

  return { save, isSaving: isLoading }
}
