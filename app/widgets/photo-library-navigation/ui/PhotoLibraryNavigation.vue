<script setup lang="ts">
const items = [
  { label: 'Photos', to: '/owner' },
  { label: 'Albums', to: '/albums' },
  { label: 'Trash', to: '/trash' },
]
</script>

<template>
  <UNavigationMenu
    :items="items"
    variant="link"
    highlight
    class="border-b border-default"
  />
</template>
