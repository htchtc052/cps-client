import { useAccountPhotosRequest } from '../api/useAccountPhotosRequest'

export function useAccountPhotos() {
  const { getAccountPhotos } = useAccountPhotosRequest()

  return useAsyncData(getAccountPhotos, {
    default: () => [],
  })
}
