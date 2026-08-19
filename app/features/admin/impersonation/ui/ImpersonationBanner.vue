<script setup lang="ts">
import type { Account } from '~/entities/account'
import { useImpersonation } from '../model/useImpersonation'

const user = useSanctumUser<Account>()
const { stop, isStopping } = useImpersonation()
</script>

<template>
  <div
    v-if="user?.isImpersonated"
    class="flex flex-wrap items-center justify-center gap-3 bg-warning px-4 py-2 text-sm text-inverted"
  >
    <span>You are signed in as {{ user.email }}.</span>

    <UButton
      label="Back to admin"
      color="neutral"
      variant="solid"
      size="xs"
      :loading="isStopping"
      @click="stop"
    />
  </div>
</template>
