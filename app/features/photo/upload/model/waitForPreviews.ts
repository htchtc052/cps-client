import type { PhotoPreviewStatus } from '../api/usePhotoPreviewStatusRequest'

const POLL_INTERVAL_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function waitForPreviews(
  photoIds: readonly number[],
  getPreviewStatuses: (photoIds: number[]) => Promise<PhotoPreviewStatus[]>,
  onProgress: (pending: number, total: number) => void,
): Promise<void> {
  const total = photoIds.length
  let pending = [...photoIds]

  while (pending.length > 0) {
    const statuses = await getPreviewStatuses(pending)

    pending = statuses
      .filter(status => status.status === 'pending')
      .map(status => status.photoId)

    onProgress(pending.length, total)

    if (pending.length > 0) await delay(POLL_INTERVAL_MS)
  }
}
