import type PhotoSwipeLightbox from 'photoswipe/lightbox'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import 'photoswipe/style.css'

export function usePhotoSwipeGallery(gallery: Ref<HTMLElement | null>): void {
  let lightbox: PhotoSwipeLightbox | null = null
  let mounted = false

  onMounted(async () => {
    mounted = true

    const { default: Lightbox } = await import('photoswipe/lightbox')

    if (!mounted || !gallery.value) return

    lightbox = new Lightbox({
      gallery: gallery.value,
      children: 'a[data-pswp-width]',
      pswpModule: () => import('photoswipe'),
      loop: false,
      wheelToZoom: true,
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 1,
      maxZoomLevel: 1,
      preload: [0, 1],
    })

    lightbox.init()
  })

  onBeforeUnmount(() => {
    mounted = false
    lightbox?.destroy()
    lightbox = null
  })
}
