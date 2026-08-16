import { useClipboard } from '@vueuse/core'
import type { Ref } from 'vue'
import type { AccountPhoto } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { usePhotoSharingRequest } from '../api/usePhotoSharingRequest'

export function usePhotoSharing(photos: Ref<AccountPhoto[]>) {
  const toast = useToast()
  const requestUrl = useRequestURL()
  const { copy } = useClipboard({ legacy: true })
  const { enableSharing, disableSharing: disablePhotoSharing } = usePhotoSharingRequest()
  const enableOperation = useApiOperation(enableSharing)
  const disableOperation = useApiOperation(disablePhotoSharing)

  async function copyLink(shareToken: string): Promise<void> {
    await copy(`${requestUrl.origin}/p/${shareToken}`)

    toast.add({ title: 'Share link copied.', color: 'success' })
  }

  async function share(photoId: number): Promise<void> {
    const response = await enableOperation.execute(photoId)

    if (response.status !== ApiResultStatus.Success) return

    photos.value = photos.value.map(photo =>
      photo.id === photoId ? response.data : photo,
    )

    await copyLink(response.data.shareToken!)
  }

  async function disableSharing(photoId: number): Promise<void> {
    const response = await disableOperation.execute(photoId)

    if (response.status !== ApiResultStatus.Success) return

    photos.value = photos.value.map(photo =>
      photo.id === photoId ? { ...photo, shareToken: null } : photo,
    )

    toast.add({ title: 'Photo sharing disabled.', color: 'success' })
  }

  return {
    share,
    copyLink,
    disableSharing,
    isSharing: enableOperation.isLoading,
    isDisablingSharing: disableOperation.isLoading,
  }
}
