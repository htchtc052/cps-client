<script setup lang="ts">
import type { AccountAlbum } from '~/entities/album'
import type { AccountPhoto } from '~/entities/photo'
import { PhotoGrid } from '~/entities/photo'
import { AlbumShareDialog, useAlbumSharing } from '~/features/album/sharing'
import { SelectablePhotoCard, usePhotoSelection } from '~/features/photo/photo-selection'
import { PhotoDetailsDialog, usePhotoDetails } from '~/features/photo/details'
import { PhotoShareDialog, usePhotoSharing } from '~/features/photo/sharing'
import { useMoveToTrash } from '~/features/photo/trash'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { PhotoLibraryNavigation } from '~/widgets/photo-library-navigation'
import type { PhotoSort } from '../api/useAccountPhotosRequest'
import { useAccountPhotos, type PhotoOrientationFilter } from '../model/useAccountPhotos'

const orientationItems: { label: string, value: PhotoOrientationFilter }[] = [
  { label: 'All orientations', value: 'all' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Square', value: 'square' },
]

const sortItems: { label: string, value: PhotoSort }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Name', value: 'name' },
]

const { photos, error, orientation, sort, isRefreshing, refresh } = await useAccountPhotos()

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const { count, ids, isSelectionMode, selectedPhoto, hasMultiple, isSelected, toggle, clear } = usePhotoSelection(photos)
const { moveToTrash, isMoving } = useMoveToTrash(photos, clear)
const { share, shareUrls, copyText, disableSharing, isSharing, isDisablingSharing } = usePhotoSharing(photos)

const {
  createAlbum,
  albumUrl,
  copyText: copyAlbumText,
  deleteAlbum,
  isCreating: isCreatingAlbum,
  isDeleting: isDeletingAlbum,
} = useAlbumSharing()

const albumDialogAlbum = ref<AccountAlbum | null>(null)
const isAlbumDialogOpen = ref(false)

async function shareSelectedPhotos(): Promise<void> {
  const created = await createAlbum(ids.value)

  if (!created) return

  clear()
  albumDialogAlbum.value = created
  isAlbumDialogOpen.value = true
}

async function handleAlbumCopy(text: string): Promise<void> {
  await copyAlbumText(text)

  isAlbumDialogOpen.value = false
}

async function handleAlbumDeleteLink(): Promise<void> {
  if (!albumDialogAlbum.value) return

  const succeeded = await deleteAlbum(albumDialogAlbum.value.id)

  if (succeeded) isAlbumDialogOpen.value = false
}

const { save: savePhotoDetails, isSaving: isSavingDetails } = usePhotoDetails(photos)

const detailsPhoto = ref<AccountPhoto | null>(null)
const isDetailsDialogOpen = ref(false)

function openDetailsDialog(photo: AccountPhoto): void {
  detailsPhoto.value = photo
  isDetailsDialogOpen.value = true
}

async function handleSaveDetails(data: { name: string, description: string }): Promise<void> {
  if (!detailsPhoto.value) return

  const errors = await savePhotoDetails(detailsPhoto.value.id, data)

  if (!errors) isDetailsDialogOpen.value = false
}

const shareDialogPhoto = ref<AccountPhoto | null>(null)
const isShareDialogOpen = ref(false)

async function openShareDialog(photo: AccountPhoto): Promise<void> {
  if (photo.shareToken === null) {
    const created = await share(photo.id)

    if (!created) return

    shareDialogPhoto.value = created
  }
  else {
    shareDialogPhoto.value = photo
  }

  isShareDialogOpen.value = true
}

async function handleCopy(text: string): Promise<void> {
  await copyText(text)

  isShareDialogOpen.value = false
  clear()
}

async function handleDeleteLink(): Promise<void> {
  if (!shareDialogPhoto.value) return

  const succeeded = await disableSharing(shareDialogPhoto.value.id)

  if (succeeded) isShareDialogOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') clear()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

function onOrientationChange(value: PhotoOrientationFilter) {
  orientation.value = value
  clear()
  refresh()
}

function onSortChange(value: PhotoSort) {
  sort.value = value
  clear()
  refresh()
}

function showAllPhotos() {
  orientation.value = 'all'
  clear()
  refresh()
}
</script>

<template>
  <div>
    <div class="z-10 flex flex-wrap items-center justify-between gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <template v-if="isSelectionMode">
        <span class="text-sm font-medium">{{ count }} selected</span>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-if="selectedPhoto"
            :label="selectedPhoto.shareToken === null ? 'Share photo' : 'Manage link'"
            icon="i-lucide-link"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="isSharing || isDisablingSharing || isMoving || isCreatingAlbum || isDeletingAlbum"
            @click="openShareDialog(selectedPhoto)"
          />

          <UButton
            v-else-if="hasMultiple"
            label="Share photos"
            icon="i-lucide-link"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="isCreatingAlbum"
            :disabled="isSharing || isDisablingSharing || isMoving || isCreatingAlbum || isDeletingAlbum"
            @click="shareSelectedPhotos"
          />

          <UButton
            label="Move to trash"
            icon="i-lucide-trash-2"
            color="error"
            size="sm"
            :loading="isMoving"
            :disabled="isMoving || isCreatingAlbum || isDeletingAlbum"
            @click="moveToTrash(ids)"
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
        <div class="w-full space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <PhotoLibraryNavigation />

            <span class="text-sm text-muted">{{ photos.length }} photos</span>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <USelect
              :items="orientationItems"
              :model-value="orientation"
              :disabled="isRefreshing"
              class="w-full"
              @update:model-value="onOrientationChange"
            />

            <USelect
              :items="sortItems"
              :model-value="sort"
              :disabled="isRefreshing"
              class="w-full"
              @update:model-value="onSortChange"
            />
          </div>
        </div>
      </template>
    </div>

    <div ref="galleryElement">
      <UEmpty
        v-if="error"
        icon="i-lucide-triangle-alert"
        title="Photos are unavailable"
        description="We could not load your photos. Try again later."
      />

      <UEmpty
        v-else-if="photos.length === 0 && orientation === 'all'"
        icon="i-lucide-image"
        title="No photos yet"
        description="Upload your first photos to start your collection."
      />

      <UEmpty
        v-else-if="photos.length === 0"
        icon="i-lucide-image-off"
        title="No matching photos"
        description="No photos match the selected orientation."
        :actions="[{ label: 'Show all photos', onClick: showAllPhotos }]"
      />

      <PhotoGrid
        v-else
        v-slot="{ photo }"
        :photos="photos"
      >
        <SelectablePhotoCard
          :photo="photo"
          :selected="isSelected(photo.id)"
          :actions-disabled="isSharing || isDisablingSharing || isMoving"
          @toggle="toggle(photo.id)"
          @share="openShareDialog(photo)"
          @edit-details="openDetailsDialog(photo)"
          @manage-share="openShareDialog(photo)"
          @move-to-trash="moveToTrash([photo.id])"
        />
      </PhotoGrid>
    </div>

    <PhotoDetailsDialog
      v-model:open="isDetailsDialogOpen"
      :photo="detailsPhoto"
      :is-saving="isSavingDetails"
      @save="handleSaveDetails"
    />

    <PhotoShareDialog
      v-model:open="isShareDialogOpen"
      :photo-name="shareDialogPhoto?.name ?? ''"
      :share-urls="shareDialogPhoto?.shareToken ? shareUrls(shareDialogPhoto.shareToken) : null"
      :is-deleting="isDisablingSharing"
      @copy="handleCopy"
      @delete-link="handleDeleteLink"
    />

    <AlbumShareDialog
      v-model:open="isAlbumDialogOpen"
      :photos-count="albumDialogAlbum?.photosCount ?? 0"
      :share-url="albumDialogAlbum ? albumUrl(albumDialogAlbum.shareToken) : null"
      :is-deleting="isDeletingAlbum"
      @copy="handleAlbumCopy"
      @delete-link="handleAlbumDeleteLink"
    />
  </div>
</template>
