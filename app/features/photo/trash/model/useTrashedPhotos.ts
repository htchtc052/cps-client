import { usePhotoTrashRequest } from '../api/usePhotoTrashRequest'

export function useTrashedPhotos() {
  const { getTrashedPhotos } = usePhotoTrashRequest()

  return useAsyncData(getTrashedPhotos, {
    default: () => [],
  })
}
