import { useSignUpRequest } from '../api/useSignUpRequest'

export function useRegistrationStatus() {
  const { getRegistrationStatus } = useSignUpRequest()

  return useAsyncData(getRegistrationStatus, {
    default: () => ({ registrationEnabled: true }),
  })
}
