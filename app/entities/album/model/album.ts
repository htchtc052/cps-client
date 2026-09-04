export type SharedAlbum = {
  title: string
  createdAt: string
  photosCount: number
}

export type AccountAlbum = {
  id: number
  title: string
  photosCount: number
  coverPreviewUrl: string | null
  shareToken: string | null
  createdAt: string
  updatedAt: string
}
