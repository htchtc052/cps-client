import type { Account } from '~/entities/account'
import { useApiOperation } from '~/shared/api'

export function useSignOut() {
  const { logout } = useSanctumAuth<Account>()
  const {
    execute: executeSignOut,
    isLoading,
  } = useApiOperation(logout)

  async function signOut(): Promise<void> {
    await executeSignOut()
  }

  return {
    signOut,
    isLoading,
  }
}
