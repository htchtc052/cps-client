<script setup lang="ts">
import { ProfileSharingButton } from '~/features/account/profile-sharing'
import { AccountPhotosWidget } from '~/widgets/account-photos'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Photos' })
</script>

<template>
  <div>
    <UPageHeader
      title="Photos"
      :ui="{
        wrapper: 'lg:flex-col lg:items-start lg:justify-start',
        links: 'w-full justify-between',
      }"
    >
      <template #links>
        <ProfileSharingButton />

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
