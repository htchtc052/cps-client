<script setup lang="ts">
const props = defineProps<{
  open: boolean
  photosCount: number
  shareUrl: string | null
  isDeleting: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'copy': [string]
  'delete-link': []
}>()

const photosLabel = computed(() => props.photosCount === 1 ? '1 photo' : `${props.photosCount} photos`)
</script>

<template>
  <UModal
    :open="open"
    title="Shared album"
    :description="photosLabel"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UInput
        :model-value="shareUrl ?? ''"
        readonly
        class="w-full"
        @focus="($event.target as HTMLInputElement).select()"
      />
    </template>

    <template #footer>
      <UButton
        label="Copy"
        icon="i-lucide-copy"
        :disabled="!shareUrl"
        @click="shareUrl && emit('copy', shareUrl)"
      />

      <UButton
        label="Delete link"
        icon="i-lucide-link-2-off"
        color="error"
        variant="subtle"
        :loading="isDeleting"
        :disabled="isDeleting"
        @click="emit('delete-link')"
      />
    </template>
  </UModal>
</template>
