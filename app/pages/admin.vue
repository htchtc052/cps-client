<script setup lang="ts">
import type { Account } from '~/entities/account'
import type { AdminUser } from '~/entities/admin'
import { AdminAccountList, useAccountBlocking, useAdminAccounts } from '~/features/admin/accounts'
import { AdminPhotoList, useAdminPhotos, usePhotoBlocking } from '~/features/admin/photos'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Admin' })

const user = useSanctumUser<Account>()

if (!user.value?.isAdmin) throw createError({ statusCode: 404, fatal: true })

const { data: accounts } = await useAdminAccounts()
const { toggleBlocking: toggleAccountBlocking, isBlocking: isBlockingAccount } = useAccountBlocking(accounts)
const { photos, loadFor, isLoading: isLoadingPhotos } = useAdminPhotos()
const { toggleBlocking: togglePhotoBlocking, isBlocking: isBlockingPhoto } = usePhotoBlocking(photos)

const selected = ref<AdminUser | null>(null)

async function select(account: AdminUser): Promise<void> {
  selected.value = account

  await loadFor(account.id)
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <section class="space-y-3">
      <h1 class="text-lg font-semibold">
        Accounts
      </h1>

      <AdminAccountList
        :accounts="accounts"
        :selected-id="selected?.id ?? null"
        :is-blocking="isBlockingAccount"
        @select="select"
        @toggle-blocking="toggleAccountBlocking"
      />
    </section>

    <section
      v-if="selected"
      class="space-y-3"
    >
      <h2 class="text-lg font-semibold">
        {{ selected.email }}
      </h2>

      <p
        v-if="isLoadingPhotos"
        class="text-sm text-muted"
      >
        Loading photos…
      </p>

      <p
        v-else-if="photos.length === 0"
        class="text-sm text-muted"
      >
        No photos.
      </p>

      <AdminPhotoList
        v-else
        :photos="photos"
        :is-blocking="isBlockingPhoto"
        @toggle-blocking="togglePhotoBlocking"
      />
    </section>
  </div>
</template>
