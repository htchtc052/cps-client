<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import type { AccountAlbum } from '~/entities/album'
import { albumRenameSchema, type AlbumRenameDto } from '../contract/album-rename.contract'

const props = defineProps<{
  open: boolean
  album: AccountAlbum | null
  isRenaming: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  rename: [AlbumRenameDto]
}>()

const form = ref<Form<typeof albumRenameSchema>>()

const state = reactive<AlbumRenameDto>({
  title: '',
})

watch(() => props.album, (album) => {
  state.title = album?.title ?? ''
}, { immediate: true })

function onSubmit(event: FormSubmitEvent<AlbumRenameDto>) {
  emit('rename', event.data)
}

defineExpose({ form })
</script>

<template>
  <UModal
    :open="open"
    title="Rename album"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="albumRenameSchema"
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
            autofocus
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="isRenaming"
        >
          Save
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
