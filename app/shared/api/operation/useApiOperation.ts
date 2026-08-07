import { ref } from '#imports'
import { parseApiError } from '../error/apiError'
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
      const parsed = parseApiError(error)

      if (parsed.isValidationError) {
        return {
          status: ApiResultStatus.Validation,
          errors: parsed.validationErrors,
        }
      }

      console.error('[API operation failed]', { httpStatus: parsed.httpStatus, error })

      toast.add({ title: 'Something went wrong.', color: 'error' })

      return { status: ApiResultStatus.Error }
    }
    finally {
      isLoading.value = false
    }
  }

  return { execute, isLoading }
}
