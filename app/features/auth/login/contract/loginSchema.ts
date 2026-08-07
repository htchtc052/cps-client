import { type InferType, object, string } from 'yup'

export const loginSchema = object({
  email: string().required('Email is required').email('Enter a valid email address'),
  password: string().required('Password is required'),
})

export type LoginDto = InferType<typeof loginSchema>
