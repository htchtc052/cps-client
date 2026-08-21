import { useClipboard } from '@vueuse/core'
import type { AccountAlbum } from '~/entities/album'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumSharingRequest } from '../api/useAlbumSharingRequest'

export function useAlbumSharing() {
  const toast = useToast()
  const requestUrl = useRequestURL()
  const { copy } = useClipboard({ legacy: true })
  const { createAlbum: createAlbumRequest, deleteAlbum: deleteAlbumRequest } = useAlbumSharingRequest()
  const createOperation = useApiOperation(createAlbumRequest)
  const deleteOperation = useApiOperation(deleteAlbumRequest)

  function albumUrl(shareToken: string): string {
    return `${requestUrl.origin}/a/${shareToken}`
  }

  async function createAlbum(ids: number[]): Promise<AccountAlbum | null> {
    const response = await createOperation.execute(ids)

    return response.status === ApiResultStatus.Success ? response.data : null
  }

  async function copyText(text: string): Promise<void> {
    await copy(text)

    toast.add({ title: 'Copied to clipboard.', color: 'success' })
  }

  async function deleteAlbum(id: number): Promise<boolean> {
    const response = await deleteOperation.execute(id)

    if (response.status !== ApiResultStatus.Success) return false

    toast.add({ title: 'Album link deleted.', color: 'success' })

    return true
  }

  return {
    createAlbum,
    albumUrl,
    copyText,
    deleteAlbum,
    isCreating: createOperation.isLoading,
    isDeleting: deleteOperation.isLoading,
  }
}
