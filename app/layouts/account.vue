<script setup lang="ts">
import { useAccount } from '~/entities/account'
import { SignOutButton } from '~/features/auth/logout'

const account = useAccount()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex items-center justify-between gap-4 border-b border-default px-6 py-4">
      <span class="font-semibold">CuratedPhotoSpace</span>

      <div class="flex items-center gap-3">
        <span class="text-sm text-muted" data-testid="account-email">{{ account?.email }}</span>
        <SignOutButton />
      </div>
    </header>

    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
