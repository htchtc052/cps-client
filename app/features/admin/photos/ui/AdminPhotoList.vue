<script setup lang="ts">
import type { AdminPhoto } from '~/entities/admin'

defineProps<{
  photos: AdminPhoto[]
  isBlocking: boolean
}>()

const emit = defineEmits<{
  'toggle-blocking': [AdminPhoto]
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

      <UBadge
        v-if="photo.blockedAt"
        label="Blocked"
        color="error"
        variant="subtle"
      />

      <UButton
        :label="photo.blockedAt ? 'Unblock' : 'Block'"
        :color="photo.blockedAt ? 'neutral' : 'error'"
        variant="subtle"
        size="xs"
        :disabled="isBlocking"
        @click="emit('toggle-blocking', photo)"
      />
    </div>
  </div>
</template>
