import type { Photo } from '~/entities/photo'

export type SharedAlbumPhoto = Photo & {
  downloadUrl: string
}

export function useSharedAlbumPhotosRequest() {
  const client = useSanctumClient()

  function getSharedAlbumPhotos(token: string): Promise<SharedAlbumPhoto[]> {
    return client<SharedAlbumPhoto[]>(`/api/shared/albums/${token}/photos`)
  }

  return {
    getSharedAlbumPhotos,
  }
}
