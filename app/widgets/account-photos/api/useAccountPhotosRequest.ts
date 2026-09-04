import type { AccountPhoto } from '~/entities/photo'

export type PhotoOrientation = 'landscape' | 'portrait' | 'square'
export type PhotoSort = 'newest' | 'oldest' | 'name'
export type PhotoSharing = 'all' | 'shared' | 'private'

export type AccountPhotosQuery = {
  orientation?: PhotoOrientation
  sort: PhotoSort
  sharing: PhotoSharing
}

export function useAccountPhotosRequest() {
  const client = useSanctumClient()

  function getAccountPhotos(query: AccountPhotosQuery): Promise<AccountPhoto[]> {
    return client<AccountPhoto[]>('/api/photos', {
      query: {
        orientation: query.orientation,
        sort: query.sort,
        sharing: query.sharing,
      },
    })
  }

  return {
    getAccountPhotos,
  }
}
