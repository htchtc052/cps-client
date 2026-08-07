<script setup lang="ts">
import { useSignOut } from '../model/useSignOut'

const { signOut, isLoading } = useSignOut()
</script>

<template>
  <UButton
    color="neutral"
    variant="subtle"
    icon="i-lucide-log-out"
    :loading="isLoading"
    @click="signOut"
  >
    Sign out
  </UButton>
</template>
