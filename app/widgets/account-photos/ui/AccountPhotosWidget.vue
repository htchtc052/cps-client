<script setup lang="ts">
import { PhotoGrid } from '~/entities/photo'
import { SelectablePhotoCard, usePhotoSelection } from '~/features/photo/photo-selection'
import { useMoveToTrash } from '~/features/photo/trash'
import { usePhotoVisibility } from '~/features/photo/visibility'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { PhotoLibraryNavigation } from '~/widgets/photo-library-navigation'
import type { PhotoSort } from '../api/useAccountPhotosRequest'
import { useAccountPhotos, type PhotoOrientationFilter } from '../model/useAccountPhotos'

const orientationItems: { label: string, value: PhotoOrientationFilter }[] = [
  { label: 'All orientations', value: 'all' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Square', value: 'square' },
]

const sortItems: { label: string, value: PhotoSort }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Name', value: 'name' },
]

const { photos, error, orientation, sort, isRefreshing, refresh } = await useAccountPhotos()

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const { count, ids, isSelectionMode, isSelected, toggle, clear } = usePhotoSelection()
const { moveToTrash, isMoving } = useMoveToTrash(photos, clear)
const { setVisibility, isUpdating } = usePhotoVisibility(photos, clear)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') clear()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

function onOrientationChange(value: PhotoOrientationFilter) {
  orientation.value = value
  clear()
  refresh()
}

function onSortChange(value: PhotoSort) {
  sort.value = value
  clear()
  refresh()
}

function showAllPhotos() {
  orientation.value = 'all'
  clear()
  refresh()
}
</script>

<template>
  <div>
    <div class="z-10 flex flex-wrap items-center justify-between gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <template v-if="isSelectionMode">
        <span class="text-sm font-medium">{{ count }} selected</span>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            label="Show on profile"
            icon="i-lucide-eye"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="isUpdating || isMoving"
            @click="setVisibility(ids, false)"
          />

          <UButton
            label="Hide from profile"
            icon="i-lucide-eye-off"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="isUpdating || isMoving"
            @click="setVisibility(ids, true)"
          />

          <UButton
            label="Move to trash"
            icon="i-lucide-trash-2"
            color="error"
            size="sm"
            :loading="isMoving"
            :disabled="isMoving || isUpdating"
            @click="moveToTrash(ids)"
          />

          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            size="sm"
            @click="clear"
          />
        </div>
      </template>

      <template v-else>
        <div class="flex flex-wrap items-center gap-3">
          <PhotoLibraryNavigation />

          <USelect
            :items="orientationItems"
            :model-value="orientation"
            :disabled="isRefreshing"
            class="w-44"
            @update:model-value="onOrientationChange"
          />

          <USelect
            :items="sortItems"
            :model-value="sort"
            :disabled="isRefreshing"
            class="w-40"
            @update:model-value="onSortChange"
          />
        </div>

        <span class="text-sm text-muted">{{ photos.length }} photos</span>
      </template>
    </div>

    <div ref="galleryElement">
      <UEmpty
        v-if="error"
        icon="i-lucide-triangle-alert"
        title="Photos are unavailable"
        description="We could not load your photos. Try again later."
      />

      <UEmpty
        v-else-if="photos.length === 0 && orientation === 'all'"
        icon="i-lucide-image"
        title="No photos yet"
        description="Upload your first photos to start your collection."
      />

      <UEmpty
        v-else-if="photos.length === 0"
        icon="i-lucide-image-off"
        title="No matching photos"
        description="No photos match the selected orientation."
        :actions="[{ label: 'Show all photos', onClick: showAllPhotos }]"
      />

      <PhotoGrid
        v-else
        v-slot="{ photo }"
        :photos="photos"
      >
        <SelectablePhotoCard
          :photo="photo"
          :selected="isSelected(photo.id)"
          :selection-mode="isSelectionMode"
          @toggle="toggle(photo.id)"
        />
      </PhotoGrid>
    </div>
  </div>
</template>
