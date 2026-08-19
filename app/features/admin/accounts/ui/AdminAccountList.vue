<script setup lang="ts">
import type { AdminUser } from '~/entities/admin'

defineProps<{
  accounts: AdminUser[]
  isBlocking: boolean
  isImpersonating: boolean
}>()

const emit = defineEmits<{
  impersonate: [AdminUser]
  'toggle-blocking': [AdminUser]
}>()
</script>

<template>
  <div class="divide-y divide-default">
    <div
      v-for="account in accounts"
      :key="account.id"
      class="flex items-center gap-3 py-3"
    >
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-medium text-highlighted">
          {{ account.email }}
        </div>
        <div class="text-xs text-muted">
          {{ account.photoCount }} photos, {{ account.sharedCount }} shared
        </div>
      </div>

      <UBadge
        v-if="account.blockedAt"
        label="Blocked"
        color="error"
        variant="subtle"
      />

      <UButton
        label="Sign in as"
        color="neutral"
        variant="subtle"
        size="xs"
        :disabled="isImpersonating || account.blockedAt !== null"
        @click="emit('impersonate', account)"
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
