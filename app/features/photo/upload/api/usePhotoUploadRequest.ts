import type { Photo } from '~/entities/photo'

export function usePhotoUploadRequest() {
  const client = useSanctumClient()

  function uploadPhoto(file: File): Promise<Photo> {
    const body = new FormData()
    body.append('photo', file)

    return client<Photo>('/api/photos', {
      method: 'POST',
      body,
    })
  }

  return {
    uploadPhoto,
  }
}
