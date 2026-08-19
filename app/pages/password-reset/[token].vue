<script setup lang="ts">
import { ResetPasswordForm } from '~/features/auth/password-reset'

definePageMeta({ layout: 'guest', middleware: ['sanctum:guest'] })
useHead({ title: 'Set new password' })

const route = useRoute()
const token = String(route.params.token)
const email = String(route.query.email ?? '')
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">
      Set new password
    </h1>

    <ResetPasswordForm
      :token="token"
      :email="email"
    />
  </div>
</template>
