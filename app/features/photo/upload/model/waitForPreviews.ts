import type { PhotoPreviewStatus } from '../api/usePhotoPreviewStatusRequest'

const POLL_INTERVAL_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function waitForPreviews(
  photoIds: readonly number[],
  getPreviewStatuses: (photoIds: number[]) => Promise<PhotoPreviewStatus[]>,
  onSettled: (settled: PhotoPreviewStatus[]) => void,
): Promise<void> {
  let pending = [...photoIds]

  while (pending.length > 0) {
    const statuses = await getPreviewStatuses(pending)

    onSettled(statuses.filter(status => status.status !== 'pending'))

    pending = statuses
      .filter(status => status.status === 'pending')
      .map(status => status.photoId)

    if (pending.length > 0) await delay(POLL_INTERVAL_MS)
  }
}
