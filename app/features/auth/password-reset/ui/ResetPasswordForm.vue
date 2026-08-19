<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import { resetPasswordSchema, type ResetPasswordDto } from '../contract/password-reset.contract'
import { usePasswordReset } from '../model/usePasswordReset'

const props = defineProps<{
  token: string
  email: string
}>()

const state = reactive<ResetPasswordDto>({
  password: '',
  password_confirmation: '',
})

const form = ref<Form<typeof resetPasswordSchema>>()
const { resetPassword, isResetting } = usePasswordReset()

async function onSubmit(e: FormSubmitEvent<ResetPasswordDto>) {
  form.value?.clear()

  const errors = await resetPassword(e.data, props.token, props.email)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="resetPasswordSchema"
    :state="state"
    class="space-y-4"
    method="post"
    novalidate
    @submit="onSubmit"
  >
    <UFormField
      name="password"
      label="New password"
    >
      <UInput
        v-model="state.password"
        type="password"
        name="password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
        class="w-full"
      />
    </UFormField>

    <UFormField
      name="password_confirmation"
      label="Confirm password"
    >
      <UInput
        v-model="state.password_confirmation"
        type="password"
        name="password_confirmation"
        autocomplete="new-password"
        placeholder="Repeat the password"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      block
      :loading="isResetting"
    >
      Set new password
    </UButton>
  </UForm>
</template>
