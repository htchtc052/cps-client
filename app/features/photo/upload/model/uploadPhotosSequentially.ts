export type PhotoUploadFailure = {
  file: File
  error: unknown
}

export type PhotoUploadOutcome = {
  attempted: number
  created: number
  failures: PhotoUploadFailure[]
}

export async function uploadPhotosSequentially(
  files: readonly File[],
  upload: (file: File) => Promise<unknown>,
  onProgress: (completed: number) => void,
): Promise<PhotoUploadOutcome> {
  let created = 0
  const failures: PhotoUploadFailure[] = []

  for (const file of files) {
    try {
      await upload(file)
      created += 1
    }
    catch (error: unknown) {
      failures.push({ file, error })
    }

    onProgress(created + failures.length)
  }

  return {
    attempted: files.length,
    created,
    failures,
  }
}
