<script setup lang="ts">
import { AppLogo } from '~/shared/ui'
import { AppFooter } from '~/widgets/app-footer'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-muted">
    <main class="flex flex-1 items-center justify-center p-6">
      <div class="w-full max-w-sm space-y-6">
        <div class="text-center text-xl font-bold text-highlighted">
          <AppLogo />
        </div>

        <UCard>
          <slot />
        </UCard>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
