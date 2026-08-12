<script setup lang="ts">
import { PhotoGrid } from '~/entities/photo'
import { RestorablePhotoCard, useTrashActions, useTrashedPhotos } from '~/features/photo/trash'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Trash' })

const { data: photos, error } = await useTrashedPhotos()
const { restore, empty, isRestoring, isEmptying } = useTrashActions(photos)

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)
</script>

<template>
  <div>
    <UPageHeader title="Trash">
      <template #links>
        <UButton
          label="Empty trash"
          icon="i-lucide-trash-2"
          color="error"
          variant="subtle"
          :loading="isEmptying"
          :disabled="isEmptying || photos.length === 0"
          @click="empty"
        />

        <UButton
          to="/owner"
          color="neutral"
          variant="subtle"
          icon="i-lucide-arrow-left"
        >
          Back to photos
        </UButton>
      </template>
    </UPageHeader>

    <div
      ref="galleryElement"
      class="mt-8"
    >
      <UEmpty
        v-if="error"
        icon="i-lucide-triangle-alert"
        title="Trash is unavailable"
        description="We could not load your trash. Try again later."
      />

      <UEmpty
        v-else-if="photos.length === 0"
        icon="i-lucide-trash-2"
        title="Trash is empty"
        description="Photos you move to trash will appear here."
        :actions="[{ label: 'Back to photos', to: '/owner' }]"
      />

      <PhotoGrid
        v-else
        v-slot="{ photo }"
        :photos="photos"
      >
        <RestorablePhotoCard
          :photo="photo"
          :restoring="isRestoring(photo.id)"
          @restore="restore(photo.id)"
        />
      </PhotoGrid>
    </div>
  </div>
</template>
