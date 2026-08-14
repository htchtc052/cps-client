import type { AccountPhoto } from '~/entities/photo'

export type PhotoUploadResponse = AccountPhoto & { created: boolean }

export function usePhotoUploadRequest() {
  const client = useSanctumClient()

  function uploadPhoto(file: File): Promise<PhotoUploadResponse> {
    const body = new FormData()
    body.append('photo', file)

    return client<PhotoUploadResponse>('/api/photos', {
      method: 'POST',
      body,
    })
  }

  return {
    uploadPhoto,
  }
}
