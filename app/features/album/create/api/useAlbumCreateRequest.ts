import type { AccountAlbum } from '~/entities/album'
import type { AlbumCreateDto } from '../contract/album-create.contract'

export function useAlbumCreateRequest() {
  const client = useSanctumClient()

  function createAlbum(data: AlbumCreateDto): Promise<AccountAlbum> {
    return client<AccountAlbum>('/api/albums', {
      method: 'POST',
      body: data,
    })
  }

  return {
    createAlbum,
  }
}
