export type PhotoUploadFailure = {
  file: File
  error: unknown
}

export type PhotoUploadOutcome<T> = {
  attempted: number
  succeeded: T[]
  failures: PhotoUploadFailure[]
}

export async function uploadPhotosSequentially<T>(
  files: readonly File[],
  upload: (file: File) => Promise<T>,
  onProgress: (completed: number) => void,
): Promise<PhotoUploadOutcome<T>> {
  const succeeded: T[] = []
  const failures: PhotoUploadFailure[] = []

  for (const file of files) {
    try {
      succeeded.push(await upload(file))
    }
    catch (error: unknown) {
      failures.push({ file, error })
    }

    onProgress(succeeded.length + failures.length)
  }

  return {
    attempted: files.length,
    succeeded,
    failures,
  }
}
