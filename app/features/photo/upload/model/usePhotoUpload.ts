import { computed, ref } from 'vue'
import { parseApiError } from '~/shared/api'
import { usePhotoPreviewStatusRequest } from '../api/usePhotoPreviewStatusRequest'
import { usePhotoUploadRequest } from '../api/usePhotoUploadRequest'
import { uploadPhotosSequentially } from './uploadPhotosSequentially'
import { waitForPreviews } from './waitForPreviews'

const GENERIC_FAILURE = 'Upload failed. Try again.'

export type PhotoUploadPhase = 'idle' | 'uploading' | 'finishing'

export type PhotoUploadFailureView = {
  file: File
  message: string
}

export type PhotoUploadResult = {
  attempted: number
  created: number
  failures: PhotoUploadFailureView[]
}

export function usePhotoUpload() {
  const toast = useToast()
  const { uploadPhoto } = usePhotoUploadRequest()
  const { getPreviewStatuses } = usePhotoPreviewStatusRequest()

  const phase = ref<PhotoUploadPhase>('idle')
  const isBusy = computed(() => phase.value !== 'idle')
  const completed = ref(0)
  const total = ref(0)

  async function settlePreviews(photoIds: number[]): Promise<void> {
    if (photoIds.length === 0) return

    try {
      await waitForPreviews(photoIds, getPreviewStatuses)
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

    try {
      const outcome = await uploadPhotosSequentially(staged, uploadPhoto, (done) => {
        completed.value = done
      })

      phase.value = 'finishing'
      await settlePreviews(outcome.created.map(photo => photo.id))

      const result: PhotoUploadResult = {
        attempted: outcome.attempted,
        created: outcome.created.length,
        failures: outcome.failures.map(({ file, error }) => {
          const { httpStatus, fieldErrors } = parseApiError(error)

          if (fieldErrors.photo) return { file, message: fieldErrors.photo }

          console.error('[Photo upload failed]', { file: file.name, httpStatus, error })

          return { file, message: GENERIC_FAILURE }
        }),
      }

      if (result.failures.length === 0) {
        toast.add({
          title: `Created ${result.created} ${result.created === 1 ? 'photo' : 'photos'}.`,
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
    phase,
    isBusy,
    completed,
    total,
  }
}
