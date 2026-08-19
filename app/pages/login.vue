<script setup lang="ts">
import { SignInForm } from '~/features/auth/sign-in'

definePageMeta({ layout: 'guest', middleware: ['sanctum:guest'] })
useHead({ title: 'Sign in' })
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">
      Sign in
    </h1>

    <SignInForm />

    <div class="space-y-1 text-sm text-muted">
      <p>
        <NuxtLink
          to="/forgot-password"
          class="underline"
        >Forgot your password?</NuxtLink>
      </p>
      <p>
        No account yet?
        <NuxtLink
          to="/register"
          class="underline"
        >Create one</NuxtLink>
      </p>
    </div>
  </div>
</template>
