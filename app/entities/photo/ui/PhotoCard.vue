<script setup lang="ts">
import type { Photo } from '../model/photo'

defineProps<{ photo: Photo }>()
</script>

<template>
  <article>
    <a
      :href="photo.originalUrl"
      :data-pswp-width="photo.width"
      :data-pswp-height="photo.height"
      data-cropped="true"
      class="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-elevated ring ring-default"
    >
      <img
        v-if="photo.previewUrl"
        :src="photo.previewUrl"
        :alt="photo.name"
        class="size-full object-cover"
      >

      <UIcon
        v-else
        name="i-lucide-image"
        class="size-8 text-dimmed"
      />
    </a>
  </article>
</template>
