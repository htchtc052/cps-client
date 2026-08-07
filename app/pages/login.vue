<script setup lang="ts">
import { LoginForm } from '~/features/auth/login'

definePageMeta({ layout: 'guest', middleware: ['sanctum:guest'] })
useHead({ title: 'Sign in' })
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">
      Sign in
    </h1>

    <LoginForm />
  </div>
</template>
