import { computed, ref, watch } from 'vue'
import type { AccountAlbum } from '~/entities/album'
import { useAlbumRequest } from '~/entities/album'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumAddPhotosRequest } from '../api/useAlbumAddPhotosRequest'
import { parseTargetAlbumId } from './parseTargetAlbumId'

export function useAddToAlbum() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()
  const { getAlbum } = useAlbumRequest()
  const { addPhotos: addPhotosRequest } = useAlbumAddPhotosRequest()
  const { execute, isLoading } = useApiOperation(
    ({ albumId, ids }: { albumId: number, ids: number[] }) => addPhotosRequest(albumId, ids),
  )

  const targetAlbum = ref<AccountAlbum | null>(null)

  const targetAlbumId = computed(() => parseTargetAlbumId(route.query.addToAlbum))

  const isActive = computed(() => targetAlbumId.value !== null)

  watch(targetAlbumId, async (id) => {
    if (id === null) {
      targetAlbum.value = null
      return
    }

    try {
      targetAlbum.value = await getAlbum(id)
    }
    catch {
      targetAlbum.value = null
      toast.add({ title: 'That album is unavailable.', color: 'error' })
      exitAddMode()
    }
  }, { immediate: true })

  function exitAddMode(): void {
    const query = { ...route.query }
    delete query.addToAlbum
    router.replace({ query })
  }

  async function addSelectedPhotos(ids: number[]): Promise<boolean> {
    const album = targetAlbum.value

    if (album === null) return false

    const response = await execute({ albumId: album.id, ids })

    if (response.status !== ApiResultStatus.Success) return false

    toast.add({
      title: `Added ${ids.length} ${ids.length === 1 ? 'photo' : 'photos'} to "${album.title}".`,
      color: 'success',
    })

    await navigateTo(`/albums/${album.id}`)

    return true
  }

  return {
    isActive,
    targetAlbum,
    addSelectedPhotos,
    isAdding: isLoading,
    exitAddMode,
  }
}
