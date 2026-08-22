import { useSignUpRequest } from '../api/useSignUpRequest'

export type UseRegistrationStatusOptions = {
  immediate?: boolean
}

export function useRegistrationStatus(options: UseRegistrationStatusOptions = {}) {
  const { getRegistrationStatus } = useSignUpRequest()
  const immediate = options.immediate ?? true

  return useAsyncData(getRegistrationStatus, {
    default: () => ({ registrationEnabled: true }),
    immediate,
    server: immediate,
  })
}
