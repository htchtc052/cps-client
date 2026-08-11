<script setup lang="ts">
import { PhotoGrid } from '~/entities/photo'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { useAccountPhotos } from '../model/useAccountPhotos'

const visibilityFilters = ['All photos', 'Public', 'Private']

const { data: photos, error } = await useAccountPhotos()

const gallery = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(gallery)
</script>

<template>
  <div ref="gallery">
    <div class="z-10 flex flex-wrap items-center justify-between gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
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
    </div>

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
      :photos="photos"
    />
  </div>
</template>
