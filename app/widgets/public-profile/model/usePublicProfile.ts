import { usePublicProfileRequest } from '../api/usePublicProfileRequest'

export function usePublicProfile(token: string) {
  const { getPublicProfile } = usePublicProfileRequest()

  return useAsyncData(() => getPublicProfile(token), {
    default: () => null,
  })
}
