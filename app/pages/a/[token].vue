<script setup lang="ts">
import { useSharedAlbum } from '~/entities/album'
import { SharedAlbumPhotosWidget } from '~/widgets/shared-album-photos'

definePageMeta({ layout: 'public' })

const route = useRoute()
const token = String(route.params.token)

const { data: album, error } = await useSharedAlbum(token)

const statusCode = computed(() => error.value?.statusCode)
const isNotFound = computed(() => statusCode.value === 403 || statusCode.value === 404)

setResponseStatus(error.value ? (isNotFound.value ? 404 : 500) : 200)

const photosCountLabel = computed(() => {
  const count = album.value?.photosCount ?? 0

  return count === 1 ? '1 photo' : `${count} photos`
})

const requestUrl = useRequestURL()

useSeoMeta({
  title: 'Shared album',
  description: () => `View and download ${album.value?.photosCount ?? 0} shared photo(s).`,
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
      title="This shared album is unavailable"
    />

    <UEmpty
      v-else-if="error"
      icon="i-lucide-triangle-alert"
      title="Shared album could not be loaded"
      description="Try again later."
    />

    <template v-else-if="album">
      <UPageHeader
        title="Shared album"
        :description="photosCountLabel"
      />

      <SharedAlbumPhotosWidget
        :token="token"
        class="mt-8"
      />
    </template>
  </div>
</template>
