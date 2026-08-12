import { computed, ref } from 'vue'
import type { PhotoOrientation, PhotoSort } from '../api/useAccountPhotosRequest'
import { useAccountPhotosRequest } from '../api/useAccountPhotosRequest'

export type PhotoOrientationFilter = PhotoOrientation | 'all'

export async function useAccountPhotos() {
  const { getAccountPhotos } = useAccountPhotosRequest()

  const orientation = ref<PhotoOrientationFilter>('all')
  const sort = ref<PhotoSort>('newest')

  const asyncData = useAsyncData(
    () => getAccountPhotos({
      orientation: orientation.value === 'all' ? undefined : orientation.value,
      sort: sort.value,
    }),
    { default: () => [] },
  )

  await asyncData

  const { data: photos, error, status, refresh } = asyncData
  const isRefreshing = computed(() => status.value === 'pending')

  return {
    photos,
    error,
    orientation,
    sort,
    isRefreshing,
    refresh,
  }
}
