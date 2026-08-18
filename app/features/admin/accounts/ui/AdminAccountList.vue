<script setup lang="ts">
import type { AdminUser } from '~/entities/admin'

defineProps<{
  accounts: AdminUser[]
  selectedId: number | null
  isBlocking: boolean
}>()

const emit = defineEmits<{
  select: [AdminUser]
  'toggle-blocking': [AdminUser]
}>()
</script>

<template>
  <div class="divide-y divide-default">
    <div
      v-for="account in accounts"
      :key="account.id"
      class="flex items-center gap-3 py-3"
      :class="account.id === selectedId && 'bg-elevated'"
    >
      <button
        type="button"
        class="flex-1 text-left"
        @click="emit('select', account)"
      >
        <div class="text-sm font-medium text-highlighted">
          {{ account.email }}
        </div>
        <div class="text-xs text-muted">
          {{ account.photoCount }} photos, {{ account.sharedCount }} shared
        </div>
      </button>

      <UBadge
        v-if="account.blockedAt"
        label="Blocked"
        color="error"
        variant="subtle"
      />

      <UButton
        :label="account.blockedAt ? 'Unblock' : 'Block'"
        :color="account.blockedAt ? 'neutral' : 'error'"
        variant="subtle"
        size="xs"
        :disabled="isBlocking"
        @click="emit('toggle-blocking', account)"
      />
    </div>
  </div>
</template>
