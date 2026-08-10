import type { Photo } from '~/entities/photo'

export function useAccountPhotosRequest() {
  const client = useSanctumClient()

  function getAccountPhotos(): Promise<Photo[]> {
    return client<Photo[]>('/api/photos')
  }

  return {
    getAccountPhotos,
  }
}
