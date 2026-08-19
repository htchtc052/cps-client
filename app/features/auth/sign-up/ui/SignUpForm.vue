<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import { signUpSchema, type SignUpDto } from '../contract/sign-up.contract'
import { useSignUp } from '../model/useSignUp'

const state = reactive<SignUpDto>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  termsAccepted: false,
})

const form = ref<Form<typeof signUpSchema>>()
const { signUp, isLoading } = useSignUp()

async function onSubmit(e: FormSubmitEvent<SignUpDto>) {
  form.value?.clear()

  const errors = await signUp(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="signUpSchema"
    :state="state"
    class="space-y-4"
    method="post"
    autocomplete="on"
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
        autocomplete="name"
        placeholder="How we should call you"
        class="w-full"
      />
    </UFormField>

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

    <UFormField
      name="password"
      label="Password"
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

    <UFormField name="termsAccepted">
      <UCheckbox
        v-model="state.termsAccepted"
        name="termsAccepted"
      >
        <template #label>
          I accept the <NuxtLink
            to="/terms"
            class="underline"
          >Terms of Use</NuxtLink> and the <NuxtLink
            to="/privacy"
            class="underline"
          >Privacy Policy</NuxtLink>
        </template>
      </UCheckbox>
    </UFormField>

    <UButton
      type="submit"
      block
      :loading="isLoading"
    >
      Create account
    </UButton>
  </UForm>
</template>
