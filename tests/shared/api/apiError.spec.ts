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
  it('maps Laravel field errors to one message per field', () => {
    const parsed = parseApiError(fetchError(422, {
      errors: {
        email: ['These credentials do not match our records.'],
        password: ['The password field is required.'],
      },
    }))

    expect(parsed).toEqual({
      httpStatus: 422,
      fieldErrors: {
        email: 'These credentials do not match our records.',
        password: 'The password field is required.',
      },
    })
  })

  it('keeps only the first message when a field has several', () => {
    const parsed = parseApiError(fetchError(422, {
      errors: { email: ['Must be an email.', 'Must be unique.'] },
    }))

    expect(parsed.fieldErrors).toEqual({ email: 'Must be an email.' })
  })

  it('reports a rejection without a body as a 422 with no field errors', () => {
    expect(parseApiError(fetchError(422))).toEqual({ httpStatus: 422, fieldErrors: {} })
  })

  it('keeps the status and no field errors for any other response', () => {
    expect(parseApiError(fetchError(500, { message: 'Server Error' })))
      .toEqual({ httpStatus: 500, fieldErrors: {} })
  })

  it('reports a non-HTTP failure without a status', () => {
    expect(parseApiError(new Error('network down'))).toEqual({ httpStatus: 0, fieldErrors: {} })
  })
})
