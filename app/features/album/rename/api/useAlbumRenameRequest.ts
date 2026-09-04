import type { AccountAlbum } from '~/entities/album'
import type { AlbumRenameDto } from '../contract/album-rename.contract'

export function useAlbumRenameRequest() {
  const client = useSanctumClient()

  function renameAlbum(id: number, data: AlbumRenameDto): Promise<AccountAlbum> {
    return client<AccountAlbum>(`/api/albums/${id}`, {
      method: 'PATCH',
      body: data,
    })
  }

  return {
    renameAlbum,
  }
}
