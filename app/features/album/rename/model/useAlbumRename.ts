import type { FormError } from '@nuxt/ui'
import type { AccountAlbum } from '~/entities/album'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumRenameRequest } from '../api/useAlbumRenameRequest'
import type { AlbumRenameDto } from '../contract/album-rename.contract'

export function useAlbumRename() {
  const toast = useToast()
  const { renameAlbum: renameAlbumRequest } = useAlbumRenameRequest()
  const { execute, isLoading } = useApiOperation(
    ({ id, data }: { id: number, data: AlbumRenameDto }) => renameAlbumRequest(id, data),
  )

  async function rename(id: number, data: AlbumRenameDto): Promise<AccountAlbum | FormError[] | null> {
    const result = await execute({ id, data })

    if (result.status === ApiResultStatus.Validation) return result.errors
    if (result.status !== ApiResultStatus.Success) return null

    toast.add({ title: 'Album renamed.', color: 'success' })

    return result.data
  }

  return {
    rename,
    isRenaming: isLoading,
  }
}
