<script setup lang="ts">
import { PhotoGrid } from '~/entities/photo'
import { SelectablePhotoCard, usePhotoSelection } from '~/features/photo/photo-selection'
import { usePhotoSharing } from '~/features/photo/sharing'
import { useMoveToTrash } from '~/features/photo/trash'
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
const { share, copyLink, disableSharing, isSharing, isDisablingSharing } = usePhotoSharing(photos)

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
            label="Move to trash"
            icon="i-lucide-trash-2"
            color="error"
            size="sm"
            :loading="isMoving"
            :disabled="isMoving"
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
        <div class="w-full space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <PhotoLibraryNavigation />

            <span class="text-sm text-muted">{{ photos.length }} photos</span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <USelect
              :items="orientationItems"
              :model-value="orientation"
              :disabled="isRefreshing"
              class="w-full"
              @update:model-value="onOrientationChange"
            />

            <USelect
              :items="sortItems"
              :model-value="sort"
              :disabled="isRefreshing"
              class="w-full"
              @update:model-value="onSortChange"
            />
          </div>
        </div>
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
          :actions-disabled="isSharing || isDisablingSharing || isMoving"
          @toggle="toggle(photo.id)"
          @share="share(photo.id)"
          @copy-share-link="copyLink(photo.shareToken!)"
          @stop-sharing="disableSharing(photo.id)"
          @move-to-trash="moveToTrash([photo.id])"
        />
      </PhotoGrid>
    </div>
  </div>
</template>
