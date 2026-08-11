import { ref } from '#imports'
import { parseApiError, VALIDATION_STATUS } from '../error/apiError'
import { ApiResultStatus, type ApiOperationResponse } from '../result/apiResponse'

export function useApiOperation<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
) {
  const toast = useToast()
  const isLoading = ref(false)

  async function execute(...args: TArgs): Promise<ApiOperationResponse<TResult>> {
    isLoading.value = true

    try {
      return {
        status: ApiResultStatus.Success,
        data: await handler(...args),
      }
    }
    catch (error: unknown) {
      const { httpStatus, fieldErrors } = parseApiError(error)

      if (httpStatus === VALIDATION_STATUS) {
        return {
          status: ApiResultStatus.Validation,
          errors: Object.entries(fieldErrors).map(([name, message]) => ({ name, message })),
        }
      }

      console.error('[API operation failed]', { httpStatus, error })

      toast.add({ title: 'Something went wrong.', color: 'error' })

      return { status: ApiResultStatus.Error }
    }
    finally {
      isLoading.value = false
    }
  }

  return { execute, isLoading }
}
