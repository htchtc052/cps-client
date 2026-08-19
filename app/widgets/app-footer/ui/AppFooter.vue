<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <UFooter class="border-t border-default">
    <template #left>
      <span class="text-sm text-muted">&copy; {{ year }} CuratedPhoto. All rights reserved.</span>
    </template>

    <template #right>
      <div class="flex gap-4 text-sm text-muted">
        <NuxtLink
          to="/terms"
          class="hover:text-default"
        >
          Terms
        </NuxtLink>
        <NuxtLink
          to="/privacy"
          class="hover:text-default"
        >
          Privacy
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="hover:text-default"
        >
          Contact
        </NuxtLink>
      </div>
    </template>
  </UFooter>
</template>
