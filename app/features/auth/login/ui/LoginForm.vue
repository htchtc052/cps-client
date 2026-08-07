<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { FetchError } from 'ofetch'
import type { Account } from '~/entities/account'
import { useHydrated } from '~/shared/lib'
import { type LoginDto, loginSchema } from '../contract/loginSchema'

const { login } = useSanctumAuth<Account>()

const form = useTemplateRef('form')
const state = reactive({ email: '', password: '' })
const pending = ref(false)

// Until Vue owns the submit event the browser submits the form natively and puts
// the password in the URL.
const hydrated = useHydrated()

async function submit(event: FormSubmitEvent<LoginDto>) {
  pending.value = true

  try {
    await login(event.data)
  }
  catch (error) {
    const fieldErrors = rejectedFields(error)

    if (!fieldErrors) {
      throw error
    }

    form.value?.setErrors(fieldErrors)
  }
  finally {
    pending.value = false
  }
}

/** Laravel answers rejected credentials with `422` and per-field messages. */
function rejectedFields(error: unknown): FormError[] | null {
  if (!(error instanceof FetchError) || error.response?.status !== 422) {
    return null
  }

  const errors = error.data?.errors as Record<string, string[]> | undefined

  return errors
    ? Object.entries(errors).flatMap(([name, messages]) => messages.map(message => ({ name, message })))
    : null
}
</script>

<template>
  <UForm
    ref="form"
    :schema="loginSchema"
    :state="state"
    class="space-y-4"
    @submit="submit"
  >
    <UFormField label="Email" name="email">
      <UInput
        v-model="state.email"
        class="w-full"
        type="email"
        autocomplete="email"
        data-testid="email"
      />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput
        v-model="state.password"
        class="w-full"
        type="password"
        autocomplete="current-password"
        data-testid="password"
      />
    </UFormField>

    <UButton
      type="submit"
      block
      :loading="pending"
      :disabled="!hydrated"
      data-testid="submit"
    >
      Sign in
    </UButton>
  </UForm>
</template>
