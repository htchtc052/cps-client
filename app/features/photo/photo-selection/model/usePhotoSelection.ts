import { computed, ref } from 'vue'

export function usePhotoSelection() {
  const selectedIds = ref(new Set<number>())

  const count = computed(() => selectedIds.value.size)
  const isSelectionMode = computed(() => count.value > 0)

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
    isSelectionMode,
    isSelected,
    toggle,
    clear,
  }
}
