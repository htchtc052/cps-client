export function parseTargetAlbumId(value: unknown): number | null {
  const raw = Array.isArray(value) ? value[0] : value

  if (typeof raw !== 'string' || raw === '') return null

  const id = Number(raw)

  return Number.isInteger(id) && id > 0 ? id : null
}
