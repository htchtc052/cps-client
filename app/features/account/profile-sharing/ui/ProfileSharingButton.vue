<script setup lang="ts">
import { useProfileSharing } from '../model/useProfileSharing'

const { isOpen, shareUrl, open, copyLink, disable, isEnabling, isDisabling } = useProfileSharing()
</script>

<template>
  <UButton
    label="Share profile"
    icon="i-lucide-share-2"
    color="neutral"
    variant="subtle"
    :loading="isEnabling"
    :disabled="isEnabling"
    @click="open"
  />

  <UModal
    v-model:open="isOpen"
    title="Share profile"
    description="Only photos marked On profile are visible through this link."
  >
    <template #body>
      <UFormField label="Public link">
        <UInput
          :model-value="shareUrl ?? ''"
          readonly
          class="w-full"
        />
      </UFormField>
    </template>

    <template #footer>
      <UButton
        label="Copy link"
        icon="i-lucide-copy"
        @click="copyLink"
      />

      <UButton
        label="Disable sharing"
        color="error"
        variant="subtle"
        :loading="isDisabling"
        :disabled="isDisabling"
        @click="disable"
      />
    </template>
  </UModal>
</template>
