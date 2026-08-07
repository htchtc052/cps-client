<script setup lang="ts">
import type { Account } from '~/entities/account'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Owner space' })

const user = useSanctumUser<Account>()
</script>

<template>
  <section class="space-y-2">
    <h1 class="text-xl font-semibold">
      Owner space
    </h1>

    <p class="text-muted" data-testid="account-name">
      {{ user?.name }}
    </p>
  </section>
</template>
