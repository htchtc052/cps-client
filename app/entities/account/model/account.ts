/** The account contract returned by the Laravel session API. */
export interface Account {
  id: number
  name: string
  email: string
}

/** Current account state owned by `nuxt-auth-sanctum`. */
export function useAccount() {
  return useSanctumUser<Account>()
}
