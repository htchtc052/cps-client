<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import { forgotPasswordSchema, type ForgotPasswordDto } from '../contract/password-reset.contract'
import { usePasswordReset } from '../model/usePasswordReset'

const state = reactive<ForgotPasswordDto>({ email: '' })

const form = ref<Form<typeof forgotPasswordSchema>>()
const { requestLink, isLinkSent, isRequesting } = usePasswordReset()

async function onSubmit(e: FormSubmitEvent<ForgotPasswordDto>) {
  form.value?.clear()

  const errors = await requestLink(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <div
    v-if="isLinkSent"
    class="space-y-3 text-sm text-muted"
  >
    <p class="text-highlighted">
      Check your inbox — a reset link is on its way.
    </p>
    <p>
      The link expires in 60 minutes. If it does not arrive, please look in
      your spam folder, or
      <NuxtLink
        to="/contact"
        class="underline"
      >write to the project owner</NuxtLink> — we will reset the password by
      hand.
    </p>
  </div>

  <UForm
    v-else
    ref="form"
    :schema="forgotPasswordSchema"
    :state="state"
    class="space-y-4"
    method="post"
    novalidate
    @submit="onSubmit"
  >
    <p class="text-sm text-muted">
      Enter the address you signed up with and we will send a link to choose a
      new password.
    </p>

    <UFormField
      name="email"
      label="Email"
    >
      <UInput
        v-model="state.email"
        type="email"
        name="email"
        autocomplete="username"
        inputmode="email"
        autocapitalize="none"
        spellcheck="false"
        placeholder="you@example.com"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      block
      :loading="isRequesting"
    >
      Send reset link
    </UButton>
  </UForm>
</template>
