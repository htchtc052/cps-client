import { usePhotoSharingRequest } from '../api/usePhotoSharingRequest'

export function useSharedPhotos() {
  const { getSharedPhotos } = usePhotoSharingRequest()

  return useAsyncData(getSharedPhotos, {
    default: () => [],
  })
}
