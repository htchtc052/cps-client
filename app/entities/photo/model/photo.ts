export type Photo = {
  id: number
  name: string
  description: string | null
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
  shareToken: string | null
  originalUrl: string
}
