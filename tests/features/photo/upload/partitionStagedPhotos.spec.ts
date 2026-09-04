import { describe, expect, it } from 'vitest'
import { partitionStagedPhotos } from '../../../../app/features/photo/upload/model/partitionStagedPhotos'

function file(type: string, size: number, name = 'photo'): File {
  return { name, type, size } as File
}

describe('partitionStagedPhotos', () => {
  it('keeps every supported photo format', () => {
    const photos = [
      file('image/jpeg', 1024, 'photo.jpg'),
      file('image/png', 1024, 'photo.png'),
      file('image/webp', 1024, 'photo.webp'),
      file('image/heic', 1024, 'photo.heic'),
      file('image/heif', 1024, 'photo.heif'),
      file('', 1024, 'photo-without-media-type.heic'),
    ]

    expect(partitionStagedPhotos(photos)).toEqual({ photos, rejections: [] })
  })

  it('keeps uploadable files and reports each rejected file', () => {
    const accepted = file('image/heic', 1024, 'accepted.heic')
    const unsupported = file('image/gif', 1024, 'animation.gif')
    const oversized = file('image/jpeg', 15_000 * 1024 + 1, 'oversized.jpg')

    const result = partitionStagedPhotos([accepted, unsupported, oversized])

    expect(result.photos).toEqual([accepted])
    expect(result.rejections).toEqual([
      { file: unsupported, message: 'Unsupported format. Use JPEG, PNG, WebP, HEIC or HEIF.' },
      { file: oversized, message: 'Larger than 15 MB.' },
    ])
  })

  it('reports files beyond the staging limit without removing accepted files', () => {
    const photos = Array.from({ length: 51 }, (_, index) => file('image/jpeg', 1024, `${index}.jpg`))

    const result = partitionStagedPhotos(photos)

    expect(result.photos).toEqual(photos.slice(0, 50))
    expect(result.rejections).toEqual([
      { file: photos[50], message: 'Only 50 photos can be staged at once.' },
    ])
  })
})
