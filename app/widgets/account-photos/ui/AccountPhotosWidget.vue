<script setup lang="ts">
import type { AccountPhoto } from '~/entities/photo'
import { PhotoGrid } from '~/entities/photo'
import { useAddToAlbum } from '~/features/album/add-photos'
import { SelectablePhotoCard, usePhotoSelection } from '~/features/photo/photo-selection'
import { PhotoDetailsDialog, usePhotoDetails } from '~/features/photo/details'
import { PhotoShareDialog, usePhotoSharing } from '~/features/photo/sharing'
import { useMoveToTrash } from '~/features/photo/trash'
import { usePhotoSwipeGallery } from '~/shared/lib/photoswipe'
import { PhotoLibraryNavigation } from '~/widgets/photo-library-navigation'
import type { PhotoSharing, PhotoSort } from '../api/useAccountPhotosRequest'
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

const sharingOptions: { label: string, value: PhotoSharing, icon?: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Shared', value: 'shared', icon: 'i-lucide-link' },
  { label: 'Private', value: 'private', icon: 'i-lucide-lock' },
]

const orientationLabels: Record<PhotoOrientationFilter, string> = {
  all: 'Orientation',
  landscape: 'Landscape',
  portrait: 'Portrait',
  square: 'Square',
}

const sortLabels: Record<PhotoSort, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  name: 'Name',
}

const { photos, error, orientation, sort, sharing, isRefreshing, refresh } = await useAccountPhotos()

const galleryElement = ref<HTMLElement | null>(null)

usePhotoSwipeGallery(galleryElement)

const { count, ids, isSelectionMode, selectedPhoto, isSelected, toggle, clear } = usePhotoSelection(photos)
const { moveToTrash, isMoving } = useMoveToTrash(photos, clear)
const { share, shareUrls, copyText, disableSharing, isSharing, isDisablingSharing } = usePhotoSharing(photos, {
  onDisabled: (photoId) => {
    if (sharing.value === 'shared') {
      photos.value = photos.value.filter(photo => photo.id !== photoId)
    }
    else {
      photos.value = photos.value.map(photo =>
        photo.id === photoId ? { ...photo, shareToken: null } : photo,
      )
    }
  },
})

const { isActive: isAddingToAlbum, targetAlbum, addSelectedPhotos, isAdding, exitAddMode } = useAddToAlbum()

async function addSelectionToAlbum(): Promise<void> {
  await addSelectedPhotos(ids.value)
}

function cancelAddToAlbum(): void {
  clear()
  exitAddMode()
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

function onSharingChange(value: PhotoSharing) {
  sharing.value = value
  clear()
  refresh()
}

function showAllPhotos() {
  orientation.value = 'all'
  clear()
  refresh()
}

const orientationMenuItems = computed(() => orientationItems.map(item => ({
  label: item.label,
  value: item.value,
  onSelect: () => onOrientationChange(item.value),
})))

const sortMenuItems = computed(() => sortItems.map(item => ({
  label: item.label,
  value: item.value,
  onSelect: () => onSortChange(item.value),
})))
</script>

<template>
  <div>
    <UAlert
      v-if="isAddingToAlbum && targetAlbum"
      icon="i-lucide-image-plus"
      color="neutral"
      variant="subtle"
      :title="`Adding photos to “${targetAlbum.title}”`"
      description="Select photos below, then add them to the album."
      class="mb-3"
      :actions="[{ label: 'Cancel', color: 'neutral', variant: 'outline', onClick: cancelAddToAlbum }]"
    />

    <div class="z-10 flex flex-wrap items-center justify-between gap-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <template v-if="isSelectionMode && isAddingToAlbum">
        <span class="text-sm font-medium">{{ count }} selected</span>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            label="Add to album"
            icon="i-lucide-image-plus"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="isAdding"
            :disabled="isAdding"
            @click="addSelectionToAlbum"
          />

          <UButton
            label="Cancel"
            color="neutral"
            variant="outline"
            size="sm"
            @click="cancelAddToAlbum"
          />
        </div>
      </template>

      <template v-else-if="isSelectionMode">
        <span class="text-sm font-medium">{{ count }} selected</span>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-if="selectedPhoto"
            :label="selectedPhoto.shareToken === null ? 'Share photo' : 'Manage link'"
            icon="i-lucide-link"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="isSharing || isDisablingSharing || isMoving"
            @click="openShareDialog(selectedPhoto)"
          />

          <UButton
            label="Move to trash"
            icon="i-lucide-trash-2"
            color="error"
            size="sm"
            :loading="isMoving"
            :disabled="isMoving"
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

          <div class="flex flex-wrap items-center justify-between gap-3">
            <UFieldGroup class="w-full sm:w-auto">
              <UButton
                v-for="option in sharingOptions"
                :key="option.value"
                type="button"
                :label="option.label"
                :icon="option.icon"
                :color="sharing === option.value ? 'primary' : 'neutral'"
                :variant="sharing === option.value ? 'soft' : 'outline'"
                :aria-pressed="sharing === option.value"
                :disabled="isRefreshing"
                class="flex-1 sm:flex-initial"
                @click="onSharingChange(option.value)"
              />
            </UFieldGroup>

            <div class="flex flex-1 items-center gap-2 sm:flex-initial">
              <UDropdownMenu
                :items="orientationMenuItems"
                :disabled="isRefreshing"
                class="flex-1 sm:flex-initial"
              >
                <UButton
                  :label="orientationLabels[orientation]"
                  icon="i-lucide-ratio"
                  trailing-icon="i-lucide-chevron-down"
                  color="neutral"
                  :variant="orientation === 'all' ? 'outline' : 'soft'"
                  :disabled="isRefreshing"
                  block
                />

                <template #item-trailing="{ item }">
                  <UIcon
                    v-if="item.value === orientation"
                    name="i-lucide-check"
                    class="size-4"
                  />
                </template>
              </UDropdownMenu>

              <UDropdownMenu
                :items="sortMenuItems"
                :disabled="isRefreshing"
                class="flex-1 sm:flex-initial"
              >
                <UButton
                  :label="sortLabels[sort]"
                  icon="i-lucide-arrow-up-down"
                  trailing-icon="i-lucide-chevron-down"
                  color="neutral"
                  variant="ghost"
                  :disabled="isRefreshing"
                  block
                />

                <template #item-trailing="{ item }">
                  <UIcon
                    v-if="item.value === sort"
                    name="i-lucide-check"
                    class="size-4"
                  />
                </template>
              </UDropdownMenu>
            </div>
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
        v-else-if="photos.length === 0 && orientation === 'all' && sharing === 'all'"
        icon="i-lucide-image"
        title="No photos yet"
        description="Upload your first photos to start your collection."
      />

      <UEmpty
        v-else-if="photos.length === 0 && sharing === 'shared'"
        icon="i-lucide-link"
        title="No shared photos"
        description="Share a photo from its action menu and it will show up here."
      />

      <UEmpty
        v-else-if="photos.length === 0 && sharing === 'private'"
        icon="i-lucide-lock"
        title="No private photos"
        description="Photos without a share link show up here."
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
  </div>
</template>
