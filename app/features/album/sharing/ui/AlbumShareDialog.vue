<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  photosCount: number
  shareUrl: string | null
  isRevoking: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'copy': [string]
  'revoke': []
}>()

const photosLabel = computed(() => props.photosCount === 1 ? '1 photo' : `${props.photosCount} photos`)
</script>

<template>
  <UModal
    :open="open"
    :title="title"
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
        label="Open"
        icon="i-lucide-external-link"
        color="neutral"
        variant="subtle"
        :to="shareUrl ?? undefined"
        target="_blank"
        :disabled="!shareUrl"
      />

      <UButton
        label="Revoke link"
        icon="i-lucide-link-2-off"
        color="error"
        variant="subtle"
        :loading="isRevoking"
        :disabled="isRevoking"
        @click="emit('revoke')"
      />
    </template>
  </UModal>
</template>
