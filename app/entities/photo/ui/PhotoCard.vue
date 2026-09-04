<script setup lang="ts">
import type { Photo } from '../model/photo'

defineProps<{ photo: Photo }>()
</script>

<template>
  <article class="min-w-0">
    <a
      href="#"
      :data-pswp-src="photo.viewerUrl"
      :data-pswp-width="photo.viewerWidth"
      :data-pswp-height="photo.viewerHeight"
      data-cropped="true"
      class="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-elevated ring ring-default"
    >
      <img
        v-if="photo.previewUrl"
        :src="photo.previewUrl"
        :alt="photo.name"
        loading="lazy"
        decoding="async"
        class="size-full object-cover"
      >

      <UIcon
        v-else
        name="i-lucide-image"
        class="size-8 text-dimmed"
      />
    </a>

    <p class="mt-1 truncate text-sm text-toned">
      {{ photo.name }}
    </p>
  </article>
</template>
