import type { Ref } from 'vue'
import type { AccountPhoto } from '~/entities/photo'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumMembershipRequest } from '../api/useAlbumMembershipRequest'

export function useRemoveFromAlbum(albumId: number, photos: Ref<AccountPhoto[]>, clearSelection: () => void) {
  const toast = useToast()
  const { removePhotos } = useAlbumMembershipRequest()
  const { execute, isLoading } = useApiOperation(
    (ids: number[]) => removePhotos(albumId, ids),
  )

  async function remove(ids: number[]): Promise<void> {
    const response = await execute(ids)

    if (response.status !== ApiResultStatus.Success) return

    const removedIds = new Set(ids)
    photos.value = photos.value.filter(photo => !removedIds.has(photo.id))
    clearSelection()

    toast.add({
      title: `Removed ${ids.length} ${ids.length === 1 ? 'photo' : 'photos'} from the album.`,
      color: 'success',
    })
  }

  return {
    remove,
    isRemoving: isLoading,
  }
}
