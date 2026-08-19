<script setup lang="ts">
import type { Account } from '~/entities/account'
import { SignOutButton } from '~/features/auth/sign-out'
import { AppLogo } from '~/shared/ui'

const user = useSanctumUser<Account>()
</script>

<template>
  <UHeader
    to="/owner"
    :toggle="false"
    :ui="{ root: 'bg-default backdrop-blur-none', right: 'gap-4' }"
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <UUser
        :name="user?.name"
        :description="user?.email"
        :avatar="{ alt: user?.name }"
        size="sm"
        class="hidden sm:flex"
      />

      <USeparator
        orientation="vertical"
        class="hidden h-8 sm:block"
      />

      <UButton
        v-if="user?.isAdmin"
        to="/admin"
        label="Admin"
        icon="i-lucide-shield"
        color="neutral"
        variant="ghost"
        size="sm"
      />

      <SignOutButton />
    </template>
  </UHeader>
</template>
