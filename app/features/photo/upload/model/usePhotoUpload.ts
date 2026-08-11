import { ref } from 'vue'
import { parseApiError } from '~/shared/api'
import { usePhotoUploadRequest } from '../api/usePhotoUploadRequest'
import { uploadPhotosSequentially } from './uploadPhotosSequentially'

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
