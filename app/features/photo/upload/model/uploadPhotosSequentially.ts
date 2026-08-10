export type PhotoUploadOutcome = {
  attempted: number
  created: number
  failed: number
}

export async function uploadPhotosSequentially(
  files: readonly File[],
  upload: (file: File) => Promise<unknown>,
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
