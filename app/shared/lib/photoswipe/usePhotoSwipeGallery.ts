import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import 'photoswipe/style.css'

export function usePhotoSwipeGallery(gallery: Ref<HTMLElement | null>): void {
  let lightbox: PhotoSwipeLightbox | null = null

  onMounted(() => {
    if (!gallery.value) return

    lightbox = new PhotoSwipeLightbox({
      gallery: gallery.value,
      children: 'a[data-pswp-src]',
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
    lightbox?.destroy()
    lightbox = null
  })
}
