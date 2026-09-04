<script setup lang="ts">
import type { AlbumSharingFilter } from '~/entities/album'
import { useAccountAlbums } from '~/entities/album'
import { type AlbumCreateDto, CreateAlbumDialog, useAlbumCreate } from '~/features/album/create'
import { PhotoLibraryNavigation } from '~/widgets/photo-library-navigation'

const sharingOptions: { label: string, value: AlbumSharingFilter, icon?: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Shared', value: 'shared', icon: 'i-lucide-link' },
  { label: 'Private', value: 'private', icon: 'i-lucide-lock' },
]

const { albums, error, sharing, isRefreshing, refresh } = await useAccountAlbums()

const { create, isCreating } = useAlbumCreate()

const isCreateDialogOpen = ref(false)

async function handleCreate(data: AlbumCreateDto): Promise<void> {
  const result = await create(data)

  if (!result || Array.isArray(result)) return

  isCreateDialogOpen.value = false

  await navigateTo(`/albums/${result.id}`)
}

function onSharingChange(value: AlbumSharingFilter) {
  sharing.value = value
  refresh()
}

function photosLabel(count: number): string {
  return count === 1 ? '1 photo' : `${count} photos`
}

const emptyStateProps = computed(() => {
  if (sharing.value === 'shared') {
    return {
      icon: 'i-lucide-link',
      title: 'No shared albums',
      description: 'Open an album and create a link to share it.',
    }
  }

  if (sharing.value === 'private') {
    return {
      icon: 'i-lucide-lock',
      title: 'No private albums',
      description: 'Albums without a share link show up here.',
    }
  }

  return {
    icon: 'i-lucide-images',
    title: 'No albums yet',
    description: 'Create an album to start grouping your photos.',
  }
})
</script>

<template>
  <div>
    <UPageHeader title="Albums">
      <template #links>
        <UButton
          label="New album"
          icon="i-lucide-plus"
          @click="isCreateDialogOpen = true"
        />
      </template>
    </UPageHeader>

    <div class="z-10 space-y-3 bg-muted py-4 sm:sticky sm:top-(--ui-header-height)">
      <PhotoLibraryNavigation />

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
    </div>

    <UEmpty
      v-if="error"
      icon="i-lucide-triangle-alert"
      title="Albums are unavailable"
      description="We could not load your albums. Try again later."
    />

    <UEmpty
      v-else-if="albums.length === 0"
      v-bind="emptyStateProps"
      :actions="sharing === 'all' ? [{ label: 'New album', onClick: () => isCreateDialogOpen = true }] : []"
    />

    <UPageGrid
      v-else
      class="grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"
    >
      <NuxtLink
        v-for="album in albums"
        :key="album.id"
        :to="`/albums/${album.id}`"
        class="relative min-w-0"
      >
        <div class="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-elevated ring ring-default">
          <img
            v-if="album.coverPreviewUrl"
            :src="album.coverPreviewUrl"
            :alt="album.title"
            loading="lazy"
            decoding="async"
            class="size-full object-cover"
          >

          <UIcon
            v-else
            name="i-lucide-images"
            class="size-8 text-dimmed"
          />
        </div>

        <UBadge
          v-if="sharing === 'all' && album.shareToken !== null"
          icon="i-lucide-link"
          color="neutral"
          variant="solid"
          size="sm"
          class="absolute top-2 right-2 bg-black/40 text-white"
        />

        <p class="mt-1 truncate text-sm text-toned">
          {{ album.title }}
        </p>

        <p class="truncate text-xs text-muted">
          {{ photosLabel(album.photosCount) }}
        </p>
      </NuxtLink>
    </UPageGrid>

    <CreateAlbumDialog
      v-model:open="isCreateDialogOpen"
      :is-creating="isCreating"
      @create="handleCreate"
    />
  </div>
</template>
