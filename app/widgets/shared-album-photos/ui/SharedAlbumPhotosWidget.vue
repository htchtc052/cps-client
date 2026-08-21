<script setup lang="ts">
import { PhotoCard, PhotoGrid } from '~/entities/photo'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { useSharedAlbumPhotos } from '../model/useSharedAlbumPhotos'

const props = defineProps<{ token: string }>()

const { data: photos, error, status } = useSharedAlbumPhotos(props.token)

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const isLoading = computed(() => status.value === 'idle' || status.value === 'pending')
</script>

<template>
  <div ref="galleryElement">
    <div
      v-if="isLoading"
      class="flex justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="size-6 animate-spin text-dimmed"
      />
    </div>

    <UEmpty
      v-else-if="error"
      icon="i-lucide-triangle-alert"
      title="Album photos could not be loaded"
    />

    <UEmpty
      v-else-if="photos.length === 0"
      icon="i-lucide-image-off"
      title="No photos in this album"
    />

    <PhotoGrid
      v-else
      v-slot="{ photo }"
      :photos="photos"
    >
      <div class="min-w-0">
        <PhotoCard :photo="photo" />

        <UButton
          :to="photo.downloadUrl"
          icon="i-lucide-download"
          label="Download original"
          color="neutral"
          variant="link"
          size="xs"
          class="mt-1 p-0"
        />
      </div>
    </PhotoGrid>
  </div>
</template>
