import type { SharedAlbum } from './album'
import { useSharedAlbumRequest } from '../api/useSharedAlbumRequest'

export function useSharedAlbum(token: string) {
  const { getSharedAlbum } = useSharedAlbumRequest()

  return useAsyncData<SharedAlbum | null>(
    `shared-album:${token}`,
    () => getSharedAlbum(token),
    { default: () => null },
  )
}
