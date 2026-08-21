export type SharedAlbum = {
  createdAt: string
  photosCount: number
}

export type AccountAlbum = SharedAlbum & {
  id: number
  shareToken: string
  coverPreviewUrl: string | null
}
