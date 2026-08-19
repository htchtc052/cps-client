<script setup lang="ts">
import { SignUpForm, useRegistrationStatus } from '~/features/auth/sign-up'

definePageMeta({ layout: 'guest', middleware: ['sanctum:guest'] })
useHead({ title: 'Create account' })

const { data } = await useRegistrationStatus()
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">
      Create account
    </h1>

    <UAlert
      v-if="!data.registrationEnabled"
      icon="i-lucide-lock"
      title="Registration is closed"
      description="New accounts are not accepted at the moment."
    />

    <SignUpForm v-else />

    <p class="text-sm text-muted">
      Already have an account?
      <NuxtLink
        to="/login"
        class="underline"
      >Sign in</NuxtLink>
    </p>
  </div>
</template>
