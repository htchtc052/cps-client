<template>
  <UFileUpload
    multiple
    accept="image/*"
    layout="grid"
    position="outside"
    icon="i-lucide-image-up"
    label="Drop photos here"
    description="Add photos in as many goes as you like, then upload them together."
    :ui="{ files: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 max-h-96 overflow-y-auto p-1.5' }"
  >
    <template #actions="{ open }">
      <UButton
        label="Select photos"
        icon="i-lucide-plus"
        color="neutral"
        variant="outline"
        @click.stop="open()"
      />
    </template>

    <!-- TODO: send the staged photos to the intake route, then lock the tray and redirect. -->
    <template #files-bottom="{ files, open, removeFile }">
      <div
        v-if="files?.length"
        class="mt-4 flex items-center justify-between gap-4"
        @click.stop
      >
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted">{{ files.length }} staged</span>

          <UButton
            label="Add more"
            color="neutral"
            variant="outline"
            @click="open()"
          />

          <UButton
            label="Clear all"
            color="neutral"
            variant="outline"
            @click="removeFile()"
          />
        </div>

        <UButton
          label="Upload"
          icon="i-lucide-upload"
        />
      </div>
    </template>
  </UFileUpload>
</template>
