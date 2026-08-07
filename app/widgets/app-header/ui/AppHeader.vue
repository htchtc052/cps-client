<script setup lang="ts">
import type { Account } from '~/entities/account'
import { AppLogo } from '~/shared/ui'

const { user, logout } = useSanctumAuth<Account>()

const isLoggingOut = ref(false)

async function handleLogout() {
  try {
    isLoggingOut.value = true
    await logout()
  }
  finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <UHeader
    to="/owner"
    :toggle="false"
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <span class="hidden truncate text-sm text-muted sm:block">{{ user?.email }}</span>

      <UButton
        color="neutral"
        variant="subtle"
        icon="i-lucide-log-out"
        :loading="isLoggingOut"
        @click="handleLogout"
      >
        Sign out
      </UButton>
    </template>
  </UHeader>
</template>
