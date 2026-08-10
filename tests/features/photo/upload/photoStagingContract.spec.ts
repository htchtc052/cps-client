import { describe, expect, it } from 'vitest'
import type { ValidationError } from 'yup'
import { photoStagingSchema } from '../../../../app/features/photo/upload/contract/photo-staging.contract'

const REJECTION = 'Remove files that aren’t JPEG, PNG or WebP, or are larger than 15 MB.'

function file(type: string, size: number): File {
  return { name: 'photo', type, size } as File
}

async function validate(photos: File[]): Promise<ValidationError | undefined> {
  try {
    await photoStagingSchema.validate({ photos })
  }
  catch (error: unknown) {
    return error as ValidationError
  }
}

describe('photoStagingSchema', () => {
  it('accepts supported types within the size limit', async () => {
    const error = await validate([
      file('image/jpeg', 1024),
      file('image/png', 15_000 * 1024),
      file('image/webp', 1024),
    ])

    expect(error).toBeUndefined()
  })

  it('leaves a file without a type to the backend', async () => {
    expect(await validate([file('', 1024)])).toBeUndefined()
  })

  it('rejects the whole selection once as an unsupported type', async () => {
    const error = await validate([file('image/jpeg', 1024), file('image/gif', 1024)])

    expect(error?.path).toBe('photos')
    expect(error?.errors).toEqual([REJECTION])
  })

  it('rejects the whole selection once when a file is over the limit', async () => {
    const error = await validate([file('image/jpeg', 15_000 * 1024 + 1)])

    expect(error?.path).toBe('photos')
    expect(error?.errors).toEqual([REJECTION])
  })

  it('requires at least one file', async () => {
    expect((await validate([]))?.errors).toEqual(['Select at least one photo.'])
  })
})
