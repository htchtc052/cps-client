<script setup lang="ts">
import type { Form, FormSubmitEvent } from '@nuxt/ui'
import { signInSchema, type SignInDto } from '../contract/sign-in.contract'
import { useSignIn } from '../model/useSignIn'

const state = reactive<SignInDto>({
  email: '',
  password: '',
})

const form = ref<Form<typeof signInSchema>>()
const { signIn, isLoading } = useSignIn()

async function onSubmit(e: FormSubmitEvent<SignInDto>) {
  form.value?.clear()

  const errors = await signIn(e.data)
  if (errors) {
    form.value?.setErrors(errors)
  }
}
</script>

<template>
  <UForm
    ref="form"
    :schema="signInSchema"
    :state="state"
    class="space-y-4"
    method="post"
    autocomplete="on"
    novalidate
    @submit="onSubmit"
  >
    <UFormField name="email" label="Email">
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
        data-testid="email"
      />
    </UFormField>

    <UFormField name="password" label="Password">
      <UInput
        v-model="state.password"
        type="password"
        name="password"
        autocomplete="current-password"
        placeholder="Enter password"
        class="w-full"
        data-testid="password"
      />
    </UFormField>

    <UButton
      type="submit"
      block
      :loading="isLoading"
      data-testid="submit"
    >
      Sign in
    </UButton>
  </UForm>
</template>
