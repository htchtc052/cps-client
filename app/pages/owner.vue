<script setup lang="ts">
definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Photos' })

// TODO: replace the placeholder tiles and toolbar controls with the photo entity once uploads exist.
const placeholderTiles = 8
const visibilityFilters = ['All photos', 'Public', 'Private']
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

    <div class="z-10 flex flex-wrap items-center justify-between gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          icon="i-lucide-search"
          placeholder="Search photos"
          disabled
          class="w-64"
        />

        <USelect
          :items="visibilityFilters"
          :model-value="visibilityFilters[0]"
          disabled
          class="w-40"
        />
      </div>

      <span class="text-sm text-muted">{{ placeholderTiles }} photos</span>
    </div>

    <UPageGrid class="grid-cols-2 gap-4 xl:grid-cols-4">
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
