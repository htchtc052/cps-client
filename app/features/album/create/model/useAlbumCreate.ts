import type { FormError } from '@nuxt/ui'
import type { AccountAlbum } from '~/entities/album'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAlbumCreateRequest } from '../api/useAlbumCreateRequest'
import type { AlbumCreateDto } from '../contract/album-create.contract'

export function useAlbumCreate() {
  const { createAlbum: createAlbumRequest } = useAlbumCreateRequest()
  const { execute, isLoading } = useApiOperation(createAlbumRequest)

  async function create(data: AlbumCreateDto): Promise<AccountAlbum | FormError[] | null> {
    const result = await execute(data)

    if (result.status === ApiResultStatus.Validation) return result.errors
    if (result.status !== ApiResultStatus.Success) return null

    return result.data
  }

  return {
    create,
    isCreating: isLoading,
  }
}
