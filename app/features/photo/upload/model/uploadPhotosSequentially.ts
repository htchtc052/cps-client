export type PhotoUploadFailure = {
  file: File
  error: unknown
}

export type PhotoUploadOutcome<T> = {
  attempted: number
  created: T[]
  failures: PhotoUploadFailure[]
}

export async function uploadPhotosSequentially<T>(
  files: readonly File[],
  upload: (file: File) => Promise<T>,
  onProgress: (completed: number) => void,
): Promise<PhotoUploadOutcome<T>> {
  const created: T[] = []
  const failures: PhotoUploadFailure[] = []

  for (const file of files) {
    try {
      created.push(await upload(file))
    }
    catch (error: unknown) {
      failures.push({ file, error })
    }

    onProgress(created.length + failures.length)
  }

  return {
    attempted: files.length,
    created,
    failures,
  }
}
