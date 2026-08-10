import * as yup from 'yup'

const MAX_FILE_SIZE = 15_000 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function isUploadable(file: File): boolean {
  const hasAcceptedType = file.type === '' || ACCEPTED_TYPES.includes(file.type)

  return hasAcceptedType && file.size <= MAX_FILE_SIZE
}

export const photoStagingSchema = yup.object({
  photos: yup
    .array()
    .of(yup.mixed<File>().required())
    .min(1, 'Select at least one photo.')
    .test(
      'uploadable',
      'Remove files that aren’t JPEG, PNG or WebP, or are larger than 15 MB.',
      files => (files ?? []).every(isUploadable),
    )
    .required(),
})

export type PhotoStagingDto = yup.Asserts<typeof photoStagingSchema>
