export type AdminUser = {
  id: number
  name: string
  email: string
  photoCount: number
  sharedCount: number
  blockedAt: string | null
  createdAt: string
}

export type AdminPhoto = {
  id: number
  name: string
  originalName: string
  shareToken: string | null
  blockedAt: string | null
  createdAt: string
  previewUrl: string | null
}
