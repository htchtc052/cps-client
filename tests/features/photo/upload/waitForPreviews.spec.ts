import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PhotoPreviewStatus } from '../../../../app/features/photo/upload/api/usePhotoPreviewStatusRequest'
import { waitForPreviews } from '../../../../app/features/photo/upload/model/waitForPreviews'

describe('waitForPreviews', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('polls only the photos still pending and settles once none of them is pending', async () => {
    const responses: PhotoPreviewStatus[][] = [
      [{ photoId: 1, status: 'pending' }, { photoId: 2, status: 'pending' }],
      [{ photoId: 1, status: 'ready' }, { photoId: 2, status: 'pending' }],
      [{ photoId: 2, status: 'failed' }],
    ]
    const requested: number[][] = []
    const progress: Array<{ pending: number, total: number }> = []
    const settled = vi.fn()

    void waitForPreviews(
      [1, 2],
      async (photoIds) => {
        requested.push(photoIds)

        return responses[requested.length - 1]!
      },
      (pending, total) => {
        progress.push({ pending, total })
      },
    ).then(settled)

    await vi.advanceTimersByTimeAsync(0)
    expect(requested).toEqual([[1, 2]])
    expect(progress).toEqual([{ pending: 2, total: 2 }])
    expect(settled).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    expect(requested).toEqual([[1, 2], [1, 2]])
    expect(progress).toEqual([{ pending: 2, total: 2 }, { pending: 1, total: 2 }])
    expect(settled).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    expect(requested).toEqual([[1, 2], [1, 2], [2]])
    expect(progress).toEqual([{ pending: 2, total: 2 }, { pending: 1, total: 2 }, { pending: 0, total: 2 }])
    expect(settled).toHaveBeenCalledOnce()
  })
})
