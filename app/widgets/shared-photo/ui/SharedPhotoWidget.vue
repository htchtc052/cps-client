<script setup lang="ts">
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { useSharedPhoto } from '../model/useSharedPhoto'

const props = defineProps<{ token: string }>()

const { data: photo, error } = await useSharedPhoto(props.token)

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const statusCode = computed(() => error.value?.statusCode)
const isNotFound = computed(() => statusCode.value === 403 || statusCode.value === 404)

setResponseStatus(error.value ? (isNotFound.value ? 404 : 500) : 200)

const requestUrl = useRequestURL()

useSeoMeta({
  title: () => photo.value?.name ?? 'Shared photo',
  description: 'View and download this shared photo.',
  ogTitle: () => photo.value?.name ?? 'Shared photo',
  ogDescription: 'View and download this shared photo.',
  ogImage: () => photo.value?.previewUrl ?? undefined,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `${requestUrl.origin}${requestUrl.pathname}` }],
})
</script>

<template>
  <div>
    <UEmpty
      v-if="isNotFound"
      icon="i-lucide-image-off"
      title="This shared photo is unavailable"
    />

    <UEmpty
      v-else-if="error"
      icon="i-lucide-triangle-alert"
      title="Shared photo could not be loaded"
      description="Try again later."
    />

    <template v-else-if="photo">
      <UPageHeader :title="photo.name">
        <template #links>
          <UButton
            :to="photo.downloadUrl"
            icon="i-lucide-download"
          >
            Download original
          </UButton>
        </template>
      </UPageHeader>

      <div
        ref="galleryElement"
        class="mt-8 flex justify-center"
      >
        <button
          type="button"
          :data-pswp-src="photo.viewerUrl"
          :data-pswp-width="photo.viewerWidth"
          :data-pswp-height="photo.viewerHeight"
        >
          <img
            :src="photo.viewerUrl"
            :alt="photo.name"
            class="max-h-[80vh] max-w-full object-contain"
          >
        </button>
      </div>
    </template>
  </div>
</template>
