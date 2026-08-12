<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { photoStagingSchema, type PhotoStagingDto } from '../contract/photo-staging.contract'
import { usePhotoUpload, type PhotoUploadFailureView } from '../model/usePhotoUpload'

const state = reactive<PhotoStagingDto>({
  photos: [],
})

const failures = ref<PhotoUploadFailureView[]>([])

const { uploadPhotos, phase, isBusy, completed, total } = usePhotoUpload()

const uploadLabel = computed(() => {
  if (phase.value === 'uploading') return `Uploading ${completed.value} of ${total.value}`
  if (phase.value === 'finishing') return 'Finishing…'

  return 'Upload'
})

function onStagingChange(photos: File[] | null | undefined) {
  if (isBusy.value) return

  failures.value = []
  state.photos = photos ?? []
}

async function onSubmit(e: FormSubmitEvent<PhotoStagingDto>) {
  const result = await uploadPhotos(e.data.photos)

  if (result.failures.length === 0) return

  failures.value = result.failures
  state.photos = result.failures.map(failure => failure.file)
}
</script>

<template>
  <UForm
    v-slot="{ errors }"
    :schema="photoStagingSchema"
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
        accept=".jpg,.jpeg,.png,.webp"
        layout="grid"
        icon="i-lucide-image"
        label="Drop your photos here"
        description="Add photos in as many goes as you like, then upload them together."
        class="min-h-48"
        :interactive="false"
        :disabled="isBusy"
        :file-delete="!isBusy"
        @update:model-value="onStagingChange"
      >
        <template #actions="{ open }">
          <UButton
            label="Select photos"
            icon="i-lucide-upload"
            color="neutral"
            variant="outline"
            :disabled="isBusy"
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
                :disabled="isBusy"
                @click="open()"
              />

              <UButton
                label="Clear all"
                color="neutral"
                variant="outline"
                class="-my-2"
                :disabled="isBusy"
                @click="removeFile()"
              />
            </div>
          </div>
        </template>
      </UFileUpload>
    </UFormField>

    <UAlert
      v-if="failures.length"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
    >
      <template #description>
        <ul>
          <li
            v-for="(failure, index) in failures"
            :key="index"
          >
            {{ failure.file.name }} — {{ failure.message }}
          </li>
        </ul>
      </template>
    </UAlert>

    <UButton
      type="submit"
      icon="i-lucide-upload"
      :label="uploadLabel"
      :loading="isBusy"
      :disabled="
        !state.photos.length
          || errors.length > 0
          || isBusy
      "
    />
  </UForm>
</template>
