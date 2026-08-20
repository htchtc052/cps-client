export type ShareFormat = 'link' | 'image' | 'bbcode' | 'markdown'

export type ShareUrls = {
  page: string
  image: string
}

export const shareFormatLabels: Record<ShareFormat, string> = {
  link: 'Link',
  image: 'Image URL',
  bbcode: 'BBCode',
  markdown: 'Markdown',
}

export function formatShare(format: ShareFormat, urls: ShareUrls, name: string): string {
  switch (format) {
    case 'link':
      return urls.page
    case 'image':
      return urls.image
    case 'bbcode':
      return `[url=${urls.page}][img]${urls.image}[/img][/url]`
    case 'markdown':
      return `[![${name}](${urls.image})](${urls.page})`
  }
}
