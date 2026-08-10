import { ref } from 'vue'
import { usePhotoUploadRequest } from '../api/usePhotoUploadRequest'
import { uploadPhotosSequentially, type PhotoUploadOutcome } from './uploadPhotosSequentially'

export function usePhotoUpload() {
  const toast = useToast()
  const { uploadPhoto } = usePhotoUploadRequest()

  const isUploading = ref(false)
  const completed = ref(0)
  const total = ref(0)

  function announce(outcome: PhotoUploadOutcome): void {
    if (outcome.failed === 0) {
      toast.add({
        title: `Created ${outcome.created} photos.`,
        color: 'success',
      })

      return
    }

    toast.add({
      title: `Created ${outcome.created} of ${outcome.attempted} photos. ${outcome.failed} failed.`,
      color: 'warning',
    })
  }

  async function uploadPhotos(files: readonly File[]): Promise<void> {
    const staged = [...files]

    isUploading.value = true
    completed.value = 0
    total.value = staged.length

    try {
      const outcome = await uploadPhotosSequentially(staged, uploadPhoto, (done) => {
        completed.value = done
      })

      await navigateTo('/owner')

      announce(outcome)
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
