import { useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { siteConfig } from '../config/site'
import { seoConfig, buildStructuredData } from '../config/seo'

const JSON_LD_ID = 'arvenmods-structured-data'

function upsertMeta(key, value, { property = false } = {}) {
  if (!value) return
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return
  const selector = Object.entries(extra).reduce(
    (acc, [k, v]) => `${acc}[${k}="${v}"]`,
    `link[rel="${rel}"]`
  )
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function SeoHead() {
  const { lang, t } = useLang()
  const seo = seoConfig[lang]
  const url = siteConfig.domain

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = seo.title

    upsertMeta('description', seo.description)
    upsertMeta('keywords', seo.keywords)
    upsertMeta('author', siteConfig.brandName)
    upsertMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')

    upsertMeta('og:type', 'website', { property: true })
    upsertMeta('og:url', url, { property: true })
    upsertMeta('og:site_name', siteConfig.brandName, { property: true })
    upsertMeta('og:title', seo.title, { property: true })
    upsertMeta('og:description', seo.description, { property: true })
    upsertMeta('og:image', `${url}/og-image.jpg`, { property: true })
    upsertMeta('og:image:width', '1200', { property: true })
    upsertMeta('og:image:height', '630', { property: true })
    upsertMeta('og:image:alt', seo.title, { property: true })
    upsertMeta('og:locale', seo.ogLocale, { property: true })
    upsertMeta('og:locale:alternate', lang === 'tr' ? 'en_US' : 'tr_TR', { property: true })

    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:site', '@arvenmods')
    upsertMeta('twitter:title', seo.title)
    upsertMeta('twitter:description', seo.description)
    upsertMeta('twitter:image', `${url}/og-image.jpg`)

    upsertLink('canonical', url)
    upsertLink('alternate', url, { hreflang: lang })
    upsertLink('alternate', url, { hreflang: lang === 'tr' ? 'en' : 'tr' })
    upsertLink('alternate', url, { hreflang: 'x-default' })

    const themeColor = document.documentElement.dataset.theme === 'light' ? '#fafafa' : '#060610'
    upsertMeta('theme-color', themeColor)

    const schemas = buildStructuredData({ lang, t })
    let script = document.getElementById(JSON_LD_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = JSON_LD_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(schemas)
  }, [lang, t, seo, url])

  return null
}
