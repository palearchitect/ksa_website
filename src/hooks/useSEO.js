// useSEO composable for setting meta tags in Vue 3
import { onMounted, watchEffect } from 'vue'

export function useSEO({ title, description, image, url }) {
  const setMeta = () => {
    if (title) document.title = title
    if (description) {
      let descTag = document.querySelector('meta[name="description"]')
      if (!descTag) {
        descTag = document.createElement('meta')
        descTag.setAttribute('name', 'description')
        document.head.appendChild(descTag)
      }
      descTag.setAttribute('content', description)
    }
    if (image) {
      let imgTag = document.querySelector('meta[property="og:image"]')
      if (!imgTag) {
        imgTag = document.createElement('meta')
        imgTag.setAttribute('property', 'og:image')
        document.head.appendChild(imgTag)
      }
      imgTag.setAttribute('content', image)
    }
    if (url) {
      let urlTag = document.querySelector('meta[property="og:url"]')
      if (!urlTag) {
        urlTag = document.createElement('meta')
        urlTag.setAttribute('property', 'og:url')
        document.head.appendChild(urlTag)
      }
      urlTag.setAttribute('content', url)
    }
  }
  onMounted(setMeta)
  watchEffect(setMeta)
}
