<script setup lang="ts">
import { SignInForm } from '~/features/auth/sign-in'
import { SignUpForm, useRegistrationStatus } from '~/features/auth/sign-up'
import { AppLogo } from '~/shared/ui'
import { AppFooter } from '~/widgets/app-footer'

definePageMeta({ layout: false, middleware: ['sanctum:guest'] })
useHead({ title: 'CuratedPhoto' })

const features = [
  {
    icon: 'i-lucide-lock',
    title: 'Private originals',
    description: 'Keep full-resolution photos in your personal library.',
  },
  {
    icon: 'i-lucide-image',
    title: 'Fast photo browsing',
    description: 'Browse lightweight previews and detailed viewer images.',
  },
  {
    icon: 'i-lucide-link',
    title: 'Simple private sharing',
    description: 'Create revocable links for one photo or a selected album.',
  },
]

const albumPreviewImages = [
  '/landing/mountains.svg',
  '/landing/dusk.svg',
  '/landing/pines.svg',
  '/landing/dunes.svg',
  '/landing/harbour.svg',
  '/landing/lake.svg',
]

const authModal = ref<'sign-in' | 'sign-up' | null>(null)

const {
  data: registrationStatus,
  status: registrationStatusState,
  execute: loadRegistrationStatus,
} = useRegistrationStatus({ immediate: false })

function openSignIn(): void {
  authModal.value = 'sign-in'
}

function openSignUp(): void {
  authModal.value = 'sign-up'

  if (registrationStatusState.value === 'idle') loadRegistrationStatus()
}

function closeAuthModal(): void {
  authModal.value = null
}

const heroLinks = [
  { label: 'Create your library', color: 'primary' as const, size: 'xl' as const, onClick: openSignUp },
  { label: 'Sign in', color: 'neutral' as const, variant: 'outline' as const, size: 'xl' as const, onClick: openSignIn },
]

const ctaLinks = [
  { label: 'Create your library', color: 'primary' as const, size: 'xl' as const, onClick: openSignUp },
]
</script>

<template>
  <div class="flex min-h-screen flex-col bg-default">
    <UHeader
      title="CuratedPhoto"
      :toggle="false"
      :ui="{ root: 'bg-default backdrop-blur-none' }"
    >
      <template #title>
        <AppLogo />
      </template>

      <template #right>
        <UButton
          label="Sign in"
          color="neutral"
          variant="outline"
          size="sm"
          class="hidden sm:inline-flex"
          @click="openSignIn"
        />

        <UButton
          label="Create account"
          color="primary"
          size="sm"
          @click="openSignUp"
        />
      </template>
    </UHeader>

    <main class="flex-1">
      <UPageHero
        description="Upload your photos, browse fast previews, and share a single photo or a curated album with a private link."
        orientation="horizontal"
        :links="heroLinks"
      >
        <template #title>
          Keep the originals.<br>
          Share only what you choose.
        </template>

        <div
          aria-hidden="true"
          class="rounded-xl bg-elevated/50 p-6 ring ring-default"
        >
          <div class="grid grid-cols-3 gap-3">
            <img
              v-for="image in albumPreviewImages"
              :key="image"
              :src="image"
              alt=""
              class="aspect-square rounded-lg object-cover"
            >
          </div>

          <div class="mt-4 flex items-center gap-2 text-sm text-muted">
            <UIcon
              name="i-lucide-link"
              class="size-4 text-primary"
            />
            Shared album link
          </div>
        </div>
      </UPageHero>

      <UPageSection>
        <UPageGrid>
          <UPageFeature
            v-for="feature in features"
            :key="feature.title"
            :icon="feature.icon"
            :title="feature.title"
            :description="feature.description"
          />
        </UPageGrid>
      </UPageSection>

      <UPageSection>
        <UPageCTA
          title="Your photos stay private until you decide to share them."
          :links="ctaLinks"
        />
      </UPageSection>
    </main>

    <AppFooter />

    <UModal
      :open="authModal === 'sign-in'"
      title="Sign in"
      @update:open="(value) => { if (!value) closeAuthModal() }"
    >
      <template #body>
        <SignInForm />
      </template>

      <template #footer>
        <div class="flex w-full flex-col gap-2 text-sm text-muted">
          <p>
            No account yet?
            <button
              type="button"
              class="text-primary underline"
              @click="openSignUp"
            >
              Create one
            </button>
          </p>

          <NuxtLink
            to="/login"
            class="underline"
          >
            Open the sign-in page
          </NuxtLink>
        </div>
      </template>
    </UModal>

    <UModal
      :open="authModal === 'sign-up'"
      title="Create account"
      @update:open="(value) => { if (!value) closeAuthModal() }"
    >
      <template #body>
        <UAlert
          v-if="!registrationStatus.registrationEnabled"
          icon="i-lucide-lock"
          title="Registration is closed"
          description="New accounts are not accepted at the moment."
        />

        <SignUpForm v-else />
      </template>

      <template #footer>
        <div class="flex w-full flex-col gap-2 text-sm text-muted">
          <p>
            Already have an account?
            <button
              type="button"
              class="text-primary underline"
              @click="openSignIn"
            >
              Sign in
            </button>
          </p>

          <NuxtLink
            to="/register"
            class="underline"
          >
            Open the registration page
          </NuxtLink>
        </div>
      </template>
    </UModal>
  </div>
</template>
