<script setup lang="ts">
import type { AccountPhoto } from '~/entities/photo'
import { PhotoShareDialog, useSharedPhotos, usePhotoSharing } from '~/features/photo/sharing'
import { PhotoLibraryNavigation } from '~/widgets/photo-library-navigation'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Shared links' })

const { data: photos, error } = await useSharedPhotos()

const { shareUrls, copyText, disableSharing, isDisablingSharing } = usePhotoSharing(photos, {
  onDisabled: (photoId) => {
    photos.value = photos.value.filter(photo => photo.id !== photoId)
  },
})

const dialogPhoto = ref<AccountPhoto | null>(null)
const isDialogOpen = ref(false)

function openDialog(photo: AccountPhoto): void {
  dialogPhoto.value = photo
  isDialogOpen.value = true
}

async function handleCopy(text: string): Promise<void> {
  await copyText(text)

  isDialogOpen.value = false
}

async function handleDeleteLink(): Promise<void> {
  if (!dialogPhoto.value) return

  const succeeded = await disableSharing(dialogPhoto.value.id)

  if (succeeded) isDialogOpen.value = false
}
</script>

<template>
  <div>
    <UPageHeader title="Shared links" />

    <div class="z-10 flex flex-wrap items-center gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <PhotoLibraryNavigation />
    </div>

    <UEmpty
      v-if="error"
      icon="i-lucide-triangle-alert"
      title="Shared links are unavailable"
      description="We could not load your shared links. Try again later."
    />

    <UEmpty
      v-else-if="photos.length === 0"
      icon="i-lucide-link"
      title="No shared links yet"
      description="Share a photo from Photos and it will show up here."
    />

    <UPageList
      v-else
      divide
      class="max-w-2xl"
    >
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="flex items-center gap-3 py-3"
      >
        <img
          v-if="photo.previewUrl"
          :src="photo.previewUrl"
          :alt="photo.name"
          class="size-12 shrink-0 rounded-md object-cover"
        >

        <div
          v-else
          class="flex size-12 shrink-0 items-center justify-center rounded-md bg-elevated"
        >
          <UIcon
            name="i-lucide-image"
            class="size-5 text-dimmed"
          />
        </div>

        <span class="min-w-0 flex-1 truncate text-sm">{{ photo.name }}</span>

        <UButton
          icon="i-lucide-link"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="`Manage share link for ${photo.name}`"
          @click="openDialog(photo)"
        />
      </div>
    </UPageList>

    <PhotoShareDialog
      v-model:open="isDialogOpen"
      :photo-name="dialogPhoto?.name ?? ''"
      :share-urls="dialogPhoto?.shareToken ? shareUrls(dialogPhoto.shareToken) : null"
      :is-deleting="isDisablingSharing"
      @copy="handleCopy"
      @delete-link="handleDeleteLink"
    />
  </div>
</template>
