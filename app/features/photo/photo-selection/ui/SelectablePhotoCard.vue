<script setup lang="ts">
import { type AccountPhoto, PhotoCard } from '~/entities/photo'

const props = defineProps<{
  photo: AccountPhoto
  selected: boolean
  selectionMode: boolean
  visibilityDisabled: boolean
}>()

const emit = defineEmits<{
  toggle: []
  'set-visibility': [hidden: boolean]
}>()

const visibilityLabel = computed(() => props.photo.isHidden
  ? `Hidden from profile — show ${props.photo.name}`
  : `Hide ${props.photo.name} from profile`,
)

function onCardClick(event: MouseEvent) {
  if (!props.selectionMode) return
  if (event.target instanceof Element && event.target.closest('[data-photo-visibility-control]')) return

  event.preventDefault()
  event.stopPropagation()
  emit('toggle')
}
</script>

<template>
  <div
    class="relative"
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

    <UTooltip :text="visibilityLabel">
      <UButton
        data-photo-visibility-control
        icon="i-lucide-eye-off"
        color="neutral"
        :variant="photo.isHidden ? 'solid' : 'subtle'"
        size="sm"
        :aria-label="visibilityLabel"
        :disabled="visibilityDisabled"
        class="absolute top-2 right-2"
        @click.stop="emit('set-visibility', !photo.isHidden)"
      />
    </UTooltip>
  </div>
</template>
