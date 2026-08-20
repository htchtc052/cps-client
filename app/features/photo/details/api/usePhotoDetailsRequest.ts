import type { AccountPhoto } from '~/entities/photo'
import type { PhotoDetailsDto } from '../contract/photo-details.contract'

export function usePhotoDetailsRequest() {
  const client = useSanctumClient()

  function updateDetails(photoId: number, data: PhotoDetailsDto): Promise<AccountPhoto> {
    return client<AccountPhoto>(`/api/photos/${photoId}`, { method: 'PUT', body: data })
  }

  return { updateDetails }
}
