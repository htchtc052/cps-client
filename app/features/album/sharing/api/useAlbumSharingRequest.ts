import type { AccountAlbum } from '~/entities/album'

export function useAlbumSharingRequest() {
  const client = useSanctumClient()

  function enableSharing(id: number): Promise<AccountAlbum> {
    return client<AccountAlbum>(`/api/albums/${id}/share`, { method: 'POST' })
  }

  function disableSharing(id: number): Promise<void> {
    return client(`/api/albums/${id}/share`, { method: 'DELETE' })
  }

  return {
    enableSharing,
    disableSharing,
  }
}
