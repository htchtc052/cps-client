<script setup lang="ts">
import type { Photo } from '../model/photo'
import PhotoCard from './PhotoCard.vue'

defineProps<{ photos: readonly Photo[] }>()
</script>

<template>
  <UPageGrid class="grid-cols-2 gap-4 xl:grid-cols-4">
    <PhotoCard
      v-for="photo in photos"
      :key="photo.id"
      :photo="photo"
    />
  </UPageGrid>
</template>
