import { describe, expect, it } from 'vitest'
import { parseTargetAlbumId } from '../../../../app/features/album/add-photos/model/parseTargetAlbumId'

describe('parseTargetAlbumId', () => {
  it('parses a numeric string into a positive integer', () => {
    expect(parseTargetAlbumId('42')).toBe(42)
  })

  it('returns null when the query param is absent', () => {
    expect(parseTargetAlbumId(undefined)).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(parseTargetAlbumId('')).toBeNull()
  })

  it('returns null for a non-numeric string', () => {
    expect(parseTargetAlbumId('abc')).toBeNull()
  })

  it('returns null for zero or negative values', () => {
    expect(parseTargetAlbumId('0')).toBeNull()
    expect(parseTargetAlbumId('-5')).toBeNull()
  })

  it('returns null for a non-integer value', () => {
    expect(parseTargetAlbumId('4.5')).toBeNull()
  })

  it('takes the first value when the query param repeats', () => {
    expect(parseTargetAlbumId(['7', '9'])).toBe(7)
  })
})
