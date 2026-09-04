import { MAX_STAGED_PHOTOS, photoStagingRejection } from '../contract/photo-staging.contract'

export type PhotoStagingRejection = {
  file: File
  message: string
}

export function partitionStagedPhotos(files: readonly File[]): {
  photos: File[]
  rejections: PhotoStagingRejection[]
} {
  const photos: File[] = []
  const rejections: PhotoStagingRejection[] = []

  for (const file of files) {
    const rejection = photoStagingRejection(file)

    if (rejection) {
      rejections.push({ file, message: rejection })
      continue
    }

    if (photos.length >= MAX_STAGED_PHOTOS) {
      rejections.push({ file, message: `Only ${MAX_STAGED_PHOTOS} photos can be staged at once.` })
      continue
    }

    photos.push(file)
  }

  return { photos, rejections }
}
