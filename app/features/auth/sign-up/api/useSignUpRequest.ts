import type { SignUpDto } from '../contract/sign-up.contract'

export function useSignUpRequest() {
  const client = useSanctumClient()

  function register(data: SignUpDto): Promise<void> {
    return client('/api/register', { method: 'POST', body: data })
  }

  function getRegistrationStatus(): Promise<{ registrationEnabled: boolean }> {
    return client('/api/registration')
  }

  return { register, getRegistrationStatus }
}
