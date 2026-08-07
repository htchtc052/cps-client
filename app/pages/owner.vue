<script setup lang="ts">
import { useAccount } from '~/entities/account'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Owner space' })

const account = useAccount()
</script>

<template>
  <section class="space-y-2">
    <h1 class="text-xl font-semibold">
      Owner space
    </h1>

    <p class="text-muted" data-testid="account-name">
      {{ account?.name }}
    </p>
  </section>
</template>
