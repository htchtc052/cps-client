<script setup lang="ts">
import { type Photo, PhotoCard } from '~/entities/photo'

defineProps<{
  photo: Photo
  restoring: boolean
}>()

const emit = defineEmits<{ restore: [] }>()
</script>

<template>
  <div class="relative">
    <PhotoCard :photo="photo" />

    <UButton
      label="Restore"
      icon="i-lucide-undo-2"
      color="neutral"
      variant="solid"
      size="sm"
      class="absolute top-2 right-2"
      :loading="restoring"
      @click.stop.prevent="emit('restore')"
    />
  </div>
</template>
