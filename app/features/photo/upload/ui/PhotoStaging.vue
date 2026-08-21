<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { MAX_STAGED_PHOTOS, photoStagingSchema, type PhotoStagingDto } from '../contract/photo-staging.contract'
import { usePhotoUpload, type PhotoUploadFailureView } from '../model/usePhotoUpload'
import { useStagedPreviews } from '../model/useStagedPreviews'

const toast = useToast()

const state = reactive<PhotoStagingDto>({
  photos: [],
})

const failures = ref<PhotoUploadFailureView[]>([])

const { previewUrl } = useStagedPreviews(toRef(state, 'photos'))

const { uploadPhotos, stagedStates, phase, isBusy, completed, total, previewPending, previewTotal } = usePhotoUpload()

const uploadLabel = computed(() => {
  if (phase.value === 'uploading') return `Uploading ${completed.value} of ${total.value}`
  if (phase.value === 'finishing') return `Processing ${previewTotal.value - previewPending.value} of ${previewTotal.value} previews`

  return 'Upload'
})

function onStagingChange(photos: File[] | null | undefined) {
  if (isBusy.value) return

  failures.value = []

  const nextPhotos = photos ?? []

  if (nextPhotos.length > MAX_STAGED_PHOTOS) {
    state.photos = nextPhotos.slice(0, MAX_STAGED_PHOTOS)

    toast.add({
      title: `You can upload up to ${MAX_STAGED_PHOTOS} photos at a time. The remaining files weren’t added.`,
      color: 'warning',
    })

    return
  }

  state.photos = nextPhotos
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
      :description="`JPEG, PNG or WebP. 15MB max. Up to ${MAX_STAGED_PHOTOS} photos per upload.`"
    >
      <UFileUpload
        :model-value="state.photos"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        icon="i-lucide-image"
        label="Drop your photos here"
        description="Add photos in as many goes as you like, then upload them together."
        class="min-h-48"
        :interactive="false"
        :disabled="isBusy"
        :file-delete="!isBusy"
        :ui="{ files: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full' }"
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

        <template #files="{ removeFile }">
          <div
            v-for="(photo, index) in state.photos"
            :key="`${photo.name}-${photo.lastModified}-${photo.size}`"
            class="relative aspect-square overflow-hidden rounded-md ring ring-default"
          >
            <img
              :src="previewUrl(photo)"
              :alt="photo.name"
              class="h-full w-full object-cover"
            >

            <UButton
              v-if="!isBusy"
              icon="i-lucide-x"
              color="neutral"
              variant="solid"
              size="xs"
              class="absolute top-1 right-1"
              :aria-label="`Remove ${photo.name}`"
              @click="removeFile(index)"
            />

            <UBadge
              v-if="stagedStates.get(photo) === 'ready'"
              label="Ready"
              color="success"
              variant="solid"
              size="sm"
              class="absolute bottom-1 left-1"
            />

            <UBadge
              v-else-if="stagedStates.get(photo) === 'failed'"
              label="Failed"
              color="error"
              variant="solid"
              size="sm"
              class="absolute bottom-1 left-1"
            />

            <UBadge
              v-else-if="stagedStates.get(photo) === 'processing'"
              label="Processing"
              color="neutral"
              variant="solid"
              size="sm"
              class="absolute bottom-1 left-1"
            />
          </div>
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
