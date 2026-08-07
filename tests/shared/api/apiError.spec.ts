import { FetchError } from 'ofetch'
import { describe, expect, it } from 'vitest'
import { parseApiError } from '../../../app/shared/api/error/apiError'

function fetchError(status: number, data?: unknown): FetchError {
  return Object.assign(new FetchError('request failed'), {
    response: { status } as Response,
    data,
  })
}

describe('parseApiError', () => {
  it('maps Laravel field errors to one form error per field', () => {
    const parsed = parseApiError(fetchError(422, {
      errors: {
        email: ['These credentials do not match our records.'],
        password: ['The password field is required.'],
      },
    }))

    expect(parsed.isValidationError).toBe(true)
    expect(parsed.validationErrors).toEqual([
      { name: 'email', message: 'These credentials do not match our records.' },
      { name: 'password', message: 'The password field is required.' },
    ])
  })

  it('keeps only the first message when a field has several', () => {
    const parsed = parseApiError(fetchError(422, {
      errors: { email: ['Must be an email.', 'Must be unique.'] },
    }))

    expect(parsed.validationErrors).toEqual([{ name: 'email', message: 'Must be an email.' }])
  })

  it('reports a rejection without a body as validation with no field errors', () => {
    const parsed = parseApiError(fetchError(422))

    expect(parsed.isValidationError).toBe(true)
    expect(parsed.validationErrors).toEqual([])
  })

  it('treats any other response as unactionable', () => {
    const parsed = parseApiError(fetchError(500, { message: 'Server Error' }))

    expect(parsed).toEqual({ isValidationError: false, httpStatus: 500, validationErrors: [] })
  })

  it('treats a non-HTTP failure as unactionable', () => {
    const parsed = parseApiError(new Error('network down'))

    expect(parsed).toEqual({ isValidationError: false, httpStatus: 0, validationErrors: [] })
  })
})
