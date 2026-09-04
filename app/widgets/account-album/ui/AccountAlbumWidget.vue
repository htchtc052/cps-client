<script setup lang="ts">
import { useAccountAlbum, useAccountAlbumPhotos } from '~/entities/album'
import { useAlbumDelete } from '~/features/album/delete'
import { RemovableAlbumPhotoCard, useRemoveFromAlbum } from '~/features/album/membership'
import { type AlbumRenameDto, RenameAlbumDialog, useAlbumRename } from '~/features/album/rename'
import { AlbumShareDialog, useAlbumSharing } from '~/features/album/sharing'
import { usePhotoSelection } from '~/features/photo/photo-selection'
import { PhotoGrid } from '~/entities/photo'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'

const props = defineProps<{ id: number }>()

const { data: album, error } = await useAccountAlbum(props.id)
const { data: photos, error: photosError } = await useAccountAlbumPhotos(props.id)

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const { count, ids, isSelectionMode, isSelected, toggle, clear } = usePhotoSelection(photos)
const { remove, isRemoving } = useRemoveFromAlbum(props.id, photos, clear)

const { rename, isRenaming } = useAlbumRename()
const isRenameDialogOpen = ref(false)

async function handleRename(data: AlbumRenameDto): Promise<void> {
  const result = await rename(props.id, data)

  if (!result || Array.isArray(result)) return

  album.value = result
  isRenameDialogOpen.value = false
}

const { deleteAlbum, isDeleting } = useAlbumDelete()

async function confirmDelete(close: () => void): Promise<void> {
  const succeeded = await deleteAlbum(props.id)

  close()

  if (succeeded) await navigateTo('/albums')
}

const { share, albumUrl, copyText, revoke, isSharing, isRevoking } = useAlbumSharing()
const isShareDialogOpen = ref(false)

async function openShareDialog(): Promise<void> {
  if (!album.value) return

  if (album.value.shareToken === null) {
    const shared = await share(props.id)

    if (!shared) return

    album.value = shared
  }

  isShareDialogOpen.value = true
}

async function handleCopy(text: string): Promise<void> {
  await copyText(text)

  isShareDialogOpen.value = false
}

async function handleRevoke(): Promise<void> {
  const succeeded = await revoke(props.id)

  if (!succeeded || !album.value) return

  album.value = { ...album.value, shareToken: null }
  isShareDialogOpen.value = false
}

const photosLabel = computed(() => {
  const value = photos.value.length

  return value === 1 ? '1 photo' : `${value} photos`
})
</script>

<template>
  <div>
    <UEmpty
      v-if="error"
      icon="i-lucide-triangle-alert"
      title="This album is unavailable"
      description="We could not load this album."
      :actions="[{ label: 'Back to albums', to: '/albums' }]"
    />

    <template v-else-if="album">
      <UPageHeader
        :title="album.title"
        :description="photosLabel"
      >
        <template #links>
          <UButton
            label="Back to albums"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="subtle"
            to="/albums"
          />
        </template>
      </UPageHeader>

      <div class="z-10 flex flex-wrap items-center justify-between gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
        <template v-if="isSelectionMode">
          <span class="text-sm font-medium">{{ count }} selected</span>

          <div class="flex flex-wrap items-center gap-2">
            <UButton
              label="Remove from album"
              icon="i-lucide-image-minus"
              color="error"
              variant="subtle"
              size="sm"
              :loading="isRemoving"
              :disabled="isRemoving"
              @click="remove(ids)"
            />

            <UButton
              label="Cancel"
              color="neutral"
              variant="outline"
              size="sm"
              @click="clear"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex flex-wrap items-center gap-2">
            <UButton
              label="Rename"
              icon="i-lucide-pencil"
              color="neutral"
              variant="subtle"
              size="sm"
              @click="isRenameDialogOpen = true"
            />

            <UButton
              label="Add photos"
              icon="i-lucide-image-plus"
              color="neutral"
              variant="subtle"
              size="sm"
              :to="`/owner?addToAlbum=${id}`"
            />

            <UButton
              :label="album.shareToken === null ? 'Share' : 'Manage link'"
              icon="i-lucide-link"
              color="neutral"
              variant="subtle"
              size="sm"
              :loading="isSharing"
              :disabled="isSharing"
              @click="openShareDialog"
            />
          </div>

          <UModal
            title="Delete album?"
            description="This deletes the album. Its photos stay in your library."
          >
            <UButton
              label="Delete album"
              icon="i-lucide-trash-2"
              color="error"
              variant="subtle"
              size="sm"
            />

            <template #footer="{ close }">
              <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="close"
              />

              <UButton
                label="Delete album"
                color="error"
                :loading="isDeleting"
                @click="confirmDelete(close)"
              />
            </template>
          </UModal>
        </template>
      </div>

      <div ref="galleryElement">
        <UEmpty
          v-if="photosError"
          icon="i-lucide-triangle-alert"
          title="Photos are unavailable"
          description="We could not load photos for this album."
        />

        <UEmpty
          v-else-if="photos.length === 0"
          icon="i-lucide-image-off"
          title="No photos in this album"
          description="Add photos from your library to fill this album."
          :actions="[{ label: 'Add photos', to: `/owner?addToAlbum=${id}` }]"
        />

        <PhotoGrid
          v-else
          v-slot="{ photo }"
          :photos="photos"
        >
          <RemovableAlbumPhotoCard
            :photo="photo"
            :selected="isSelected(photo.id)"
            @toggle="toggle(photo.id)"
          />
        </PhotoGrid>
      </div>

      <RenameAlbumDialog
        v-model:open="isRenameDialogOpen"
        :album="album"
        :is-renaming="isRenaming"
        @rename="handleRename"
      />

      <AlbumShareDialog
        v-model:open="isShareDialogOpen"
        :title="album.title"
        :photos-count="photos.length"
        :share-url="album.shareToken ? albumUrl(album.shareToken) : null"
        :is-revoking="isRevoking"
        @copy="handleCopy"
        @revoke="handleRevoke"
      />
    </template>
  </div>
</template>
