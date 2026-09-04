import type { AccountPhoto } from '~/entities/photo'
import type { AccountAlbum } from '../model/album'

export type AlbumSharingFilter = 'all' | 'shared' | 'private'

export function useAlbumRequest() {
  const client = useSanctumClient()

  function getAlbums(sharing: AlbumSharingFilter = 'all'): Promise<AccountAlbum[]> {
    return client<AccountAlbum[]>('/api/albums', { query: { sharing } })
  }

  function getAlbum(id: number): Promise<AccountAlbum> {
    return client<AccountAlbum>(`/api/albums/${id}`)
  }

  function getAlbumPhotos(id: number): Promise<AccountPhoto[]> {
    return client<AccountPhoto[]>(`/api/albums/${id}/photos`)
  }

  return {
    getAlbums,
    getAlbum,
    getAlbumPhotos,
  }
}
