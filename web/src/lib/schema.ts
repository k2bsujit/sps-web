import type {SiteData} from '../data/fallback'
import {pic} from './image'

/** Structured data so Google understands the business (name, address, hours, area, services). */
export function localBusiness(d: SiteData, site: URL) {
  const s = d.settings
  const logo = pic(s.logo, {width: 600})
  const hero = pic(d.home.heroImage, {width: 1200})
  const id = new URL('/#business', site).href
  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': id,
    name: s.businessName,
    slogan: s.tagline || undefined,
    url: new URL('/', site).href,
    telephone: s.phone,
    email: s.email || undefined,
    logo: logo?.src,
    image: hero?.src || logo?.src,
    priceRange: '₹₹',
    description: s.seo?.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.streetAddress,
      addressLocality: s.locality,
      addressRegion: s.state,
      postalCode: s.pincode,
      addressCountry: 'IN',
    },
    areaServed: (s.areasServed || []).map((name: string) => ({'@type': 'Place', name: `${name}, Odisha`})),
    openingHoursSpecification: s.openDays?.length
      ? [{'@type': 'OpeningHoursSpecification', dayOfWeek: s.openDays, opens: s.opens, closes: s.closes}]
      : undefined,
    sameAs: s.socials?.length ? s.socials : undefined,
    hasOfferCatalog: d.services.length
      ? {
          '@type': 'OfferCatalog',
          name: 'Rooftop solar services',
          itemListElement: d.services.map((sv: any) => ({
            '@type': 'Offer',
            itemOffered: {'@type': 'Service', name: sv.title, url: new URL(`/services/${sv.slug}`, site).href},
          })),
        }
      : undefined,
  }
  if (s.lat && s.lng) data.geo = {'@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng}
  if (s.mapsUrl) data.hasMap = s.mapsUrl
  return data
}

export function breadcrumbs(items: {name: string; url: string}[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({'@type': 'ListItem', position: i + 1, name: it.name, item: new URL(it.url, site).href})),
  }
}

export function faqPage(faqs: {question: string; answer: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({'@type': 'Question', name: f.question, acceptedAnswer: {'@type': 'Answer', text: f.answer}})),
  }
}

export function service(sv: any, d: SiteData, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: sv.title,
    description: sv.summary,
    serviceType: 'Rooftop solar installation',
    url: new URL(`/services/${sv.slug}`, site).href,
    provider: {'@id': new URL('/#business', site).href},
    areaServed: (d.settings.areasServed || []).map((name: string) => ({'@type': 'Place', name: `${name}, Odisha`})),
  }
}

export function article(p: any, d: SiteData, site: URL) {
  const img = pic(p.cover, {width: 1200})
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.excerpt,
    datePublished: p.publishedAt,
    dateModified: p._updatedAt || p.publishedAt,
    image: img?.src,
    mainEntityOfPage: new URL(`/blog/${p.slug}`, site).href,
    author: {'@type': 'Organization', name: d.settings.businessName},
    publisher: {'@id': new URL('/#business', site).href},
  }
}
