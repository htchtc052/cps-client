import type { Ref } from 'vue'
import type { AdminUser } from '~/entities/admin'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAdminAccountsRequest } from '../api/useAdminAccountsRequest'

export function useAccountBlocking(accounts: Ref<AdminUser[]>) {
  const toast = useToast()
  const { blockAccount, unblockAccount } = useAdminAccountsRequest()
  const blockOperation = useApiOperation(blockAccount)
  const unblockOperation = useApiOperation(unblockAccount)

  async function toggleBlocking(account: AdminUser): Promise<AdminUser | null> {
    const operation = account.blockedAt === null ? blockOperation : unblockOperation
    const response = await operation.execute(account.id)

    if (response.status !== ApiResultStatus.Success) return null

    accounts.value = accounts.value.map(row => row.id === account.id ? response.data : row)

    toast.add({
      title: response.data.blockedAt === null ? 'Account unblocked.' : 'Account blocked.',
      color: 'success',
    })

    return response.data
  }

  return {
    toggleBlocking,
    isBlocking: computed(() => blockOperation.isLoading.value || unblockOperation.isLoading.value),
  }
}
