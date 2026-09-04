import * as yup from 'yup'

export const albumCreateSchema = yup.object({
  title: yup.string().required('Title is required').max(255),
})

export type AlbumCreateDto = yup.Asserts<typeof albumCreateSchema>
