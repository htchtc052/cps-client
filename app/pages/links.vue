<script setup lang="ts">
import type { AccountAlbum } from '~/entities/album'
import type { AccountPhoto } from '~/entities/photo'
import { AlbumShareDialog, useAlbumSharing, useSharedAlbums } from '~/features/album/sharing'
import { PhotoShareDialog, useSharedPhotos, usePhotoSharing } from '~/features/photo/sharing'
import { PhotoLibraryNavigation } from '~/widgets/photo-library-navigation'

definePageMeta({ layout: 'account', middleware: ['sanctum:auth'] })
useHead({ title: 'Shared links' })

const tabItems = [
  { label: 'Photos', slot: 'photos' as const },
  { label: 'Albums', slot: 'albums' as const },
]

const { data: photos, error: photosError } = await useSharedPhotos()

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

const { data: albums, error: albumsError } = await useSharedAlbums()

const { albumUrl, copyText: copyAlbumText, deleteAlbum, isDeleting: isDeletingAlbum } = useAlbumSharing()

const dialogAlbum = ref<AccountAlbum | null>(null)
const isAlbumDialogOpen = ref(false)

function openAlbumDialog(album: AccountAlbum): void {
  dialogAlbum.value = album
  isAlbumDialogOpen.value = true
}

async function handleAlbumCopy(text: string): Promise<void> {
  await copyAlbumText(text)

  isAlbumDialogOpen.value = false
}

async function handleAlbumDeleteLink(): Promise<void> {
  const album = dialogAlbum.value

  if (!album) return

  const succeeded = await deleteAlbum(album.id)

  if (!succeeded) return

  albums.value = albums.value.filter(item => item.id !== album.id)
  isAlbumDialogOpen.value = false
}

function formatCreatedAt(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' })
}
</script>

<template>
  <div>
    <UPageHeader title="Shared links" />

    <div class="z-10 flex flex-wrap items-center gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <PhotoLibraryNavigation />
    </div>

    <UTabs
      :items="tabItems"
      class="w-full"
    >
      <template #photos>
        <UEmpty
          v-if="photosError"
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
      </template>

      <template #albums>
        <UEmpty
          v-if="albumsError"
          icon="i-lucide-triangle-alert"
          title="Shared albums are unavailable"
          description="We could not load your shared albums. Try again later."
        />

        <UEmpty
          v-else-if="albums.length === 0"
          icon="i-lucide-images"
          title="No shared albums yet"
          description="Select two or more photos to create an album link."
        />

        <UPageList
          v-else
          divide
          class="max-w-2xl"
        >
          <div
            v-for="album in albums"
            :key="album.id"
            class="flex items-center gap-3 py-3"
          >
            <div class="flex size-12 shrink-0 items-center justify-center rounded-md bg-elevated">
              <UIcon
                name="i-lucide-images"
                class="size-5 text-dimmed"
              />
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm">
                {{ album.photosCount === 1 ? '1 photo' : `${album.photosCount} photos` }}
              </p>

              <p class="truncate text-xs text-muted">
                {{ formatCreatedAt(album.createdAt) }}
              </p>
            </div>

            <UButton
              icon="i-lucide-link"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="`Manage share link for album with ${album.photosCount} photos`"
              @click="openAlbumDialog(album)"
            />
          </div>
        </UPageList>
      </template>
    </UTabs>

    <PhotoShareDialog
      v-model:open="isDialogOpen"
      :photo-name="dialogPhoto?.name ?? ''"
      :share-urls="dialogPhoto?.shareToken ? shareUrls(dialogPhoto.shareToken) : null"
      :is-deleting="isDisablingSharing"
      @copy="handleCopy"
      @delete-link="handleDeleteLink"
    />

    <AlbumShareDialog
      v-model:open="isAlbumDialogOpen"
      :photos-count="dialogAlbum?.photosCount ?? 0"
      :share-url="dialogAlbum ? albumUrl(dialogAlbum.shareToken) : null"
      :is-deleting="isDeletingAlbum"
      @copy="handleAlbumCopy"
      @delete-link="handleAlbumDeleteLink"
    />
  </div>
</template>
