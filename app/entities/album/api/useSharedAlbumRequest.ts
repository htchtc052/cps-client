import type { SharedAlbum } from '../model/album'

export function useSharedAlbumRequest() {
  const client = useSanctumClient()

  function getSharedAlbum(token: string): Promise<SharedAlbum> {
    return client<SharedAlbum>(`/api/shared/albums/${token}`)
  }

  return {
    getSharedAlbum,
  }
}
