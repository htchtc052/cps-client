<script setup lang="ts">
const user = 'pttppt79'
const domain = 'gmail.com'
const isRevealed = ref(false)
</script>

<template>
  <UButton
    v-if="!isRevealed"
    label="Show contact address"
    icon="i-lucide-mail"
    color="neutral"
    variant="subtle"
    size="sm"
    @click="isRevealed = true"
  />

  <a
    v-else
    :href="`mailto:${user}@${domain}`"
    class="underline"
  >{{ user }}@{{ domain }}</a>
</template>
