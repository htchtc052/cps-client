import { ref } from 'vue'
import type { Photo } from '~/entities/photo'
import { usePhotoUploadRequest } from '../api/usePhotoUploadRequest'

export type PhotoUploadOutcome = {
  attempted: number
  created: number
  failed: number
}

export async function uploadPhotosSequentially(
  files: readonly File[],
  upload: (file: File) => Promise<Photo>,
  onProgress: (completed: number) => void,
): Promise<PhotoUploadOutcome> {
  let created = 0
  let failed = 0

  for (const file of files) {
    try {
      await upload(file)
      created += 1
    }
    catch {
      failed += 1
    }

    onProgress(created + failed)
  }

  return {
    attempted: files.length,
    created,
    failed,
  }
}

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
