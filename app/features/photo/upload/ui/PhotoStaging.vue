<template>
  <UFileUpload
    multiple
    accept="image/*"
    layout="grid"
    position="outside"
    icon="i-lucide-image-up"
    label="Drop photos here"
    description="Add photos in as many goes as you like, then upload them together."
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
    <template #files-bottom="{ files, removeFile }">
      <div
        v-if="files?.length"
        class="flex items-center gap-3"
        @click.stop
      >
        <UButton
          label="Upload"
          icon="i-lucide-upload"
        />

        <UButton
          label="Clear all"
          color="neutral"
          variant="outline"
          @click="removeFile()"
        />

        <span class="text-sm text-muted">{{ files.length }} staged</span>
      </div>
    </template>
  </UFileUpload>
</template>
