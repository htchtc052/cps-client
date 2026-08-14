export type Photo = {
  id: number
  name: string
  width: number
  height: number
  previewUrl: string | null
  viewerUrl: string
  viewerWidth: number
  viewerHeight: number
}

export type AccountPhoto = Photo & {
  originalName: string
  createdAt: string
  isHidden: boolean
  originalUrl: string
}
