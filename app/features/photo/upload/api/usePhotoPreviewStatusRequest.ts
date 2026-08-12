export type PhotoPreviewState = 'pending' | 'ready' | 'failed'

export type PhotoPreviewStatus = {
  photoId: number
  status: PhotoPreviewState
}

export function usePhotoPreviewStatusRequest() {
  const client = useSanctumClient()

  function getPreviewStatuses(photoIds: readonly number[]): Promise<PhotoPreviewStatus[]> {
    return client<PhotoPreviewStatus[]>('/api/photos/preview-statuses', {
      query: { 'ids[]': photoIds },
    })
  }

  return {
    getPreviewStatuses,
  }
}
