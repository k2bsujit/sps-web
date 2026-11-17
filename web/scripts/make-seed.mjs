/**
 * Turns the starter content (src/data/fallback.ts) into a Sanity import file,
 * so the admin opens with everything already filled in.
 *   npm run make-seed   →  ../studio/seed/seed.ndjson
 * Then, in /studio:  npx sanity dataset import seed/seed.ndjson production --replace
 */
import {writeFileSync, mkdirSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
// Node 22.6+ can import .ts directly with --experimental-strip-types; keep it simple by evaluating the object literal.
const {fallback} = await import(resolve(here, '../src/data/fallback.ts'))

let n = 0
const key = () => `k${(++n).toString(36).padStart(6, '0')}`
/** Sanity needs a _key on every object inside an array */
const withKeys = (v) =>
  Array.isArray(v)
    ? v.map((x) => (x && typeof x === 'object' && !Array.isArray(x) ? {_key: key(), ...withKeys(x)} : withKeys(x)))
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withKeys(x)]))
      : v
const strip = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && !v.length)))
const slug = (s) => ({_type: 'slug', current: s})
const seo = (s) => (s ? {_type: 'seo', ...strip(s)} : undefined)

const docs = []
docs.push({_id: 'siteSettings', _type: 'siteSettings', ...withKeys(strip({...fallback.settings, seo: seo(fallback.settings.seo)}))})
const typed = (arr, t) => (arr || []).map((x) => ({_type: t, ...x}))
const h = fallback.home
docs.push({_id: 'homePage', _type: 'homePage', ...withKeys(strip({...h, stats: typed(h.stats, 'stat'), whyItems: typed(h.whyItems, 'whyItem'), processSteps: typed(h.processSteps, 'step')}))})
const sub = fallback.subsidy
docs.push({_id: 'subsidy', _type: 'subsidy', ...withKeys(strip({...sub, rows: typed(sub.rows, 'subsidyRow'), seo: seo(sub.seo)}))})

fallback.services.forEach((s, i) =>
  docs.push({_id: `service-${s.slug}`, _type: 'service', ...withKeys(strip({...s, slug: slug(s.slug), order: (i + 1) * 10, seo: seo(s.seo)}))}),
)
fallback.areas.forEach((a, i) =>
  docs.push({_id: `area-${a.slug}`, _type: 'area', ...withKeys(strip({...a, slug: slug(a.slug), order: (i + 1) * 10}))}),
)
fallback.faqs.forEach((f, i) => docs.push({_id: `faq-${i + 1}`, _type: 'faq', ...strip({...f, order: (i + 1) * 10})}))

const out = resolve(here, '../../studio/seed/seed.ndjson')
mkdirSync(dirname(out), {recursive: true})
writeFileSync(out, docs.map((d) => JSON.stringify(Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined)))).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents → ${out}`)
