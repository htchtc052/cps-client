<script setup lang="ts">
const items = [
  { label: 'Photos', to: '/owner' },
  { label: 'Trash', to: '/trash' },
]
</script>

<template>
  <UNavigationMenu
    :items="items"
    variant="link"
  />
</template>
