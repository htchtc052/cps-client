import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumDeleteRequest } from '../api/useAlbumDeleteRequest'

export function useAlbumDelete() {
  const toast = useToast()
  const { deleteAlbum: deleteAlbumRequest } = useAlbumDeleteRequest()
  const { execute, isLoading } = useApiOperation(deleteAlbumRequest)

  async function deleteAlbum(id: number): Promise<boolean> {
    const response = await execute(id)

    if (response.status !== ApiResultStatus.Success) return false

    toast.add({ title: 'Album deleted.', color: 'success' })

    return true
  }

  return {
    deleteAlbum,
    isDeleting: isLoading,
  }
}
