import type { AdminUser } from '~/entities/admin'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useImpersonationRequest } from '../api/useImpersonationRequest'

export function useImpersonation() {
  const { refreshIdentity } = useSanctumAuth()
  const { startImpersonation, stopImpersonation } = useImpersonationRequest()
  const startOperation = useApiOperation(startImpersonation)
  const stopOperation = useApiOperation(stopImpersonation)

  async function start(user: AdminUser): Promise<void> {
    const response = await startOperation.execute(user.id)

    if (response.status !== ApiResultStatus.Success) return

    await refreshIdentity()
    await navigateTo('/owner')
  }

  async function stop(): Promise<void> {
    const response = await stopOperation.execute()

    if (response.status !== ApiResultStatus.Success) return

    await refreshIdentity()
    await navigateTo('/admin')
  }

  return {
    start,
    stop,
    isStarting: startOperation.isLoading,
    isStopping: stopOperation.isLoading,
  }
}
