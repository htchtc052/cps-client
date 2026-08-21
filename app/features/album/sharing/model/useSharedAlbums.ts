import { useAlbumSharingRequest } from '../api/useAlbumSharingRequest'

export function useSharedAlbums() {
  const { getAlbums } = useAlbumSharingRequest()

  return useAsyncData('shared-albums', getAlbums, {
    default: () => [],
  })
}
