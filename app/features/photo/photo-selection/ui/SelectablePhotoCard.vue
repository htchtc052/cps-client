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
  'copy-share-link': []
  'stop-sharing': []
  'move-to-trash': []
}>()

const menuItems = computed<DropdownMenuItem[][]>(() => [
  props.photo.shareToken === null
    ? [
        {
          label: 'Share photo',
          icon: 'i-lucide-link',
          onSelect: () => emit('share'),
        },
      ]
    : [
        {
          label: 'Copy share link',
          icon: 'i-lucide-copy',
          onSelect: () => emit('copy-share-link'),
        },
        {
          label: 'Stop sharing',
          icon: 'i-lucide-link-2-off',
          onSelect: () => emit('stop-sharing'),
        },
      ],
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

    <span
      v-if="photo.shareToken !== null"
      role="img"
      aria-label="Shared by link"
      class="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-black/40 p-1"
    >
      <UIcon name="i-lucide-link" class="size-3.5 text-white" />
    </span>
  </div>
</template>
