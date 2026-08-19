<script setup lang="ts">
import type { AdminPhoto } from '~/entities/admin'

defineProps<{
  photos: AdminPhoto[]
  isDeleting: boolean
}>()

const emit = defineEmits<{
  delete: [AdminPhoto]
}>()
</script>

<template>
  <div class="divide-y divide-default">
    <div
      v-for="photo in photos"
      :key="photo.id"
      class="flex items-center gap-3 py-3"
    >
      <img
        v-if="photo.previewUrl"
        :src="photo.previewUrl"
        :alt="photo.name"
        class="size-14 rounded object-cover"
      >
      <div
        v-else
        class="size-14 rounded bg-elevated"
      />

      <div class="min-w-0 flex-1">
        <div class="truncate text-sm text-highlighted">
          {{ photo.originalName }}
        </div>
        <div class="text-xs text-muted">
          {{ new Date(photo.createdAt).toLocaleDateString() }}
        </div>
      </div>

      <UBadge
        v-if="photo.shareToken"
        label="Shared"
        color="warning"
        variant="subtle"
      />

      <UButton
        label="Delete"
        color="error"
        variant="subtle"
        size="xs"
        :disabled="isDeleting"
        @click="emit('delete', photo)"
      />
    </div>
  </div>
</template>
