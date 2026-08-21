import type { SharedAlbumPhoto } from '../api/useSharedAlbumPhotosRequest'
import { useSharedAlbumPhotosRequest } from '../api/useSharedAlbumPhotosRequest'

export function useSharedAlbumPhotos(token: string) {
  const { getSharedAlbumPhotos } = useSharedAlbumPhotosRequest()

  return useLazyAsyncData<SharedAlbumPhoto[]>(
    `shared-album-photos:${token}`,
    () => getSharedAlbumPhotos(token),
    { server: false, default: () => [] },
  )
}
