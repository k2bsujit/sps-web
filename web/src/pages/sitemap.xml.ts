import type {APIRoute} from 'astro'
import {getData, liveAreas} from '../lib/data'

/** Google sitemap — lists every public page, built fresh on each publish. */
export const GET: APIRoute = async ({site}) => {
  const d = await getData()
  const day = (s?: string) => (s ? s.slice(0, 10) : undefined)
  const latest = (...xs: (string | undefined)[]) => xs.filter(Boolean).sort().pop()

  const urls: {loc: string; lastmod?: string}[] = [
    {loc: '/', lastmod: day(latest((d.home as any)._updatedAt, (d.settings as any)._updatedAt))},
    {loc: '/pm-surya-ghar-subsidy-odisha', lastmod: day((d.subsidy as any)._updatedAt)},
    {loc: '/services'},
    ...d.services.map((s: any) => ({loc: `/services/${s.slug}`, lastmod: day(s._updatedAt)})),
    ...liveAreas(d).map((a: any) => ({loc: `/solar-installation/${a.slug}`, lastmod: day(a._updatedAt)})),
    {loc: '/projects'},
    ...d.projects.map((p: any) => ({loc: `/projects/${p.slug}`, lastmod: day(p._updatedAt)})),
    ...(d.posts.length ? [{loc: '/blog'}] : []),
    ...d.posts.filter((p: any) => !p.seo?.noindex).map((p: any) => ({loc: `/blog/${p.slug}`, lastmod: day(p._updatedAt || p.publishedAt)})),
    {loc: '/faq'},
    {loc: '/contact'},
    {loc: '/privacy-policy'},
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${new URL(u.loc, site).href}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`
  return new Response(xml, {headers: {'Content-Type': 'application/xml; charset=utf-8'}})
}
