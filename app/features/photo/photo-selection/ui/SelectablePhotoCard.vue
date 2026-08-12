<script setup lang="ts">
import { type Photo, PhotoCard } from '~/entities/photo'

const props = defineProps<{
  photo: Photo
  selected: boolean
  selectionMode: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()

function onCardClick(event: MouseEvent) {
  if (!props.selectionMode) return

  event.preventDefault()
  event.stopPropagation()
  emit('toggle')
}
</script>

<template>
  <div
    class="relative rounded-lg"
    :class="selected && 'ring-2 ring-primary ring-offset-2 ring-offset-muted'"
    @click.capture="onCardClick"
  >
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
