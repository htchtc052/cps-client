import * as yup from 'yup'

export const signUpSchema = yup.object({
  name: yup.string().required('Name is required').max(255),
  email: yup.string().email('Invalid email').required('Email is required').max(255),
  password: yup.string().required('Password is required').min(8, 'Use at least 8 characters'),
  password_confirmation: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms').required(),
})

export type SignUpDto = yup.Asserts<typeof signUpSchema>
