<script setup lang="ts">
import { PublicProfileWidget, usePublicProfile } from '~/widgets/public-profile'

definePageMeta({ layout: 'public' })

const route = useRoute()
const token = String(route.params.token)

const { data: profile, error } = await usePublicProfile(token)

useHead({ title: profile.value?.name ?? 'Shared profile' })
</script>

<template>
  <PublicProfileWidget
    :profile="profile"
    :has-error="!!error"
  />
</template>
