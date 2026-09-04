import { useClipboard } from '@vueuse/core'
import type { AccountAlbum } from '~/entities/album'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumSharingRequest } from '../api/useAlbumSharingRequest'

export function useAlbumSharing() {
  const toast = useToast()
  const requestUrl = useRequestURL()
  const { copy } = useClipboard({ legacy: true })
  const { enableSharing, disableSharing } = useAlbumSharingRequest()
  const enableOperation = useApiOperation(enableSharing)
  const disableOperation = useApiOperation(disableSharing)

  function albumUrl(shareToken: string): string {
    return `${requestUrl.origin}/a/${shareToken}`
  }

  async function share(id: number): Promise<AccountAlbum | null> {
    const response = await enableOperation.execute(id)

    return response.status === ApiResultStatus.Success ? response.data : null
  }

  async function copyText(text: string): Promise<void> {
    await copy(text)

    toast.add({ title: 'Copied to clipboard.', color: 'success' })
  }

  async function revoke(id: number): Promise<boolean> {
    const response = await disableOperation.execute(id)

    if (response.status !== ApiResultStatus.Success) return false

    toast.add({ title: 'Album link revoked.', color: 'success' })

    return true
  }

  return {
    share,
    albumUrl,
    copyText,
    revoke,
    isSharing: enableOperation.isLoading,
    isRevoking: disableOperation.isLoading,
  }
}
