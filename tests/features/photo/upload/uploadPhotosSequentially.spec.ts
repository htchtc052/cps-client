import { describe, expect, it } from 'vitest'
import { uploadPhotosSequentially } from '../../../../app/features/photo/upload/model/uploadPhotosSequentially'

type Deferred = {
  resolve: () => void
  reject: (error: unknown) => void
  promise: Promise<unknown>
}

function deferred(): Deferred {
  let resolve: () => void = () => {}
  let reject: (error: unknown) => void = () => {}

  const promise = new Promise<unknown>((resolveUpload, rejectUpload) => {
    resolve = () => resolveUpload(undefined)
    reject = rejectUpload
  })

  return { resolve, reject, promise }
}

function file(name: string): File {
  return { name } as File
}

describe('uploadPhotosSequentially', () => {
  it('uploads one file at a time, keeps going after a failure and reports the failed file with its error', async () => {
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

    pending[0]!.resolve()
    await Promise.resolve()
    await Promise.resolve()
    expect(started).toEqual(['a.jpg', 'b.jpg'])
    expect(progress).toEqual([1])

    pending[1]!.reject(rejection)
    await Promise.resolve()
    await Promise.resolve()
    expect(started).toEqual(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(progress).toEqual([1, 2])

    pending[2]!.resolve()

    const result = await outcome
    expect(result.attempted).toBe(3)
    expect(result.created).toBe(2)
    expect(result.failures).toHaveLength(1)
    expect(result.failures[0]!.file).toBe(files[1])
    expect(result.failures[0]!.error).toBe(rejection)
    expect(progress).toEqual([1, 2, 3])
  })
})
