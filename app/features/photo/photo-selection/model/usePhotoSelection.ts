import { computed, ref, type Ref } from 'vue'
import type { AccountPhoto } from '~/entities/photo'

export function usePhotoSelection(photos: Ref<AccountPhoto[]>) {
  const selectedIds = ref(new Set<number>())

  const count = computed(() => selectedIds.value.size)
  const isSelectionMode = computed(() => count.value > 0)
  const ids = computed(() => [...selectedIds.value])
  const selectedPhoto = computed(() => {
    if (count.value !== 1) return

    return photos.value.find(photo => selectedIds.value.has(photo.id))
  })
  const hasMultiple = computed(() => count.value > 1)

  function isSelected(photoId: number): boolean {
    return selectedIds.value.has(photoId)
  }

  function toggle(photoId: number): void {
    if (!selectedIds.value.delete(photoId)) selectedIds.value.add(photoId)
  }

  function clear(): void {
    selectedIds.value.clear()
  }

  return {
    count,
    ids,
    isSelectionMode,
    selectedPhoto,
    hasMultiple,
    isSelected,
    toggle,
    clear,
  }
}
