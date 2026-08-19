import * as yup from 'yup'

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
})

export const resetPasswordSchema = yup.object({
  password: yup.string().required('Password is required').min(8, 'Use at least 8 characters'),
  password_confirmation: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

export type ForgotPasswordDto = yup.Asserts<typeof forgotPasswordSchema>
export type ResetPasswordDto = yup.Asserts<typeof resetPasswordSchema>
