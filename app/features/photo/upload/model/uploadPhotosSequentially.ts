export type PhotoUploadFailure = {
  file: File
  error: unknown
}

export type PhotoUploadSuccess<T> = {
  file: File
  photo: T
}

export type PhotoUploadOutcome<T> = {
  attempted: number
  succeeded: PhotoUploadSuccess<T>[]
  failures: PhotoUploadFailure[]
}

export async function uploadPhotosSequentially<T>(
  files: readonly File[],
  upload: (file: File) => Promise<T>,
  onProgress: (completed: number, file: File, photo: T | null) => void,
): Promise<PhotoUploadOutcome<T>> {
  const succeeded: PhotoUploadSuccess<T>[] = []
  const failures: PhotoUploadFailure[] = []

  for (const file of files) {
    let photo: T | null = null

    try {
      photo = await upload(file)
      succeeded.push({ file, photo })
    }
    catch (error: unknown) {
      failures.push({ file, error })
    }

    onProgress(succeeded.length + failures.length, file, photo)
  }

  return {
    attempted: files.length,
    succeeded,
    failures,
  }
}
