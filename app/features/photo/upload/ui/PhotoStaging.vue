<script setup lang="ts">
import { usePhotoUpload } from '../model/usePhotoUpload'

const photos = ref<File[]>([])

const { uploadPhotos, isUploading, completed, total } = usePhotoUpload()

const uploadLabel = computed(() =>
  isUploading.value ? `Uploading ${completed.value} of ${total.value}` : 'Upload',
)
</script>

<template>
  <div class="space-y-4">
    <UFormField
      label="Photos"
      description="JPEG, PNG or WebP. 15MB max."
    >
      <UFileUpload
        v-model="photos"
        multiple
        accept="image/jpeg,image/png,image/webp"
        layout="grid"
        icon="i-lucide-image"
        label="Drop your photos here"
        description="Add photos in as many goes as you like, then upload them together."
        class="min-h-48"
        :interactive="false"
        :disabled="isUploading"
        :file-delete="!isUploading"
      >
        <template #actions="{ open }">
          <UButton
            label="Select photos"
            icon="i-lucide-upload"
            color="neutral"
            variant="outline"
            :disabled="isUploading"
            @click.stop="open()"
          />
        </template>

        <template #files-top="{ files, open, removeFile }">
          <div
            v-if="files?.length"
            class="mb-2 flex items-center justify-between"
            @click.stop
          >
            <p class="font-bold">
              Photos ({{ files.length }})
            </p>

            <div class="flex items-center gap-2">
              <UButton
                icon="i-lucide-plus"
                label="Add more"
                color="neutral"
                variant="outline"
                class="-my-2"
                :disabled="isUploading"
                @click="open()"
              />

              <UButton
                label="Clear all"
                color="neutral"
                variant="outline"
                class="-my-2"
                :disabled="isUploading"
                @click="removeFile()"
              />
            </div>
          </div>
        </template>
      </UFileUpload>
    </UFormField>

    <UButton
      type="button"
      icon="i-lucide-upload"
      :label="uploadLabel"
      :loading="isUploading"
      :disabled="photos.length === 0 || isUploading"
      @click="uploadPhotos(photos)"
    />
  </div>
</template>
