<script setup lang="ts">
import { SharedPhotoWidget } from '~/widgets/shared-photo'

definePageMeta({ layout: 'public' })

const route = useRoute()
const token = String(route.params.token)
</script>

<template>
  <SharedPhotoWidget :token="token" />
</template>
