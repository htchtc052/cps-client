<template>
  <div class="space-y-4">
    <UFileUpload
      multiple
      accept="image/*"
      layout="grid"
      icon="i-lucide-image-up"
      label="Drop photos here"
      description="Add photos in as many goes as you like, then upload them together."
      :ui="{ files: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 max-h-96 overflow-y-auto p-1.5' }"
    />

    <!-- TODO: bind a model, lock the tray while uploading and redirect to the grid. -->
    <div class="flex items-center justify-end gap-3">
      <UButton
        color="neutral"
        variant="ghost"
      >
        Clear all
      </UButton>

      <UButton
        icon="i-lucide-upload"
        size="lg"
      >
        Upload
      </UButton>
    </div>
  </div>
</template>
