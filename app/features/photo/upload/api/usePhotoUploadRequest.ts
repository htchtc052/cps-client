import type { AccountPhoto } from '~/entities/photo'

export function usePhotoUploadRequest() {
  const client = useSanctumClient()

  function uploadPhoto(file: File): Promise<AccountPhoto> {
    const body = new FormData()
    body.append('photo', file)

    return client<AccountPhoto>('/api/photos', {
      method: 'POST',
      body,
    })
  }

  return {
    uploadPhoto,
  }
}
