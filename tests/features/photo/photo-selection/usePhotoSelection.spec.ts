import { describe, expect, it } from 'vitest'
import { usePhotoSelection } from '../../../../app/features/photo/photo-selection/model/usePhotoSelection'

describe('usePhotoSelection', () => {
  it('starts empty and outside selection mode', () => {
    const { count, isSelectionMode, isSelected } = usePhotoSelection()

    expect(count.value).toBe(0)
    expect(isSelectionMode.value).toBe(false)
    expect(isSelected(1)).toBe(false)
  })

  it('enters selection mode on the first selected photo', () => {
    const { count, isSelectionMode, isSelected, toggle } = usePhotoSelection()

    toggle(1)

    expect(count.value).toBe(1)
    expect(isSelectionMode.value).toBe(true)
    expect(isSelected(1)).toBe(true)
  })

  it('deselects a photo it already holds', () => {
    const { count, isSelectionMode, isSelected, toggle } = usePhotoSelection()

    toggle(1)
    toggle(2)
    toggle(1)

    expect(count.value).toBe(1)
    expect(isSelected(1)).toBe(false)
    expect(isSelected(2)).toBe(true)
    expect(isSelectionMode.value).toBe(true)
  })

  it('leaves selection mode once the last photo is deselected', () => {
    const { isSelectionMode, toggle } = usePhotoSelection()

    toggle(1)
    toggle(1)

    expect(isSelectionMode.value).toBe(false)
  })

  it('clears the whole selection', () => {
    const { count, isSelectionMode, isSelected, toggle, clear } = usePhotoSelection()

    toggle(1)
    toggle(2)
    clear()

    expect(count.value).toBe(0)
    expect(isSelectionMode.value).toBe(false)
    expect(isSelected(1)).toBe(false)
  })
})
