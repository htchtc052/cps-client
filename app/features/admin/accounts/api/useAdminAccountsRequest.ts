import type { AdminUser } from '~/entities/admin'

export function useAdminAccountsRequest() {
  const client = useSanctumClient()

  function getAccounts(): Promise<AdminUser[]> {
    return client<AdminUser[]>('/api/admin/users')
  }

  function blockAccount(userId: number): Promise<AdminUser> {
    return client<AdminUser>(`/api/admin/users/${userId}/block`, { method: 'POST' })
  }

  function unblockAccount(userId: number): Promise<AdminUser> {
    return client<AdminUser>(`/api/admin/users/${userId}/block`, { method: 'DELETE' })
  }

  return { getAccounts, blockAccount, unblockAccount }
}
