export type Photo = {
  id: number
  name: string
  originalName: string
  width: number
  height: number
  createdAt: string
  isHidden: boolean
  originalUrl: string
  previewUrl: string | null
  viewerUrl: string
  viewerWidth: number
  viewerHeight: number
}
