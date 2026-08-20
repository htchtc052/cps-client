import * as yup from 'yup'

export const photoDetailsSchema = yup.object({
  name: yup.string().required('Name is required').max(255),
  description: yup.string().max(500, 'Keep it under 500 characters').default(''),
})

export type PhotoDetailsDto = yup.Asserts<typeof photoDetailsSchema>
