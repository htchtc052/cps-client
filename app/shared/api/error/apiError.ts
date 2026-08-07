import type { FormError } from '@nuxt/ui'
import { FetchError } from 'ofetch'

const VALIDATION_STATUS = 422

export type ParsedApiError = {
  isValidationError: boolean
  httpStatus: number
  validationErrors: FormError[]
}

type BackendErrors = Record<string, string[]>

function mapValidationErrors(errors: BackendErrors): FormError[] {
  return Object.entries(errors).map(([name, messages]) => ({
    name,
    message: messages[0] ?? '',
  }))
}

export function parseApiError(error: unknown): ParsedApiError {
  const isFetchError = error instanceof FetchError
  const httpStatus = isFetchError ? error.response?.status ?? 0 : 0
  const isValidationError = httpStatus === VALIDATION_STATUS

  return {
    isValidationError,
    httpStatus,
    validationErrors:
      isValidationError && isFetchError && error.data?.errors
        ? mapValidationErrors(error.data.errors)
        : [],
  }
}
