import {createClient} from '@sanity/client'
import {fallback, type SiteData} from '../data/fallback'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

export const sanityConfigured = Boolean(projectId)

export const client = sanityConfigured
  ? createClient({projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published'})
  : null

const IMG = `{..., asset->{_id, url, metadata{dimensions, lqip}}}`
const BODY = `[]{..., _type == "imageWithAlt" => ${IMG}}`
const SEO = `{..., ogImage${IMG}}`

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{..., logo${IMG}, logoOnDark${IMG}, seo${SEO}},
  "home": *[_id == "homePage"][0]{..., heroImage${IMG}, seo${SEO}},
  "subsidy": *[_id == "subsidy"][0]{..., body${BODY}, seo${SEO}},
  "services": *[_type == "service" && defined(slug.current)] | order(order asc, title asc){..., "slug": slug.current, image${IMG}, body${BODY}, seo${SEO}},
  "areas": *[_type == "area" && defined(slug.current)] | order(order asc, name asc){..., "slug": slug.current, body${BODY}, seo${SEO}},
  "projects": *[_type == "project" && defined(slug.current)] | order(completedOn desc){..., "slug": slug.current, "area": area->{name, "slug": slug.current, publishPage}, mainImage${IMG}, photos[]${IMG}, body${BODY}, seo${SEO}},
  "faqs": *[_type == "faq"] | order(order asc){question, answer, showOnHome},
  "testimonials": *[_type == "testimonial"] | order(order asc){..., photo${IMG}},
  "posts": *[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){..., "slug": slug.current, cover${IMG}, body${BODY}, seo${SEO}}
}`

const empty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)

/** Field-by-field: use the admin's value, fall back to the starter content only where the admin left it empty. */
function merge<T extends Record<string, any>>(base: T, over: Record<string, any> | null | undefined): T {
  if (!over) return base
  const out: Record<string, any> = {...base}
  for (const [k, v] of Object.entries(over)) {
    if (k.startsWith('_')) continue
    if (empty(v)) continue
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' && !v.asset ? merge(base[k], v) : v
  }
  return out as T
}

let cache: Promise<SiteData> | null = null

export function getData(): Promise<SiteData> {
  // While developing (npm run dev), fetch fresh content on every page load so admin changes show after a refresh.
  if (import.meta.env.DEV) return load()
  if (!cache) cache = load()
  return cache
}

async function load(): Promise<SiteData> {
  if (!client) {
    console.warn('[sps] Sanity is not connected (PUBLIC_SANITY_PROJECT_ID is empty) — building with starter content.')
    warnPlaceholders(fallback)
    return fallback
  }
  const d = await client.fetch(QUERY)
  // Before the admin has any content, keep the starter content so the site never goes blank.
  const hasContent = Boolean(d.settings)
  const data: SiteData = {
    settings: merge(fallback.settings, d.settings),
    home: merge(fallback.home, d.home),
    subsidy: merge(fallback.subsidy, d.subsidy),
    services: hasContent ? d.services : fallback.services,
    areas: hasContent ? d.areas : fallback.areas,
    projects: hasContent ? d.projects : fallback.projects,
    faqs: hasContent ? d.faqs : fallback.faqs,
    testimonials: hasContent ? d.testimonials : fallback.testimonials,
    posts: hasContent ? d.posts : fallback.posts,
  }
  warnPlaceholders(data)
  return data
}

function warnPlaceholders(data: unknown) {
  const found = new Set<string>()
  JSON.stringify(data, (_k, v) => {
    if (typeof v === 'string') for (const m of v.match(/\[[^\]\n]{2,90}\]/g) || []) found.add(m)
    return v
  })
  if (found.size) console.warn(`[sps] Placeholders still on the site — fill these in the admin: ${[...found].join(', ')}`)
}

/* ---------- small helpers used by pages ---------- */

export const inr = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN')

export function waLink(s: SiteData['settings'], text?: string) {
  const msg = text ?? s.whatsappMessage
  return `https://wa.me/${s.whatsapp}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
}

export const telLink = (s: SiteData['settings']) => `tel:${s.phone}`

export function fullAddress(s: SiteData['settings']) {
  return [s.streetAddress, s.locality, s.district, `${s.state} ${s.pincode}`.trim()].filter(Boolean).join(', ')
}

/** Areas that have a published page */
export const liveAreas = (d: SiteData) => d.areas.filter((a: any) => a.publishPage)
