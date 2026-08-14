<script setup lang="ts">
import { ProfileSharingButton } from '~/features/account/profile-sharing'
import { AccountPhotosWidget } from '~/widgets/account-photos'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Photos' })
</script>

<template>
  <div>
    <UPageHeader title="Photos">
      <template #links>
        <ProfileSharingButton />

        <UButton
          to="/trash"
          color="neutral"
          variant="subtle"
          icon="i-lucide-trash-2"
        >
          Trash
        </UButton>

        <UButton
          to="/upload"
          icon="i-lucide-upload"
        >
          Upload
        </UButton>
      </template>
    </UPageHeader>

    <AccountPhotosWidget />
  </div>
</template>
