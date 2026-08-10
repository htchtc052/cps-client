<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as yup from 'yup'
import { usePhotoUpload } from '../model/usePhotoUpload'

const MAX_FILE_SIZE = 15_360_000
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const stagingSchema = yup.object({
  photos: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .required()
        .test('type', 'Photos must be JPEG, PNG or WebP.', file => ACCEPTED_TYPES.includes(file.type))
        .test('size', 'Each photo must be 15 MB or smaller.', file => file.size <= MAX_FILE_SIZE),
    )
    .min(1, 'Select at least one photo.')
    .required(),
})

type PhotoStagingDto = yup.InferType<typeof stagingSchema>

const state = reactive<PhotoStagingDto>({
  photos: [],
})

const { uploadPhotos, isUploading, completed, total } = usePhotoUpload()

const uploadLabel = computed(() => {
  if (!isUploading.value) return 'Upload'

  return `Uploading ${Math.min(completed.value + 1, total.value)} of ${total.value}`
})

function onStagingChange(photos: File[] | null | undefined) {
  if (isUploading.value) return

  state.photos = photos ?? []
}

async function onSubmit(e: FormSubmitEvent<PhotoStagingDto>) {
  await uploadPhotos(e.data.photos)
}
</script>

<template>
  <UForm
    :schema="stagingSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      name="photos"
      label="Photos"
      description="JPEG, PNG or WebP. 15MB max."
    >
      <UFileUpload
        :model-value="state.photos"
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
        @update:model-value="onStagingChange"
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
      type="submit"
      icon="i-lucide-upload"
      :label="uploadLabel"
      :loading="isUploading"
      :disabled="state.photos.length === 0"
    />
  </UForm>
</template>
