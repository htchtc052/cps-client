import { useAdminAccountsRequest } from '../api/useAdminAccountsRequest'

export function useAdminAccounts() {
  const { getAccounts } = useAdminAccountsRequest()

  return useAsyncData(getAccounts, {
    default: () => [],
  })
}
