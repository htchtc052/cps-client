<script setup lang="ts">
import { useSharedPhoto } from '../model/useSharedPhoto'

const props = defineProps<{ token: string }>()

const { data: photo, error } = await useSharedPhoto(props.token)

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
      description="The link may have expired or been disabled."
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

      <div class="mt-8 flex justify-center">
        <img
          :src="photo.viewerUrl"
          :alt="photo.name"
          class="max-h-[80vh] max-w-full object-contain"
        >
      </div>
    </template>
  </div>
</template>
