<script setup lang="ts">
import type { Account } from '~/entities/account'
import { useHydrated } from '~/shared/lib'

const { user, logout } = useSanctumAuth<Account>()

const hydrated = useHydrated()
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
    <header class="border-b border-default bg-elevated">
      <UContainer class="h-16 flex items-center justify-between gap-4">
        <span class="font-semibold">CuratedPhotoSpace</span>

        <div class="flex items-center gap-3">
          <span class="text-sm text-muted" data-testid="account-email">{{ user?.email }}</span>

          <!-- Sign-out only works once Vue owns the server-rendered markup. -->
          <UButton
            color="neutral"
            variant="subtle"
            :loading="isLoggingOut"
            :disabled="!hydrated"
            data-testid="logout"
            @click="handleLogout"
          >
            Sign out
          </UButton>
        </div>
      </UContainer>
    </header>

    <main class="flex-1">
      <UContainer class="py-10">
        <slot />
      </UContainer>
    </main>
  </div>
</template>
