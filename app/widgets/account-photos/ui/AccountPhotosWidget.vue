<script setup lang="ts">
import { PhotoGrid } from '~/entities/photo'
import { SelectablePhotoCard, usePhotoSelection } from '~/features/photo/photo-selection'
import { useMoveToTrash } from '~/features/photo/trash'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { useAccountPhotos } from '../model/useAccountPhotos'

const visibilityFilters = ['All photos', 'Public', 'Private']

const { data: photos, error } = await useAccountPhotos()

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const { count, ids, isSelectionMode, isSelected, toggle, clear } = usePhotoSelection()
const { moveToTrash, isMoving } = useMoveToTrash(photos, clear)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') clear()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
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
            :loading="isMoving"
            :disabled="isMoving"
            @click="moveToTrash(ids)"
          />

          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="clear"
          />
        </div>
      </template>

      <template v-else>
        <div class="flex flex-wrap items-center gap-3">
          <UInput
            icon="i-lucide-search"
            placeholder="Search photos"
            disabled
            class="w-64"
          />

          <USelect
            :items="visibilityFilters"
            :model-value="visibilityFilters[0]"
            disabled
            class="w-40"
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
        v-else-if="photos.length === 0"
        icon="i-lucide-image"
        title="No photos yet"
        description="Upload your first photos to start your collection."
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
