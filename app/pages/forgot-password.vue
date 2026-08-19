<script setup lang="ts">
import { ForgotPasswordForm } from '~/features/auth/password-reset'

definePageMeta({ layout: 'guest', middleware: ['sanctum:guest'] })
useHead({ title: 'Forgot password' })
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">
      Forgot password
    </h1>

    <ForgotPasswordForm />

    <p class="text-sm text-muted">
      <NuxtLink
        to="/login"
        class="underline"
      >Back to sign in</NuxtLink>
    </p>
  </div>
</template>
