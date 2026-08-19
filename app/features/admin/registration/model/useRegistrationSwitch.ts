import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useAdminRegistrationRequest } from '../api/useAdminRegistrationRequest'

export function useRegistrationSwitch() {
  const toast = useToast()
  const { getStatus, setEnabled } = useAdminRegistrationRequest()
  const { data } = useAsyncData(getStatus, { default: () => ({ registrationEnabled: true }) })
  const { execute, isLoading } = useApiOperation(setEnabled)

  async function toggle(enabled: boolean): Promise<void> {
    const result = await execute(enabled)

    if (result.status !== ApiResultStatus.Success) return

    data.value = result.data

    toast.add({
      title: result.data.registrationEnabled ? 'Registration is open.' : 'Registration is closed.',
      color: 'success',
    })
  }

  return { status: data, toggle, isSaving: isLoading }
}
