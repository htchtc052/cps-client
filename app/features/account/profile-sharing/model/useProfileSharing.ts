import { computed, ref } from 'vue'
import type { Account } from '~/entities/account'
import { ApiResultStatus, useApiOperation } from '~/shared/api'
import { useProfileSharingRequest } from '../api/useProfileSharingRequest'

export function useProfileSharing() {
  const toast = useToast()
  const user = useSanctumUser<Account>()
  const requestUrl = useRequestURL()
  const { enableSharing, disableSharing } = useProfileSharingRequest()
  const enableOperation = useApiOperation(enableSharing)
  const disableOperation = useApiOperation(disableSharing)

  const isOpen = ref(false)

  const shareUrl = computed(() => {
    if (!user.value?.shareToken) return null

    return `${requestUrl.origin}/shared/${user.value.shareToken}`
  })

  async function open(): Promise<void> {
    if (user.value?.shareToken) {
      isOpen.value = true
      return
    }

    const response = await enableOperation.execute()

    if (response.status !== ApiResultStatus.Success) return

    user.value = response.data
    isOpen.value = true
  }

  async function copyLink(): Promise<void> {
    if (!shareUrl.value) return

    await navigator.clipboard.writeText(shareUrl.value)

    toast.add({ title: 'Link copied.', color: 'success' })
  }

  async function disable(): Promise<void> {
    const response = await disableOperation.execute()

    if (response.status !== ApiResultStatus.Success) return

    if (user.value) user.value = { ...user.value, shareToken: null }

    isOpen.value = false

    toast.add({ title: 'Profile sharing disabled.', color: 'success' })
  }

  return {
    isOpen,
    shareUrl,
    open,
    copyLink,
    disable,
    isEnabling: enableOperation.isLoading,
    isDisabling: disableOperation.isLoading,
  }
}
