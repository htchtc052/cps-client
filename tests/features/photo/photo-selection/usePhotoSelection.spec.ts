import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import type { AccountPhoto } from '../../../../app/entities/photo'
import { usePhotoSelection } from '../../../../app/features/photo/photo-selection/model/usePhotoSelection'

const photos = ref<AccountPhoto[]>([
  {
    id: 1,
    name: 'A photo',
    description: null,
    width: 100,
    height: 100,
    previewUrl: null,
    viewerUrl: '/viewer/1',
    viewerWidth: 100,
    viewerHeight: 100,
    originalName: 'a-photo.jpg',
    createdAt: '2026-08-23T00:00:00Z',
    shareToken: null,
    originalUrl: '/original/1',
  },
  {
    id: 2,
    name: 'Another photo',
    description: null,
    width: 200,
    height: 100,
    previewUrl: null,
    viewerUrl: '/viewer/2',
    viewerWidth: 200,
    viewerHeight: 100,
    originalName: 'another-photo.jpg',
    createdAt: '2026-08-23T00:00:00Z',
    shareToken: null,
    originalUrl: '/original/2',
  },
])

describe('usePhotoSelection', () => {
  it('starts empty and outside selection mode', () => {
    const { count, isSelectionMode, isSelected } = usePhotoSelection(photos)

    expect(count.value).toBe(0)
    expect(isSelectionMode.value).toBe(false)
    expect(isSelected(1)).toBe(false)
  })

  it('enters selection mode on the first selected photo', () => {
    const { count, isSelectionMode, isSelected, toggle } = usePhotoSelection(photos)

    toggle(1)

    expect(count.value).toBe(1)
    expect(isSelectionMode.value).toBe(true)
    expect(isSelected(1)).toBe(true)
  })

  it('deselects a photo it already holds', () => {
    const { count, isSelectionMode, isSelected, toggle } = usePhotoSelection(photos)

    toggle(1)
    toggle(2)
    toggle(1)

    expect(count.value).toBe(1)
    expect(isSelected(1)).toBe(false)
    expect(isSelected(2)).toBe(true)
    expect(isSelectionMode.value).toBe(true)
  })

  it('leaves selection mode once the last photo is deselected', () => {
    const { isSelectionMode, toggle } = usePhotoSelection(photos)

    toggle(1)
    toggle(1)

    expect(isSelectionMode.value).toBe(false)
  })

  it('clears the whole selection', () => {
    const { count, isSelectionMode, isSelected, toggle, clear } = usePhotoSelection(photos)

    toggle(1)
    toggle(2)
    clear()

    expect(count.value).toBe(0)
    expect(isSelectionMode.value).toBe(false)
    expect(isSelected(1)).toBe(false)
  })

  it('derives one selected photo and multiple-selection state', () => {
    const { selectedPhoto, hasMultiple, toggle } = usePhotoSelection(photos)

    toggle(1)

    expect(selectedPhoto.value).toEqual(photos.value[0])
    expect(hasMultiple.value).toBe(false)

    toggle(2)

    expect(selectedPhoto.value).toBeUndefined()
    expect(hasMultiple.value).toBe(true)
  })
})
