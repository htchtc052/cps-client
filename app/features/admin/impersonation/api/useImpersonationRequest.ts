export function useImpersonationRequest() {
  const client = useSanctumClient()

  function startImpersonation(userId: number): Promise<void> {
    return client(`/api/admin/users/${userId}/impersonate`, { method: 'POST' })
  }

  function stopImpersonation(): Promise<void> {
    return client('/api/impersonation', { method: 'DELETE' })
  }

  return { startImpersonation, stopImpersonation }
}
