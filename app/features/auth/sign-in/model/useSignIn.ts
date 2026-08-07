import type { FormError } from '@nuxt/ui'
import type { Account } from '~/entities/account'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { SignInDto } from '../contract/sign-in.contract'

export function useSignIn() {
  const { login } = useSanctumAuth<Account>()
  const {
    execute: executeSignIn,
    isLoading,
  } = useApiOperation(login)

  async function signIn(data: SignInDto): Promise<FormError[] | undefined> {
    const result = await executeSignIn(data)

    if (result.status === ApiResultStatus.Validation) return result.errors
  }

  return {
    signIn,
    isLoading,
  }
}
