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
  >
    <template #title>
      <AppLogo />
    </template>

    <template #right>
      <span class="hidden truncate text-sm text-muted sm:block">{{ user?.email }}</span>

      <SignOutButton />
    </template>
  </UHeader>
</template>
