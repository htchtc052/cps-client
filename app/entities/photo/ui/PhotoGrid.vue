<script setup lang="ts" generic="T extends Photo">
import type { Photo } from '../model/photo'
import PhotoCard from './PhotoCard.vue'

defineProps<{ photos: readonly T[] }>()
</script>

<template>
  <UPageGrid class="grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
    <template
      v-for="photo in photos"
      :key="photo.id"
    >
      <slot :photo="photo">
        <PhotoCard :photo="photo" />
      </slot>
    </template>
  </UPageGrid>
</template>
