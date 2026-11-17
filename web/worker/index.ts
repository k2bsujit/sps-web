/**
 * SP Surya – Cloudflare Worker.
 * Serves the built website (web/dist) and handles the enquiry form at POST /api/lead:
 *   1. checks the form and blocks spam
 *   2. saves the lead in the admin (Sanity → "Leads")
 *   3. (optional) emails you a copy via Cloudflare Email Routing
 *
 * Settings live in Cloudflare (Workers & Pages → sps-web → Settings → Variables and Secrets):
 *   SANITY_PROJECT_ID  (variable)   SANITY_DATASET (variable, default "production")
 *   SANITY_TOKEN       (secret – Sanity API token with Editor permission)
 *   LEAD_EMAIL_TO / LEAD_EMAIL_FROM (variables, only if you enable email – see wrangler.jsonc)
 */

interface Env {
  ASSETS: {fetch: (req: Request) => Promise<Response>}
  SANITY_PROJECT_ID?: string
  SANITY_DATASET?: string
  SANITY_TOKEN?: string
  LEAD_EMAIL_TO?: string
  LEAD_EMAIL_FROM?: string
  EMAIL?: {send: (msg: unknown) => Promise<void>}
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}})

export default {
  async fetch(req: Request, env: Env, ctx: {waitUntil: (p: Promise<unknown>) => void}): Promise<Response> {
    const url = new URL(req.url)
    if (url.pathname === '/api/lead' || url.pathname === '/api/lead.php') {
      return handleLead(req, env, ctx)
    }
    return env.ASSETS.fetch(req)
  },
}

async function handleLead(req: Request, env: Env, ctx: {waitUntil: (p: Promise<unknown>) => void}): Promise<Response> {
  const wantsJson = (req.headers.get('Accept') || '').includes('application/json')
  const done = (ok: boolean, error = '', status = 200) =>
    wantsJson ? json({ok, error}, ok ? 200 : status) : Response.redirect(new URL(ok ? '/thank-you' : '/contact?error=1#enquiry', req.url).href, 303)

  if (req.method !== 'POST') return json({ok: false, error: 'Method not allowed'}, 405)

  // Only accept posts from our own site
  const origin = req.headers.get('Origin') || req.headers.get('Referer') || ''
  if (origin && new URL(origin).host !== new URL(req.url).host) return done(false, 'Bad origin', 403)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return done(false, 'Bad request', 400)
  }
  // Honeypot: real people never fill this hidden field
  if (String(form.get('company') || '')) return done(true)

  const clean = (k: string, max = 120) => String(form.get(k) || '').replace(/<[^>]*>/g, '').trim().slice(0, max)
  const name = clean('name', 80)
  const place = clean('place', 80)
  const solarFor = clean('solarFor', 60)
  const bill = clean('bill', 40)
  const message = clean('message', 1000)
  const page = clean('page', 120)
  let phone = clean('phone', 20).replace(/\D/g, '')
  if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2)
  if (!name || !place || !/^[6-9]\d{9}$/.test(phone)) return done(false, 'Please check your name, mobile number and village.', 422)

  const submittedAt = new Date().toISOString()
  const lead = {_type: 'lead', status: 'new', name, phone: `+91 ${phone}`, place, solarFor, bill, message, page, submittedAt}

  let saved = false
  if (env.SANITY_PROJECT_ID && env.SANITY_TOKEN) {
    const api = `https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2025-01-01/data/mutate/${env.SANITY_DATASET || 'production'}`
    const res = await fetch(api, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${env.SANITY_TOKEN}`},
      body: JSON.stringify({mutations: [{create: lead}]}),
    })
    saved = res.ok
    if (!res.ok) console.error('[lead] Sanity save failed', res.status, (await res.text()).slice(0, 300))
  } else {
    console.error('[lead] SANITY_PROJECT_ID / SANITY_TOKEN not set')
  }

  let mailed = false
  if (env.EMAIL && env.LEAD_EMAIL_TO && env.LEAD_EMAIL_FROM) {
    const text = [
      'New enquiry from the website',
      '',
      `Name: ${name}`,
      `Mobile: +91 ${phone}`,
      `Village/town: ${place}`,
      `Solar for: ${solarFor}`,
      `Monthly bill: ${bill}`,
      `Message: ${message}`,
      `Page: ${page}`,
      `Time (UTC): ${submittedAt}`,
      '',
      `Call: tel:+91${phone}`,
      `WhatsApp: https://wa.me/91${phone}`,
    ].join('\n')
    const send = env.EMAIL.send({
      from: {email: env.LEAD_EMAIL_FROM, name: 'SP Surya Website'},
      to: env.LEAD_EMAIL_TO,
      subject: `New solar enquiry: ${name}, ${place}`,
      text,
    })
      .then(() => true)
      .catch((e: unknown) => {
        console.error('[lead] email failed', e)
        return false
      })
    if (saved) ctx.waitUntil(send) // don't make the visitor wait for the email
    else mailed = await send
  }

  return saved || mailed ? done(true) : done(false, 'Could not save', 500)
}
