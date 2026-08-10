import { describe, expect, it } from 'vitest'
import { uploadPhotosSequentially } from '../../../../app/features/photo/upload/model/uploadPhotosSequentially'

type Deferred = {
  resolve: () => void
  reject: () => void
  promise: Promise<unknown>
}

function deferred(): Deferred {
  let resolve: () => void = () => {}
  let reject: () => void = () => {}

  const promise = new Promise<unknown>((resolveUpload, rejectUpload) => {
    resolve = () => resolveUpload(undefined)
    reject = () => rejectUpload(new Error('upload failed'))
  })

  return { resolve, reject, promise }
}

function file(name: string): File {
  return { name } as File
}

describe('uploadPhotosSequentially', () => {
  it('uploads one file at a time, keeps going after a failure and reports the totals', async () => {
    const pending = [deferred(), deferred(), deferred()]
    const started: string[] = []
    const progress: number[] = []

    const outcome = uploadPhotosSequentially(
      [file('a.jpg'), file('b.jpg'), file('c.jpg')],
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

    pending[1]!.reject()
    await Promise.resolve()
    await Promise.resolve()
    expect(started).toEqual(['a.jpg', 'b.jpg', 'c.jpg'])
    expect(progress).toEqual([1, 2])

    pending[2]!.resolve()

    expect(await outcome).toEqual({ attempted: 3, created: 2, failed: 1 })
    expect(progress).toEqual([1, 2, 3])
  })
})
