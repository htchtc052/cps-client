import type { SharedPhoto } from '../api/useSharedPhotoRequest'
import { useSharedPhotoRequest } from '../api/useSharedPhotoRequest'

export function useSharedPhoto(token: string) {
  const { getSharedPhoto } = useSharedPhotoRequest()

  return useAsyncData<SharedPhoto | null>(
    `shared-photo:${token}`,
    () => getSharedPhoto(token),
    { default: () => null },
  )
}
