import { ref } from 'vue'
import { parseApiError } from '~/shared/api'
import { usePhotoUploadRequest } from '../api/usePhotoUploadRequest'
import { uploadPhotosSequentially, type PhotoUploadFailure } from './uploadPhotosSequentially'

const GENERIC_FAILURE = 'Upload failed. Try again.'

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

  const isUploading = ref(false)
  const completed = ref(0)
  const total = ref(0)

  function describeFailure({ file, error }: PhotoUploadFailure): PhotoUploadFailureView {
    const parsed = parseApiError(error)
    const message = parsed.validationErrors.find(({ name }) => name === 'photo')?.message

    if (message) return { file, message }

    console.error('[Photo upload failed]', { file: file.name, httpStatus: parsed.httpStatus, error })

    return { file, message: GENERIC_FAILURE }
  }

  function announce(result: PhotoUploadResult): void {
    if (result.failures.length === 0) {
      toast.add({
        title: `Created ${result.created} photos.`,
        color: 'success',
      })

      return
    }

    toast.add({
      title: result.created === 0
        ? 'No photos were created.'
        : `Created ${result.created} of ${result.attempted} photos. ${result.failures.length} couldn’t be uploaded.`,
      color: 'warning',
    })
  }

  async function uploadPhotos(files: readonly File[]): Promise<PhotoUploadResult> {
    const staged = [...files]

    isUploading.value = true
    completed.value = 0
    total.value = staged.length

    try {
      const outcome = await uploadPhotosSequentially(staged, uploadPhoto, (done) => {
        completed.value = done
      })

      const result: PhotoUploadResult = {
        attempted: outcome.attempted,
        created: outcome.created,
        failures: outcome.failures.map(describeFailure),
      }

      if (result.failures.length === 0) {
        await navigateTo('/owner')
      }

      announce(result)

      return result
    }
    finally {
      isUploading.value = false
    }
  }

  return {
    uploadPhotos,
    isUploading,
    completed,
    total,
  }
}
