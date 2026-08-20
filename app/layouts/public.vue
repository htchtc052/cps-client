<script setup lang="ts">
import { AppLogo } from '~/shared/ui'
import { AppFooter } from '~/widgets/app-footer'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-muted">
    <UHeader
      title="CuratedPhoto"
      :toggle="false"
      :ui="{ root: 'bg-default backdrop-blur-none' }"
    >
      <template #title>
        <AppLogo />
      </template>
    </UHeader>

    <main class="flex-1">
      <UContainer class="py-10">
        <slot />
      </UContainer>
    </main>

    <AppFooter />
  </div>
</template>
