<script setup lang="ts">
import { AppFooter } from '~/widgets/app-footer'
import { AppHeader } from '~/widgets/app-header'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-muted">
    <AppHeader />

    <main class="flex-1">
      <UContainer class="py-10">
        <slot />
      </UContainer>
    </main>

    <AppFooter />
  </div>
</template>
