<script setup lang="ts">
import { useHydrated } from '~/shared/lib'

const { logout } = useSanctumAuth()

const hydrated = useHydrated()
const pending = ref(false)

async function signOut() {
  pending.value = true

  try {
    await logout()
  }
  finally {
    pending.value = false
  }
}
</script>

<template>
  <UButton
    color="neutral"
    variant="subtle"
    :loading="pending"
    :disabled="!hydrated"
    data-testid="logout"
    @click="signOut"
  >
    Sign out
  </UButton>
</template>
