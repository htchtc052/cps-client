<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import type { AccountPhoto } from '~/entities/photo'
import { photoDetailsSchema, type PhotoDetailsDto } from '../contract/photo-details.contract'

const props = defineProps<{
  open: boolean
  photo: AccountPhoto | null
  isSaving: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  save: [PhotoDetailsDto]
}>()

const form = ref<Form<typeof photoDetailsSchema>>()

const state = reactive<PhotoDetailsDto>({
  name: '',
  description: '',
})

watch(() => props.photo, (photo) => {
  state.name = photo?.name ?? ''
  state.description = photo?.description ?? ''
}, { immediate: true })

function onSubmit(event: FormSubmitEvent<PhotoDetailsDto>) {
  form.value?.clear()

  emit('save', event.data)
}

defineExpose({ form })
</script>

<template>
  <UModal
    :open="open"
    title="Photo details"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="photoDetailsSchema"
        :state="state"
        class="space-y-4"
        novalidate
        @submit="onSubmit"
      >
        <UFormField
          name="name"
          label="Name"
        >
          <UInput
            v-model="state.name"
            name="name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="description"
          label="Description"
          hint="Shown on the public page and used as alt text"
        >
          <UTextarea
            v-model="state.description"
            name="description"
            :rows="3"
            class="w-full"
            placeholder="What is in the frame, and why it is worth a look"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="isSaving"
        >
          Save
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
