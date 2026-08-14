import type { Photo } from '~/entities/photo'

export type PublicProfile = {
  name: string
  photos: Photo[]
}

export function usePublicProfileRequest() {
  const client = useSanctumClient()

  function getPublicProfile(token: string): Promise<PublicProfile> {
    return client<PublicProfile>(`/api/shared/${token}`)
  }

  return {
    getPublicProfile,
  }
}
