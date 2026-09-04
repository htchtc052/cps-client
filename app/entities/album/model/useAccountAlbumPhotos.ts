import { useAlbumRequest } from '../api/useAlbumRequest'

export function useAccountAlbumPhotos(id: number) {
  const { getAlbumPhotos } = useAlbumRequest()

  return useAsyncData(`account-album-photos:${id}`, () => getAlbumPhotos(id), {
    default: () => [],
  })
}
