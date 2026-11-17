# SP Surya website

Fast, SEO-ready website (Astro) with an admin panel (Sanity), hosted free on **Cloudflare**. The domain stays registered at Hostinger.

```
sps-web/
├── web/      ← the website (Astro) + worker/index.ts (enquiry form) + wrangler.jsonc (Cloudflare settings)
├── studio/   ← the admin panel (Sanity Studio) → hosted free at https://spsurya.sanity.studio
└── .github/workflows/deploy.yml  ← auto build + publish to Cloudflare when you publish in the admin
```

**How it works:** you edit content in the admin → press **Publish** → GitHub rebuilds the site (~1–2 min) → publishes it to Cloudflare. Enquiry-form leads go to **Admin → Leads** (and optionally to your email).

---

## One-time setup

You need: [Node.js 22+](https://nodejs.org), free accounts on [GitHub](https://github.com), [Sanity](https://www.sanity.io) and [Cloudflare](https://dash.cloudflare.com/sign-up), and your Hostinger hPanel login (only for the domain).

### 1. Create the Sanity project (admin database)
1. Go to <https://www.sanity.io/manage> → **Create new project** → name it *SP Surya* → dataset **production** (public).
2. Copy the **Project ID** (looks like `ab12cd34`).
3. In `studio/`, copy `.env.example` to `.env` and paste the Project ID.
4. In `web/`, copy `.env.example` to `.env`, paste the same Project ID, and set `PUBLIC_SITE_URL` to your domain, e.g. `https://www.spsurya.in`.

### 2. Start the admin and load the starter content
```bash
cd studio
npm install
npx sanity login
npx sanity dataset import seed/seed.ndjson production --replace   # loads all current text
npm run deploy                                                    # publishes the admin at https://spsurya.sanity.studio
```
If `spsurya` is taken, change `studioHost` in `studio/sanity.cli.ts`.

Then open the admin and:
- **Business details & SEO → Logo**: upload your logo (and a white version for the dark footer).
- **Home page → Top banner**: upload the hero photo.
- **Services**: add a photo to each service and replace every `[₹ PRICE]`.
- **Projects & gallery**: add real installs (photo, village, kW). Tick *Show on home page* for the best 4–5.
- Fill in every text still in `[square brackets]`. The build log lists any that are left.

### 3. Try the website on your computer
```bash
cd web
npm install
npm run dev        # open http://localhost:4321
```

### 4. Put the code on GitHub
Create a **private** repository (e.g. `sps-web`), then from the `sps-web` folder:
```bash
git init && git add . && git commit -m "SP Surya website"
git branch -M main
git remote add origin https://github.com/YOUR-USER/sps-web.git
git push -u origin main
```

### 5. Move the domain's DNS to Cloudflare (free; domain stays at Hostinger)
1. Cloudflare dashboard → **Add a domain** → type your domain → choose the **Free** plan.
2. Cloudflare copies your existing DNS records. Check that any **MX / email** records are there if you use Hostinger email.
3. Cloudflare shows **2 nameservers** (like `ana.ns.cloudflare.com`). In **Hostinger hPanel → Domains → your domain → DNS / Nameservers → Change nameservers**, replace Hostinger's with Cloudflare's two.
4. Wait for the "Your domain is active" email from Cloudflare (usually 15 min–a few hours).

### 6. Connect GitHub → Cloudflare (automatic publishing)
1. **Cloudflare API token:** dashboard → profile icon → **My Profile → API Tokens → Create Token** → template **Edit Cloudflare Workers** → Account: yours, Zone: your domain → Create → copy it.
2. **Account ID:** dashboard home → your account → **⋯ → Copy account ID**.
3. In GitHub → your repo → **Settings → Secrets and variables → Actions**, add:

| Type | Name | Value |
|---|---|---|
| Secret | `CLOUDFLARE_API_TOKEN` | the token from step 1 |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | the account ID |
| Variable | `PUBLIC_SITE_URL` | `https://www.your-domain.in` |
| Variable | `PUBLIC_SANITY_PROJECT_ID` | your Sanity Project ID |

4. GitHub → **Actions → Build & deploy to Cloudflare → Run workflow**. When it's green, the site is live at `https://sps-web.<your-name>.workers.dev`.
5. **Form settings:** Cloudflare → **Workers & Pages → sps-web → Settings → Variables and Secrets**:
   - Variable `SANITY_PROJECT_ID` = your Sanity Project ID
   - Secret `SANITY_TOKEN` = Sanity → manage → **API → Tokens → Add API token** (permission **Editor**)
6. **Your domain:** same page → **Domains & Routes → Add → Custom domain** → add `www.your-domain.in` **and** `your-domain.in`.
7. **One address only:** Cloudflare → your domain → **Rules → Redirect Rules → Templates → "Redirect from root to WWW"** → Deploy. Also **SSL/TLS → Edge Certificates → Always Use HTTPS: On**.
8. Test: submit the form on the live site → it should appear in **Admin → Leads**.

**Optional: email each lead to you.** Only do this if you don't use Hostinger email on this domain, because it changes your MX records. Cloudflare → your domain → **Email → Email Routing** → enable → verify your email. Then remove the `//` in the `send_email` part of `web/wrangler.jsonc`, push, and add the variables `LEAD_EMAIL_TO` (your email) and `LEAD_EMAIL_FROM` (e.g. `no-reply@your-domain.in`).

**Your Hostinger WordPress plan** is no longer needed for the website. Keep it only if you use its email. Don't let the **domain** registration expire.

### 7. Publish in the admin → site updates automatically
1. GitHub → your profile → **Settings → Developer settings → Fine-grained tokens → Generate**. Repository access: only `sps-web`. Permissions: **Contents: Read and write**. Copy the token.
2. Sanity → manage → **API → Webhooks → Create webhook**:
   - URL: `https://api.github.com/repos/YOUR-USER/sps-web/dispatches`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: `_type != "lead"` (so new leads don't trigger a rebuild)
   - Projection: `{"event_type": "sanity-publish"}`
   - HTTP method: `POST`
   - HTTP headers: `Authorization` = `Bearer YOUR_GITHUB_TOKEN` and `Accept` = `application/vnd.github+json`
3. Change any text in the admin → Publish → check GitHub **Actions**. The live site updates about 2 minutes later.

### 8. Google (most important for local SEO)
1. **Google Search Console:** add your domain → choose the *HTML tag* method → paste only the code into **Admin → Business details → Default SEO → Search Console verification code** → Publish → Verify. Then submit `https://www.your-domain/sitemap.xml`.
2. **Google Business Profile:** claim or verify *SP Surya*. Use the exact same name, address and phone as the website, put the website link on it, add photos, and ask every happy customer for a review.
3. In the admin, add your Google Maps link and map latitude/longitude, plus your Facebook/Instagram/Business Profile links under **Social profiles**.

---

## Everyday use
| I want to… | Where in the admin |
|---|---|
| See new enquiries | **Leads → New** (change status to Contacted / Quoted / Won) |
| Change phone, address, hours | **Business details & SEO** |
| Update subsidy amounts | **Subsidy rates & guide** (the calculator updates everywhere) |
| Add a finished installation | **Projects & gallery → +** |
| Write an article | **Blog posts → +** (the "Solar guide" menu appears after the first post) |
| Add a town page (e.g. Soro) | **Areas** → open the town → write 2–3 real paragraphs → switch on *Publish a page* |
| Change a page's Google title | the **SEO** section on that page |

## Speed & SEO already built in
- Plain HTML pages with about 2.5 KB of JavaScript (only for the calculator and form). The home page is about 100 KB in total.
- Self-hosted fonts (Latin only, plus a 1 KB ₹ file). Images are resized and converted to WebP/AVIF by Sanity's CDN, and load lazily.
- Served from Cloudflare's network (fast across India). Clean URLs, HTTPS, Brotli, long cache headers (`web/public/_headers`).
- Per-page title, description, canonical and share image. Auto `sitemap.xml` + `robots.txt`.
- Structured data for Google: LocalBusiness (address, hours, areas, services), Service, FAQ, Breadcrumbs, BlogPosting.
- Separate pages for subsidy, each service, each project, each area and each article. These are what rank in Google, not a single long page.

## Commands
| Folder | Command | What it does |
|---|---|---|
| `web` | `npm run dev` | preview the site locally |
| `web` | `npm run build` | build to `web/dist` |
| `web` | `npm run cf-dev` | test the built site + form on a local Cloudflare runtime |
| `web` | `npm run make-seed` | rebuild `studio/seed/seed.ndjson` from `src/data/fallback.ts` |
| `studio` | `npm run dev` | admin locally at http://localhost:3333 |
| `studio` | `npm run deploy` | publish the admin to *.sanity.studio |
