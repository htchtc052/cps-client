import * as yup from 'yup'

export const albumRenameSchema = yup.object({
  title: yup.string().required('Title is required').max(255),
})

export type AlbumRenameDto = yup.Asserts<typeof albumRenameSchema>
