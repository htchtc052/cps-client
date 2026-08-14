<script setup lang="ts">
import { PhotoGrid } from '~/entities/photo'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import type { PublicProfile } from '../api/usePublicProfileRequest'

const props = defineProps<{
  profile: PublicProfile | null
  hasError: boolean
}>()

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)
</script>

<template>
  <div>
    <UPageHeader :title="props.profile?.name ?? 'Shared profile'" />

    <div
      ref="galleryElement"
      class="mt-8"
    >
      <UEmpty
        v-if="hasError"
        icon="i-lucide-triangle-alert"
        title="This shared profile is unavailable"
      />

      <UEmpty
        v-else-if="!profile || profile.photos.length === 0"
        icon="i-lucide-image"
        title="No public photos yet"
      />

      <PhotoGrid
        v-else
        :photos="profile.photos"
      />
    </div>
  </div>
</template>
