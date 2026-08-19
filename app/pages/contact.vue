<script setup lang="ts">
import { ContactEmail } from '~/shared/ui'

definePageMeta({ layout: 'public' })
useHead({ title: 'Contact' })
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <h1 class="text-xl font-semibold">
      Contact
    </h1>

    <div class="space-y-4 text-sm leading-6 text-muted">
      <p>
        Write to the project owner about anything: a complaint regarding
        published content, a request to delete your account and its data, or
        trouble signing in.
      </p>

      <ContactEmail />

      <p>
        CuratedPhoto is run by one person, so please allow a few days for a
        reply.
      </p>
    </div>
  </div>
</template>
