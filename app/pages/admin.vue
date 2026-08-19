<script setup lang="ts">
import type { Account } from '~/entities/account'
import { AdminAccountList, useAccountBlocking, useAdminAccounts } from '~/features/admin/accounts'
import { useImpersonation } from '~/features/admin/impersonation'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Admin' })

const user = useSanctumUser<Account>()

if (!user.value?.isAdmin) throw createError({ statusCode: 404, fatal: true })

const { data: accounts } = await useAdminAccounts()
const { toggleBlocking, isBlocking } = useAccountBlocking(accounts)
const { start, isStarting } = useImpersonation()
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-3">
    <h1 class="text-lg font-semibold">
      Accounts
    </h1>

    <AdminAccountList
      :accounts="accounts"
      :is-blocking="isBlocking"
      :is-impersonating="isStarting"
      @impersonate="start"
      @toggle-blocking="toggleBlocking"
    />
  </div>
</template>
