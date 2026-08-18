<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <UFooter class="border-t border-default">
    <template #left>
      <span class="text-sm text-muted">&copy; {{ year }} CuratedPhoto. All rights reserved.</span>
    </template>
  </UFooter>
</template>
