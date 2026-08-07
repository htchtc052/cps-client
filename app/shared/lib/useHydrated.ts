/**
 * Whether Vue has taken over the server-rendered markup.
 *
 * Controls that only work through JavaScript stay disabled until this flips,
 * so a click on the server-rendered page cannot be silently swallowed.
 */
export function useHydrated() {
  const hydrated = ref(false)

  onMounted(() => {
    hydrated.value = true
  })

  return hydrated
}
