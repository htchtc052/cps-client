import * as yup from 'yup'

const MAX_FILE_SIZE = 15_000 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export const MAX_STAGED_PHOTOS = 50

export function photoStagingRejection(file: File): string | null {
  const hasAcceptedType = file.type === '' || ACCEPTED_TYPES.includes(file.type)

  if (!hasAcceptedType) return 'Unsupported format. Use JPEG, PNG, WebP, HEIC or HEIF.'
  if (file.size > MAX_FILE_SIZE) return 'Larger than 15 MB.'

  return null
}

export const photoStagingSchema = yup.object({
  photos: yup
    .array()
    .of(yup.mixed<File>().required())
    .min(1, 'Select at least one photo.')
    .test(
      'uploadable',
      'Remove files that aren’t JPEG, PNG, WebP, HEIC or HEIF, or are larger than 15 MB.',
      files => (files ?? []).every(file => photoStagingRejection(file) === null),
    )
    .required(),
})

export type PhotoStagingDto = yup.Asserts<typeof photoStagingSchema>
