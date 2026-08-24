<script setup lang="ts">
import { SignUpForm } from '~/features/auth/sign-up'

definePageMeta({ layout: 'guest', middleware: ['sanctum:guest'] })
useHead({ title: 'Create account' })

</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">
      Create account
    </h1>

    <SignUpForm />

    <p class="text-sm text-muted">
      Already have an account?
      <NuxtLink
        to="/login"
        class="underline"
      >Sign in</NuxtLink>
    </p>
  </div>
</template>
