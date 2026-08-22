<script setup lang="ts">
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
          to="/login"
          label="Sign in"
          color="neutral"
          variant="ghost"
          size="sm"
        />

        <UButton
          to="/register"
          label="Create account"
          color="primary"
          size="sm"
        />
      </template>
    </UHeader>

    <main class="flex-1">
      <UPageHero
        description="Upload your photos, browse fast previews, and share a single photo or a curated album with a private link."
        orientation="horizontal"
        :links="[
          { label: 'Create your library', to: '/register', color: 'primary', size: 'xl' },
          { label: 'Sign in', to: '/login', color: 'neutral', variant: 'link', size: 'xl' },
        ]"
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
            <div
              v-for="n in 6"
              :key="n"
              class="aspect-square rounded-lg bg-elevated"
            />
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
          :links="[{ label: 'Create your library', to: '/register', color: 'primary', size: 'xl' }]"
        />
      </UPageSection>
    </main>

    <AppFooter />
  </div>
</template>
