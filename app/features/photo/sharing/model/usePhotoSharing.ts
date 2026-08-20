import { useClipboard } from '@vueuse/core'
import type { Ref } from 'vue'
import type { AccountPhoto } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { ShareUrls } from '../contract/share-format.contract'
import { usePhotoSharingRequest } from '../api/usePhotoSharingRequest'

export type UsePhotoSharingOptions = {
  onDisabled?: (photoId: number) => void
}

export function usePhotoSharing(photos: Ref<AccountPhoto[]>, options: UsePhotoSharingOptions = {}) {
  const toast = useToast()
  const requestUrl = useRequestURL()
  const apiBaseUrl = useSanctumConfig().baseUrl
  const { copy } = useClipboard({ legacy: true })
  const { enableSharing, disableSharing: disablePhotoSharing } = usePhotoSharingRequest()
  const enableOperation = useApiOperation(enableSharing)
  const disableOperation = useApiOperation(disablePhotoSharing)

  function shareUrl(shareToken: string): string {
    return `${requestUrl.origin}/p/${shareToken}`
  }

  function shareUrls(shareToken: string): ShareUrls {
    return {
      page: shareUrl(shareToken),
      image: `${apiBaseUrl}/api/shared/photos/${shareToken}/viewer`,
    }
  }

  async function share(photoId: number): Promise<AccountPhoto | null> {
    const response = await enableOperation.execute(photoId)

    if (response.status !== ApiResultStatus.Success) return null

    photos.value = photos.value.map(photo =>
      photo.id === photoId ? response.data : photo,
    )

    return response.data
  }

  async function copyText(text: string): Promise<void> {
    await copy(text)

    toast.add({ title: 'Copied to clipboard.', color: 'success' })
  }

  async function disableSharing(photoId: number): Promise<boolean> {
    const response = await disableOperation.execute(photoId)

    if (response.status !== ApiResultStatus.Success) return false

    if (options.onDisabled) {
      options.onDisabled(photoId)
    }
    else {
      photos.value = photos.value.map(photo =>
        photo.id === photoId ? { ...photo, shareToken: null } : photo,
      )
    }

    toast.add({ title: 'Photo sharing disabled.', color: 'success' })

    return true
  }

  return {
    share,
    shareUrl,
    shareUrls,
    copyText,
    disableSharing,
    isSharing: enableOperation.isLoading,
    isDisablingSharing: disableOperation.isLoading,
  }
}
