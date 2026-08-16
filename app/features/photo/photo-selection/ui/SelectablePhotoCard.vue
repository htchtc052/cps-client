<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { type AccountPhoto, PhotoCard } from '~/entities/photo'

const props = defineProps<{
  photo: AccountPhoto
  selected: boolean
  actionsDisabled: boolean
}>()

const emit = defineEmits<{
  toggle: []
  share: []
  'manage-share': []
  'move-to-trash': []
}>()

const menuItems = computed<DropdownMenuItem[][]>(() => [
  ...(props.photo.shareToken === null
    ? [
        [
          {
            label: 'Share photo',
            icon: 'i-lucide-link',
            onSelect: () => emit('share'),
          },
        ],
      ]
    : []),
  [
    {
      label: 'Move to trash',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => emit('move-to-trash'),
    },
  ],
])
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

    <UDropdownMenu :items="menuItems">
      <UButton
        icon="i-lucide-ellipsis-vertical"
        color="neutral"
        variant="ghost"
        size="xs"
        :aria-label="`Actions for ${photo.name}`"
        :disabled="actionsDisabled"
        class="absolute top-2 right-2 bg-black/40 text-white hover:bg-black/60 focus-visible:bg-black/60"
      />
    </UDropdownMenu>

    <UButton
      v-if="photo.shareToken !== null"
      icon="i-lucide-link"
      color="neutral"
      variant="ghost"
      size="xs"
      :aria-label="`Manage share link for ${photo.name}`"
      :disabled="actionsDisabled"
      class="absolute bottom-2 right-2 bg-black/40 text-white hover:bg-black/60 focus-visible:bg-black/60"
      @click.stop="emit('manage-share')"
    />
  </div>
</template>
