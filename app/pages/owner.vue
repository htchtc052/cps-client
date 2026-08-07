<script setup lang="ts">
definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Photos' })

// TODO: replace the placeholder tiles with the photo entity once uploads exist.
const placeholderTiles = 8
</script>

<template>
  <div>
    <UPageHeader title="Photos">
      <template #links>
        <UButton
          icon="i-lucide-upload"
          disabled
        >
          Upload
        </UButton>
      </template>
    </UPageHeader>

    <UPageGrid class="mt-8 grid-cols-2 gap-4 xl:grid-cols-4">
      <div
        v-for="tile in placeholderTiles"
        :key="tile"
        class="flex aspect-[4/3] items-center justify-center rounded-lg bg-elevated ring ring-default"
      >
        <UIcon
          name="i-lucide-image"
          class="size-8 text-dimmed"
        />
      </div>
    </UPageGrid>
  </div>
</template>
