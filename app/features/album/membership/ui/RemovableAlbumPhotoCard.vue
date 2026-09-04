<script setup lang="ts">
import { type AccountPhoto, PhotoCard } from '~/entities/photo'

defineProps<{
  photo: AccountPhoto
  selected: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <div class="relative">
    <PhotoCard :photo="photo" />

    <UCheckbox
      :model-value="selected"
      :aria-label="`Select ${photo.name}`"
      class="absolute top-2 left-2"
      @click.stop
      @update:model-value="emit('toggle')"
    />
  </div>
</template>
