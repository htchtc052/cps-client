export function useAdminRegistrationRequest() {
  const client = useSanctumClient()

  function getStatus(): Promise<{ registrationEnabled: boolean }> {
    return client('/api/registration')
  }

  function setEnabled(registrationEnabled: boolean): Promise<{ registrationEnabled: boolean }> {
    return client('/api/admin/settings/registration', {
      method: 'PUT',
      body: { registrationEnabled },
    })
  }

  return { getStatus, setEnabled }
}
