import type { FormError } from '@nuxt/ui'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import type { ForgotPasswordDto, ResetPasswordDto } from '../contract/password-reset.contract'

export function usePasswordReset() {
  const client = useSanctumClient()
  const toast = useToast()
  const isLinkSent = ref(false)

  const forgotOperation = useApiOperation(
    (data: ForgotPasswordDto) => client('/api/forgot-password', { method: 'POST', body: data }),
  )

  const resetOperation = useApiOperation(
    (data: ResetPasswordDto & { token: string, email: string }) =>
      client('/api/reset-password', { method: 'POST', body: data }),
  )

  async function requestLink(data: ForgotPasswordDto): Promise<FormError[] | undefined> {
    const result = await forgotOperation.execute(data)

    if (result.status === ApiResultStatus.Validation) return result.errors
    if (result.status !== ApiResultStatus.Success) return

    isLinkSent.value = true
  }

  async function resetPassword(
    data: ResetPasswordDto,
    token: string,
    email: string,
  ): Promise<FormError[] | undefined> {
    const result = await resetOperation.execute({ ...data, token, email })

    if (result.status === ApiResultStatus.Validation) return result.errors
    if (result.status !== ApiResultStatus.Success) return

    toast.add({ title: 'Password updated. You can sign in now.', color: 'success' })

    await navigateTo('/login')
  }

  return {
    requestLink,
    resetPassword,
    isLinkSent,
    isRequesting: forgotOperation.isLoading,
    isResetting: resetOperation.isLoading,
  }
}
