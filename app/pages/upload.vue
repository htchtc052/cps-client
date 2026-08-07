<script setup lang="ts">
import { PhotoStaging } from '~/features/photo/upload'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Upload' })
</script>

<template>
  <div>
    <UPageHeader title="Upload">
      <template #links>
        <UButton
          to="/owner"
          color="neutral"
          variant="subtle"
          icon="i-lucide-arrow-left"
        >
          Back to photos
        </UButton>
      </template>
    </UPageHeader>

    <div class="mt-8">
      <PhotoStaging />
    </div>
  </div>
</template>
