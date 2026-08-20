import { computed, ref } from 'vue'
import { parseApiError } from '~/shared/api'
import { usePhotoPreviewStatusRequest } from '../api/usePhotoPreviewStatusRequest'
import { usePhotoUploadRequest } from '../api/usePhotoUploadRequest'
import { uploadPhotosSequentially } from './uploadPhotosSequentially'
import { waitForPreviews } from './waitForPreviews'

const GENERIC_FAILURE = 'Upload failed. Try again.'

export type PhotoUploadPhase = 'idle' | 'uploading' | 'finishing'

export type StagedPhotoState = 'waiting' | 'processing' | 'ready' | 'failed'

export type PhotoUploadFailureView = {
  file: File
  message: string
}

export type PhotoUploadResult = {
  attempted: number
  created: number
  duplicates: number
  failures: PhotoUploadFailureView[]
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

function describeUploadOutcome(created: number, duplicates: number): string {
  if (duplicates === 0) return `Added ${created} ${pluralize(created, 'photo', 'photos')}.`

  if (created === 0) {
    return `All ${duplicates} ${pluralize(duplicates, 'photo', 'photos')} already ${pluralize(duplicates, 'exists', 'exist')} in your account.`
  }

  return `Added ${created} ${pluralize(created, 'photo', 'photos')}. ${duplicates} already ${pluralize(duplicates, 'exists', 'exist')} in your account.`
}

export function usePhotoUpload() {
  const toast = useToast()
  const { uploadPhoto } = usePhotoUploadRequest()
  const { getPreviewStatuses } = usePhotoPreviewStatusRequest()

  const phase = ref<PhotoUploadPhase>('idle')
  const isBusy = computed(() => phase.value !== 'idle')
  const completed = ref(0)
  const total = ref(0)
  const previewPending = ref(0)
  const previewTotal = ref(0)
  const stagedStates = ref(new Map<File, StagedPhotoState>())
  const photoFiles = new Map<number, File>()

  function setStagedState(file: File, state: StagedPhotoState): void {
    stagedStates.value = new Map(stagedStates.value).set(file, state)
  }

  async function settlePreviews(photoIds: number[]): Promise<void> {
    if (photoIds.length === 0) return

    previewPending.value = photoIds.length
    previewTotal.value = photoIds.length

    try {
      await waitForPreviews(photoIds, getPreviewStatuses, (settled) => {
        for (const status of settled) {
          const file = photoFiles.get(status.photoId)

          if (file) setStagedState(file, status.status === 'ready' ? 'ready' : 'failed')
        }

        previewPending.value -= settled.length
      })
    }
    catch (error: unknown) {
      console.error('[Preview status polling failed]', error)
    }
  }

  async function uploadPhotos(files: readonly File[]): Promise<PhotoUploadResult> {
    const staged = [...files]

    phase.value = 'uploading'
    completed.value = 0
    total.value = staged.length
    previewPending.value = 0
    previewTotal.value = 0
    photoFiles.clear()
    stagedStates.value = new Map(staged.map(file => [file, 'waiting' as StagedPhotoState]))

    try {
      const outcome = await uploadPhotosSequentially(staged, uploadPhoto, (done, file, photo) => {
        completed.value = done

        if (photo === null) {
          setStagedState(file, 'failed')

          return
        }

        photoFiles.set(photo.id, file)
        setStagedState(file, photo.created ? 'processing' : 'ready')
      })

      const createdPhotos = outcome.succeeded.map(({ photo }) => photo).filter(photo => photo.created)
      const duplicatePhotos = outcome.succeeded.map(({ photo }) => photo).filter(photo => !photo.created)

      phase.value = 'finishing'
      await settlePreviews(createdPhotos.map(photo => photo.id))

      const result: PhotoUploadResult = {
        attempted: outcome.attempted,
        created: createdPhotos.length,
        duplicates: duplicatePhotos.length,
        failures: outcome.failures.map(({ file, error }) => {
          const { httpStatus, fieldErrors } = parseApiError(error)

          if (fieldErrors.photo) return { file, message: fieldErrors.photo }

          console.error('[Photo upload failed]', { file: file.name, httpStatus, error })

          return { file, message: GENERIC_FAILURE }
        }),
      }

      if (result.failures.length === 0) {
        toast.add({
          title: describeUploadOutcome(result.created, result.duplicates),
          color: 'success',
        })

        await navigateTo('/owner')

        return result
      }

      toast.add({
        title: result.created === 0
          ? 'No photos were created.'
          : `Created ${result.created} of ${result.attempted} photos. ${result.failures.length} couldn’t be uploaded.`,
        color: 'warning',
      })

      return result
    }
    finally {
      phase.value = 'idle'
    }
  }

  return {
    uploadPhotos,
    stagedStates,
    phase,
    isBusy,
    completed,
    total,
    previewPending,
    previewTotal,
  }
}
