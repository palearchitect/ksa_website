// useSEO composable for setting dynamic, high-ranking SEO meta tags in Vue 3
import { onMounted, watchEffect } from 'vue'

export function useSEO({ title, description, keywords, image, url, type = 'website', jsonLd = null }) {
  const setMeta = () => {
    // 1. Document Title
    if (title) {
      document.title = title.includes('KSA Valuers') ? title : `${title} | KSA Valuers Nigeria`
    }

    // Helper function to update or create meta tags
    const updateMeta = (attrName, attrValue, contentValue) => {
      if (!contentValue) return
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attrName, attrValue)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', contentValue)
    }

    // 2. Standard Meta Tags
    updateMeta('name', 'description', description)
    updateMeta('name', 'keywords', keywords || 'Estate Surveyors in Nigeria, Valuers in Lagos, Property Valuation Nigeria, 25th Apartments Lekki, Real Estate Appraisal Ikoyi')
    updateMeta('name', 'robots', 'index, follow, max-image-preview:large')

    // 3. OpenGraph Meta Tags
    const fullUrl = url ? (url.startsWith('http') ? url : `https://ksavaluers.com${url}`) : window.location.href
    const fullImage = image ? (image.startsWith('http') ? image : `https://ksavaluers.com${image}`) : 'https://ksavaluers.com/images/25th-apartment/25th-apartment-1.jpg'

    updateMeta('property', 'og:title', title || 'KSA Valuers | Registered Estate Surveyors & Valuers Nigeria')
    updateMeta('property', 'og:description', description || 'NIESV & ESVARBON certified Estate Surveyors and Valuers. Property valuation, asset appraisals, feasibility studies, and luxury developments in Nigeria.')
    updateMeta('property', 'og:image', fullImage)
    updateMeta('property', 'og:url', fullUrl)
    updateMeta('property', 'og:type', type)
    updateMeta('property', 'og:site_name', 'KSA Valuers')

    // 4. Twitter Meta Tags
    updateMeta('name', 'twitter:card', 'summary_large_image')
    updateMeta('name', 'twitter:title', title || 'KSA Valuers | Registered Estate Surveyors')
    updateMeta('name', 'twitter:description', description)
    updateMeta('name', 'twitter:image', fullImage)

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)

    // 6. JSON-LD Structured Data
    if (jsonLd) {
      let ldScript = document.getElementById('dynamic-jsonld')
      if (!ldScript) {
        ldScript = document.createElement('script')
        ldScript.setAttribute('id', 'dynamic-jsonld')
        ldScript.setAttribute('type', 'application/ld+json')
        document.head.appendChild(ldScript)
      }
      ldScript.textContent = JSON.stringify(jsonLd)
    }
  }

  onMounted(setMeta)
  watchEffect(setMeta)
}
