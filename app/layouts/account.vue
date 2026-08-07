<script setup lang="ts">
import type { Account } from '~/entities/account'

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
  <div class="flex min-h-screen flex-col bg-muted">
    <UHeader
      title="CuratedPhotoSpace"
      to="/owner"
      :toggle="false"
    >
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

    <main class="flex-1">
      <UContainer class="py-10">
        <slot />
      </UContainer>
    </main>

    <UFooter>
      <template #left>
        <span class="text-sm text-muted">CuratedPhotoSpace</span>
      </template>
    </UFooter>
  </div>
</template>
