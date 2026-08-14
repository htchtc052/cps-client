import type { Account } from '~/entities/account'

export function useProfileSharingRequest() {
  const client = useSanctumClient()

  function enableSharing(): Promise<Account> {
    return client<Account>('/api/account/share', { method: 'POST' })
  }

  function disableSharing(): Promise<void> {
    return client('/api/account/share', { method: 'DELETE' })
  }

  return {
    enableSharing,
    disableSharing,
  }
}
