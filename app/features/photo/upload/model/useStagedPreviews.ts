import type { Ref } from 'vue'

export function useStagedPreviews(files: Ref<readonly File[]>) {
  const urls = new Map<File, string>()

  function previewUrl(file: File): string {
    const existing = urls.get(file)

    if (existing !== undefined) return existing

    const created = URL.createObjectURL(file)

    urls.set(file, created)

    return created
  }

  function revokeUnused(): void {
    const staged = new Set(files.value)

    for (const [file, url] of urls) {
      if (staged.has(file)) continue

      URL.revokeObjectURL(url)
      urls.delete(file)
    }
  }

  watch(files, revokeUnused)

  onScopeDispose(() => {
    for (const url of urls.values()) URL.revokeObjectURL(url)

    urls.clear()
  })

  return { previewUrl }
}
