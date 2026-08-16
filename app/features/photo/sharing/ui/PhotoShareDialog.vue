<script setup lang="ts">
defineProps<{
  open: boolean
  photoName: string
  shareUrl: string
  isDeleting: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'copy-link': []
  'delete-link': []
}>()
</script>

<template>
  <UModal
    :open="open"
    :title="photoName"
    @update:open="value => emit('update:open', value)"
  >
    <template #body>
      <UFormField label="Public link">
        <UInput
          :model-value="shareUrl"
          readonly
          class="w-full"
        />
      </UFormField>
    </template>

    <template #footer>
      <UButton
        label="Copy link"
        icon="i-lucide-copy"
        @click="emit('copy-link')"
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
