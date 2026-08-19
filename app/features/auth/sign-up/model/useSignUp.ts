import type { FormError } from '@nuxt/ui'
import type { Account } from '~/entities/account'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useSignUpRequest } from '../api/useSignUpRequest'
import type { SignUpDto } from '../contract/sign-up.contract'

export function useSignUp() {
  const { refreshIdentity } = useSanctumAuth<Account>()
  const { register } = useSignUpRequest()
  const { execute, isLoading } = useApiOperation(register)

  async function signUp(data: SignUpDto): Promise<FormError[] | undefined> {
    const result = await execute(data)

    if (result.status === ApiResultStatus.Validation) return result.errors
    if (result.status !== ApiResultStatus.Success) return

    await refreshIdentity()
    await navigateTo('/owner')
  }

  return { signUp, isLoading }
}
