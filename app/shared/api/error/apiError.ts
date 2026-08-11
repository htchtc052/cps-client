import { FetchError } from 'ofetch'

export const VALIDATION_STATUS = 422

export type ApiErrorDetails = {
  httpStatus: number
  fieldErrors: Readonly<Record<string, string>>
}

type BackendErrors = Record<string, string[]>

function mapFieldErrors(errors: BackendErrors): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errors).map(([name, messages]) => [name, messages[0] ?? '']),
  )
}

export function parseApiError(error: unknown): ApiErrorDetails {
  const isFetchError = error instanceof FetchError
  const httpStatus = isFetchError ? error.response?.status ?? 0 : 0
  const backendErrors: BackendErrors | undefined
    = httpStatus === VALIDATION_STATUS && isFetchError ? error.data?.errors : undefined

  return {
    httpStatus,
    fieldErrors: backendErrors ? mapFieldErrors(backendErrors) : {},
  }
}
