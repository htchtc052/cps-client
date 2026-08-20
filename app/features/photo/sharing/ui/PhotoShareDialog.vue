<script setup lang="ts">
import {
  formatShare,
  shareFormatLabels,
  type ShareFormat,
  type ShareUrls,
} from '../contract/share-format.contract'

const props = defineProps<{
  open: boolean
  photoName: string
  shareUrls: ShareUrls | null
  isDeleting: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'copy': [string]
  'delete-link': []
}>()

const format = ref<ShareFormat>('link')

const formatItems = Object.entries(shareFormatLabels).map(([value, label]) => ({ value, label }))

const value = computed(() =>
  props.shareUrls === null ? '' : formatShare(format.value, props.shareUrls, props.photoName),
)
</script>

<template>
  <UModal
    :open="open"
    :title="photoName"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <div class="space-y-3">
        <UTabs
          v-model="format"
          :items="formatItems"
          size="sm"
        />

        <UInput
          :model-value="value"
          readonly
          class="w-full"
          @focus="($event.target as HTMLInputElement).select()"
        />
      </div>
    </template>

    <template #footer>
      <UButton
        label="Copy"
        icon="i-lucide-copy"
        @click="emit('copy', value)"
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
