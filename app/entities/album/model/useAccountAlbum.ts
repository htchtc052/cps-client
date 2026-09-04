import { useAlbumRequest } from '../api/useAlbumRequest'

export function useAccountAlbum(id: number) {
  const { getAlbum } = useAlbumRequest()

  return useAsyncData(`account-album:${id}`, () => getAlbum(id))
}
