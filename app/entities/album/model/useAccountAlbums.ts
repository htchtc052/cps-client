import { computed, ref } from 'vue'
import type { AlbumSharingFilter } from '../api/useAlbumRequest'
import { useAlbumRequest } from '../api/useAlbumRequest'

export async function useAccountAlbums() {
  const { getAlbums } = useAlbumRequest()

  const sharing = ref<AlbumSharingFilter>('all')

  const asyncData = useAsyncData(
    'account-albums',
    () => getAlbums(sharing.value),
    { default: () => [] },
  )

  await asyncData

  const { data: albums, error, status, refresh } = asyncData
  const isRefreshing = computed(() => status.value === 'pending')

  return {
    albums,
    error,
    sharing,
    isRefreshing,
    refresh,
  }
}
