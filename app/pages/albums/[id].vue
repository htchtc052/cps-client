<script setup lang="ts">
import { AccountAlbumWidget } from '~/widgets/account-album'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Album' })

const route = useRoute()
const id = Number(route.params.id)
</script>

<template>
  <AccountAlbumWidget :id="id" />
</template>
