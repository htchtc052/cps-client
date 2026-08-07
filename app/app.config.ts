export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral',
    },
    fileUpload: {
      compoundVariants: [{
        layout: 'grid',
        multiple: true,
        class: {
          files: 'grid-cols-4 lg:grid-cols-6',
        },
      }],
    },
  },
})
