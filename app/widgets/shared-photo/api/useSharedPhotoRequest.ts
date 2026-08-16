export type SharedPhoto = {
  name: string
  width: number
  height: number
  previewUrl: string | null
  viewerUrl: string
  viewerWidth: number
  viewerHeight: number
  downloadUrl: string
}

export function useSharedPhotoRequest() {
  const client = useSanctumClient()

  function getSharedPhoto(token: string): Promise<SharedPhoto> {
    return client<SharedPhoto>(`/api/shared/photos/${token}`)
  }

  return {
    getSharedPhoto,
  }
}
