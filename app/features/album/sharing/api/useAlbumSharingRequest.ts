import type { AccountAlbum } from '~/entities/album'

export function useAlbumSharingRequest() {
  const client = useSanctumClient()

  function createAlbum(ids: number[]): Promise<AccountAlbum> {
    return client<AccountAlbum>('/api/albums', {
      method: 'POST',
      body: { ids },
    })
  }

  function getAlbums(): Promise<AccountAlbum[]> {
    return client<AccountAlbum[]>('/api/albums')
  }

  function deleteAlbum(id: number): Promise<void> {
    return client(`/api/albums/${id}`, { method: 'DELETE' })
  }

  return {
    createAlbum,
    getAlbums,
    deleteAlbum,
  }
}
