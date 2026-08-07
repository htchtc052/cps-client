<template>
  <UFileUpload
    multiple
    accept="image/*"
    layout="grid"
    icon="i-lucide-image-up"
    label="Drop photos here"
    description="Pick one batch, drop the ones you change your mind about, then upload."
    class="min-h-48"
    :ui="{ files: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 max-h-96 overflow-y-auto p-1.5' }"
  >
    <!-- TODO: bind a model and send the staged photos to the intake route. -->
    <template #files-bottom="{ files }">
      <div class="mt-4 flex items-center justify-between gap-3">
        <span class="text-sm text-muted">{{ files?.length }} staged</span>

        <UFieldGroup>
          <UButton
            color="neutral"
            variant="subtle"
          >
            Clear all
          </UButton>

          <UButton icon="i-lucide-upload">
            Upload
          </UButton>
        </UFieldGroup>
      </div>
    </template>
  </UFileUpload>
</template>
