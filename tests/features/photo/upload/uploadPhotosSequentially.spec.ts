import { describe, expect, it } from 'vitest'
import { uploadPhotosSequentially } from '../../../../app/features/photo/upload/model/uploadPhotosSequentially'

type Photo = { id: number }

type Deferred = {
  resolve: (photo: Photo) => void
  reject: (error: unknown) => void
  promise: Promise<Photo>
}

function deferred(): Deferred {
  let resolve: (photo: Photo) => void = () => {}
  let reject: (error: unknown) => void = () => {}

  const promise = new Promise<Photo>((resolveUpload, rejectUpload) => {
    resolve = resolveUpload
    reject = rejectUpload
  })

  return { resolve, reject, promise }
}

function file(name: string): File {
  return { name } as File
}

describe('uploadPhotosSequentially', () => {
  it('uploads one file at a time, keeps the succeeded photos in order and reports the failed file with its error', async () => {
    const pending = [deferred(), deferred(), deferred()]
    const started: string[] = []
    const progress: number[] = []
    const files = [file('a.jpg'), file('b.jpg'), file('c.jpg')]
    const rejection = new Error('upload failed')

    const outcome = uploadPhotosSequentially(
      files,
      (uploaded) => {
        started.push(uploaded.name)

        return pending[started.length - 1]!.promise
      },
      completed => progress.push(completed),
    )

    await Promise.resolve()
    expect(started).toEqual(['a.jpg'])

    pending[0]!.resolve({ id: 1 })
    await Promise.resolve()
    await Promise.resolve()
    expect(started).toEqual(['a.jpg', 'b.jpg'])
    expect(progress).toEqual([1])

    pending[1]!.reject(rejection)
    await Promise.resolve()
    await Promise.resolve()
    expect(started).toEqual(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(progress).toEqual([1, 2])

    pending[2]!.resolve({ id: 3 })

    const result = await outcome
    expect(result.attempted).toBe(3)
    expect(result.succeeded).toEqual([{ id: 1 }, { id: 3 }])
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0]!.file).toBe(files[1])
    expect(result.failures[0]!.error).toBe(rejection)
    expect(progress).toEqual([1, 2, 3])
  })
})
