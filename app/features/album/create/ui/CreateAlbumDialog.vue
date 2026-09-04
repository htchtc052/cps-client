<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import { albumCreateSchema, type AlbumCreateDto } from '../contract/album-create.contract'

const props = defineProps<{
  open: boolean
  isCreating: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  create: [AlbumCreateDto]
}>()

const form = ref<Form<typeof albumCreateSchema>>()

const state = reactive<AlbumCreateDto>({
  title: '',
})

watch(() => props.open, (open) => {
  if (open) state.title = ''
})

function onSubmit(event: FormSubmitEvent<AlbumCreateDto>) {
  emit('create', event.data)
}

defineExpose({ form })
</script>

<template>
  <UModal
    :open="open"
    title="New album"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="albumCreateSchema"
        :state="state"
        class="space-y-4"
        novalidate
        @submit="onSubmit"
      >
        <UFormField
          name="title"
          label="Title"
        >
          <UInput
            v-model="state.title"
            name="title"
            class="w-full"
            placeholder="Trip to Georgia"
            autofocus
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="isCreating"
        >
          Create album
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
