<script setup lang="ts">
import { AccountAlbumsWidget } from '~/widgets/account-albums'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Albums' })
</script>

<template>
  <AccountAlbumsWidget />
</template>
