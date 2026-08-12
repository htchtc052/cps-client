import type { Photo } from '~/entities/photo'

export type PhotoOrientation = 'landscape' | 'portrait' | 'square'
export type PhotoSort = 'newest' | 'oldest' | 'name'

export type AccountPhotosQuery = {
  orientation?: PhotoOrientation
  sort: PhotoSort
}

export function useAccountPhotosRequest() {
  const client = useSanctumClient()

  function getAccountPhotos(query: AccountPhotosQuery): Promise<Photo[]> {
    return client<Photo[]>('/api/photos', {
      query: {
        orientation: query.orientation,
        sort: query.sort,
      },
    })
  }

  return {
    getAccountPhotos,
  }
}
